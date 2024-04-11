import 'dotenv/config';
import * as joi from 'joi';

interface EnvsVars {
  PORT: number;
  DATABASE_URL: string;
}

const { error, value } = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
  })
  .unknown(true)
  .validate(process.env);

if (error) {
  throw new Error(`Enviroments validation error: ${error}`);
}

const envsVars: EnvsVars = value;

export const enviroments = {
  port: envsVars.PORT,
  databaseUrl: envsVars.DATABASE_URL,
};
