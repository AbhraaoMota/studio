export interface Transaction {
  id: string;
  date: string; // ISO string
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string; // ISO string
  createdAt: string; // ISO string
}

export interface CashFlowDataPoint {
  month: string;
  income: number;
  expenses: number;
  balance?: number;
}

export type Category = 
  | 'Moradia' 
  | 'Transporte' 
  | 'Alimentação' 
  | 'Saúde' 
  | 'Educação' 
  | 'Lazer' 
  | 'Vestuário' 
  | 'Salário'
  | 'Investimentos'
  | 'Outras Receitas'
  | 'Outras Despesas';

export const expenseCategories: Category[] = ['Moradia', 'Transporte', 'Alimentação', 'Saúde', 'Educação', 'Lazer', 'Vestuário', 'Outras Despesas'];
export const incomeCategories: Category[] = ['Salário', 'Investimentos', 'Outras Receitas'];
export const allCategories: Category[] = [...incomeCategories, ...expenseCategories];
