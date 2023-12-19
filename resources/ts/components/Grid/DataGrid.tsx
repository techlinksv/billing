import React, { useEffect, useRef, useState } from 'react'
import { Grid } from 'gridjs'
import { esES } from 'gridjs/l10n'
import { TColumn } from 'gridjs/dist/src/types'

import { getServerUrl, getTokenHeader } from '../../features/utils'

const urlAux = (url: string) => (url.includes('?') ? '&' : '?')

export const DataGrid: React.FC<{
  url: string
  columns: TColumn[] | string[]
  queryParams?: string
  search?: boolean
  perPage?: number
}> = ({ url, columns, queryParams = '', search, perPage = 10 }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [grid, setGrid] = useState<Grid>()

  useEffect(() => {
    if (!grid && ref.current && ref.current?.childElementCount === 0) {
      setGrid(
        new Grid({
          language: esES,
          search: search ?? {
            server: {
              url: (prev, keyword) => `${prev}${urlAux(prev)}search=${keyword}`,
            },
            debounceTimeout: 1000,
          },
          pagination: {
            limit: perPage,
            server: {
              url: (prev, page, limit) =>
                `${prev}${urlAux(prev)}page=${page + 1}&per_page=${limit}`,
            },
          },
          columns,
          server: {
            url: `${getServerUrl()}${url}${queryParams}`,
            then: data => data.data.map(row => row),
            total: data => data.meta.total,
            headers: {
              Authorization: getTokenHeader(),
            },
          },
        }).render(ref.current)
      )
    }
  }, [columns, url, grid, queryParams, search, perPage])

  return <div ref={ref} />
}
