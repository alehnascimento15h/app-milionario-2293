'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Zap, CreditCard, Smartphone, Copy, Check } from 'lucide-react';
import Link from 'next/link';

function CobrancaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref');
  
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    telefone: '',
  });

  useEffect(() => {
    // Verificar se usuário está autenticado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push(`/auth${refCode ? `?ref=${refCode}` : ''}`);
        return;
      }
      setUserData(prev => ({ ...prev, email: session.user.email || '' }));
    });
  }, [router, refCode]);

  const pixCode = 'PIX_CODIGO_EXEMPLO_12345678901234567890';
  const pixQRCode = 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' + encodeURIComponent(pixCode);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePixPayment = async () => {
    setLoading(true);
    try {
      // Aqui você integraria com API de pagamento real (Mercado Pago, Stripe, etc)
      alert('Aguardando confirmação do pagamento PIX...');
      
      // Simular processamento
      setTimeout(() => {
        alert('Pagamento confirmado! Redirecionando para completar cadastro...');
        router.push(`/cadastro${refCode ? `?ref=${refCode}` : ''}`);
      }, 2000);
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCardPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Aqui você integraria com API de pagamento real (Mercado Pago, Stripe, etc)
      alert('Processando pagamento...');
      
      // Simular processamento
      setTimeout(() => {
        alert('Pagamento aprovado! Redirecionando para completar cadastro...');
        router.push(`/cadastro${refCode ? `?ref=${refCode}` : ''}`);
      }, 2000);
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

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
        <div className="max-w-4xl mx-auto">
          {/* Resumo do Plano */}
          <div className="bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl p-8 text-white mb-8 shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">Plano Milionário</h2>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-5xl font-bold">R$ 200</span>
              <span className="text-emerald-100">investimento único</span>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 text-sm">✓</span>
                  </div>
                  <span className="font-semibold">R$ 100 por indicação</span>
                </div>
                <p className="text-emerald-100 text-sm ml-9">Ganhe dinheiro real</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 text-sm">✓</span>
                  </div>
                  <span className="font-semibold">Link exclusivo</span>
                </div>
                <p className="text-emerald-100 text-sm ml-9">Compartilhe e lucre</p>
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

          {/* Métodos de Pagamento */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Escolha a forma de pagamento
            </h3>

            {/* Tabs */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setPaymentMethod('pix')}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                  paymentMethod === 'pix'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Smartphone className="w-5 h-5 inline mr-2" />
                PIX
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <CreditCard className="w-5 h-5 inline mr-2" />
                Cartão
              </button>
            </div>

            {/* PIX Payment */}
            {paymentMethod === 'pix' && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6 text-center">
                  <p className="text-gray-700 mb-4 font-medium">
                    Escaneie o QR Code ou copie o código PIX
                  </p>
                  
                  <div className="bg-white p-4 rounded-xl inline-block mb-4 shadow-md">
                    <img 
                      src={pixQRCode} 
                      alt="QR Code PIX" 
                      className="w-64 h-64"
                    />
                  </div>

                  <div className="bg-white rounded-xl p-4 border-2 border-dashed border-gray-300">
                    <p className="text-xs text-gray-500 mb-2">Código PIX Copia e Cola</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-sm bg-gray-50 p-3 rounded-lg overflow-x-auto text-left">
                        {pixCode}
                      </code>
                      <button
                        onClick={handleCopyPix}
                        className="p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePixPayment}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Verificando pagamento...
                    </div>
                  ) : (
                    'Já paguei via PIX'
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Após o pagamento, clique no botão acima para confirmar
                </p>
              </div>
            )}

            {/* Card Payment */}
            {paymentMethod === 'card' && (
              <form onSubmit={handleCardPayment} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número do Cartão *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome no Cartão *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="NOME COMO ESTÁ NO CARTÃO"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Validade *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/AA"
                      maxLength={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="000"
                      maxLength={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CPF do Titular *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="000.000.000-00"
                    maxLength={14}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processando...
                    </div>
                  ) : (
                    'Pagar R$ 200,00'
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Pagamento seguro e criptografado
                </p>
              </form>
            )}
          </div>

          {/* Garantia */}
          <div className="mt-8 bg-emerald-50 rounded-xl p-6 border border-emerald-200">
            <h4 className="font-bold text-emerald-900 mb-2 text-center">
              🔒 Pagamento 100% Seguro
            </h4>
            <p className="text-emerald-700 text-sm text-center">
              Seus dados estão protegidos com criptografia de ponta a ponta
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CobrancaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    }>
      <CobrancaContent />
    </Suspense>
  );
}
