import styled from 'styled-components';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe, StripeError } from '@stripe/stripe-js';
import SickButton from '../styles/SickButton';
import { useState } from 'react';
import nprogress from 'nprogress';

const CheckoutStyled = styled.div`
  box-shadow: var(--bs);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
  font-size: 2rem;
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

function CheckoutForm() {

  /**
      * @type {[String | StripeError, Function]} Loading
      */
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  /**
   * Function for handling the submission of the payment
   * @param {Event} event 
   */
  async function handleSubmit(event) {
    // 1 => Stop the form from submitting and start the loader
    event.preventDefault();
    setLoading(true);
    // 2 => Start the page transition
    nprogress.start();
    // 3 => Create the payment method via Stripe (token returned here if successful)
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)
    });

    // 4 => Handle any errors from Stripe 
    if(error) setError(error);

    // 5 => Send token from step 3 to Keystone server via custom mutation
    // 6 => Change the page to view the order
    // 7 => Close the cart
    // 8 => Turn the loader off
    setLoading(false);
    nprogress.done();
  }

  return (
      <CheckoutStyled>
        { error && <p>{error?.message || error}</p>}
        <CardElement />
        <SickButton onClick={handleSubmit}>Check Out Now</SickButton>
      </CheckoutStyled>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripeLib}>
      <CheckoutForm />
    </Elements>
  )
}