import createLnrpc from '@radar/lnrpc';
import { aliceLnd } from './config';

(async () => {
  const lnrpc = await createLnrpc(aliceLnd);
  const stream = lnrpc.subscribeChannelEvents();
  stream.on('data', (chunk) => {
    console.log('data received');
    console.log(chunk);
  });
  console.log('stream established');
})();
