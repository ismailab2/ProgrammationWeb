
import { Schema, model } from 'mongoose';

const contactSchema = new Schema({
    name: { type: String },
    age: { type: Number }
    },
    {
        versionKey: false
    });

export default model('Contact', contactSchema);
