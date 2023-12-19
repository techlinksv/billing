import React, { useState } from 'react'
import sum from 'lodash/fp/sum'
import map from 'lodash/fp/map'
import flow from 'lodash/fp/flow'
import multiply from 'lodash/fp/multiply'
import divide from 'lodash/fp/divide'
import toNumber from 'lodash/fp/toNumber'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import FormCheck from 'react-bootstrap/FormCheck'

import { IShoppingListItem } from '../../types'
import { DisplayAmount } from '../../components'
import { useGetClientsQuery, useGetUserQuery } from '../../features/API'
import { useAppSelector } from '../../hooks'
import { useGetMemoryCountries } from '../../common'

import { ExternalClient, InternalClient } from './components'

type ClientType = 'external' | 'internal'
export const ShoppingList: React.FC<{
  shoppingList: IShoppingListItem[]
  deleteItem: (id: ID) => void
  setShoppingList: React.Dispatch<React.SetStateAction<IShoppingListItem[]>>
  setCurrentProduct: React.Dispatch<React.SetStateAction<number | undefined>>
}> = ({ shoppingList, deleteItem, setShoppingList, setCurrentProduct }) => {
  const [, setHelper] = useState(0)
  const [hasTax, setHasTax] = useState(false)
  const [type, setType] = useState<ClientType>()
  const { data, refetch } = useGetClientsQuery()
  const {
    system: { warehouse, country },
    currentUser: { data: user },
  } = useAppSelector(state => state)
  const { getCountryData } = useGetMemoryCountries()
  const { data: userData, refetch: refetchUser } = useGetUserQuery(user?.id as ID)
  const [taxValue, setTaxValue] = useState<number | string>(multiply(100, country.tax_percentage))

  if (shoppingList.length <= 0) return <div />

  const total = flow(
    map((el: IShoppingListItem) => multiply(el.price, el.quantity)),
    sum,
    acc => {
      const ivaInput = document.querySelector<HTMLInputElement>('#checkbox-iva')
      const taxInput = document.querySelector<HTMLInputElement>('#checkbox-tax')
      const iva = ivaInput?.checked === true ? multiply(acc, toNumber(country.iva)) : 0

      const nt = acc + iva // nt = New Total
      const tax =
        taxInput?.checked === true ? flow(toNumber, n => divide(n, 100), multiply(nt))(taxValue) : 0
      return nt + tax
    }
  )(shoppingList)

  const currency = getCountryData(warehouse.country_id)?.currency
  return (
    <div>
      <div className="mb-2 d-flex justify-content-between align-items-center">
        {userData && <span className="fw-semibold fs-5">Factura #{userData.bills_counter}</span>}
        <Button size="sm" onClick={() => setShoppingList([])}>
          Limpiar
        </Button>
      </div>
      <Table responsive bordered className="shopping-list-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>{/** actions */}</th>
          </tr>
        </thead>
        <tbody>
          {shoppingList.map(el => (
            <tr key={`shopping-list-${el.product_id}`}>
              <td>{el.sku}</td>
              <td>{el.quantity}</td>
              <td>{el.price}</td>
              <td className="text-center">
                <Button size="sm" onClick={() => deleteItem(el.product_id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <p className="text-secondary fs-5 fw-semibold">
        Total de compra: <DisplayAmount value={total} currency={currency} />
      </p>

      <div>
        <FormCheck type="checkbox" id="checkbox-iva" reverse className="w-fit-content">
          <FormCheck.Input type="checkbox" onChange={() => setHelper(prev => prev + 1)} />
          <FormCheck.Label>El cliente requiere IVA?</FormCheck.Label>
        </FormCheck>
        <div className="d-flex align-items-center">
          <FormCheck type="checkbox" id="checkbox-tax" reverse className="w-fit-content mt-2 me-3">
            <FormCheck.Input
              type="checkbox"
              onChange={() => {
                setHelper(prev => prev + 1)
                setHasTax(!hasTax)
              }}
            />
            <FormCheck.Label>Cargo {country.tax ? `por ${country.tax}` : 'extra'}?</FormCheck.Label>
          </FormCheck>
          {hasTax && (
            <>
              <span>%</span>
              <input
                className="border ms-1"
                style={{ width: '50px' }}
                type="number"
                max={100}
                min={1}
                step={0.01}
                onChange={ev => {
                  const value = toNumber(ev.currentTarget.value)
                  if (value <= 0) {
                    setTaxValue('')
                  } else if (value <= 100) {
                    setTaxValue(value)
                  }
                }}
                value={taxValue}
              />
            </>
          )}
        </div>

        <p className="fs-5 mt-3 mb-2">A quien vendera el producto?</p>
        <div className="d-flex fs-6">
          <FormCheck type="radio" id="type-client" className="me-4">
            <FormCheck.Input
              type="radio"
              name="client_type"
              value="internal"
              onChange={el => {
                setCurrentProduct(undefined)
                setType(el.currentTarget.value as ClientType)
              }}
            />
            <FormCheck.Label>Cliente</FormCheck.Label>
          </FormCheck>
          <FormCheck type="radio" id="type-external">
            <FormCheck.Input
              type="radio"
              name="client_type"
              value="external"
              onChange={el => {
                setCurrentProduct(undefined)
                setType(el.currentTarget.value as ClientType)
              }}
            />
            <FormCheck.Label>Particular</FormCheck.Label>
          </FormCheck>
        </div>

        {type === 'internal' && (
          <InternalClient
            shoppingList={shoppingList}
            clients={data}
            total={total}
            setShoppingList={setShoppingList}
            refetchClients={() => refetch()}
            refetchUser={() => refetchUser()}
            taxValue={toNumber(taxValue)}
          />
        )}
        {type === 'external' && (
          <ExternalClient
            shoppingList={shoppingList}
            setShoppingList={setShoppingList}
            refetchUser={() => refetchUser()}
            taxValue={toNumber(taxValue)}
          />
        )}
      </div>
    </div>
  )
}
