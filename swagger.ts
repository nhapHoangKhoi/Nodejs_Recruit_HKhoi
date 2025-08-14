import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'My API',
    description: 'API documentation'
  },
  host: `localhost:${process.env.PORT || 4000}`,
  schemes: ['http'],
};

const outputFile = './swagger_output.json';
const endpointsFiles = [
  // './routes/admin/index.route.ts',
  './routes/**/index.route.ts',
];

swaggerAutogen()(outputFile, endpointsFiles, doc);