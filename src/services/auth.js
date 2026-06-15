import {api} from "./apiServices";

export async function login(username, password) {
    const response = await api.post('/login', { username, password });
    const { token, refreshToken } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);

    return response.data;
}

export async function logout() {
        await api.post('/logout');
            localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');    
}