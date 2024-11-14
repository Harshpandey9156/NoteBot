import { PineconeClient } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

dotenv.config();

export const getPineconeClient = async () => {
  const maxRetries = 3;
  let attempt = 0;

  // Initialize Pinecone Client
  const client = new PineconeClient();

  // Ensure the API key is available
  const apiKey = process.env.PINECONE_API_KEY;
  if (!apiKey) {
    console.error('Error: Pinecone API key is missing in environment variables');
    throw new Error('Pinecone API key is missing in environment variables');
  }

  while (attempt < maxRetries) {
    try {
      console.log(`Attempting to initialize Pinecone client (Attempt ${attempt + 1})`);

      // Initialize Pinecone client with API key and environment
      await client.init({
        apiKey,
        environment: 'us-east-1', // Ensure this is correct for your Pinecone project
      });

      console.log('Pinecone client initialized successfully');
      return client;

    } catch (error) {
      attempt++;
      console.error(`Error initializing Pinecone client on attempt ${attempt}:`, error);

      if (attempt >= maxRetries) {
        console.error('Max retries reached. Failed to initialize Pinecone client.');
        throw error;
      }

      // Optional: Wait for a short time before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};
