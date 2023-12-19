import React from 'react'
import get from 'lodash/fp/get'
import Button from 'react-bootstrap/Button'
import { _ } from 'gridjs-react'
import { FaBoxes } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

import { useAppSelector } from '../../hooks'
import { CommonHeader, DataGrid, DisplayAmount } from '../../components'
import { useCheckPermission, useGetMemoryCountries } from '../../common'

export const ProductList: React.FC = () => {
  const warehouse = useAppSelector(state => state.system.warehouse)
  const navigate = useNavigate()
  const { getCountryData } = useGetMemoryCountries()
  const { canUpdate, getRole } = useCheckPermission()

  if (!warehouse?.id) return <div />

  const canEdit = canUpdate('Products')
  const role = getRole()
  return (
    <>
      <CommonHeader
        title="Listado de productos"
        link="/cargar-productos"
        btnTex="Crear producto"
        icon={<FaBoxes size={24} className="ms-2" />}
      />
      <DataGrid
        key={`warehouse_${warehouse.id}_products`}
        url="/products"
        queryParams={`?warehouse_id=${warehouse.id}`}
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
            id: 'price',
            name: 'Costo',
            hidden: role !== 'admin',
            data: row =>
              _(
                <DisplayAmount
                  currency={getCountryData(get('country_id', row) as string)?.currency}
                  value={get('price', row) as string}
                />
              ),
          },
          {
            id: 'id',
            name: 'Acciones',
            formatter: id =>
              _(
                <>
                  {canEdit && (
                    <Button
                      onClick={() => navigate(`/producto/${id}`)}
                      size="sm"
                      className="me-2 mb-2 mb-md-0"
                    >
                      Editar
                    </Button>
                  )}
                  <Button
                    onClick={() => navigate(`/agregar-producto/${id}`)}
                    size="sm"
                    style={{ minWidth: '150px' }}
                  >
                    Agregar producto
                  </Button>
                </>
              ),
          },
        ]}
      />
    </>
  )
}
