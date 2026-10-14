# PeoplePulse Android build script (Windows / PowerShell).
#
# Builds the debug/testing APK of the native WebView wrapper in ./android
# and stages it to ./dist/android with a stable filename.
#
# Requirements (user-local installs are fine):
#   - JDK 17 (JAVA_HOME should point at it)
#   - Android SDK (platform-34 + build-tools 34.0.0 + platform-tools)
#     discovered via ANDROID_HOME / ANDROID_SDK_ROOT, else
#     %LOCALAPPDATA%\Android\Sdk
#
# Contains NO secrets, passwords, keys, or Supabase credentials.
# Release signing is intentionally NOT configured here: no release keystore
# exists in the repo. Cutting a release build requires a release keystore
# and explicit approval (a new key changes the app's update identity).

[CmdletBinding()]
param(
    [string]$SdkRoot = $(
        if ($env:ANDROID_HOME) { $env:ANDROID_HOME }
        elseif ($env:ANDROID_SDK_ROOT) { $env:ANDROID_SDK_ROOT }
        else { Join-Path $env:LOCALAPPDATA 'Android\Sdk' }
    ),
    [string]$ApkName = 'peoplepulse-1.0-debug.apk'
)

$ErrorActionPreference = 'Stop'

function Fail([string]$message) {
    Write-Error $message
    exit 1
}

$repoRoot = Split-Path -Parent $PSScriptRoot
$androidDir = Join-Path $repoRoot 'android'
$gradlew = Join-Path $androidDir 'gradlew.bat'
if (-not (Test-Path -LiteralPath $gradlew)) { Fail "gradlew.bat not found in $androidDir" }

try { & java -version 2>&1 | Out-Null } catch { Fail 'Java not found. Install JDK 17 and ensure java is on PATH.' }
if (-not (Test-Path -LiteralPath (Join-Path $SdkRoot 'platforms\android-34'))) {
    Fail "Android SDK platform-34 not found under $SdkRoot. Install it with sdkmanager."
}
if (-not (Test-Path -LiteralPath (Join-Path $SdkRoot 'build-tools\34.0.0'))) {
    Fail "Android build-tools 34.0.0 not found under $SdkRoot. Install it with sdkmanager."
}

$env:ANDROID_HOME = $SdkRoot
$env:JAVA_HOME = $env:JAVA_HOME

Push-Location $androidDir
try {
    & .\gradlew.bat assembleDebug
    if ($LASTEXITCODE -ne 0) { Fail 'Gradle build failed.' }
} finally {
    Pop-Location
}

$builtApk = Join-Path $androidDir 'app\build\outputs\apk\debug\app-debug.apk'
if (-not (Test-Path -LiteralPath $builtApk)) { Fail "Expected APK not produced: $builtApk" }

$distDir = Join-Path $repoRoot 'dist\android'
New-Item -ItemType Directory -Path $distDir -Force | Out-Null
$destApk = Join-Path $distDir $ApkName
Copy-Item -LiteralPath $builtApk -Destination $destApk -Force

$hash = (Get-FileHash -LiteralPath $destApk -Algorithm SHA256).Hash
$size = (Get-Item -LiteralPath $destApk).Length
Write-Output "APK : $destApk"
Write-Output "Size: $size bytes"
Write-Output "SHA-256: $hash"

$apksigner = Join-Path $SdkRoot 'build-tools\34.0.0\apksigner.bat'
if (Test-Path -LiteralPath $apksigner) {
    & $apksigner verify --print-certs $destApk
    if ($LASTEXITCODE -ne 0) { Fail 'apksigner verification failed.' }
    Write-Output 'Signature: VERIFIED'
} else {
    Write-Output 'Signature: apksigner not found, skipped (APK still debug-signed by Gradle).'
}
