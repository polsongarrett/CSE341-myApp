const fs = require('fs');     // imported for writing files 

const requestHandler = (request, response) => {
  const url = request.url;
  const method = request.method;

  if(url === '/') {
    response.write('<html>');
    response.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
    response.write('</html>');
    return response.end();
  } 
  if(url === '/message' && method === 'POST') {
  
    // The following code is for retrieving data from a response. 
    //   In this case, it is for capturing data from an input.
    const body = [];  
  
    request.on('data', (chunk) => { // 'chunk' is a chunk of data in the data stream.
      body.push(chunk);
    });
  
    return request.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1]; 
      fs.writeFile('message.txt', message, (err) => {
        response.statusCode = 302;
        response.setHeader('Location', '/');
        return response.end();
      });
    });
    // The previous code of for retrieing data from a response.
  }
  
  response.setHeader('Content-Type', 'text/html');
  response.write('<html>');
  response.write('<body><h1>Hello World</h1></body>');
  response.write('</html>');
  response.end();
}

module.exports = requestHandler;


// ALSO VIABLE CODE 
// exports.handler = requestHandler;
// exports.someText = 'Some text.';

// module.exports.handler = requestHandler;
// module.exports.someText = 'Some text.';

// module.exports = {
//   handler: requestHandler,
//   someText: 'Some text.'
// }