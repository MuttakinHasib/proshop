import React, { useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { getOrdersList } from '../redux/actions/orderActions';

const OrdersListScreen = ({ history }) => {
  const dispatch = useDispatch();

  const { user } = useSelector(({ userLogin }) => userLogin);
  const { loading, error, orders } = useSelector(
    ({ ordersList }) => ordersList
  );

  error && toast.error(error);

  useEffect(() => {
    // dispatch({ type: ORDERS_LIST_RESET });
    if (!user?.isAdmin) {
      history.push('/login');
    } else {
      dispatch(getOrdersList());
    }
  }, [dispatch, user, history]);

  return (
    <>
      {loading && <Loader />}
      <h1 className='mb-5'>All orders List</h1>
      <Table hover bordered responsive className='table-sm text-center'>
        <thead>
          <tr>
            <th>ID</th>
            <th>User Name</th>
            <th>Date</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Delivered</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders?.map(order => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order?.user?.name}</td>
              <td>{order.createdAt.substring(0, 10)}</td>
              <td>${order.totalPrice}</td>
              <td>
                {order.isPaid ? (
                  order.paidAt.substring(0, 10)
                ) : (
                  <i className='fas fa-times' style={{ color: '#f36' }}></i>
                )}
              </td>
              <td>
                {order.isDelivered ? (
                  order.deliveredAt.substring(0, 10)
                ) : (
                  <i className='fas fa-times' style={{ color: '#f36' }}></i>
                )}
              </td>
              <td>
                <LinkContainer to={`/order/${order._id}`}>
                  <Button variant='light'>Details</Button>
                </LinkContainer>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default OrdersListScreen;
