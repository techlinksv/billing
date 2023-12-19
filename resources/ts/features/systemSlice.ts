/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Country, SystemState, Warehouse } from '../types'

import { getSystemStorage, setCountryList, setWarehouse } from './utils'

const initialState: SystemState = getSystemStorage()

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    setCurrentWarehouse: (state, action: PayloadAction<Warehouse>) => {
      state.warehouse = action.payload
      setWarehouse(action.payload)
    },
    setCurrentCountry: (state, action: PayloadAction<Country>) => {
      state.country = action.payload
    },
    setCountriesList: (state, action: PayloadAction<Country[]>) => {
      state.countries = action.payload
      setCountryList(action.payload)
    },
    cleanSystem: state => {
      state.warehouse = {} as Warehouse
    },
  },
})

export const {
  // dispatchs
  setCurrentWarehouse,
  setCurrentCountry,
  cleanSystem,
  setCountriesList,
} = systemSlice.actions

export default systemSlice.reducer
