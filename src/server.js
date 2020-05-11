import sirv from 'sirv';
import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';

const app = express();
const server = require('http').Server(app);
var io = require('socket.io')(server);

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
		compression({ threshold: 0 }),
		sirv('static', { dev }),
		sapper.middleware()
	);

server.listen(PORT, err => {
		if (err) console.log('error', err);
	});

let usercount = 0;
let messages = [];

io.on('connection', (socket)=>{

})