import React, { useState } from 'react'
import get from 'lodash/fp/get'
import flow from 'lodash/fp/flow'
import head from 'lodash/fp/head'
import split from 'lodash/fp/split'
import getOr from 'lodash/fp/getOr'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { _ } from 'gridjs-react'
import { useForm, FieldValues } from 'react-hook-form'
import { FaCreditCard } from 'react-icons/fa'
import { useParams, Navigate, Link } from 'react-router-dom'
import { MdCalendarMonth } from 'react-icons/md'

import { Credit } from '../../types'
import { useGetClientQuery, useUpdateCreditMutation } from '../../features/API'
import { CommonHeader, CustomInput, DataGrid, DisplayAmount, Loader } from '../../components'
import {
  ExpireCell,
  expireDate,
  formatDate,
  simpleAlert,
  useCheckPermission,
  useGetMemoryCountries,
} from '../../common'

export const CreditState: React.FC = () => {
  const { id = '' } = useParams()
  const { data, isLoading } = useGetClientQuery(id)
  const { getCountryData } = useGetMemoryCountries()
  const { canUpdate } = useCheckPermission()
  const [currentCredit, setCurrentCredit] = useState<Credit>()
  const [showModal, setShowModal] = useState(false)
  const { register, handleSubmit, reset } = useForm()
  const [updateCredit, { isLoading: updating }] = useUpdateCreditMutation()
  const [idx, setIdx] = useState(0)

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
    if (updating || !currentCredit) return

    updateCredit({ id: currentCredit.id, ...formData }).then(resp => {
      if (get('data.data.id', resp)) {
        simpleAlert({
          html: 'Fecha de vencimiento actualizada exitosamente',
          icon: 'success',
        })
      } else {
        simpleAlert({
          html: 'No fue posible actualizar fecha de vencimiento',
          icon: 'error',
        })
      }
      setIdx(prev => prev + 1)
      setShowModal(false)
      reset()
      setCurrentCredit(undefined)
    })
  }

  const currentLimit = getOr(0, 'credit_limit', client)
  const currency = getCountryData(client?.country_id)?.currency
  const canEdit = canUpdate('ManageCredits')
  return (
    <>
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header className="fs-5"># Factura: {currentCredit?.order.bill_number}</Modal.Header>
        <Modal.Body>
          <p className="fs-6 text-primary fw-semibold">
            {currentCredit?.order.client.company}
            <span className="d-block fs-12 fw-normal">
              {currentCredit?.order.client.first_name} {currentCredit?.order.client.last_name}
            </span>
          </p>
          <table className="fs-6">
            <tbody>
              <tr>
                <td className="pe-3">Fecha de compra:</td>
                <td>{formatDate(currentCredit?.created_at || '')}</td>
              </tr>
              <tr>
                <td className="pe-3">Total:</td>
                <td>
                  <DisplayAmount value={currentCredit?.amount || ''} currency={currency} />
                </td>
              </tr>
              <tr>
                <td className="pe-3">Deuda:</td>
                <td>
                  <DisplayAmount value={currentCredit?.debt || ''} currency={currency} />
                </td>
              </tr>
              <tr>
                <td>Vencimiento:</td>
                <td>{expireDate(currentCredit?.expire_at || '')}</td>
              </tr>
              <tr>
                <td className="pe-3">Comentario:</td>
                <td>{currentCredit?.comments}</td>
              </tr>
            </tbody>
          </table>

          {currentCredit && (
            <form className="d-flex align-items-end my-3" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <CustomInput
                  label
                  type="date"
                  id="expire_at_field"
                  placeholder="Actualizar Vencimiento"
                  handler={register('expire_at')}
                  defeaultValue={flow(get('expire_at'), split('T'), head)(currentCredit)}
                  icon={<MdCalendarMonth size={24} />}
                />
              </div>
              <Button className="py-2 ms-3" type="submit">
                {updating ? <Loader /> : 'Actualizar'}
              </Button>
            </form>
          )}
        </Modal.Body>
      </Modal>

      <CommonHeader
        title="Estado"
        link="/gestionar-creditos"
        btnTex="Gestionar créditos"
        icon={<FaCreditCard size={24} className="ms-2" />}
      />

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
      <Link to={`/editar-credito/${id}`}>
        <Button variant="outline-primary" className="fs-6 mb-2 mb-lg-5">
          Editar límite de crédito
        </Button>
      </Link>

      <DataGrid
        key={`credits_${idx}`}
        search={false}
        url="/credits"
        queryParams={`?client_id=${id}&state=activo`}
        columns={[
          {
            id: 'order',
            name: '# Factura',
            formatter: order => get('bill_number', order),
          },
          {
            id: 'created_at',
            name: 'Fecha de compra',
            formatter: date => formatDate(date as string),
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
            hidden: !canEdit,
            data: row =>
              _(
                <Button
                  onClick={() => {
                    setCurrentCredit(row as unknown as Credit)
                    setShowModal(true)
                  }}
                  size="sm"
                >
                  Editar vencimiento
                </Button>
              ),
          },
        ]}
      />
    </>
  )
}
