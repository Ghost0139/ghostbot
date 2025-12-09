const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../database');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stat')
    .setDescription('İstatistikleri görüntüle')
    .addSubcommand(subcommand =>
      subcommand
        .setName('me')
        .setDescription('Kendi istatistiklerini görüntüle'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('dc')
        .setDescription('Sunucu istatistiklerini görüntüle (Sadece yönetici)')),
  
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'me') {
      // Kullanıcının kendi istatistikleri
      const stats = await db.getUserStats(interaction.user.id);
      
      const hours = Math.floor(stats.voice_time / 3600);
      const minutes = Math.floor((stats.voice_time % 3600) / 60);

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`📊 ${interaction.user.username} - İstatistikler`)
        .setThumbnail(interaction.user.displayAvatarURL())
        .addFields(
          { name: '💬 Mesaj Sayısı', value: `${stats.messages_sent}`, inline: true },
          { name: '🎤 Ses Süresi', value: `${hours}s ${minutes}dk`, inline: true },
          { name: '📥 Giriş', value: `${stats.joins}`, inline: true },
          { name: '📤 Çıkış', value: `${stats.leaves}`, inline: true }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } 
    else if (subcommand === 'dc') {
      // Sadece yöneticiler görebilir
      const member = await interaction.guild.members.fetch(interaction.user.id);
      if (!member.roles.cache.has(config.adminRoleId)) {
        return await interaction.reply({ 
          content: '❌ Bu komutu kullanmak için yönetici rolüne sahip olmalısın!', 
          ephemeral: true 
        });
      }

      const allStats = await db.getAllStats();
      
      if (allStats.length === 0) {
        return await interaction.reply({ 
          content: '📊 Henüz hiç istatistik kaydı yok!', 
          ephemeral: true 
        });
      }

      let description = '**En Aktif Kullanıcılar**\n\n';
      
      for (let i = 0; i < Math.min(10, allStats.length); i++) {
        const stat = allStats[i];
        try {
          const user = await interaction.client.users.fetch(stat.user_id);
          const hours = Math.floor(stat.voice_time / 3600);
          const minutes = Math.floor((stat.voice_time % 3600) / 60);
          
          description += `**${i + 1}.** ${user.tag}\n`;
          description += `   💬 Mesaj: ${stat.messages_sent} | 🎤 Ses: ${hours}s ${minutes}dk\n`;
          description += `   📥 Giriş: ${stat.joins} | 📤 Çıkış: ${stat.leaves}\n\n`;
        } catch (error) {
          continue;
        }
      }

      const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('📊 Sunucu İstatistikleri')
        .setDescription(description)
        .setFooter({ text: `Toplam ${allStats.length} kullanıcı` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
