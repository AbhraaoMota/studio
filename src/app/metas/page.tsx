"use client";

import AppShell from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { FinancialGoal } from '@/lib/types';
import { PlusCircle, Target, Edit3, Trash2, CalendarIcon, DollarSign } from 'lucide-react';
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const initialGoals: FinancialGoal[] = [
  { id: '1', name: 'Viagem para Europa', targetAmount: 15000, currentAmount: 9000, targetDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date().toISOString() },
  { id: '2', name: 'Reserva de Emergência', targetAmount: 10000, currentAmount: 8500, createdAt: new Date().toISOString() },
  { id: '3', name: 'Novo Notebook', targetAmount: 7000, currentAmount: 1500, targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date().toISOString() },
];

const GoalCard = ({ goal, onEdit, onDelete }: { goal: FinancialGoal, onEdit: (goal: FinancialGoal) => void, onDelete: (id: string) => void }) => {
  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline flex items-center gap-2"><Target className="text-primary h-5 w-5" /> {goal.name}</CardTitle>
            <CardDescription>
              Meta: R$ {goal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              {goal.targetDate && ` até ${format(new Date(goal.targetDate), "dd/MM/yyyy", { locale: ptBR })}`}
            </CardDescription>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(goal)}><Edit3 className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(goal.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2 text-sm">
          Progresso: <span className="font-semibold">R$ {goal.currentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span> ({progress.toFixed(1)}%)
        </div>
        <Progress value={progress} className="h-3" />
      </CardContent>
       <CardFooter className="text-xs text-muted-foreground">
        Criada em: {format(new Date(goal.createdAt), "dd/MM/yyyy", { locale: ptBR })}
      </CardFooter>
    </Card>
  );
};

export default function MetasPage() {
  const { toast } = useToast();
  const [goals, setGoals] = useState<FinancialGoal[]>(initialGoals);
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState<Date | undefined>();
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName || !targetAmount) {
      toast({ title: "Erro", description: "Nome da meta e valor alvo são obrigatórios.", variant: "destructive" });
      return;
    }
    const numTargetAmount = parseFloat(targetAmount);
    const numCurrentAmount = parseFloat(currentAmount || '0');

    if (isNaN(numTargetAmount) || numTargetAmount <= 0) {
      toast({ title: "Erro", description: "Valor alvo inválido.", variant: "destructive" });
      return;
    }
     if (isNaN(numCurrentAmount) || numCurrentAmount < 0) {
      toast({ title: "Erro", description: "Valor atual inválido.", variant: "destructive" });
      return;
    }


    if (isEditing) {
      setGoals(goals.map(g => g.id === isEditing ? { ...g, name: goalName, targetAmount: numTargetAmount, currentAmount: numCurrentAmount, targetDate: targetDate?.toISOString() } : g));
      toast({ title: "Sucesso", description: "Meta atualizada!" });
      setIsEditing(null);
    } else {
      const newGoal: FinancialGoal = {
        id: Date.now().toString(),
        name: goalName,
        targetAmount: numTargetAmount,
        currentAmount: numCurrentAmount,
        targetDate: targetDate?.toISOString(),
        createdAt: new Date().toISOString(),
      };
      setGoals([newGoal, ...goals]);
      toast({ title: "Sucesso", description: "Nova meta adicionada!" });
    }
    // Reset form
    setGoalName('');
    setTargetAmount('');
    setCurrentAmount('');
    setTargetDate(undefined);
  };

  const handleEdit = (goal: FinancialGoal) => {
    setIsEditing(goal.id);
    setGoalName(goal.name);
    setTargetAmount(goal.targetAmount.toString());
    setCurrentAmount(goal.currentAmount.toString());
    setTargetDate(goal.targetDate ? new Date(goal.targetDate) : undefined);
  };

  const handleDelete = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
     toast({ title: "Sucesso", description: "Meta excluída." });
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold font-headline text-foreground">Metas Financeiras</h1>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">{isEditing ? 'Editar Meta' : 'Nova Meta Financeira'}</CardTitle>
            <CardDescription>Defina e acompanhe seus objetivos financeiros.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="goalName" className="font-medium">Nome da Meta</Label>
                  <Input id="goalName" value={goalName} onChange={e => setGoalName(e.target.value)} placeholder="Ex: Viagem de Férias" className="mt-1" />
                </div>
                 <div>
                  <Label htmlFor="targetAmount" className="font-medium">Valor Alvo (R$)</Label>
                  <Input id="targetAmount" type="number" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} placeholder="Ex: 5000.00" className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                  <Label htmlFor="currentAmount" className="font-medium">Valor Atual (R$) <span className="text-xs text-muted-foreground">(Opcional)</span></Label>
                  <Input id="currentAmount" type="number" value={currentAmount} onChange={e => setCurrentAmount(e.target.value)} placeholder="Ex: 500.00" className="mt-1" />
                </div>
                <div>
                    <Label htmlFor="targetDate" className="font-medium">Data Alvo <span className="text-xs text-muted-foreground">(Opcional)</span></Label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={`w-full justify-start text-left font-normal mt-1 ${!targetDate && "text-muted-foreground"}`}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {targetDate ? format(targetDate, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={targetDate}
                            onSelect={setTargetDate}
                            initialFocus
                            locale={ptBR}
                        />
                        </PopoverContent>
                    </Popover>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                 {isEditing && <Button type="button" variant="outline" onClick={() => { setIsEditing(null); setGoalName(''); setTargetAmount(''); setCurrentAmount(''); setTargetDate(undefined); }}>Cancelar Edição</Button>}
                <Button type="submit">
                  <PlusCircle className="mr-2 h-4 w-4" /> {isEditing ? 'Salvar Alterações' : 'Adicionar Meta'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.length > 0 ? goals.map(goal => (
            <GoalCard key={goal.id} goal={goal} onEdit={handleEdit} onDelete={handleDelete} />
          )) : (
            <Card className="md:col-span-2 lg:col-span-3 shadow-lg">
              <CardContent className="text-center py-12">
                <Target className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhuma meta financeira definida ainda.</p>
                <p className="text-sm text-muted-foreground">Comece adicionando sua primeira meta no formulário acima!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
