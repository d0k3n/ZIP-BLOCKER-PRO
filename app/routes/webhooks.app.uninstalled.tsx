import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { shop, session, topic } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  const topicStr = String(topic);
  switch (topicStr) {
    case "APP_UNINSTALLED":
    case "app/uninstalled":
    case "shop/redact":
    case "SHOP_REDACT":
      // Delete all data for this shop. shop/redact is sent 48h after uninstall.
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }
      break;
    case "customers/data_request":
    case "CUSTOMERS_DATA_REQUEST":
    case "customers/redact":
    case "CUSTOMERS_REDACT":
      // We don't store customer data; blocked zips are shop config in metafields.
      // Acknowledge receipt to comply with mandatory webhooks.
      break;
    default:
      break;
  }

  return new Response();
};
