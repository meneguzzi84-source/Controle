# Controle Financeiro — Android WebView Wrapper

Este projeto carrega o app web `ControleFinanceiro` dentro de um `WebView` Android.

Local do conteúdo web carregado: `app/src/main/assets/controlefinanceiro/`

O que já está pronto
- Projeto Android básico (Kotlin) em `AndroidApp/`.
- `MainActivity` carrega `file:///android_asset/controlefinanceiro/index.html` e permite `prompt()`.
- Todos os arquivos do app web (`index.html`, `styles.css`, `script.js`) foram copiados para `app/src/main/assets/controlefinanceiro/`.

Como abrir e executar (Android Studio)
1. Abra o Android Studio.
2. Escolha **Open** e selecione a pasta `caminho/para/AndroidApp` (por exemplo: `c:\Users\meneg\OneDrive\Documentos\DevClub\HTML\AndroidApp`).
3. Aguarde o Gradle sincronizar.
4. Conecte um dispositivo Android ou inicie um emulador.
5. Clique em **Run** (Play) para instalar e executar.

Linha de comando (opcional - requer Gradle/Android SDK configurados)
- Para construir (no Windows usando Gradle instalado):

```bash
cd "c:/Users/meneg/OneDrive/Documentos/DevClub/HTML/AndroidApp"
gradle assembleDebug
```

- Para instalar no dispositivo conectado (requer `adb` no PATH):

```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

Observações e permissões
- O app carrega conteúdo local via `file:///android_asset`. Não é necessário `INTERNET` para esse fluxo local.
- Se você quiser carregar conteúdo remoto, adicione `<uses-permission android:name="android.permission.INTERNET"/>` no `AndroidManifest.xml`.

Próximos passos que posso fazer por você
- Gerar ícones de lançamento (`mipmap`) e atualizar o `AndroidManifest`.
- Adicionar `gradle wrapper` (./gradlew) para builds consistentes via CLI.
- Empacotar APK ou AAB pronto para distribuição (precisa de ambiente com SDK/Gradle).
- Converter para interface nativa (Jetpack Compose/Activities) se preferir um app 100% nativo.

Diga qual destes próximos passos você quer que eu faça agora.