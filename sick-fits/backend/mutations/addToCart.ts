import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput } from '../.keystone/schema-types';
import { CartItem } from '../schemas/CartItem';
import { Session } from '../types';

export default async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  console.log('Adding to cart');
  // Query the current user and see if they're signed in
  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error('You must be logged in to do this');
  }
  // Query the users cart
  const allCartItems = await context.lists.CartItem.findMany({
    where: {
      user: { id: sesh.itemId },
      product: { id: productId },
    },
    resolveFields: 'id,quantity,'
  });
  const [existingCartItem] = allCartItems;
  // See if the item they're adding is already in their cart
  if (existingCartItem) {
    //  =>  If it is then increment it by one
    console.log(existingCartItem);
    console.log(
      `There are already ${existingCartItem.quantity}, increment by one`
    );
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: {  quantity: existingCartItem.quantity + 1, },
      resolveFields: false
    });
  }
  //  =>  If its not then add a new cart item
  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId } },
      user: { connect: { id: sesh.itemId } }, 
    },
    resolveFields: false,
  });
}
