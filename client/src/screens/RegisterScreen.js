import React, { useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { register } from '../redux/actions/userActions';

const RegisterScreen = ({ location, history }) => {
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector(state => state.userRegister);
  const { register: registerHandler, handleSubmit } = useForm();
  const redirect = location.search ? location.search.split('=')[1] : '/';

  error && toast.error(error);

  useEffect(() => {
    if (user) {
      history.push(redirect);
    }
  }, [history, user, redirect]);

  const onSubmit = ({ name, email, password, confirmPassword }) => {
    if (password !== confirmPassword) toast.error('Passwords do not match');
    if (email !== '' && password !== '' && name !== '') {
      dispatch(register(name, email, password));
    }
  };

  return (
    <FormContainer>
      <h1>Sign up</h1>
      {loading && <Loader />}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='text'
            name='name'
            ref={registerHandler({ required: true })}
            placeholder='Enter Name'
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            name='email'
            ref={registerHandler({ required: true })}
            placeholder='Enter email'
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='password'>
          <Form.Label>password</Form.Label>
          <Form.Control
            type='password'
            name='password'
            ref={registerHandler({ required: true })}
            placeholder='Enter password'
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='confirmPassword'>
          <Form.Label>password</Form.Label>
          <Form.Control
            type='password'
            name='confirmPassword'
            ref={registerHandler({ required: true })}
            placeholder='Confirm your password'
          ></Form.Control>
        </Form.Group>
        <Button variant='primary' type='submit'>
          Sign in
        </Button>
      </Form>
      <Row className='py-3'>
        <Col>
          Don't have an account?{' '}
          <Link to={redirect ? `/register/redirect=${redirect}` : '/register'}>
            Register here
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
