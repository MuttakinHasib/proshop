import React, { useEffect, useState } from 'react';
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
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Meta from '../components/Meta';
import Rating from '../components/Rating';
import {
  createProductReview,
  listProductDetails,
} from '../redux/actions/productActions';
import { PRODUCT_CREATE_REVIEW_RESET } from '../redux/actions/type';

const ProductScreen = ({ match, history }) => {
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const dispatch = useDispatch();

  const { user } = useSelector(state => state.userLogin);
  const { product, loading, error } = useSelector(
    state => state.productDetails
  );
  const { success: reviewCreatedSuccess } = useSelector(
    state => state.productReview
  );

  useEffect(() => {
    if (reviewCreatedSuccess) {
      setRating(0);
      setComment('');
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(match.params.id));
  }, [dispatch, match, reviewCreatedSuccess]);

  const addToCartHandler = () =>
    history.push(`/cart/${match.params.id}?qty=${quantity}`);

  const ratingHandler = e => {
    e.preventDefault();
    dispatch(createProductReview(match.params.id, { rating, comment }));
  };

  return (
    <>
      {error && toast.error(error)}
      {loading ? (
        <Loader />
      ) : (
        <>
          <Meta title={product?.name} />
          <Link className='btn btn-light my-3' to='/'>
            Go Back
          </Link>
          <Row>
            <Col md={6}>
              <Image src={product?.image} alt='' fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product?.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product?.price}</ListGroup.Item>
                <ListGroup.Item>
                  Rating: <Rating value={product?.rating} />
                </ListGroup.Item>
                <ListGroup.Item>
                  Description: {product?.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product?.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        <strong>
                          {product?.countInStock > 0 ? 'In Stock' : 'Stock Out'}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product?.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col className='m-auto'>Quantity:</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                            custom
                          >
                            {[...Array(product?.countInStock).keys()].map(x => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      className='btn-block'
                      type='button'
                      disabled={product?.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className='mt-5'>
            <Col md={6}>
              <h3 className='mb-3'>Reviews</h3>
              {product?.reviews.length === 0 && (
                <Alert variant='warning'>
                  <h6 className='mb-0'>No reviews</h6>
                </Alert>
              )}
              <ListGroup variant='flush'>
                {product?.reviews.map(review => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <h3 className='mb-3'>Write a customer review</h3>
              {user ? (
                <Form onSubmit={ratingHandler}>
                  <Form.Group controlId='rating'>
                    <Form.Label>Rating</Form.Label>
                    <Form.Control
                      as='select'
                      custom
                      value={rating}
                      onChange={e => setRating(e.target.value)}
                    >
                      <option value=''>Select ...</option>
                      <option value='1'>1 - Poor</option>
                      <option value='2'>2 - Fair</option>
                      <option value='3'>3 - Good</option>
                      <option value='4'>4 - Very Good</option>
                      <option value='5'>5 - Excellent</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId='comment'>
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as='textarea'
                      row='3'
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                  <Button variant='primary' type='submit'>
                    Submit review
                  </Button>
                </Form>
              ) : (
                <Alert variant='info'>
                  <h6 className='mb-0'>
                    Please <Link to='/login'>Sign in</Link> to write a customer
                    review
                  </h6>
                </Alert>
              )}
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
