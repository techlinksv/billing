import React from 'react'
import dayjs from 'dayjs'
import toNumber from 'lodash/fp/toNumber'
import es from 'dayjs/locale/es'
import { _ } from 'gridjs-react'
import { TCell } from 'gridjs/dist/src/types'

dayjs.locale(es)
const format = 'DD-MM-YYYY'
const formatForInput = 'YYYY-MM-DD'
const formatWithTime = 'DD-MM-YYYY hh:mm a'

export const getCurrentDate = () => dayjs().format(formatForInput)

export const getFirstDayOfMonth = () => dayjs().startOf('month').format(formatForInput)

export const ExpireCell = ({
  date,
  debt,
}: {
  date?: string
  debt?: number
}): React.Component | string => {
  if (!date) return ''

  if (debt && toNumber(debt) <= 0) return 'Pagado'

  const fixedDate = date.includes('T') ? date.split('T')[0] : date
  const expire = dayjs(fixedDate).startOf('day')
  const today = dayjs().startOf('day')
  return _(
    <span>
      {expire.format(format)}
      <span className="ms-2">{expire.isBefore(today) ? 'Vencida' : ''}</span>
    </span>
  )
}

export const dateWithTime = (date?: string | TCell, customFormat?: string) => {
  if (!date) return ''
  const aux = date as string // just to avoid typescript error
  const [fixedDate] = aux.split('.') // remove milliseconds
  return dayjs(fixedDate).format(customFormat || formatWithTime)
}

export const formatDate = (date?: string | TCell, customFormat?: string) => {
  if (!date) return ''
  const aux = date as string // just to avoid typescript error
  const fixedDate = aux.includes('T') ? aux.split('T')[0] : aux
  return dayjs(fixedDate)
    .startOf('day')
    .format(customFormat || format)
}

export const expireDate = (date: string) => {
  const fixedDate = date.includes('T') ? date.split('T')[0] : date
  const expire = dayjs(fixedDate).startOf('day')
  const today = dayjs().startOf('day')

  return `${dayjs(fixedDate).format(format)}${expire.isBefore(today) ? ' - Vencida' : ''}`
}

export const defaultExpireDate = () => dayjs().add(30, 'days').format('YYYY-MM-DD')

export const daysUntilExpiration = (expireAt?: string): number | undefined => {
  if (!expireAt) return
  const today = dayjs()
  const expire = dayjs(expireAt)

  // eslint-disable-next-line consistent-return
  return expire.startOf('day').diff(today.startOf('day'), 'days')
}

interface CurrencySymbol {
  [code: string]: string
}
export const getCurrencySymbol = (code = 'USD') => {
  const americanCurrencies: CurrencySymbol = {
    USD: '$',
    CAD: '$',
    MXN: '$',
    BRL: 'R$',
    ARS: '$',
    CLP: '$',
    COP: '$',
    PEN: 'S/',
    UYU: '$U',
    CUC: '$',
    CRC: '₡',
    GTQ: 'Q',
    BZD: 'BZ$',
    BOB: 'Bs.',
    VEF: 'Bs.',
    PYG: '₲',
    HNL: 'L',
    NIO: 'C$',
    HTG: 'G',
    DOP: 'RD$',
    BSD: '$',
    TTD: 'TT$',
    JMD: 'J$',
    KYD: '$',
    PAB: 'B/.',
    XCD: '$',
    AWG: 'ƒ',
    ANG: 'ƒ',
    BBD: '$',
    SRD: '$',
    BMD: '$',
    SVC: '$',
    GYD: '$',
    NPR: '₨',
    GMD: 'D',
    FJD: '$',
    TWD: 'NT$',
    SBD: '$',
    XPF: '₣',
    TOP: 'T$',
    VUV: 'Vt',
  }

  return americanCurrencies[code]
}

export const saveTemp = (list: Array<object>, name: string) => {
  sessionStorage.setItem(name, JSON.stringify(list))
}
export const getTemp = (name: string) => JSON.parse(sessionStorage.getItem(name) ?? '[]')
