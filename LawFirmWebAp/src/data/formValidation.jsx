// utils/validationService.js

export const validateField = (name, value) => {
    // Garantir que trabalhamos com strings para evitar erros de .trim() ou .length
    const val = value ? String(value) : "";

    switch (name) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(val) ? null : "Email inválido";
        
        case 'phone':
            // [0-9] significa apenas dígitos
            // {9,12} significa no mínimo 9 e no máximo 12
            const phoneRegex = /^[0-9]{9,12}$/;
            return phoneRegex.test(val) ? null : "O número deve ter entre 9 e 12 dígitos";
        
        case 'name':
            const trimmedName = val.trim();
            // Divide o nome por espaços e filtra entradas vazias (ex: dois espaços seguidos)
            const nameParts = trimmedName.split(/\s+/).filter(part => part.length > 0);
            
            // Verifica se há pelo menos 2 palavras e se o total de caracteres é aceitável
            if (nameParts.length < 2) {
                return "Introduza o nome completo (pelo menos dois nomes)";
            }
            return trimmedName.length >= 3 ? null : "O nome é demasiado curto";
            
        default:
            return null;
    }
};

export const validateForm = (data) => {
    const errors = {};
    Object.keys(data).forEach(key => {
        const error = validateField(key, data[key]);
        if (error) errors[key] = error;
    });
    return errors;
};