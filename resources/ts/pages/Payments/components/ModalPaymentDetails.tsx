import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'

import { Credit } from '../../../types'
import { DisplayAmount } from '../../../components'
import { expireDate, formatDate, useGetMemoryCountries } from '../../../common'

export const ModalPaymentDetails: React.FC<{
  show: boolean
  credit: Credit
  hide: () => void
}> = ({ show, hide, credit }) => {
  const [showProducts, setShowProducts] = useState(false)
  const { getCountryData } = useGetMemoryCountries()

  const onClose = () => {
    hide()
    setShowProducts(false)
  }

  const currency = getCountryData(credit?.order?.client?.country_id)?.currency
  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
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
    </Modal>
  )
}
