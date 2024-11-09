import config from "@/utils/config";
import logger from "@/utils/log";
import Cloudflare from "cloudflare";

const {
  CLOUDFLARE_API_KEY,
  CLOUDFLARE_ZONE_ID,
  SUBDOMAIN_TO_UPDATE,
  CLOUDFLARE_EMAIL,
} = config;

logger("Initializing Cloudflare API");

const cloudflare = new Cloudflare({
  apiEmail: CLOUDFLARE_EMAIL,
  apiKey: CLOUDFLARE_API_KEY,
});

const updateDns = async (ngrokUrl: string) => {
  logger("Searching through existing DNS records");
  try {
    const [target, port] = ngrokUrl.replace("tcp://", "").split(":");
    const cloudflareRecord = {
      name: SUBDOMAIN_TO_UPDATE!,
      type: "SRV",
      data: {
        port,
        weight: 0,
        target,
        priority: 0,
      },
      zone_id: CLOUDFLARE_ZONE_ID!,
      comment: "minecraft-cloudflare",
    } as unknown as Cloudflare.DNS.Records.RecordCreateParams;

    const searchResult = await cloudflare.dns.records.list({
      zone_id: CLOUDFLARE_ZONE_ID!,
      type: "SRV",
      comment: { exact: "minecraft-cloudflare" },
    });

    const hasPreviousRecord = !!searchResult.result.length;
    let name;

    if (hasPreviousRecord) {
      logger("Updating existing DNS record");
      const recordId = searchResult.result[0].id!;
      const updateResult = cloudflare.dns.records.edit(
        recordId,
        cloudflareRecord
      );
      name = (await updateResult).name;
    } else {
      logger("Creating new DNS record");
      const createResult = cloudflare.dns.records.create(cloudflareRecord);
      name = (await createResult).name;
    }
    logger(`Updated DNS record: ${name}`);
  } catch (error) {
    if (error instanceof Error) {
      logger(`Error: ${error.message}`);
    } else {
      logger(`Unknown error: ${error}`);
    }
    process.exit(1);
  }
};

export { updateDns };
