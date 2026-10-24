import { connect, disconnect } from 'mongoose';
import { config } from 'dotenv';

config();

async function connectDB() {
    try {
        console.log("Opening connection");
        const conn = await connect(process.env.MONGO_URI + '/' + process.env.DB_NAME);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (e) {
        await disconnect();
        console.error(e);
        process.exit(1);
    }
}

export default connectDB;