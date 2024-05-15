import 'dotenv/config';
import * as joi from 'joi';

interface EnvsVars {
  PORT: number;
  DATABASE_URL: string;
  NATS_SERVERS: string[];
}

const { error, value } = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    NATS_SERVERS: joi.array().items(joi.string()).required(),
  })
  .unknown(true)
  .validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(','),
  });

if (error) {
  throw new Error(`Enviroments validation error: ${error}`);
}

const envsVars: EnvsVars = value;

export const envs = {
  port: envsVars.PORT,
  databaseUrl: envsVars.DATABASE_URL,
  natsServers: envsVars.NATS_SERVERS,
};
