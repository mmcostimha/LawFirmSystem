import socket
import os

def get_ip():
    # Conecta-se a um endereço externo para descobrir o IP real na rede local
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

def update_env(ip):
    env_file = '.env'
    lines = []
    
    # Variáveis que queremos atualizar
    new_vars = {
        'SEU_IP_LOCAL': f'{ip}',
    }

    if os.path.exists(env_file):
        with open(env_file, 'r') as f:
            lines = f.readlines()

    # Atualiza as linhas existentes ou prepara para adicionar novas
    updated_content = []
    found_keys = set()

    for line in lines:
        matched = False
        for key in new_vars.keys():
            if line.startswith(f"{key}="):
                updated_content.append(f"{key}={new_vars[key]}\n")
                found_keys.add(key)
                matched = True
                break
        if not matched:
            updated_content.append(line)

    # Adiciona as chaves que não existiam no ficheiro
    for key, value in new_vars.items():
        if key not in found_keys:
            updated_content.append(f"{key}={value}\n")

    with open(env_file, 'w') as f:
        f.writelines(updated_content)

    print(f"✅ Sucesso! Ficheiro .env atualizado com o IP: {ip}")

if __name__ == "__main__":
    local_ip = get_ip()
    update_env(local_ip)