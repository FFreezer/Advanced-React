import styled from 'styled-components';
import { Elements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import SickButton from '../styles/SickButton';

const CheckoutStyled = styled.div`
  box-shadow: var(--bs);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 5px;
  padding: 1rem;
  display: grid;
  grid-gap: 1rem;
`;

const stripeLib = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

export default function Checkout() {

  /**
   * Function for handling the submission of the payment
   * @param {Event} event 
   */
  function handleSubmit(event) {
    event.preventDefault();

  }

  return (
    <Elements stripe={stripeLib}>
      <CheckoutStyled>
        <CardElement />
        <SickButton>Check Out Now</SickButton>
      </CheckoutStyled>
    </Elements>
  );
}
