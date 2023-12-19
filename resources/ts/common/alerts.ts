import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2'

import { primary, secondary } from '../styles/theme'

interface SweetAlertProps {
  title?: string
  html?: string
  icon?: SweetAlertIcon
  confirmButtonText?: string
  cancelButtonText?: string
}

export const simpleAlert = ({ icon = 'success', html, title }: SweetAlertProps) =>
  Swal.fire({
    icon,
    html,
    title,
    confirmButtonColor: primary,
  })

export const simpleAlertWithPromise = ({
  title = '',
  html = '',
  icon = 'question',
  confirmButtonText = 'Sí',
  cancelButtonText = 'No',
}: SweetAlertProps): Promise<SweetAlertResult> =>
  Swal.fire({
    title,
    html,
    icon,
    confirmButtonColor: primary,
    cancelButtonColor: secondary,
    confirmButtonText,
    cancelButtonText,
    focusCancel: true,
  })

export const confirmAlert = ({
  title,
  html,
  icon = 'question',
  confirmButtonText = 'Sí',
  cancelButtonText = 'No',
}: SweetAlertProps): Promise<SweetAlertResult> =>
  Swal.fire({
    title,
    html,
    icon,
    showCancelButton: true,
    confirmButtonColor: primary,
    cancelButtonColor: secondary,
    confirmButtonText,
    cancelButtonText,
    focusCancel: true,
  })

export const loaderAlert = ({ title, html }: SweetAlertProps): void => {
  Swal.fire({
    title,
    html,
    didOpen: () => {
      Swal.showLoading()
    },
  })
}
