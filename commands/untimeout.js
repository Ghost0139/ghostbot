const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../database');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Kullanıcının timeout\'unu kaldır')
    .addStringOption(option =>
      option.setName('dcid')
        .setDescription('Timeout kaldırılacak kullanıcının ID\'si')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('sebep')
        .setDescription('Timeout kaldırma sebebi')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  
  async execute(interaction) {
    const targetId = interaction.options.getString('dcid');
    const reason = interaction.options.getString('sebep');

    try {
      const member = await interaction.guild.members.fetch(targetId);
      await member.timeout(null, reason);

      // Log kaydet
      await db.addModerationLog('untimeout', interaction.user.id, targetId, reason);
      await db.removePunishment(targetId);

      const embed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('✅ Timeout Kaldırıldı')
        .addFields(
          { name: 'Kullanıcı', value: `${member.user.tag} (${targetId})`, inline: true },
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
