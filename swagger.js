const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Personal Library API',
    description: 'Books and Notes CRUD API'
  },
  host: 'se341-project-2-dkb3.onrender.com',
  schemes: ['https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
