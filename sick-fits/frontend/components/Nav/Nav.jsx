import NextLink from 'next/link';
import useCart  from '../../lib/hooks/useCart';
import useUser from '../../lib/hooks/useUser';
import CartCount from '../Cart/CartCount';
import NavStyled from '../styles/NavStyles';
import SignOut from '../User/SignOut';

export default function Nav() {
  const user = useUser();
  const { toggleCart } = useCart(); 

  return (
    <NavStyled>
      <NextLink href="/products">Products</NextLink>
      {user && (
        <>
          <NextLink href="/sell">Sell</NextLink>
          <NextLink href="/orders">Orders</NextLink>
          <NextLink href="/account">Account</NextLink>
          <button type="button" onClick={toggleCart}>
            Cart
            <CartCount count={user.cart.reduce(
              (tally, cartItem) => tally + (cartItem.product ? cartItem.quantity : 0), 0 
            )}/>
            </button>
          <SignOut />
        </>
      )}
      {!user && <NextLink href="/signin">Sign In</NextLink>}
    </NavStyled>
  );
}
