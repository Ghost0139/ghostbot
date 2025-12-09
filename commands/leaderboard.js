const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('En yüksek seviyeleri göster')
    .addIntegerOption(option =>
      option.setName('sayfa')
        .setDescription('Sayfa numarası')
        .setRequired(false)
        .setMinValue(1)),
  
  async execute(interaction) {
    const page = interaction.options.getInteger('sayfa') || 1;
    const perPage = 10;
    const start = (page - 1) * perPage;

    const leaderboard = await db.getLeaderboard(100);
    const pageData = leaderboard.slice(start, start + perPage);

    if (pageData.length === 0) {
      return await interaction.reply({ content: '❌ Bu sayfada kimse yok!', ephemeral: true });
    }

    let description = '';
    for (let i = 0; i < pageData.length; i++) {
      const userData = pageData[i];
      const position = start + i + 1;
      
      try {
        const user = await interaction.client.users.fetch(userData.user_id);
        const medal = position === 1 ? '🥇' : position === 2 ? '🥈' : position === 3 ? '🥉' : '🏅';
        
        description += `${medal} **#${position}** - ${user.tag}\n`;
        description += `   🏆 Seviye: **${userData.level}** | ⭐ XP: **${userData.total_xp}**\n\n`;
      } catch (error) {
        description += `${position}. *(Kullanıcı bulunamadı)*\n\n`;
      }
    }

    const totalPages = Math.ceil(leaderboard.length / perPage);

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🏆 Seviye Sıralaması')
      .setDescription(description || 'Henüz kimse yok!')
      .setFooter({ text: `Sayfa ${page}/${totalPages} • Toplam ${leaderboard.length} kullanıcı` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
