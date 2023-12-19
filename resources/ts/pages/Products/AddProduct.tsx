import React from 'react'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import { FaBoxes } from 'react-icons/fa'

import { CommonHeader } from '../../components'

import { AddMultipleProduct, AddSingleProduct } from './components'

export const AddProduct: React.FC = () => {
  return (
    <>
      <CommonHeader
        title="Crear Productos"
        link="/listado-de-productos"
        btnTex="Listado de productos"
        icon={<FaBoxes size={24} className="ms-2" />}
      />
      <Tabs defaultActiveKey="single" id="tabs-products" className="mb-3">
        <Tab eventKey="single" title="Cargar producto">
          <AddSingleProduct />
        </Tab>
        <Tab eventKey="multiple" title="Carga múltiple">
          <AddMultipleProduct />
        </Tab>
      </Tabs>
    </>
  )
}
