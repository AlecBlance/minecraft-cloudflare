import config from "@/utils/config";
import logger from "@/utils/log";
import Cloudflare from "cloudflare";
import { APIPromise } from "cloudflare/core";

interface DnsManagementResult
  extends APIPromise<Cloudflare.DNS.Records.Record> {
  zone_name: string; // Force the presence of zone_name
}

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
      name: `_minecraft._tcp${`.${SUBDOMAIN_TO_UPDATE}` || ""}`,
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
    let dnsManagementResult;

    if (hasPreviousRecord) {
      logger("Updating existing DNS record");
      const recordId = searchResult.result[0].id!;
      dnsManagementResult = cloudflare.dns.records.edit(
        recordId,
        cloudflareRecord
      );
    } else {
      logger("Creating new DNS record");
      dnsManagementResult = cloudflare.dns.records.create(cloudflareRecord);
    }
    const { zone_name } =
      (await dnsManagementResult) as unknown as DnsManagementResult;
    logger(
      `Updated DNS record - You can now connect to ${
        `${SUBDOMAIN_TO_UPDATE}.` || ""
      }${zone_name} 🥳`
    );
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
