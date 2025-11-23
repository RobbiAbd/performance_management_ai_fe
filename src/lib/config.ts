// Application configuration from environment variables
export const appConfig = {
  name: import.meta.env.VITE_APP_NAME || 'SIPALING',
  fullName: import.meta.env.VITE_APP_FULL_NAME || 'SIPALING — Sistem Pemetaan Ketahanan Pangan Nasional',
  description: import.meta.env.VITE_APP_DESCRIPTION || 'Clustering Machine Learning untuk Ketahanan Pangan',
}

