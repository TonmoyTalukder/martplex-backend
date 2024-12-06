import { Request, Response } from 'express';
import { aamarpayServices } from './aamarpay.service';

const confirmationController = async (req: Request, res: Response) => {
  const { transactionId, status, paymentId } = req.query;
  const result = await aamarpayServices.confirmationService(
    transactionId as string,
    status as string,
    paymentId as string,
  );

  res.send(result);
};

export const aamarpayController = {
  confirmationController,
};
