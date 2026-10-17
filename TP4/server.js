import express  from 'express';

process.loadEnvFile();

const host = process.env.HOST;
const port = process.env.PORT;

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
    message: "Mon API REST fonctionne !",
    status: "OK"
  });
});


app.listen(port, () => {
    console.log(`API disponible sur http://${host}:${port}`);
});