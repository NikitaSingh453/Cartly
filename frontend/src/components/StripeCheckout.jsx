import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { api } from '../api';

const CARD_STYLE = {
  style: {
    base: {
      color: '#e5e7eb',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '15px',
      fontSmoothing: 'antialiased',
      '::placeholder': { color: '#6b7280' },
    },
    invalid: { color: '#ef4444', iconColor: '#ef4444' },
  },
};

export default function StripeCheckout({ clientSecret, orderId, amount, onSuccess, onError }) {
  const stripe   = useStripe();
  const elements = useElements();
  const [paying, setPaying]     = useState(false);
  const [cardError, setCardError] = useState('');

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setPaying(true);
    setCardError('');

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) },
    });

    if (result.error) {
      setCardError(result.error.message);
      setPaying(false);
    } else if (result.paymentIntent.status === 'succeeded') {
      try {
        await api.post('/payments', {
          orderId,
          method: 'CARD',
          amount,
          transactionRef: result.paymentIntent.id,
        });
        onSuccess();
      } catch (err) {
        onError(err.message);
        setPaying(false);
      }
    }
  };

  return (
    <form className="stripe-form" onSubmit={handlePay}>
      <p className="stripe-label">Card details</p>
      <div className="stripe-card-wrap">
        <CardElement options={CARD_STYLE} />
      </div>
      <p className="stripe-test-hint">
        🧪 Test card: <code>4242 4242 4242 4242</code> · Any future date · Any CVC
      </p>
      {cardError && <p className="form-error">{cardError}</p>}
      <button type="submit" className="btn-primary full-width" disabled={paying || !stripe}>
        {paying ? 'Processing…' : `Pay ₹${Number(amount).toLocaleString('en-IN')}`}
      </button>
    </form>
  );
}
