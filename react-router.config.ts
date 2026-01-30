import { vercelPreset } from "@vercel/react-router/vite";
import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  // Explicit routeDiscovery so framework context is never undefined (fixes "Cannot read properties of undefined (reading 'mode')" on Vercel)
  routeDiscovery: { mode: "lazy" },
  presets: [vercelPreset()],
} satisfies Config;
