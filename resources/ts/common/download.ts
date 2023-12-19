import Swal from 'sweetalert2'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { saveAs } from 'file-saver'

import { getServerUrl, getTokenHeader } from '../features/utils'

import { loaderAlert } from './alerts'

export const downloadFile = createAsyncThunk(
  'file/download',
  async ({
    endpoint,
    params = '',
    name = 'file.xlsx',
  }: {
    endpoint: string
    params?: string
    name?: string
  }) => {
    loaderAlert({ html: 'Descargando archivo...' })

    const url = `${getServerUrl()}${endpoint}${params}`
    const response = await fetch(url, {
      headers: {
        Authorization: getTokenHeader(),
      },
    })
    const blob = await response.blob()
    Swal.close()

    saveAs(blob, name)
  }
)
