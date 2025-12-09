const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const config = require('./config.json');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command) {
    commands.push(command.data.toJSON());
  }
}

const rest = new REST().setToken(config.token);

(async () => {
  try {
    console.log(`🔄 ${commands.length} slash komutu kaydediliyor...`);

    // Sunucuya özel komutlar (hızlı test için)
    const data = await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands },
    );

    console.log(`✅ ${data.length} slash komutu başarıyla kaydedildi!`);
    
    console.log('\n📝 Kayıtlı komutlar:');
    commands.forEach(cmd => {
      console.log(`  • /${cmd.name} - ${cmd.description}`);
    });

  } catch (error) {
    console.error('❌ Komutlar kaydedilirken hata:', error);
  }
})();
