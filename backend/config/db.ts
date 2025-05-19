import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || '');
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    process.exit(1);
  }
};

export default connectDB;
