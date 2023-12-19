import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import {
  AuthResponse,
  Client,
  Warehouse,
  Product,
  Order,
  ICreateOrder,
  ClientList,
  ICreatePayment,
  Payment,
  ICreateMovement,
  ICreateCredit,
  Credit,
  Country,
  TransactionCategory,
  ICreateTransaction,
  User,
  IDebtsTotal,
  ISalesTotal,
  IProductsReportResponse,
  Movement,
  ICreateMovements,
  ICreatePayments,
} from '../types'

import { getServerUrl, getTokenHeader, getWarehouse } from './utils'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: getServerUrl(),
    prepareHeaders: headers => {
      const token = getTokenHeader()
      if (token) {
        headers.set('Authorization', token)
      }

      return headers
    },
  }),
  endpoints: builder => ({
    // MUTATIONS
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: body => ({
        url: '/login',
        method: 'POST',
        body,
      }),
    }),
    createClient: builder.mutation<{ data: Client }, Client>({
      query: body => ({
        url: '/clients',
        method: 'POST',
        body,
      }),
    }),
    updateClient: builder.mutation<{ data: Client }, Client>({
      query: body => ({
        url: `/clients/${body.id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteClient: builder.mutation<{ message: string }, ID>({
      query: id => ({
        url: `/clients/${id}`,
        method: 'DELETE',
      }),
    }),
    createProduct: builder.mutation<{ data: Product }, Product>({
      query: body => ({
        url: '/products',
        method: 'POST',
        body,
        params: { warehouse_id: getWarehouse().id },
      }),
    }),
    updateProduct: builder.mutation<{ data: Product }, Product>({
      query: body => ({
        url: `/products/${body.id}`,
        method: 'PUT',
        body,
        params: { warehouse_id: getWarehouse().id },
      }),
    }),
    deleteProduct: builder.mutation<{ message: string }, ID>({
      query: id => ({
        url: `/products/${id}`,
        method: 'DELETE',
        params: { warehouse_id: getWarehouse().id },
      }),
    }),
    createOrder: builder.mutation<{ data: Order }, ICreateOrder>({
      query: body => ({
        url: '/orders',
        method: 'POST',
        body,
        params: { warehouse_id: getWarehouse().id },
      }),
    }),
    updateOrder: builder.mutation<{ data: Order }, { id: ID; state: string }>({
      query: body => ({
        url: `/orders/${body.id}`,
        method: 'PUT',
        body,
        params: { warehouse_id: getWarehouse().id },
      }),
    }),
    createPayments: builder.mutation<{ data: Payment }, ICreatePayments>({
      query: body => ({
        url: '/payments-store',
        method: 'POST',
        body,
        params: { warehouse_id: getWarehouse().id },
      }),
    }),
    createPayment: builder.mutation<{ data: Payment }, ICreatePayment>({
      query: body => ({
        url: '/payments',
        method: 'POST',
        body,
        params: { warehouse_id: getWarehouse().id },
      }),
    }),
    deletePayment: builder.mutation<{ message: string }, ID>({
      query: id => ({
        url: `/payments/${id}`,
        method: 'DELETE',
        params: { warehouse_id: getWarehouse().id },
      }),
    }),
    createMovement: builder.mutation<{ data: Movement }, ICreateMovement>({
      query: body => ({
        url: '/movements',
        method: 'POST',
        body,
        params: { warehouse_id: getWarehouse().id },
      }),
    }),
    createMovements: builder.mutation<{ data: Movement[] }, ICreateMovements>({
      query: body => ({
        url: '/movements-list',
        method: 'POST',
        body,
        params: { warehouse_id: getWarehouse().id },
      }),
    }),
    createCredit: builder.mutation<{ data: Credit }, ICreateCredit>({
      query: body => ({
        url: '/credits',
        method: 'POST',
        body,
        params: { warehouse_id: getWarehouse().id },
      }),
    }),
    updateCredit: builder.mutation<{ data: Credit }, { id: ID; expire_at?: string }>({
      query: body => ({
        url: `/credits/${body.id}`,
        method: 'PUT',
        body,
      }),
    }),
    createTransaction: builder.mutation<{ data: Warehouse }, ICreateTransaction>({
      query: body => ({
        url: '/transactions',
        method: 'POST',
        body,
      }),
    }),
    deleteTransaction: builder.mutation<{ message: string }, ID>({
      query: id => ({
        url: `/transactions/${id}`,
        method: 'DELETE',
      }),
    }),
    uploadProducts: builder.mutation<{ message: string }, FormData>({
      query: body => ({
        url: '/products-import',
        method: 'POST',
        body,
      }),
    }),
    // QUERIES
    getWarehouses: builder.query<{ data: Warehouse[] }, void>({
      query: () => '/warehouses',
      keepUnusedDataFor: 5,
    }),
    getWarehouse: builder.query<{ data: Warehouse }, ID>({
      query: id => `/warehouses/${id}`,
      keepUnusedDataFor: 1,
    }),
    getClient: builder.query<{ data: Client }, ID>({
      query: id => `/clients/${id}`,
      keepUnusedDataFor: 10,
    }),
    getProduct: builder.query<{ data: Product }, ID>({
      query: id => ({
        url: `/products/${id}`,
        params: { warehouse_id: getWarehouse().id },
      }),
      keepUnusedDataFor: 10,
    }),
    getProducts: builder.query<Product[], void>({
      query: () => `/products-list?warehouse_id=${getWarehouse().id}`,
      keepUnusedDataFor: 2,
    }),
    getCountries: builder.query<{ data: Country[] }, void>({
      query: () => `/countries`,
      keepUnusedDataFor: 5,
    }),
    getClients: builder.query<ClientList[], void>({
      query: () => '/clients-list',
      keepUnusedDataFor: 5,
    }),
    getCategories: builder.query<TransactionCategory[], void>({
      query: () => '/categories',
      keepUnusedDataFor: 10,
    }),
    getOrder: builder.query<{ data: Order }, ID>({
      query: id => `/orders/${id}`,
      keepUnusedDataFor: 10,
    }),
    getUsers: builder.query<{ data: User[] }, void>({
      query: () => '/users',
      keepUnusedDataFor: 3,
    }),
    getUser: builder.query<User, ID>({
      query: id => `/users/${id}`,
      keepUnusedDataFor: 1,
    }),
    getClientsCount: builder.query<number, ID>({
      query: id => `/clients-count?country_id=${id}`,
      keepUnusedDataFor: 3,
    }),
    // totals
    getInventoryTotal: builder.query<{ total: number }, ID>({
      query: id => `/report/batches-total?warehouse_id=${id}`,
      keepUnusedDataFor: 10,
    }),
    getProfitTotal: builder.query<{ total_earnings: number }, string>({
      query: params => `/report/earnings-total${params}`,
      keepUnusedDataFor: 10,
    }),
    getDebtsTotal: builder.query<IDebtsTotal, ID | undefined>({
      query: params => `/report/debts-total?client_id=${params}`,
      keepUnusedDataFor: 5,
    }),
    getSalesTotal: builder.query<ISalesTotal, string>({
      query: params => `/report/sales-total${params}`,
      keepUnusedDataFor: 2,
    }),
    // reports
    getProductsReport: builder.query<{ data: IProductsReportResponse[] }, string>({
      query: params => `/report/products?${params}`,
    }),
  }),
})

export const {
  // Mutations
  useLoginMutation,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateOrderMutation,
  useCreatePaymentMutation,
  useCreatePaymentsMutation,
  useCreateMovementMutation,
  useCreateMovementsMutation,
  useCreateCreditMutation,
  useUpdateOrderMutation,
  useDeletePaymentMutation,
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
  useUpdateCreditMutation,
  useUploadProductsMutation,
  // Queries
  useGetWarehousesQuery,
  useGetWarehouseQuery,
  useGetClientQuery,
  useLazyGetClientQuery,
  useGetProductQuery,
  useGetProductsQuery,
  useGetClientsQuery,
  useGetCountriesQuery,
  useGetCategoriesQuery,
  useGetOrderQuery,
  useGetUsersQuery,
  useGetUserQuery,
  useLazyGetClientsCountQuery,
  // totals
  useGetInventoryTotalQuery,
  useGetProfitTotalQuery,
  useGetDebtsTotalQuery,
  useLazyGetSalesTotalQuery,
  // reports
  useLazyGetProductsReportQuery,
} = apiSlice
