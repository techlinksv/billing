import React, { useState } from 'react'
import get from 'lodash/fp/get'
import pick from 'lodash/fp/pick'
import find from 'lodash/fp/find'
import toInteger from 'lodash/fp/toInteger'
import Button from 'react-bootstrap/Button'
import FormGroup from 'react-bootstrap/FormGroup'
import FormLabel from 'react-bootstrap/FormLabel'
import FormSelect from 'react-bootstrap/FormSelect'
import FormControl from 'react-bootstrap/FormControl'
import { FaIdCard } from 'react-icons/fa'
import { RiRoadMapFill } from 'react-icons/ri'
import { BsFillBuildingsFill } from 'react-icons/bs'
import { useForm, FieldValues } from 'react-hook-form'
import { MdPerson, MdPhone, MdPhoneIphone, MdEmail, MdPeople } from 'react-icons/md'

import { Client } from '../../types'
import { useAppSelector } from '../../hooks'
import { CommonHeader, CustomInput, Loader, RenderErrors } from '../../components'
import { useCreateClientMutation } from '../../features/API'
import { simpleAlert } from '../../common'

export const AddClient: React.FC = () => {
  const { country, countries } = useAppSelector(state => state.system)
  const [createClient, { isLoading, error }] = useCreateClientMutation()
  const { register, handleSubmit, reset } = useForm()
  const [selectedCountry, setSelectedCountry] = useState<ID>(countries[0].id)

  const countryToUse = country ?? find({ id: selectedCountry }, countries)

  const onSubmit = (data: FieldValues) => {
    if (isLoading) return

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
      data
    )

    createClient({ ...variables, country_id: countryToUse.id }).then(response => {
      if (get('data.data.id', response)) {
        simpleAlert({ html: 'Cliente agregado exitosamente' })
        reset()
      }
    })
  }

  return (
    <>
      <CommonHeader
        title="Agregar Cliente"
        link="/clientes"
        btnTex="Ver Listado"
        icon={<MdPeople size={24} className="ms-2" />}
      />
      <form onSubmit={handleSubmit(onSubmit)} className="w-100 mw-600">
        {!country && (
          <FormSelect
            className="mb-3"
            size="lg"
            value={selectedCountry}
            onChange={ev => setSelectedCountry(toInteger(ev.currentTarget.value))}
          >
            {countries.map(el => (
              <option key={`country-option-${el.id}`} value={el.id}>
                {el.country}
              </option>
            ))}
          </FormSelect>
        )}
        <CustomInput
          type="text"
          placeholder="Nombre Local"
          icon={<BsFillBuildingsFill size={24} />}
          handler={register('company')}
          className="mb-3"
        />
        <CustomInput
          type="text"
          placeholder="Nombres"
          icon={<MdPerson size={24} />}
          handler={register('first_name')}
          className="mb-3"
        />
        <CustomInput
          type="text"
          placeholder="Apellidos"
          icon={<MdPerson size={24} />}
          handler={register('last_name')}
          className="mb-3"
        />
        <CustomInput
          type="email"
          placeholder="Email ej. email@gmail.com"
          icon={<MdEmail size={24} />}
          handler={register('email')}
          className="mb-3"
          required={false}
        />
        <CustomInput
          type="text"
          placeholder="Dirección"
          icon={<RiRoadMapFill size={24} />}
          handler={register('address')}
          className="mb-3"
          required={false}
        />
        <CustomInput
          type="text"
          placeholder="Teléfono"
          icon={<MdPhone size={24} />}
          handler={register('phone_2')}
          className="mb-3"
          required={false}
        />
        <CustomInput
          type="text"
          placeholder="Celular"
          icon={<MdPhoneIphone size={24} />}
          handler={register('phone')}
          className="mb-3"
          required={false}
        />

        {countryToUse?.document_1 && (
          <CustomInput
            id="doc_1_add"
            type="text"
            placeholder={countryToUse.document_1}
            icon={<FaIdCard size={24} />}
            handler={register('document_1')}
            className="mb-3"
            maskOptions={countryToUse?.mask_1 ? { mask: countryToUse.mask_1 } : undefined}
          />
        )}
        {countryToUse?.document_2 && (
          <CustomInput
            id="doc_2_add"
            type="text"
            placeholder={countryToUse.document_2}
            icon={<FaIdCard size={24} />}
            handler={register('document_2')}
            className="mb-3"
            required={false}
            maskOptions={countryToUse?.mask_2 ? { mask: countryToUse.mask_2 } : undefined}
          />
        )}
        {countryToUse?.document_3 && (
          <CustomInput
            id="doc_3_add"
            type="text"
            placeholder={countryToUse.document_3}
            icon={<FaIdCard size={24} />}
            handler={register('document_3')}
            className="mb-3"
            required={false}
            maskOptions={countryToUse?.mask_3 ? { mask: countryToUse.mask_3 } : undefined}
          />
        )}

        <FormGroup className="mb-3" controlId="client-comments">
          <FormLabel>Observaciones</FormLabel>
          <FormControl as="textarea" rows={3} {...register('comments')} />
        </FormGroup>

        <RenderErrors error={error} />
        <div>
          <Button className="w-100 py-2 fs-5" type="submit">
            {isLoading ? <Loader color="white" /> : 'Agregar Cliente'}
          </Button>
        </div>
      </form>
    </>
  )
}
