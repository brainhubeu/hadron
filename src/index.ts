import "./init";
import ConvertToExpress from './ConvertToExpress';
import { Router } from "express";
import * as express from 'express';
const router = express.Router();

/*
import BF from 'brainhub-framework';
BF.configureApp()
*/
// following is a simple http server to show that configuration works, can be removed at any time
import * as http from "http";

import app from "example/app";

import bf from "brainhub-framework";

const server = http.createServer((request, response) => response.end(JSON.stringify(app())));

const port = process.env.PORT || 8080;



const expressApp = express();

ConvertToExpress(expressApp);
expressApp.listen(port);
//
// expressApp.get('/index', function (req, res) {
//     res.send('GET request to the homepage')
// });

// server.listen(port, (err: Error) => {
//   const router = Router();
//
//   if (err) {
//     return console.log("Failed", err);
//   }
//
//   // checking if server is listening on correct port
//   if (!server.address()) {
//     return console.error(`
//       App started but it doesn't seem to listen on any port.
//       Check if port ${port} is not already used.
//     `);
//   }
//
//
//
//   console.log(`Server is listening on ${port}`);
// });
