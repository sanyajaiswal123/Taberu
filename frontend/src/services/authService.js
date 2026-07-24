import api from './axiosInstance';

export const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    return data.user;
  },

  async signup(name, email, password) {
    const { data } = await api.post('/auth/register', {
      name,
      email,
      password,
      password_confirmation: password,
    });
    return data.user;
  },

  async logout() {
    await api.post('/auth/logout');
  },

  async me() {
    const { data } = await api.get('/auth/me');
    return data;
  },
};
