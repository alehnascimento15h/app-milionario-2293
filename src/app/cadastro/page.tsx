'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowRight, Zap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function CadastroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref');
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'auth' | 'dados'>('auth');
  const [authId, setAuthId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
  });

  useEffect(() => {
    // Verificar se usuário já está autenticado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setAuthId(session.user.id);
        setFormData(prev => ({ ...prev, email: session.user.email || '' }));
        setStep('dados');
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!authId) {
        alert('Erro: Usuário não autenticado. Faça login primeiro.');
        router.push('/auth');
        return;
      }

      // Gerar código de indicação único
      const codigoIndicacao = `MR${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      // Inserir usuário no banco
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            auth_id: authId,
            nome: formData.nome,
            email: formData.email,
            telefone: formData.telefone,
            codigo_indicacao: codigoIndicacao,
            indicado_por: refCode || null,
            plano_ativo: true,
          },
        ])
        .select()
        .single();

      if (userError) throw userError;

      // Se foi indicado por alguém, criar comissão
      if (refCode) {
        // Buscar usuário que indicou usando maybeSingle()
        const { data: indicador, error: indicadorError } = await supabase
          .from('users')
          .select('id, nome')
          .eq('codigo_indicacao', refCode)
          .maybeSingle();

        if (!indicadorError && indicador) {
          // Criar comissão
          await supabase.from('comissoes').insert([
            {
              usuario_id: indicador.id,
              indicado_id: userData.id,
              indicado_nome: formData.nome,
              indicado_email: formData.email,
              valor: 100.00,
              status: 'pago',
            },
          ]);
        }
      }

      alert('Cadastro realizado com sucesso! Bem-vindo ao Milionário Rapidoooo! 🎉');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error);
      alert(`Erro ao cadastrar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'auth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Zap className="w-12 h-12 text-emerald-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Milionário Rapidoooo
            </h1>
          </div>
          
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Primeiro, faça login
            </h2>
            <p className="text-gray-600 mb-6">
              Você precisa estar autenticado para completar o cadastro
            </p>
            
            <Link
              href={`/auth${refCode ? `?ref=${refCode}` : ''}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Ir para Login
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 text-emerald-600" />
            <span className="text-sm text-gray-600">Voltar</span>
          </Link>
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-emerald-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Milionário Rapidoooo
            </h1>
          </div>
          <div className="w-20"></div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Informações do Plano */}
          <div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl p-8 text-white mb-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">Plano Milionário</h2>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-bold">R$ 200</span>
              <span className="text-emerald-100">investimento único</span>
            </div>
            <div className="space-y-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 text-sm">✓</span>
                </div>
                <span>Ganhe R$ 100 por cada amigo indicado</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 text-sm">✓</span>
                </div>
                <span>Link de indicação exclusivo</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 text-sm">✓</span>
                </div>
                <span>Dashboard com controle de comissões</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 text-sm">✓</span>
                </div>
                <span>Saque a partir de R$ 50</span>
              </div>
            </div>
          </div>

          {refCode && (
            <div className="mb-6 p-4 bg-emerald-50 rounded-xl border-2 border-emerald-300">
              <p className="text-emerald-700 text-center">
                🎉 <strong>Você foi indicado!</strong> Código: <strong>{refCode}</strong>
              </p>
            </div>
          )}

          {/* Formulário de Cadastro */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Complete seu cadastro
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Email da sua conta</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      Ativar Plano por R$ 200
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="text-xs text-gray-500 text-center mt-6">
              Ao continuar, você concorda com nossos termos de uso e política de privacidade
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CadastroPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    }>
      <CadastroContent />
    </Suspense>
  );
}
