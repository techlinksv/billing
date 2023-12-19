import React, { useState, useEffect } from 'react'
import map from 'lodash/fp/map'
import Button from 'react-bootstrap/Button'
import { Link } from 'react-router-dom'
import SelectSearch, { SelectSearchOption } from 'react-select-search'

import { ClientList } from '../../../types'
import { Loader } from '../../../components'
import { useGetClientsQuery, useLazyGetClientQuery } from '../../../features/API'

import { ClientDebtBody } from './ClientDebtBody'

export const ClientDebt: React.FC = () => {
  const [clients, setClients] = useState<SelectSearchOption[]>()
  const [currentClient, setCurrentClient] = useState<ID>()
  const { data = [] } = useGetClientsQuery()
  const [getClient, { data: client, isLoading }] = useLazyGetClientQuery()

  useEffect(() => {
    if (data.length > 0) {
      setClients(map((el: ClientList) => ({ name: el.company, value: el.id }), data))
    }
  }, [data])

  const handleReport = (ev: React.MouseEvent) => {
    ev.preventDefault()
    if (!currentClient) return

    getClient(currentClient)
  }

  return (
    <>
      <p className="fs-4 pt-2 mb-1 d-inline-block">Cuestas por cobrar</p>
      <Link to="/reportes">
        <Button size="sm" className="ms-3 mb-1">
          Reportes
        </Button>
      </Link>

      {clients && (
        <div className="d-flex flex-wrap my-4">
          <SelectSearch
            options={clients}
            placeholder="Buscar cliente"
            search
            onChange={el => setCurrentClient(el as number)}
          />
          <Button
            onClick={handleReport}
            className="ms-0 ms-md-3 mt-2 mt-md-0"
            disabled={!currentClient}
          >
            Ver reporte
          </Button>
        </div>
      )}

      {isLoading && <Loader />}
      {client && <ClientDebtBody client={client.data} />}
    </>
  )
}
