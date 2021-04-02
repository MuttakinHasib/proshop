import React, { useEffect } from 'react';
import { Alert, Button, Col, Form, Row, Table } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { getUserOrders } from '../redux/actions/orderActions';
import {
  getUserDetails,
  updateUserProfile,
} from '../redux/actions/userActions';

const ProfileScreen = ({ history, location }) => {
  const dispatch = useDispatch();
  const { user: userInfo } = useSelector(state => state.userLogin);
  const { loading, error, user } = useSelector(state => state.userDetails);
  const { success } = useSelector(state => state.userProfileUpdate);
  const { orders, loading: loadingOrders, error: errorOrders } = useSelector(
    state => state.userOrdersList
  );
  const { register: registerHandler, handleSubmit } = useForm();

  error && toast.error(error);
  success && toast.success('Successfully updated');

  useEffect(() => dispatch(getUserOrders()), [dispatch]);

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      if (!user) {
        dispatch(getUserDetails('profile'));
      }
    }
  }, [dispatch, user, userInfo, history, orders]);

  const onSubmit = ({ name, email, password, confirmPassword }) => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (email !== '' && name !== '') {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h1>Dashboard</h1>
        {loading && <Loader />}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              name='name'
              defaultValue={user?.name}
              ref={registerHandler({ required: true })}
              placeholder='Enter Name'
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              name='email'
              defaultValue={user?.email}
              ref={registerHandler({ required: true })}
              placeholder='Enter email'
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='password'>
            <Form.Label>password</Form.Label>
            <Form.Control
              type='password'
              name='password'
              ref={registerHandler}
              placeholder='Enter password'
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='confirmPassword'>
            <Form.Label>password</Form.Label>
            <Form.Control
              type='password'
              name='confirmPassword'
              ref={registerHandler}
              placeholder='Confirm your password'
            ></Form.Control>
          </Form.Group>
          <Button variant='primary' type='submit'>
            Sign in
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Alert variant='danger'>
            <h6 className='mb-0'>{errorOrders}</h6>
          </Alert>
        ) : orders?.length === 0 ? (
          <Alert variant='warning'>
            <h6 className='mb-0'>Your orders list is empty</h6>
          </Alert>
        ) : (
          <Table
            striped
            bordered
            hover
            responsive
            className='table-sm text-center'
          >
            <thead>
              <tr>
                <th>ID</th>
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
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>${order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      <>
                        <i
                          className='fas fa-check'
                          style={{ color: 'green' }}
                        ></i>{' '}
                        {order.paidAt.substring(0, 10)}
                      </>
                    ) : (
                      <i className='fas fa-times' style={{ color: '#f36' }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      <>
                        <i
                          className='fas fa-check'
                          style={{ color: 'green' }}
                        ></i>{' '}
                        {order.deliveredAt.substring(0, 10)}
                      </>
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
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
