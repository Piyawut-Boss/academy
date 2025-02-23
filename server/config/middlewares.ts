module.exports = [
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:3000'], // อนุญาตเฉพาะ React ที่รันบนพอร์ต 3000
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // อนุญาตเฉพาะ HTTP Methods ที่ต้องการ
      headers: ['Authorization', 'Content-Type', 'Accept', 'Origin', 'X-Custom-Header'], // ระบุ headers ที่อนุญาต
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
