import React, { useEffect, useState } from 'react'
import map from 'lodash/fp/map'
import set from 'lodash/fp/set'
import flow from 'lodash/fp/flow'
import find from 'lodash/fp/find'
import remove from 'lodash/fp/remove'
import findIndex from 'lodash/fp/findIndex'
import orderBy from 'lodash/fp/orderBy'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { useForm, FieldValues } from 'react-hook-form'
import { BsChatLeftTextFill } from 'react-icons/bs'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { MdProductionQuantityLimits } from 'react-icons/md'
import SelectSearch, { SelectSearchOption } from 'react-select-search'

import { useAppSelector } from '../../hooks'
import { useGetProductsQuery } from '../../features/API'
import { IListToLoadItem, Product } from '../../types'
import { CustomInput } from '../../components'
import { secondary } from '../../styles/theme'
import { getTemp, saveTemp } from '../../common'

import { ListToLoad } from './components'

const listName = 'temp_list_to_load'
export const LoadProducts: React.FC = () => {
  const { warehouse } = useAppSelector(state => state.system)
  const [products, setProducts] = useState<SelectSearchOption[]>()
  const { data, isLoading, refetch } = useGetProductsQuery()
  const [currentProduct, setCurrentProduct] = useState<number>()
  const [listToLoad, setListToLoad] = useState<IListToLoadItem[]>(getTemp(listName))
  const [currentWarehouse, setCurrentWarehouse] = useState<number>(warehouse.id)
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    if (warehouse.id !== currentWarehouse) {
      refetch().then(() => {
        setCurrentWarehouse(warehouse.id)
        setCurrentProduct(undefined)
        setListToLoad([])
        saveTemp([], listName)
        setProducts(undefined)
      })
    }
  }, [currentWarehouse, refetch, warehouse.id])

  useEffect(() => {
    if (!products && data) {
      const list = flow(
        map((el: Product) => ({
          name: `${el.sku} ${el.quantity <= 0 ? '- sin existencias' : ''}`,
          value: el.id,
          quantity: el.quantity,
        })),
        orderBy(
          [
            (el: Product) => {
              if (el.quantity > 0) return 2
              if (el.quantity === 0) return 1
              return 0
            },
          ],
          'desc'
        )
      )(data)
      setProducts(list as SelectSearchOption[])
    }
  }, [data, products])

  const product = find({ id: currentProduct }, data)
  const onSubmit = (formData: FieldValues) => {
    if (!product) return

    const item = {
      ...formData,
      product_id: product.id,
      product_name: product.name,
      sku: product.sku,
    } as IListToLoadItem

    const existing = findIndex({ product_id: product.id }, listToLoad)
    if (existing >= 0) {
      const newList = set(`[${existing}]`, item, listToLoad)
      setListToLoad(newList)
      saveTemp(newList, listName)
    } else {
      setListToLoad(prev => {
        const newList = [...prev, item]
        saveTemp(newList, listName)
        return newList
      })
    }
    reset()
  }

  const deleteItem = (id: ID) => {
    const newList = remove({ product_id: id }, listToLoad)
    saveTemp(newList, listName)
    setListToLoad(newList)
  }

  return (
    <>
      <h2 className="fs-4 mt-3 mb-4">
        Cargar productos en:
        <span className="fw-bold ps-2">{warehouse.name}</span>
      </h2>
      {products ? (
        <SelectSearch
          options={products}
          placeholder="Buscar por código de producto"
          search
          onChange={el => setCurrentProduct(el as number)}
        />
      ) : (
        <p className="text-start pt-3">
          {isLoading ? 'Cargando lista...' : 'No hay productos para mostrar'}
        </p>
      )}
      <Row className="mt-3">
        <Col xs={12} lg={6}>
          {product && (
            <div className="border rounded shadow-sm p-3 w-fit-content mb-3 mb-lg-0 position-relative">
              <AiOutlineCloseCircle
                color={secondary}
                className="position-absolute top-5 end-5 cursor"
                size={20}
                onClick={() => setCurrentProduct(undefined)}
              />
              <p className="text-primary mb-2 fs-5">Información del producto</p>
              <span className="d-block mb-1 fs-5">Código: {product.sku}</span>
              <span className="d-block mb-1 fs-5">Nombre: {product.name}</span>
              <span className="d-block mb-3 fs-5">
                Cantidad disponible:
                <span className="fw-semibold ms-1">
                  {product.quantity ?? '0'} {product.units}
                </span>
              </span>

              {errors.quantity && (
                <span className="px-1 text-danger">Existencias insuficientes</span>
              )}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="d-flex justify-content-between align-items-center flex-wrap w-100 mw-500"
              >
                <CustomInput
                  icon={<MdProductionQuantityLimits size={24} />}
                  type="number"
                  placeholder="Cantidad"
                  handler={register('quantity', { min: 1 })}
                  className="mw-49 fs-6"
                />
                <CustomInput
                  icon={<BsChatLeftTextFill size={24} />}
                  type="text"
                  placeholder="Comentario"
                  handler={register('comments')}
                  className="mw-49 fs-6"
                  required={false}
                />
                <Button className="w-100 mt-3" type="submit">
                  Agregar producto
                </Button>
              </form>
            </div>
          )}
        </Col>
        <Col xs={12} lg={6}>
          <ListToLoad
            listToLoad={listToLoad}
            deleteItem={deleteItem}
            setListToLoad={setListToLoad}
          />
        </Col>
      </Row>
    </>
  )
}
