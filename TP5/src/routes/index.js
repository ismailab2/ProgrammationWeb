import { Router } from 'express';
import { getAllContacts, getContactById, updateContact, removeContact, addContact } from '../controllers/contactControllers.js';
import { register, login } from '../controllers/authController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = Router();

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     AuthCredentials:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           example: alice@example.com
 *         password:
 *           type: string
 *           example: monMotDePasse123
 *     Contact:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Ismail
 *         age:
 *           type: integer
 *           example: 25
 */

// Vérifier que l'API fonctionne
router.get('/', (req, res) => {
    res.status(200).json({
        status: 'API is Working',
        message: 'Welcome!'
    });
});

// Routes publiques d'authentification
/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     description: Create a new user (public route)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthCredentials'
 *     responses:
 *       '201':
 *         description: User created, returns its id and email
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *       '400':
 *         description: Invalid data
 *       '409':
 *         description: Email already used
 */
router.post('/auth/register', register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     description: Check credentials and return a JWT (public route)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthCredentials'
 *     responses:
 *       '200':
 *         description: Returns the JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       '401':
 *         description: Invalid credentials
 */
router.post('/auth/login', login);

// Récupérer tous les contacts
/**
 * @openapi
 * /contacts:
 *   get:
 *     tags: [Contacts]
 *     description: All contacts (requires header Authorization Bearer token)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Returns all the contacts
 *       '401':
 *         description: Missing or invalid token
 */
router.get('/contacts', requireAuth, async (req, res) => {
    const response = await getAllContacts();
    res.status(response.success ? 200 : 500).json(response);
});

// Récupérer un contact par son ID
/**
 * @openapi
 * /contacts/{id}:
 *   get:
 *     tags: [Contacts]
 *     description: One contact by id (requires header Authorization Bearer token)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Returns the contact
 *       '401':
 *         description: Missing or invalid token
 *       '404':
 *         description: Contact not found
 */
router.get('/contacts/:id', requireAuth, async (req, res) => {
    const response = await getContactById(req.params.id);
    res.status(
        response.success ? 200 :
        response.message === 'Contact not found' ? 404 : 400
    ).json(response);
});

// Ajouter un contact
/**
 * @openapi
 * /contacts:
 *   post:
 *     tags: [Contacts]
 *     description: Add a contact (requires header Authorization Bearer token)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       '201':
 *         description: Contact created
 *       '400':
 *         description: Invalid data
 *       '401':
 *         description: Missing or invalid token
 */
router.post('/contacts', requireAuth, async (req, res) => {
    const response = await addContact(req.body);

    res.status(response.success ? 201 : 400).json(response);
});

// Modifier un contact
/**
 * @openapi
 * /contacts/{id}:
 *   patch:
 *     tags: [Contacts]
 *     description: Update a contact (requires header Authorization Bearer token)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       '200':
 *         description: Contact updated
 *       '400':
 *         description: Invalid data
 *       '401':
 *         description: Missing or invalid token
 *       '404':
 *         description: Contact not found
 */
router.patch('/contacts/:id', requireAuth, async (req, res) => {
    const { name, age } = req.body;

    const response = await updateContact(
        req.params.id,
        name ?? null,
        age ?? null
    );

    res.status(
        response.success ? 200 :
        response.message === 'Contact not found' ? 404 : 400
    ).json(response);
});

/**
 * @openapi
 * /contacts/{id}:
 *   put:
 *     tags: [Contacts]
 *     description: Update a contact (requires header Authorization Bearer token)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       '200':
 *         description: Contact updated
 *       '400':
 *         description: Invalid data
 *       '401':
 *         description: Missing or invalid token
 *       '404':
 *         description: Contact not found
 */
router.put('/contacts/:id', requireAuth, async (req, res) => {
    const { name, age } = req.body;
    const response = await updateContact(
        req.params.id,
        name ?? null,
        age ?? null
    );

    res.status(
        response.success ? 200 :
        response.message === 'Contact not found' ? 404 : 400
    ).json(response);
});

// Supprimer un contact
/**
 * @openapi
 * /contacts/{id}:
 *   delete:
 *     tags: [Contacts]
 *     description: Delete a contact (requires header Authorization Bearer token)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Contact deleted
 *       '401':
 *         description: Missing or invalid token
 *       '404':
 *         description: Contact not found
 */
router.delete('/contacts/:id', requireAuth, async (req, res) => {
    const response = await removeContact(req.params.id);

    res.status(
        response.success ? 200 :
        response.message === 'Contact not found' ? 404 : 400
    ).json(response);
});

export default router;