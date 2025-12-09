const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../database');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unkick')
    .setDescription('Kullanıcının kick kaydını sil')
    .addStringOption(option =>
      option.setName('dcid')
        .setDescription('Kick kaydı silinecek kullanıcının ID\'si')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('sebep')
        .setDescription('Silme sebebi')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  
  async execute(interaction) {
    const targetId = interaction.options.getString('dcid');
    const reason = interaction.options.getString('sebep');

    try {
      // Log kaydet
      await db.addModerationLog('unkick', interaction.user.id, targetId, reason);
      await db.removePunishment(targetId);

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('✅ Kick Kaydı Silindi')
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
