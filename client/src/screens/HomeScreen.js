import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';
import Product from '../components/Product';
// import { products } from '../data';
import { listProducts } from '../redux/actions/productActions';

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;
  const dispatch = useDispatch();
  const { loading, products, error, page, pages } = useSelector(
    state => state.productList
  );
  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      {loading && <Loader />}
      {error && toast.error(error)}
      <h1>Latest Products</h1>
      <Row className="mb-5" >
        {products.map(product => (
          <Col key={product._id} sm={12} md={6} lg={4}>
            <Product {...{ product }} />
          </Col>
        ))}
      </Row>
      <Paginate keyword={keyword ? keyword : ''} {...{ page, pages }} />
    </>
  );
};

export default HomeScreen;
