import React, { useState, useEffect } from 'react'
import map from 'lodash/fp/map'
import Button from 'react-bootstrap/Button'
import { _ } from 'gridjs-react'
import { Navigate, Link } from 'react-router-dom'
import { FaFileExport } from 'react-icons/fa'
import { MdCalendarMonth } from 'react-icons/md'
import { useForm, FieldValues } from 'react-hook-form'
import SelectSearch, { SelectSearchOption } from 'react-select-search'

import { CustomInput, DataGrid, DisplayAmount } from '../../../components'
import {
  getCurrentDate,
  getFirstDayOfMonth,
  useCheckPermission,
  useGetMemoryCountries,
  downloadFile,
} from '../../../common'
import { useGetProductsQuery, useGetProfitTotalQuery } from '../../../features/API'
import { Product } from '../../../types'
import { useAppDispatch, useAppSelector } from '../../../hooks'

export const ProfitReport: React.FC<{ title?: string }> = ({ title }) => {
  const dispatch = useAppDispatch()
  const { getCountryData } = useGetMemoryCountries()
  const { getRole } = useCheckPermission()
  const [currentProduct, setCurrentProduct] = useState<number>()
  const [products, setProducts] = useState<SelectSearchOption[]>()
  const { register, handleSubmit } = useForm()
  const [from, setFrom] = useState(getFirstDayOfMonth())
  const [to, setTo] = useState(getCurrentDate())
  const { data } = useGetProductsQuery()
  const [idx, setIdx] = useState(0)
  const { warehouse } = useAppSelector(state => state.system)

  const queryStringProduct = currentProduct ? `&product_id=${currentProduct}` : ''
  const { data: profit } = useGetProfitTotalQuery(
    `?from=${from}&to=${to}${queryStringProduct}&warehouse_id=${warehouse.id}`
  )

  const role = getRole()

  useEffect(() => {
    if (!products && data) {
      setProducts(
        map(
          (el: Product) => ({
            name: el.sku,
            value: el.id,
          }),
          data
        )
      )
    }
  }, [data, products])

  const onSubmit = (formData: FieldValues) => {
    setFrom(formData.from)
    setTo(formData.to)

    setIdx(prev => prev + 1)
  }

  const handleDownload = (ev: React.MouseEvent) => {
    ev.preventDefault()
    dispatch(
      downloadFile({
        endpoint: '/report/earnings-export',
        params: `?from=${from}&to=${to}${
          currentProduct ? `&product_id=${currentProduct}` : ''
        }&warehouse_id=${warehouse.id}`,
        name: 'Utilidades.xlsx',
      })
    )
  }

  if (role !== 'admin') {
    return <Navigate to="/inicio" />
  }

  const countryData = getCountryData(warehouse.country_id)
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
        {products && (
          <div className="w-100 mt-2 text-end text-md-start">
            <SelectSearch
              options={products}
              placeholder="Buscar por código de producto"
              search
              onChange={el => setCurrentProduct(el as number)}
            />
          </div>
        )}
        <div className="w-100 mt-2 text-end text-md-start">
          <Button type="submit">Ver Reporte</Button>
        </div>
      </form>

      <div className="fs-5 mb-3">
        <span className="pe-2">Total de utilidades: </span>
        <DisplayAmount currency={countryData.currency} value={profit?.total_earnings || 0} />
      </div>

      <DataGrid
        key={`profit-${idx}`}
        url="/report/earnings"
        queryParams={`?from=${from}&to=${to}${
          currentProduct ? `&product_id=${currentProduct}` : ''
        }&warehouse_id=${warehouse.id}`}
        columns={[
          {
            id: 'sku',
            name: 'Código',
          },
          {
            id: 'product_name',
            name: 'Producto',
          },
          {
            id: 'cost',
            name: 'Costo',
            hidden: role !== 'admin',
            formatter: cost =>
              _(<DisplayAmount currency={countryData?.currency} value={cost as string} />),
          },
          {
            id: 'price',
            name: 'Precio de venta',
            formatter: price =>
              _(<DisplayAmount currency={countryData?.currency} value={price as string} />),
          },
          {
            id: 'total_units',
            name: 'Cantidad',
          },
          {
            id: 'earning',
            name: 'Utilidad Producto',
            formatter: earning =>
              _(<DisplayAmount currency={countryData?.currency} value={earning as string} />),
          },
          {
            id: 'total_earnings',
            name: 'Total',
            formatter: total =>
              _(<DisplayAmount currency={countryData?.currency} value={total as string} />),
          },
        ]}
      />
      <Button className="d-block mb-4 mt-2 mt-md-4 ms-auto ms-md-0" onClick={handleDownload}>
        Exportar <FaFileExport size={24} color="white" className="ms-2" />
      </Button>
    </>
  )
}
