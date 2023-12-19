import React from 'react'
import get from 'lodash/fp/get'
import isEmpty from 'lodash/fp/isEmpty'
import Button from 'react-bootstrap/Button'
import { _ } from 'gridjs-react'
import { Link } from 'react-router-dom'
import { FaFileExport } from 'react-icons/fa'

import { useAppDispatch, useAppSelector } from '../../../hooks'
import { useGetInventoryTotalQuery } from '../../../features/API'
import { DataGrid, DisplayAmount, Loader } from '../../../components'
import { useCheckPermission, useGetMemoryCountries, downloadFile } from '../../../common'

export const InventoryReport: React.FC<{ title?: string }> = ({ title }) => {
  const dispatch = useAppDispatch()
  const { warehouse } = useAppSelector(state => state.system)
  const { getCountryData } = useGetMemoryCountries()
  const { getRole } = useCheckPermission()
  const { data, isLoading } = useGetInventoryTotalQuery(warehouse.id)
  const role = getRole()

  const countryData = getCountryData(warehouse.country_id)

  const handleDownload = (ev: React.MouseEvent) => {
    ev.preventDefault()
    dispatch(
      downloadFile({
        endpoint: '/report/batches-export',
        params: `?warehouse_id=${warehouse.id}`,
        name: 'Inventario.xlsx',
      })
    )
  }

  return (
    <>
      {title && <p className="fs-4 pt-2 mb-1 d-inline-block">{title}</p>}
      <Link to="/reportes">
        <Button size="sm" className="ms-3 mb-1">
          Reportes
        </Button>
      </Link>

      <p>Bodega: {warehouse.name}</p>
      {role === 'admin' && (
        <div className="fs-5 mb-3">
          <span className="pe-2">Total:</span>
          {isEmpty(!data?.total) && !isLoading && (
            <DisplayAmount currency={countryData.currency} value={data?.total || 0} />
          )}
          {isLoading && <Loader />}
        </div>
      )}

      <DataGrid
        key={`inventory-report-${warehouse.id}`}
        url="/report/batches"
        queryParams={`?warehouse_id=${warehouse.id}`}
        columns={[
          {
            id: 'sku',
            name: 'Código',
          },
          {
            id: 'name',
            name: 'Nombre',
          },
          {
            id: 'quantity',
            name: 'Cantidad en bodega',
          },
          {
            id: 'price',
            name: 'Costo',
            hidden: role !== 'admin',
            data: row =>
              _(
                <DisplayAmount
                  currency={countryData?.currency}
                  value={get('price', row) as string}
                />
              ),
          },
          {
            id: 'total',
            name: 'Total',
            hidden: role !== 'admin',
            data: row =>
              _(
                <DisplayAmount
                  currency={countryData?.currency}
                  value={get('total', row) as string}
                />
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
