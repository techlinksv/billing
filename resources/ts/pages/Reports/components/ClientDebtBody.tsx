import React, { useState } from 'react'
import get from 'lodash/fp/get'
import subtract from 'lodash/fp/subtract'
import toNumber from 'lodash/fp/toNumber'
import multiply from 'lodash/fp/multiply'
import Modal from 'react-bootstrap/Modal'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { _ } from 'gridjs-react'
import { FaFileExport } from 'react-icons/fa'

import { Client, Order } from '../../../types'
import { DataGrid, DisplayAmount, SimpleGrid } from '../../../components'
import { ExpireCell, formatDate, useGetMemoryCountries, downloadFile } from '../../../common'
import { useAppSelector, useAppDispatch } from '../../../hooks'
import { useGetDebtsTotalQuery } from '../../../features/API'

export const ClientDebtBody: React.FC<{ client: Client }> = ({ client }) => {
  const { data: debtsTotal } = useGetDebtsTotalQuery(client.id)
  const { country } = useAppSelector(state => state.system)
  const { getCountryData } = useGetMemoryCountries()
  const [currentOrder, setCurrentOrder] = useState<Order>()
  const [showModal, setShowModal] = useState(false)
  const dispatch = useAppDispatch()

  const handleDownload = (ev: React.MouseEvent) => {
    ev.preventDefault()
    dispatch(
      downloadFile({
        endpoint: '/report/client-export',
        params: `?client_id=${client.id}`,
        name: `CuentasPorCobrarCliente.xlsx`,
      })
    )
  }

  // cd = country data
  const cd = getCountryData(client.country_id)

  return (
    <div className="mb-4">
      <SimpleGrid
        columns={[
          {
            name: 'Cliente',
          },
          {
            name: 'Credito Actual',
            formatter: val => _(<DisplayAmount currency={cd?.currency} value={val} />),
          },
          {
            name: 'Limite de Credito',
            formatter: val => _(<DisplayAmount currency={cd?.currency} value={val} />),
          },
          {
            name: 'Deuda Global',
            formatter: val => _(<DisplayAmount currency={cd?.currency} value={val} />),
          },
          {
            name: 'Saldo Vencido',
            formatter: val => {
              if (toNumber(val) <= 0) return ''
              return _(
                <span className="text-danger">
                  <DisplayAmount currency={cd?.currency} value={val} />
                </span>
              )
            },
          },
        ]}
        data={[
          [
            `${client.first_name} ${client.last_name}`,
            client.available_credit,
            client.credit_limit,
            client.debt,
            client.used_credit_expired,
          ],
        ]}
      />
      <Button className="d-block mb-4 ms-auto ms-md-0" onClick={handleDownload}>
        Exportar <FaFileExport size={24} color="white" className="ms-2" />
      </Button>

      <p className="mt-4 mb-1 fs-5">Abonos</p>
      <DataGrid
        key={`payments-list-${client.id}`}
        url="/payments"
        queryParams={`?client_id=${client.id}`}
        search={false}
        columns={[
          {
            id: 'id',
            name: 'id',
          },
          {
            id: 'payment_bill_number',
            name: '# Comprobante',
          },
          {
            id: 'credit',
            name: '# Factura',
            formatter: credit => get('order.bill_number', credit),
          },
          {
            id: 'user',
            name: 'Usuario',
            data: row => get('user.name', row),
          },
          {
            id: 'amount',
            name: 'Monto',
            formatter: val => _(<DisplayAmount currency={cd?.currency} value={val} />),
          },
          {
            id: 'comments',
            name: 'Comentario',
            data: row => {
              if (get('deleted', row) === true) {
                return _(<span className="text-danger">Pago anulado</span>)
              }
              return get('comments', row)
            },
          },
          {
            id: 'created_at',
            name: 'Fecha de abono',
            formatter: date => formatDate(date),
          },
          {
            id: 'country_id',
            name: 'País',
            formatter: () => cd?.country,
            hidden: !!country,
          },
        ]}
      />
      <p className="mb-5 mt-0 fs-5">
        <span className="me-2">Total en abonos: </span>
        <DisplayAmount currency={cd?.currency} value={debtsTotal?.paid} />
      </p>

      <p className="mt-4 mb-1 fs-5">Deudas</p>
      <DataGrid
        key={`credits_${client.id}`}
        search={false}
        url="/credits"
        queryParams={`?client_id=${client.id}&state=activo&expired=true`}
        columns={[
          {
            id: 'order',
            name: '# Factura',
            formatter: order => get('bill_number', order),
          },
          {
            id: 'created_at',
            name: 'Fecha de compra',
            formatter: date => formatDate(date),
          },
          {
            id: 'expire_at',
            name: 'Vencimiento',
            formatter: date => formatDate(date),
          },
          {
            id: 'debt',
            name: 'Deuda',
            formatter: debt => _(<DisplayAmount currency={cd?.currency} value={debt} />),
          },
          {
            id: 'amount',
            name: 'Total',
            formatter: debt => _(<DisplayAmount currency={cd?.currency} value={debt} />),
          },
        ]}
      />
      <p className="mb-5 mt-0 fs-5">
        <span className="me-2">Total en facturas pendientes: </span>
        <DisplayAmount currency={cd?.currency} value={client.used_credit_expired} />
      </p>

      <p className="mt-4 mb-1 fs-5">Lista de Compras</p>
      <DataGrid
        key={`list_${client.id}`}
        url="/orders"
        queryParams={`?client_id=${client.id}`}
        search={false}
        columns={[
          {
            id: 'bill_number',
            name: '# Factura',
            data: row => {
              if (get('state', row) === 'anulado') {
                return _(
                  <>
                    {get('bill_number', row)}
                    <span className="text-danger"> (Factura anulada)</span>
                  </>
                )
              }
              return get('bill_number', row)
            },
          },
          {
            id: 'country_id',
            name: 'País',
            data: () => cd?.country,
            hidden: !!country,
          },
          {
            id: 'payment_type',
            name: 'Tipo de pago',
            formatter: type => (type === 'efectivo' ? 'Efectivo' : 'Crédito'),
          },
          {
            id: 'created_at',
            name: 'Fecha de compra',
            formatter: date => formatDate(date),
          },
          {
            id: 'credit_expire_at',
            name: 'Vencimiento',
            data: row => {
              if (get('debt', row) === 0) return 'pagado'
              return ExpireCell({
                date: get('credit_expire_at', row),
                debt: get('debt', row),
              })
            },
          },
          {
            id: 'total',
            name: 'Total',
            formatter: val => _(<DisplayAmount currency={cd?.currency} value={val} />),
          },
          {
            id: 'debt',
            name: 'Deuda',
            formatter: val => _(<DisplayAmount currency={cd?.currency} value={val} />),
          },
          {
            id: 'id',
            name: 'Detalles',
            data: row => {
              return _(
                <Button
                  onClick={() => {
                    setCurrentOrder(row as unknown as Order)
                    setShowModal(true)
                  }}
                >
                  Productos
                </Button>
              )
            },
          },
        ]}
      />
      <p className="mb-5 mt-0 fs-5">
        <span className="me-2">Total en facturas al crédito: </span>
        <DisplayAmount
          currency={cd?.currency}
          value={subtract(toNumber(client.debt), toNumber(client.used_credit_expired))}
        />
      </p>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header className="fs-5"># Factura: {currentOrder?.bill_number}</Modal.Header>
        <Modal.Body>
          <table className="fs-6">
            <tbody>
              <tr>
                <td className="pe-3">Fecha de compra:</td>
                <td>{formatDate(currentOrder?.created_at)}</td>
              </tr>
              <tr>
                <td className="pe-3">Total:</td>
                <td>
                  <DisplayAmount value={currentOrder?.total} currency={cd?.currency} />
                </td>
              </tr>
              <tr>
                <td className="pe-3">Deuda:</td>
                <td>
                  <DisplayAmount value={currentOrder?.debt} currency={cd?.currency} />
                </td>
              </tr>
              <tr>
                <td className="pt-3 fw-semibold" colSpan={4}>
                  Lista de productos
                </td>
              </tr>
            </tbody>
          </table>

          <Table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Sub Total</th>
              </tr>
            </thead>
            <tbody>
              {currentOrder?.items.map(el => (
                <tr key={`modal-details${el.id}`}>
                  <td className="pe-3">{el.product.name}</td>
                  <td className="pe-3">{el.quantity}</td>
                  <td className="pe-3">
                    <DisplayAmount value={el.price} currency={cd?.currency} />
                  </td>
                  <td className="pe-3">
                    <DisplayAmount
                      value={multiply(el.price, el.quantity)}
                      currency={cd?.currency}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </div>
  )
}
