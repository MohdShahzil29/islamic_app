import { createClient } from 'redis';

type RedisClientType = ReturnType<typeof createClient>;

const redisClient: RedisClientType = createClient({
  url: 'rediss://red-cv1vnq56l47c73fjjhfg:GnTfBkDF9Euef9AJjvUsnIWSCIOTslQ9@oregon-keyvalue.render.com:6379'
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