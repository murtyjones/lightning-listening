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

const cLightningRequest = async (url: string, method: 'GET' | 'POST') => {
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
