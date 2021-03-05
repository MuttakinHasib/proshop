import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Product from '../components/Product';
import { products } from '../data';

const HomeScreen = () => {
  return (
    <>
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