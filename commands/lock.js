const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const lockedChannels = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Kanalı kilitle')
    .addSubcommand(subcommand =>
      subcommand
        .setName('full')
        .setDescription('Kanalı tamamen kilitle'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('timed')
        .setDescription('Kanalı belirli bir süre için kilitle')
        .addIntegerOption(option =>
          option.setName('sure')
            .setDescription('Kilit süresi')
            .setRequired(true))
        .addStringOption(option =>
          option.setName('zaman')
            .setDescription('Zaman birimi')
            .setRequired(true)
            .addChoices(
              { name: 'Saniye', value: 'sn' },
              { name: 'Dakika', value: 'dk' },
              { name: 'Saat', value: 'saat' }
            )))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const channel = interaction.channel;

    try {
      if (subcommand === 'full') {
        await channel.permissionOverwrites.edit(interaction.guild.id, {
          SendMessages: false
        });

        lockedChannels.set(channel.id, 'permanent');
        await interaction.reply('🔒 Kanal tamamen kilitlendi!');
      } 
      else if (subcommand === 'timed') {
        const duration = interaction.options.getInteger('sure');
        const timeUnit = interaction.options.getString('zaman');

        let milliseconds = 0;
        let timeText = '';

        switch (timeUnit) {
          case 'sn':
            milliseconds = duration * 1000;
            timeText = `${duration} saniye`;
            break;
          case 'dk':
            milliseconds = duration * 60 * 1000;
            timeText = `${duration} dakika`;
            break;
          case 'saat':
            milliseconds = duration * 60 * 60 * 1000;
            timeText = `${duration} saat`;
            break;
        }

        await channel.permissionOverwrites.edit(interaction.guild.id, {
          SendMessages: false
        });

        lockedChannels.set(channel.id, Date.now() + milliseconds);
        await interaction.reply(`🔒 Kanal ${timeText} boyunca kilitlendi!`);

        // Süre dolunca kilidi aç
        setTimeout(async () => {
          if (lockedChannels.has(channel.id) && lockedChannels.get(channel.id) !== 'permanent') {
            await channel.permissionOverwrites.edit(interaction.guild.id, {
              SendMessages: null
            });
            lockedChannels.delete(channel.id);
            await channel.send('🔓 Kanal kilidi otomatik olarak açıldı!');
          }
        }, milliseconds);
      }
    } catch (error) {
      await interaction.reply({ content: `❌ Hata: ${error.message}`, ephemeral: true });
    }
  },
};

// Unlock komutu için ayrı bir export
module.exports.unlock = async (channel) => {
  if (lockedChannels.has(channel.id)) {
    await channel.permissionOverwrites.edit(channel.guild.id, {
      SendMessages: null
    });
    lockedChannels.delete(channel.id);
    return true;
  }
  return false;
};
