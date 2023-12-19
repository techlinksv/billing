import React, { useState } from 'react'
import get from 'lodash/fp/get'
import Button from 'react-bootstrap/Button'
import { _ } from 'gridjs-react'
import { Link, useNavigate } from 'react-router-dom'
import { FaFileExport } from 'react-icons/fa'
import { MdCalendarMonth } from 'react-icons/md'
import { useForm, FieldValues } from 'react-hook-form'

import { CustomInput, DataGrid, DisplayAmount } from '../../../components'
import {
  getCurrentDate,
  getFirstDayOfMonth,
  useGetMemoryCountries,
  downloadFile,
} from '../../../common'
import { useAppDispatch } from '../../../hooks'

export const AccountsReceivable: React.FC<{ title?: string }> = ({ title }) => {
  const dispatch = useAppDispatch()
  const [from, setFrom] = useState(getFirstDayOfMonth())
  const [to, setTo] = useState(getCurrentDate())
  const [idx, setIdx] = useState(0)
  const { getCountryData } = useGetMemoryCountries()
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()

  const handleDownload = (ev: React.MouseEvent) => {
    ev.preventDefault()
    dispatch(
      downloadFile({
        endpoint: '/report/clients-debt-export',
        params: `?from=${from}&to=${to}`,
        name: 'CuentasPorCobrar.xlsx',
      })
    )
  }

  const onSubmit = (formData: FieldValues) => {
    setFrom(formData.from)
    setTo(formData.to)
    setIdx(prev => prev + 1)
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
        key={`payments-list-${idx}`}
        url="/clients-debt"
        queryParams={`?from=${from}&to=${to}`}
        columns={[
          {
            id: 'company',
            name: 'Local',
          },
          {
            id: 'client',
            name: 'Cliente',
            data: row => `${get('first_name', row)} ${get('last_name', row)}`,
          },
          {
            id: 'credit_limit',
            name: 'Limite de Crédito',
            data: row =>
              _(
                <DisplayAmount
                  currency={getCountryData(get('country_id', row))?.currency}
                  value={get('credit_limit', row)}
                />
              ),
          },
          {
            id: 'used_credit_expired',
            name: 'Saldo vencido',
            data: row =>
              _(
                <span className={get('used_credit_expired', row) > 0 ? 'text-danger' : ''}>
                  <DisplayAmount
                    currency={getCountryData(get('country_id', row))?.currency}
                    value={get('used_credit_expired', row)}
                  />
                </span>
              ),
          },
          {
            id: 'debt_not_expired',
            name: 'Saldo pendiente',
            data: row =>
              _(
                <DisplayAmount
                  currency={getCountryData(get('country_id', row))?.currency}
                  value={get('debt_not_expired', row)}
                />
              ),
          },
          {
            id: 'amount',
            name: 'Total',
            data: row =>
              _(
                <DisplayAmount
                  currency={getCountryData(get('country_id', row))?.currency}
                  value={get('debt', row)}
                />
              ),
          },
          {
            id: 'id',
            name: 'Acciones',
            formatter: id =>
              _(
                <Button size="sm" onClick={() => navigate(`/reporte/cuentas-por-cobrar/${id}`)}>
                  Ver
                </Button>
              ),
          },
        ]}
      />
      <Button className="d-block mb-4 mt-2 mt-md-4 ms-auto ms-md-0" onClick={handleDownload}>
        Exportar <FaFileExport size={24} color="white" className="ms-2" />
      </Button>
    </>
  )
}
