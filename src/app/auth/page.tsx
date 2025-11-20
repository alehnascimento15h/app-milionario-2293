'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Zap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const refCode = searchParams.get('ref');
  const isMounted = useRef(true);
  const isNavigating = useRef(false);
  const hasCheckedSession = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    // Verificar se usuário já está logado (apenas uma vez)
    const checkSession = async () => {
      if (hasCheckedSession.current) return;
      hasCheckedSession.current = true;

      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao verificar sessão:', error);
          if (isMounted.current) {
            setLoading(false);
          }
          return;
        }

        if (session && isMounted.current && !isNavigating.current) {
          isNavigating.current = true;
          router.replace(`/cobranca${refCode ? `?ref=${refCode}` : ''}`);
        } else if (isMounted.current) {
          setLoading(false);
        }
      } catch (err) {
        console.error('Erro ao verificar sessão:', err);
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    checkSession();

    // Listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session && isMounted.current && !isNavigating.current) {
        isNavigating.current = true;
        // Pequeno delay para garantir que a sessão está completamente estabelecida
        setTimeout(() => {
          if (isMounted.current) {
            router.replace(`/cobranca${refCode ? `?ref=${refCode}` : ''}`);
          }
        }, 100);
      }
    });

    return () => {
      isMounted.current = false;
      subscription.unsubscribe();
    };
  }, [router]);

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
        <div className="max-w-md mx-auto">
          {refCode && (
            <div className="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-sm text-emerald-700 text-center">
                🎉 Você foi indicado! Código: <strong>{refCode}</strong>
              </p>
            </div>
          )}

          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#059669',
                    brandAccent: '#047857',
                  },
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
              },
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Senha',
                  button_label: 'Entrar',
                  loading_button_label: 'Entrando...',
                  social_provider_text: 'Entrar com {{provider}}',
                  link_text: 'Já tem uma conta? Entre',
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Senha',
                  button_label: 'Criar conta',
                  loading_button_label: 'Criando conta...',
                  social_provider_text: 'Cadastrar com {{provider}}',
                  link_text: 'Não tem uma conta? Cadastre-se',
                },
              },
            }}
            providers={[]}
            redirectTo={typeof window !== 'undefined' ? `${window.location.origin}/cadastro${refCode ? `?ref=${refCode}` : ''}` : undefined}
          />

          {/* Benefícios */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-4">Ao se cadastrar você terá:</p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-2xl mb-1">💰</p>
                <p className="text-xs text-gray-600">R$ 100 por indicação</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-2xl mb-1">🔗</p>
                <p className="text-xs text-gray-600">Link exclusivo</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-2xl mb-1">📊</p>
                <p className="text-xs text-gray-600">Dashboard completo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
