import { configureStore } from '@reduxjs/toolkit'

import systemReducer from './features/systemSlice'
import userReducer from './features/userSlice'
import { apiSlice } from './features/API'

export const store = configureStore({
  reducer: {
    system: systemReducer,
    currentUser: userReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
