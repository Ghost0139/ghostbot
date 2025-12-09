const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../database');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kullanıcıyı sunucudan at')
    .addStringOption(option =>
      option.setName('dcid')
        .setDescription('Atılacak kullanıcının ID\'si')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('sebep')
        .setDescription('Atma sebebi')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  
  async execute(interaction) {
    const targetId = interaction.options.getString('dcid');
    const reason = interaction.options.getString('sebep');

    try {
      const member = await interaction.guild.members.fetch(targetId);
      await member.kick(reason);

      // Log kaydet
      await db.addModerationLog('kick', interaction.user.id, targetId, reason);
      await db.addPunishment(targetId, 'kick', interaction.user.id, reason);

      const embed = new EmbedBuilder()
        .setColor('#ff9900')
        .setTitle('👢 Kullanıcı Atıldı')
        .addFields(
          { name: 'Atılan', value: `${member.user.tag} (${targetId})`, inline: true },
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
