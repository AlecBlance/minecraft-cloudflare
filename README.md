# Minecraft Cloudflare

Minecraft Cloudflare exposes your Minecraft server to the public without portforwarding using Cloudflare and ngrok. It automatically updates your Cloudflare's DNS record (SRV) to point to the newly generated url of ngrok.

## Usage

> **Note**
> Make sure you have Node preinstalled

1. Create your `.env` from `.env.example`, and fill all these variables

```
NGROK_AUTH_TOKEN=
CLOUDFLARE_API_KEY=
CLOUDFLARE_ZONE_ID=
CLOUDFLARE_EMAIL=
SUBDOMAIN_TO_UPDATE=
MINECRAFT_SERVER_PORT=
```

2. Install all the dependencies

```bash
npm install
```

3. Run the application

```bash
npm run dev
```
