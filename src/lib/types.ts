export interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  dataCadastro: Date;
  codigoIndicacao: string;
  indicadoPor?: string;
  planoAtivo: boolean;
}

export interface Comissao {
  id: string;
  usuarioId: string;
  indicadoNome: string;
  indicadoEmail: string;
  valor: number;
  data: Date;
  status: 'pendente' | 'pago';
}

export interface Saque {
  id: string;
  usuarioId: string;
  valor: number;
  dataSolicitacao: Date;
  status: 'pendente' | 'processando' | 'concluido' | 'cancelado';
  metodoPagamento: string;
  dadosPagamento: string;
}
