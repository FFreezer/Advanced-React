import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import styled from 'styled-components';
import DisplayError from '../../components/ErrorMessage';
import OrderItemStyled from '../../components/styles/OrderItemStyles';
import NextLink from 'next/link';
import Head from 'next/head';
import formatMoney from '../../lib/formatMoney';

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    allOrders {
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

const OrderUlStyled = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 4rem;
`;

const countItemsInAnOrder = (order) => order.items.reduce((tally, item) => tally + item.quantity, 0);

export default function OrdersPage() {
  const { error, loading, data } = useQuery(USER_ORDERS_QUERY);
  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;

  const { allOrders } = data;

  return (
    <div>
      <Head>
        <title>Your Orders ({allOrders.length})</title>
      </Head>
      <p>You have {allOrders.length} orders!</p>
      <OrderUlStyled>
        {allOrders.map((order) => (
          <OrderItemStyled key={order.id} >
            <NextLink href={`/orders/${order.id}`} passHref>
              <a>
                <div className="order-meta">
                  <p>{countItemsInAnOrder(order)} Items</p>
                  <p>{order.items.length} Product{order.items.length === 1 ? '' : 's'}</p>
                  <p>{formatMoney(order.total)}</p>
                </div>
                  <div className="images">
                    {order.items.map((item, index) => (
                      <img key={item.id} src={item.photo.image .publicUrlTransformed} alt={item.name} />
                    ))}
                  </div>
                </a>
            </NextLink>
          </OrderItemStyled>
        ))}
      </OrderUlStyled>
    </div>
  );
}
