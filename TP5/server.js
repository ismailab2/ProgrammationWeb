import express from 'express';
import connectDB from './src/config/db.js';
import routes from './src/routes/index.js';
import swaggerJsDoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Contact REST API',
            description: "A REST API built with Express and MongoDB.",
            version: '0.1',
        },
        servers: [
            {
                url: 'http://localhost:5000/api',
                description: 'Development server',
            },
        ],
    },
    apis: ["./src/routes/*.js"],
}

const openapiSpecification = swaggerJsDoc(options);

process.loadEnvFile();

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use('/docs', serve, setup(openapiSpecification));

// Routes de l'API
app.use('/api', routes);

// Route d'accueil
app.get('/', (req, res) => {
    res.json({
        message: 'Mon API REST fonctionne !',
        status: 'OK'
    });
});

// Démarrer le serveur après la connexion à MongoDB
try {
    await connectDB();

    app.listen(port, host, () => {
        console.log(`API disponible sur http://${host}:${port}`);
    });
} catch (err) {
    console.error('Impossible de démarrer le serveur :', err);
    process.exit(1);
}
