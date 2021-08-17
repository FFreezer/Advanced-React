import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { shape, string } from 'prop-types';
import DisplayError from '../../components/ErrorMessage';
import OrderStyles from '../../components/styles/OrderStyles';
import Head from 'next/head';
import formatMoney from '../../lib/formatMoney';
const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    Order(where: { id: $id }) {
      id
      label
      total
      charge
      user {
        id
      }
      items {
        id
        name
        price
        quantity
        description
        photo {
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

export default function SingleOrderPage({ query: { id } }) {
  const { data, error, loading } = useQuery(SINGLE_ORDER_QUERY, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if(error) return <DisplayError error={error} />;
  
  const {Order: order} = data;

  return (
    <>
      <Head>
        <title>Sick Fits - Order ${order.id}</title>
      </Head>
      <OrderStyles>
        <p>
          <span>Order Id:</span>
          <span>{order?.id}</span>
        </p>
        <p>
          <span>Charge:</span>
          <span>{order?.charge}</span>
        </p>
        <p>
          <span>Total:</span>
          <span>{formatMoney(order?.total)}</span>
        </p>
        <p>
          <span>ItemCount:</span>
          <span>{order.items.length}</span>
        </p>
        <div className="items">
          {order.items.map((item) => (
            <div key={item.id} className="order-item">
              <img src={item.photo.image.publicUrlTransformed} alt={item.title} />
              <div className="item-details">
                <h2>{item.name}</h2>
                <p>Qty: {item.quantity}</p>
                <p>Each: {formatMoney(item.price)}</p>
                <p>Sub Total: {formatMoney(item.price * item.quantity)}</p>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </OrderStyles>
    </>
  );
}

SingleOrderPage.propTypes = {
  query: shape({
    id: string,
  }),
};
