import * as Joi from "joi"

export default Joi.object({
    NODE_ENV: Joi.string()
        .valid("development", "test", "production", "staging")
        .default("development"),
    DB_PORT: Joi.number().port().default(5432),
    DB_PASSWORD: Joi.string().required(),
    DB_DATABASE_NAME: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_USERNAME: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_TOKEN_AUDIENCE: Joi.string().required(),
    JWT_TOKEN_ISSUER: Joi.string().required(),
    JWT_ACCESS_TOKEN_TTL: Joi.number().required(),
    JWT_REFRESH_TOKEN_TTL: Joi.number().required(),
    API_VERSION: Joi.string().required(),
    AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
    AWS_ACCESS_KEY_ID: Joi.string().required(),
    AWS_SECRET_KEY: Joi.string().required(),
    AWS_REGION: Joi.string().required(),
    AWS_CLOUDFRONT_URL: Joi.string().required(),
    MAIL_HOST: Joi.string().required(),
    SMTP_USERNAME: Joi.string().required(),
    SMTP_PASSWORD: Joi.string().required(),
})