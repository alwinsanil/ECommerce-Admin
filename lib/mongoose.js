import mongoose from 'mongoose';


const MONGODB_URI = process.env.MONGODB_URI;

export default async function mongooseConnect() {
    if (mongoose.connections[0].readyState) {
        return mongoose.connection.asPromise();
    } else {
        return mongoose.connect(MONGODB_URI);
    }
}