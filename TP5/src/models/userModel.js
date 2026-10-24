import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// hachage du mot de passe avant l'enregistrement
userSchema.pre('save', async function () {
    //ne pas re-hacher si mot de passe n'a pas changer
    if(!this.isModified("password")){
        return;
    }
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);   
});

// Compare un mot de passe fourni avec celui stocké
userSchema.methods.comparePassword = function(candidatePassword){
    return bcrypt.compare(candidatePassword, this.password);
};

export default model("User", userSchema);