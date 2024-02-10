<table>
    <thead>
        <tr>
            <th scope="col">ID Usuario</th>
            <th scope="col">Usuario</th>
            <th scope="col">Fecha Inicial</th>
            <th scope="col">Fecha Final</th>
        </tr>
        </thead>
        <tbody>
            <tr>
                <td>{{$user->id}}</td>
                <td>{{$user->name}}</td>
                <td>{{$from}}</td>
                <td>{{$to}}</td>
        </tr>
</table>

<table>
    <thead>
    <tr>
        <th scope="col" colspan="5" style="text-align: center"><h3>Pagos</h3></th>
    </tr>
    <tr>
        <th scope="col">Id</th>
        <th scope="col"># Comprobante</th>
        <th scope="col">Fecha de abono</th>
        <th scope="col">Cliente</th>
        <th scope="col">Monto</th>
        <th scope="col">Comentario</th>
    </tr>
    </thead>
    <tbody>
        @foreach($payments as $payment)
            <tr>
                <td>{{$payment->id}}</td>
                <td>{{$payment?->payment_bill_number}}</td>
                <td>{{\Carbon\Carbon::parse($payment->created_at)->format('d/m/Y')}}</td>
                <td>{{$payment->credit?->order?->client_company}}</td>
                <td>{{$payment->amount}}</td>
                <td>{{$payment->comments}}</td>
            </tr>
        @endforeach
        <tr>
            <td colspan="5">Total Abonos</td>
            <td>{{$totals->total_pagos}}</td>
            <td></td>
        </tr>
        <tr>
            <td colspan="5">Total Abonos Anulados</td>
            <td>{{$totals->total_pagos_anulados}}</td>
            <td></td>
        </tr>
    </tbody>
</table>
<table>
    <thead>
        <tr>
            <th scope="col" colspan="5" style="text-align: center"><h3>Facturas</h3></th>
        </tr>
    <tr>
        <th scope="col"># Factura</th>
        <th scope="col">Fecha de compra</th>
        <th scope="col">Local</th>
        <th scope="col">Tipo de pago</th>
        <th scope="col">Total</th>
    </tr>
    </thead>
    <tbody>
        @foreach($orders as $order)
            <tr>
                <td>{{$order->bill_number}}</td>
                <td>{{\Carbon\Carbon::parse($order->created_at)->format('d/m/Y')}}</td>
                <td>{{$order->client_company}}</td>
                <td>{{$order->payment_type}}</td>
                <td>{{$order->total}}</td>
            </tr>
        @endforeach
        <tr>
            <td colspan="4">Total Efectivo</td>
            <td>{{$totals->total_efectivo}}</td>
            <td></td>
        </tr>
        <tr>
            <td colspan="4">Total Crédito</td>
            <td>{{$totals->total_credito}}</td>
            <td></td>
        </tr>
        <tr>
            <td colspan="4">Total Entregado</td>
            <td>{{$totals->total_efectivo + $totals->total_pagos}}</td>
            <td></td>
        </tr>
    </tbody>
</table>