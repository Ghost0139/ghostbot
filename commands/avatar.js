const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Kullanıcı avatarını göster')
    .addUserOption(option =>
      option.setName('kullanici')
        .setDescription('Avatar gösterilecek kullanıcı')
        .setRequired(false)),
  
  async execute(interaction) {
    const user = interaction.options.getUser('kullanici') || interaction.user;
    const avatarURL = user.displayAvatarURL({ dynamic: true, size: 512 });
    
    await interaction.reply({
      content: `🖼️ **${user.username}** kullanıcısının avatarı:`,
      files: [avatarURL]
    });
  },
};
