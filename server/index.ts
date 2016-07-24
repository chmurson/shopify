console.log("hello world");
/// <reference path='typings/index.d.ts' />
import * as http from 'http';
import application from './application';

import './routes/index';
import './routes/order';
import './routes/order-creation';
import './routes/order-payu-end';
import './routes/order-payu-notification';
import './routes/order-payu-update';
import './routes/order-payu-start';

const server = http.createServer(application);
const port = process.env.PORT || 8082;
server.listen(port, ()=> {
  application.set('port', port);
});

server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error):void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}

