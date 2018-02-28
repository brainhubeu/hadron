import './init';

/*
import BF from 'brainhub-framework';
BF.configureApp()
*/

// following is a simple http server to show that configuration works, can be removed at any time
import http from 'http';
console.dir(process.env);
// import app from 'example/app';
//
// const server = http.createServer((request, response) => response.end(JSON.stringify(app())));
//
// const port = process.env.PORT || 8080;
//
// server.listen(port, err => {
//   if (err) {
//     return console.log('Failed', err);
//   }
//
//   checking if server is listening on correct port
  // if (!server.address()) {
  //   return console.error(`App started but it doesn't seem to listen on any port. Check if port ${port} is not already used.`);
  // }
  //
  // console.log(`Server is listening on ${port}`);
// });
