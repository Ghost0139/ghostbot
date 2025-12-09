const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Seviye kartını görüntüle')
    .addUserOption(option =>
      option.setName('kullanici')
        .setDescription('Kartı gösterilecek kullanıcı')
        .setRequired(false)),
  
  async execute(interaction) {
    const targetUser = interaction.options.getUser('kullanici') || interaction.user;
    
    if (targetUser.bot) {
      return await interaction.reply({ content: '❌ Botların seviyesi yok!', ephemeral: true });
    }

    const levelData = await db.getUserLevel(targetUser.id);
    const leaderboard = await db.getLeaderboard(100);
    const rank = leaderboard.findIndex(u => u.user_id === targetUser.id) + 1;

    const xpNeeded = levelData.level * 100;
    const progress = Math.floor((levelData.xp / xpNeeded) * 100);

    const embed = new EmbedBuilder()
      .setColor('#7289DA')
      .setTitle(`📊 ${targetUser.username} - Seviye Kartı`)
      .setThumbnail(targetUser.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '🏆 Seviye', value: `\`${levelData.level}\``, inline: true },
        { name: '⭐ XP', value: `\`${levelData.xp}/${xpNeeded}\``, inline: true },
        { name: '📈 Sıralama', value: rank ? `\`#${rank}\`` : '`-`', inline: true },
        { name: '💫 Toplam XP', value: `\`${levelData.total_xp}\``, inline: true },
        { name: '📊 İlerleme', value: `\`${progress}%\` ${'█'.repeat(Math.floor(progress/10))}${'░'.repeat(10-Math.floor(progress/10))}`, inline: false }
      )
      .setFooter({ text: `Seviye atlamak için ${xpNeeded - levelData.xp} XP daha gerekiyor!` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
