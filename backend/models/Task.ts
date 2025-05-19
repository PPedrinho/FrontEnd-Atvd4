import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  completed: boolean;
  user: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Por favor, adicione um título para a tarefa'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;
