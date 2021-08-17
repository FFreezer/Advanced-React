import { CartItemCreateInput, CartItemListTypeInfo, OrderCreateInput } from '../.keystone/schema-types';
import { KeystoneContext, SessionStore } from '@keystone-next/types';
import { CartItem } from '../lib/types/CartItem';
import stripeConfig from '../lib/stripe';

interface Arguments {
  [key: string]: any
  token: string
}

const graphql = String.raw;

const resolveFields = graphql`
  id
  name
  email
  cart {
    id
    quantity
    product {
      id
      name
      price
      description
      photo {
        id
        image {
          id
          publicUrlTransformed
        }
      }
    }
  }
`;

const checkout = async (
  root: any,
  { token }: Arguments,
  context: KeystoneContext,
): Promise<OrderCreateInput> =>  {
  // 1 => Make sure the user is signed in
  const userId = context.session.itemId;
  if(!userId) throw new Error('You must be signed in to create a new order');
  console.log({ userId });
  // Query the current user
  const user = await context.lists.User.findOne({ 
    where: { id: userId },
    resolveFields
  });
  // 2 => Calculate the total price
  const cartItems: Array<CartItem> = user.cart.filter((cartItem) => cartItem.product);
  console.dir(cartItems, { depth : null })
  const amount = cartItems.reduce((tally, cartItem) => {
    return tally + cartItem?.quantity * cartItem?.product?.price 
  }, 0);
  console.log({ amount });
  // 3 => Create the charge with the stripe library
  const charge = await stripeConfig.paymentIntents.create({
    amount,
    currency: 'GBP',
    confirm: true,
    payment_method: token
  }).catch((error) => {
    console.error(error);
    throw new Error(error);
  });
  console.log({ charge })
  // 4 => Convert the cart items to order items
  // 5 => Create the order and return it
  return;
}

export default checkout;