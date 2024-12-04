import cron from 'node-cron';
import prisma from './prisma';

const deleteOldCarts = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return await prisma.cart.deleteMany({
    where: { createdAt: { lt: thirtyDaysAgo } },
  });
};

async function withRetries<T>(task: () => Promise<T>, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await task();
    } catch (error) {
      if (attempt === retries) throw error;
      console.warn(`Retry ${attempt} failed, retrying...`);
    }
  }
}

cron.schedule('0 0 * * *', async () => {
  const now = new Date().toISOString();
  console.log(`[${now}] Starting scheduled cleanup task...`);

  try {
    withRetries(async () => {
      const result = await deleteOldCarts();
      console.log(
        `${result.count} carts older than 30 days have been deleted.`,
      );
    });
  } catch (error) {
    console.error('Error deleting junks:', error);
  }
});
