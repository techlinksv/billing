import React from 'react'
import get from 'lodash/fp/get'
import Button from 'react-bootstrap/Button'
import { FaMoneyBill } from 'react-icons/fa'
import { TfiShortcode } from 'react-icons/tfi'
import { TbRulerMeasure } from 'react-icons/tb'
import { MdDriveFileRenameOutline } from 'react-icons/md'
import { useForm, FieldValues } from 'react-hook-form'

import { useAppSelector } from '../../../hooks'
import { useCreateProductMutation } from '../../../features/API'
import { CustomInput, Loader, RenderErrors } from '../../../components'
import { simpleAlert, useCheckPermission } from '../../../common'
import { Product } from '../../../types'

export const AddSingleProduct: React.FC = () => {
  const { warehouse } = useAppSelector(state => state.system)
  const { handleSubmit, register, reset } = useForm()
  const [createProduct, { isLoading, error }] = useCreateProductMutation()
  const { getRole } = useCheckPermission()

  const onSubmit = (data: FieldValues) => {
    if (isLoading) return

    const variables = {
      ...data,
      country_id: warehouse.country_id,
      price: data.price ? data.price : undefined,
      quantity: data.quantity ? data.quantity : undefined,
    }

    createProduct(variables as Product).then(response => {
      if (get('data.data.id', response)) {
        simpleAlert({ html: 'Producto agregado exitosamente' })
        reset()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-100 mw-600">
      <p className="fs-5">
        Bodega actual: <span className="fw-semibold">{warehouse.name ?? 'Sin seleccionar'}</span>
      </p>

      <CustomInput
        type="text"
        placeholder="Código de producto"
        icon={<TfiShortcode size={24} />}
        handler={register('sku')}
        className="mb-3"
      />
      <CustomInput
        type="text"
        placeholder="Nombre"
        icon={<MdDriveFileRenameOutline size={24} />}
        handler={register('name')}
        className="mb-3"
      />
      <CustomInput
        type="number"
        placeholder="Cantidad"
        icon={<FaMoneyBill size={24} />}
        handler={register('quantity')}
        className="mb-3"
        required={false}
      />
      {getRole() === 'admin' && (
        <CustomInput
          type="number"
          placeholder="Costo"
          icon={<FaMoneyBill size={24} />}
          handler={register('price')}
          className="mb-3"
          required={false}
        />
      )}
      <CustomInput
        type="text"
        placeholder="Unidad ej: m, kg, cm"
        icon={<TbRulerMeasure size={24} />}
        handler={register('units')}
        className="mb-3"
      />
      <CustomInput
        type="text"
        placeholder="Descripción"
        icon={<MdDriveFileRenameOutline size={24} />}
        handler={register('description')}
        className="mb-3"
        required={false}
      />
      <CustomInput
        type="text"
        placeholder="Comentario"
        icon={<MdDriveFileRenameOutline size={24} />}
        handler={register('comments')}
        className="mb-3"
        required={false}
      />

      <RenderErrors error={error} />
      <div>
        <Button className="w-100 py-2 fs-5" type="submit">
          {isLoading ? <Loader color="white" /> : 'Agregar Producto'}
        </Button>
      </div>
    </form>
  )
}
