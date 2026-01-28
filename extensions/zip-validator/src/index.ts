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
    
    const shippingZip = deliveryAddress.zip;

    // 3. The Validation Logic
    if (shippingZip && blockedZips.includes(shippingZip)) {
      errors.push({
        localizedMessage: "We cannot ship to " + shippingZip + ". Please use a different address.",
        target: "$.cart.deliveryGroups[0].deliveryAddress.zip",
      });
    }
  }

  // 4. Return result
  return { errors };
}