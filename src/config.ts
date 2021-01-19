import dotenv from 'dotenv';

dotenv.config();

export const aliceLnd = {
  server: String(process.env.ALICE_LND_HOST),
  tls: String(process.env.ALICE_TLS_CERT_PATH),
  macaroonPath: String(process.env.ALICE_LND_MACAROON_PATH),
};
