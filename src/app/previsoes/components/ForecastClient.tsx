// src/app/previsoes/components/ForecastClient.tsx
"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, BrainCircuit } from 'lucide-react';
import { predictFutureCashFlow, type PredictFutureCashFlowInput, type PredictFutureCashFlowOutput } from '@/ai/flows/predict-future-cashflow';
import { useToast } from "@/hooks/use-toast";

export function ForecastClient() {
  const { toast } = useToast();
  const [historicalData, setHistoricalData] = useState('');
  const [financialGoals, setFinancialGoals] = useState('');
  const [predictionHorizon, setPredictionHorizon] = useState('next month');
  const [isLoading, setIsLoading] = useState(false);
  const [forecastResult, setForecastResult] = useState<PredictFutureCashFlowOutput | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setForecastResult(null);

    if (!historicalData.trim()) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, insira os dados históricos.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    if (!financialGoals.trim()) {
       toast({
        title: "Erro de Validação",
        description: "Por favor, defina suas metas financeiras.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }


    const input: PredictFutureCashFlowInput = {
      historicalData,
      financialGoals,
      predictionHorizon,
    };

    try {
      const result = await predictFutureCashFlow(input);
      setForecastResult(result);
      toast({
        title: "Previsão Gerada!",
        description: "Sua previsão de fluxo de caixa está pronta.",
      });
    } catch (error) {
      console.error("Error generating forecast:", error);
      toast({
        title: "Erro ao Gerar Previsão",
        description: "Houve um problema ao contatar o serviço de IA. Tente novamente mais tarde.",
        variant: "destructive",
      });
      setForecastResult({ predictedCashFlow: "Não foi possível gerar a previsão. Por favor, tente novamente." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            Formulário de Previsão de Fluxo de Caixa
          </CardTitle>
          <CardDescription>
            Forneça seus dados históricos e metas para que nossa IA possa prever seu fluxo de caixa futuro.
            Os dados históricos devem estar em formato CSV, por exemplo: data,renda,despesa (2023-01-01,5000,2000).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="historicalData" className="font-medium text-base">Dados Históricos (CSV)</Label>
              <Textarea
                id="historicalData"
                value={historicalData}
                onChange={(e) => setHistoricalData(e.target.value)}
                placeholder="Ex: data,renda,despesa\n2023-01-01,5000,2000\n2023-01-15,,300\n2023-02-01,5100,2100"
                rows={6}
                className="mt-1 text-sm"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Insira dados de renda e despesa ao longo do tempo. Deixe em branco se não aplicável (ex: ,,300 para uma despesa sem renda na data).</p>
            </div>
            <div>
              <Label htmlFor="financialGoals" className="font-medium text-base">Metas Financeiras</Label>
              <Textarea
                id="financialGoals"
                value={financialGoals}
                onChange={(e) => setFinancialGoals(e.target.value)}
                placeholder="Ex: Economizar para uma viagem, comprar um carro, quitar dívidas."
                rows={3}
                className="mt-1 text-sm"
                required
              />
            </div>
            <div>
              <Label htmlFor="predictionHorizon" className="font-medium text-base">Horizonte de Previsão</Label>
              <Select value={predictionHorizon} onValueChange={setPredictionHorizon}>
                <SelectTrigger id="predictionHorizon" className="mt-1 text-sm">
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="next month">Próximo Mês</SelectItem>
                  <SelectItem value="next quarter">Próximo Trimestre</SelectItem>
                  <SelectItem value="next year">Próximo Ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto text-base py-3 px-6">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Gerando Previsão...
                </>
              ) : (
                'Gerar Previsão com IA'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {forecastResult && (
        <Card className="shadow-xl animate-fadeIn bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                <BrainCircuit className="h-7 w-7" />
                Resultado da Previsão
            </CardTitle>
            <CardDescription>Insights gerados pela Inteligência Artificial para o período de {predictionHorizon}.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap text-foreground/90 text-base leading-relaxed">
              {forecastResult.predictedCashFlow}
            </div>
          </CardContent>
        </Card>
      )}
       <style jsx global>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .prose { /* Basic prose styling for markdown-like content */
          line-height: 1.6;
        }
        .prose h1, .prose h2, .prose h3 {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        .prose p {
          margin-bottom: 1em;
        }
        .prose ul, .prose ol {
          margin-left: 1.5em;
          margin-bottom: 1em;
        }
        .prose li {
          margin-bottom: 0.25em;
        }
        .prose strong {
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}
