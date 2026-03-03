import { RunInput, FunctionRunResult } from "../generated/api";

export function run(input: RunInput): FunctionRunResult {
  const errors = [];
  
  // 1. Parse the blocked list from the Metafield
  const metafieldValue = input.shop.metafield?.value;
  const configString = metafieldValue ? metafieldValue : "{}";
  const config = JSON.parse(configString);
  const blockedZips = config.blockedZips || [];

  // 2. Check the Cart's Zip Code
  const deliveryGroups = input.cart.deliveryGroups;
  
  for (let i = 0; i < deliveryGroups.length; i++) {
    const group = deliveryGroups[i];
    const deliveryAddress = group.deliveryAddress;

    if (!deliveryAddress) {
      continue;
    }

    // Normalize zip (trim, uppercase) so blocklist matches regardless of popup vs main form input
    const shippingZip = deliveryAddress.zip?.trim().toUpperCase() ?? "";

    // 3. The Validation Logic
    const normalizedBlocked = blockedZips.map((z: string) => String(z).trim().toUpperCase());
    if (shippingZip && normalizedBlocked.includes(shippingZip)) {
      const message = "We cannot ship to " + shippingZip + ". Please use a different address.";
      // Field-level target: highlights the zip field (works when address is on main page)
      errors.push({
        localizedMessage: message,
        target: `$.cart.deliveryGroups[${i}].deliveryAddress.zip`,
      });
      // Cart-level target: shows error on main checkout so it's visible when zip is in a popup/modal
      errors.push({
        localizedMessage: message,
        target: "$.cart",
      });
    }
  }

  // 4. Return result
  return { errors };
}