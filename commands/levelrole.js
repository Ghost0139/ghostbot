const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('levelrole')
    .setDescription('Seviye ödül rolü yönetimi')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Seviye için ödül rolü ekle')
        .addIntegerOption(option =>
          option.setName('seviye')
            .setDescription('Seviye')
            .setRequired(true)
            .setMinValue(1))
        .addRoleOption(option =>
          option.setName('rol')
            .setDescription('Verilecek rol')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Seviye ödül rolünü kaldır')
        .addIntegerOption(option =>
          option.setName('seviye')
            .setDescription('Seviye')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('list')
        .setDescription('Tüm seviye ödül rollerini listele'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'add') {
      const level = interaction.options.getInteger('seviye');
      const role = interaction.options.getRole('rol');

      await db.setLevelRole(level, role.id);
      await interaction.reply(`✅ Seviye **${level}** için ${role} rolü ödül olarak ayarlandı!`);
    }
    else if (subcommand === 'remove') {
      const level = interaction.options.getInteger('seviye');
      await db.removeLevelRole(level);
      await interaction.reply(`✅ Seviye **${level}** ödül rolü kaldırıldı!`);
    }
    else if (subcommand === 'list') {
      const levelRoles = await db.getLevelRoles();
      
      if (Object.keys(levelRoles).length === 0) {
        return await interaction.reply('📋 Henüz seviye ödül rolü ayarlanmamış!');
      }

      let list = '**🎁 Seviye Ödül Rolleri:**\n\n';
      for (const [level, roleId] of Object.entries(levelRoles).sort((a, b) => a[0] - b[0])) {
        list += `🏆 Seviye **${level}** → <@&${roleId}>\n`;
      }

      await interaction.reply(list);
    }
  },
};
