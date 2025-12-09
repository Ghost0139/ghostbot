const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('zar')
    .setDescription('Zar at'),
  
  async execute(interaction) {
    const result = Math.floor(Math.random() * 6) + 1;
    await interaction.reply(`🎲 Zar **${result}** geldi!`);
  },
};
