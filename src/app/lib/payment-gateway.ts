import midtransClient from "midtrans-client";
export const snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === "production" ? true : false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

