/* import { openai } from "./openai"

export const vectorize = async (input: string): Promise<number[]> => {

    const embeddingResponse = await openai.embeddings.create({
             input,
         model:'text-embedding-ada-002' })

    const vector = embeddingResponse.data[0].embedding
     
    return vector
} */




import crypto from 'crypto';

export const vectorize = async (input: string): Promise<number[]> => {
  // Create a hash of the input string
  const hash = crypto.createHash('sha256').update(input).digest('hex');

  // Convert the hash to an array of numbers with the required dimension
  const vector = [];
  while (vector.length < 1536) {
    for (let i = 0; i < hash.length; i += 4) {
      if (vector.length < 1536) {
        vector.push(parseInt(hash.slice(i, i + 4), 16));
      }
    }
  }

  return vector;
}
