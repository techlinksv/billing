import React from 'react'
import get from 'lodash/fp/get'
import Button from 'react-bootstrap/Button'
import { _ } from 'gridjs-react'
import { Link, useNavigate } from 'react-router-dom'

import { useAppSelector } from '../../../hooks'
import { DataGrid } from '../../../components'
import { formatDate } from '../../../common'

export const ReportByInvoice: React.FC<{ title?: string }> = ({ title }) => {
  const navigate = useNavigate()
  const { warehouse } = useAppSelector(state => state.system)

  return (
    <>
      {title && <p className="fs-4 pt-2 mb-1 d-inline-block">{title}</p>}
      <Link to="/reportes">
        <Button size="sm" className="ms-3 mb-1">
          Reportes
        </Button>
      </Link>

      <DataGrid
        url="/orders"
        queryParams={`?warehouse_id=${warehouse.id}`}
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
            id: 'client_company',
            name: 'Local',
          },
          {
            id: 'payment_type',
            name: 'Tipo de pago',
            formatter: type => (type === 'efectivo' ? 'Efectivo' : 'Crédito'),
          },
          {
            id: 'created_at',
            name: 'Fecha de compra',
            formatter: date => formatDate(date as string),
          },
          {
            id: 'id',
            name: 'Acciones',
            formatter: id =>
              _(
                <Button onClick={() => navigate(`/reporte/por-factura/${id}`)} size="sm">
                  Ver
                </Button>
              ),
          },
        ]}
      />
    </>
  )
}
