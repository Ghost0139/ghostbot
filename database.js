const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');

// Veritabanı yükle veya oluştur
let db = {
  user_stats: {},
  moderation_logs: [],
  punishments: {},
  tickets: {},
  voice_sessions: {},
  levels: {},
  level_roles: {}
};

if (fs.existsSync(DB_FILE)) {
  try {
    db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (error) {
    console.error('Veritabanı yüklenirken hata:', error);
  }
}

// Veritabanını kaydet
const saveDB = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Veritabanı kaydedilirken hata:', error);
  }
};

module.exports = {
  getUserStats: async (userId) => {
    return db.user_stats[userId] || {
      user_id: userId,
      messages_sent: 0,
      voice_time: 0,
      joins: 0,
      leaves: 0
    };
  },

  updateMessageCount: async (userId) => {
    if (!db.user_stats[userId]) {
      db.user_stats[userId] = { messages_sent: 0, voice_time: 0, joins: 0, leaves: 0 };
    }
    db.user_stats[userId].messages_sent++;
    db.user_stats[userId].last_updated = Date.now();
    saveDB();
  },

  startVoiceSession: async (userId, channelId) => {
    db.voice_sessions[userId] = { join_time: Date.now(), channel_id: channelId };
    saveDB();
  },

  endVoiceSession: async (userId) => {
    const session = db.voice_sessions[userId];
    
    if (session) {
      const duration = Math.floor((Date.now() - session.join_time) / 1000);
      if (!db.user_stats[userId]) {
        db.user_stats[userId] = { messages_sent: 0, voice_time: 0, joins: 0, leaves: 0 };
      }
      db.user_stats[userId].voice_time = (db.user_stats[userId].voice_time || 0) + duration;
      db.user_stats[userId].last_updated = Date.now();
      delete db.voice_sessions[userId];
      saveDB();
    }
  },

  updateJoinCount: async (userId) => {
    if (!db.user_stats[userId]) {
      db.user_stats[userId] = { messages_sent: 0, voice_time: 0, joins: 0, leaves: 0 };
    }
    db.user_stats[userId].joins++;
    db.user_stats[userId].last_updated = Date.now();
    saveDB();
  },

  updateLeaveCount: async (userId) => {
    if (!db.user_stats[userId]) {
      db.user_stats[userId] = { messages_sent: 0, voice_time: 0, joins: 0, leaves: 0 };
    }
    db.user_stats[userId].leaves++;
    db.user_stats[userId].last_updated = Date.now();
    saveDB();
  },

  getAllStats: async () => {
    return Object.entries(db.user_stats)
      .map(([userId, stats]) => ({ user_id: userId, ...stats }))
      .sort((a, b) => (b.messages_sent || 0) - (a.messages_sent || 0));
  },

  // Moderasyon log fonksiyonları
  addModerationLog: async (type, moderatorId, targetId, reason, duration = null) => {
    db.moderation_logs.push({
      id: db.moderation_logs.length + 1,
      type,
      moderator_id: moderatorId,
      target_id: targetId,
      reason,
      timestamp: Date.now(),
      duration
    });
    saveDB();
  },

  getModerationLogs: async () => {
    return db.moderation_logs;
  },

  clearModerationLogs: async () => {
    db.moderation_logs = [];
    saveDB();
  },

  // Ceza fonksiyonları
  addPunishment: async (userId, type, moderatorId, reason, expiresAt = null) => {
    db.punishments[userId] = {
      type,
      moderator_id: moderatorId,
      reason,
      timestamp: Date.now(),
      expires_at: expiresAt
    };
    saveDB();
  },

  removePunishment: async (userId) => {
    delete db.punishments[userId];
    saveDB();
  },

  getPunishment: async (userId) => {
    return db.punishments[userId];
  },

  // Ticket fonksiyonları
  createTicket: async (channelId, userId, category = 'genel') => {
    db.tickets[channelId] = {
      channel_id: channelId,
      user_id: userId,
      category: category,
      created_at: Date.now(),
      status: 'open',
      claimed_by: null
    };
    saveDB();
  },

  closeTicket: async (channelId) => {
    if (db.tickets[channelId]) {
      db.tickets[channelId].closed_at = Date.now();
      db.tickets[channelId].status = 'closed';
      saveDB();
    }
  },

  getTicket: async (channelId) => {
    return db.tickets[channelId];
  },

  getUserActiveTicket: async (userId) => {
    const tickets = Object.values(db.tickets);
    return tickets.find(t => t.user_id === userId && t.status === 'open');
  },

  claimTicket: async (channelId, moderatorId) => {
    if (db.tickets[channelId]) {
      db.tickets[channelId].claimed_by = moderatorId;
      db.tickets[channelId].status = 'claimed';
      saveDB();
    }
  },

  // Leveling fonksiyonları
  getUserLevel: async (userId) => {
    if (!db.levels) db.levels = {};
    return db.levels[userId] || {
      user_id: userId,
      xp: 0,
      level: 1,
      total_xp: 0,
      last_message: 0
    };
  },

  addXP: async (userId, xpAmount = null) => {
    const now = Date.now();
    const cooldown = 60000; // 1 dakika cooldown

    if (!db.levels) db.levels = {};
    if (!db.levels[userId]) {
      db.levels[userId] = { xp: 0, level: 1, total_xp: 0, last_message: 0 };
    }

    // Cooldown kontrolü
    if (now - db.levels[userId].last_message < cooldown) {
      return null;
    }

    // Rastgele XP (15-25 arası)
    const earnedXP = xpAmount || Math.floor(Math.random() * 11) + 15;
    db.levels[userId].xp += earnedXP;
    db.levels[userId].total_xp += earnedXP;
    db.levels[userId].last_message = now;

    // Seviye atlama kontrolü
    const xpNeeded = db.levels[userId].level * 100;
    let leveledUp = false;
    let newLevel = db.levels[userId].level;

    if (db.levels[userId].xp >= xpNeeded) {
      db.levels[userId].level++;
      db.levels[userId].xp -= xpNeeded;
      leveledUp = true;
      newLevel = db.levels[userId].level;
    }

    saveDB();

    return {
      leveledUp,
      newLevel,
      earnedXP,
      currentXP: db.levels[userId].xp,
      xpNeeded: newLevel * 100
    };
  },

  getLeaderboard: async (limit = 10) => {
    if (!db.levels) db.levels = {};
    return Object.entries(db.levels)
      .map(([userId, data]) => ({ user_id: userId, ...data }))
      .sort((a, b) => b.total_xp - a.total_xp)
      .slice(0, limit);
  },

  setLevelRole: async (level, roleId) => {
    if (!db.level_roles) db.level_roles = {};
    db.level_roles[level] = roleId;
    saveDB();
  },

  getLevelRoles: async () => {
    if (!db.level_roles) db.level_roles = {};
    return db.level_roles;
  },

  removeLevelRole: async (level) => {
    if (!db.level_roles) db.level_roles = {};
    delete db.level_roles[level];
    saveDB();
  }
};
