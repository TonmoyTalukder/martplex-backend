import { join } from 'path';
import { verifyAamarPayment } from './aamarpay.utils';
import { readFileSync } from 'fs';
import { paymentService } from '../Payment/payment.service';
import { PaymentStatus } from '@prisma/client';

const confirmationService = async (
  transactionId: string,
  status: string,
  paymentId: string,
) => {
  const verifyResponse = await verifyAamarPayment(transactionId);

  let message = '';

  if (verifyResponse && verifyResponse.pay_status === 'Successful') {
    await paymentService.updatePaymentStatus(
      paymentId,
      PaymentStatus.SUCCESS,
      transactionId,
    );
    
    message = 'Successfully Paid!';
  } else {
    await paymentService.updatePaymentStatus(paymentId, PaymentStatus.FAILED);
    message = 'Payment Failed!';
  }

  const filePath = join(__dirname, '../../../views/confirmation.html');

  let template = readFileSync(filePath, 'utf-8');

  template = template.replace('{{message}}', message);
  console.log(status);

  return template;
};

export const aamarpayServices = {
  confirmationService,
};
