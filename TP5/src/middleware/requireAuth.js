import jwt from "jsonwebtoken";

const requireAuth  =  (req, res, next) => {
    const authHeader = req.headers.authorization;
    // Header absent ou mal formé
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token manquant" });
    }

    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // Renseigne req.user avec les infos du token
        req.user = { id: payload.id, email: payload.email };

        next();
    } catch (err) {
        return res.status(401).json({ message: "Token invalide ou expiré" });
    }
};

export default requireAuth;
 