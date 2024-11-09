import logger from "@/utils/log";
import ngrok from "@ngrok/ngrok";
import config from "@/utils/config";

const { NGROK_AUTH_TOKEN, MINECRAFT_SERVER_PORT } = config;

const ngrokUrl = async (): Promise<string> => {
  logger("Starting ngrok tunnel");
  try {
    const listener = await ngrok.forward({
      addr: MINECRAFT_SERVER_PORT,
      authtoken: NGROK_AUTH_TOKEN,
      proto: "tcp",
    });
    const generatedUrl = listener.url();
    if (!generatedUrl) {
      throw new Error("Failed to generate ngrok URL");
    }
    logger(`Generated ngrok URL: ${generatedUrl}`);
    return generatedUrl;
  } catch (error) {
    if (error instanceof Error) {
      logger(`Error: ${error.message}`);
    } else {
      logger(`Unknown error: ${error}`);
    }
    process.exit(1);
  }
};

export { ngrokUrl };
