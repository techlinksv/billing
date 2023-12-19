import React, { useState } from 'react'
import set from 'lodash/fp/set'
import get from 'lodash/fp/get'
import flow from 'lodash/fp/flow'
import isArray from 'lodash/fp/isArray'
import toNumber from 'lodash/fp/toNumber'
import snakeCase from 'lodash/fp/snakeCase'
import findIndex from 'lodash/fp/findIndex'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import Modal from 'react-bootstrap/Modal'

import { IListToLoadItem } from '../../../types'
import { Loader } from '../../../components'
import { saveTemp, simpleAlert } from '../../../common'
import { useCreateMovementsMutation, useGetWarehouseQuery } from '../../../features/API'
import { useAppSelector } from '../../../hooks'

export const ListToLoad: React.FC<{
  listToLoad: IListToLoadItem[]
  deleteItem: (id: ID) => void
  setListToLoad: React.Dispatch<React.SetStateAction<IListToLoadItem[]>>
}> = ({ listToLoad = [], deleteItem, setListToLoad }) => {
  const warehouse = useAppSelector(state => state.system.warehouse)
  const [create, { isLoading }] = useCreateMovementsMutation()
  const { data: warehouseData, refetch } = useGetWarehouseQuery(warehouse.id)
  const [showModal, setShowModal] = useState(false)
  if (listToLoad.length <= 0) return <div />

  const handleSubmit = (ev: React.MouseEvent) => {
    ev.preventDefault()
    create({
      warehouse_id: warehouse.id,
      list: listToLoad.map(el => ({
        ...el,
        type: 'entrada',
      })),
    })
      .then(resp => {
        const isArr = flow(get('data.data'), isArray)(resp)
        if (isArr) {
          simpleAlert({ html: 'Productos agregados exitosamente', icon: 'success' })
          setListToLoad([])
          setShowModal(false)
          sessionStorage.removeItem('temp_list_to_load')
          refetch()
        } else {
          simpleAlert({ html: 'No fue posible agregar productos', icon: 'error' })
        }
      })
      .catch(() => {
        simpleAlert({ html: `Error al ingresar productos`, icon: 'error' })
      })
  }

  const updateList = (productId: ID, value: number | string, type: string) => {
    const existing = findIndex({ product_id: productId }, listToLoad)
    const item = { ...listToLoad[existing], [type]: value }
    if (existing >= 0) {
      const newList = set(`[${existing}]`, item, listToLoad)
      setListToLoad(newList)
      saveTemp(newList, 'temp_list_to_load')
    }
  }

  let debounce: NodeJS.Timeout
  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(debounce)
    debounce = setTimeout(() => {
      const input = ev.target
      const id = toNumber(input.getAttribute('data-id'))
      const value = input.type === 'number' ? toNumber(input.value) : input.value
      const type = input.type === 'number' ? 'quantity' : 'comments'
      updateList(id, value, type)
    }, 800)
  }
  return (
    <div>
      <div className="mb-2 d-flex justify-content-between align-items-center">
        <span className="fw-semibold fs-5">
          Factura de Carga #{warehouseData?.data?.movements_counter}
        </span>
        <Button size="sm" onClick={() => setListToLoad([])}>
          Limpiar
        </Button>
      </div>
      <Table responsive bordered className="list-to-load-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Cantidad</th>
            <th>Comentario</th>
            <th style={{ width: '100px' }}>{/** actions */}</th>
          </tr>
        </thead>
        <tbody>
          {listToLoad.map(el => (
            <tr key={`list-to-load-${el.product_id}-${el.quantity}-${snakeCase(el.comments)}`}>
              <td>{el.sku}</td>
              <td className="py-0">
                <input
                  data-id={el.product_id}
                  type="number"
                  step={0.01}
                  defaultValue={el.quantity}
                  onChange={onChange}
                />
              </td>
              <td className="py-0">
                <input
                  data-id={el.product_id}
                  type="text"
                  defaultValue={el.comments}
                  onChange={onChange}
                />
              </td>
              <td className="text-center">
                <Button size="sm" onClick={() => deleteItem(el.product_id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button
        className="mt-3 fs-5 d-block"
        onClick={() => setShowModal(true)}
        style={{ width: '250px' }}
      >
        Agregar
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header className="fs-5">
          Factura de Carga #{warehouseData?.data?.movements_counter}
        </Modal.Header>
        <Modal.Body>
          <p className="fs-6 mb-2 text-primary fw-semibold">Confirmación de carga</p>
          <Table responsive bordered className="fs-6">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Comentario</th>
              </tr>
            </thead>
            <tbody>
              {listToLoad.map(el => (
                <tr key={`modal-list-to-load-${el.product_id}`}>
                  <td>{el.sku}</td>
                  <td>{el.product_name}</td>
                  <td>{el.quantity}</td>
                  <td>{el.comments}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="w-100 d-flex justify-content-between align-items-center">
            <Button className="fs-6 px-5" onClick={() => setShowModal(false)} variant="secondary">
              Cancelar
            </Button>
            <Button className="fs-6 px-5" onClick={handleSubmit}>
              {isLoading ? <Loader color="white" /> : 'Agregar'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
