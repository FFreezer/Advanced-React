import { string } from 'prop-types';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { CURRENT_USER_QUERY } from '../../lib/hooks/useUser';

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`;

const REMOVE_FROM_CART_MUTATION = gql`
  mutation DELETE_CART_ITEM_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
      quantity
    }
  }
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteCartItem));
}

const RemoveFromCart = ({ id }) => {
  const [removeFromCart, { loading, error, data }] = useMutation(
    REMOVE_FROM_CART_MUTATION,
    {
      variables: { id },
      update,
    }
  );

  return (
    <BigButton
      type="button"
      title="Remove this item from cart"
      onClick={removeFromCart}
      disabled={loading}
    >
      &times;
    </BigButton>
  );
};

RemoveFromCart.propTypes = {
  id: string,
};

export default RemoveFromCart;
