import { Router } from 'express';
import { body, param } from 'express-validator';
import { authRequired } from '../middleware/auth.js';
import { createTask, deleteTask, getTask, listTasks, updateTask } from '../controllers/task.controller.js';

const router = Router();

router.use(authRequired);

router.get('/', listTasks);

router.post(
  '/',
  [
    body('title').isString().isLength({ min: 1 }).withMessage('Title is required'),
    body('description').optional().isString(),
    body('completed').optional().isBoolean(),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('tags').optional().isArray(),
    body('dueDate').optional().isISO8601().toDate(),
  ],
  createTask
);

router.get('/:id', [param('id').isMongoId()], getTask);

router.put(
  '/:id',
  [
    param('id').isMongoId(),
    body('title').optional().isString().isLength({ min: 1 }),
    body('description').optional().isString(),
    body('completed').optional().isBoolean(),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('tags').optional().isArray(),
    body('dueDate').optional().isISO8601().toDate(),
  ],
  updateTask
);

router.delete('/:id', [param('id').isMongoId()], deleteTask);

export default router;


