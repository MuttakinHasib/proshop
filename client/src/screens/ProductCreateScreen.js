import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { createProduct } from '../redux/actions/productActions';
import { PRODUCT_CREATE_RESET } from '../redux/actions/type';

const ProductCreateScreen = ({ match, history }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [imageUploading, setImageUploading] = useState(false);

  const dispatch = useDispatch();

  const { user: userInfo } = useSelector(state => state.userLogin);
  const { loading, error, success } = useSelector(state => state.productCreate);
  error && toast.error(error);

  useEffect(() => {
    if (!userInfo || !userInfo?.isAdmin) {
      history.push('/login');
    } else {
      if (success) {
        history.push('/');
        dispatch({ type: PRODUCT_CREATE_RESET });
      }
    }
  }, [history, userInfo, success, dispatch]);

  const onSubmit = e => {
    e.preventDefault();
    dispatch(
      createProduct({
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      })
    );
  };

  const uploadFileHandler = async e => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setImageUploading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const { data } = await axios.post('/api/upload', formData, config);
      setImage(data);
      setImageUploading(false);
    } catch (err) {
      console.error(err.message);
      setImageUploading(false);
    }
  };

  return (
    <>
      {imageUploading && <Loader />}
      <Link to='/admin/productslist' className='btn btn-light mb-5'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Create Product</h1>
        {loading && <Loader />}
        <Form {...{ onSubmit }}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              name='name'
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='Enter Name'
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='image'>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type='text'
              name='price'
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder='Enter email'
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='image'>
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type='text'
              name='image'
              value={image}
              onChange={e => setImage(e.target.value)}
              placeholder='Enter image url'
            ></Form.Control>
            <Form.File
              id='image-file'
              label='Choose image'
              custom
              onChange={uploadFileHandler}
            ></Form.File>
          </Form.Group>
          <Form.Group controlId='category'>
            <Form.Label>Category</Form.Label>
            <Form.Control
              type='text'
              name='category'
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder='Enter category'
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='brand'>
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type='text'
              name='brand'
              value={brand}
              onChange={e => setBrand(e.target.value)}
              placeholder='Enter brand'
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='countInStock'>
            <Form.Label>Count In Stock</Form.Label>
            <Form.Control
              type='text'
              name='countInStock'
              value={countInStock}
              onChange={e => setCountInStock(e.target.value)}
              placeholder='Enter Count In Stock'
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='description'>
            <Form.Label>description</Form.Label>
            <Form.Control
              type='text'
              name='description'
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='Enter description'
            ></Form.Control>
          </Form.Group>
          <Button variant='primary' type='submit'>
            update
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ProductCreateScreen;
