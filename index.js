const app = require("./app");
const config = require("./config/config");
const fs = require("fs");

let server;
if (config.protocol == "https") {
  const https = require("https");
  server = https.createServer(
    {
      key: fs.readFileSync(config.certificate.privkey, "utf8"),
      cert: fs.readFileSync(config.certificate.fullchain, "utf8"),
    },
    app
  );
} else {
  const http = require("http");
  server = http.createServer(app);
}
server.listen(config.port, () => {
  console.log(`Server Running on PORT ${config.port}`);
});
