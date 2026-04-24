import { 
  doc, 
  runTransaction, 
  serverTimestamp, 
  collection,
  addDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Handles the logic when a payment (e.g., a deposit or purchase) is successful.
 * Calculates referral commission if applicable.
 * 
 * @param uid - The ID of the user who made the payment.
 * @param amount - The total order/payment amount.
 * @param orderId - The unique ID for the payment/order for tracking.
 */
export async function handlePaymentSuccess(uid: string, amount: number, orderId: string) {
  try {
    await runTransaction(db, async (transaction) => {
      // 1. Get the current user's profile to find the referrer
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await transaction.get(userDocRef);

      if (!userDoc.exists()) {
        throw new Error("User does not exist!");
      }

      const userData = userDoc.data();
      const referrerId = userData.referrer_id;

      // 2. If a referrer exists, process the 10% commission
      if (referrerId) {
        const commissionAmount = amount * 0.10;
        const referrerDocRef = doc(db, 'users', referrerId);
        const referrerDoc = await transaction.get(referrerDocRef);

        if (referrerDoc.exists()) {
          const referrerData = referrerDoc.data();
          const currentBalance = referrerData.balance || 0;
          const newBalance = currentBalance + commissionAmount;

          // 3. Update the referrer's balance
          transaction.update(referrerDocRef, { balance: newBalance });

          // 4. Create a commission transaction record
          // Note: In a real transaction, we want this to be atomic. 
          // Since we are inside a transaction, these operations are atomic.
          const txRef = doc(collection(db, 'transactions'));
          transaction.set(txRef, {
            uid: referrerId,
            type: 'commission',
            amount: commissionAmount,
            status: 'completed',
            order_id: orderId,
            source_uid: uid,
            referrer_id: referrerId, // Also record who can see this (the earner)
            timestamp: serverTimestamp()
          });

          console.log(`Commission of ${commissionAmount} credited to referrer ${referrerId}`);
        } else {
          console.warn(`Referrer ${referrerId} not found, skipping commission.`);
        }
      }

      // 5. Update the user's own status or record (optional, e.g., mark order as paid)
      // For this task, we focus on the referral commission.
    });

    return { success: true };
  } catch (error) {
    console.error("Payment success processing failed:", error);
    throw error;
  }
}
