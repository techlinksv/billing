import React from 'react'
import get from 'lodash/fp/get'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import { useForm, FieldValues } from 'react-hook-form'
import { MdEmail } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { RiLockPasswordFill } from 'react-icons/ri'

import logo from '../assets/images/kmcapp.png'
import { AuthResponse } from '../types'
import { useAppDispatch } from '../hooks'
import { useRedirectIfLogged } from '../common'
import { userLogged } from '../features/userSlice'
import { useGetCountriesQuery, useLoginMutation } from '../features/API'
import { CustomInput, Loader } from '../components'
import { setCurrentCountry, setCountriesList } from '../features/systemSlice'

export const Login: React.FC = () => {
  useRedirectIfLogged('/inicio')

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { register, handleSubmit } = useForm()
  const [login, { isLoading, error }] = useLoginMutation()
  const { data } = useGetCountriesQuery()

  const onSubmit = (formData: FieldValues) => {
    if (isLoading) return

    const payload = {
      email: formData?.email,
      password: formData?.password,
    }
    login(payload).then(response => {
      const userData = get('data', response) as AuthResponse
      if (userData) {
        dispatch(userLogged(userData))
        dispatch(setCurrentCountry(userData.user.country))
        dispatch(setCountriesList(data?.data || []))
        navigate('/inicio')
      }
    })
  }

  return (
    <div className="w-100 vh-100 d-flex align-items-center justify-content-center">
      <Card
        style={{ maxWidth: '600px' }}
        className="w-100 border rounded overflow-hidden shadow-sm"
      >
        <img src={logo} alt="KMCA" className="w-100" />
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 px-3 px-lg-5 mb-4">
          {error && (
            <p className=" fs-12 text-center text-danger">
              {get('data.error', error) === 'Unauthorized'
                ? 'Credenciales Inválidas.'
                : 'No fue posible conectar con el servidor.'}
            </p>
          )}
          <CustomInput
            placeholder="Correo electrónico"
            icon={<MdEmail size={24} />}
            type="email"
            handler={register('email')}
            className="mb-3"
          />
          <CustomInput
            placeholder="Contraseña"
            icon={<RiLockPasswordFill size={24} />}
            type="password"
            handler={register('password')}
            className="mb-4"
          />

          <Button type="submit" className="text-white w-75 mx-auto d-block fs-4">
            {isLoading ? <Loader color="white" /> : 'Entrar'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
