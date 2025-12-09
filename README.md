# 🤖 GhostBots - Discord Moderasyon ve İstatistik Botu

Gelişmiş moderasyon araçları, detaylı istatistik takibi ve eğlence komutlarına sahip tam özellikli Discord botu.

## ✨ Özellikler

### 📊 İstatistik Sistemi
- Mesaj sayısı takibi
- Ses kanalı süre takibi  
- Giriş/çıkış istatistikleri
- Kişisel ve sunucu geneli istatistikler

### 🛡️ Moderasyon Komutları
- `/ban` - Kullanıcı yasaklama
- `/unban` - Yasağı kaldırma
- `/kick` - Kullanıcı atma
- `/unkick` - Kick kaydını silme
- `/timeout` - Zaman aşımı verme (dakika cinsinden)
- `/untimeout` - Timeout kaldırma

### 📝 Log Sistemi
- Tüm moderasyon işlemleri loglanır
- `/logclear` - Tüm logları temizleme

### 🔒 Kanal Yönetimi
- `/nuke` - Kanalı sıfırlama
- `/lock full` - Kanalı tamamen kilitleme
- `/lock timed` - Belirli süre için kilitleme (sn/dk/saat)
- `/unlock` - Kanal kilidini açma

### 🎫 Ticket Sistemi
- `/ticket create` - Yeni ticket oluşturma
- `/ticket close` - Ticket'ı kapatma
- `/ticket add` - Kullanıcı ekleme
- `/ticket remove` - Kullanıcı çıkarma

### 🎮 Eğlence Komutları
- `/yazi-tura` - Yazı tura atma
- `/zar` - Zar atma
- `/ask` - Sihirli 8 top
- `/avatar` - Avatar gösterme
- `/serverinfo` - Sunucu bilgileri

## 🚀 Kurulum

### 1. Gereksinimleri Yükle
```bash
npm install
```

### 2. Config Dosyasını Düzenle
`config.json` dosyasını açın ve bilgilerinizi girin:

```json
{
  "token": "BOT_TOKEN_BURAYA",
  "clientId": "BOT_CLIENT_ID_BURAYA",
  "guildId": "SUNUCU_ID_BURAYA",
  "adminRoleId": "ADMIN_ROL_ID_BURAYA",
  "logChannelId": "LOG_KANAL_ID_BURAYA"
}
```

### 3. Slash Komutlarını Kaydet
```bash
node deploy-commands.js
```

### 4. Botu Başlat
```bash
npm start
```

## 🔑 Bot Tokenı Alma

