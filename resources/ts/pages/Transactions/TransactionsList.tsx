import React, { useState } from 'react'
import Swal from 'sweetalert2'
import get from 'lodash/fp/get'
import { _ } from 'gridjs-react'
import Button from 'react-bootstrap/Button'
import { GiExpense } from 'react-icons/gi'
import { BsCashStack } from 'react-icons/bs'

import { CommonHeader, DataGrid, DisplayAmount } from '../../components'
import {
  confirmAlert,
  formatDate,
  loaderAlert,
  simpleAlert,
  useCheckPermission,
  useGetMemoryCountries,
} from '../../common'
import { CategoryType } from '../../types'
import { useDeleteTransactionMutation } from '../../features/API'

export const TransactionsList: React.FC<{ type: CategoryType }> = ({ type }) => {
  const [deleteTransaction, { isLoading }] = useDeleteTransactionMutation()
  const [idx, setIdx] = useState(0)
  const { canDelete } = useCheckPermission()
  const { getCountryData } = useGetMemoryCountries()

  const handleDelete = (id: string) => {
    if (isLoading) return

    confirmAlert({
      html: '¿Está seguro que desea eliminar este registro?',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No',
    }).then(response => {
      if (response.value) {
        loaderAlert({ html: 'borrando...' })

        deleteTransaction(id).then(resp => {
          Swal.close()
          const msg: string = get('data.message', resp) || ''
          simpleAlert({ html: msg, icon: msg.includes('exitosamente') ? 'success' : 'error' })
          setIdx(prev => prev + 1)
        })
      }
    })
  }

  const canDeleteExpense = canDelete('ManageExpenses')
  const canDeleteIncome = canDelete('ManageIncomes')
  return (
    <>
      <CommonHeader
        title={`Listado de ${type === 'ingreso' ? 'ingresos' : 'gastos'}`}
        link={type === 'ingreso' ? '/ingresos' : '/gastos'}
        btnTex={`Registrar ${type === 'ingreso' ? 'ingreso' : 'gasto'}`}
        icon={
          type === 'ingreso' ? (
            <BsCashStack size={24} className="ms-1" />
          ) : (
            <GiExpense size={24} className="ms-1" />
          )
        }
      />

      <DataGrid
        key={`transactions-list-${idx}-${type}`}
        url={`/transactions?type=${type}`}
        columns={[
          {
            id: 'date',
            name: 'Fecha',
            formatter: date => formatDate(date as string),
          },
          {
            id: 'category',
            name: 'Categoría',
            data: row => get('category.category', row),
          },
          {
            id: 'amount',
            name: 'Monto',
            data: row =>
              _(
                <DisplayAmount
                  currency={getCountryData(get('country_id', row))?.currency}
                  value={get('amount', row)}
                />
              ),
          },
          {
            id: 'user',
            name: 'Usuario',
            data: row => get('user.name', row),
          },
          {
            id: 'method',
            name: 'Tipo de pago',
          },
          {
            id: 'id',
            name: 'Acciones',
            formatter: id => {
              if (
                (type === 'ingreso' && canDeleteIncome) ||
                (type === 'egreso' && canDeleteExpense)
              ) {
                return _(
                  <Button onClick={() => handleDelete(id as string)} size="sm">
                    Anular
                  </Button>
                )
              }
              return null
            },
          },
        ]}
      />
    </>
  )
}
