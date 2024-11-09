import dotenv from "dotenv";
import logger from "@/utils/log";

dotenv.config();

const config = {
  NGROK_AUTH_TOKEN: process.env.NGROK_AUTH_TOKEN,
  MINECRAFT_SERVER_PORT: process.env.MINECRAFT_SERVER_PORT,
  CLOUDFLARE_API_KEY: process.env.CLOUDFLARE_API_KEY,
  CLOUDFLARE_ZONE_ID: process.env.CLOUDFLARE_ZONE_ID,
  CLOUDFLARE_EMAIL: process.env.CLOUDFLARE_EMAIL,
};

const optionalConfig = {
  MINECRAFT_CLOUDFLARE_SERVER_PORT:
    process.env.MINECRAFT_CLOUDFLARE_SERVER_PORT,
  SUBDOMAIN_TO_UPDATE: process.env.SUBDOMAIN_TO_UPDATE,
};

// * Checks if all the required env variables are present
const missingConfig = Object.entries(config).filter(
  ([_, value]) => value === undefined
);

if (missingConfig.length) {
  logger(
    `Missing env variable: ${missingConfig.map(([key]) => key).join(", ")}`
  );
  process.exit(1);
}

export default { ...config, ...optionalConfig };
