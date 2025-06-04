import AppShell from '@/components/AppShell';
import { ForecastClient } from './components/ForecastClient';

export default function PrevisoesPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold font-headline text-foreground">Previsão de Fluxo de Caixa com IA</h1>
        <ForecastClient />
      </div>
    </AppShell>
  );
}
