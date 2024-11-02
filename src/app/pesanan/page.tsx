"use client";
import axios from "axios";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { MdClose, MdMenu } from "react-icons/md";

interface Order {
  id: number;
  code: string;
  status: string;
  midtransToken?: string;
  user: {
    name: string;
    email: string;
    telpon: string;
    alamat: string;
    bukti_pembayaran: string;
    metode_pembayaran: string;
  };
  orderItem: {
    id: number;
    quantity: number;
    product: {
      name: string;
      description: string;
      price: number;
      image: string;
      flavors: { name: string }[];
      toppings: { name: string; price: number }[];
    };
    flavor?: { name: string };
    topping?: { name: string; price: number };
  }[];
}
export default function Pesanan() {
  return (
    <Suspense>
      <PesananPage />
    </Suspense>
  );
}
function PesananPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [orderCode, setOrderCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [midtransToken, setMidtransToken] = useState("");

  const handleSearch = async (orderCode: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`/api/pesanan?code=${orderCode}`);
      setOrder(res.data);
    } catch {
      setError("Order not found");
      setOrder(null);
    }
    setLoading(false);
  };

  const calculateTotalPrice = () => {
    if (!order) return 0;
    return order.orderItem.reduce((total, item) => {
      const toppingPrice = item.topping ? item.topping.price : 0;
      return total + (item.product.price + toppingPrice) * item.quantity;
    }, 0);
  };

  const searchParams = useSearchParams();

  useEffect(() => {
    const orderCode = searchParams.get("code") || searchParams.get("order_id");
    const token = searchParams.get("midtrans_token");
    if (orderCode) {
      setOrderCode(orderCode);
      handleSearch(orderCode);
    }
    if (token) {
      setMidtransToken(token);
    }
  }, [searchParams]);
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="container mx-auto px-4 pb-4 pt-24">
      <header className="fixed inset-x-2 top-2 z-50 mt-2 flex items-center justify-between rounded-full border border-primary bg-transparent px-4 py-1 shadow-md filter backdrop-blur-sm">
        <Link href={"/"}>
          <div id="brand" className="flex items-center justify-center gap-2">
            <img src="/images/logo.png" className="h-8 w-8" />
            <span className="font-bold">MochieByte</span>
          </div>
        </Link>
        <nav className="block md:hidden">
          <button
            className="btn btn-circle btn-ghost"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </nav>
        <nav
          className={`absolute bottom-[-125px] block md:hidden ${mobileMenu ? "right-0" : "right-[-200px]"} flex h-max flex-col items-end rounded-xl border border-primary bg-base-100 p-2 shadow-xl transition-all`}
        >
          <Link href={"/shop"} className="btn btn-ghost">
            Order
          </Link>
          <Link href={"/"} className="btn btn-ghost">
            Home
          </Link>
        </nav>
        <nav className="hidden md:block">
          <Link href={"/shop"} className="btn btn-ghost">
            Order
          </Link>
          <Link href={"/"} className="btn btn-ghost">
            Home
          </Link>
        </nav>
      </header>
      <h1 className="my-8 text-center text-3xl font-bold">Cek Pesanan</h1>
      <div className="mb-8 flex justify-center">
        <input
          type="text"
          value={orderCode}
          onChange={(e) => {
            setOrderCode(e.target.value);
          }}
          placeholder="Masukkan kode pesananan"
          className="input input-bordered w-full max-w-xs"
        />
        <button
          className="btn btn-primary ml-4"
          onClick={() => {
            setOrder(null);
            location.replace(`?code=${orderCode}`);
          }}
          disabled={loading}
        >
          Cari
        </button>
      </div>
      {loading && (
        <div className="w-full text-center">
          <span className="loading loading-spinner mx-auto"></span>
        </div>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}
      {order && (
        <div className="card card-bordered mx-auto max-w-fit bg-base-100 shadow-xl">
          <div className="p-4">
            <div>
              <h2 className="card-title">Status: {order.status}</h2>
              <p>Kode pesanan: #{order.code}</p>
              <h3 className="mt-4 text-xl font-bold">Detail Pembeli</h3>
              <p>Nama: {order.user.name}</p>
              <p>Email: {order.user.email}</p>
              <p>Telepon: {order.user.telpon}</p>
              <p>Alamat: {order.user.alamat}</p>
              <p>Pembayaran: {order.user.metode_pembayaran}</p>
              {order.status === "menunggu-pembayaran" &&
                order.user.metode_pembayaran === "midtrans" && (
                  <Link
                    href={`https://app.midtrans.com/snap/v2/vtweb/${order.midtransToken}`}
                    target="_blank"
                    className="btn btn-primary mt-4"
                  >
                    Bayar Sekarang
                  </Link>
                )}
              {order.user.metode_pembayaran === "tf" && (
                <>
                  <h3 className="mt-4 text-xl font-bold">Bukti Pembayaran</h3>
                  <img
                    src={order.user.bukti_pembayaran}
                    alt="Bukti Pembayaran"
                    className="mt-4 h-32 w-32 rounded-xl object-cover"
                  />
                </>
              )}
            </div>
            <div className="mt-4">
              <h3 className="mb-2 text-xl font-bold">Detail Pembelian</h3>
              {order.orderItem.map((item) => (
                <div
                  key={item.id}
                  className="mb-4 flex flex-wrap items-center gap-2"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-32 w-32 rounded-xl object-cover"
                  />
                  <div className="flex flex-col gap-1">
                    <p>Produk: {item.product.name}</p>
                    <p>Deskripsi: {item.product.description}</p>
                    <p>Harga: Rp {item.product.price}</p>
                    <p>Jumlah: {item.quantity}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      {item.flavor && (
                        <p className="badge">Rasa: {item.flavor.name}</p>
                      )}
                      {item.topping && (
                        <p className="badge">
                          Toping: {item.topping.name} (Rp {item.topping.price})
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between">
              <h3>Total Harga:</h3>
              <span>Rp {calculateTotalPrice()},00</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

