import React from 'react'
import get from 'lodash/fp/get'
import sumBy from 'lodash/fp/sumBy'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { FaMoneyBill } from 'react-icons/fa'
import { useForm, FieldValues } from 'react-hook-form'

import { ClientList, Credit, ICreatePayments } from '../../../types'
import { CustomInput, DisplayAmount, Loader, RenderErrors } from '../../../components'
import { simpleAlert, useGetMemoryCountries } from '../../../common'
import { useCreatePaymentsMutation, useGetUserQuery } from '../../../features/API'
import { useAppSelector } from '../../../hooks'

export const ModalPayment: React.FC<{
  show: boolean
  client: ClientList
  hide: () => void
  refetch: () => void
  activeCredits: Credit[]
}> = ({ show, hide, refetch, client, activeCredits }) => {
  const id = useAppSelector(state => state.currentUser.data?.id)
  const [createPayments, { isLoading: creating, error }] = useCreatePaymentsMutation()
  const { getCountryData } = useGetMemoryCountries()
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const { data, refetch: refetchUser } = useGetUserQuery(id as ID)

  const onSubmit = (formData: FieldValues) => {
    if (creating) return
    const params = {
      client_id: client.id,
      ...formData,
    } as ICreatePayments

    createPayments(params).then(resp => {
      if (get('data.status', resp) === 'success') {
        simpleAlert({
          html: 'Abono agregado exitosamente',
          icon: 'success',
        })
        refetch()
        reset()
        hide()
        refetchUser()
      } else {
        simpleAlert({
          html: 'Ocurrió un error al agregar el abono',
          icon: 'error',
        })
      }
    })
  }

  const currency = getCountryData(client.country_id)?.currency
  const totalDebt = sumBy('debt', activeCredits) || 0
  return (
    <Modal show={show} onHide={hide} size="lg" centered>
      <Modal.Header className="fs-5">Abonar a {client.company}</Modal.Header>
      <Modal.Body>
        <RenderErrors error={error} />
        <form
          className="mw-500 d-flex justify-content-between flex-wrap"
          onSubmit={handleSubmit(onSubmit)}
        >
          <p className="mb-3 fs-5 w-100">
            # de Comprobante <span className="font-weight-bold">{data?.payments_counter}</span>
          </p>
          {errors.amount && (
            <p className="text-danger mb-1">
              El monto no puede ser mayor a la deuda:{' '}
              <DisplayAmount currency={currency} value={totalDebt} className="fw-semibold" />
            </p>
          )}
          <CustomInput
            icon={<FaMoneyBill size={24} />}
            type="number"
            placeholder="Cantidad del Abono"
            className="mw-49"
            handler={register('amount', { max: totalDebt })}
          />
          <CustomInput
            icon={<FaMoneyBill size={24} />}
            type="text"
            placeholder="Descripción"
            className="mw-49"
            handler={register('comments')}
          />
          <Button className="px-5 mt-2 mw-49 ms-auto" type="submit">
            {creating ? <Loader /> : 'Agregar'}
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  )
}
