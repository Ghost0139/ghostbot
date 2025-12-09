const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../database');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Kullanıcının yasağını kaldır')
    .addStringOption(option =>
      option.setName('dcid')
        .setDescription('Yasağı kaldırılacak kullanıcının ID\'si')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('sebep')
        .setDescription('Yasak kaldırma sebebi')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  
  async execute(interaction) {
    const targetId = interaction.options.getString('dcid');
    const reason = interaction.options.getString('sebep');

    try {
      await interaction.guild.members.unban(targetId, reason);

      // Log kaydet
      await db.addModerationLog('unban', interaction.user.id, targetId, reason);
      await db.removePunishment(targetId);

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('✅ Yasak Kaldırıldı')
        .addFields(
          { name: 'Kullanıcı ID', value: targetId, inline: true },
          { name: 'Moderatör', value: `${interaction.user.tag}`, inline: true },
          { name: 'Sebep', value: reason }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });

      // Log kanalına gönder
      const logChannel = interaction.guild.channels.cache.get(config.logChannelId);
      if (logChannel) {
        await logChannel.send({ embeds: [embed] });
      }
    } catch (error) {
      await interaction.reply({ content: `❌ Hata: ${error.message}`, ephemeral: true });
    }
  },
};
