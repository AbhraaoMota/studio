
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  serverExternalPackages: [
      'genkit',
      '@genkit-ai/googleai',
      '@genkit-ai/next',
      // Relying on @genkit-ai/next to handle OpenTelemetry externals.
      // If issues persist, specific OpenTelemetry packages might need to be re-added here.
      // e.g., '@opentelemetry/api', '@opentelemetry/sdk-trace-node', etc.
  ],
};

export default nextConfig;
