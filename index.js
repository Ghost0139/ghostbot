const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, Events, EmbedBuilder } = require('discord.js');
const config = require('./config.json');
const db = require('./database');

// Voice codec ayarları
try {
  require('sodium-native');
  console.log('🎵 Sodium codec yüklendi!');
} catch {
  try {
    require('@discordjs/opus');
    console.log('🎵 Opus codec yüklendi!');
  } catch {
    try {
      require('opusscript');
      console.log('🎵 Opusscript codec yüklendi!');
    } catch {
      console.warn('⚠️  Voice codec bulunamadı!');
    }
  }
}

// Replit için keep-alive servisi
require('./keep-alive');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Komutları yükle
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  }
}

// Bot hazır olduğunda
client.once(Events.ClientReady, () => {
  console.log(`✅ Bot aktif! ${client.user.tag} olarak giriş yapıldı.`);
  client.user.setActivity('GhostBots | /help', { type: 'WATCHING' });
});

// Slash komutlarını dinle
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    const errorMessage = { content: '❌ Komutu çalıştırırken bir hata oluştu!', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

// Ticket button handler
client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isButton()) {
    if (interaction.customId === 'close_ticket') {
      const ticket = await db.getTicket(interaction.channel.id);
      
      if (!ticket) {
        return await interaction.reply({ content: '❌ Bu kanal bir ticket değil!', ephemeral: true });
      }

      try {
        await db.closeTicket(interaction.channel.id);
        await interaction.reply('🔒 Ticket 5 saniye içinde silinecek...');
        
        setTimeout(async () => {
          await interaction.channel.delete();
        }, 5000);
      } catch (error) {
        await interaction.reply({ content: `❌ Hata: ${error.message}`, ephemeral: true });
      }
    }
    else if (interaction.customId === 'ticket_claim') {
      const ticket = await db.getTicket(interaction.channel.id);
      
      if (!ticket) {
        return await interaction.reply({ content: '❌ Bu kanal bir ticket değil!', ephemeral: true });
      }

      if (ticket.claimed_by) {
        return await interaction.reply({ content: '❌ Bu ticket zaten sahiplenilmiş!', ephemeral: true });
      }

      try {
        await db.claimTicket(interaction.channel.id, interaction.user.id);
        
        // Orijinal mesajı güncelle
        const originalMessage = interaction.message;
        const embed = originalMessage.embeds[0];
        
        const updatedEmbed = EmbedBuilder.from(embed)
          .setDescription(
            embed.description.replace(
              '🔴 `-` Yetkili Bekliyor',
              `🟢 `-` ${interaction.user.tag} sahiplendi`
            )
          );

        await originalMessage.edit({ embeds: [updatedEmbed] });
        await interaction.reply({ content: `✅ Ticket'a sahiplendiniz!`, ephemeral: true });
      } catch (error) {
        await interaction.reply({ content: `❌ Hata: ${error.message}`, ephemeral: true });
      }
    }
  }
  
  // String Select Menu handler (kategori seçimi)
  if (interaction.isStringSelectMenu()) {
    if (interaction.customId === 'ticket_category') {
      const ticketCommand = require('./commands/ticket');
      await ticketCommand.handleCategorySelect(interaction);
    }
  }
});

// Mesaj istatistiklerini takip et + XP sistemi
client.on(Events.MessageCreate, async message => {
  if (message.author.bot) return;
  if (!message.guild) return;
  
  // Stat güncelle
  await db.updateMessageCount(message.author.id);
  
  // XP kazan
  const xpResult = await db.addXP(message.author.id);
  
  // Seviye atladıysa bildirim gönder
  if (xpResult && xpResult.leveledUp) {
    const levelUpEmbed = EmbedBuilder.from({
      color: 0xFFD700,
      title: '🎉 Seviye Atladın!',
      description: `Tebrikler ${message.author}! **Seviye ${xpResult.newLevel}** oldun!`,
      thumbnail: { url: message.author.displayAvatarURL({ dynamic: true }) },
      fields: [
        { name: '🎯 Yeni Seviye', value: `**${xpResult.newLevel}**`, inline: true },
        { name: '⭐ Bir sonraki seviye', value: `**${xpResult.xpNeeded}** XP`, inline: true }
      ],
      timestamp: new Date()
    });
    
    await message.reply({ embeds: [levelUpEmbed] });
    
    // Seviye ödül rolü kontrolü
    const levelRoles = await db.getLevelRoles();
    if (levelRoles[xpResult.newLevel]) {
      try {
        const role = message.guild.roles.cache.get(levelRoles[xpResult.newLevel]);
        if (role) {
          const member = await message.guild.members.fetch(message.author.id);
          await member.roles.add(role);
          await message.channel.send(`🎁 ${message.author}, seviye ödülü olarak ${role} rolünü kazandın!`);
        }
      } catch (error) {
        console.error('Ödül rolü verilirken hata:', error);
      }
    }
  }
});

// Sunucuya katılma/ayrılma istatistikleri
client.on(Events.GuildMemberAdd, async member => {
  await db.updateJoinCount(member.id);
});

client.on(Events.GuildMemberRemove, async member => {
  await db.updateLeaveCount(member.id);
});

// Ses kanalı istatistikleri
client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  // Kullanıcı ses kanalına katıldı
  if (!oldState.channelId && newState.channelId) {
    await db.startVoiceSession(newState.id, newState.channelId);
  }
  // Kullanıcı ses kanalından ayrıldı
  else if (oldState.channelId && !newState.channelId) {
    await db.endVoiceSession(oldState.id);
  }
  // Kullanıcı kanal değiştirdi
  else if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
    await db.endVoiceSession(oldState.id);
    await db.startVoiceSession(newState.id, newState.channelId);
  }
});

// Hata yakalama
client.on(Events.Error, error => {
  console.error('Discord client hatası:', error);
});

process.on('unhandledRejection', error => {
  console.error('Yakalanmamış promise reddi:', error);
});

// Botu başlat
client.login(config.token);
