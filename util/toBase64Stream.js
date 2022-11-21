const { Base64Encode} = require('base64-stream');
const concat = require('concat-stream');
  
const streamToBase64 = (stream) => new Promise((resolve, reject) => {
    const cbConcat = (base64) => {
      resolve(base64);
    };
    stream
      .pipe(new Base64Encode())
      .pipe(concat(cbConcat))
      .on('error', (error) => {
        reject(error);
      });
  });

  module.exports.streamToBase64 = streamToBase64;