import React from 'react';
import { useEffect } from 'react';
import { Alert, Col, Image, ListGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import StripeCheckout from 'react-stripe-checkout';
import Loader from '../components/Loader';
import {
  getOrderDetails,
  stripePayment,
  payOrder,
} from '../redux/actions/orderActions';
import { ORDER_PAY_RESET, STRIPE_PAYMENT_RESET } from '../redux/actions/type';
import { resetCart } from '../redux/actions/cartActions';

const OrderScreen = ({ match }) => {
  const orderId = match.params.id;
  const dispatch = useDispatch();
  const { order, loading, error } = useSelector(state => state.orderDetails);
  const { success } = useSelector(state => state.orderPay);
  const {
    paymentResult,
    success: successPay,
    // error: stripeError,
  } = useSelector(state => state.stripePayment);

  const addDecimals = num => (Math.round(num * 100) / 100).toFixed(2);

  useEffect(() => {
    dispatch(getOrderDetails(orderId));
    dispatch(resetCart());
  }, [dispatch, orderId]);

  useEffect(() => {
    dispatch({ type: ORDER_PAY_RESET });
    if (!order || success) {
      dispatch(getOrderDetails(orderId));
    }
  }, [dispatch, orderId, order, success]);

  useEffect(() => {
    if (order && !order?.isPaid && successPay) {
      dispatch({ type: STRIPE_PAYMENT_RESET });
      dispatch(payOrder(orderId, paymentResult));
    }
  }, [dispatch, order, orderId, paymentResult, successPay]);

  const onToken = token => {
    const payload = {
      amount: Math.floor(order?.totalPrice) * 100,
      shippingAddress: order?.shippingAddress,
      token,
    };
    dispatch(stripePayment(payload));
  };

  success && toast.success('Payment success');

  return loading ? (
    <Loader />
  ) : error ? (
    toast.error(error)
  ) : (
    <>
      <h1 className='text-center mb-5 text-warning'>Order No #{order._id}</h1>
      {/* <CheckoutSteps step1 step2 step3 step4 /> */}
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: {order?.user?.name}</strong>
              </p>
              <p>
                <strong>
                  Email:{' '}
                  <a href={`mailto:${order?.user?.email}`}>
                    {order?.user?.email}
                  </a>
                </strong>
              </p>
              <p>
                <strong>Address: </strong>
                {order?.shippingAddress?.address}, &nbsp;
                {order?.shippingAddress?.city}, &nbsp;
                {order?.shippingAddress?.postcode}, &nbsp;
                {order?.shippingAddress?.country}
              </p>
              {order.isDelivered ? (
                <Alert variant='success'>
                  <h6 className='mb-0'>Delivered at {order.deliveredAt}</h6>
                </Alert>
              ) : (
                <Alert variant='danger'>
                  <h6 className='mb-0'>Not Delivered</h6>
                </Alert>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h4>Payment Method</h4>
              <p>
                <strong>Method: </strong>
                {order?.paymentMethod}
              </p>
              {order.isPaid ? (
                <Alert variant='success'>
                  <h6 className='mb-0'>Paid at {order.paidAt}</h6>
                </Alert>
              ) : (
                <Alert variant='danger'>
                  <h6 className='mb-0'>Not Paid</h6>
                </Alert>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h4>Ordered Items</h4>
              {order?.orderItems.length === 0 ? (
                <Alert
                  variant='warning'
                  className='d-flex justify-content-between align-items-center'
                >
                  <h6 className='mb-0'>Your cart is empty</h6>
                  <Link to='/'>Go Back</Link>
                </Alert>
              ) : (
                <ListGroup variant='flush'>
                  {order?.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} alt='' fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          <h6>
                            {item.quantity} X ${item.price} = $
                            {addDecimals(item.quantity * item.price)}
                          </h6>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <ListGroup>
            <ListGroup.Item>
              <h3 className='text-center mb-0'>Order Summary</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Items</Col>
                <Col>${order?.itemsPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Shipping price</Col>
                <Col>${order?.shippingPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Tax</Col>
                <Col>${order?.taxPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <span className='font-weight-bold'>Total</span>
                </Col>
                <Col>${order?.totalPrice}</Col>
              </Row>
            </ListGroup.Item>
            {!order?.isPaid && (
              <ListGroup.Item>
                <StripeCheckout
                  label='Pay now'
                  name='Proshop'
                  // billingAddress
                  // shoppingAddress
                  image='https://stripe.com/img/documentation/checkout/marketplace.png'
                  description={`Total price is  $${order?.totalPrice}`}
                  amount={order?.totalPrice * 100}
                  panelLabel='Pay'
                  email={order?.user?.email}
                  token={onToken}
                  stripeKey={process.env.REACT_APP_STRIPE_PUBLIC_KEY}
                />
              </ListGroup.Item>
            )}
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;