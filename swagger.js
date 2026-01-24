const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Personal Library API',
    description: 'Books and Notes CRUD API'
  },
  host: 'localhost:3000',
  schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
