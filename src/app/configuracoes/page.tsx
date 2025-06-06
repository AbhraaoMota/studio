import AppShell from '@/components/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BellRing, User, Palette, ShieldCheck } from 'lucide-react';

export default function ConfiguracoesPage() {
  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl sm:text-3xl font-bold font-headline text-foreground">Configurações</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><User className="h-5 w-5 text-primary" /> Perfil do Usuário</CardTitle>
              <CardDescription>Gerencie suas informações pessoais.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" defaultValue="Usuário Exemplo" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="usuario@exemplo.com" className="mt-1" />
              </div>
              <Button>Salvar Alterações</Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><BellRing className="h-5 w-5 text-primary" /> Notificações</CardTitle>
              <CardDescription>Personalize seus alertas e notificações.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="lowBalanceAlerts" className="flex flex-col">
                  <span>Alertas de Saldo Baixo</span>
                  <span className="text-xs text-muted-foreground">Receber notificações quando o saldo estiver baixo.</span>
                </Label>
                <Switch id="lowBalanceAlerts" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="dueDateAlerts" className="flex flex-col">
                  <span>Alertas de Vencimento</span>
                   <span className="text-xs text-muted-foreground">Lembretes para contas a vencer.</span>
                </Label>
                <Switch id="dueDateAlerts" defaultChecked />
              </div>
               <div className="flex items-center justify-between">
                <Label htmlFor="goalAlerts" className="flex flex-col">
                  <span>Alertas de Metas</span>
                   <span className="text-xs text-muted-foreground">Notificações sobre o progresso das suas metas.</span>
                </Label>
                <Switch id="goalAlerts" />
              </div>
              <Button>Salvar Preferências</Button>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><Palette className="h-5 w-5 text-primary" /> Aparência</CardTitle>
              <CardDescription>Customize a aparência do aplicativo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="darkMode" className="flex flex-col">
                  <span>Modo Escuro</span>
                   <span className="text-xs text-muted-foreground">Alternar para o tema escuro.</span>
                </Label>
                {/* ThemeToggle could be used here directly or a similar switch tied to its logic */}
                <Switch id="darkMode" /> 
              </div>
               <div>
                <Label htmlFor="primaryColor">Cor Primária (Em breve)</Label>
                <div className="flex items-center gap-2 mt-1">
                    <div className="w-8 h-8 rounded-full bg-primary border-2 border-primary-foreground shadow"></div>
                    <Input id="primaryColor" defaultValue="#5DADE2" disabled className="w-32" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Segurança e Privacidade</CardTitle>
              <CardDescription>Gerencie as configurações de segurança.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Button variant="outline">Alterar Senha</Button>
              </div>
              <div>
                <Button variant="outline">Autenticação de Dois Fatores (2FA)</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Para mais detalhes sobre como lidamos com seus dados, consulte nossa <a href="#" className="text-primary hover:underline">Política de Privacidade</a>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
