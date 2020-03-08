const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    "/api",
    proxy({
      target: process.env.SERVER_HOST || "http://localhost:5000",
      changeOrigin: true
    })
  );
};
