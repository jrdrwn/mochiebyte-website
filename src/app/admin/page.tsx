"use client";
import axios from "axios";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
} from "react-icons/fa";

interface User {
  id: number;
  name: string;
  email: string;
  telpon: string;
  alamat: string;
  metode_pembayaran: string;
  bukti_pembayaran: string;
  Order: Order[];
}

interface Order {
  id: number;
  code: string;
  status: string;
  orderItem: OrderItem[];
}

interface OrderItem {
  id: number;
  quantity: number;
  product: {
    name: string;
    description: string;
    price: number;
    image: string;
  };
  flavor?: {
    name: string;
  };
  topping?: {
    name: string;
    price: number;
  };
}
export default function Administrator() {
  return (
    <SessionProvider>
      <AdminOrdersPage />
    </SessionProvider>
  );
}
function AdminOrdersPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const limit = 10;

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `/api/admin/users?page=${page}&limit=${limit}`,
        );
        setUsers(res.data.users);
        setTotalUsers(res.data.totalUsers);
      } catch {
        setError("Failed to fetch users");
      }
      setLoading(false);
    };

    if (status === "authenticated") {
      fetchUsers();
    }
  }, [page, status]);

  const handleOrderStatusChange = async (orderId: number, status: string) => {
    try {
      await axios.post(`/api/admin/orders/${orderId}/status`, { status });
      location.reload();
    } catch {
      setError("Failed to update order status");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <FaCheckCircle className="text-green-500" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      case "processing":
        return <FaHourglassHalf className="text-yellow-500" />;
      default:
        return <FaHourglassHalf className="text-gray-500" />;
    }
  };

  const totalPages = Math.ceil(totalUsers / limit);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="my-8 text-center text-3xl font-bold">Admin - Pesanan</h1>
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className={`${selectedUser ? "hidden md:block" : "block"}`}>
          <h2 className="mb-4 text-2xl font-bold">Pengguna</h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Telepon</th>
                  <th>Alamat</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const lastOrder = user.Order[user.Order.length - 1];
                  return (
                    <tr
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className="cursor-pointer"
                    >
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.telpon}</td>
                      <td>{user.alamat}</td>
                      <td>
                        {lastOrder ? getStatusIcon(lastOrder.status) : "N/A"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between">
            <button
              className="btn btn-primary"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-primary"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
        {selectedUser && (
          <div className={`${selectedUser ? "block md:hidden" : "hidden"}`}>
            <button
              className="btn btn-secondary mb-4"
              onClick={() => setSelectedUser(null)}
            >
              <FaArrowLeft className="mr-2" /> Kembali
            </button>
            <h2 className="mb-4 text-2xl font-bold">Detail Pesanan</h2>
            {selectedUser?.Order?.map((order) => (
              <div
                key={order.id}
                className="card mb-4 w-full bg-base-100 shadow-xl"
              >
                <div className="card-body">
                  <h3 className="card-title">Kode Pesanan: {order.code}</h3>
                  <p>Status: {order.status}</p>
                  <h4 className="mt-4 text-xl font-bold">Detail Pembelian</h4>
                  {order.orderItem.map((item) => (
                    <div key={item.id} className="mb-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-32 w-32 object-cover"
                      />
                      <p>Produk: {item.product.name}</p>
                      <p>Deskripsi: {item.product.description}</p>
                      <p>Harga: Rp {item.product.price}</p>
                      {item.flavor && <p>Rasa: {item.flavor.name}</p>}
                      {item.topping && (
                        <p>
                          Toping: {item.topping.name} (Rp {item.topping.price})
                        </p>
                      )}
                      <p>Jumlah: {item.quantity}</p>
                    </div>
                  ))}
                  <div className="flex flex-col gap-2 md:flex-row">
                    <button
                      className="btn btn-warning"
                      onClick={() =>
                        handleOrderStatusChange(order.id, "processing")
                      }
                      disabled={
                        order.status === "processing" ||
                        order.status === "completed" ||
                        order.status === "cancelled"
                      }
                    >
                      Pesanan Diproses
                    </button>
                    <button
                      className="btn btn-error"
                      onClick={() =>
                        handleOrderStatusChange(order.id, "cancelled")
                      }
                      disabled={
                        order.status === "cancelled" ||
                        order.status === "completed"
                      }
                    >
                      Pesanan Dibatalkan
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        handleOrderStatusChange(order.id, "completed")
                      }
                      disabled={order.status === "completed"}
                    >
                      Tandai Selesai
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {selectedUser && (
          <div className="hidden md:block">
            <h2 className="mb-4 text-2xl font-bold">Detail Pesanan</h2>
            {selectedUser?.Order?.map((order) => (
              <div
                key={order.id}
                className="card mb-4 w-full bg-base-100 shadow-xl"
              >
                <div className="card-body">
                  <h3 className="card-title">Kode Pesanan: {order.code}</h3>
                  <p>Status: {order.status}</p>
                  <h4 className="mt-4 text-xl font-bold">Detail Pembelian</h4>
                  {order.orderItem.map((item) => (
                    <div key={item.id} className="mb-4">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-32 w-32 object-cover"
                      />
                      <p>Produk: {item.product.name}</p>
                      <p>Deskripsi: {item.product.description}</p>
                      <p>Harga: Rp {item.product.price}</p>
                      {item.flavor && <p>Rasa: {item.flavor.name}</p>}
                      {item.topping && (
                        <p>
                          Toping: {item.topping.name} (Rp {item.topping.price})
                        </p>
                      )}
                      <p>Jumlah: {item.quantity}</p>
                    </div>
                  ))}
                  <div className="flex flex-col gap-2 md:flex-row">
                    <button
                      className="btn btn-warning"
                      onClick={() =>
                        handleOrderStatusChange(order.id, "processing")
                      }
                      disabled={
                        order.status === "processing" ||
                        order.status === "completed" ||
                        order.status === "cancelled"
                      }
                    >
                      Pesanan Diproses
                    </button>
                    <button
                      className="btn btn-error"
                      onClick={() =>
                        handleOrderStatusChange(order.id, "cancelled")
                      }
                      disabled={
                        order.status === "cancelled" ||
                        order.status === "completed"
                      }
                    >
                      Pesanan Dibatalkan
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        handleOrderStatusChange(order.id, "completed")
                      }
                      disabled={order.status === "completed"}
                    >
                      Tandai Selesai
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

