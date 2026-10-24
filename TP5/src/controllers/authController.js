import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Crée un utilisateur et renvoie son identifiant et son email
export const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.create({ email, password });
        res.status(201).json({ id: user._id, email: user.email });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: "Email déjà utilisé" });
        }
        res.status(400).json({ message: err.message });
    }
};

// Vérifie les identifiants et génère un JWT
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Identifiants invalides" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Identifiants invalides" });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
};