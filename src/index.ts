import createLnRpc from '@radar/lnrpc';
import axios from 'axios';
import EclairTs from 'eclair-ts';
import { aliceLnd, bobCLightning, carolEclair } from './config';
import { read } from './utils';

const lndListen = async () => {
  const lnrpc = await createLnRpc(aliceLnd);
  const stream = lnrpc.subscribeChannelEvents();
  stream.on('data', (chunk) => {
    console.log('LND data received');
    console.log(chunk);
  });
};

const eclairListen = async () => {
  const eclairTs = new EclairTs(carolEclair);
  const listener = eclairTs.listen();
  listener.on('message', (data) => {
    console.log('DATA');
    console.log(data);
  });
};

interface CLightningListChannels {
  id: string;
  connected: boolean;
  state: 'CHANNELD_NORMAL' | 'CHANNELD_AWAITING_LOCKIN' | 'ONCHAIN';
  short_channel_id: string;
  channel_id: string;
  funding_txid: string;
  private: boolean;
  msatoshi_to_us: number;
  msatoshi_total: number;
  msatoshi_to_them: number;
  their_channel_reserve_satoshis: number;
  our_channel_reserve_satoshis: number;
  spendable_msatoshi: number;
  funding_allocation_msat: {
    [key in string]: number;
  };
  direction: number;
  alias: string;
}

const cLightningRequest = async (
  url: string,
  method: 'GET' | 'POST'
): Promise<CLightningListChannels[]> => {
  const response = await axios.request({
    url,
    method,
    headers: {
      'Content-Type': 'application/json',
      macaroon: await read(bobCLightning.macaroonPath, 'base64'),
    },
  });
  console.log('Open C-Lightning channels');
  console.log(response.data);
  return response.data;
};

(async () => {
  await lndListen();
  await eclairListen();
  await cLightningRequest(
    `${bobCLightning.url}/v1/channel/listChannels`,
    'GET'
  );
})();
