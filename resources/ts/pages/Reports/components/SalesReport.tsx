import React, { useState, useEffect } from 'react'
import get from 'lodash/fp/get'
import map from 'lodash/fp/map'
import sum from 'lodash/fp/sum'
import find from 'lodash/fp/find'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import { _ } from 'gridjs-react'
import { MdCalendarMonth } from 'react-icons/md'
import SelectSearch, { SelectSearchOption } from 'react-select-search'
import { useForm, FieldValues } from 'react-hook-form'
import { FaFileExport } from 'react-icons/fa'

import { User } from '../../../types'
import { useGetUsersQuery, useLazyGetSalesTotalQuery } from '../../../features/API'
import { CustomInput, DataGrid, DisplayAmount, Loader } from '../../../components'
import {
  ExpireCell,
  formatDate,
  getCurrentDate,
  getFirstDayOfMonth,
  useGetMemoryCountries,
  downloadFile,
  useCheckPermission,
} from '../../../common'
import { useAppSelector, useAppDispatch } from '../../../hooks'

export const SalesReport: React.FC<{ title?: string }> = ({ title }) => {
  const {
    system: { country },
    currentUser: stateUser,
  } = useAppSelector(state => state)
  const [users, setUsers] = useState<SelectSearchOption[]>()
  const { data, isLoading } = useGetUsersQuery()
  const [currentUser, setCurrentUser] = useState<ID>(stateUser.data?.id as ID)
  const [user, setUser] = useState<User>()
  const { getCountryData } = useGetMemoryCountries()
  const [from, setFrom] = useState(getFirstDayOfMonth())
  const [to, setTo] = useState(getCurrentDate())
  const { register, handleSubmit } = useForm()
  const [idx, setIdx] = useState(0)
  const [getTotals, { data: totals }] = useLazyGetSalesTotalQuery()
  const dispatch = useAppDispatch()
  const { getRole } = useCheckPermission()

  useEffect(() => {
    const list: User[] = data?.data || []
    if (list.length > 0) {
      setUsers(map((el: User) => ({ name: el.name, value: el.id }), list))
    }
  }, [data])

  const onSubmit = (formData: FieldValues) => {
    if (!currentUser) return
    setFrom(formData.from)
    setTo(formData.to)
    setIdx(prev => prev + 1)
    getTotals(`?user_id=${currentUser}&from=${formData.from}&to=${formData.to}`)
    setUser(find({ id: currentUser }, data?.data))
  }

  const handleDownload = (ev: React.MouseEvent) => {
    ev.preventDefault()
    dispatch(
      downloadFile({
        endpoint: '/report/sales-by-user-export',
        params: `?user_id=${currentUser}&from=${from}&to=${to}`,
        name: `ReportePorVendedor.xlsx`,
      })
    )
  }

  // cd = country data
  const cd = getCountryData(user?.country_id)
  return (
    <>
      {title && <p className="fs-4 pt-2 mb-1 d-inline-block">{title}</p>}
      <Link to="/reportes">
        <Button size="sm" className="ms-3 mb-1">
          Reportes
        </Button>
      </Link>

      <form
        className="d-flex justify-content-between justify-content-lg-start align-items-center flex-wrap mw-500 my-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="mw-49 me-0 me-lg-3">
          <CustomInput
            label
            type="date"
            id="transaction_date_1"
            placeholder="Fecha Inicial"
            handler={register('from')}
            defeaultValue={from}
            icon={<MdCalendarMonth size={24} />}
          />
        </div>
        <div className="mw-49">
          <CustomInput
            label
            type="date"
            id="transaction_date_2"
            placeholder="Fecha Final"
            handler={register('to')}
            defeaultValue={to}
            icon={<MdCalendarMonth size={24} />}
          />
        </div>
        {getRole() !== 'vendedor' && users && (
          <div className="w-100 mt-2 text-end text-md-start">
            <SelectSearch
              options={users}
              placeholder="Buscar usuario"
              search
              onChange={el => setCurrentUser(el as number)}
            />
          </div>
        )}
        <div className="w-100 mt-2 text-end text-md-start">
          <Button type="submit">Ver Reporte</Button>
        </div>
      </form>

      {isLoading && <Loader />}
      {currentUser && idx > 0 && (
        <div className="mb-3">
          <Button className="d-block mb-4 ms-auto" onClick={handleDownload}>
            Exportar <FaFileExport size={24} color="white" className="ms-2" />
          </Button>
          <p className="fs-5 mb-1">Lista de abonos</p>
          <DataGrid
            key={`payments-list-${idx}`}
            url="/payments"
            search={false}
            queryParams={`?user_id=${currentUser}&cancelled=true&from=${from}&to=${to}`}
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
                id: 'created_at',
                name: 'Fecha de abono',
                formatter: date => formatDate(date),
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
                        getCountryData(get('credit.order.client.country_id', row))?.currency
                      }
                      value={get('amount', row)}
                    />
                  ),
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
                id: 'country_id',
                name: 'País',
                data: row => getCountryData(get('credit.order.client.country_id', row))?.country,
                hidden: !!country,
              },
            ]}
          />
          {user?.country_id && (
            <table className="mb-5 mt-1 fs-6">
              <tbody>
                <tr>
                  <td>Total Abonos:</td>
                  <td className="ps-3">
                    <DisplayAmount currency={cd?.currency} value={totals?.total_pagos} />
                  </td>
                </tr>
                <tr>
                  <td>Total Abonos Anulados:</td>
                  <td className="ps-3">
                    <DisplayAmount currency={cd?.currency} value={totals?.total_pagos_anulados} />
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          <p className="fs-5 mb-1 mt-5">Lista de ventas</p>
          <DataGrid
            key={`orders_by_user_${idx}`}
            url="/orders"
            search={false}
            queryParams={`?user_id=${currentUser}&from=${from}&to=${to}`}
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
                id: 'created_at',
                name: 'Fecha de compra',
                formatter: date => formatDate(date),
              },
              {
                id: 'country_id',
                name: 'País',
                data: row => getCountryData(get('client.country_id', row))?.country,
                hidden: !!country,
              },
              {
                id: 'payment_type',
                name: 'Tipo de pago',
                formatter: type => (type === 'efectivo' ? 'Efectivo' : 'Crédito'),
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
                      currency={getCountryData(get('client.country_id', row))?.currency}
                      value={get('total', row)}
                    />
                  ),
              },
            ]}
          />
          {user?.country_id && (
            <table className="mb-5 mt-1 fs-6">
              <tbody>
                <tr>
                  <td>Total Efectivo:</td>
                  <td className="ps-3">
                    <DisplayAmount currency={cd?.currency} value={totals?.total_efectivo} />
                  </td>
                </tr>
                <tr>
                  <td>Total Crédito:</td>
                  <td className="ps-3">
                    <DisplayAmount currency={cd?.currency} value={totals?.total_credito} />
                  </td>
                </tr>
                <tr>
                  <td>Total Entregado:</td>
                  <td className="ps-3">
                    <DisplayAmount
                      currency={cd?.currency}
                      value={sum([totals?.total_efectivo, totals?.total_pagos])}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )}
    </>
  )
}
