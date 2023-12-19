import React, { useState, useEffect } from 'react'
import map from 'lodash/fp/map'
import sum from 'lodash/fp/sum'
import flow from 'lodash/fp/flow'
import find from 'lodash/fp/find'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { TiCancel } from 'react-icons/ti'
import SelectSearch, { SelectSearchOption } from 'react-select-search'

import { useCheckPermission, useGetMemoryCountries } from '../../common'
import { Credit, ClientList } from '../../types'
import { useGetClientsQuery } from '../../features/API'
import { CommonHeader, DisplayAmount, Loader } from '../../components'

import { PaymentsGrid } from './components'

export const AddPayment: React.FC = () => {
  const [options, setOptions] = useState<SelectSearchOption[]>([])
  const [currentClient, setCurrentClient] = useState<number>()
  const { data = [], isLoading, refetch } = useGetClientsQuery()
  const { getCountryData } = useGetMemoryCountries()
  const { canDelete } = useCheckPermission()
  const canDeletePayment = canDelete('ManagePayments')
  const client = find({ id: currentClient }, data)

  useEffect(() => {
    if (data.length > 0) {
      setOptions(map((el: ClientList) => ({ name: el.company, value: el.id }), data))
    }
  }, [data])

  if (isLoading) {
    return (
      <div className="text-center py-3 py-lg-5">
        <Loader />
      </div>
    )
  }

  const totalDebt = flow(
    map((el: Credit) => el.debt),
    sum
  )(client?.active_credits)

  const currency = getCountryData(client?.country_id)?.currency
  return (
    <>
      <CommonHeader
        title="Agregar abono"
        link="/anular-abono"
        btnTex="Anular Abono"
        icon={<TiCancel size={24} />}
        hideCTA={!canDeletePayment}
      />
      <SelectSearch
        options={options}
        placeholder="Buscar Local"
        search
        onChange={el => setCurrentClient(el as number)}
      />

      <Row className="mt-3">
        <Col xs={12} lg={6}>
          <div
            className={client ? 'border rounded shadow-sm p-3 w-100 mb-3' : 'd-none'}
            style={{ maxWidth: '450px' }}
          >
            <p className="text-primary mb-2 fs-5">Información del cliente</p>
            <span className="d-block mb-1 fs-5">{client?.company}</span>
            <span className="d-block mb-1 fs-5">
              {client?.first_name} {client?.last_name}
            </span>

            <table className="mt-3">
              <tbody>
                <tr>
                  <td>Crédito disponible: </td>
                  <td className="fw-semibold ps-3">
                    <DisplayAmount currency={currency} value={client?.available_credit || 0} />
                  </td>
                </tr>
                <tr>
                  <td>Deuda total: </td>
                  <td className="fw-semibold ps-3">
                    <DisplayAmount currency={currency} value={totalDebt} />
                  </td>
                </tr>
                <tr>
                  <td>Límite de crédito: </td>
                  <td className="fw-semibold ps-3">
                    <DisplayAmount currency={currency} value={client?.credit_limit || 0} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Col>
        <Col xs={12} lg={6}>
          {client && <PaymentsGrid client={client} refetch={() => refetch()} />}
        </Col>
      </Row>
    </>
  )
}
