
"use client";

import React, { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingUp, TrendingDown, PlusCircle, Target as TargetIcon, Users, AlertCircle, Info, Bell } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import Link from 'next/link';
import { Transaction, FinancialGoal, CashFlowDataPoint } from '@/lib/types';
import { getFromLocalStorage } from '@/lib/utils';
import { format, getMonth, getYear, subMonths, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const TRANSACTIONS_STORAGE_KEY = 'acontafacil-transactions';
const GOALS_STORAGE_KEY = 'acontafacil-goals';

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
  const [totalIncomeMonth, setTotalIncomeMonth] = useState(0);
  const [totalExpenseMonth, setTotalExpenseMonth] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [chartData, setChartData] = useState<CashFlowDataPoint[]>([]);
  const [dashboardGoals, setDashboardGoals] = useState<FinancialGoal[]>([]);

  useEffect(() => {
    const loadedTransactions = getFromLocalStorage<Transaction[]>(TRANSACTIONS_STORAGE_KEY, []);
    const loadedGoals = getFromLocalStorage<FinancialGoal[]>(GOALS_STORAGE_KEY, []);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let incomeThisMonth = 0;
    let expenseThisMonth = 0;
    let totalIncome = 0;
    let totalExpense = 0;

    const monthlyData: { [key: string]: { income: number; expenses: number } } = {};

    loadedTransactions.forEach(t => {
      const transactionDate = new Date(t.date);
      const month = transactionDate.getMonth();
      const year = transactionDate.getFullYear();
      
      const monthYearKey = format(transactionDate, 'MMM/yy', { locale: ptBR });
      if (!monthlyData[monthYearKey]) {
        monthlyData[monthYearKey] = { income: 0, expenses: 0 };
      }

      if (t.type === 'income') {
        totalIncome += t.amount;
        if (month === currentMonth && year === currentYear) {
          incomeThisMonth += t.amount;
        }
        monthlyData[monthYearKey].income += t.amount;
      } else {
        totalExpense += t.amount;
        if (month === currentMonth && year === currentYear) {
          expenseThisMonth += t.amount;
        }
        monthlyData[monthYearKey].expenses += t.amount;
      }
    });

    setTotalIncomeMonth(incomeThisMonth);
    setTotalExpenseMonth(expenseThisMonth);
    setCurrentBalance(totalIncome - totalExpense);
    setDashboardGoals(loadedGoals.slice(0, 3)); // Display top 3 goals

    // Prepare chart data for the last 6 months
    const lastSixMonthsChartData: CashFlowDataPoint[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(now, i);
      const monthYearKey = format(startOfMonth(date), 'MMM/yy', { locale: ptBR });
      lastSixMonthsChartData.push({
        month: monthYearKey,
        income: monthlyData[monthYearKey]?.income || 0,
        expenses: monthlyData[monthYearKey]?.expenses || 0,
        balance: (monthlyData[monthYearKey]?.income || 0) - (monthlyData[monthYearKey]?.expenses || 0),
      });
    }
    setChartData(lastSixMonthsChartData);

  }, []);


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
          <KpiCard title="Receita Total (Mês)" value={totalIncomeMonth} icon={TrendingUp} description="Total de entradas no mês atual" />
          <KpiCard title="Despesa Total (Mês)" value={totalExpenseMonth} icon={TrendingDown} description="Total de saídas no mês atual" />
          <KpiCard title="Saldo Atual" value={currentBalance} icon={DollarSign} description="Saldo em todas as contas" />
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Fluxo de Caixa Mensal</CardTitle>
            <CardDescription>Visão geral das suas receitas e despesas (últimos 6 meses).</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] p-2">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
                  <RechartsTooltip
                    cursor={{ fill: 'hsl(var(--accent))', opacity: 0.1 }}
                    contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)' }}
                    labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                    formatter={(value: number, name: string) => [`R$ ${value.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, name === 'income' ? 'Receitas' : 'Despesas']}
                  />
                  <Legend wrapperStyle={{fontSize: "12px", paddingTop: '10px'}} />
                  <Bar dataKey="income" fill="hsl(var(--chart-1))" name="Receitas" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="hsl(var(--chart-2))" name="Despesas" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Info className="h-10 w-10 mb-2" />
                <p>Nenhum dado de fluxo de caixa disponível.</p>
                <p className="text-xs">Adicione lançamentos para ver o gráfico.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><TargetIcon className="h-5 w-5 text-primary" /> Metas Financeiras</CardTitle>
              <CardDescription>Acompanhe o progresso das suas metas.</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardGoals.length > 0 ? (
                <div className="space-y-4">
                  {dashboardGoals.map(goal => {
                    const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
                    return (
                      <div key={goal.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{goal.name}</span>
                          <span className="font-semibold">R$ {goal.currentAmount.toLocaleString('pt-BR', {minimumFractionDigits: 2})} / R$ {goal.targetAmount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                        </div>
                        <Progress value={progress} className="h-2.5" />
                         <p className="text-xs text-muted-foreground text-right">{progress.toFixed(1)}%</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  <TargetIcon className="h-8 w-8 mx-auto mb-2" />
                  <p>Nenhuma meta financeira para exibir aqui.</p>
                  <p className="text-xs">Crie metas na seção 'Metas Financeiras'.</p>
                </div>
              )}
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
              <div className="text-center text-muted-foreground py-4">
                <Bell className="h-8 w-8 mx-auto mb-2" />
                <p>Nenhum alerta recente.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
