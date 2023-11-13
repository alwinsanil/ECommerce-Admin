import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get("/api/orders").then((response) => {
      setOrders(response.data);
    });
  }, []);
  console.log(orders);
  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <td>Date</td>
            <td>Recipient</td>
            <td>Products</td>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{new Date(order.createdAt).toLocaleString()}</td>
              <td>
                <strong>{order.name}</strong> {order.email}
                <br />
                {order.city} {order.postalCode} {order.country}
                <br />
                {order.streetAddress}
              </td>
              <td>
                {order.line_items.map((l) => (
                  <>
                    <strong>{l.price_data?.product_data.name}</strong> --- Oty:
                    {l.quantity}
                    <br />
                  </>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
