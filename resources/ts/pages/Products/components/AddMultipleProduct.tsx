import React from 'react'
import get from 'lodash/fp/get'
import Button from 'react-bootstrap/Button'
import { FieldValues, useForm } from 'react-hook-form'

import { simpleAlert } from '../../../common'
import { useAppSelector } from '../../../hooks'
import { CustomInput, Loader } from '../../../components'
import { useUploadProductsMutation } from '../../../features/API'

import { AttachFile } from './style'

export const AddMultipleProduct: React.FC = () => {
  const { warehouse } = useAppSelector(state => state.system)
  const [upload, { isLoading }] = useUploadProductsMutation()
  const { register, handleSubmit } = useForm()

  const onSubmit = async (formFile: FieldValues) => {
    const file: File = formFile?.file[0]
    if (isLoading || !file) return

    const formData = new FormData()
    formData.append('file', file)
    formData.append('warehouse_id', `${warehouse.id}`)
    formData.append('country_id', `${warehouse.country_id}`)

    upload(formData)
      .then(res => {
        const html = get('data.message', res)
        simpleAlert({
          icon: html.includes('exitosamente') ? 'success' : 'error',
          html,
        })
      })
      .catch(() => {
        simpleAlert({
          html: 'Hubo un error al subir recibo',
          icon: 'warning',
        })
      })
  }

  return (
    <>
      <p className="fs-5 mb-4">
        Bodega actual: <span className="fw-semibold">{warehouse.name ?? 'Sin seleccionar'}</span>
      </p>

      <AttachFile
        onSubmit={handleSubmit(onSubmit)}
        encType="multipart/form-data"
        className="mw-600"
      >
        <CustomInput
          placeholder="Seleccion tu archivo de productos"
          type="file"
          accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          handler={register('file')}
        />
        <Button className="text-white py-2" type="submit">
          {isLoading ? <Loader /> : 'Subir'}
        </Button>
      </AttachFile>
    </>
  )
}
