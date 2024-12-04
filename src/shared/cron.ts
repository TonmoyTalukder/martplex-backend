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

const deleteExpiredCoupons = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return await prisma.coupon.deleteMany({
    where: { expiresAt: { lt: thirtyDaysAgo } },
  });
};

const updateFlashSaleStatus = async () => {
  const currentDate = new Date();

  // Update FlashSales: Disable sales that haven't started and enable the ones that have started
  const flashSalesToUpdate = await prisma.flashSale.findMany({
    where: {
      OR: [
        { startsAt: { gt: currentDate }, isActive: true },
        { endsAt: { lt: currentDate }, isActive: true },
      ],
    },
  });

  const flashSaleUpdates = flashSalesToUpdate.map((flashSale) => {
    let updateData: any = {};
    if (flashSale.startsAt > currentDate) {
      updateData.isActive = false; // Set to inactive if the sale hasn't started
    }
    if (flashSale.endsAt < currentDate) {
      updateData.isActive = false; // Set to inactive if the sale has ended
    }

    return prisma.flashSale.update({
      where: { id: flashSale.id },
      data: updateData,
    });
  });

  await Promise.all(flashSaleUpdates);
};

cron.schedule('0 0 * * *', async () => {
  const now = new Date().toISOString();
  console.log(`[${now}] Starting scheduled cleanup task...`);

  try {
    // Delete old carts
    await withRetries(async () => {
      const result = await deleteOldCarts();
      console.log(
        `${result.count} carts older than 30 days have been deleted.`,
      );
    });

    // Delete expired coupons
    await withRetries(async () => {
      const result = await deleteExpiredCoupons();
      console.log(`${result.count} expired coupons have been deleted.`);
    });

    // Update flash sale status
    await withRetries(async () => {
      await updateFlashSaleStatus();
      console.log('FlashSale status updated successfully.');
    });
  } catch (error) {
    console.error('Error deleting junks:', error);
  }
});
