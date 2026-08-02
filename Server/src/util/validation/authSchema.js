import Joi from 'joi';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

export const registerSchema = Joi.object({
    firstName: Joi.string().min(2).max(30).trim().required()
        .messages({
            'string.min': 'First name must be at least 2 characters',
            'string.max': 'First name must be at most 30 characters',
            'any.required': 'First name is required',
        }),
    lastName: Joi.string().min(2).max(30).trim().required()
        .messages({
            'string.min': 'Last name must be at least 2 characters',
            'string.max': 'Last name must be at most 30 characters',
            'any.required': 'Last name is required',
        }),
    email: Joi.string().email().required().pattern(emailRegex)
        .messages({
            'string.email': 'Please enter a valid email address',
            'string.pattern.base': 'Please enter a valid email address',
            'any.required': 'Email is required',
        }),
    password: Joi.string().min(6).required().pattern(passwordRegex)
        .messages({
            'string.min': 'Password must be at least 6 characters',
            'string.pattern.base': 'Password must include uppercase, lowercase, number, and special character (@$!%*?&)',
            'any.required': 'Password is required',
        }),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required().pattern(emailRegex),
    password: Joi.string().min(6).required().pattern(passwordRegex)
        .messages({
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        }),
});
