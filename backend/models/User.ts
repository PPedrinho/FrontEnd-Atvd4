import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Por favor, adicione um nome']
    },
    email: {
      type: String,
      required: [true, 'Por favor, adicione um email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Por favor, adicione um email válido'
      ]
    },
    password: {
      type: String,
      required: [true, 'Por favor, adicione uma senha'],
      minlength: 6
    }
  },
  {
    timestamps: true
  }
);

// Criptografar senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

// Método para verificar senha
userSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password as string);
};

const User = mongoose.model<IUser>('User', userSchema);

export default User;
