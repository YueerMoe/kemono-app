# KemonoApp

<p align="center">
  <img src="./src/assets/logo.png" alt="Logo" width="120" height="120">
</p>

<p style="text-align: center">
  <img src="https://img.shields.io/badge/platform-Android-blue?style=for-the-badge" alt="Platform">
  <img src="https://img.shields.io/badge/Tauri-2.0-yellow?style=for-the-badge" alt="Framework">
  <img src="https://img.shields.io/badge/Vue-3.0-darkgreen?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/github/license/YueerMoe/kemono-app?style=for-the-badge" alt="License">
</p>

<p align="center">
  A clean and smooth third-party mobile client for Kemono.cr, built with Tauri + Vue + TypeScript.
</p>

### Build from Source

1. **Clone the repository**
   ```bash
   git clone [https://github.com/YueerMoe/kemono-app.git](https://github.com/YueerMoe/kemono-app.git)
   cd kemono-app

2. **Creating a keystore**

    Linux
   ```bash
   keytool -genkey -v -keystore ~/kemonoApp-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias kemonoApp
   ```

   Windows
   ```bash
   keytool -genkey -v -keystore $env:USERPROFILE\kemonoApp-keystore.jks -storetype JKS -keyalg RSA -keysize 2048 -validity 10000 -alias kemonoApp
   ```

3. **Import keystore**
   
   ```bash
   touch src-tauri/gen/android/keystore.properties
   ```

   ```properties
   storePassword=<password from previous step>
   keyPassword=<password from previous step>
   keyAlias=kemonoApp
   storeFile=/Users/<user name>/kemonoApp-keystore.jks OR C:\\Users\\<user name>\\kemonoApp-keystore.jks
   ```
   
4. **Build**
   ```bash 
   yarn tauri android build --target aarch64
   ```
## Contributors
<a href="https://github.com/YueerMoe/kemono-app/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=YueerMoe/kemono-app" />
</a>

Made with [contrib.rocks](https://contrib.rocks).