1. [Discord Developer Portal](https://discord.com/developers/applications)'a gidin
2. "New Application" butonuna tıklayın
3. Sol menüden "Bot" sekmesine gidin
4. "Reset Token" butonuna tıklayarak token'ınızı alın
5. **Privileged Gateway Intents** bölümünden şunları aktifleştirin:
   - Server Members Intent
   - Message Content Intent

## 🔗 Botu Sunucuya Ekleme

1. Developer Portal'da "OAuth2" > "URL Generator" sekmesine gidin
2. **Scopes** bölümünden:
   - `bot`
   - `applications.commands`
3. **Bot Permissions** bölümünden gerekli yetkileri seçin:
   - Administrator (veya gerekli yetkileri tek tek seçin)
4. Oluşan URL'yi kopyalayıp tarayıcıda açın

## 📋 Gereksinimler

- Node.js 16.9.0 veya üzeri
- Discord.js v14
- SQLite3 (better-sqlite3)

## 🗂️ Proje Yapısı

```
# 🤖 GhostBots - Profesyonel Discord Botu

> **Moderasyon • Müzik • Leveling • Ticket Sistemi** - Hepsi bir arada!

[![Discord.js](https://img.shields.io/badge/discord.js-v14-blue.svg)](https://discord.js.org)
[![Node.js](https://img.shields.io/badge/node.js-v18+-green.svg)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-orange.svg)](LICENSE)

## ✨ Özellikler

### 🛡️ Moderasyon Sistemi
- **Ban/Kick/Timeout** komutları (sebep + süre)
- **Unban/Unkick/Untimeout** ile geri alma
- Otomatik **log sistemi** (tüm moderasyon işlemleri kaydedilir)
- **Kanal kilitleme** (tam & zamanlı)
- **Kanal sıfırlama** (/nuke)
- `/logclear` ile logları temizleme

### 🎵 Müzik Botu
- **YouTube** müzik çalma (şarkı adı veya link)
- **Kuyruk sistemi** (sıralama, atlama)
- `/play`, `/skip`, `/stop`, `/pause` komutları
- **Ses seviyesi** ayarlama (0-100)
- Otomatik **embed mesajlar** (şimdi çalıyor)
- Kanal boşaldığında **otomatik ayrılma**

### 📊 Leveling Sistemi
- Mesaj attıkça **XP kazan**
- **Seviye atlama** bildirimleri
- `/rank` - Kendi seviyeni gör
- `/leaderboard` - En yüksek seviyeler
- **Seviye ödül rolleri** (otomatik rol verme)
- XP cooldown sistemi (spam önleme)

### 🎫 Ticket Sistemi
- **5 kategori** (Destek, Oyun İçi, AntiCheat, Yetkili Başvuru, Diğer)
- Dropdown menü ile **kategori seçimi**
- **Profesyonel embed** tasarımı
- Moderatör **claim** butonu
- Kullanıcı başına **1 aktif ticket**
- Ticket kapatma sistemi

### 📈 İstatistik Sistemi
- `/stat me` - Kendi istatistiklerin
- `/stat dc` - Sunucu istatistikleri (admin only)
- Mesaj, ses, giriş/çıkış takibi
- Otomatik kayıt

### 🎲 Eğlence Komutları
- `/avatar` - Profil fotoğrafı göster
- `/serverinfo` - Sunucu bilgileri
- `/yazi-tura` - Yazı tura at
- `/zar` - Zar at (1-6)
- `/ask` - Sihirli 8-ball

## 🚀 Kurulum (1 TIK!)

### Windows Otomatik Kurulum
```bash
setup.bat
```
Kurulum scripti **otomatik olarak**:
- ✅ Node.js kontrolü yapar
- ✅ Tüm paketleri yükler
- ✅ Config dosyası oluşturur
- ✅ Bot token'ını sorar
- ✅ Komutları Discord'a kaydeder
- ✅ PM2'yi kurar (opsiyonel)
- ✅ Botu başlatır

### Manuel Kurulum
```bash
# 1. Paketleri yükle
npm install

# 2. config.json oluştur
cp config.example.json config.json
# Bot token, client ID, guild ID'yi gir

# 3. Komutları kaydet
node deploy-commands.js

# 4. Botu başlat
npm start
```

## ⚙️ Gereksinimler

- **Node.js** v18.0.0 veya üzeri
- **Discord Bot Token** ([Discord Developer Portal](https://discord.com/developers/applications))
- **Intents** (Discord Developer Portal'da aktif edin):
  - ✅ Server Members Intent
  - ✅ Message Content Intent
  - ✅ Presence Intent

## 📋 Tüm Komutlar

### Moderasyon
```
/ban @user sebep          - Kullanıcıyı yasakla
/unban userid             - Yasağı kaldır
/kick @user sebep         - Kullanıcıyı at
/unkick @user             - Kick kaydını sil
/timeout @user sebep 60   - 60 dakika timeout
/untimeout @user          - Timeout'u kaldır
/lock full/timed 30       - Kanalı kilitle
/unlock                   - Kilidi aç
/nuke                     - Kanalı sıfırla
/logclear                 - Logları temizle
```

### Müzik
```
/play [şarkı adı]        - Müzik çal
/queue                   - Kuyruğu göster
/skip                    - Şarkıyı atla
/stop                    - Durdur ve kuyruğu temizle
/pause                   - Duraklat/devam ettir
/volume 50               - Ses %50 yap
```

### Leveling
```
/rank                    - Seviyeni gör
/rank @user              - Başkasının seviyesini gör
/leaderboard             - Sıralamayı göster
/levelrole add 10 @rol   - Seviye 10'da rol ver
/levelrole list          - Ödül rollerini listele
/levelrole remove 10     - Ödül rolünü kaldır
```

### Ticket
```
/ticket setup #kanal     - Ticket panelini kur
/ticket close            - Ticketi kapat
```

### İstatistik
```
/stat me                 - Kendi statların
/stat dc                 - Sunucu istatistikleri
```

### Eğlence
```
/avatar @user            - Avatar göster
/serverinfo              - Sunucu bilgileri
/yazi-tura               - Yazı tura
/zar                     - Zar at
/ask [soru]              - Sihirli 8-ball
```

## 🔧 7/24 Çalışma (PM2)

```bash
# PM2 ile başlat
pm2 start index.js --name ghostbot

# Logları göster
pm2 logs ghostbot

# Durdur
pm2 stop ghostbot

# Yeniden başlat
pm2 restart ghostbot

# Bilgisayar açıldığında otomatik başlat
pm2 startup
pm2 save
```

## 📁 Dosya Yapısı

```
GhostBots/
├── commands/              # Tüm komutlar
│   ├── ban.js
│   ├── play.js
│   ├── rank.js
│   ├── ticket.js
│   └── ...
├── database.js            # JSON database
├── music.js               # Müzik sistemi
├── index.js               # Ana bot dosyası
├── deploy-commands.js     # Komut kaydetme
├── setup.bat              # Otomatik kurulum
├── config.json            # Bot ayarları
└── package.json           # Bağımlılıklar
```

## 🎯 Nasıl Satılır?

### Satış Önerileri
1. **"Tek tıkla kurulum"** özelliğini vurgula (`setup.bat`)
2. **5 in 1** bot olduğunu belirt (Moderasyon + Müzik + Level + Ticket + Stats)
3. **Müşteriye özel kurulum** hizmeti sun
4. **7/24 destek** ver
5. **Güncellemeler** dahil

### Fiyatlandırma Önerisi
- **Sadece Bot**: 50-100 TL
- **Bot + Kurulum**: 100-150 TL
- **Bot + Kurulum + 7/24 Hosting**: 150-250 TL
- **Aylık Hosting**: 30-50 TL

### Satış Metni Örneği
```
🤖 GhostBots - Profesyonel Discord Botu 🚀

✨ 5 in 1 Bot:
✅ Moderasyon (ban, kick, timeout, log sistemi)
✅ Müzik Botu (YouTube müzik)
✅ Leveling Sistemi (rank, leaderboard)
✅ Ticket Sistemi (5 kategori, dropdown)
✅ İstatistik Sistemi (detaylı raporlar)

🎁 Özellikler:
• Tek tıkla kurulum (setup.bat)
• 26 farklı komut
• Profesyonel embed tasarımlar
• JSON database (kolay yedekleme)
• 7/24 çalışma desteği (PM2)

💰 Fiyat: [FİYAT] TL
📦 Teslim: Anında
🔧 Kurulum: Ücretsiz
💬 Destek: 7/24

İletişim: [DİSCORD/TELEGRAM]
```

## 🛡️ Lisans

MIT License - Satış için kullanabilirsiniz!

## 📞 Destek

Sorun bildirmek için:
- Discord: [Sunucu linki]
- GitHub Issues

---

**Made with ❤️ by GhostBots Team**
├── commands/          # Komut dosyaları
│   ├── ban.js
│   ├── unban.js
│   ├── kick.js
│   ├── timeout.js
│   ├── stat.js
│   ├── ticket.js
│   └── ...
├── database.js        # Veritabanı işlemleri
├── index.js          # Ana bot dosyası
├── deploy-commands.js # Komut kayıt scripti
├── config.json       # Ayarlar
└── package.json
```

## 💾 Veritabanı

Bot, SQLite veritabanı kullanır ve otomatik olarak şu tabloları oluşturur:
- `user_stats` - Kullanıcı istatistikleri
- `moderation_logs` - Moderasyon logları
- `punishments` - Aktif cezalar
- `tickets` - Ticket bilgileri
- `voice_sessions` - Ses kanalı oturumları

## ⚙️ Önemli Notlar

- `/stat dc` komutu sadece `adminRoleId` rolüne sahip kullanıcılar tarafından kullanılabilir
- `/stat me` komutu herkes tarafından kullanılabilir, sadece kendi statını gösterir
- Log sistemi config'te belirtilen kanala moderasyon işlemlerini gönderir
- Tüm istatistikler otomatik olarak veritabanına kaydedilir

## 🛠️ Geliştirme

Yeni komut eklemek için:
1. `commands/` klasörüne yeni `.js` dosyası oluşturun
2. Komut şablonunu kullanın
3. `node deploy-commands.js` ile komutları güncelleyin
4. Botu yeniden başlatın

## 📝 Lisans

MIT License

## 🤝 Destek

Sorularınız için issue açabilir veya pull request gönderebilirsiniz!
