export type Modelo = "911" | "Cayenne" | "Macan" | "Taycan" | "Panamera";
export type MetodoPagamento = "PIX" | "Financiamento" | "Transferência" | "Cartão de Crédito";

export interface Sale {
  id: number;
  modelo: string;
  cidade: string;
  estado: string;
  ano: number;
  preco: number;
  metodoPagamento: string;
}

export interface SalesFilters {
  modelo: string;
  cidade: string;
  ano: string;
  pagamento: string;
  search: string;
}
