import React, { useState, useEffect } from 'react'
import map from 'lodash/fp/map'
import get from 'lodash/fp/get'
import find from 'lodash/fp/find'
import getOr from 'lodash/fp/getOr'
import subtract from 'lodash/fp/subtract'
import toNumber from 'lodash/fp/toNumber'
import Button from 'react-bootstrap/Button'
import FormCheck from 'react-bootstrap/FormCheck'
import SelectSearch, { SelectSearchOption } from 'react-select-search'
import { MdCalendarMonth } from 'react-icons/md'

import { useAppSelector } from '../../../hooks'
import { CustomInput, DisplayAmount, Loader, RenderErrors } from '../../../components'
import { useCreateOrderMutation, useGetProductsQuery } from '../../../features/API'
import { PaymentType, IShoppingListItem, ICreateOrder, ClientList } from '../../../types'
import {
  defaultExpireDate,
  daysUntilExpiration,
  simpleAlert,
  useGetMemoryCountries,
  formatDate,
  useCheckPermission,
} from '../../../common'
import { PaymentsGrid } from '../../Payments/components'

const validationMsg = ({
  expiredInvoices,
  insufficientCredit,
  creditLimit,
  total,
  currency,
}: {
  expiredInvoices: number
  insufficientCredit: boolean
  creditLimit: number
  total: number
  currency?: string
}) => {
  if (expiredInvoices > 0) {
    return (
      <p className="text-danger fs-6 mb-2">
        Este cliente tiene {expiredInvoices} deudas pendientes
      </p>
    )
  }
  if (creditLimit <= 0) {
    return <p className="text-danger fs-6 mb-2">Este cliente no posee Crédito</p>
  }

  return (
    <>
      {insufficientCredit && (
        <p className="text-danger fs-6 mb-2">Crédito insuficiente para completar</p>
      )}
      <table>
        <tbody>
          <tr>
            <td>Crédito disponible: </td>
            <td className="fw-semibold ps-3">
              <DisplayAmount currency={currency} value={creditLimit} />
            </td>
          </tr>
          <tr>
            <td>Total a pagar: </td>
            <td className="fw-semibold ps-3">
              <DisplayAmount currency={currency} value={total} />
            </td>
          </tr>
          <tr>
            <td>Crédito restante: </td>
            <td className="fw-semibold ps-3">
              <DisplayAmount currency={currency} value={subtract(creditLimit, total)} />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export const InternalClient: React.FC<{
  refetchClients: () => void
  refetchUser: () => void
  clients?: ClientList[]
  total: number
  shoppingList: IShoppingListItem[]
  setShoppingList: React.Dispatch<React.SetStateAction<IShoppingListItem[]>>
  taxValue: number
}> = ({
  clients = [],
  total,
  shoppingList = [],
  setShoppingList,
  refetchClients,
  refetchUser,
  taxValue,
}) => {
  const warehouse = useAppSelector(state => state.system.warehouse)
  const [options, setOptions] = useState<SelectSearchOption[]>([])
  const [currentClient, setCurrentClient] = useState<number>()
  const [type, setType] = useState<PaymentType>()
  const [creditDate, setCreditDate] = useState<string>(() => defaultExpireDate())
  const [createOrder, { isLoading, error }] = useCreateOrderMutation()
  const { getCountryData } = useGetMemoryCountries()
  const { refetch } = useGetProductsQuery()
  const [showGrid, setShowGrid] = useState(false)
  const { getRole } = useCheckPermission()

  useEffect(() => {
    if (clients.length > 0) {
      setOptions(
        map(
          (el: ClientList) => ({
            name: el.company,
            value: el.id,
          }),
          clients
        )
      )
    } else {
      setOptions([{ name: 'No hay clientes para mostrar', value: 0, disabled: true }])
    }
  }, [clients])

  const client = find({ id: currentClient }, clients)
  const creditLimit = toNumber(client?.available_credit)
  const insufficientCredit = total > creditLimit
  const expiredInvoices = client?.due_credits || 0
  const isInvalid = type === 'credito' && (insufficientCredit || expiredInvoices > 0)

  const handleSubmit = (ev: React.MouseEvent) => {
    ev.preventDefault()
    if (isLoading) return
    if (isInvalid || !client || !type) return

    const iva = document.querySelector<HTMLInputElement>('#checkbox-iva')
    const tax = document.querySelector<HTMLInputElement>('#checkbox-tax')
    const params: ICreateOrder = {
      client_company: client.company,
      client_first_name: client.first_name,
      client_last_name: client.last_name,
      client_document_1: client.document_1,
      client_document_2: client.document_2,
      payment_type: type,
      credit_date: creditDate,
      client_id: client.id,
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
        refetchClients()
      }
    })
  }

  const role = getRole()
  const diffCountry = client?.country_id !== warehouse.country_id
  return (
    <div className="my-4">
      <SelectSearch
        options={options}
        placeholder="Buscar Local"
        search
        onChange={el => setCurrentClient(el as number)}
      />

      <div className={client ? 'mt-3 fs-6' : 'd-none'}>
        <table className="mb-3">
          <tbody>
            {client && diffCountry && (
              <>
                <tr>
                  <td colSpan={2} className="text-danger">
                    Este cliente es de un país distinto a la Bodega
                  </td>
                </tr>
                <tr>
                  <td>Pais de cliente:</td>
                  <td>{getCountryData(client?.country_id)?.country}</td>
                </tr>
                <tr>
                  <td className="pb-3">Pais de Bodega:</td>
                  <td className="pb-3">{getCountryData(warehouse.country_id)?.country}</td>
                </tr>
              </>
            )}
            <tr>
              <td>Local:</td>
              <td className="fw-semibold ps-3">{client?.company}</td>
            </tr>
            <tr>
              <td>Cliente:</td>
              <td className="fw-semibold ps-3">
                {client?.first_name} {client?.last_name}
              </td>
            </tr>
            {getOr([], 'active_credits', client).length > 0 && (
              <tr>
                <td>Abono rápido:</td>
                <td className="fw-semibold ps-3">
                  <Button size="sm" className="py-0" onClick={() => setShowGrid(!showGrid)}>
                    {showGrid ? 'Cancelar' : 'Abonar'}
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {client && showGrid && <PaymentsGrid client={client} refetch={() => refetchClients()} />}

        <p className="fs-6">Selecciona la forma de pago</p>
        <div className="d-flex fs-6">
          <FormCheck type="radio" id="payment-credit" className="me-4">
            <FormCheck.Input
              type="radio"
              name="payment_type"
              value="efectivo"
              onChange={el => setType(el.currentTarget.value as PaymentType)}
            />
            <FormCheck.Label>Efectivo</FormCheck.Label>
          </FormCheck>
          <FormCheck type="radio" id="payment-cash">
            <FormCheck.Input
              type="radio"
              name="payment_type"
              value="credito"
              onChange={el => setType(el.currentTarget.value as PaymentType)}
            />
            <FormCheck.Label>Crédito</FormCheck.Label>
          </FormCheck>
        </div>

        <div className={type === 'credito' ? 'my-3' : 'd-none'}>
          {validationMsg({
            total,
            insufficientCredit,
            creditLimit,
            expiredInvoices,
            currency: getCountryData(warehouse.country_id)?.currency,
          })}

          {role === 'vendedor' ? (
            <p className="mt-3">
              Fecha límite de pago:
              <span className="d-block fw-semibold">
                {formatDate(creditDate, 'dddd D [de] MMMM [del] YYYY')}
              </span>
            </p>
          ) : (
            <div className={isInvalid ? 'd-none' : 'fs-6 mt-3'}>
              <CustomInput
                label
                type="date"
                id="credit_date"
                change={{
                  onChange: ev => setCreditDate(ev.currentTarget.value),
                }}
                placeholder="Fecha límite de pago"
                defeaultValue={creditDate}
                icon={<MdCalendarMonth size={24} />}
              />
              <span className="fs-12">Expira en {daysUntilExpiration(creditDate)} días</span>
            </div>
          )}
        </div>

        <RenderErrors error={error} />
        {type && (
          <Button
            onClick={handleSubmit}
            disabled={isInvalid || diffCountry}
            className="mt-3 fs-5 w-50"
          >
            {isLoading ? <Loader color="white" /> : 'Registrar'}
          </Button>
        )}
      </div>
    </div>
  )
}
