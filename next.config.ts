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
  experimental: {
    serverComponentsExternalPackages: [
      'genkit',
      '@genkit-ai/googleai',
      '@genkit-ai/next',
      // Comprehensive OpenTelemetry list based on common requirements and Genkit docs
      '@opentelemetry/api',
      '@opentelemetry/context-async-hooks',
      '@opentelemetry/instrumentation',
      '@opentelemetry/resources',
      '@opentelemetry/sdk-trace-base',
      '@opentelemetry/sdk-trace-node',
      '@opentelemetry/semantic-conventions',
    ],
  },
};

export default nextConfig;
