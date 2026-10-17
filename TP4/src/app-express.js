import express  from 'express';
import morgan from 'morgan';
import { getAllContacts, getContact, addContact, updateContact, deleteContact } from './mongo.js';
import { ObjectId } from 'mongodb';

process.loadEnvFile();
const host = process.env.HOST;
const port = process.env.PORT;
const app = express();
app.use(morgan('combined'));
app.set('view engine', 'ejs');
app.use(express.json());

app.get('/contacts', async (req, res) => {
    try {
        const contact = await getAllContacts();
        res.json(contact);
    } catch (e) {
        res.status(500).json({
            error: 'Erreur serveur'
        });        
    }
});

app.get('/contacts/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                error: 'ID invalide'
            });
        }

        const contact = await getContact(id);
        if (!contact) {
            return res.status(404).json({
                error: 'Contact introuvable'
            });
        }
        res.json(contact);
    } catch (e) {
        res.status(500).json({
            error: 'Erreur serveur'
        });        
    }
});


app.post('/contacts', async (req, res) => {
    try {
        const { name, age } = req.body;
        if (typeof name !== 'string' || name.trim() === '' || !Number.isInteger(age) || age < 0) {
            return res.status(400).json({
                error: 'Un nom non vide et un âge entier positif sont requis'
            });
        }
        const contact = await addContact({ name: name.trim(), age });
        res.status(201).json(contact);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.put('/contacts/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID invalide' });
        }
        const { name, age } = req.body;
        if (typeof name !== 'string' || name.trim() === '' || !Number.isInteger(age) || age < 0) {
            return res.status(400).json({
                error: 'Un nom non vide et un âge entier positif sont requis'
            });
        }
        const contact = await updateContact(id, {
            name: name.trim(),
            age
        });

        if (!contact) {
            return res.status(404).json({ error: 'Contact introuvable' });
        }

        res.json(contact);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.delete('/contacts/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'ID invalide' });
        }

        const contact = await deleteContact(id);

        if (!contact) {
            return res.status(404).json({ error: 'Contact introuvable' });
        }

        res.json(contact);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});



app.get('/', (req, res) =>{
    res.send('Hello !')
});

app.get('/user/:uid', (req, res) =>{
    res.render('user', {uid: req.params.uid});
});

app.use( (req, res) =>{
    res.status(404).send('Page introuvable !');
});

app.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`)
});