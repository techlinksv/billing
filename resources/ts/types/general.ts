export type PaymentType = 'credito' | 'efectivo'
export type MovementType = 'salida' | 'entrada'
export type CategoryType = 'egreso' | 'ingreso'
export type CategoryPaymentType = 'cheque' | 'efectivo'

export interface Country {
  id: ID
  country: string
  country_code: string
  currency: string
  document_1?: string
  document_2?: string
  document_3?: string
  mask_1?: string
  mask_2?: string
  mask_3?: string
  comments: string
  iva: string
  tax: string
  tax_percentage: number
}

export interface SystemState {
  serverUrl: string
  country: Country
  countries: Country[]
  warehouse: Warehouse
}

export interface Warehouse {
  id: number
  name: string
  created_at: string
  updated_at: string
  country_id: number
  bills_counter: number
  bills_from: number
  bills_to: number
  movements_counter: number
  movements_from: number
  movements_to: number
}

export interface Client {
  id?: ID
  first_name: string
  last_name: string
  phone: string
  email: string
  document_1?: string
  document_2?: string
  document_3?: string
  comments: string
  country_id?: ID
  credit_limit?: number
  company: string
  address: string
  phone_2?: string
  available_credit?: number
  debt?: number
  used_credit_expired?: number
}

export interface ClientList {
  id: ID
  active_credits: Credit[]
  active_credits_count: number
  available_credit: number
  company: string
  credit_limit: number
  due_credits: number
  first_name: string
  last_name: string
  country_id: ID
  document_1?: string
  document_2?: string
}

export interface Product {
  id?: ID
  comments?: string
  country_id?: ID
  description?: string
  name: string
  price: number
  quantity: number
  size: string
  sku: string
  units: string
  created_at: string
  updated_at: string
  batch_id: ID
}

export interface Item {
  id: number
  order_id: number
  batch_id: number
  quantity: number
  product: Product
  price: number
  cost: number
  created_at: string
}

export interface Order {
  client_company: string
  client_first_name: string
  client_last_name: string
  client_document_1: string
  client_document_2: string
  payment_type: PaymentType
  client_id: ID
  client: Client
  updated_at: string
  created_at: string
  items: Item[]
  bill_number: ID
  id: ID
  tax: number
  iva: number
  total: number
  debt: number
}

export interface Credit {
  id: number
  order: Order
  amount: number
  debt: number
  expire_at: string
  state: string
  comments: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: ID
  amount: number
  bill_number?: ID
  comments: string
  created_at: string
  credit: Credit
  credit_id: ID
  order_id: ID
}

export interface Movement {
  id: ID
  type: MovementType
  batch_id: ID
  movement_number: number
  canceled: boolean
}

export interface TransactionCategory {
  category: string
  comments: string
  country_id: ID
  id: ID
  type: CategoryType
}

export interface IShoppingListItem {
  sku: string
  price: number
  quantity: number
  product_id: ID
}

export interface IListToLoadItem {
  sku: string
  comments: string
  quantity: number
  product_id: ID
  product_name: string
  type?: MovementType
}

export interface ICreateOrder {
  client_company?: string
  client_first_name: string
  client_last_name: string
  client_document_1?: string
  client_document_2?: string
  payment_type: PaymentType
  credit_date?: string
  client_id?: ID
  warehouse_id: ID
  items: IShoppingListItem[]
  country_id?: ID
  has_iva: boolean
  has_tax: boolean
  tax: number
  debt?: number
}

export interface ICreatePayments {
  client_id: ID
  amount: number
  comments: string
}

export interface ICreatePayment {
  credit_id: ID
  amount: number
  comments: string
}

export interface ICreateMovement {
  batch_id: ID
  quantity: number
  type: MovementType
  movement_id?: ID
  comments?: string
  product_id: ID
}

export interface ICreateMovements {
  list: IListToLoadItem[]
  warehouse_id: ID
}

export interface ICreateCredit {
  amount: number
  state: string
  order_id?: ID
  expire_at: string
}

export interface ICreateTransaction {
  country_id: ID
  amount: number
  type: CategoryType
  method: CategoryPaymentType
  check_number: string
  category_id: ID
  bank: string
  date: string
  reason: string
}

export interface IDebtsTotal {
  pending: number
  pending_expired: number
  paid: number
}

export interface ISalesTotal {
  total: number
  total_anulado: number
  total_cost: number
  total_credito: number
  total_efectivo: number
  total_pagos: number
  total_pagos_anulados: number
}

export interface IProductsReportResponse {
  country_id: ID
  id: ID
  name: string
  quantity: number
  sales: number
  sku: string
  units: string
}
