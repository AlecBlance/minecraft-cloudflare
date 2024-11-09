// Reference: https://github.com/june07/ngrok-dns/blob/main/log.js

const yellow = "\x1b[33m",
  off = "\x1b[0m";
const name = `[${yellow}minecraft-cloudflare${off}]`;

const logger = (message: string) => {
  console.log(`${name} ${message}`);
};

export default logger;
