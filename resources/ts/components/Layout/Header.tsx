import React from 'react'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import Container from 'react-bootstrap/Container'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useLocation, Link, useNavigate } from 'react-router-dom'

import logo from '../../assets/images/logo.png'
import { useAppDispatch, useAppSelector } from '../../hooks'
import { logout } from '../../features/userSlice'
import { cleanSystem } from '../../features/systemSlice'

import { ChangeWarehouse } from './components'

const Header: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(state => state.currentUser.data)
  const { pathname } = useLocation()
  if (pathname === '/') return <div className="d-none" />

  const handleLogout = (ev: React.MouseEvent) => {
    ev.preventDefault()
    dispatch(logout())
    dispatch(cleanSystem())
    navigate('/')
  }

  return (
    <header className="sticky-top mb-3 text-white">
      <Navbar bg="primary">
        <Container fluid="xl">
          <Navbar.Brand className="me-auto">
            <ChangeWarehouse />
          </Navbar.Brand>

          <Nav className="mx-auto">
            <Link to="/inicio">
              <img src={logo} alt="KMCA" className="h-auto" style={{ maxWidth: '100px' }} />
            </Link>
          </Nav>

          <Nav className="ms-auto">
            <Dropdown as={ButtonGroup} align="end" id="menu-dropdown">
              <Dropdown.Toggle>
                <GiHamburgerMenu color="white" size={32} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Header className="text-center">
                  <p className="mb-2">
                    {currentUser?.name}
                    <span className="d-block">{currentUser?.email}</span>
                  </p>
                  <span>{currentUser?.country?.country}</span>
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item as={Link} to="/inicio" className="py-2">
                  Inicio
                </Dropdown.Item>
                <Dropdown.Item as={Button} onClick={handleLogout} className="py-2">
                  Cerrar sesión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Container>
      </Navbar>
    </header>
  )
}

export default React.memo(Header)
