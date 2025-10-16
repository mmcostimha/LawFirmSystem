package com.example.LawFirmAPI.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.vault.core.VaultTemplate;
import org.springframework.vault.support.VaultResponse;

import java.util.HashMap;
import java.util.Map;

@Service
public class VaultPasswordService {

    private final VaultTemplate vaultTemplate;
    private final String clientPath = "secret/data/clients/";


    @Autowired
    public VaultPasswordService(VaultTemplate vaultTemplate) {
        this.vaultTemplate = vaultTemplate;
    }

    public void storeEmailPassword(Long emailID, String password) {
        Map<String, Object> data = new HashMap<>();
        data.put("password", password);

        Map<String, Object> request = new HashMap<>();
        request.put("data", data);

        vaultTemplate.write(clientPath + emailID, request);
    }
    public void deleteEmailPassword(Long emailID){
        vaultTemplate.delete(clientPath + emailID);
    }

    public String getEmailPassword(Long emailID) {
        VaultResponse response = vaultTemplate.read(clientPath+ emailID);
        if (response.getData() != null) {
            // Primeiro nível: data do Vault
            Map<String, Object> outerData = response.getData();

            // Segundo nível: dados do segredo
            Map<String, Object> innerData = (Map<String, Object>) outerData.get("data");
            return (String) innerData.get("password");
        }
        throw new RuntimeException("Password not found for customer " + emailID);
    }
}
