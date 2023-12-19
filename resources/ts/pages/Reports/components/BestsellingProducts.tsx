import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import { _ } from 'gridjs-react'
import { Navigate, Link } from 'react-router-dom'
import { TData } from 'gridjs/dist/src/types'
import { FaFileExport } from 'react-icons/fa'
import { MdCalendarMonth } from 'react-icons/md'
import { useForm, FieldValues } from 'react-hook-form'

import { useAppDispatch, useAppSelector } from '../../../hooks'
import { CustomInput, SimpleGrid, DisplayAmount } from '../../../components'
import { useLazyGetProductsReportQuery } from '../../../features/API'
import {
  getCurrentDate,
  getFirstDayOfMonth,
  useGetMemoryCountries,
  downloadFile,
  useCheckPermission,
} from '../../../common'

export const BestsellingProducts: React.FC<{ title?: string }> = ({ title }) => {
  const dispatch = useAppDispatch()
  const { getRole } = useCheckPermission()
  const { warehouse } = useAppSelector(state => state.system)
  const { getCountryData } = useGetMemoryCountries()
  const { register, handleSubmit } = useForm()
  const [idx, setIdx] = useState(0)
  const [reportParamsAux, setReportParamsAux] = useState('')
  const [getProductsReport, { data }] = useLazyGetProductsReportQuery()

  const onSubmit = (formData: FieldValues) => {
    const { from, to } = formData
    getProductsReport(`from=${from}&to=${to}&warehouse_id=${warehouse.id}`).then(() => {
      setReportParamsAux(`from=${from}&to=${to}&warehouse_id=${warehouse.id}`)
      setIdx(prev => prev + 1)
    })
  }

  const handleDownload = (ev: React.MouseEvent) => {
    ev.preventDefault()
    dispatch(
      downloadFile({
        endpoint: '/report/products-export',
        params: `?${reportParamsAux}`,
        name: 'MasYMenosVendidos.xlsx',
      })
    )
  }

  const countryData = getCountryData(warehouse.country_id)
  const defaultFrom = getFirstDayOfMonth()
  const defaultTo = getCurrentDate()

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
            defeaultValue={defaultFrom}
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
            defeaultValue={defaultTo}
            icon={<MdCalendarMonth size={24} />}
          />
        </div>
        <div className="w-100 mt-2 text-end text-md-start">
          <Button type="submit">Ver Reporte</Button>
        </div>
      </form>

      {idx > 0 && (
        <>
          <SimpleGrid
            key={`bestselling-${idx}`}
            limit={10}
            columns={[
              {
                id: 'sku',
                name: 'Código',
              },
              {
                id: 'name',
                name: 'Producto',
              },
              {
                id: 'quantity',
                name: 'Cantidad',
              },
              {
                id: 'sales',
                name: 'Monto',
                formatter: amount =>
                  _(<DisplayAmount currency={countryData?.currency} value={amount} />),
              },
            ]}
            data={(data?.data as unknown as TData) || []}
          />

          {data && (
            <Button className="d-block mb-4 mt-2 mt-md-4 ms-auto ms-md-0" onClick={handleDownload}>
              Exportar <FaFileExport size={24} color="white" className="ms-2" />
            </Button>
          )}
        </>
      )}
    </>
  )
}
