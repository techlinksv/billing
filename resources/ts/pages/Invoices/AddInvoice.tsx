import React, { useState, useEffect } from 'react'
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
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { useForm, FieldValues } from 'react-hook-form'
import SelectSearch, { SelectSearchOption } from 'react-select-search'
import { FaFileInvoice, FaMoneyBill, FaShoppingCart } from 'react-icons/fa'

import { secondary } from '../../styles/theme'
import { useGetProductsQuery } from '../../features/API'
import { Product, IShoppingListItem } from '../../types'
import { CommonHeader, CustomInput, Loader } from '../../components'
import { useAppSelector } from '../../hooks'
import { useCheckPermission, saveTemp, getTemp } from '../../common'

import { ShoppingList } from './ShoppingList'

const listName = 'temp_shopping_list'
export const AddInvoice: React.FC = () => {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const { warehouse } = useAppSelector(state => state.system)
  const [products, setProducts] = useState<SelectSearchOption[]>()
  const [shoppingList, setShoppingList] = useState<IShoppingListItem[]>(getTemp(listName))
  const [currentProduct, setCurrentProduct] = useState<number>()
  const [currentWarehouse, setCurrentWarehouse] = useState<number>(warehouse.id)
  const { data, isLoading, refetch } = useGetProductsQuery()
  const { canDelete } = useCheckPermission()

  useEffect(() => {
    if (warehouse.id !== currentWarehouse) {
      refetch().then(() => {
        setCurrentWarehouse(warehouse.id)
        setCurrentProduct(undefined)
        setShoppingList([])
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
          disabled: el.quantity <= 0,
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
      sku: product.sku,
    } as IShoppingListItem

    const existing = findIndex({ product_id: product.id }, shoppingList)
    if (existing >= 0) {
      const newList = set(`[${existing}]`, item, shoppingList)
      setShoppingList(newList)
      saveTemp(newList, listName)
    } else {
      setShoppingList(prev => {
        const newList = [...prev, item]
        saveTemp(newList, listName)
        return newList
      })
    }
    reset()
  }

  const deleteItem = (id: ID) => {
    const newList = remove({ product_id: id }, shoppingList)
    saveTemp(newList, listName)
    setShoppingList(newList)
  }

  const candDelete = canDelete('ManageInvoices')
  if (isLoading) return <Loader />
  return (
    <>
      <CommonHeader
        title="Registrar compra"
        link="/anular-factura"
        btnTex="Anular Factura"
        icon={<FaFileInvoice size={24} className="ms-2" />}
        hideCTA={!candDelete}
      />
      {products ? (
        <SelectSearch
          options={products}
          placeholder="Buscar por código de producto"
          search
          onChange={el => setCurrentProduct(el as number)}
        />
      ) : (
        <p className="text-center">
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
                  icon={<FaMoneyBill size={24} />}
                  type="number"
                  placeholder="Precio"
                  handler={register('price')}
                  className="mw-49 fs-6"
                />
                <CustomInput
                  icon={<FaShoppingCart size={24} />}
                  type="number"
                  placeholder="Cantidad"
                  handler={register('quantity', { max: product.quantity })}
                  className="mw-49 fs-6"
                />
                <Button className="w-100 mt-3" type="submit">
                  Agregar producto
                </Button>
              </form>
            </div>
          )}
        </Col>
        <Col xs={12} lg={6}>
          <ShoppingList
            shoppingList={shoppingList}
            deleteItem={deleteItem}
            setShoppingList={setShoppingList}
            setCurrentProduct={setCurrentProduct}
          />
        </Col>
      </Row>
    </>
  )
}
