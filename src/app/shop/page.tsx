"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  MdAdd,
  MdAddShoppingCart,
  MdArrowBack,
  MdClose,
  MdDelete,
  MdMenu,
  MdRemove,
  MdShoppingCart,
  MdShoppingCartCheckout,
  MdUpload,
} from "react-icons/md";
import ModalImage from "react-modal-image";
import { Bounce, toast } from "react-toastify";
import { IProduct } from "./Product.interface";

const ProductCard = ({
  product,
  setCart,
  cart,
}: {
  product: IProduct;
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  cart: CartItem[];
}) => {
  const [quantity, setQuantity] = useState(1);
  const [flavor, setFlavor] = useState(0);
  const [topping, setTopping] = useState(0);
  const [price, setPrice] = useState(0);

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };
  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    if (product.id == 1 && (!flavor || !topping)) {
      toast.error("Harus memilih rasa dan topping!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } else if (product.id == 2 && !topping) {
      toast.error("Harus memilih topping", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } else {
      setCart([
        ...cart,
        {
          productid: product.id,
          quantity,
          flavorid: flavor,
          toppingid: topping,
        },
      ]);
      toast.info(`${product.name} ditambahkan!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  useEffect(() => {
    setPrice(product.price);
  }, []);

  useEffect(() => {
    if (topping) {
      const selectedTopping = product.toppings?.find((t) => t.id === topping);
      if (selectedTopping) {
        setPrice((selectedTopping.price + product.price) * quantity);
      }
    }
  }, [topping]);

  useEffect(() => {
    if (topping) {
      const selectedTopping = product.toppings?.find((t) => t.id === topping);
      if (selectedTopping) {
        setPrice((selectedTopping.price + product.price) * quantity);
      }
    } else setPrice(product.price * quantity);
  }, [quantity]);

  return (
    <div
      data-product-id={product.id}
      className="relative flex h-auto w-96 flex-col justify-between overflow-hidden rounded-xl border border-primary p-2"
    >
      <div>
        <img
          src={product.image}
          alt={product.name}
          className="mb-4 h-96 w-full rounded-xl object-cover object-center"
        />
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-full border border-primary px-4 py-2">
          <span className="font-medium">{product.name}</span>

          <span className="badge-primary badge-outline hidden md:badge">
            {product.description}
          </span>
          <span className="badge badge-primary">Rp{price},00</span>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <span className="badge badge-primary badge-outline md:hidden">
            {product.description}
          </span>
          {product.flavors.length > 0 && (
            <select
              className="select select-bordered select-xs max-w-xs"
              onChange={(e) => setFlavor(parseInt(e.target.value))}
              defaultValue={"0"}
            >
              <option value="0" disabled>
                Pilih Rasa
              </option>
              {product.flavors.map((flavor) => (
                <option key={flavor.id} value={flavor.id}>
                  {flavor.name}
                </option>
              ))}
            </select>
          )}
          {product.toppings.length > 0 && (
            <select
              className="select select-bordered select-xs max-w-xs"
              onChange={(e) => setTopping(parseInt(e.target.value))}
              defaultValue={"0"}
            >
              <option value="0" disabled>
                Pilih Topping
              </option>
              {product.toppings.map((topping) => (
                <option key={topping.name} value={topping.id}>
                  {topping.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-2">
        <div className="flex w-full items-center gap-2">
          <button
            className="btn btn-circle btn-secondary btn-sm"
            onClick={incrementQuantity}
          >
            <MdAdd size={23} />
          </button>
          <span className="w-10 rounded-full border border-secondary py-2 text-center text-secondary-content">
            {quantity}
          </span>
          <button
            className="btn btn-circle btn-secondary btn-sm"
            onClick={decrementQuantity}
          >
            <MdRemove size={23} />
          </button>
        </div>

        <button
          className="btn btn-circle btn-primary"
          onClick={handleAddToCart}
        >
          <MdAddShoppingCart size={23} />
        </button>
      </div>
    </div>
  );
};

interface CartItem {
  productid: number;
  flavorid?: number;
  toppingid?: number;
  quantity: number;
}

interface IFormDataCheckout {
  name: string;
  email: string;
  telpon: string;
  alamat: string;
  metode_pembayaran: string;
  bukti_pembayaran: string;
}

const CartPage = ({
  cart,
  setCart,
  openCart,
  setOpenCart,
  products,
}: {
  products: IProduct[];
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  openCart: boolean;
  setOpenCart: (value: boolean) => void;
}) => {
  const [removeIdx, setRemoveIdx] = useState<number>(0);
  const removeItem = (_idx: number) => {
    (
      document?.getElementById("confirm_delete_modal") as HTMLDialogElement
    )?.showModal();
    setRemoveIdx(_idx);
  };
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const totalPrice = cart.reduce((acc, item) => {
    const product = products.find((p) => p.id === item.productid);
    if (product) {
      const selectedTopping = product.toppings?.find(
        (t) => t.id === item.toppingid,
      );
      if (selectedTopping) {
        return acc + (product.price + selectedTopping.price) * item.quantity;
      }
      return acc + product.price * item.quantity;
    }
    return acc;
  }, 0);

  const [pembayaran, setPembayaran] = useState("");
  const [image, setImage] = useState("");
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const router = useRouter();
  const handleCheckout = () => {
    setLoadingCheckout(true);
    fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify(Object.assign({ cart }, formDataCheckout)),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLoadingCheckout(false);
        if (data) {
          setCart([]);
          setOpenCart(false);
          if (data.transaction) {
            toast.success("Pesanan berhasil di checkout!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              transition: Bounce,
            });
            router.push(`/pesanan?code=${data?.orderCode}`);
          } else {
            toast.success(
              "Pesanan berhasil di checkout! dan kode pesanan sudah dikirim melalui email.",
              {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
              },
            );

            router.push(`/pesanan?code=${data?.orderCode}`);
          }
        } else {
          toast.error("Gagal checkout!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Gagal checkout!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      })
      .finally(() => {
        setLoadingCheckout(false);
      });
  };

  const [formDataCheckout, setFormDataCheckout] = useState<IFormDataCheckout>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const metodePembayaran = formData.get("metode_pembayaran");
    if (cart.length < 1) {
      toast.error("Keranjang kosong!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }
    if (!image && metodePembayaran == "tf") {
      toast.warning("Bukti pembayaran harus diisi!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } else {
      const modal = document.getElementById(
        "confirm_checkout_modal",
      ) as HTMLDialogElement;
      modal.showModal();
      formData.delete("image");
      formData.set("bukti_pembayaran", metodePembayaran == "tf" ? image : "");
      setFormDataCheckout(
        Object.fromEntries(formData) as unknown as IFormDataCheckout,
      );
    }
  };

  return (
    <>
      <dialog id="confirm_delete_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="text-lg font-bold">Konfirmasi</h3>
          <p className="py-4">
            Apakah anda yakin ingin menghapus item ini dari keranjang?
          </p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button
                className="btn"
                onClick={() =>
                  setCart(cart.filter((item, idx) => idx !== removeIdx))
                }
              >
                Hapus
              </button>
            </form>
          </div>
        </div>
      </dialog>
      <dialog id="confirm_checkout_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="text-lg font-bold">Konfirmasi</h3>
          <p className="py-4">Apakah anda yakin ingin checkout pesanan ini?</p>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn" onClick={handleCheckout}>
                Checkout
              </button>
            </form>
          </div>
        </div>
      </dialog>
      <div
        className={`fixed bottom-0 left-0 right-0 overflow-hidden ${openCart ? "top-0 overflow-y-scroll" : "top-full"} z-50 bg-base-100 p-4`}
      >
        <div className="mx-auto max-w-screen-md">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Keranjang</h2>
            <button
              className="btn btn-circle btn-ghost"
              onClick={() => setOpenCart(false)}
            >
              <MdArrowBack size={22} />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {cart.length === 0 && (
              <div className="text-center">
                <h3>Keranjang kosong</h3>
              </div>
            )}
            {cart.map((item, idx) => {
              const product = products.find((p) => p.id === item.productid);
              if (!product) return null;
              const selectedTopping = product.toppings?.find(
                (t) => t.id === item.toppingid,
              );
              return (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-16 w-16 rounded-full object-cover object-center"
                    />
                    <div>
                      <h3>{product.name}</h3>
                      <p>
                        {item.quantity} x Rp
                        {selectedTopping
                          ? product.price + selectedTopping.price
                          : product.price}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        {item.flavorid != 0 && (
                          <span className="badge">
                            Rasa:{" "}
                            {
                              products
                                .find(
                                  (product) => product.id === item.productid,
                                )
                                ?.flavors.find(
                                  (flavor) => flavor.id === item.flavorid,
                                )?.name
                            }
                          </span>
                        )}
                        {item.toppingid != 0 && (
                          <span className="badge">
                            Topping:{" "}
                            {
                              products
                                .find(
                                  (product) => product.id === item.productid,
                                )
                                ?.toppings.find(
                                  (topping) => topping.id === item.toppingid,
                                )?.name
                            }
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      className="btn btn-circle btn-warning"
                      onClick={() => removeItem(idx)}
                    >
                      <MdDelete size={23} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <h3>Detail Pengiriman</h3>
              <div className="mt-2 grid grid-cols-1 gap-4">
                <input
                  name="name"
                  type="text"
                  placeholder="Nama Lengkap"
                  className="input input-bordered"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email aktif"
                  className="input input-bordered"
                  required
                />
                <input
                  type="tel"
                  name="telpon"
                  placeholder="Nomor Telepon atau WhatsApp"
                  className="input input-bordered"
                  required
                />
                <textarea
                  name="alamat"
                  placeholder="Alamat Pengiriman"
                  className="textarea textarea-bordered"
                  required
                ></textarea>
                <select
                  className="select select-bordered"
                  name="metode_pembayaran"
                  required
                  onChange={(e) => setPembayaran(e.target.value)}
                  defaultValue={""}
                >
                  <option value="" disabled>
                    Metode Pembayaran
                  </option>
                  <option value="cod">COD</option>
                  <option value="tf">E-wallet ( DANA )</option>
                  <option value="midtrans">
                    Semua Pembayaran termasuk QRIS
                  </option>
                </select>
                {pembayaran === "tf" && (
                  <div className="form-control mx-auto w-full">
                    <label className="label" htmlFor="upload-image">
                      <span className="label-text">Bukti Pembayaran</span>
                      <span className="label-text">
                        DANA: 082250561358 AN (NORUL ANNISA)
                      </span>
                    </label>
                    <div className="">
                      {image && (
                        <ModalImage
                          small={image}
                          medium={image}
                          large={image}
                          hideDownload={true}
                          alt=""
                          className="mb-2 h-36 w-full rounded-md object-cover"
                        />
                      )}
                      <label
                        htmlFor="upload-image"
                        className="btn btn-outline btn-primary w-full"
                      >
                        {uploadImageLoading ? (
                          <div className="loading loading-ring" />
                        ) : (
                          <>
                            <MdUpload size={24} /> {image ? "Update" : "Upload"}
                          </>
                        )}
                      </label>
                      <input
                        type="text"
                        name="image"
                        defaultValue={image}
                        hidden
                      />
                      <input
                        id="upload-image"
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={async (e) => {
                          setUploadImageLoading(true);
                          const file = e.target.files?.[0] as Blob;
                          const formData = new FormData();
                          formData.append("image", file);
                          const response = await fetch("/api/imagekit", {
                            method: "POST",
                            body: formData,
                          });

                          if (!response.ok) {
                            alert("Gagal mengupload gambar!");
                          } else {
                            const json = await response.json();
                            setImage(json.url);
                          }
                          setUploadImageLoading(false);
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-8 flex flex-wrap justify-between">
              <div className="mt-4 flex items-center justify-between gap-1">
                <h3>Total Harga (Belum termasuk ongkir):</h3>
                <span>Rp{totalPrice},00</span>
              </div>
              <button
                className={`btn btn-primary ${loadingCheckout ? "loading" : ""} mt-4`}
                type="submit"
              >
                Checkout <MdShoppingCartCheckout size={23} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

const Shop = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [openCart, setOpenCart] = useState(false);
  const [products, setProducts] = useState<IProduct[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = openCart ? "hidden" : "auto";
  }, [openCart]);

  const getProducts = async () => {
    setLoading(true);
    const response = await fetch("/api/product");
    setLoading(false);
    const data = await response.json();
    if (data) {
      setProducts(data);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);
  const [mobileMenu, setMobileMenu] = useState(false);
  return (
    <>
      <div className="container mx-auto pt-24">
        <header className="fixed inset-x-2 top-2 z-50 mt-2 flex items-center justify-between rounded-full border border-primary bg-transparent px-4 py-1 shadow-md filter backdrop-blur-sm">
          <Link href={"/"}>
            <div id="brand" className="flex items-center justify-center gap-2">
              <img src="/images/logo.png" className="h-8 w-8" />
              <span className="font-bold">MochieByte</span>
            </div>
          </Link>
          <nav className="flex items-center gap-2 md:hidden">
            <button
              className="btn btn-outline btn-primary bg-base-100"
              onClick={() => setOpenCart(true)}
            >
              <MdShoppingCart size={20} />{" "}
              <span className="badge badge-secondary">{cart.length}</span>
            </button>
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
            <Link href={"/"} className="btn btn-ghost">
              Home
            </Link>
            <Link href={"/pesanan"} className="btn btn-ghost">
              Cek Pesanan
            </Link>
          </nav>
          <nav className="hidden items-center gap-2 md:flex">
            <Link href={"/"} className="btn btn-ghost">
              Home
            </Link>
            <Link href={"/pesanan"} className="btn btn-ghost">
              Cek Pesanan
            </Link>
            <button
              className="btn btn-outline btn-primary bg-base-100"
              onClick={() => setOpenCart(true)}
            >
              <MdShoppingCart size={20} />{" "}
              <span className="badge badge-secondary">{cart.length}</span>
            </button>
          </nav>
        </header>
        <div
          className={`flex min-h-[calc(100dvh-6rem)] flex-wrap ${loading ? "items-center" : ""} justify-around gap-4 px-2`}
        >
          {products?.map((product, index) => (
            <ProductCard
              key={index}
              product={product}
              setCart={setCart}
              cart={cart}
            />
          ))}
          {loading && (
            <button
              className="btn btn-primary loading loading-dots loading-lg"
              disabled
            ></button>
          )}
        </div>
      </div>
      <CartPage
        products={products || []}
        cart={cart}
        setCart={setCart}
        openCart={openCart}
        setOpenCart={setOpenCart}
      />
      <div className="container relative mx-auto p-8">
        <div className="flex flex-wrap justify-between">
          <div className="text-center">
            <img src="/images/logo-big.png" className="w-full md:w-40" />
          </div>
          <div className="flex flex-wrap items-start gap-12">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-medium">Kontak</h2>
              <div className="flex flex-col gap-2">
                <span>Alamat: Jurusan Teknik Informatika</span>
                <span>
                  Email:{" "}
                  <a
                    href="mailto:mochiebyte@gmail.com"
                    className="text-primary"
                  >
                    mochiebyte@gmail.com{" "}
                  </a>
                </span>
                <span>
                  Cinda:{" "}
                  <a href="tel:+6281258605454" className="text-primary">
                    +62 812-5860-5454
                  </a>
                </span>
                <span>
                  Pute:{" "}
                  <a href="tel:+6281348681514" className="text-primary">
                    +62 813-4868-1514
                  </a>
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-medium">Ikuti Kami</h2>
              <div className="flex flex-col gap-2">
                <a
                  href="https://www.instagram.com/mochiebyte/"
                  className="link"
                  target="_blank"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
        <hr className="my-8 border-base-200" />
        <div className="flex flex-wrap justify-between gap-4">
          <div className="flex gap-4">
            <a href="#" className="link">
              Kebijakan Privasi
            </a>
            <a href="#" className="link">
              Syarat dan Ketentuan
            </a>
          </div>
          <div className="flex gap-4">
            <span>&copy; 2024 MochieByte. All rights reserved.</span>
          </div>
          <div className="flex gap-4">
            <span>Designed by MochieByte Team</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;

