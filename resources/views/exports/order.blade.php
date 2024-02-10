<table>
    <thead>
    <tr>
        <th scope="col"># Factura</th>
        <th scope="col">Fecha</th>
        <th scope="col">Cliente</th>
        <th scope="col">Forma de pago</th>
        <th scope="col">IVA	</th>
        <th scope="col">Tax	</th>
        <th scope="col">Total</th>
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
        <th scope="col">Código</th>
        <th scope="col">Nombre</th>
        <th scope="col">Cantidad</th>
        <th scope="col">Costo</th>
        <th scope="col">Precio</th>
        <th scope="col">Sub Total</th>
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