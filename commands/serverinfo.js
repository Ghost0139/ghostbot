const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Sunucu bilgilerini göster'),
  
  async execute(interaction) {
    const { guild } = interaction;
    
    await interaction.reply({
      embeds: [{
        color: 0x0099ff,
        title: `📊 ${guild.name} - Sunucu Bilgileri`,
        thumbnail: { url: guild.iconURL({ dynamic: true }) },
        fields: [
          { name: '👑 Kurucu', value: `<@${guild.ownerId}>`, inline: true },
          { name: '👥 Üye Sayısı', value: `${guild.memberCount}`, inline: true },
          { name: '📅 Oluşturulma', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
          { name: '💬 Kanal Sayısı', value: `${guild.channels.cache.size}`, inline: true },
          { name: '🎭 Rol Sayısı', value: `${guild.roles.cache.size}`, inline: true },
          { name: '😀 Emoji Sayısı', value: `${guild.emojis.cache.size}`, inline: true }
        ],
        timestamp: new Date()
      }]
    });
  },
};
