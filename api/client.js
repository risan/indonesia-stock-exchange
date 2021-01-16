const axios = require('axios');

module.exports = axios.create({
  baseURL: 'https://pasardana.id/api/',
  headers: {
    Accept: 'application/json',
    'Accept-Encoding': 'gzip',
    Host: 'pasardana.id',
    Pragma: 'no-cache',
    Referer: 'https://pasardana.id/stock/search',
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
  },
});