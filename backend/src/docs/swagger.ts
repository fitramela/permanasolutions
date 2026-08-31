import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Backend API',
      version: '1.0.0',
      description: 'REST API Documentation',
    },
    servers: [
      {
        url: process.env.APP_URL || 'http://localhost:4000',
        description: 'Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // ✅ Gunakan pattern yang lebih spesifik
  apis: [
    './src/routes/*.js',   
    './src/routes/*.ts',   
    './src/routes/**/*.js',
    './src/routes/**/*.ts',
  ],
};

export const swaggerSpec = swaggerJSDoc(options);