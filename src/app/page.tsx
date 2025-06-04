import AppShell from '@/components/AppShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, TrendingDown, PlusCircle, Target as TargetIcon, Users, AlertCircle } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import Link from 'next/link';

const chartData = [
  { month: 'Jan', income: 4000, expenses: 2400, balance: 1600 },
  { month: 'Fev', income: 3000, expenses: 1398, balance: 1602 },
  { month: 'Mar', income: 5000, expenses: 3800, balance: 1200 },
  { month: 'Abr', income: 2780, expenses: 3908, balance: -1128 },
  { month: 'Mai', income: 1890, expenses: 4800, balance: -2910 },
  { month: 'Jun', income: 2390, expenses: 3800, balance: -1410 },
];

const KpiCard = ({ title, value, icon: Icon, description, trend, unit = "R$" }: { title: string, value: number, icon: React.ElementType, description: string, trend?: string, unit?: string }) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-5 w-5 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold font-headline">{unit} {value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {trend && <p className={`text-xs mt-1 ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{trend}</p>}
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold font-headline text-foreground">Painel de Controle</h1>
          <Link href="/lancamentos" passHref>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Novo Lançamento
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <KpiCard title="Receita Total (Mês)" value={7390.50} icon={TrendingUp} description="Total de entradas no mês atual" trend="+5.2% vs mês anterior" />
          <KpiCard title="Despesa Total (Mês)" value={4850.20} icon={TrendingDown} description="Total de saídas no mês atual" trend="+2.1% vs mês anterior" />
          <KpiCard title="Saldo Atual" value={12540.30} icon={DollarSign} description="Saldo em todas as contas" />
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Fluxo de Caixa Mensal</CardTitle>
            <CardDescription>Visão geral das suas receitas e despesas nos últimos 6 meses.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
                <RechartsTooltip
                  cursor={{ fill: 'hsl(var(--accent))', opacity: 0.1 }}
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                  labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{fontSize: "12px", paddingTop: '10px'}} />
                <Bar dataKey="income" fill="hsl(var(--chart-1))" name="Receitas" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="hsl(var(--chart-2))" name="Despesas" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><TargetIcon className="h-5 w-5 text-primary" /> Metas Financeiras</CardTitle>
              <CardDescription>Acompanhe o progresso das suas metas.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Viagem para Europa</span>
                    <span className="font-semibold">60%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Reserva de Emergência</span>
                    <span className="font-semibold">85%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
              <Link href="/metas" passHref>
                <Button variant="outline" className="mt-4 w-full">Ver Todas as Metas</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><AlertCircle className="h-5 w-5 text-destructive" /> Alertas Recentes</CardTitle>
              <CardDescription>Notificações importantes sobre sua conta.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><Users className="h-4 w-4 text-yellow-500" /> Conta 'Aluguel' vence em 3 dias.</li>
                <li className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-red-500" /> Saldo baixo na Conta Corrente.</li>
                <li className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-green-500" /> Meta 'Reserva de Emergência' quase atingida!</li>
              </ul>
               <Button variant="outline" className="mt-4 w-full">Ver Todos os Alertas</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
