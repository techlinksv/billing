import { Country } from './general'

export type RoleType = 'admin' | 'vendedor' | 'encargado'

export interface Permission {
  id: ID
  model: string
  view: boolean
  browse: boolean
  create: boolean
  update: boolean
  delete: boolean
}

export interface Role {
  id: ID
  role: RoleType
  permisions: Permission[]
}

export interface User {
  id: ID
  name: string
  email: string
  country: Country
  role: Role
  country_id?: ID
  bills_counter: number
  bills_from: number
  bills_to: number
  payments_counter: number
  payments_from: number
  payments_to: number
}

export interface UserState {
  data?: User
  token?: string
}
