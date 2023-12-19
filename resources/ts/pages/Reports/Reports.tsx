import React from 'react'
import { Link } from 'react-router-dom'

import { useCheckPermission } from '../../common'

import { ReportsMenu } from './style'

export const Reports: React.FC = () => {
  const { getRole } = useCheckPermission()
  const role = getRole()
  return (
    <>
      <h4 className="mb-3 pt-2">Reportes disponibles</h4>
      <ReportsMenu className="pb-3">
        <Link className="element-link fs-6" to="/reporte/inventario">
          Reporte de inventario
        </Link>
        {role === 'admin' && (
          <Link className="element-link fs-6" to="/reporte/utilidad">
            Reporte de utilidad
          </Link>
        )}
        <Link className="element-link fs-6" to="/reporte/cuentas-por-cobrar">
          Cuentas por cobrar general
        </Link>
        <Link className="element-link fs-6" to="/reporte/cuentas-por-cobrar-por-cliente">
          Cuentas por cobrar por cliente
        </Link>
        <Link className="element-link fs-6" to="/reporte/ventas-por-vendedor">
          Reporte de ventas por vendedor
        </Link>
        {role !== 'vendedor' && (
          <Link className="element-link fs-6" to="/reporte/mas-menos-vendidos">
            Productos mas y menos vendidos
          </Link>
        )}
        <Link className="element-link fs-6" to="/reporte/por-factura">
          Reporte por factura
        </Link>
        <Link className="element-link fs-6" to="/reporte/entradas-y-salidas">
          Reporte entradas y salidas
        </Link>
        {role !== 'vendedor' && (
          <>
            <Link className="element-link fs-6" to="/reporte/gastos">
              Reporte de gastos
            </Link>
            <Link className="element-link fs-6" to="/reporte/ingresos">
              Reporte de ingresos
            </Link>
          </>
        )}
      </ReportsMenu>
    </>
  )
}
