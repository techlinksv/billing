import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

import { Layout } from './components'
import { useCheckPermission } from './common'
import {
  Login,
  Error,
  Home,
  ClientsList,
  EditClient,
  AddClient,
  AddProduct,
  ProductList,
  EditProduct,
  EditCredit,
  CreditState,
  AddInvoice,
  CancelInvoice,
  AddPayment,
  CancelPayment,
  AddProductStock,
  Transactions,
  TransactionsList,
  Reports,
  Report,
  LoadProducts,
} from './pages'
// Reports
import {
  AccountsReceivable,
  BestsellingProducts,
  ClientDebt,
  ClientDebtById,
  ExpenseReport,
  IncomeReport,
  InventoryReport,
  MovementReport,
  ProfitReport,
  ReportByInvoice,
  ReportByInvoiceId,
  SalesReport,
} from './pages/Reports/components'

const Route: React.FC<{
  element: React.ReactElement
  view: string
  type?: 'create' | 'update' | 'browse' | 'view'
}> = ({ element, view, type = 'browse' }) => {
  const { canBrowse, canCreate, canUpdate, canView } = useCheckPermission()
  if (type === 'browse' && canBrowse(view)) return element
  if (type === 'create' && canCreate(view)) return element
  if (type === 'update' && canUpdate(view)) return element
  if (type === 'view' && canView(view)) return element
  return <Navigate to="/inicio" />
}

const App: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      errorElement: <Error />,
      children: [
        {
          path: '/',
          element: <Login />,
        },
        {
          path: '/inicio',
          element: <Home />,
        },
        {
          path: '/clientes',
          element: <Route element={<ClientsList type="list" />} view="AddClient" />,
        },
        {
          path: '/cliente/:id',
          element: <Route element={<EditClient />} view="AddClient" type="update" />,
        },
        {
          path: '/agregar-cliente',
          element: <Route element={<AddClient />} view="AddClient" type="create" />,
        },
        {
          path: '/cargar-productos',
          element: <Route element={<AddProduct />} view="Products" type="create" />,
        },
        {
          path: '/agregar-productos',
          element: <Route element={<LoadProducts />} view="Products" type="update" />,
        },
        {
          path: '/listado-de-productos',
          element: <Route element={<ProductList />} view="Products" />,
        },
        {
          path: '/producto/:id',
          element: <Route element={<EditProduct />} view="Products" type="update" />,
        },
        {
          path: '/gestionar-creditos',
          element: <Route element={<ClientsList type="credits" />} view="ManageCredits" />,
        },
        {
          path: '/editar-credito/:id',
          element: <Route element={<EditCredit />} view="ManageCredits" type="update" />,
        },
        {
          path: '/estado-de-credito/:id',
          element: <Route element={<CreditState />} view="ManageCredits" type="view" />,
        },
        {
          path: '/registrar-compra',
          element: <Route element={<AddInvoice />} view="ManageInvoices" type="create" />,
        },
        {
          path: '/anular-factura',
          element: <Route element={<CancelInvoice />} view="ManageInvoices" />,
        },
        {
          path: '/agregar-abono',
          element: <Route element={<AddPayment />} view="ManagePayments" type="create" />,
        },
        {
          path: '/anular-abono',
          element: <Route element={<CancelPayment />} view="ManagePayments" />,
        },
        {
          path: '/agregar-producto/:id',
          element: <Route element={<AddProductStock />} view="Products" type="update" />,
        },
        {
          path: '/ingresos',
          element: (
            <Route element={<Transactions type="ingreso" />} view="ManageIncomes" type="create" />
          ),
        },
        {
          path: '/gastos',
          element: (
            <Route element={<Transactions type="egreso" />} view="ManageExpenses" type="create" />
          ),
        },
        {
          path: '/ver-gastos',
          element: <Route element={<TransactionsList type="egreso" />} view="ManageExpenses" />,
        },
        {
          path: '/ver-ingresos',
          element: <Route element={<TransactionsList type="ingreso" />} view="ManageIncomes" />,
        },
        {
          path: '/reportes',
          element: <Route element={<Reports />} view="Reports" />,
        },
        {
          path: '/reporte',
          element: <Route element={<Report />} view="Reports" type="view" />,
          children: [
            {
              path: '/reporte/inventario',
              element: <InventoryReport title="Reporte de inventario" />,
            },
            {
              path: '/reporte/utilidad',
              element: <ProfitReport title="Reporte de utilidad" />,
            },
            {
              path: '/reporte/cuentas-por-cobrar',
              element: <AccountsReceivable title="Reporte de cuentas por cobrar" />,
            },
            {
              path: '/reporte/cuentas-por-cobrar/:id',
              element: <ClientDebtById />,
            },
            {
              path: '/reporte/cuentas-por-cobrar-por-cliente',
              element: <ClientDebt />,
            },
            {
              path: '/reporte/ventas-por-vendedor',
              element: <SalesReport title="Reporte por vendedor" />,
            },
            {
              path: '/reporte/mas-menos-vendidos',
              element: <BestsellingProducts title="Productos más y menos vendidos" />,
            },
            {
              path: '/reporte/por-factura',
              element: <ReportByInvoice title="Reportes por factura" />,
            },
            {
              path: '/reporte/por-factura/:id',
              element: <ReportByInvoiceId />,
            },
            {
              path: '/reporte/entradas-y-salidas',
              element: <MovementReport title="Entradas y salidas" />,
            },
            {
              path: '/reporte/gastos',
              element: <ExpenseReport title="Reporte de gastos" />,
            },
            {
              path: '/reporte/ingresos',
              element: <IncomeReport title="Reporte de ingresos" />,
            },
          ],
        },
      ],
    },
  ])

  return <RouterProvider router={router} />
}

export default App
