import get from 'lodash/fp/get'
import flow from 'lodash/fp/flow'
import head from 'lodash/fp/head'
import filter from 'lodash/fp/filter'

import { useAppSelector } from '../hooks'
import { Country, RoleType } from '../types'

export const useGetMemoryCountries = () => {
  const { countries } = useAppSelector(state => state.system)
  const getCountryData = (id?: ID) => flow(filter({ id }), head)(countries) as Country

  return { getCountryData }
}

export const useCheckPermission = () => {
  const role = useAppSelector(state => state.currentUser.data?.role)
  const permissions = role?.permisions

  const canView = (model: string) => flow(filter({ model }), head, get('view'))(permissions)
  const canCreate = (model: string) => flow(filter({ model }), head, get('create'))(permissions)
  const canUpdate = (model: string) => flow(filter({ model }), head, get('update'))(permissions)
  const canDelete = (model: string) => flow(filter({ model }), head, get('delete'))(permissions)
  const canBrowse = (model: string) => flow(filter({ model }), head, get('browse'))(permissions)

  const getRole = (): RoleType | 'unauthorized' => role?.role || 'unauthorized'

  return { canView, canBrowse, canCreate, canUpdate, canDelete, getRole }
}
