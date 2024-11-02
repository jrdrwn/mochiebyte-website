"use client";

import Link from "next/link";
import { useState } from "react";
import { GoArrowRight } from "react-icons/go";
import { MdClose, MdMenu } from "react-icons/md";
import AboutUsImg from "./components/assets/AboutUsImg";
import Bg from "./components/assets/Bg";

export default function Home() {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <>
      <Bg className="fixed inset-0 -z-10 h-[100dvh] w-full max-w-[100dvw]" />
      <div className="container mx-auto min-h-[100dvh] pt-24">
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
            <Link href={"/pesanan"} className="btn btn-ghost">
              Cek pesanan
            </Link>
          </nav>
          <nav className="hidden md:block">
            <Link href={"/shop"} className="btn btn-ghost">
              Order
            </Link>
            <Link href={"/pesanan"} className="btn btn-ghost">
              Cek pesanan
            </Link>
          </nav>
        </header>
        <section className="mx-auto px-2 pt-12 md:pt-24">
          <div className="mx-auto max-w-screen-md text-center">
            <span className="btn btn-outline btn-sm mb-4">
              #ProgrammedToEat <div className="badge">2024</div>
            </span>
            <h1 className="text-4xl font-bold leading-snug md:text-[56px] md:leading-tight md:tracking-tight">
              Nikmati perpaduan{" "}
              <span className="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-primary">
                <span className="relative text-primary-content">cita rasa</span>
              </span>{" "}
              mochi dan minuman
            </h1>
            <p className="mb-8 mt-4 leading-relaxed">
              Di MochieByte, kami menghadirkan mochi Jepang terbaik dengan
              sentuhan modern, dipadukan dengan minuman segar seperti es serut
              timun dan sirup jeruk. Cocok untuk menyegarkan diri di hari yang
              panas atau sebagai camilan ringan, produk kami dibuat untuk
              memanjakan dan menyehatkan.
            </p>
            <Link href={"/shop"} className="btn btn-primary">
              Jelajahi menu <GoArrowRight size={24} />{" "}
            </Link>
          </div>
        </section>
        <section className="mx-auto flex max-w-screen-xl flex-col items-center justify-between px-4 pt-24 md:flex-row">
          <div className="flex-1">
            <AboutUsImg className="w-[calc(100vw-4rem)] md:w-full" />
          </div>
          <div className="flex-1">
            <h2 className="mb-4 text-3xl font-medium">
              Kisah Kami: Dari Tradisi Hingga Cita Rasa Modern
            </h2>
            <p className="">
              MochieByte didirikan oleh sekelompok technopreneur yang
              bersemangat, membawa cita rasa mochi tradisional Jepang kepada
              pecinta kuliner modern. Kami menggabungkan resep otentik dengan
              bahan lokal untuk menciptakan pengalaman yang unik. Selain mochi,
              kami juga menawarkan minuman segar seperti es serut timun dan
              sirup jeruk, yang cocok untuk segala suasana. Tujuan kami adalah
              menghadirkan pengalaman kuliner yang segar, inovatif, dan mudah
              diakses oleh semua orang.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-screen-xl px-4 pt-24">
          <h2 className="text-xl font-medium">
            Rasa Segar, Kombinasi Inovatif
          </h2>
          <h1 className="mb-8 text-3xl font-medium">
            Jelajahi Mochi dan Minuman Segar Kami
          </h1>
          <div className="flex flex-wrap justify-around gap-4">
            <div className="card card-compact w-72 shadow-xl">
              <figure>
                <img
                  src="/images/easy-mochi.jpg"
                  className="h-52 w-full rounded-t-lg object-cover"
                  alt="Shoes"
                />
              </figure>
              <div className="card-body">
                <span className="card-title">Mochi</span>
                <span>
                  Mochi tradisional kami hadir dengan berbagai varian rasa
                  seperti matcha, mangga, stroberi, dan cokelat. Tekstur kenyal
                  dan isian lezat membuatnya sempurna sebagai camilan harian
                  atau hidangan penutup.
                </span>
              </div>
            </div>
            <div className="card card-compact w-72 shadow-xl">
              <figure>
                <img
                  src="/images/hard-mochi.jpg"
                  className="h-52 w-full rounded-t-lg object-cover"
                  alt="Shoes"
                />
              </figure>
              <div className="card-body">
                <span className="card-title">Mochi Satai</span>
                <span>
                  Mochi disajikan dalam bentuk satai, di mana beberapa potongan
                  mochi ditusuk pada batang sate, memberikan tampilan unik yang
                  tetap mempertahankan rasa mochi asli. Tanpa saus tambahan,
                  hanya kenikmatan mochi yang khas!
                </span>
              </div>
            </div>
            <div className="card card-compact w-72 shadow-xl">
              <figure>
                <img
                  src="/images/pyucumber-ice.png"
                  className="h-52 w-full rounded-t-lg object-cover"
                  alt="Shoes"
                />
              </figure>
              <div className="card-body">
                <span className="card-title">Es Serut Timun</span>
                <span>
                  Segarkan diri dengan es serut timun kami yang alami dan
                  menyegarkan, cocok dinikmati saat cuaca panas.
                </span>
              </div>
            </div>
            <div className="card card-compact w-72 shadow-xl">
              <figure>
                <img
                  src="/images/javascript-syrup.jpg"
                  className="h-52 w-full rounded-t-lg object-cover"
                  alt="Shoes"
                />
              </figure>
              <div className="card-body">
                <span className="card-title">Sirup Jeruk</span>
                <span>
                  Sirup jeruk kami memberikan rasa segar dan manis-asam yang
                  pas, menyempurnakan pengalaman menikmati mochi dan es serut.
                </span>
              </div>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-screen-md px-4 py-24 text-center">
          <h2 className="mb-4 text-center text-3xl font-medium">
            Hubungi kami!
          </h2>
          <p className="mb-10 text-center">
            Punya pertanyaan atau ingin memberikan masukan? Kami senang
            mendengar dari Anda! Kirim pesan kepada kami, dan kami akan segera
            menanggapi.
          </p>
          <button className="btn btn-primary">Hubungi Kami Sekarang</button>
        </section>
      </div>
      <div className="container relative mx-auto p-8">
        <div className="flex flex-wrap justify-between">
          <div className="text-center">
            <img src="/images/logo-big.png" className="w-full md:w-40" />
          </div>
          <div className="flex flex-wrap items-end gap-12">
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-medium">Kontak</h2>
              <div className="flex flex-col gap-2">
                <span>Alamat: Jl. Mochi No. 1, Jakarta</span>
                <span>
                  Email:{" "}
                  <a href="mailto:mochie@mail.com" className="text-primary">
                    mochie@mail.com{" "}
                  </a>
                </span>
                <span>
                  Telepon:{" "}
                  <a href="tel:+62213456789" className="text-primary">
                    +62 21 3456 789
                  </a>
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-medium">Ikuti Kami</h2>
              <div className="flex flex-col gap-2">
                <a href="#" className="link">
                  Instagram
                </a>
                <a href="#" className="link">
                  Facebook
                </a>
                <a href="#" className="link">
                  Twitter
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
}
