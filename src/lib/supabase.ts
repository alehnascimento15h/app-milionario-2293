import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos do banco de dados
export type User = {
  id: string;
  auth_id: string | null;
  nome: string;
  email: string;
  telefone: string | null;
  codigo_indicacao: string;
  indicado_por: string | null;
  plano_ativo: boolean;
  data_cadastro: string;
  created_at: string;
};

export type Comissao = {
  id: string;
  usuario_id: string;
  indicado_id: string | null;
  indicado_nome: string;
  indicado_email: string;
  valor: number;
  status: 'pendente' | 'pago';
  data: string;
  created_at: string;
};

export type Saque = {
  id: string;
  usuario_id: string;
  valor: number;
  metodo_pagamento: string;
  dados_pagamento: string;
  status: 'pendente' | 'processando' | 'concluido' | 'cancelado';
  data_solicitacao: string;
  data_processamento: string | null;
  created_at: string;
};
