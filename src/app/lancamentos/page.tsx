
"use client";

import AppShell from '@/components/AppShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Transaction, Category, incomeCategories, expenseCategories } from '@/lib/types';
import { getFromLocalStorage, saveToLocalStorage } from '@/lib/utils';
import { PlusCircle, Edit3, Trash2, CalendarIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const TRANSACTIONS_STORAGE_KEY = 'acontafacil-transactions';

export default function LancamentosPage() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState<Category | ''>('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [currentCategories, setCurrentCategories] = useState<Category[]>(expenseCategories);

  useEffect(() => {
    const loadedTransactions = getFromLocalStorage<Transaction[]>(TRANSACTIONS_STORAGE_KEY, []);
    setTransactions(loadedTransactions);
  }, []);

  useEffect(() => {
    saveToLocalStorage(TRANSACTIONS_STORAGE_KEY, transactions);
  }, [transactions]);

  useEffect(() => {
    setCurrentCategories(type === 'income' ? incomeCategories : expenseCategories);
    setCategory(''); 
  }, [type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category || !date) {
      toast({ title: "Erro", description: "Preencha todos os campos.", variant: "destructive" });
      return;
    }
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({ title: "Erro", description: "Valor inválido.", variant: "destructive" });
      return;
    }

    if (isEditing) {
      setTransactions(transactions.map(t => t.id === isEditing ? { ...t, description, amount: numericAmount, type, category, date: date.toISOString() } : t));
      toast({ title: "Sucesso", description: "Lançamento atualizado!" });
      setIsEditing(null);
    } else {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        description,
        amount: numericAmount,
        type,
        category,
        date: date.toISOString(),
      };
      setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
      toast({ title: "Sucesso", description: "Lançamento adicionado!" });
    }
    
    setDescription('');
    setAmount('');
    setType('expense');
    setCategory('');
    setDate(new Date());
  };

  const handleEdit = (transaction: Transaction) => {
    setIsEditing(transaction.id);
    setDescription(transaction.description);
    setAmount(transaction.amount.toString());
    setType(transaction.type);
    setCategory(transaction.category as Category);
    setDate(new Date(transaction.date));
  };

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast({ title: "Sucesso", description: "Lançamento excluído!" });
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold font-headline text-foreground">Lançamentos</h1>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">{isEditing ? 'Editar Lançamento' : 'Novo Lançamento'}</CardTitle>
            <CardDescription>Adicione ou edite suas transações financeiras aqui.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description" className="font-medium">Descrição</Label>
                  <Input id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Ex: Compra no mercado" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="amount" className="font-medium">Valor (R$)</Label>
                  <Input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Ex: 150.00" className="mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="type" className="font-medium">Tipo</Label>
                  <Select value={type} onValueChange={(value) => setType(value as 'income' | 'expense')}>
                    <SelectTrigger id="type" className="mt-1">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Despesa</SelectItem>
                      <SelectItem value="income">Receita</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category" className="font-medium">Categoria</Label>
                  <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
                    <SelectTrigger id="category" className="mt-1">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date" className="font-medium">Data</Label>
                   <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal mt-1 ${!date && "text-muted-foreground"}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                {isEditing && <Button type="button" variant="outline" onClick={() => { setIsEditing(null); setDescription(''); setAmount(''); setCategory(''); setDate(new Date()); }}>Cancelar Edição</Button>}
                <Button type="submit">
                  <PlusCircle className="mr-2 h-4 w-4" /> {isEditing ? 'Salvar Alterações' : 'Adicionar Lançamento'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Histórico de Lançamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Valor (R$)</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? transactions.map(t => (
                  <TableRow key={t.id}>
                    <TableCell>{format(new Date(t.date), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                    <TableCell className="font-medium">{t.description}</TableCell>
                    <TableCell>{t.category}</TableCell>
                    <TableCell className={`text-right font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'income' ? '+' : '-'} {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(t)} className="mr-1">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(t.id)} className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhum lançamento encontrado.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
