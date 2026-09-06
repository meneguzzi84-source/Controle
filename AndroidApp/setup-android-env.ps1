function Check-Command {
    param([string]$cmd)
    $null -ne (Get-Command $cmd -ErrorAction SilentlyContinue)
}

Write-Host "Verificando dependências..." -ForegroundColor Cyan

$hasJava = Check-Command java
$hasAdb = Check-Command adb
$hasSdkmanager = Check-Command sdkmanager
$hasGradle = Check-Command gradle
$hasChoco = Check-Command choco

Write-Host "Java: $hasJava | adb: $hasAdb | sdkmanager: $hasSdkmanager | gradle: $hasGradle | choco: $hasChoco"

if (-not $hasJava) {
    Write-Host "Java não encontrado. Instale JDK 11+ (recomendado OpenJDK)." -ForegroundColor Yellow
    if ($hasChoco) { Write-Host "Você pode executar: choco install -y openjdk11" }
}

if (-not $env:ANDROID_SDK_ROOT -and -not $env:ANDROID_HOME) {
    $defaultSdk = "$env:LOCALAPPDATA\Android\Sdk"
    Write-Host "Variável ANDROID_SDK_ROOT não definida. Usarei: $defaultSdk" -ForegroundColor Yellow
    $env:ANDROID_SDK_ROOT = $defaultSdk
}

$cmdlineToolsDir = Join-Path $env:ANDROID_SDK_ROOT 'cmdline-tools' -ErrorAction SilentlyContinue
if (-not (Test-Path $cmdlineToolsDir) -or -not $hasSdkmanager) {
    Write-Host "Android command-line tools não encontrados. Vou baixar a versão mais recente para: $env:LOCALAPPDATA\Temp\commandlinetools.zip" -ForegroundColor Cyan
    $zipPath = Join-Path $env:TEMP 'commandlinetools-win-latest.zip'
    $downloadUrl = 'https://dl.google.com/android/repository/commandlinetools-win-latest.zip'
    try {
        Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath -UseBasicParsing -ErrorAction Stop
        Write-Host "Download concluído: $zipPath" -ForegroundColor Green
        $extractTo = Join-Path $env:LOCALAPPDATA 'Android\Sdk\cmdline-tools\latest'
        New-Item -ItemType Directory -Force -Path $extractTo | Out-Null
        Add-Type -AssemblyName System.IO.Compression.FileSystem
        [System.IO.Compression.ZipFile]::ExtractToDirectory($zipPath, $extractTo)
        Write-Host "Extraído para: $extractTo" -ForegroundColor Green
        Write-Host "Adicione '$extractTo\bin' ao PATH ou reinicie o terminal para reconhecer 'sdkmanager'." -ForegroundColor Yellow
    } catch {
        Write-Host "Falha ao baixar/instalar command-line tools: $_" -ForegroundColor Red
    }
} else {
    Write-Host "Command-line tools encontrados em $cmdlineToolsDir" -ForegroundColor Green
}

Write-Host "Resumo: verifique as mensagens acima. Se tudo OK, rode:" -ForegroundColor Cyan
Write-Host "  cd AndroidApp" -ForegroundColor White
Write-Host "  .\gradlew assembleDebug  (ou 'gradle assembleDebug' se você tiver gradle)" -ForegroundColor White
Write-Host "Depois instale com: adb install -r app\\build\\outputs\\apk\\debug\\app-debug.apk" -ForegroundColor White

Write-Host "Se precisar, execute 'sdkmanager --licenses' para aceitar licenças." -ForegroundColor Yellow
