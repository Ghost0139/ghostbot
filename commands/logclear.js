const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('logclear')
    .setDescription('Tüm moderasyon loglarını temizle')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  async execute(interaction) {
    try {
      await db.clearModerationLogs();
      await interaction.reply({ content: '✅ Tüm moderasyon logları başarıyla temizlendi!', ephemeral: true });
    } catch (error) {
      await interaction.reply({ content: `❌ Hata: ${error.message}`, ephemeral: true });
    }
  },
};
