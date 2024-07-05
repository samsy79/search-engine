import dotenv from 'dotenv';
import OpenAi from 'openai';

dotenv.config();

export const openai = new OpenAi({
    apiKey: process.env.OPENAI_API_KEY,
});
