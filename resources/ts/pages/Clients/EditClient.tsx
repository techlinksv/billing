import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import get from 'lodash/fp/get'
import pick from 'lodash/fp/pick'
import find from 'lodash/fp/find'
import Button from 'react-bootstrap/Button'
import FormGroup from 'react-bootstrap/FormGroup'
import FormLabel from 'react-bootstrap/FormLabel'
import FormControl from 'react-bootstrap/FormControl'
import { FaIdCard } from 'react-icons/fa'
import { RiRoadMapFill } from 'react-icons/ri'
import { BsFillBuildingsFill } from 'react-icons/bs'
import { useParams, Navigate, useNavigate } from 'react-router-dom'
import { useForm, FieldValues } from 'react-hook-form'
import {
  MdPerson,
  MdPhone,
  MdPhoneIphone,
  MdEmail,
  MdPeople,
  MdDeleteForever,
} from 'react-icons/md'

import { Client } from '../../types'
import { useAppSelector } from '../../hooks'
import { confirmAlert, simpleAlert, loaderAlert, useCheckPermission } from '../../common'
import { CommonHeader, CustomInput, Loader, RenderErrors } from '../../components'
import {
  useUpdateClientMutation,
  useGetClientQuery,
  useDeleteClientMutation,
} from '../../features/API'

export const EditClient: React.FC = () => {
  const { id = '' } = useParams()
  const { data, isLoading, refetch } = useGetClientQuery(id)
  const { country, countries } = useAppSelector(state => state.system)
  const [updateClient, { error, isLoading: updating }] = useUpdateClientMutation()
  const [deleteClient, { error: errorDelete, isLoading: deleting }] = useDeleteClientMutation()
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()
  const [selectedCountry, setSelectedCountry] = useState<ID>()
  const { canDelete } = useCheckPermission()

  useEffect(() => {
    if (!selectedCountry && data?.data.country_id && selectedCountry !== data?.data.country_id) {
      setSelectedCountry(data?.data.country_id)
    }
  }, [data, selectedCountry])

  if (isLoading) {
    return (
      <div className="text-center py-3 py-lg-5">
        <Loader />
      </div>
    )
  }

  const countryToUse = country ?? find({ id: selectedCountry }, countries)
  const client = data?.data
  if (!data && !isLoading && !client) return <Navigate to="/clientes" />

  const onSubmit = (formData: FieldValues) => {
    if (updating) return
    const variables: Client = pick(
      [
        'company',
        'first_name',
        'last_name',
        'email',
        'address',
        'phone_2',
        'phone',
        'document_1',
        'document_2',
        'document_3',
        'comments',
      ],
      formData
    )
    updateClient({ ...variables, country_id: countryToUse.id, id }).then(response => {
      if (get('data.data.id', response)) {
        simpleAlert({ html: 'Cliente actualizado exitosamente' })
        refetch()
      }
    })
  }

  const handleDelete = (ev: React.MouseEvent) => {
    ev.preventDefault()
    if (deleting) return

    confirmAlert({
      html: '¿Está seguro de que desea eliminar este cliente?',
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
            navigate('/clientes')
          }
        })
      }
    })
  }

  const canDeleteClient = canDelete('AddClient')
  return (
    <>
      <CommonHeader
        title="Editar Cliente"
        link="/clientes"
        btnTex="Ver Listado"
        icon={<MdPeople size={24} className="ms-2" />}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="w-100 mw-600">
        <CustomInput
          label
          type="text"
          placeholder="Nombre Local"
          icon={<BsFillBuildingsFill size={24} />}
          handler={register('company')}
          className="mb-3"
          defeaultValue={client?.company}
        />
        <CustomInput
          label
          type="text"
          placeholder="Nombres"
          icon={<MdPerson size={24} />}
          handler={register('first_name')}
          className="mb-3"
          defeaultValue={client?.first_name}
        />
        <CustomInput
          label
          type="text"
          placeholder="Apellidos"
          icon={<MdPerson size={24} />}
          handler={register('last_name')}
          className="mb-3"
          defeaultValue={client?.last_name}
        />
        <CustomInput
          label
          type="email"
          placeholder="Email ej. email@gmail.com"
          icon={<MdEmail size={24} />}
          handler={register('email')}
          className="mb-3"
          required={false}
          defeaultValue={client?.email}
        />
        <CustomInput
          label
          type="text"
          placeholder="Dirección"
          icon={<RiRoadMapFill size={24} />}
          handler={register('address')}
          className="mb-3"
          required={false}
          defeaultValue={client?.address}
        />
        <CustomInput
          label
          type="text"
          placeholder="Teléfono"
          icon={<MdPhone size={24} />}
          handler={register('phone_2')}
          className="mb-3"
          required={false}
          defeaultValue={client?.phone_2}
        />
        <CustomInput
          label
          type="text"
          placeholder="Celular"
          icon={<MdPhoneIphone size={24} />}
          handler={register('phone')}
          className="mb-3"
          required={false}
          defeaultValue={client?.phone}
        />

        {countryToUse?.document_1 && (
          <CustomInput
            id="doc_1_edit"
            label
            type="text"
            placeholder={countryToUse.document_1}
            icon={<FaIdCard size={24} />}
            handler={register('document_1')}
            className="mb-3"
            defeaultValue={client?.document_1}
            maskOptions={countryToUse?.mask_1 ? { mask: countryToUse.mask_1 } : undefined}
          />
        )}
        {countryToUse?.document_2 && (
          <CustomInput
            id="doc_2_edit"
            label
            type="text"
            placeholder={countryToUse.document_2}
            icon={<FaIdCard size={24} />}
            handler={register('document_2')}
            className="mb-3"
            required={false}
            defeaultValue={client?.document_2}
            maskOptions={countryToUse?.mask_2 ? { mask: countryToUse.mask_2 } : undefined}
          />
        )}
        {countryToUse?.document_3 && (
          <CustomInput
            id="doc_3_edit"
            label
            type="text"
            placeholder={countryToUse.document_3}
            icon={<FaIdCard size={24} />}
            handler={register('document_3')}
            className="mb-3"
            required={false}
            defeaultValue={client?.document_3}
            maskOptions={countryToUse?.mask_3 ? { mask: countryToUse.mask_3 } : undefined}
          />
        )}

        <FormGroup className="mb-3" controlId="client-comments">
          <FormLabel>Observaciones</FormLabel>
          <FormControl as="textarea" rows={3} {...register('comments')} />
        </FormGroup>

        <RenderErrors error={errorDelete || error} />
        <div className="d-flex flex-wrap justify-content-between pb-3">
          {canDeleteClient && (
            <Button onClick={handleDelete} className="py-2 fs-6 px-2" variant="secondary">
              Borrar <MdDeleteForever />
            </Button>
          )}
          <Button className="w-75 py-2 fs-6 px-2" type="submit">
            {updating ? <Loader color="white" /> : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </>
  )
}
