import WebSocket from 'ws';
import { carolEclair } from './config';
import { WebSocketEvent } from './types/eclair-0.5.0';

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
  const socket = new WebSocket(`ws://${carolEclair.url}/ws`, {
    headers: carolEclair.httpConfig.headers,
  });
  // Connection opened
  socket.addEventListener('open', function (event) {
    socket.send('Hello Server!');
  });

  // Listen for messages
  socket.addEventListener('message', function (event) {
    const data = event.data as WebSocketEvent;
    console.log('Message from server ', data);
  });
})();
