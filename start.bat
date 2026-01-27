@echo off
echo ==========================================
echo [1/3] Detectando IP da rede local...
python update_ip.py

echo [2/3] Verificando containers antigos...
docker-compose down

echo [3/3] Iniciando o sistema (Build e Up)...
docker-compose up --build
echo ==========================================
pause