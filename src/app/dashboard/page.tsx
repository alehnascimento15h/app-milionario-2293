'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, type User as DBUser, type Comissao as DBComissao } from '@/lib/supabase';
import { DollarSign, Users, TrendingUp, Copy, Check, ArrowRight, Wallet, Clock, Link as LinkIcon, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<DBUser | null>(null);
  const [copied, setCopied] = useState(false);
  const [saldoDisponivel, setSaldoDisponivel] = useState(0);
  const [totalIndicacoes, setTotalIndicacoes] = useState(0);
  const [showSaqueModal, setShowSaqueModal] = useState(false);
  const [valorSaque, setValorSaque] = useState('');
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [dadosPagamento, setDadosPagamento] = useState('');
  const [linkIndicacao, setLinkIndicacao] = useState('');
  const [comissoes, setComissoes] = useState<DBComissao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Verificar autenticação
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.error('Erro de sessão:', sessionError);
        router.push('/auth');
        return;
      }

      // Buscar dados do usuário usando maybeSingle() para evitar erro quando não há dados
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', session.user.id)
        .maybeSingle();

      if (userError) {
        console.error('Erro ao buscar usuário:', userError);
        // Se houver erro na query, redirecionar para cadastro
        router.push('/cadastro');
        return;
      }

      // Se não encontrou usuário, redirecionar para cadastro
      if (!userData) {
        console.log('Usuário não encontrado no banco, redirecionando para cadastro');
        router.push('/cadastro');
        return;
      }

      setUser(userData);

      // Gerar link de indicação
      const baseUrl = window.location.origin;
      setLinkIndicacao(`${baseUrl}/cadastro?ref=${userData.codigo_indicacao}`);

      // Buscar comissões
      const { data: comissoesData, error: comissoesError } = await supabase
        .from('comissoes')
        .select('*')
        .eq('usuario_id', userData.id)
        .order('data', { ascending: false });

      if (comissoesError) {
        console.error('Erro ao buscar comissões:', comissoesError);
        // Não bloqueia o dashboard se não conseguir buscar comissões
        setComissoes([]);
      } else if (comissoesData) {
        setComissoes(comissoesData);
        
        // Calcular totais
        const total = comissoesData.reduce((acc, c) => acc + Number(c.valor), 0);
        setSaldoDisponivel(total);
        setTotalIndicacoes(comissoesData.length);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Em caso de erro inesperado, redirecionar para auth
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (linkIndicacao) {
      navigator.clipboard.writeText(linkIndicacao);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaque = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      const { error } = await supabase.from('saques').insert([
        {
          usuario_id: user.id,
          valor: parseFloat(valorSaque),
          metodo_pagamento: metodoPagamento,
          dados_pagamento: dadosPagamento,
          status: 'pendente',
        },
      ]);

      if (error) throw error;

      alert(`Solicitação de saque de R$ ${valorSaque} enviada com sucesso! Processaremos em até 48h.`);
      setShowSaqueModal(false);
      setValorSaque('');
      setMetodoPagamento('');
      setDadosPagamento('');
    } catch (error: any) {
      console.error('Erro ao solicitar saque:', error);
      alert(`Erro ao solicitar saque: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Você precisa fazer o cadastro primeiro</p>
          <Link 
            href="/cadastro"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
          >
            Fazer Cadastro
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Milionário Rapidoooo
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Olá,</p>
                <p className="font-semibold text-gray-900">{user.nome}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Cards de Estatísticas */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Saldo Disponível */}
          <div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <Wallet className="w-8 h-8" />
              <span className="text-emerald-100 text-sm">Disponível</span>
            </div>
            <p className="text-4xl font-bold mb-2">R$ {saldoDisponivel.toFixed(2)}</p>
            <p className="text-emerald-100 text-sm">Saldo para saque</p>
          </div>

          {/* Total de Indicações */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-emerald-600" />
              <span className="text-gray-500 text-sm">Total</span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-2">{totalIndicacoes}</p>
            <p className="text-gray-600 text-sm">Amigos indicados</p>
          </div>

          {/* Lucro Total */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <span className="text-gray-500 text-sm">Lucro</span>
            </div>
            <p className="text-4xl font-bold text-gray-900 mb-2">R$ {(saldoDisponivel - 200).toFixed(2)}</p>
            <p className="text-gray-600 text-sm">Lucro líquido</p>
          </div>
        </div>

        {/* Link de Indicação */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <LinkIcon className="w-6 h-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-gray-900">Seu Link de Indicação</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Compartilhe este link com seus amigos e ganhe R$ 100,00 por cada indicação!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border-2 border-emerald-300">
              <p className="text-sm text-gray-600 mb-2">Seu link exclusivo:</p>
              <p className="text-sm font-mono text-emerald-700 break-all">{linkIndicacao}</p>
            </div>
            
            <button
              onClick={copyToClipboard}
              className="px-6 py-4 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 hover:scale-105"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copiar Link
                </>
              )}
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-sm text-blue-800">
              💡 <strong>Dica:</strong> Compartilhe este link nas suas redes sociais, WhatsApp ou por e-mail. 
              Quando alguém se cadastrar usando seu link, você ganha R$ 100 automaticamente!
            </p>
          </div>
        </div>

        {/* Botão de Saque */}
        <div className="mb-8">
          <button
            onClick={() => setShowSaqueModal(true)}
            disabled={saldoDisponivel < 50}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <DollarSign className="w-6 h-6" />
            Solicitar Saque
          </button>
          {saldoDisponivel < 50 && (
            <p className="text-center text-sm text-gray-500 mt-2">
              Saldo mínimo para saque: R$ 50,00
            </p>
          )}
        </div>

        {/* Histórico de Comissões */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Histórico de Comissões</h2>
          
          <div className="space-y-4">
            {comissoes.map((comissao) => (
              <div 
                key={comissao.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{comissao.indicado_nome}</p>
                    <p className="text-sm text-gray-600">{comissao.indicado_email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(comissao.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-xl font-bold text-emerald-600">
                    + R$ {Number(comissao.valor).toFixed(2)}
                  </p>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                    comissao.status === 'pago' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {comissao.status === 'pago' ? (
                      <>
                        <Check className="w-3 h-3" />
                        Pago
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        Pendente
                      </>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {comissoes.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma comissão ainda</p>
              <p className="text-sm text-gray-500 mt-2">
                Comece a indicar amigos para ganhar R$ 100 por indicação!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Saque */}
      {showSaqueModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Solicitar Saque</h3>
            
            <form onSubmit={handleSaque} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor do Saque
                </label>
                <input
                  type="number"
                  value={valorSaque}
                  onChange={(e) => setValorSaque(e.target.value)}
                  required
                  min="50"
                  max={saldoDisponivel}
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="R$ 0,00"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Disponível: R$ {saldoDisponivel.toFixed(2)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pagamento
                </label>
                <select
                  value={metodoPagamento}
                  onChange={(e) => setMetodoPagamento(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Selecione...</option>
                  <option value="pix">PIX</option>
                  <option value="transferencia">Transferência Bancária</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {metodoPagamento === 'pix' ? 'Chave PIX' : 'Dados Bancários'}
                </label>
                <input
                  type="text"
                  value={dadosPagamento}
                  onChange={(e) => setDadosPagamento(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder={metodoPagamento === 'pix' ? 'Digite sua chave PIX' : 'Ag: 0000 / CC: 00000-0'}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowSaqueModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all"
                >
                  Confirmar Saque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
