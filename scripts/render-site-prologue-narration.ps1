# Build-time only. The website plays the resulting MP3s without speech services.
$ErrorActionPreference = 'Stop'
$openingRoot = Split-Path -Parent $PSScriptRoot
Push-Location -LiteralPath $openingRoot
try {
  Add-Type -AssemblyName System.Speech
  $null = Get-Command node, ffmpeg, ffprobe -ErrorAction Stop
  New-Item -ItemType Directory -Path 'tmp/prologue', 'assets/prologue' -Force | Out-Null
  & node -e "const fs=require('node:fs'),d=require('./src/site-prologue-data');const clips=d.scenes.flatMap(s=>s.lines.map((text,cue)=>({id:s.id,cue,text,budget:s.duration/2000})));fs.writeFileSync('tmp/prologue/narration.json',JSON.stringify(clips));"
  if ($LASTEXITCODE -ne 0) { throw 'Unable to read the prologue script.' }
  $openingLines = Get-Content -LiteralPath 'tmp/prologue/narration.json' -Raw -Encoding UTF8 | ConvertFrom-Json
  $openingNarrator = New-Object System.Speech.Synthesis.SpeechSynthesizer
  $openingNarrator.SelectVoice('Microsoft Huihui Desktop')
  $openingNarrator.Rate = 1
  $openingFormat = New-Object System.Speech.AudioFormat.SpeechAudioFormatInfo(24000, [System.Speech.AudioFormat.AudioBitsPerSample]::Sixteen, [System.Speech.AudioFormat.AudioChannel]::Mono)
  $openingMetadata = @()
  foreach ($openingLine in $openingLines) {
    if ($openingLine.id -notmatch '^[a-z-]+$' -or $openingLine.cue -notin 0,1) { throw 'Invalid clip identifier.' }
    $openingName = $openingLine.id + '-' + $openingLine.cue
    $openingWave = Join-Path $openingRoot ('tmp/prologue/' + $openingName + '.wav')
    $openingMp3 = Join-Path $openingRoot ('assets/prologue/' + $openingName + '.mp3')
    $openingNarrator.SetOutputToWaveFile($openingWave, $openingFormat)
    $openingNarrator.Speak($openingLine.text)
    $openingNarrator.SetOutputToNull()
    $openingRawSeconds = [double]::Parse((& ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $openingWave), [Globalization.CultureInfo]::InvariantCulture)
    $openingTempo = [Math]::Max([double]1, [double]($openingRawSeconds / ($openingLine.budget - 0.22)))
    if ($openingTempo -gt 1.6) { throw ('Shorten the narration before rendering: ' + $openingName) }
    $openingFilter = 'atempo=' + $openingTempo.ToString('0.0000', [Globalization.CultureInfo]::InvariantCulture)
    & ffmpeg -hide_banner -loglevel error -y -i $openingWave -af $openingFilter -c:a libmp3lame -b:a 48k -ar 24000 -ac 1 -map_metadata -1 $openingMp3
    if ($LASTEXITCODE -ne 0) { throw ('Encoding failed: ' + $openingName) }
    $openingFinalSeconds = [double]::Parse((& ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 $openingMp3), [Globalization.CultureInfo]::InvariantCulture)
    if ($openingFinalSeconds -gt $openingLine.budget) { throw ('Narration exceeds the caption slot: ' + $openingName) }
    $openingMetadata += [pscustomobject][ordered]@{ id=$openingLine.id; cue=$openingLine.cue; text=$openingLine.text; file=$openingName + '.mp3'; duration=$openingFinalSeconds; budget=$openingLine.budget; sha256=(Get-FileHash -LiteralPath $openingMp3 -Algorithm SHA256).Hash.ToLowerInvariant() }
  }
  $openingJson = [ordered]@{ voice='Microsoft Huihui Desktop'; rate=1; format='MP3 mono 24 kHz / 48 kbps'; clips=$openingMetadata } | ConvertTo-Json -Depth 5
  [IO.File]::WriteAllText((Join-Path $openingRoot 'assets/prologue/narration.json'), $openingJson, [Text.UTF8Encoding]::new($false))
  $openingMetadata | Select-Object id,cue,duration,budget | Format-Table
} finally {
  if ($openingNarrator) { $openingNarrator.Dispose() }
  Pop-Location
}
