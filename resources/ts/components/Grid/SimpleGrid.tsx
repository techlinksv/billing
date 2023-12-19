import React, { useEffect, useRef, useState } from 'react'
import isEqual from 'lodash/fp/isEqual'
import { Grid } from 'gridjs'
import { esES } from 'gridjs/l10n'
import { TColumn, TData } from 'gridjs/dist/src/types'

export const SimpleGrid: React.FC<{
  data: TData
  columns: TColumn[] | string[]
  customKey?: string
  limit?: number
  search?: boolean
  sort?: boolean
}> = ({ data, columns, customKey, limit, search = false, sort = false }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [grid, setGrid] = useState<Grid>()
  const [prev, setPrev] = useState<TData>()

  useEffect(() => {
    if (!grid && ref.current && ref.current?.childElementCount === 0) {
      setGrid(
        new Grid({
          language: esES,
          search,
          sort,
          pagination: limit ? { limit } : false,
          columns,
          data,
        }).render(ref.current as HTMLElement)
      )

      setPrev(data)
    }
  }, [data, grid, columns, customKey, limit, search, sort])

  useEffect(() => {
    // update grid
    if (!isEqual(prev, data) && grid) {
      grid.updateConfig({ data }).forceRender()
    }
  }, [prev, data, grid])

  return <div ref={ref} />
}
