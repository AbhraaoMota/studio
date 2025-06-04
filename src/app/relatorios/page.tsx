import AppShell from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Filter } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';

const sampleReportData = [
  { category: 'Moradia', amount: 1200, percentage: 30 },
  { category: 'Alimentação', amount: 800, percentage: 20 },
  { category: 'Transporte', amount: 400, percentage: 10 },
  { category: 'Lazer', amount: 600, percentage: 15 },
  { category: 'Outros', amount: 1000, percentage: 25 },
];

const sampleMonthlyData = [
  { month: 'Jan', income: 4200, expense: 2500 },
  { month: 'Fev', income: 3800, expense: 2200 },
  { month: 'Mar', income: 5100, expense: 3000 },
];


export default function RelatoriosPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold font-headline text-foreground">Relatórios Financeiros</h1>
          <div className="flex gap-2">
            <Select>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Mensal</SelectItem>
                <SelectItem value="quarterly">Trimestral</SelectItem>
                <SelectItem value="annual">Anual</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" /> Exportar PDF
            </Button>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Resumo de Despesas por Categoria (Mês Atual)</CardTitle>
            <CardDescription>Distribuição das suas despesas no mês corrente.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Valor (R$)</TableHead>
                  <TableHead className="text-right">Porcentagem (%)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleReportData.map(item => (
                  <TableRow key={item.category}>
                    <TableCell className="font-medium">{item.category}</TableCell>
                    <TableCell className="text-right">{item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right">{item.percentage.toFixed(1)}%</TableCell>
                  </TableRow>
                ))}
                 <TableRow className="font-bold bg-muted/50">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">{(sampleReportData.reduce((sum, item) => sum + item.amount, 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right">100.0%</TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Evolução Mensal (Receitas vs. Despesas)</CardTitle>
            <CardDescription>Comparativo de entradas e saídas nos últimos meses.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] p-2">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sampleMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
                <RechartsTooltip
                  cursor={{ fill: 'hsl(var(--accent))', opacity: 0.1 }}
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                  labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{fontSize: "12px", paddingTop: '10px'}}/>
                <Bar dataKey="income" fill="hsl(var(--chart-1))" name="Receitas" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="hsl(var(--chart-2))" name="Despesas" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Relatório de Fluxo de Caixa Detalhado</CardTitle>
            <CardDescription>Lista de todas as transações no período selecionado.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Funcionalidade de relatório detalhado em desenvolvimento. Aqui será exibida uma tabela completa com filtros avançados.</p>
            <img src="https://placehold.co/800x300.png" alt="Placeholder para relatório detalhado" data-ai-hint="financial report" className="mt-4 rounded-md object-cover w-full"/>
          </CardContent>
        </Card>

      </div>
    </AppShell>
  );
}
