import React, { useState } from 'react'
import Swal from 'sweetalert2'
import get from 'lodash/fp/get'
import flow from 'lodash/fp/flow'
import toNumber from 'lodash/fp/toNumber'
import Button from 'react-bootstrap/Button'
import { _ } from 'gridjs-react'
import { FaFileInvoiceDollar } from 'react-icons/fa'

import { useAppSelector } from '../../hooks'
import { CommonHeader, DataGrid, DisplayAmount } from '../../components'
import {
  ExpireCell,
  confirmAlert,
  formatDate,
  loaderAlert,
  simpleAlert,
  useCheckPermission,
  useGetMemoryCountries,
} from '../../common'
import { useUpdateOrderMutation } from '../../features/API'

export const CancelInvoice: React.FC = () => {
  const [idx, setIdx] = useState(1)
  const [updateOrder, { isLoading }] = useUpdateOrderMutation()
  const {
    system: { country, warehouse },
    currentUser: { data: user },
  } = useAppSelector(state => state)
  const { getCountryData } = useGetMemoryCountries()
  const { canDelete } = useCheckPermission()

  const handleClick = (id: ID) => {
    if (isLoading) return

    confirmAlert({
      html: '¿Está seguro de que desea anular esta Factura?',
      confirmButtonText: 'Sí, anular',
      cancelButtonText: 'No',
    }).then(response => {
      if (response.value) {
        loaderAlert({ html: 'anulando...' })

        updateOrder({ id, state: 'anulado' }).then(resp => {
          Swal.close()

          if (get('data.data.id', resp)) {
            simpleAlert({
              html: 'Compra anulada exitosamente',
              icon: 'success',
            })
          } else {
            simpleAlert({
              html: 'No fue posible anular compra',
              icon: 'error',
            })
          }
          setIdx(prev => prev + 1)
        })
      }
    })
  }

  const canDeleteInvoice = canDelete('ManageInvoices')
  const byUser = user?.role?.role === 'vendedor' ? `&user_id=${user?.id}` : ''
  return (
    <>
      <CommonHeader
        title="Anular Factura"
        link="/registrar-compra"
        btnTex="Registrar compra"
        icon={<FaFileInvoiceDollar size={24} className="ms-2" />}
      />

      <DataGrid
        key={`warehouse_${warehouse.id}_invoices_${idx}`}
        url="/orders"
        queryParams={`?warehouse_id=${warehouse.id}${byUser}`}
        columns={[
          {
            id: 'bill_number',
            name: '# Factura',
            width: '120px',
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
            id: 'user',
            name: 'Usuario',
            data: row => get('user.name', row),
          },
          {
            id: 'client_company',
            name: 'Local',
          },
          {
            id: 'country_id',
            name: 'País',
            data: row => getCountryData(get('client.country_id', row) as string)?.country,
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
            formatter: date => formatDate(date as string),
          },
          {
            id: 'credit_expire_at',
            name: 'Vencimiento',
            data: row =>
              ExpireCell({
                date: get('credit_expire_at', row),
                debt: get('debt', row),
              }),
          },
          {
            id: 'total',
            name: 'Total',
            data: row =>
              _(
                <DisplayAmount
                  currency={getCountryData(get('client.country_id', row) as string)?.currency}
                  value={get('total', row) as string}
                />
              ),
          },
          {
            id: 'bill_number',
            name: 'Acciones',
            data: row => {
              if (get('state', row) === 'anulado') return 'anulada'
              if (flow(get('debt'), toNumber)(row) <= 0 && get('payment_type', row) === 'credito')
                return ''

              if (!canDeleteInvoice) return ''
              return _(
                <Button onClick={() => handleClick(get('id', row))} size="sm">
                  Anular
                </Button>
              )
            },
          },
        ]}
      />
    </>
  )
}
