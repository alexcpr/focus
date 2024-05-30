const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    [
      "/login",
      "/loginadmin",
      "/register",
      "/verify",
      "/verifyadmin",
      "/gallery",
      "/contact",
      "/getmessages",
      "/changepassword",
      "/images",
    ],
    createProxyMiddleware({
      target: "http://localhost:3001",
      changeOrigin: true,
    })
  );
};
