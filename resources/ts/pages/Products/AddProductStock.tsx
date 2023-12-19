import React, { useState } from 'react'
import Swal from 'sweetalert2'
import get from 'lodash/fp/get'
import capitalize from 'lodash/fp/capitalize'
import Button from 'react-bootstrap/Button'
import { _ } from 'gridjs-react'
import { FaBoxes } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { TDataObjectRow } from 'gridjs/dist/src/types'
import { useForm, FieldValues } from 'react-hook-form'
import { BsChatLeftTextFill } from 'react-icons/bs'
import { MdProductionQuantityLimits } from 'react-icons/md'

import { useAppSelector } from '../../hooks'
import { CommonHeader, CustomInput, DataGrid, Loader } from '../../components'
import { confirmAlert, loaderAlert, simpleAlert } from '../../common'
import { useCreateMovementMutation, useGetProductQuery } from '../../features/API'

export const AddProductStock: React.FC = () => {
  const { id = '' } = useParams()
  const { data, refetch } = useGetProductQuery(id)
  const [idx, setIdx] = useState(1)
  const warehouse = useAppSelector(state => state.system.warehouse)
  const [createMovement, { isLoading: updating }] = useCreateMovementMutation()
  const { reset, register, handleSubmit } = useForm()

  const product = data?.data

  const handleCancel = (movement: TDataObjectRow) => {
    if (updating) return

    const comments = `Movimiento ${movement.id} anulado`
    confirmAlert({
      html: '¿Está seguro de que desea anular este movimiento?',
      confirmButtonText: 'Sí, anular',
      cancelButtonText: 'No',
    }).then(response => {
      if (response.value) {
        loaderAlert({ html: 'anulando...' })

        createMovement({
          batch_id: movement.batch_id as ID,
          quantity: movement.quantity as number,
          type: 'salida',
          comments,
          movement_id: movement.id as ID,
          product_id: get('batch.product_id', movement) as ID,
        }).then(resp => {
          Swal.close()
          if (get('data.data.id', resp)) {
            simpleAlert({ html: 'Movimiento anulado exitosamente', icon: 'success' })
            refetch()
            setIdx(prev => prev + 1)
          } else {
            simpleAlert({ html: 'No fue posible anular movimineot', icon: 'error' })
          }
        })
      }
    })
  }

  const onSubmit = (formData: FieldValues) => {
    if (updating || !product) return

    loaderAlert({ html: 'agregando...' })
    createMovement({
      batch_id: product.batch_id,
      quantity: formData.quantity,
      type: 'entrada',
      comments: formData.comments,
      product_id: product.id as ID,
    }).then(resp => {
      Swal.close()
      if (get('data.data.id', resp)) {
        simpleAlert({ html: 'Producto agregado exitosamente', icon: 'success' })
        reset()
        refetch()
        setIdx(prev => prev + 1)
      } else {
        simpleAlert({ html: 'No fue posible agregar producto', icon: 'error' })
      }
    })
  }

  return (
    <>
      <CommonHeader
        title="Agregar Producto"
        link="/listado-de-productos"
        btnTex="Listado de productos"
        icon={<FaBoxes size={24} className="ms-2" />}
      />

      <div className="mt-2 mb-4 border rounded shadow-sm p-3 w-fit-content">
        <p className="text-primary mb-2 fs-5">Información del producto</p>
        <span className="d-block mb-1 fs-6">Código: {product?.sku}</span>
        <span className="d-block mb-1 fs-6">Nombre: {product?.name}</span>
        <span className="d-block mb-3 fs-6">
          Cantidad disponible:
          <span className="fw-semibold ms-1">
            {product?.quantity} {product?.units}
          </span>
        </span>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="d-flex justify-content-between align-items-center flex-wrap w-100 mw-500"
        >
          <CustomInput
            icon={<MdProductionQuantityLimits size={24} />}
            type="number"
            placeholder="Cantidad"
            handler={register('quantity', { min: 1 })}
            className="mw-49 fs-6"
          />
          <CustomInput
            icon={<BsChatLeftTextFill size={24} />}
            type="text"
            placeholder="Comentario"
            handler={register('comments', { max: product?.quantity })}
            className="mw-49 fs-6"
            required={false}
          />
          <Button className="w-100 mt-3" type="submit">
            {updating ? <Loader /> : 'Agregar producto'}
          </Button>
        </form>
      </div>

      <p className="fs-5 mb-0 mt-0 mt-lg-5 px-1">Listado de movimientos</p>
      <DataGrid
        key={`warehouse${warehouse.id}-movements-${idx}`}
        url="/movements"
        queryParams={`?warehouse_id=${warehouse.id}&product_id=${id}`}
        columns={[
          {
            id: 'id',
            name: 'ID',
          },
          {
            id: 'movement_number',
            name: '# Movimiento',
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
            id: 'quantity',
            name: 'Cantidad',
          },
          {
            id: 'comments',
            name: 'Comentario',
            width: '200px',
          },
          {
            id: 'id',
            name: 'Acciones',
            data: row => {
              if (get('type', row) === 'salida') return ''
              if (get('canceled', row) === true) return 'anulado'
              return _(
                <Button size="sm" onClick={() => handleCancel(row as TDataObjectRow)}>
                  Anular
                </Button>
              )
            },
          },
        ]}
      />
    </>
  )
}
