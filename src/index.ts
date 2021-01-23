import EclairTs from 'eclair-ts';
import { carolEclair } from './config';

(async () => {
  //   const lnrpc = await createLnrpc(aliceLnd);
  //   const stream = lnrpc.subscribeChannelEvents();
  //   stream.on('data', (chunk) => {
  //     console.log('LND data received');
  //     console.log(chunk);
  //   });
  console.log('stream established');
  //   const res = await axios.post(
  //     carolEclair.url + '/channels',
  //     null,
  //     carolEclair.httpConfig
  //   );
  const eclairTs = new EclairTs(carolEclair);
  const info = await eclairTs.getInfo();
  console.log('info about this node:');
  console.log(info);

  const listener = eclairTs.listen();
  listener.on('message', (data) => {
    console.log('DATA');
    console.log(data);
  });
})();
