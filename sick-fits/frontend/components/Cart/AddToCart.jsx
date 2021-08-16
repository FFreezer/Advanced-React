import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { string } from 'prop-types';
import useCart from '../../lib/hooks/useCart';
import { CURRENT_USER_QUERY } from '../../lib/hooks/useUser';

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($productId: ID!) {
    addToCart(productId: $productId) {
      id
    }
  }
`;

const AddToCart = ({ id }) => {
    const { openCart } = useCart();
  
    const [
    addToCart,
    { error, data, loading },
  ] = useMutation(ADD_TO_CART_MUTATION, { 
      variables: { productId: id },
      refetchQueries: [
        { query : CURRENT_USER_QUERY }
      ],
    });


  return (
    <button type="button" onClick={addToCart} disabled={loading}>
      Add To Cart
    </button>
  );
};

AddToCart.propTypes = {
  id: string,
};

export default AddToCart;
