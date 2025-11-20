'use client';

import { ArrowRight, Users, DollarSign, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-emerald-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              Milionário Rapidoooo
            </h1>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/auth"
              className="px-4 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Entrar
            </Link>
            <Link 
              href="/dashboard"
              className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            Ganhe R$ 100 por indicação
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Transforme suas <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">indicações</span> em dinheiro real
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Invista apenas R$ 200,00 e ganhe R$ 100,00 por cada amigo indicado. 
            Indique 2 amigos e recupere seu investimento. O resto é só lucro! 🤑
          </p>

          <Link 
            href="/auth"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Começar Agora
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="container mx-auto px-4 py-16 bg-white rounded-3xl shadow-xl mb-16">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Como Funciona?
        </h3>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-emerald-600" />
            </div>
            <h4 className="text-xl font-bold mb-3 text-gray-900">1. Invista R$ 200</h4>
            <p className="text-gray-600">
              Faça seu cadastro e ative seu plano por apenas R$ 200,00
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-xl font-bold mb-3 text-gray-900">2. Indique Amigos</h4>
            <p className="text-gray-600">
              Compartilhe seu link de indicação e ganhe R$ 100 por amigo
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-emerald-600" />
            </div>
            <h4 className="text-xl font-bold mb-3 text-gray-900">3. Lucre Sempre</h4>
            <p className="text-gray-600">
              Com 2 indicações você recupera o investimento. O resto é lucro!
            </p>
          </div>
        </div>
      </section>

      {/* Cálculo de Lucro */}
      <section className="container mx-auto px-4 py-16 mb-16">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-emerald-600 to-green-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
          <h3 className="text-3xl font-bold mb-8 text-center">Faça as Contas</h3>
          
          <div className="space-y-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/20">
              <span className="text-lg">Investimento inicial:</span>
              <span className="text-2xl font-bold">R$ 200,00</span>
            </div>
            
            <div className="flex justify-between items-center pb-4 border-b border-white/20">
              <span className="text-lg">2 indicações:</span>
              <span className="text-2xl font-bold text-emerald-200">+ R$ 200,00</span>
            </div>
            
            <div className="flex justify-between items-center pb-4 border-b border-white/20">
              <span className="text-lg">5 indicações:</span>
              <span className="text-2xl font-bold text-emerald-200">+ R$ 500,00</span>
            </div>
            
            <div className="flex justify-between items-center pb-4 border-b border-white/20">
              <span className="text-lg">10 indicações:</span>
              <span className="text-2xl font-bold text-emerald-200">+ R$ 1.000,00</span>
            </div>
            
            <div className="flex justify-between items-center pt-4">
              <span className="text-xl font-bold">Lucro com 10 indicações:</span>
              <span className="text-3xl font-bold text-yellow-300">R$ 800,00</span>
            </div>
          </div>
          
          <p className="text-center mt-8 text-emerald-100 text-lg">
            Quanto mais você indica, mais você ganha! 🚀
          </p>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h3 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
          Pronto para começar a lucrar?
        </h3>
        <p className="text-xl text-gray-600 mb-8">
          Junte-se a milhares de pessoas que já estão ganhando dinheiro
        </p>
        <Link 
          href="/auth"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          Cadastrar Agora
          <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© 2024 Milionário Rapidoooo. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
