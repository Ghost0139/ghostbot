const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../database');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Kullanıcıyı sunucudan yasakla')
    .addStringOption(option =>
      option.setName('dcid')
        .setDescription('Yasaklanacak kullanıcının ID\'si')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('sebep')
        .setDescription('Yasaklama sebebi')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  
  async execute(interaction) {
    const targetId = interaction.options.getString('dcid');
    const reason = interaction.options.getString('sebep');

    try {
      const user = await interaction.client.users.fetch(targetId);
      await interaction.guild.members.ban(targetId, { reason: reason });

      // Log kaydet
      await db.addModerationLog('ban', interaction.user.id, targetId, reason);
      await db.addPunishment(targetId, 'ban', interaction.user.id, reason);

      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('🔨 Kullanıcı Yasaklandı')
        .addFields(
          { name: 'Yasaklanan', value: `${user.tag} (${targetId})`, inline: true },
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
