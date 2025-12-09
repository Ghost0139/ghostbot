@echo off
chcp 65001 >nul
color 0A
title GhostBots - Otomatik Kurulum

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║          🤖 GhostBots Otomatik Kurulum v1.0            ║
echo ║     Profesyonel Discord Moderasyon ve Müzik Botu        ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

:: Node.js kontrolü
echo [1/6] Node.js kontrol ediliyor...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js bulunamadı!
    echo.
    echo 📥 Node.js'i indirin: https://nodejs.org
    echo    En az v18.0.0 sürümü gereklidir.
    echo.
    pause
    exit /b 1
)
echo ✅ Node.js kurulu!
echo.

:: NPM paketlerini kur
echo [2/6] Bağımlılıklar kuruluyor...
echo    Bu işlem birkaç dakika sürebilir...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Paketler yüklenemedi!
    pause
    exit /b 1
)
echo ✅ Tüm paketler kuruldu!
echo.

:: Config.json oluştur
echo [3/6] Yapılandırma dosyası oluşturuluyor...
if not exist config.json (
    echo {>config.json
    echo   "token": "BOT_TOKEN_BURAYA",>>config.json
    echo   "clientId": "BOT_CLIENT_ID_BURAYA",>>config.json
    echo   "guildId": "SUNUCU_ID_BURAYA",>>config.json
    echo   "adminRoleId": "ADMIN_ROL_ID_BURAYA",>>config.json
    echo   "logChannelId": "LOG_KANAL_ID_BURAYA">>config.json
    echo }>>config.json
    echo ✅ config.json oluşturuldu!
) else (
    echo ⚠️  config.json zaten mevcut, atlanıyor...
)
echo.

:: Konfigürasyon bilgilerini al
echo [4/6] Bot yapılandırması...
echo.
echo 📝 Aşağıdaki bilgileri Discord Developer Portal'dan alın:
echo    https://discord.com/developers/applications
echo.

set /p BOT_TOKEN="🔑 Bot Token: "
set /p CLIENT_ID="🆔 Client ID: "
set /p GUILD_ID="🏠 Sunucu ID: "
set /p ADMIN_ROLE_ID="👑 Admin Rol ID: "
set /p LOG_CHANNEL_ID="📋 Log Kanal ID: "

:: Config dosyasını güncelle
(
echo {
echo   "token": "%BOT_TOKEN%",
echo   "clientId": "%CLIENT_ID%",
echo   "guildId": "%GUILD_ID%",
echo   "adminRoleId": "%ADMIN_ROLE_ID%",
echo   "logChannelId": "%LOG_CHANNEL_ID%"
echo }
) > config.json

echo ✅ Yapılandırma kaydedildi!
echo.

:: Komutları Discord'a kaydet
echo [5/6] Slash komutları Discord'a kaydediliyor...
call node deploy-commands.js
if %errorlevel% neq 0 (
    echo ❌ Komutlar kaydedilemedi!
    echo ⚠️  Bot token'ınızı ve izinlerinizi kontrol edin.
    pause
    exit /b 1
)
echo ✅ Komutlar başarıyla kaydedildi!
echo.

:: PM2 kurulumu (opsiyonel)
echo [6/6] PM2 kurulumu (7/24 çalışma için)...
echo.
set /p INSTALL_PM2="PM2'yi kurmak istiyor musunuz? (E/H): "
if /i "%INSTALL_PM2%"=="E" (
    echo PM2 kuruluyor...
    call npm install -g pm2
    echo ✅ PM2 kuruldu!
    echo.
    echo 📌 PM2 ile botu başlatmak için:
    echo    pm2 start index.js --name ghostbot
) else (
    echo ⏭️  PM2 kurulumu atlandı.
)
echo.

:: Kurulum tamamlandı
echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║              ✅ KURULUM TAMAMLANDI!                      ║
echo ╚══════════════════════════════════════════════════════════╝
echo.
echo 🚀 Botu başlatmak için aşağıdaki komutlardan birini kullanın:
echo.
echo    ┌─ Normal başlatma:
echo    │  npm start
echo    │
echo    └─ 7/24 çalışma (PM2):
echo       pm2 start index.js --name ghostbot
echo       pm2 logs ghostbot
echo       pm2 stop ghostbot
echo.
echo 📚 Tüm komutlar:
echo    /play [şarkı]       - Müzik çal
echo    /rank              - Seviyeni gör
echo    /leaderboard       - Sıralama
echo    /ticket setup      - Ticket paneli kur
echo    /ban @user sebep   - Kullanıcı yasakla
echo    ... ve daha fazlası!
echo.
echo 💡 İpucu: Discord Developer Portal'da şunları aktifleştirmeyi unutmayın:
echo    • Server Members Intent
echo    • Message Content Intent
echo.

set /p START_NOW="🎮 Botu şimdi başlatmak istiyor musunuz? (E/H): "
if /i "%START_NOW%"=="E" (
    echo.
    echo 🚀 Bot başlatılıyor...
    npm start
) else (
    echo.
    echo 👋 Kurulum tamamlandı! Botu başlatmak için 'npm start' komutunu kullanın.
)

pause
