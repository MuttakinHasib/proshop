import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Product from '../components/Product';
// import { products } from '../data';
import { listProducts } from '../redux/actions/productActions';

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword;
  const dispatch = useDispatch();
  const { loading, products, error } = useSelector(state => state.productList);
  useEffect(() => {
    dispatch(listProducts(keyword));
  }, [dispatch, keyword]);

  return (
    <>
      {loading && <Loader />}
      {error && toast.error(error)}
      <h1>Latest Products</h1>
      <Row>
        {products.map(product => (
          <Col key={product._id} sm={12} md={6} lg={4}>
            <Product {...{ product }} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default HomeScreen;
