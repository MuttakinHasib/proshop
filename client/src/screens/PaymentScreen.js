import React, { useEffect } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import CheckoutSteps from '../components/CheckoutSteps';
import FormContainer from '../components/FormContainer';
import { savePaymentMethod } from '../redux/actions/cartActions';

const PaymentScreen = ({ history }) => {
  const { shippingAddress } = useSelector(({ cart }) => cart);
  const { register, handleSubmit } = useForm();

  const dispatch = useDispatch();
  useEffect(() => {
    if (!shippingAddress) {
      history.push('/shipping');
    }
  }, [history, shippingAddress]);

  const onSubmit = async data => {
    try {
      console.log(data);
      dispatch(savePaymentMethod(data.paymentMethod));
      history.push('/placeorder');
    } catch (err) {
      toast.error(err.message);
    }
  };
  return (
    <>
      <CheckoutSteps step1 step2 step3 />
      <FormContainer>
        <h1>Payment Method</h1>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId='address'>
            <Form.Label as='legend'>Select Method</Form.Label>
            <Col>
              <Form.Check
                type='radio'
                label='PayPal or Credit Card'
                id='PayPal'
                name='paymentMethod'
                value='PayPal'
                checked
                ref={register}
              ></Form.Check>
              <Form.Check
                type='radio'
                label='Stripe'
                id='Stripe'
                name='paymentMethod'
                value='Stripe'
                ref={register}
              ></Form.Check>
            </Col>
          </Form.Group>
          <Button variant='primary' type='submit'>
            Continue
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default PaymentScreen;
