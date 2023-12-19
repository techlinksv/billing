import React, { useState, useEffect } from 'react'
import get from 'lodash/fp/get'
import map from 'lodash/fp/map'
import capitalize from 'lodash/fp/capitalize'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import { FaFileExport } from 'react-icons/fa'
import SelectSearch, { SelectSearchOption } from 'react-select-search'

import { Product } from '../../../types'
import { DataGrid } from '../../../components'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { useGetProductsQuery } from '../../../features/API'
import { downloadFile, dateWithTime } from '../../../common'

export const MovementReport: React.FC<{ title?: string }> = ({ title }) => {
  const dispatch = useAppDispatch()
  const { warehouse } = useAppSelector(state => state.system)
  const [products, setProducts] = useState<SelectSearchOption[]>()
  const [currentProduct, setCurrentProduct] = useState<number>()
  const { data } = useGetProductsQuery()
  const [idx, setIdx] = useState(0)

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

  const handleFilter = (ev: React.MouseEvent) => {
    ev.preventDefault()
    setIdx(prev => prev + 1)
  }

  const handleDownload = (ev: React.MouseEvent) => {
    ev.preventDefault()
    dispatch(
      downloadFile({
        endpoint: '/report/movements-export',
        params: `?warehouse_id=${warehouse.id}${
          currentProduct ? `&product_id=${currentProduct}` : ''
        }`,
        name: `Movimientos.xlsx`,
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

      <div className="mt-3 mb-4 d-flex flex-wrap">
        {products && (
          <SelectSearch
            options={products}
            placeholder="Filtrar por código de producto"
            search
            onChange={el => setCurrentProduct(el as number)}
          />
        )}
        <Button className="ms-0 ms-md-3 mt-2 mt-md-0" onClick={handleFilter}>
          Filtrar
        </Button>
      </div>

      <DataGrid
        key={`warehouse_${warehouse.id}_${idx}}`}
        url="/movements"
        queryParams={`?warehouse_id=${warehouse.id}${
          currentProduct ? `&product_id=${currentProduct}` : ''
        }`}
        search={false}
        columns={[
          {
            id: 'id',
            name: 'ID',
          },
          {
            id: 'user',
            name: 'Usuario',
            formatter: user => get('name', user),
          },
          {
            id: 'type',
            name: 'Movimiento',
            formatter: type => capitalize(type as string),
          },
          {
            id: 'batch',
            name: 'Código',
            data: row => get('batch.product.sku', row),
          },
          {
            id: 'quantity',
            name: 'Cantidad',
          },
          {
            id: 'created_at',
            name: 'Fecha',
            formatter: date => dateWithTime(date),
          },
          {
            id: 'comments',
            name: 'Comentario',
            width: '200px',
          },
          {
            id: 'id',
            name: ' ',
            data: row => {
              if (get('canceled', row) === true) return 'anulado'
              return ''
            },
          },
        ]}
      />

      <Button className="d-block mb-4 mt-2 mt-md-4 ms-auto ms-md-0" onClick={handleDownload}>
        Exportar <FaFileExport size={24} color="white" className="ms-2" />
      </Button>
    </>
  )
}
