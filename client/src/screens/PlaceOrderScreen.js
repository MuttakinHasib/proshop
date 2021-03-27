import React from 'react';
import { useEffect } from 'react';
import { Alert, Button, Col, Image, ListGroup, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { createOrder } from '../redux/actions/orderActions';

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);
  const { order, success, error, loading } = useSelector(
    state => state.orderCreate
  );

  error && toast.error(error);

  const addDecimals = num => (Math.round(num * 100) / 100).toFixed(2);

  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );

  cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100);
  cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));
  cart.totalPrice =
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice);

  const placeOrderHandler = () =>
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingPrice: cart.shippingPrice,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      })
    );

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`);
    }
    // eslint-disable-next-line
  }, [history, success]);

  return (
    <>
      {loading && <Loader />}
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: {cart?.user?.name}</strong>
              </p>
              <p>
                <strong>
                  Email:{' '}
                  <a href={`mailto:${cart?.user?.email}`}>
                    {cart?.user?.email}
                  </a>
                </strong>
              </p>
              <p>
                <strong>Address: </strong>
                {cart?.shippingAddress?.address}, &nbsp;
                {cart?.shippingAddress?.city}, &nbsp;
                {cart?.shippingAddress?.postcode}, &nbsp;
                {cart?.shippingAddress?.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h4>Payment Method</h4>
              <p>
                <strong>Method: </strong>
                {cart?.paymentMethod}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h4>Ordered Items</h4>
              {cart?.cartItems.length === 0 ? (
                <Alert
                  variant='warning'
                  className='d-flex justify-content-between align-items-center'
                >
                  <h6 className='mb-0'>Your cart is empty</h6>
                  <Link to='/'>Go Back</Link>
                </Alert>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
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
                <Col>${cart?.itemsPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Shipping price</Col>
                <Col>${cart?.shippingPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>Tax</Col>
                <Col>${cart?.taxPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <span className='font-weight-bold'>Total</span>
                </Col>
                <Col>${cart?.totalPrice}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                variant='primary'
                className='btn-block'
                type='button'
                onClick={placeOrderHandler}
              >
                Place Order
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
