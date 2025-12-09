const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const db = require('../database');

// Ticket kategorileri
const TICKET_CATEGORIES = {
  'destek': {
    emoji: '🛠️',
    name: 'Destek, Bug & Teknik Sorunlar',
    description: 'Oyun Dışı Sorunlar için açınız',
    color: 0x5865F2
  },
  'oyun-sorun': {
    emoji: '🎮',
    name: 'Oyun içi Sorunlar & Rol Hataları',
    description: 'Oyun içi Sorunlar için açınız',
    color: 0x57F287
  },
  'anticheat': {
    emoji: '🛡️',
    name: 'AntiCheat',
    description: 'AntiCheat ile ilgili konular için açınız',
    color: 0xFEE75C
  },
  'yetkili-basvuru': {
    emoji: '👮',
    name: 'Yetkili Başvuru',
    description: 'Yetkili Başvuru ile ilgili konular için açınız',
    color: 0xEB459E
  },
  'diger': {
    emoji: '🎯',
    name: 'Diğer Kategoriler',
    description: 'Gebebiniz Eğer Burada Yoksa, Bu Kategoride Ticket Açın',
    color: 0x99AAB5
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Ticket sistemi yönetimi')
    .addSubcommand(subcommand =>
      subcommand
        .setName('setup')
        .setDescription('Ticket panelini kur')
        .addChannelOption(option =>
          option.setName('kanal')
            .setDescription('Ticket panelinin gönderileceği kanal')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('close')
        .setDescription('Ticketi kapat'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Ticketa kullanici ekle')
        .addUserOption(option =>
          option.setName('kullanici')
            .setDescription('Eklenecek kullanıcı')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Tickettan kullanici cikar')
        .addUserOption(option =>
          option.setName('kullanici')
            .setDescription('Çıkarılacak kullanıcı')
            .setRequired(true)))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'setup') {
      const channel = interaction.options.getChannel('kanal');
      
      // Hemen yanıt ver
      await interaction.deferReply({ ephemeral: true });
      
      try {
        const embed = new EmbedBuilder()
          .setColor('#5865F2')
          .setTitle('🎫 Destek Sistemi')
          .setDescription(
            '**✨ Destek Sistemi Hakkında:**\n' +
            'Aşağıdaki seçeneklerden uygun olan seçerek\n' +
            'hemen bir ticket oluşturabilirsiniz.\n\n' +
            '**🔗 Sunucu Bilgisi:**\n' +
            'Sunucumuzun kurallarını okumayı unutmayın.\n\n' +
            '**🛠️ Destek, Bug & Teknik Sorunlar**\n' +
            'Oyun Dışı Sorunlar için açınız.\n\n' +
            '**🎮 Oyun içi Sorunlar & Rol Hataları**\n' +
            'Oyun içi Sorunlar için açınız.\n\n' +
            '**🛡️ AntiCheat**\n' +
            'AntiCheat ile ilgili konular için açınız.\n\n' +
            '**👮 Yetkili Başvuru**\n' +
            'Yetkili Başvuru ile ilgili konular için açınız.\n\n' +
            '**🎯 Diğer Kategoriler**\n' +
            'Gebebiniz Eğer Burada Yoksa, Bu Kategoride Ticket Açın.'
          )
          .setFooter({ text: 'Ticket Açmak İçin Kategori Seçiniz.' });

        const selectMenu = new StringSelectMenuBuilder()
          .setCustomId('ticket_category')
          .setPlaceholder('Ticket Açmak İçin Kategori Seçiniz.')
          .addOptions(
            new StringSelectMenuOptionBuilder()
              .setLabel('Destek, Bug & Teknik Sorunlar')
              .setDescription('Oyun Dışı Sorunlar için açınız')
              .setValue('destek')
              .setEmoji('🛠️'),
            new StringSelectMenuOptionBuilder()
              .setLabel('Oyun içi Sorunlar & Rol Hataları')
              .setDescription('Oyun içi Sorunlar için açınız')
              .setValue('oyun-sorun')
              .setEmoji('🎮'),
            new StringSelectMenuOptionBuilder()
              .setLabel('AntiCheat')
              .setDescription('AntiCheat ile ilgili konular için açınız')
              .setValue('anticheat')
              .setEmoji('🛡️'),
            new StringSelectMenuOptionBuilder()
              .setLabel('Yetkili Başvuru')
              .setDescription('Yetkili Başvuru ile ilgili konular için açınız')
              .setValue('yetkili-basvuru')
              .setEmoji('👮'),
            new StringSelectMenuOptionBuilder()
              .setLabel('Diğer Kategoriler')
              .setDescription('Gebebiniz Eğer Burada Yoksa, Bu Kategoride Ticket Açın')
              .setValue('diger')
              .setEmoji('🎯')
          );

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await channel.send({ embeds: [embed], components: [row] });
        await interaction.editReply({ content: '✅ Ticket paneli başarıyla kuruldu!' });
      } catch (error) {
        await interaction.editReply({ content: `❌ Hata: ${error.message}` });
      }
    }
    else if (subcommand === 'close') {
      const ticket = await db.getTicket(interaction.channel.id);
      
      if (!ticket) {
        return await interaction.reply({ content: '❌ Bu kanal bir ticket değil!', ephemeral: true });
      }

      try {
        db.closeTicket(interaction.channel.id);
        await interaction.reply('🔒 Ticket 5 saniye içinde silinecek...');
        
        setTimeout(async () => {
          await interaction.channel.delete();
        }, 5000);
      } catch (error) {
        await interaction.reply({ content: `❌ Hata: ${error.message}`, ephemeral: true });
      }
    }
    else if (subcommand === 'add') {
      const user = interaction.options.getUser('kullanici');
      
      try {
        await interaction.channel.permissionOverwrites.create(user, {
          ViewChannel: true,
          SendMessages: true,
          ReadMessageHistory: true
        });

        await interaction.reply(`✅ ${user} ticket'a eklendi!`);
      } catch (error) {
        await interaction.reply({ content: `❌ Hata: ${error.message}`, ephemeral: true });
      }
    }
    else if (subcommand === 'remove') {
      const user = interaction.options.getUser('kullanici');
      
      try {
        await interaction.channel.permissionOverwrites.delete(user);
        await interaction.reply(`✅ ${user} ticket'tan çıkarıldı!`);
      } catch (error) {
        await interaction.reply({ content: `❌ Hata: ${error.message}`, ephemeral: true });
      }
    }
  },
};

// Ticket kategori seçimi
module.exports.handleCategorySelect = async (interaction) => {
  const category = interaction.values[0];
  const categoryData = TICKET_CATEGORIES[category];
  
  // Kullanıcının aktif ticketı var mı kontrol et
  const existingTicket = await db.getUserActiveTicket(interaction.user.id);
  if (existingTicket) {
    return await interaction.reply({ 
      content: `❌ Zaten aktif bir ticketınız var: <#${existingTicket.channel_id}>`, 
      ephemeral: true 
    });
  }

  try {
    await interaction.deferReply({ ephemeral: true });

    const ticketChannel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      type: ChannelType.GuildText,
      topic: `${categoryData.name} - ${interaction.user.tag}`,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionFlagsBits.ViewChannel],
        },
        {
          id: interaction.user.id,
          allow: [
            PermissionFlagsBits.ViewChannel, 
            PermissionFlagsBits.SendMessages, 
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.AttachFiles
          ],
        },
      ],
    });

    await db.createTicket(ticketChannel.id, interaction.user.id, category);

    const embed = new EmbedBuilder()
      .setColor(categoryData.color)
      .setTitle(`${categoryData.emoji} ${categoryData.name} Kategorili Destek!`)
      .setDescription(
        `${interaction.user} kişisi **41 saniye önce** tarihinde destek talebi oluşturdu.\n\n` +
        `Oluşturulan destek talebinin bilgilerini aşağıda belirtim;\n\n` +
        `**Oluşturan Kullanıcı:**\n\`\`\`${interaction.user.tag}\`\`\`\n\n` +
        `**Kategori:**\n\`\`\`${categoryData.name}\`\`\`\n\n` +
        `**Durum**\n🔴 \`-\` Yetkili Bekliyor`
      )
      .setThumbnail(interaction.user.displayAvatarURL())
      .setFooter({ text: 'Kateshi Bot\'s | Ticket Sistemi.' })
      .setTimestamp();

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('ticket_claim')
          .setLabel('Yetkili - Sahiplen')
          .setEmoji('🎫')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('close_ticket')
          .setLabel('Yetkili - Kapat')
          .setEmoji('🔒')
          .setStyle(ButtonStyle.Danger)
      );

    await ticketChannel.send({ 
      content: `${interaction.user}`, 
      embeds: [embed], 
      components: [row] 
    });
    
    await interaction.editReply({ 
      content: `✅ Ticket oluşturuldu: ${ticketChannel}` 
    });
  } catch (error) {
    console.error(error);
    await interaction.editReply({ 
      content: `❌ Hata: ${error.message}` 
    });
  }
};
