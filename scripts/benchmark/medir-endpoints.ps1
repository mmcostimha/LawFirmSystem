# Mede o tempo de resposta dos endpoints principais (média de N pedidos, depois de 1 pedido de aquecimento).
# O nº de queries por pedido lê-se no log do backend ("Session Metrics ... JDBC statements executed").
#
# Uso:
#   .\scripts\benchmark\medir-endpoints.ps1 -Token <jwt>                  # mede
#   .\scripts\benchmark\medir-endpoints.ps1 -Token <jwt> -CriarAlarmes    # cria 2 alarmes por cliente e sai
param(
    [Parameter(Mandatory = $true)][string]$Token,
    [string]$Base = "http://localhost:8080",
    [int]$N = 5,
    [switch]$CriarAlarmes
)

$headers = @{ Authorization = "Bearer $Token" }

if ($CriarAlarmes) {
    $ids = docker compose exec -T db psql -U user_admin -d lawfirm_bench -t -A -c "SELECT id FROM users WHERE role = 'client' ORDER BY id"
    foreach ($id in $ids) {
        foreach ($tipo in 'tribunal', 'financas') {
            Invoke-RestMethod -Method Post -Uri "$Base/api/supervisor/$id/$tipo" -Headers $headers | Out-Null
        }
    }
    Write-Host "Alarmes criados para $($ids.Count) clientes."
    return
}

$endpoints = '/api/supervisor', '/api/email/list', '/api/task'
foreach ($e in $endpoints) {
    # Aquecimento: o 1.º pedido inclui JIT e caches frias, por isso não conta
    Invoke-WebRequest -Uri "$Base$e" -Headers $headers -UseBasicParsing | Out-Null

    $tempos = 1..$N | ForEach-Object {
        (Measure-Command { Invoke-WebRequest -Uri "$Base$e" -Headers $headers -UseBasicParsing | Out-Null }).TotalMilliseconds
    }
    $stats = $tempos | Measure-Object -Average -Minimum -Maximum
    "{0,-18} média {1,7:N1} ms   (min {2,6:N1}, max {3,6:N1})" -f $e, $stats.Average, $stats.Minimum, $stats.Maximum
}
