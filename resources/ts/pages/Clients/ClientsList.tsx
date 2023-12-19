import React from 'react'
import Button from 'react-bootstrap/Button'
import { _ } from 'gridjs-react'
import { MdPersonAdd } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

import { CommonHeader, DataGrid } from '../../components'
import { useCheckPermission, useGetMemoryCountries } from '../../common'
import { useAppSelector } from '../../hooks'

type ClientsListType = 'list' | 'credits'
export const ClientsList: React.FC<{ type: ClientsListType }> = ({ type }) => {
  const navigate = useNavigate()
  const { country } = useAppSelector(state => state.system)
  const { getCountryData } = useGetMemoryCountries()
  const { canUpdate, canView } = useCheckPermission()

  const canUpdateClient = canUpdate('AddClient')
  const canEditCredits = canUpdate('ManageCredits')
  const canViewCredits = canView('ManageCredits')
  return (
    <>
      {type === 'list' && (
        <CommonHeader
          title="Listado de Clientes"
          link="/agregar-cliente"
          btnTex="Agregar Cliente"
          icon={<MdPersonAdd size={24} className="ms-2" />}
        />
      )}

      {type === 'credits' && <h2 className="fs-4 my-2">Listado de clientes</h2>}

      <DataGrid
        url="/clients"
        columns={[
          {
            id: 'company',
            name: 'Local',
          },
          {
            id: 'first_name',
            name: 'Nombres',
          },
          {
            id: 'last_name',
            name: 'Apellidos',
          },
          {
            id: 'country_id',
            name: 'País',
            formatter: cid => getCountryData(cid as string)?.country,
            hidden: !!country,
          },
          {
            id: 'id',
            name: 'Acciones',
            formatter: id => {
              if (type === 'credits') {
                return _(
                  <>
                    {canEditCredits && (
                      <Button
                        onClick={() => navigate(`/editar-credito/${id}`)}
                        size="sm"
                        style={{ minWidth: '150px' }}
                        className="me-0 me-md-2 mb-3 mb-md-0"
                      >
                        Editar crédito
                      </Button>
                    )}
                    {canViewCredits && (
                      <Button
                        onClick={() => navigate(`/estado-de-credito/${id}`)}
                        size="sm"
                        style={{ minWidth: '150px' }}
                      >
                        Estado de crédito
                      </Button>
                    )}
                  </>
                )
              }

              if (!canUpdateClient) return null
              return _(
                <Button onClick={() => navigate(`/cliente/${id}`)} size="sm">
                  Editar
                </Button>
              )
            },
          },
        ]}
      />
    </>
  )
}
