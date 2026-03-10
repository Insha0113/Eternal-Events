// Central API base URL configuration
// Uses the production Railway backend in production; falls back to local for development.
const API_BASE_URL =
    process.env.REACT_APP_API_URL ||
    'https://eternal-events-production.up.railway.app';

export default API_BASE_URL;
