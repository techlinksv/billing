import React, { useState } from 'react'
import get from 'lodash/fp/get'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { FaMoneyBill } from 'react-icons/fa'
import { useForm, FieldValues } from 'react-hook-form'

import { Credit, ICreatePayment } from '../../../types'
import { CustomInput, DisplayAmount, Loader, RenderErrors } from '../../../components'
import { expireDate, formatDate, simpleAlert, useGetMemoryCountries } from '../../../common'
import { useCreatePaymentMutation } from '../../../features/API'

export const ModalCredit: React.FC<{
  show: boolean
  credit: Credit
  hide: () => void
  refetch: () => void
}> = ({ show, hide, credit, refetch }) => {
  const [showProducts, setShowProducts] = useState(false)
  const [createPayment, { isLoading: creating, error }] = useCreatePaymentMutation()
  const { getCountryData } = useGetMemoryCountries()
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = (formData: FieldValues) => {
    if (creating) return
    const params = {
      credit_id: credit.id,
      ...formData,
    } as ICreatePayment

    createPayment(params).then(resp => {
      if (get('data.data.credit_id', resp)) {
        simpleAlert({
          html: 'Abono agregado exitosamente',
          icon: 'success',
        })
        refetch()
        reset()
        hide()
      }
    })
  }

  const currency = getCountryData(credit?.order?.client?.country_id)?.currency
  return (
    <Modal show={show} onHide={hide} size="lg" centered>
      <Modal.Header className="fs-5"># Factura {credit?.order?.bill_number}</Modal.Header>
      <Modal.Body>
        <table className="fs-6 w-100 mw-500">
          <tbody>
            <tr>
              <td>Fecha de compra:</td>
              <td className="ps-3 fw-semibold">{formatDate(credit.created_at)}</td>
            </tr>
            <tr>
              <td>Vencimiento:</td>
              <td className="ps-3 fw-semibold">{expireDate(credit.expire_at)}</td>
            </tr>
            <tr>
              <td>Total:</td>
              <td className="ps-3 fw-semibold">
                <DisplayAmount currency={currency} value={credit.amount} />
              </td>
            </tr>
            <tr>
              <td>Deuda:</td>
              <td className="ps-3 fw-semibold">
                <DisplayAmount currency={currency} value={credit.debt} />
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <span
                  className="link-primary fs-12 cursor"
                  onClick={() => setShowProducts(!showProducts)}
                >
                  {showProducts ? 'Ocultar' : 'Mostrar'} lista de productos
                </span>
                {showProducts && (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {credit.order.items.map(el => (
                        <tr key={`shopping-list-${el.id}`}>
                          <td>{el.product.sku}</td>
                          <td>{el.quantity}</td>
                          <td>
                            <DisplayAmount currency={currency} value={el.price} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <RenderErrors error={error} />
        <form
          className="mw-500 d-flex justify-content-between flex-wrap"
          onSubmit={handleSubmit(onSubmit)}
        >
          {errors.amount && (
            <p className="text-danger mb-1">
              El monto no puede ser mayor a la deuda{' '}
              <DisplayAmount currency={currency} value={credit.debt} />
            </p>
          )}
          <CustomInput
            icon={<FaMoneyBill size={24} />}
            type="number"
            placeholder="Cantidad del Abono"
            className="mw-49"
            handler={register('amount', { max: credit.debt })}
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
      </Modal.Footer>
    </Modal>
  )
}
