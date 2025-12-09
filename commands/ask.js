const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ask')
    .setDescription('Sihirli 8 top ile soru sor')
    .addStringOption(option =>
      option.setName('soru')
        .setDescription('Sorunuz')
        .setRequired(true)),
  
  async execute(interaction) {
    const question = interaction.options.getString('soru');
    const answers = [
      'Kesinlikle evet!',
      'Evet!',
      'Muhtemelen evet.',
      'Şu an için evet.',
      'Belki.',
      'Kararsızım.',
      'Daha sonra tekrar sor.',
      'Şu an söyleyemem.',
      'Pek sanmıyorum.',
      'Hayır.',
      'Kesinlikle hayır!',
      'İmkansız!',
      'Şansını zorlama.',
      'Umutlu ol.',
      'Her şey mümkün!'
    ];

    const answer = answers[Math.floor(Math.random() * answers.length)];
    await interaction.reply(`🎱 **Soru:** ${question}\n**Cevap:** ${answer}`);
  },
};
