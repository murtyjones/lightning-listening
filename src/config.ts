import dotenv from 'dotenv';

dotenv.config();

export const aliceLnd = {
  server: String(process.env.ALICE_LND_HOST),
  tls: String(process.env.ALICE_TLS_CERT_PATH),
  macaroonPath: String(process.env.ALICE_LND_MACAROON_PATH),
};

export const carolEclair = {
  url: String(process.env.CAROL_ECLAIR_HOST),
  headers: {
    Authorization: `Basic ${process.env.CAROL_ECLAIR_BASIC_AUTH_HEADER}`,
  },
};

export const bobCLightning = {
  url: String(process.env.BOB_CLIGHTNING_HOST),
  macaroonPath: String(process.env.BOB_CLIGHTNING_MACAROON_PATH),
};
