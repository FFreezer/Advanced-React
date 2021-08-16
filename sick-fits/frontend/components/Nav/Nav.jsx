import NextLink from 'next/link';
import useCart  from '../../lib/hooks/useCart';
import useUser from '../../lib/hooks/useUser';
import NavStyled from '../styles/NavStyles';
import SignOut from '../User/SignOut';

export default function Nav() {
  const user = useUser();
  const { toggleCart } = useCart();
  console.log({ user });

  return (
    <NavStyled>
      <NextLink href="/products">Products</NextLink>
      {user && (
        <>
          <NextLink href="/sell">Sell</NextLink>
          <NextLink href="/orders">Orders</NextLink>
          <NextLink href="/account">Account</NextLink>
          <button type="button" onClick={toggleCart}>Cart</button>
          <SignOut />
        </>
      )}
      {!user && <NextLink href="/signin">Sign In</NextLink>}
    </NavStyled>
  );
}
