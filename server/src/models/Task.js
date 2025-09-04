import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    completed: { type: Boolean, default: false, index: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium', index: true },
    tags: [{ type: String, trim: true, lowercase: true, index: true }],
    dueDate: { type: Date },
  },
  { timestamps: true }
);

taskSchema.index({ title: 'text', description: 'text', tags: 'text' });

const Task = mongoose.model('Task', taskSchema);
export default Task;


