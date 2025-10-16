# Usar a imagem oficial do Vault
FROM hashicorp/vault:latest

# Variáveis de ambiente para o modo dev
ENV VAULT_DEV_ROOT_TOKEN_ID=myroot
ENV VAULT_DEV_LISTEN_ADDRESS=0.0.0.0:8200

# Expõe a porta do Vault
EXPOSE 8200

# Comando para iniciar o Vault em modo desenvolvimento
CMD ["vault", "server", "-dev", "-dev-listen-address=0.0.0.0:8200"]