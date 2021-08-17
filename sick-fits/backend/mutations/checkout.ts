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

  // 1.5 => Query the current user
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

  // 4 => Convert the cart items to order items
  const orderItems = cartItems.map((cartItem) => ({
    name: cartItem.product.name,
    description: cartItem.product.description,
    price: cartItem.product.price,
    quantity: cartItem.quantity,
    photo: { connect : { id : cartItem.product.photo.id } },
  }));

  // 5 => Create the order and return it
  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { 
        create: orderItems
      },
      user: { connect : { id: userId } },
    }
  });

  console.log({"___ORDER___": order, "___CHARGE___" : charge});

  // 6 => Clean up any old cart items
  const cartItemIds = cartItems.map(cartItem => cartItem.id);
  await context.lists.CartItem.deleteMany({ ids : cartItemIds });
  
  // 7 => Return the order
  return order;
}

export default checkout;