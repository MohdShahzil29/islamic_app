import { createClient } from 'redis';

type RedisClientType = ReturnType<typeof createClient>;

const redisClient: RedisClientType = createClient({
<<<<<<< HEAD
  url: 'rediss://red-cv1vnq56l47c73fjjhfg:GnTfBkDF9Euef9AJjvUsnIWSCIOTslQ9@oregon-keyvalue.render.com:6379'
=======
  url: 'redis://red-cv1vnq56l47c73fjjhfg:6379'
>>>>>>> ff640c62dced15cac3fe45610a5e339cd8111d9d
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Error connecting to Redis:', error);
  }
})();

export default redisClient;
