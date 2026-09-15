$fontsPath = "$env:LOCALAPPDATA\Microsoft\Windows\Fonts"
if (!(Test-Path $fontsPath)) {
    New-Item -ItemType Directory -Path $fontsPath -Force | Out-Null
}

$ttfFiles = Get-ChildItem -Path "temp_mona_sans\Mona Sans\TTF\*.ttf"
foreach ($file in $ttfFiles) {
    $dest = Join-Path $fontsPath $file.Name
    Copy-Item $file.FullName -Destination $dest -Force
    $fontName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name) + ' (TrueType)'
    Set-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows NT\CurrentVersion\Fonts' -Name $fontName -Value $dest
}

Write-Host "Successfully installed $($ttfFiles.Count) Mona Sans fonts into Windows user fonts registry!"
