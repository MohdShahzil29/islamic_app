import { createClient } from 'redis';

type RedisClientType = ReturnType<typeof createClient>;

const redisClient: RedisClientType = createClient({
  url: 'redis://red-cv1vnq56l47c73fjjhfg:6379'
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
