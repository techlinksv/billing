import React, { useState } from 'react'
import get from 'lodash/fp/get'
import Button from 'react-bootstrap/Button'
import { _ } from 'gridjs-react'
import { Navigate, Link } from 'react-router-dom'
import { FaFileExport } from 'react-icons/fa'
import { MdCalendarMonth } from 'react-icons/md'
import { useForm, FieldValues } from 'react-hook-form'

import { CustomInput, DataGrid, DisplayAmount } from '../../../components'
import {
  formatDate,
  getCurrentDate,
  getFirstDayOfMonth,
  useGetMemoryCountries,
  downloadFile,
  useCheckPermission,
} from '../../../common'
import { useAppDispatch } from '../../../hooks'

export const ExpenseReport: React.FC<{ title?: string }> = ({ title }) => {
  const dispatch = useAppDispatch()
  const [from, setFrom] = useState(getFirstDayOfMonth())
  const [to, setTo] = useState(getCurrentDate())
  const [idx, setIdx] = useState(0)
  const { register, handleSubmit } = useForm()
  const { getCountryData } = useGetMemoryCountries()
  const { getRole } = useCheckPermission()

  const onSubmit = (formData: FieldValues) => {
    setFrom(formData.from)
    setTo(formData.to)
    setIdx(prev => prev + 1)
  }

  const handleDownload = (ev: React.MouseEvent) => {
    ev.preventDefault()
    const input = document.querySelector<HTMLInputElement>('.gridjs-input.gridjs-search-input')
    const searchString = input?.value ? `&search=${input?.value}` : ''
    dispatch(
      downloadFile({
        endpoint: '/report/expenses-export',
        params: `?type=egreso&from=${from}&to=${to}${searchString}`,
        name: `Gastos.xlsx`,
      })
    )
  }

  if (getRole() === 'vendedor') {
    return <Navigate to="/inicio" />
  }
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
        <div className="w-100 mt-2 text-end text-md-start">
          <Button type="submit">Ver Reporte</Button>
        </div>
      </form>

      <DataGrid
        key={`transactions-list-${idx}-egreso`}
        url={`/transactions?type=egreso&from=${from}&to=${to}`}
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
        ]}
      />
      <Button className="d-block mb-4 mt-2 mt-md-4 ms-auto ms-md-0" onClick={handleDownload}>
        Exportar <FaFileExport size={24} color="white" className="ms-2" />
      </Button>
    </>
  )
}
