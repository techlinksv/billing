import React, { useEffect, useMemo } from 'react'
import truncate from 'lodash/fp/truncate'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

import { useGetWarehousesQuery } from '../../../features/API'
import { Loader } from '../../SmallComponents'
import { useAppDispatch, useAppSelector } from '../../../hooks'
import { Warehouse } from '../../../types'
import { setCurrentWarehouse } from '../../../features/systemSlice'

export const ChangeWarehouse: React.FC = () => {
  const dispatch = useAppDispatch()
  const currentWarehouse = useAppSelector(state => state.system.warehouse)
  const { data, isLoading } = useGetWarehousesQuery()

  const warehouses = useMemo(() => data?.data ?? [], [data?.data])

  useEffect(() => {
    if (!currentWarehouse.id && warehouses.length > 0) {
      dispatch(setCurrentWarehouse(warehouses[0]))
    }
  }, [currentWarehouse.id, dispatch, warehouses])

  if (isLoading) return <Loader color="white" />
  if (warehouses.length <= 0) return <>Sin Bodegas</>

  const handleChange = (warehouse: Warehouse) => {
    dispatch(setCurrentWarehouse(warehouse))
  }

  if (warehouses.length === 1) {
    return (
      <span className="text-white pe-1">
        {window.innerWidth <= 600
          ? truncate(
              {
                length: 18,
                separator: '...',
              },
              warehouses[0].name
            )
          : warehouses[0].name}
      </span>
    )
  }
  return (
    <Dropdown as={ButtonGroup} align="start" id="warehouses-dropdown" title="Cambiar bodega">
      <Dropdown.Toggle>
        <span className="text-white pe-1">
          {window.innerWidth <= 600
            ? truncate(
                {
                  length: 18,
                  separator: '...',
                },
                currentWarehouse.name
              )
            : currentWarehouse.name}
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {warehouses.map((el: Warehouse) => (
          <Dropdown.Item
            key={`warehouse-${el.id}`}
            as={Button}
            onClick={() => handleChange(el)}
            className="py-2"
          >
            {el.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  )
}
