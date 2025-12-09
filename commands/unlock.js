const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Kanalın kilidini aç')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  
  async execute(interaction) {
    try {
      const channel = interaction.channel;
      
      await channel.permissionOverwrites.edit(interaction.guild.id, {
        SendMessages: null
      });

      await interaction.reply('🔓 Kanal kilidi açıldı!');
    } catch (error) {
      await interaction.reply({ content: `❌ Hata: ${error.message}`, ephemeral: true });
    }
  },
};
