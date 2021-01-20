import createLnrpc from '@radar/lnrpc';
import axios from 'axios';
import { aliceLnd, carolEclair } from './config';

(async () => {
  const lnrpc = await createLnrpc(aliceLnd);
  const stream = lnrpc.subscribeChannelEvents();
  stream.on('data', (chunk) => {
    console.log('LND data received');
    console.log(chunk);
  });
  console.log('stream established');
  console.log(carolEclair.url + '/channels');
  const res = await axios.post(
    carolEclair.url + '/channels',
    null,
    carolEclair.httpConfig
  );
  console.log(res.data);
})();
