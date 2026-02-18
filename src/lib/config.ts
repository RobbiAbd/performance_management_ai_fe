// Application configuration from environment variables
export const appConfig = {
  name: import.meta.env.VITE_APP_NAME || 'Performance Management AI',
  fullName: import.meta.env.VITE_APP_FULL_NAME || 'Implementasi Generative AI Berbasis Natural Language Generation untuk Otomatisasi Analisis dan Rekomendasi Performance Management pada Human Capital Management',
  description: import.meta.env.VITE_APP_DESCRIPTION || 'Implementasi Generative AI Berbasis Natural Language Generation untuk Otomatisasi Analisis dan Rekomendasi Performance Management pada Human Capital Management',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/',
  userName: import.meta.env.VITE_USER_NAME || 'Karyawan',
}

