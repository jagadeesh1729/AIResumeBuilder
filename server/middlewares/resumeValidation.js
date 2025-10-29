import { body, validationResult } from 'express-validator';

export const validateResume = [
    body('personal_info.full_name').notEmpty().withMessage('Full name is required'),
    body('personal_info.email').isEmail().withMessage('Email is invalid'),
    body('experience.*.company').notEmpty().withMessage('Company name is required'),
    body('experience.*.position').notEmpty().withMessage('Position is required'),
    body('education.*.institution').notEmpty().withMessage('Institution is required'),
    body('education.*.degree').notEmpty().withMessage('Degree is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
