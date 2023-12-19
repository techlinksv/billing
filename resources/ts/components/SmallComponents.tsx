import React, { useEffect, useState } from 'react'
import get from 'lodash/fp/get'
import snakeCase from 'lodash/fp/snakeCase'
import isNil from 'lodash/fp/isNil'
import IMask, { InputMask, AnyMaskedOptions } from 'imask/esm/imask'
import { Link } from 'react-router-dom'
import { TCell } from 'gridjs/dist/src/types'
import { NumericFormat } from 'react-number-format'
import { SerializedError } from '@reduxjs/toolkit'
import { UseFormRegisterReturn } from 'react-hook-form'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'

import '../styles/loader.css'
import { getCurrencySymbol } from '../common'

export const CustomInput: React.FC<{
  icon?: React.ReactNode
  id?: string
  placeholder?: string
  accept?: string
  className?: string
  inputClassName?: string
  type?: React.HTMLInputTypeAttribute
  handler?: UseFormRegisterReturn<string>
  disabled?: boolean
  required?: boolean
  defeaultValue?: ID
  customRef?: React.LegacyRef<HTMLInputElement>
  change?: { onChange: React.ChangeEventHandler<HTMLInputElement> }
  maskOptions?: AnyMaskedOptions
  label?: boolean
}> = ({
  icon,
  id,
  placeholder,
  className = '',
  inputClassName,
  type = 'text',
  handler,
  disabled = false,
  required = true,
  defeaultValue,
  customRef,
  change,
  maskOptions,
  accept,
  label = false,
}) => {
  const [inputMask, setInputMask] = useState<InputMask<AnyMaskedOptions>>()

  useEffect(() => {
    if (id && maskOptions && !inputMask) {
      setInputMask(IMask(document.getElementById(id) as HTMLElement, maskOptions))
    }
  }, [id, maskOptions, inputMask])

  return (
    <>
      {label && <span>{placeholder}</span>}
      <div className={`custom-input border rounded p-2 ${className}`}>
        {icon}
        <input
          id={id}
          step={type === 'number' ? 0.01 : undefined}
          ref={customRef}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...handler}
          disabled={disabled}
          type={type}
          accept={accept}
          placeholder={`${placeholder}${required ? ' *' : ''}`}
          required={required}
          className={`no-outline w-100 ${inputClassName || 'border-0 bg-lightgray'}`}
          autoComplete="on"
          defaultValue={defeaultValue}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...change}
        />
      </div>
    </>
  )
}

export const DisplayAmount: React.FC<{
  value?: number | string | TCell
  className?: string
  currency?: string
}> = ({ value, className = '', currency }) => {
  if (isNil(value)) return <span />
  return (
    <NumericFormat
      value={value as string}
      displayType="text"
      prefix={getCurrencySymbol(currency)}
      decimalScale={2}
      fixedDecimalScale
      thousandSeparator
      className={className}
    />
  )
}

export const Loader: React.FC<{ color?: string }> = React.memo(({ color = '' }) => (
  <div className={`scaling-dots ${color}`}>
    <div />
    <div />
    <div />
    <div />
    <div />
  </div>
))

export const RenderErrors: React.FC<{
  className?: string
  error: FetchBaseQueryError | SerializedError | undefined
}> = ({ error, className }) => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!error) return <></>

  const errorList: string[] = Object.values(get('data.errors', error)) || []

  return (
    <div className={className ?? 'w-100 mb-3'}>
      {errorList.map((el: string) => (
        <span className="d-block text-danger fs-12" key={`error-${snakeCase(el)}`}>
          * {el}
        </span>
      ))}
    </div>
  )
}

export const CommonHeader: React.FC<{
  link: string
  title: string
  btnTex: string
  icon: React.ReactElement
  hideCTA?: boolean
}> = ({ link, title, icon, btnTex, hideCTA = false }) => (
  <div className="d-flex justify-content-between align-items-center pb-2 pb-lg-4 pt-2 mb-3">
    <h2 className="fs-4 m-0">{title}</h2>
    {!hideCTA && (
      <Link to={link} className="btn btn-primary text-white d-inline-block w-fit-content">
        {btnTex} {icon}
      </Link>
    )}
  </div>
)
