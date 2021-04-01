import React, { useEffect } from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { deleteProduct, listProducts } from '../redux/actions/productActions';
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_DELETE_RESET,
} from '../redux/actions/type';

const ProductsListScreen = ({ history }) => {
  const dispatch = useDispatch();
  
  const { error, loading, products } = useSelector(
    ({ productList }) => productList
  );
  const { user } = useSelector(({ userLogin }) => userLogin);
  const {
    success: productDeleteSuccess,
    error: productDeleteError,
  } = useSelector(({ productDelete }) => productDelete);
  const {
    success: productCreateSuccess,
    error: productCreateError,
    product: productCreate,
  } = useSelector(({ productCreate }) => productCreate);

  error && toast.error(error);
  productDeleteError && toast.error(productDeleteError);
  productCreateError && toast.error(productCreateError);

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });
    if (!user?.isAdmin) {
      history.push('/login');
    }
    if (productCreateSuccess) {
      history.push(`/admin/product/${productCreate._id}/edit`);
    } else {
      dispatch(listProducts());
      dispatch({ type: PRODUCT_DELETE_RESET });
    }
  }, [
    dispatch,
    user,
    history,
    productDeleteSuccess,
    productCreateSuccess,
    productCreate,
  ]);

  const deleteHandler = id => {
    if (window.confirm('Are you sure, you want to delete?')) {
      dispatch(deleteProduct(id));
    }
  };

  const createProductHandler = product => {};

  return (
    <>
      <Row className='align-items-center mb-5'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-right'>
          <Button variant='primary' onClick={createProductHandler}>
            <i className='fas fa-plus'></i> Create Product
          </Button>
        </Col>
      </Row>
      {loading && <Loader />}
      <Table hover bordered responsive className='table-sm text-center'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Brand</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products?.map(product => (
            <tr key={product._id}>
              <td className='text-left'>{product.name}</td>
              <td>${product.price}</td>
              <td>{product.category}</td>
              <td>{product.brand}</td>
              <td>
                <LinkContainer to={`/admin/product/${product._id}/edit`}>
                  <Button variant='light' className='btn-sm'>
                    <i className='fas fa-edit'></i>
                  </Button>
                </LinkContainer>
                <Button
                  variant='danger'
                  className='btn-sm'
                  type='button'
                  onClick={() => deleteHandler(product._id)}
                >
                  <i className='fas fa-trash'></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default ProductsListScreen;
