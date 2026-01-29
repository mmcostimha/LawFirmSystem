
import axios from 'axios';

export default async function apiRequest(url, method = 'GET', body = null, token = null) {
    try {
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        if (body) {
            headers['Content-Type'] = 'application/json';
        }

        const response = await axios({
            method: method,
            url: import.meta.env.VITE_SERVER_API_URL + url,
            data: body,
            headers: headers
        });

        return response;
    } catch (err) {
        console.error('Erro na requisição:', err);
        throw err;
    }
}
