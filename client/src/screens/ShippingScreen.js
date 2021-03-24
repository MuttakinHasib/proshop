import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import CheckoutSteps from '../components/CheckoutSteps';
import FormContainer from '../components/FormContainer';
import { saveShippingAddress } from '../redux/actions/cartActions';

const ShippingScreen = ({ history }) => {
  const { shippingAddress } = useSelector(({ cart }) => cart);
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const onSubmit = async data => {
    try {
      dispatch(saveShippingAddress(data));
      history.push('/payment');
    } catch (err) {
      toast.error(err.message);
    }
  };
  return (
    <>
      <CheckoutSteps step1 step2 />
      <FormContainer>
        <h1>Shipping Address</h1>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId='address'>
            <Form.Label>Address</Form.Label>
            <Form.Control
              type='text'
              name='address'
              defaultValue={shippingAddress?.address}
              ref={register({ required: true })}
              placeholder='Enter Address'
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='city'>
            <Form.Label>City</Form.Label>
            <Form.Control
              type='text'
              name='city'
              defaultValue={shippingAddress?.city}
              ref={register({ required: true })}
              placeholder='Enter City'
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='postcode'>
            <Form.Label>Post code</Form.Label>
            <Form.Control
              type='text'
              name='postcode'
              defaultValue={shippingAddress?.postcode}
              ref={register({ required: true })}
              placeholder='Enter post code'
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='country'>
            <Form.Label>Country</Form.Label>
            <Form.Control
              type='text'
              name='country'
              defaultValue={shippingAddress?.country}
              ref={register({ required: true })}
              placeholder='Enter country'
            ></Form.Control>
          </Form.Group>
          <Button variant='primary' type='submit'>
            Make payment
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ShippingScreen;
