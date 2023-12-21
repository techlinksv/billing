import get from 'lodash/fp/get'

import { Country, UserState, Warehouse } from '../types'

export const getServerUrl = () => {
  if (process.env.NODE_ENV === 'production') return 'http://54.172.217.150/api'
  return 'http://localhost:8000/api'
}

export const setUserStorage = (userState: UserState) => {
  localStorage.setItem('user_state', JSON.stringify(userState))
}

export const getUserStorage = (): UserState => {
  const user = localStorage.getItem('user_state')

  if (!user) return {}

  return JSON.parse(user)
}

export const getTokenHeader = () => {
  const user = getUserStorage()

  if (user.token) return `Bearer ${user.token}`

  return ''
}

export const cleanupStorage = () => {
  localStorage.clear()
}

export const setWarehouse = (warehouse: Warehouse) => {
  localStorage.setItem('warehouse', JSON.stringify(warehouse))
}
export const getWarehouse = (): Warehouse => {
  const warehouse = localStorage.getItem('warehouse')

  if (!warehouse) return {} as Warehouse

  return JSON.parse(warehouse)
}

export const setCountryList = (list: Country[]) => {
  localStorage.setItem('country-list', JSON.stringify(list))
}
export const getCountriesList = (): Country[] => {
  const list = localStorage.getItem('country-list')

  if (!list) return [] as Country[]

  return JSON.parse(list)
}

export const getSystemStorage = () => {
  const currentUser = getUserStorage()
  const warehouse = getWarehouse()
  const countries = getCountriesList()

  return {
    serverUrl: getServerUrl(),
    country: get('data.country', currentUser),
    warehouse,
    countries,
  }
}
