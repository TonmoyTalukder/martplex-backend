import cron from 'node-cron';
import prisma from './prisma';

const incrementDay = async () => {
  const dayCount = await prisma.dayCount.findFirst();

  if (!dayCount) {
    // If no record exists, create the initial record
    await prisma.dayCount.create({
      data: { day: 1 },
    });
    console.log('DayCount initialized with day = 1.');
  } else {
    // Increment the day field by 1
    await prisma.dayCount.update({
      where: { id: dayCount.id },
      data: { day: dayCount.day + 1 },
    });
    console.log(`DayCount updated to day = ${dayCount.day + 1}.`);
  }
};

const deleteOldCarts = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return await prisma.cart.deleteMany({
    where: { createdAt: { lt: thirtyDaysAgo } },
  });
};

const deleteExpiredCoupons = async () => {
  // const thirtyDaysAgo = new Date();
  // thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // return await prisma.coupon.deleteMany({
  //   where: { expiresAt: { lt: thirtyDaysAgo } },
  // });

  const now = new Date();

  try {
    const result = await prisma.coupon.deleteMany({
      where: { expiresAt: { lt: now } }, // Delete coupons where expiresAt is earlier than now
    });

    console.log(`${result.count} expired coupons have been deleted.`);
  } catch (error) {
    console.error('Failed to delete expired coupons:', error);
  }
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

const expireFlashSales = async () => {
  const now = new Date();

  // Find all expired flash sales
  const expiredSales = await prisma.flashSale.findMany({
    where: { endsAt: { lt: now }, isActive: true },
  });

  for (const sale of expiredSales) {
    // Mark the flash sale as inactive
    await prisma.flashSale.update({
      where: { id: sale.id },
      data: { isActive: false },
    });

    // Update associated products
    await prisma.product.updateMany({
      where: { flashSaleId: sale.id },
      data: { flashSale: false },
    });
  }
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

export const scheduleJobs = () => {
  cron.schedule('0 0 * * *', async () => {
    const now = new Date().toISOString();
    console.log(`[${now}] Starting scheduled cleanup task...`);

    try {
      // Increment the day count
      await withRetries(async () => {
        await incrementDay();
        console.log('DayCount incremented successfully.');
      });

      // Delete expired flash sales
      await withRetries(async () => {
        await expireFlashSales();
        console.log(`Expired flash sales have been deleted.`);
      });

      // Delete expired coupons
      await withRetries(async () => {
        await deleteExpiredCoupons();
        console.log(`Expired coupons have been deleted.`);
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
};
