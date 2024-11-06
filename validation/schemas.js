const { z } = require('zod');

const registerSchema = z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(6),
  isAdmin: z.boolean().optional()
});

const loginSchema = z.object({
  username: z.string(),
  password: z.string()
});

const assignmentSchema = z.object({
  task: z.string().min(1),
  admin: z.string()
});

module.exports = {
  registerSchema,
  loginSchema,
  assignmentSchema
};