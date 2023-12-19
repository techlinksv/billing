import React, { useState, useEffect } from 'react'
import map from 'lodash/fp/map'
import get from 'lodash/fp/get'
import flow from 'lodash/fp/flow'
import filter from 'lodash/fp/filter'
import { GiExpense } from 'react-icons/gi'
import { FaMoneyBill } from 'react-icons/fa'
import { MdCalendarMonth } from 'react-icons/md'
import { BsFillChatRightTextFill, BsCashStack } from 'react-icons/bs'
import { useForm, FieldValues } from 'react-hook-form'
import Button from 'react-bootstrap/Button'
import FormCheck from 'react-bootstrap/FormCheck'
import SelectSearch, { SelectSearchOption } from 'react-select-search'

import { getCurrentDate, simpleAlert } from '../../common'
import { CommonHeader, CustomInput, Loader } from '../../components'
import { useCreateTransactionMutation, useGetCategoriesQuery } from '../../features/API'
import {
  CategoryPaymentType,
  CategoryType,
  ICreateTransaction,
  TransactionCategory,
} from '../../types'
import { useAppSelector } from '../../hooks'

export const Transactions: React.FC<{ type: CategoryType }> = ({ type }) => {
  const { warehouse } = useAppSelector(state => state.system)
  const { data } = useGetCategoriesQuery()
  const { register, handleSubmit, reset } = useForm()
  const [categories, setCategories] = useState<SelectSearchOption[]>()
  const [currentCategory, setCurrentCategory] = useState<number>()
  const [paymentType, setPaymentType] = useState<CategoryPaymentType>()
  const [createTransaction, { isLoading }] = useCreateTransactionMutation()
  const [customMsg, setCustomMsg] = useState<string>()
  const transactionDate = getCurrentDate()
  const viewType = type === 'ingreso' ? 'Ingreso' : 'Gasto'

  useEffect(() => {
    if (!categories && data) {
      setCategories(
        flow(
          filter({ type }),
          map((el: TransactionCategory) => ({
            name: el.category,
            value: el.id,
          }))
        )(data)
      )
    }
  }, [categories, data, type])

  const onSubmit = (formData: FieldValues) => {
    if (!currentCategory) {
      setCustomMsg('Selecciona una categoría')
      return
    }
    if (isLoading) return

    const variables = {
      ...formData,
      category_id: currentCategory,
      country_id: warehouse.country_id,
      method: paymentType,
      type,
    }

    createTransaction(variables as ICreateTransaction).then(resp => {
      if (get('data.data.id', resp)) {
        simpleAlert({ html: `${viewType} registrado exitosamente` })
        reset()
      } else {
        simpleAlert({ html: `Error al registrar ${viewType}`, icon: 'error' })
      }
    })
  }

  return (
    <>
      <CommonHeader
        title={`Registrar un ${viewType}`}
        link={type === 'ingreso' ? '/ver-ingresos' : '/ver-gastos'}
        btnTex={type === 'ingreso' ? 'Ver ingresos' : 'Ver gastos'}
        icon={
          type === 'ingreso' ? (
            <BsCashStack size={24} className="ms-1" />
          ) : (
            <GiExpense size={24} className="ms-1" />
          )
        }
      />
      <form onSubmit={handleSubmit(onSubmit)} className="mw-500 fs-6">
        <CustomInput
          label
          type="date"
          id="transaction_date"
          placeholder="Fecha"
          defeaultValue={transactionDate}
          className="mb-3"
          handler={register('date')}
          icon={<MdCalendarMonth size={24} />}
        />
        <CustomInput
          type="number"
          placeholder="Monto"
          icon={<FaMoneyBill size={24} />}
          handler={register('amount')}
          className="mb-3"
        />
        <CustomInput
          type="text"
          placeholder="Descripción"
          icon={<BsFillChatRightTextFill size={24} />}
          handler={register('reason')}
          className="mb-3"
        />
        {customMsg && <p className="text-danger mb-1 fs-12">{customMsg}</p>}
        <SelectSearch
          options={categories || []}
          placeholder="Categoría"
          search
          onChange={el => setCurrentCategory(el as number)}
        />
        <p className="fs-6 mb-1 mt-3">Forma de pago</p>
        <div className="d-flex fs-6">
          <FormCheck type="radio" id="transaction-payment-credit" className="me-4">
            <FormCheck.Input
              type="radio"
              name="payment_type_transaction"
              value="efectivo"
              onChange={el => setPaymentType(el.currentTarget.value as CategoryPaymentType)}
            />
            <FormCheck.Label>Efectivo</FormCheck.Label>
          </FormCheck>
          <FormCheck type="radio" id="transaction-payment-cash">
            <FormCheck.Input
              type="radio"
              name="payment_type_transaction"
              value="cheque"
              onChange={el => setPaymentType(el.currentTarget.value as CategoryPaymentType)}
            />
            <FormCheck.Label>Cheque</FormCheck.Label>
          </FormCheck>
        </div>
        {paymentType === 'cheque' && (
          <>
            <CustomInput
              type="text"
              placeholder="# Cheque"
              icon={<BsFillChatRightTextFill size={24} />}
              handler={register('check_number')}
              className="mt-3"
            />
            <CustomInput
              type="text"
              placeholder="Banco"
              icon={<BsFillChatRightTextFill size={24} />}
              handler={register('bank')}
              className="mt-3"
            />
          </>
        )}

        {paymentType && (
          <Button type="submit" className="mt-3 fs-5 mw-100 px-5">
            {isLoading ? <Loader color="white" /> : 'Registrar'}
          </Button>
        )}
      </form>
    </>
  )
}
