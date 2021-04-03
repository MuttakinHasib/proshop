import React, { useEffect } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Image,
  ListGroup,
  Row,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { addToCart, removeFromCart } from '../redux/actions/cartActions';

const CartScreen = ({ match, location, history }) => {
  const dispatch = useDispatch();
  const {
    cart: { cartItems },
    userLogin: { user },
  } = useSelector(state => ({ ...state }));
  // const [quantity, setQuantity] = useState(1);

  const productId = match.params.id;
  const qty = location.search ? Number(location.search.split('=')[1]) : 1;

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, qty, productId]);

  const checkoutHandler = () =>
    !user ? history.push('/login') : history.push('/shipping');

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Alert
            variant='warning'
            className='d-flex justify-content-between align-items-center'
          >
            <h6 className='mb-0'>Your cart is empty</h6>
            <Link to='/'>Go Back</Link>
          </Alert>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map(item => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2} className='my-3'>
                    <Image src={item?.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3} className='my-3'>
                    <Link to={`/product/${item.product}`}>{item?.name}</Link>
                  </Col>
                  <Col>{item?.price}</Col>
                  <Col md={3} className='my-3'>
                    {item?.countInStock > 0 && (
                      <Form.Control
                        as='select'
                        value={item?.quantity}
                        onChange={e =>
                          dispatch(
                            addToCart(item.product, Number(e.target.value))
                          )
                        }
                        custom
                      >
                        {[...Array(item?.countInStock).keys()].map(x => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    )}
                  </Col>
                  <Col md={2}>
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => dispatch(removeFromCart(item.product))}
                    >
                      <FontAwesomeIcon icon={faTrash} size='2x' color='#f55' />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h5>
                Subtotal (
                {cartItems.reduce((total, item) => total + item.quantity, 0)})
                items
              </h5>
              $
              {cartItems
                .reduce((total, item) => total + item.quantity * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block'
                variant='dark'
                onClick={checkoutHandler}
                disabled={cartItems.length === 0}
              >
                Process to Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
