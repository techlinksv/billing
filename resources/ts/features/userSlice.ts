/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { AuthResponse, UserState } from '../types'

import { cleanupStorage, getUserStorage, setUserStorage } from './utils'

const initialState: UserState = getUserStorage()

const userSlice = createSlice({
  name: 'current_user',
  initialState,
  reducers: {
    userLogged: (state, action: PayloadAction<AuthResponse>) => {
      state.data = action.payload.user
      state.token = action.payload.access_token

      setUserStorage(state)
    },
    logout: () => {
      cleanupStorage()
      return {}
    },
  },
})

export const { userLogged, logout } = userSlice.actions
export default userSlice.reducer
