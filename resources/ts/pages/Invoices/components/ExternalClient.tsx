import React from 'react'
import get from 'lodash/fp/get'
import Button from 'react-bootstrap/Button'
import FormCheck from 'react-bootstrap/FormCheck'
import { useForm, FieldValues } from 'react-hook-form'
import { MdPerson } from 'react-icons/md'
import { BsFillBuildingsFill } from 'react-icons/bs'

import { CustomInput, Loader, RenderErrors } from '../../../components'
import { ICreateOrder, IShoppingListItem, PaymentType } from '../../../types'
import { useAppSelector } from '../../../hooks'
import { useCreateOrderMutation, useGetProductsQuery } from '../../../features/API'
import { simpleAlert } from '../../../common'

export const ExternalClient: React.FC<{
  refetchUser: () => void
  shoppingList: IShoppingListItem[]
  setShoppingList: React.Dispatch<React.SetStateAction<IShoppingListItem[]>>
  taxValue: number
}> = ({ shoppingList = [], setShoppingList, refetchUser, taxValue }) => {
  const { warehouse } = useAppSelector(state => state.system)
  const { register, handleSubmit } = useForm()
  const [createOrder, { isLoading, error }] = useCreateOrderMutation()
  const { refetch } = useGetProductsQuery()

  const onSubmit = (formData: FieldValues) => {
    if (isLoading) return

    const iva = document.querySelector<HTMLInputElement>('#checkbox-iva')
    const tax = document.querySelector<HTMLInputElement>('#checkbox-tax')
    const params: ICreateOrder = {
      client_company: formData.client_company || undefined,
      client_first_name: formData.client_first_name,
      client_last_name: formData.client_last_name,
      payment_type: 'efectivo' as PaymentType,
      warehouse_id: warehouse.id,
      country_id: warehouse.country_id,
      items: shoppingList,
      has_iva: iva?.checked ?? false,
      has_tax: tax?.checked ?? false,
      tax: taxValue,
    }

    createOrder(params).then(resp => {
      if (get('data.data.id', resp)) {
        simpleAlert({
          html: 'Compra registrada exitosamente',
          icon: 'success',
        })
        setShoppingList([])
        sessionStorage.removeItem('temp_shopping_list')
        refetch()
        refetchUser()
      }
    })
  }

  return (
    <form className="my-4" onSubmit={handleSubmit(onSubmit)}>
      <RenderErrors error={error} />
      <CustomInput
        icon={<BsFillBuildingsFill size={24} />}
        placeholder="Nombre de Local"
        handler={register('client_company')}
        className="mb-2"
        required={false}
      />
      <CustomInput
        icon={<MdPerson size={24} />}
        placeholder="Nombre"
        handler={register('client_first_name')}
        className="mb-2"
      />
      <CustomInput
        icon={<MdPerson size={24} />}
        placeholder="Apellido"
        handler={register('client_last_name')}
        className="mb-2"
      />
      <p className="mb-2 mt-3 fs-6">Metodo de pago</p>
      <FormCheck type="radio">
        <FormCheck.Input type="radio" checked readOnly />
        <FormCheck.Label>Efectivo</FormCheck.Label>
      </FormCheck>

      <Button className="mt-3 fs-5 w-50 mx-auto d-block" type="submit">
        {isLoading ? <Loader color="white" /> : 'Registrar'}
      </Button>
    </form>
  )
}
