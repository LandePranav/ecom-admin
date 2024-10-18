import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    useEffect(()=>{
        axios.get('/api/orders').then(res => {
            setOrders(res.data);
        })
    },[]);
    return(
        <Layout>
            <h1>
                Orders
            </h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Recipient</th>
                        <th>Products</th>
                        <th>Paid</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 && orders.map(order => (
                        <tr>
                            <td>{new Date(order.createdAt).toLocaleString()}
                            </td>
                            <td>
                                {order.name} &nbsp; <br/>
                                {order.email} <br/>
                                {order.city} &nbsp; {order.postal} <br />
                                {order.addr} &nbsp; {order.country} <br />
                            </td>
                            <td>{order.line_items.map(l => (
                                <>
                                {l.price_data?.product_data?.name} x {l.count} x {l.price_data?.unit_amount}
                                </>
                            ))}
                            </td>
                            <td className={order.paid ? "text-green-300": "text-red-400"}>
                                {order.paid ? "YES" : "NO"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}