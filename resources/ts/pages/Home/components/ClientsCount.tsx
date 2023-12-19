import React, { useEffect } from 'react'
import isNil from 'lodash/fp/isNil'

import { Loader } from '../../../components'
import { useLazyGetClientsCountQuery } from '../../../features/API'
import { useAppSelector } from '../../../hooks'

export const ClientsCount: React.FC = () => {
  const { warehouse } = useAppSelector(state => state.system)
  const [count, { data, isLoading }] = useLazyGetClientsCountQuery()

  useEffect(() => {
    if (warehouse?.country_id) {
      count(warehouse.country_id)
    }
  }, [warehouse?.country_id, count])

  if (isLoading) {
    return (
      <div className="mt-4">
        <Loader />
      </div>
    )
  }
  if (!warehouse?.country_id || isNil(data)) return <div className="d-none" />
  return (
    <div className="w-100 text-center pt-2 mb-3 mb-md-0">
      <p className="fs-6 fw-semibold mb-1" style={{ color: '#d21e0f' }}>
        Clientes registrados
      </p>
      <span className="fs-4" style={{ color: '#757575' }}>
        {data}
      </span>
    </div>
  )
}
