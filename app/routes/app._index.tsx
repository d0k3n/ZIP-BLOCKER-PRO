import { useState } from "react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { useLoaderData, useSubmit, Form } from "react-router";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  TextField,
  Banner,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

// --------------------------------------------------------
// 1. LOADER (Backend: Runs when page loads)
// Fetches the current settings from Shopify
// --------------------------------------------------------
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  // GraphQL query to get our specific Metafield
  const response = await admin.graphql(
    `query {
      shop {
        metafield(namespace: "zip_blocker", key: "config") {
          value
        }
      }
    }`
  );

  const responseJson = await response.json();
  // If no settings exist yet, default to empty list
  const configString = responseJson.data.shop.metafield?.value || '{"blockedZips": []}';
  
  return {
    config: JSON.parse(configString),
  };
};

// --------------------------------------------------------
// 2. ACTION (Backend: Runs when you click Save)
// Saves the new settings to Shopify
// --------------------------------------------------------
export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  
  // Get the string from the form (e.g., "90210, 10001")
  const rawString = formData.get("zips") as string;
  
  // Clean it up: Split by comma, remove spaces
  const blockedZips = rawString
    .split(",")
    .map((z) => z.trim())
    .filter((z) => z !== "");

  // Prepare the JSON to save
  const value = JSON.stringify({ blockedZips });

  // GraphQL Mutation to save the Metafield
  const response = await admin.graphql(
    `mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        userErrors {
          field
          message
        }
      }
    }`,
    {
      variables: {
        metafields: [
          {
            namespace: "zip_blocker",
            key: "config",
            type: "json",
            value: value,
            ownerId: (await admin.graphql('{ shop { id } }').then(r => r.json())).data.shop.id
          }
        ]
      }
    }
  );

  return { status: "success" };
};

// --------------------------------------------------------
// 3. COMPONENT (Frontend: What the user sees)
// --------------------------------------------------------
export default function Index() {
  const { config } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  
  // Local state for the input box
  // We join the array back into a string "90210, 10001" for display
  const [zips, setZips] = useState(config.blockedZips ? config.blockedZips.join(", ") : "");
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    // Send data to the 'action' above
    submit({ zips }, { method: "POST" });
    // Fake a small delay just for UX feel, or reset loading via useEffect
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <Page title="Zip Block Pro">
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <Text as="h2" variant="headingMd">
                  Configuration
                </Text>
                
                <Text as="p" variant="bodyMd">
                  Enter the Zip codes you want to block below. Separate them with commas.
                </Text>

                <TextField
                  label="Blocked Zip Codes"
                  value={zips}
                  onChange={(newValue) => setZips(newValue)}
                  multiline={4}
                  autoComplete="off"
                  placeholder="e.g. 90210, 10001, 33101"
                  helpText="These codes will be blocked instantly at checkout."
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="primary" onClick={handleSave} loading={loading}>
                    Save Settings
                  </Button>
                </div>
              </BlockStack>
            </Card>
          </Layout.Section>
          
          <Layout.Section variant="oneThird">
            <Card>
              <BlockStack gap="200">
                <Text as="h2" variant="headingMd">Instructions</Text>
                <Text as="p">
                  1. Enter Zips on the left.
                </Text>
                <Text as="p">
                  2. Click Save.
                </Text>
                <Text as="p" fontWeight="bold">
                  Important:
                </Text>
                <Text as="p">
                  Go to Settings {'>'} Checkout in your Shopify Admin and ensure this app is added to the "Checkout Rules" section.
                </Text>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}