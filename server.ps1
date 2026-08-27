# ==========================================
# SPORT ZONE - Zero-Dependency Local Web Server
# Run in PowerShell: .\server.ps1
# ==========================================

$ports = @(8401, 8402, 8403)
$listener = New-Object System.Net.HttpListener
$boundPort = 0

foreach ($p in $ports) {
    try {
        $listener.Prefixes.Clear()
        $listener.Prefixes.Add("http://localhost:$p/")
        $listener.Start()
        $boundPort = $p
        break
    } catch {
        # Try next port
    }
}

if ($boundPort -eq 0) {
    Write-Host "Could not bind to any default port." -ForegroundColor Red
    exit 1
}

Write-Host "==================================================" -ForegroundColor Green
Write-Host " ⚽ SPORT ZONE - Server is running at:" -ForegroundColor Cyan
Write-Host " http://localhost:$boundPort/" -ForegroundColor Yellow
Write-Host " Press Ctrl+C in this terminal to stop the server." -ForegroundColor Gray
Write-Host "==================================================" -ForegroundColor Green

$rootPath = $PSScriptRoot

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $relativePath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($relativePath)) {
            $relativePath = "index.html"
        }

        $filePath = Join-Path $rootPath $relativePath

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            switch ($ext) {
                ".html" { $response.ContentType = "text/html; charset=utf-8" }
                ".css"  { $response.ContentType = "text/css; charset=utf-8" }
                ".js"   { $response.ContentType = "application/javascript; charset=utf-8" }
                ".json" { $response.ContentType = "application/json; charset=utf-8" }
                ".png"  { $response.ContentType = "image/png" }
                ".jpg"  { $response.ContentType = "image/jpeg" }
                ".svg"  { $response.ContentType = "image/svg+xml" }
                ".xml"  { $response.ContentType = "application/xml; charset=utf-8" }
                ".txt"  { $response.ContentType = "text/plain; charset=utf-8" }
                default { $response.ContentType = "application/octet-stream" }
            }

            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
        }

        $response.OutputStream.Close()
    } catch {
        # Catch cancellation or exit
    }
}
