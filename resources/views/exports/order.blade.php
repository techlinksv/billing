<table>
    <thead>
    <tr>
        <th># Factura</th>
        <th>Fecha</th>
        <th>Cliente</th>
        <th>Forma de pago</th>
        <th>IVA	</th>
        <th>Tax	</th>
        <th>Total</th>
    </tr>
    </thead>
    <tbody>
       <tr>
        <td>{{$order->bill_number}}</td>
        <td>{{$order->created_at}}</td>
        <td>{{$order->client_first_name.' '.$order->client_last_name}}</td>
        <td>{{$order->payment_type}}</td>
        <td>{{$order->totalIva}}</td>
        <td>{{$order->tax}}</td>
        <td>{{$order->total}}</td>
       </tr>
    </tbody>
</table>
<table>
    <thead>
    <tr>
        <th>Código</th>
        <th>Nombre</th>
        <th>Cantidad</th>
        <th>Costo</th>
        <th>Precio</th>
        <th>Sub Total</th>
    </tr>
    </thead>
    <tbody>
        @foreach ($order->items as $item)
            <tr>
                <td>{{$item->batch->product->sku}}</td>
                <td>{{$item->batch->product->name}}</td>
                <td>{{$item->quantity}}</td>
                <td>{{$item->cost}}</td>
                <td>{{$item->price}}</td>
                <td>{{$item->total}}</td>
            </tr>
        @endforeach
    </tbody>
</table>