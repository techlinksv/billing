import React from 'react'
import get from 'lodash/fp/get'
import { useRouteError, Link } from 'react-router-dom'

import { Error404, GeneralError } from './style'

export const Error: React.FC = () => {
  const error = useRouteError()

  return (
    <div>
      {get('status', error) === 404 ? (
        <Error404>
          <h1 className="w-100 fw-semibold display-1 text-primary">
            404 <span className="bg-primary" /> Not Found
          </h1>
          <p className="w-100 fs-5 my-5">
            Parece que no pudimos encontrar la página estás buscando.
          </p>
          <Link to="/inicio" className="btn btn-primary fs-5 text-white px-4">
            Volver al inicio
          </Link>
        </Error404>
      ) : (
        <GeneralError>
          <h1 className="w-100 fw-semibold display-1 text-primary">
            <span className="d-block d-md-inline-block">¡oops!</span> algo salió mal
          </h1>
          <p className="w-100 fs-5 my-5">
            No pudimos completar tu petición actual, lo sentimos mucho, inténtalo nuevamente en un
            momento y si el problema persiste contacta a nuestro soporte técnico.
          </p>
          <Link to="/inicio" className="btn btn-primary fs-5 text-white px-4">
            Volver al inicio
          </Link>
        </GeneralError>
      )}
    </div>
  )
}
