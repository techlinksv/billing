import React from 'react'
import Button from 'react-bootstrap/Button'
import { Link, useParams } from 'react-router-dom'

import { Loader } from '../../../components'
import { useGetClientQuery } from '../../../features/API'

import { ClientDebtBody } from './ClientDebtBody'

export const ClientDebtById: React.FC = () => {
  const { id = '' } = useParams()
  const { data, isLoading } = useGetClientQuery(id)

  const client = data?.data
  return (
    <>
      <div className="mb-4 pb-2 d-flex justify-content-start align-items-center">
        <p className="fs-4 m-0">
          {client?.company}
          <span className="d-block fs-6 text-primary">
            {client?.first_name} {client?.last_name}
          </span>
        </p>
        <Link to="/reporte/cuentas-por-cobrar">
          <Button size="sm" className="ms-3 ms-lg-5">
            Regresar
          </Button>
        </Link>
      </div>

      {isLoading && <Loader />}
      {!client && !isLoading && <p className="text-center">No se encontró el cliente</p>}
      {client && <ClientDebtBody client={client} />}
    </>
  )
}
