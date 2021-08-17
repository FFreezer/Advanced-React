import styled from 'styled-components';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe, StripeError } from '@stripe/stripe-js';
import SickButton from '../styles/SickButton';
import { useState } from 'react';
import nprogress from 'nprogress';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import useCart from '../../lib/hooks/useCart';
import { CURRENT_USER_QUERY } from '../../lib/hooks/useUser';

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

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
  checkout(token: $token) {
    id
    charge
    total
    items{
      id
      name
    }
  }
}
`;

function CheckoutForm() {

  /**
      * @type {[String | StripeError, Function]} Loading
      */
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const [checkout, { error: graphQLError}] = useMutation(CREATE_ORDER_MUTATION, { 
    refetchQueries: [{ query: CURRENT_USER_QUERY }]
  });

  const router = useRouter();
  const { closeCart } = useCart();

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

    console.log({paymentMethod});

    // 4 => Handle any errors from Stripe 
    if(error) {
      setError(error)
      nprogress.done();
      return;
    };

    // 5 => Send token from step 3 to Keystone server via custom mutation
    const order = await checkout({
      variables: { token: paymentMethod.id }
    });

    console.log('Finished with the order');
    console.log(order);
    router.push({
      pathname: '/order',
      query: { id: order.data.checkout.id }
    });
    closeCart();
    // 6 => Change the page to view the order
    // 7 => Close the cart
    // 8 => Turn the loader off
    setLoading(false);
    nprogress.done();
  }

  return (
      <CheckoutStyled>
        { error && <p>{error?.message || error}</p>}
        { graphQLError && <p>{graphQLError?.message || graphQLError}</p>}
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