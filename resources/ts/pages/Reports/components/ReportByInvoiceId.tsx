import React from 'react'
import multiply from 'lodash/fp/multiply'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import { Link, useParams } from 'react-router-dom'
import { FaFileExport } from 'react-icons/fa'

import { useGetOrderQuery } from '../../../features/API'
import { DisplayAmount, Loader } from '../../../components'
import { formatDate, useGetMemoryCountries, downloadFile } from '../../../common'
import { useAppDispatch } from '../../../hooks'

export const ReportByInvoiceId: React.FC = () => {
  const { id = '' } = useParams()
  const { data, isLoading } = useGetOrderQuery(id)
  const { getCountryData } = useGetMemoryCountries()
  const dispatch = useAppDispatch()

  const order = data?.data
  const hasIva = order?.iva !== null && order?.iva !== 0
  const hasTax = order?.tax !== null && order?.tax !== 0
  const countryToUse = getCountryData(order?.client?.country_id || '')

  const handleDownload = (ev: React.MouseEvent) => {
    ev.preventDefault()
    dispatch(
      downloadFile({
        endpoint: '/report/order-export',
        params: `?order_id=${id}`,
        name: `Factura_${id}.xlsx`,
      })
    )
  }

  return (
    <>
      <p className="fs-4 pt-2 mb-1 d-inline-block">Reporte - # Factura {id}</p>
      <Link to="/reporte/por-factura">
        <Button size="sm" className="ms-3 mb-1">
          regresar
        </Button>
      </Link>

      {isLoading && <Loader />}
      {!order && !isLoading && <p className="my-5 fs-5">No se encontró la factura</p>}
      {order && (
        <>
          <Table bordered responsive className="mt-4 td-no-nl">
            <thead>
              <tr>
                <th># Factura</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Forma de pago</th>
                {hasIva && <th>IVA</th>}
                {hasTax && <th>Tax</th>}
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{order.bill_number}</td>
                <td>{formatDate(order.created_at)}</td>
                <td>{order.client_company}</td>
                <td>{order.payment_type}</td>
                {hasIva && <td>{order.iva}</td>}
                {hasTax && <td>{order.tax}</td>}
                <td>
                  <DisplayAmount value={order.total} currency={countryToUse?.currency} />
                </td>
              </tr>
            </tbody>
          </Table>
          <p className="fs-6 mt-3 mb-0">Lista de productos</p>
          <Table responsive className="mt-2">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Costo</th>
                <th>Precio</th>
                <th>Sub Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map(item => (
                <tr key={`item-report-${item.id}`}>
                  <td>{item.product.sku}</td>
                  <td>{item.product.name}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <DisplayAmount value={item.product.price} currency={countryToUse?.currency} />
                  </td>
                  <td>
                    <DisplayAmount value={item.price} currency={countryToUse?.currency} />
                  </td>
                  <td>
                    <DisplayAmount
                      value={multiply(item.price, item.quantity)}
                      currency={countryToUse?.currency}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Button className="d-block mb-4 mt-2 mt-md-4 ms-auto ms-md-0" onClick={handleDownload}>
            Exportar <FaFileExport size={24} color="white" className="ms-2" />
          </Button>
        </>
      )}
    </>
  )
}
