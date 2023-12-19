import React, { useState } from 'react'
import Swal from 'sweetalert2'
import get from 'lodash/fp/get'
import Button from 'react-bootstrap/Button'
import { _ } from 'gridjs-react'
import { MdPayments } from 'react-icons/md'

import { CommonHeader, DataGrid, DisplayAmount } from '../../components'
import { useDeletePaymentMutation } from '../../features/API'
import {
  confirmAlert,
  formatDate,
  loaderAlert,
  simpleAlert,
  useCheckPermission,
  useGetMemoryCountries,
} from '../../common'
import { useAppSelector } from '../../hooks'

export const CancelPayment: React.FC = () => {
  const [idx, setIdx] = useState(1)
  const { country, warehouse } = useAppSelector(state => state.system)
  const [deletePayment, { isLoading }] = useDeletePaymentMutation()
  const { getCountryData } = useGetMemoryCountries()
  const { canDelete } = useCheckPermission()

  const handleDelete = (id: ID) => {
    if (isLoading) return

    confirmAlert({
      html: '¿Está seguro de que desea anular este Abono?',
      confirmButtonText: 'Sí, anular',
      cancelButtonText: 'No',
    }).then(response => {
      if (response.value) {
        loaderAlert({ html: 'anulando...' })

        deletePayment(id).then(resp => {
          Swal.close()
          const msg: string = get('data.message', resp)
          simpleAlert({ html: msg, icon: msg.includes('exitosamente') ? 'success' : 'error' })
          setIdx(prev => prev + 1)
        })
      }
    })
  }

  const canDeletePayment = canDelete('ManagePayments')
  return (
    <div className="mb-4">
      <CommonHeader
        title="Anular abono"
        link="/agregar-abono"
        btnTex="Agregar Abono"
        icon={<MdPayments size={24} />}
      />

      <DataGrid
        key={`payments-list-${idx}`}
        url="/payments"
        queryParams={`?warehouse_id=${warehouse.id}`}
        columns={[
          {
            id: 'id',
            name: 'id',
            width: '75px',
          },
          {
            id: 'payment_bill_number',
            name: '# Comprobante',
            width: '160px',
          },
          {
            id: 'credit',
            name: '# Factura',
            formatter: credit => get('order.bill_number', credit),
            width: '120px',
          },
          {
            id: 'user',
            name: 'Usuario',
            data: row => get('user.name', row),
          },
          {
            id: 'client',
            name: 'Cliente',
            data: row => get('credit.order.client.company', row),
          },
          {
            id: 'amount',
            name: 'Monto',
            data: row =>
              _(
                <DisplayAmount
                  currency={
                    getCountryData(get('credit.order.client.country_id', row) as string)?.currency
                  }
                  value={get('amount', row) as string}
                />
              ),
          },
          {
            id: 'comments',
            name: 'Comentario',
          },
          {
            id: 'created_at',
            name: 'Fecha de abono',
            formatter: date => formatDate(date as string),
          },
          {
            id: 'country_id',
            name: 'País',
            data: row =>
              getCountryData(get('credit.order.client.country_id', row) as string)?.country,
            hidden: !!country,
          },
          {
            id: 'id',
            name: 'Acciones',
            hidden: !canDeletePayment,
            formatter: id => {
              if (!canDeletePayment) return null
              return _(
                <Button onClick={() => handleDelete(id as ID)} size="sm">
                  Anular
                </Button>
              )
            },
          },
        ]}
      />
    </div>
  )
}
