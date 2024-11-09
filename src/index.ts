import "@/utils/config";
import { ngrokUrl } from "@/lib/ngrok";
import { updateDns } from "@/lib/cloudflare";
import "@/utils/server";

const main = async () => {
  const url = await ngrokUrl();
  updateDns(url);
};

main();
