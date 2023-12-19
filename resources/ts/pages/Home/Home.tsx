import React from 'react'
import { Link } from 'react-router-dom'

import credit from '../../assets/images/icons/credit.png'
import reports from '../../assets/images/icons/reports.png'
import payment from '../../assets/images/icons/add_payment.png'
import addClient from '../../assets/images/icons/add_client.png'
import invoice from '../../assets/images/icons/manage_invoice.png'
import editProduct from '../../assets/images/icons/edit_product.png'
import manageUsers from '../../assets/images/icons/manage_users.png'
import addReminder from '../../assets/images/icons/add_reminder.png'
import searchClient from '../../assets/images/icons/search_client.png'
import pettyCash from '../../assets/images/icons/manage_petty_cash.png'
import createProduct from '../../assets/images/icons/create_product.png'
import addProducts from '../../assets/images/icons/add_products.png'
import { useCheckPermission } from '../../common'

import { MenuGrid } from './style'
import { ClientsCount } from './components'

export const Home: React.FC = () => {
  const { canBrowse, canCreate, getRole, canUpdate } = useCheckPermission()

  const role = getRole()
  return (
    <>
      <ClientsCount />
      <MenuGrid className="py-0 py-lg-4">
        {canCreate('AddClient') && (
          <div className="item">
            <Link to="/agregar-cliente">
              <img src={addClient} alt="add" />
              <span>Agregar Cliente</span>
            </Link>
          </div>
        )}
        {canBrowse('AddClient') && (
          <div className="item">
            <Link to="/clientes">
              <img src={searchClient} alt="search" />
              <span>Consultar Cliente</span>
            </Link>
          </div>
        )}
        {canBrowse('ManageCredits') && (
          <div className="item">
            <Link to="/gestionar-creditos">
              <img src={credit} alt="credit" />
              <span>Gestionar Créditos</span>
            </Link>
          </div>
        )}
        {canCreate('ManagePayments') && (
          <div className="item">
            <Link to="/agregar-abono">
              <img src={payment} alt="add payment" />
              <span>Gestionar Abonos</span>
            </Link>
          </div>
        )}
        {canCreate('ManageInvoices') && (
          <div className="item">
            <Link to="/registrar-compra">
              <img src={invoice} alt="manage invoice" />
              <span>Gestionar Facturas</span>
            </Link>
          </div>
        )}
        {canBrowse('Products') && (
          <div className="item">
            <Link to="/listado-de-productos">
              <img src={editProduct} alt="edit product" />
              <span>Editar un producto</span>
            </Link>
          </div>
        )}
        {canCreate('Products') && (
          <div className="item">
            <Link to="/cargar-productos">
              <img src={createProduct} alt="manage warehouse" />
              <span>Crear productos</span>
            </Link>
          </div>
        )}
        {canUpdate('Products') && (
          <div className="item">
            <Link to="/agregar-productos">
              <img src={addProducts} alt="Add product stock" />
              <span>Cargar productos</span>
            </Link>
          </div>
        )}
        {canBrowse('Reports') && (
          <div className="item">
            <Link to="/reportes">
              <img src={reports} alt="reports" />
              <span>Reportes</span>
            </Link>
          </div>
        )}
        {role === 'admin' && (
          <div className="item">
            <a href="/nova">
              <img src={manageUsers} alt="manage users" />
              <span>Gestionar Usuario</span>
            </a>
          </div>
        )}
        {role === 'admin' && (
          <div className="item d-none">
            <Link to="/inicio">
              <img src={addReminder} alt="add_reminder" />
              <span>Agregar Recordatorio</span>
            </Link>
          </div>
        )}
        {canCreate('ManageExpenses') && (
          <div className="item">
            <Link to="/gastos">
              <img src={pettyCash} alt="expenses" />
              <span>Gestionar Gastos</span>
            </Link>
          </div>
        )}
        {canCreate('ManageIncomes') && (
          <div className="item">
            <Link to="/ingresos">
              <img src={pettyCash} alt="income" />
              <span>Gestionar Ingresos</span>
            </Link>
          </div>
        )}
      </MenuGrid>
    </>
  )
}
