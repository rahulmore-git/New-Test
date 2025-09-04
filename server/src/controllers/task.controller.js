import { validationResult } from 'express-validator';
import Task from '../models/Task.js';
import { createHttpError } from '../utils/error.js';

export async function createTask(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(createHttpError(400, errors.array()[0].msg));
    const task = await Task.create({ ...req.body, user: req.user.id });
    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
}

export async function listTasks(req, res, next) {
  try {
    const { q, completed, priority, tags, sort = '-createdAt', page = 1, limit = 20 } = req.query;
    const filter = { user: req.user.id };
    if (completed !== undefined) filter.completed = completed === 'true';
    if (priority) filter.priority = priority;
    if (tags) filter.tags = { $in: tags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean) };
    if (q) filter.$text = { $search: q };

    const skip = (Number(page) - 1) * Number(limit);

    const [tasks, total] = await Promise.all([
      Task.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Task.countDocuments(filter),
    ]);
    res.json({ tasks, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
}

export async function getTask(req, res, next) {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id, user: req.user.id });
    if (!task) return next(createHttpError(404, 'Task not found'));
    res.json({ task });
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(createHttpError(400, errors.array()[0].msg));

    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { $set: req.body },
      { new: true }
    );
    if (!task) return next(createHttpError(404, 'Task not found'));
    res.json({ task });
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });
    if (!task) return next(createHttpError(404, 'Task not found'));
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}


