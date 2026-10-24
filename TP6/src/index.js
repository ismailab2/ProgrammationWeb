import express from 'express';

const app = express();
const PORT = 80;

app.get('/', (req, res) => {
    res.send("bonjour, c'est moi Ismail !");
});

app.listen(PORT, () => {
    console.log(` server is running on port ${PORT}`);
});
