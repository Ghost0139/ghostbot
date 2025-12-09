const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nuke')
    .setDescription('Kanalı sıfırla (tüm mesajları sil ve kanalı yeniden oluştur)')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  
  async execute(interaction) {
    try {
      const channel = interaction.channel;
      const position = channel.position;
      const newChannel = await channel.clone();
      
      await newChannel.setPosition(position);
      await channel.delete();
      
      await newChannel.send('💥 Kanal sıfırlandı!');
    } catch (error) {
      await interaction.reply({ content: `❌ Hata: ${error.message}`, ephemeral: true });
    }
  },
};
