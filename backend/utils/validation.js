const Joi = require('joi');

const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        role: Joi.string(), // Optional
    });
    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data);
};

const playerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(2).required(),
        role: Joi.string().required(),
        bio: Joi.string().required(),
        // Image is handled separately via multer
    });
    return schema.validate(data);
};

module.exports = {
    registerValidation,
    loginValidation,
    playerValidation
};
