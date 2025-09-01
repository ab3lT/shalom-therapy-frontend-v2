class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:8080/api/v1/shalom';
    this.authURL = 'http://localhost:8003/api/v1/shalom/auth';
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async request(url, options = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: { ...this.getHeaders(), ...options.headers }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // All API methods as defined in your original code
  async login(credentials) {
    return this.request(`${this.authURL}/login`, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  // ... other methods
}

export const api = new ApiService();