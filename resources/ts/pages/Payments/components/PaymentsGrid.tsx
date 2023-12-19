import React, { useState } from 'react'
import get from 'lodash/fp/get'
import find from 'lodash/fp/find'
import Button from 'react-bootstrap/Button'
import { _ } from 'gridjs-react'

import { ClientList, Credit } from '../../../types'
import { ExpireCell, useGetMemoryCountries } from '../../../common'
import { DisplayAmount, SimpleGrid } from '../../../components'

import { ModalPaymentDetails, ModalPayment } from '.'

export const PaymentsGrid: React.FC<{ client: ClientList; refetch: () => void }> = ({
  client,
  refetch,
}) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [currentCredit, setCurrentCredit] = useState<ID>()
  const { getCountryData } = useGetMemoryCountries()

  const activeCredits = get('active_credits', client) || []
  const credit = find({ id: currentCredit }, activeCredits) as Credit
  const dataGrid = activeCredits.map(el => ({
    order: el.order.bill_number,
    expire_at: el.expire_at,
    debt: el.debt,
    id: el.id,
  }))

  if (activeCredits.length <= 0)
    return <p className="fs-6">Este cliente no tiene deudas pendientes</p>

  const currency = getCountryData(client?.country_id)?.currency
  return (
    <div className="mb-3">
      <Button className="mb-2" onClick={() => setShowPaymentModal(true)}>
        Abonar
      </Button>
      <SimpleGrid
        key={`active-credits-${client?.id}`}
        columns={[
          {
            id: 'order',
            name: '# Factura',
          },
          {
            id: 'expire_at',
            name: 'Vencimiento',
            formatter: date => ExpireCell({ date: date as string }),
          },
          {
            id: 'debt',
            name: 'Deuda',
            formatter: debt => _(<DisplayAmount currency={currency} value={debt as string} />),
          },
          {
            id: 'id',
            name: 'Acciones',
            formatter: id =>
              _(
                <Button
                  onClick={() => {
                    setCurrentCredit(id as string)
                    setShowDetailsModal(true)
                  }}
                  size="sm"
                >
                  Detalles
                </Button>
              ),
          },
        ]}
        data={[...dataGrid]}
      />
      {credit && (
        <ModalPaymentDetails
          show={showDetailsModal}
          hide={() => setShowDetailsModal(false)}
          credit={credit}
        />
      )}
      <ModalPayment
        show={showPaymentModal}
        hide={() => setShowPaymentModal(false)}
        refetch={refetch}
        client={client}
        activeCredits={activeCredits}
      />
    </div>
  )
}
