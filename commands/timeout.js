const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('../database');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Kullanıcıya zaman aşımı ver')
    .addStringOption(option =>
      option.setName('dcid')
        .setDescription('Timeout verilecek kullanıcının ID\'si')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('sebep')
        .setDescription('Timeout sebebi')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('sure')
        .setDescription('Süre (dakika cinsinden)')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  
  async execute(interaction) {
    const targetId = interaction.options.getString('dcid');
    const reason = interaction.options.getString('sebep');
    const duration = interaction.options.getInteger('sure');

    try {
      const member = await interaction.guild.members.fetch(targetId);
      const durationMs = duration * 60 * 1000; // dakikayı milisaniyeye çevir
      
      await member.timeout(durationMs, reason);

      // Log kaydet
      await db.addModerationLog('timeout', interaction.user.id, targetId, reason, duration);
      await db.addPunishment(targetId, 'timeout', interaction.user.id, reason, Date.now() + durationMs);

      const embed = new EmbedBuilder()
        .setColor('#ffff00')
        .setTitle('⏰ Timeout Verildi')
        .addFields(
          { name: 'Kullanıcı', value: `${member.user.tag} (${targetId})`, inline: true },
          { name: 'Moderatör', value: `${interaction.user.tag}`, inline: true },
          { name: 'Süre', value: `${duration} dakika`, inline: true },
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
