param(
    [string]$Distro = "Ubuntu",
    [int]$Port = 22,
    [string]$ListenAddress = "0.0.0.0",
    [switch]$BindTailscaleIp,
    [switch]$EnsureSshService
)

$ErrorActionPreference = "Stop"

function Ensure-FirewallRule {
    param(
        [string]$DisplayName,
        [int]$LocalPort
    )

    $rule = Get-NetFirewallRule -DisplayName $DisplayName -ErrorAction SilentlyContinue
    if (-not $rule) {
        New-NetFirewallRule -DisplayName $DisplayName -Direction Inbound -Protocol TCP -LocalPort $LocalPort -Action Allow | Out-Null
    }
}

function Get-TailscaleIPv4 {
    $candidates = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
        Where-Object {
            $_.IPAddress -like '100.*' -and
            $_.PrefixOrigin -ne 'WellKnown' -and
            $_.IPAddress -ne '100.100.100.100'
        } |
        Sort-Object InterfaceMetric, SkipAsSource

    return ($candidates | Select-Object -First 1 -ExpandProperty IPAddress)
}

function Remove-PortProxyRule {
    param(
        [string]$Address,
        [int]$ListenPort
    )

    if ([string]::IsNullOrWhiteSpace($Address)) {
        return
    }

    & netsh interface portproxy delete v4tov4 listenaddress=$Address listenport=$ListenPort | Out-Null
}

Write-Host "[1/8] Arrancando WSL ($Distro)..."
wsl -d $Distro -- bash -lc "true" | Out-Null

if ($EnsureSshService) {
    Write-Host "[2/8] Asegurando ssh.service dentro de WSL..."
    wsl -d $Distro -- bash -lc "sudo systemctl enable ssh >/dev/null 2>&1; sudo systemctl restart ssh" | Out-Null
} else {
    Write-Host "[2/8] Saltando gestión de ssh.service dentro de WSL"
}

Write-Host "[3/8] Obteniendo IP de WSL..."
$wslIp = (wsl -d $Distro -- bash -lc "hostname -I | awk '{print \$1}'" 2>$null).Trim()
if (-not $wslIp) {
    throw "No pude obtener la IP de WSL para la distro '$Distro'."
}
Write-Host "WSL IP: $wslIp"

Write-Host "[4/8] Verificando que sshd escuche en WSL..."
$sshListening = (wsl -d $Distro -- bash -lc "ss -tln | grep -q ':$Port ' && echo ok" 2>$null).Trim()
if ($sshListening -ne "ok") {
    throw "sshd no está escuchando en WSL en el puerto $Port."
}

$tailscaleIp = $null
if ($BindTailscaleIp) {
    Write-Host "[5/8] Detectando IP de Tailscale del host..."
    $tailscaleIp = Get-TailscaleIPv4
    if (-not $tailscaleIp) {
        throw "No pude detectar una IP IPv4 de Tailscale en Windows."
    }
    Write-Host "Tailscale IP: $tailscaleIp"
} else {
    Write-Host "[5/8] Saltando bind específico a Tailscale, usando $ListenAddress"
}

Write-Host "[6/8] Limpiando reglas viejas de portproxy..."
Remove-PortProxyRule -Address "127.0.0.1" -ListenPort $Port
Remove-PortProxyRule -Address "0.0.0.0" -ListenPort $Port
Remove-PortProxyRule -Address $tailscaleIp -ListenPort $Port

Write-Host "[7/8] Creando portproxy..."
& netsh interface portproxy add v4tov4 listenaddress=$ListenAddress listenport=$Port connectaddress=$wslIp connectport=$Port | Out-Null
if ($BindTailscaleIp -and $tailscaleIp -and $tailscaleIp -ne $ListenAddress) {
    & netsh interface portproxy add v4tov4 listenaddress=$tailscaleIp listenport=$Port connectaddress=$wslIp connectport=$Port | Out-Null
}

Write-Host "[8/8] Asegurando firewall y verificando escucha local..."
Ensure-FirewallRule -DisplayName "WSL SSH $Port" -LocalPort $Port
$localTest = Test-NetConnection 127.0.0.1 -Port $Port -WarningAction SilentlyContinue
if (-not $localTest.TcpTestSucceeded) {
    throw "El puerto $Port no responde en localhost después de recrear el portproxy."
}

Write-Host ""
Write-Host "Listo. Portproxy actualizado." -ForegroundColor Green
Write-Host "Distro:        $Distro"
Write-Host "WSL IP:        $wslIp"
Write-Host "ListenAddress: $ListenAddress"
if ($tailscaleIp) {
    Write-Host "Tailscale IP:  $tailscaleIp"
}
Write-Host "Port:          $Port"
Write-Host ""
Write-Host "Reglas actuales:"
& netsh interface portproxy show all
