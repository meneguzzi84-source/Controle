# Configuração do ambiente Android (Windows)

Este guia automatiza e orienta a instalação das ferramentas necessárias para compilar e testar o app Android localmente.

Requisitos mínimos
- Java JDK 11 ou superior
- Android Studio (recomendado) ou Android SDK command-line tools
- Android SDK Platform-tools (adb)
- Gradle (opcional se usar `gradlew`)

Passos rápidos (recomendado: executar pelo Android Studio)
1. Instale o Android Studio: https://developer.android.com/studio
2. Abra o projeto `AndroidApp` com o Android Studio.
3. Deixe o Android Studio instalar SDKs e criar um AVD (emulador).
4. Clique em Run para executar no emulador.

Automação via PowerShell
Há um script `setup-android-env.ps1` que verifica Java/adb/sdkmanager/gradle e baixa as Android command-line tools se necessário. Execute-o como Administrador para checagens iniciais.

Comandos úteis (PowerShell)
```powershell
# Verificar Java
java -version

# Se tiver Gradle instalado
gradle -v

# Gerar APK usando Gradle (se tiver gradle instalado)
# na pasta AndroidApp
gradle assembleDebug

# Usando wrapper (se existir)
.\gradlew assembleDebug

# Instalar APK no emulador/dispositivo conectado
adb install -r app\build\outputs\apk\debug\app-debug.apk
```

Se não houver `gradlew` no projeto
- Abra `Android Studio` → `File` → `Sync Project with Gradle Files` — o Android Studio irá criar o wrapper automaticamente.

Dicas e solução de problemas
- Se receber erros de licenciamento, execute:
  ```powershell
  sdkmanager --licenses
  ```
- Verifique `ANDROID_SDK_ROOT` ou `ANDROID_HOME` apontando para o SDK (ex: `%LOCALAPPDATA%\Android\Sdk`).
- Se preferir instalação automática pelo Chocolatey (Windows) e tiver `choco`:
  ```powershell
  choco install -y openjdk11
  choco install -y android-sdk
  choco install -y gradle
  ```

Próximo passo
- Execute `setup-android-env.ps1` e me envie qualquer erro para eu ajudar a resolver.
