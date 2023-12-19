import React from 'react'
import Container from 'react-bootstrap/Container'
import { Outlet } from 'react-router-dom'

import { useCheckIfLogged } from '../../common'

import Header from './Header'

export const Layout: React.FC = () => {
  useCheckIfLogged()

  return (
    <>
      <Header />
      <Container fluid="xl">
        <Outlet />
      </Container>
    </>
  )
}
