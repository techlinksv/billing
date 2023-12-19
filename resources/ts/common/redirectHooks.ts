import isEmpty from 'lodash/fp/isEmpty'
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import { useAppSelector } from '../hooks'

export const useMoveToTop = (top = 0): void => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({
      top,
    }) // Scroll to top
  }, [top, pathname])
}

export const useRedirectIfLogged = (url = '/') => {
  const navigate = useNavigate()
  const user = useAppSelector(state => state.currentUser.data)

  useEffect(() => {
    if (!isEmpty(user)) {
      navigate(url)
    }
  }, [navigate, user, url])
}

export const useCheckIfLogged = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const token = useAppSelector(state => state.currentUser.token)

  useEffect(() => {
    if (pathname !== '/' && isEmpty(token)) {
      navigate('/')
    }
  }, [navigate, token, pathname])
}
