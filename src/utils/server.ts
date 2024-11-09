import { AddressInfo } from "net";
import config from "./config";
import logger from "./log";
import http from "http";

const { MINECRAFT_CLOUDFLARE_SERVER_PORT } = config;

const server = http
  .createServer(function (req: any, res: any) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("Congrats you have a created a minecraft-cloudflare web server");
    res.end();
  })
  .listen(MINECRAFT_CLOUDFLARE_SERVER_PORT || undefined);
const port = (server.address() as AddressInfo).port;

logger(`Minecraft-cloudflare web server running at port ${port}...`);
