import React from 'react'
import Swal from 'sweetalert2'
import get from 'lodash/fp/get'
import Button from 'react-bootstrap/Button'
import { TfiShortcode } from 'react-icons/tfi'
import { FaMoneyBill, FaBoxes } from 'react-icons/fa'
import { useForm, FieldValues } from 'react-hook-form'
import { useParams, Navigate, useNavigate } from 'react-router-dom'
import { MdDriveFileRenameOutline, MdDeleteForever } from 'react-icons/md'

import { Product } from '../../types'
import { useAppSelector } from '../../hooks'
import { confirmAlert, loaderAlert, simpleAlert, useCheckPermission } from '../../common'
import { CommonHeader, CustomInput, Loader, RenderErrors } from '../../components'
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductQuery,
} from '../../features/API'

export const EditProduct: React.FC = () => {
  const { id = '' } = useParams()
  const { data, isLoading } = useGetProductQuery(id)
  const { warehouse } = useAppSelector(state => state.system)
  const [editProduct, { isLoading: updating, error }] = useUpdateProductMutation()
  const [deleteClient, { error: errorDelete, isLoading: deleting }] = useDeleteProductMutation()
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()
  const { canDelete, getRole } = useCheckPermission()
  const role = getRole()

  if (isLoading) {
    return (
      <div className="text-center py-3 py-lg-5">
        <Loader />
      </div>
    )
  }
  const product = data?.data
  if (!data && !isLoading && !product) return <Navigate to="/listado-de-productos" />

  const onSubmit = (formData: FieldValues) => {
    if (updating) return

    const variables = {
      ...formData,
      country_id: warehouse.country_id,
      id,
    }

    editProduct(variables as Product).then(response => {
      if (get('data.data.id', response)) {
        simpleAlert({ html: 'Producto agregado exitosamente' })
      }
    })
  }

  const handleDelete = (ev: React.MouseEvent) => {
    ev.preventDefault()
    if (deleting) return

    confirmAlert({
      html: '¿Está seguro de que desea eliminar este producto?',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No',
    }).then(response => {
      if (response.value) {
        loaderAlert({ html: 'borrando...' })

        deleteClient(id).then(resp => {
          Swal.close()
          const msg: string = get('data.message', resp) || ''
          simpleAlert({ html: msg, icon: msg.includes('exitosamente') ? 'success' : 'error' })
          if (msg.includes('exitosamente')) {
            navigate('/listado-de-productos')
          }
        })
      }
    })
  }

  const canDeleteProduct = canDelete('Products')
  return (
    <>
      <CommonHeader
        title="Editar Producto"
        link="/listado-de-productos"
        btnTex="Listado de productos"
        icon={<FaBoxes size={24} className="ms-2" />}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="w-100 mw-600">
        <p className="fs-5">
          Bodega actual: <span className="fw-semibold">{warehouse.name ?? 'Sin seleccionar'}</span>
        </p>

        <CustomInput
          label
          type="text"
          placeholder="Código de producto"
          icon={<TfiShortcode size={24} />}
          handler={register('sku')}
          className="mb-3"
          defeaultValue={product?.sku}
        />
        <CustomInput
          label
          type="text"
          placeholder="Nombre"
          icon={<MdDriveFileRenameOutline size={24} />}
          handler={register('name')}
          className="mb-3"
          defeaultValue={product?.name}
        />
        <CustomInput
          label
          type="text"
          placeholder="Cantidad"
          icon={<FaMoneyBill size={24} />}
          handler={register('quantity')}
          className="mb-3"
          required={false}
          defeaultValue={product?.quantity || 0}
        />
        {role === 'admin' && (
          <CustomInput
            label
            type="text"
            placeholder="Costo"
            icon={<FaMoneyBill size={24} />}
            handler={register('price')}
            className="mb-3"
            required={false}
            defeaultValue={product?.price || 0}
          />
        )}
        <CustomInput
          label
          type="text"
          placeholder="Descripción"
          icon={<MdDriveFileRenameOutline size={24} />}
          handler={register('description')}
          className="mb-3"
          required={false}
          defeaultValue={product?.description}
        />
        <CustomInput
          label
          type="text"
          placeholder="Comentario"
          icon={<MdDriveFileRenameOutline size={24} />}
          handler={register('comments')}
          className="mb-3"
          required={false}
          defeaultValue={product?.comments}
        />

        <RenderErrors error={errorDelete || error} />
        <div className="d-flex flex-wrap justify-content-between">
          {canDeleteProduct && (
            <Button onClick={handleDelete} className="py-2 fs-6 px-2" variant="secondary">
              Borrar <MdDeleteForever />
            </Button>
          )}
          <Button className="w-75 py-2 fs-6" type="submit">
            {updating ? <Loader color="white" /> : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </>
  )
}
