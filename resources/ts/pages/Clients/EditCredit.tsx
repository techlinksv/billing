import React from 'react'
import get from 'lodash/fp/get'
import getOr from 'lodash/fp/getOr'
import Button from 'react-bootstrap/Button'
import { FaCreditCard } from 'react-icons/fa'
import { RiMoneyDollarCircleFill } from 'react-icons/ri'
import { useForm, FieldValues } from 'react-hook-form'
import { useParams, Navigate, Link } from 'react-router-dom'

import {
  useCreateOrderMutation,
  useGetClientQuery,
  useUpdateClientMutation,
} from '../../features/API'
import { Client } from '../../types'
import { useAppSelector } from '../../hooks'
import { defaultExpireDate, simpleAlert, useGetMemoryCountries } from '../../common'
import { CommonHeader, CustomInput, DisplayAmount, Loader, RenderErrors } from '../../components'

export const EditCredit: React.FC = () => {
  const { id = '' } = useParams()
  const { register, handleSubmit } = useForm()
  const warehouse = useAppSelector(state => state.system.warehouse)
  const { data, isLoading, refetch } = useGetClientQuery(id)
  const [updateClient, { error, isLoading: updating }] = useUpdateClientMutation()
  const [createOrder] = useCreateOrderMutation()
  const { getCountryData } = useGetMemoryCountries()

  if (isLoading) {
    return (
      <div className="text-center py-3 py-lg-5">
        <Loader />
      </div>
    )
  }
  const client = data?.data
  if (!data && !isLoading && !client) return <Navigate to="/gestionar-creditos" />

  const onSubmit = (formData: FieldValues) => {
    if (updating || !client) return
    const variables = {
      id,
      credit_limit: formData.credit_limit,
    } as Client

    updateClient(variables)
      .then(response => {
        if (get('data.data.id', response)) {
          simpleAlert({ html: 'Crédito actualizado exitosamente' })
          refetch()
        }
      })
      .then(() => {
        if (formData?.initial_amount) {
          createOrder({
            debt: formData.initial_amount,
            client_company: client.company,
            client_first_name: client.first_name,
            client_last_name: client.last_name,
            payment_type: 'credito',
            credit_date: defaultExpireDate(),
            client_id: client.id,
            warehouse_id: warehouse.id,
            items: [],
            has_iva: false,
            has_tax: false,
          })
        }
      })
  }

  const currentLimit = getOr(0, 'credit_limit', client)
  const currency = getCountryData(client?.country_id)?.currency
  return (
    <>
      <CommonHeader
        title="Editar crédito"
        link="/gestionar-creditos"
        btnTex="Gestionar créditos"
        icon={<FaCreditCard size={24} className="ms-2" />}
      />
      <div>
        <p className="fs-4 fw-semibold mb-1">{client?.company}</p>
        <span className="fs-6">
          {client?.first_name} {client?.last_name}
        </span>

        {currentLimit > 0 && (
          <>
            <p className="mt-3 fs-5 mb-1">
              Límite de crédito actual:
              <DisplayAmount
                currency={currency}
                value={client?.credit_limit || 0}
                className="text-primary fw-semibold ms-1"
              />
            </p>
            <p className="fs-5">
              Crédito disponible:
              <DisplayAmount
                currency={currency}
                value={client?.available_credit || 0}
                className="text-primary fw-semibold ms-1"
              />
            </p>
          </>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-100 mw-600 mt-4 border shadow-sm rounded p-3 p-lg-4"
        >
          <p className="fs-5">{currentLimit > 0 ? 'Actualizar' : 'Agregar'} límite de crédito</p>
          <CustomInput
            type="number"
            placeholder="Límite de crédito"
            icon={<FaCreditCard size={24} />}
            handler={register('credit_limit')}
            className="mb-4"
            defeaultValue={client?.credit_limit}
          />

          {currentLimit <= 0 && (
            <CustomInput
              type="number"
              placeholder="Deuda Inicial"
              icon={<RiMoneyDollarCircleFill size={24} />}
              handler={register('initial_amount')}
              className="mt-5 mb-3"
              required={false}
            />
          )}

          <RenderErrors error={error} />
          <div className="d-flex flex-wrap justify-content-between">
            <Link to={`/estado-de-credito/${id}`}>
              <Button variant="outline-primary" className="py-2 px-2 fs-6">
                Ver estado de crédito
              </Button>
            </Link>
            <Button className="py-2 px-2 fs-6" type="submit">
              {updating ? <Loader color="white" /> : 'Actualizar'}
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}
