
"use client";

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Filter, Info } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Transaction, CashFlowDataPoint } from '@/lib/types';
import { getFromLocalStorage } from '@/lib/utils';
import { format, getMonth, getYear, startOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const TRANSACTIONS_STORAGE_KEY = 'acontafacil-transactions';

interface CategoryReportItem {
  category: string;
  amount: number;
  percentage: number;
}

export default function RelatoriosPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [reportDataByCategory, setReportDataByCategory] = useState<CategoryReportItem[]>([]);
  const [monthlyEvolutionData, setMonthlyEvolutionData] = useState<CashFlowDataPoint[]>([]);
  // const [selectedPeriod, setSelectedPeriod] = useState('monthly'); // For future filter implementation

  useEffect(() => {
    const loadedTransactions = getFromLocalStorage<Transaction[]>(TRANSACTIONS_STORAGE_KEY, []);
    setTransactions(loadedTransactions);
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      // Calculate expenses by category for the current month
      const now = new Date();
      const currentMonthNum = now.getMonth();
      const currentYearNum = now.getFullYear();
      
      const expensesThisMonth = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return t.type === 'expense' && 
               transactionDate.getMonth() === currentMonthNum &&
               transactionDate.getFullYear() === currentYearNum;
      });

      const categoryTotals: { [key: string]: number } = {};
      let totalExpensesThisMonth = 0;
      expensesThisMonth.forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        totalExpensesThisMonth += t.amount;
      });

      const categoryReport: CategoryReportItem[] = Object.entries(categoryTotals).map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpensesThisMonth > 0 ? (amount / totalExpensesThisMonth) * 100 : 0,
      })).sort((a,b) => b.amount - a.amount);
      setReportDataByCategory(categoryReport);

      // Calculate monthly evolution for the last 6 months
      const monthlyData: { [key: string]: { income: number; expenses: number } } = {};
      transactions.forEach(t => {
        const transactionDate = new Date(t.date);
        const monthYearKey = format(transactionDate, 'MMM/yy', { locale: ptBR });
        if (!monthlyData[monthYearKey]) {
          monthlyData[monthYearKey] = { income: 0, expenses: 0 };
        }
        if (t.type === 'income') {
          monthlyData[monthYearKey].income += t.amount;
        } else {
          monthlyData[monthYearKey].expenses += t.amount;
        }
      });

      const evolutionData: CashFlowDataPoint[] = [];
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(now, i);
        const monthYearKey = format(startOfMonth(date), 'MMM/yy', { locale: ptBR });
        evolutionData.push({
          month: monthYearKey,
          income: monthlyData[monthYearKey]?.income || 0,
          expenses: monthlyData[monthYearKey]?.expenses || 0,
        });
      }
      setMonthlyEvolutionData(evolutionData);
    } else {
      setReportDataByCategory([]);
      setMonthlyEvolutionData([]);
    }
  }, [transactions]);

  const totalReportAmount = reportDataByCategory.reduce((sum, item) => sum + item.amount, 0);

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold font-headline text-foreground">Relatórios Financeiros</h1>
          <div className="flex gap-2">
            <Select defaultValue="monthly" disabled> {/* Filter disabled for now */}
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Mês Atual</SelectItem>
                {/* <SelectItem value="quarterly">Trimestral</SelectItem>
                <SelectItem value="annual">Anual</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem> */}
              </SelectContent>
            </Select>
            <Button variant="outline" disabled> {/* Export disabled */}
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
            {reportDataByCategory.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Valor (R$)</TableHead>
                    <TableHead className="text-right">Porcentagem (%)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportDataByCategory.map(item => (
                    <TableRow key={item.category}>
                      <TableCell className="font-medium">{item.category}</TableCell>
                      <TableCell className="text-right">{item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-right">{item.percentage.toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="font-bold bg-muted/50">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">{totalReportAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                      <TableCell className="text-right">{totalReportAmount > 0 ? '100.0%' : '0.0%'}</TableCell>
                    </TableRow>
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
                <Info className="h-10 w-10 mb-2" />
                <p>Nenhuma despesa encontrada para o mês atual.</p>
                <p className="text-xs">Adicione lançamentos para ver este relatório.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Evolução Mensal (Receitas vs. Despesas)</CardTitle>
            <CardDescription>Comparativo de entradas e saídas nos últimos 6 meses.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] p-2">
            {monthlyEvolutionData.length > 0 && monthlyEvolutionData.some(d => d.income > 0 || d.expenses > 0) ? (
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyEvolutionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
                  <RechartsTooltip
                    cursor={{ fill: 'hsl(var(--accent))', opacity: 0.1 }}
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                    labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                    formatter={(value: number, name: string) => [`R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, name === 'income' ? 'Receitas' : 'Despesas']}
                  />
                  <Legend wrapperStyle={{fontSize: "12px", paddingTop: '10px'}}/>
                  <Bar dataKey="income" fill="hsl(var(--chart-1))" name="Receitas" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="hsl(var(--chart-2))" name="Despesas" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Info className="h-10 w-10 mb-2" />
                <p>Nenhum dado de evolução mensal disponível.</p>
                <p className="text-xs">Adicione lançamentos para ver o gráfico.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Relatório de Fluxo de Caixa Detalhado</CardTitle>
            <CardDescription>Lista de todas as transações (em desenvolvimento).</CardDescription>
          </CardHeader>
          <CardContent>
             {transactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Valor (R$)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 10).map(t => ( // Displaying first 10 transactions as a preview
                    <TableRow key={t.id}>
                      <TableCell>{format(new Date(t.date), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                      <TableCell className="font-medium">{t.description}</TableCell>
                      <TableCell>{t.category}</TableCell>
                      <TableCell>{t.type === 'income' ? 'Receita' : 'Despesa'}</TableCell>
                      <TableCell className={`text-right font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {t.type === 'income' ? '+' : '-'} {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
             ) : (
              <p className="text-muted-foreground py-4 text-center">Nenhum lançamento para exibir no relatório detalhado.</p>
             )}
            {transactions.length > 10 && <p className="text-muted-foreground text-sm mt-2 text-center">Exibindo os 10 lançamentos mais recentes. Funcionalidade completa em desenvolvimento.</p>}

          </CardContent>
        </Card>

      </div>
    </AppShell>
  );
}

