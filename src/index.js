import { initializeTabEvents } from './tabEvents'
import { initializeBookmarkEvents } from './bookmarkEvents'
import { initializeVideoEvents } from './videoEvents'
const io = require('socket.io-client');
const socket = io("ws://127.0.0.1:3001/tv", {
  reconnectionDelayMax: 3000,
  transports: ['websocket']
});
socket.on('error', (e) => console.log(e))

initializeTabEvents(socket)
initializeBookmarkEvents(socket)
initializeVideoEvents(socket)