
import type {NextConfig} from 'next';

// ATENÇÃO: Substitua '<SEU_REPOSITORIO_NO_GITHUB>' pelo nome real do seu repositório no GitHub.
// Por exemplo, se a URL do seu repositório for https://github.com/seu_usuario/meu-app-financeiro,
// então o nome do repositório é 'meu-app-financeiro'.
const REPOSITORY_NAME = process.env.GITHUB_PAGES === 'true' ? '/<SEU_REPOSITORIO_NO_GITHUB>' : '';

const nextConfig: NextConfig = {
  output: process.env.GITHUB_PAGES === 'true' ? 'export' : undefined, // Gera arquivos estáticos para GitHub Pages
  basePath: REPOSITORY_NAME, // Necessário para que os assets carreguem corretamente no GitHub Pages
  assetPrefix: process.env.GITHUB_PAGES === 'true' ? `${REPOSITORY_NAME}/` : undefined, // Para assets no GitHub Pages
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: process.env.GITHUB_PAGES === 'true' ? true : false, // Desabilita a otimização de imagem para exportação estática
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
