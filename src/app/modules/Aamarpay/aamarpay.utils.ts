/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import config from '../../config';

export const initiateAamarPayment = async (paymentData: any) => {
  try {
    const response = await axios.post(config.payment.baseURL!, {
      store_id: config.payment.storeID,
      signature_key: config.payment.signatureKey,
      tran_id: paymentData.transactionId,
      success_url: `https://martplex-backend.vercel.app/api/payment/confirmation?transactionId=${paymentData.transactionId}&status=success$paymentId=${paymentData.paymentId}`,
      fail_url: `https://martplex-backend.vercel.app/api/payment/confirmation?status=failed`,
      cancel_url: 'https://martplex.vercel.app/',
      amount: paymentData.amount,
      currency: 'BDT',
      desc: 'Merchant Registration Payment',
      cus_name: paymentData.customerName,
      cus_email: paymentData.customerEmail,
      cus_add1: paymentData.customerAddress,
      cus_add2: 'N/A',
      cus_city: 'N/A',
      cus_state: 'N/A',
      cus_postcode: 'N/A',
      cus_country: 'N/A',
      cus_phone: paymentData.customerPhone,
      type: 'json',
    });

    return response.data;
  } catch (err) {
    console.log('err from paymentUtils: => ', err);
    throw new Error('Payment initiation failed!');
  }
};

export const verifyAamarPayment = async (tnxId: string) => {
  try {
    const response = await axios.get(config.payment.paymentVerifyURL!, {
      params: {
        store_id: config.payment.storeID,
        signature_key: config.payment.signatureKey,
        type: 'json',
        request_id: tnxId,
      },
    });

    return response.data;
  } catch (err) {
    throw new Error('Payment validation failed!');
  }
};
