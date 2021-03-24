import React, { useEffect } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import {
  getUserDetails,
  updateUserProfile,
} from '../redux/actions/userActions';

const ProfileScreen = ({ history, location }) => {
  const dispatch = useDispatch();
  const { user: userInfo } = useSelector(state => state.userLogin);
  const { loading, error, user } = useSelector(state => state.userDetails);
  const { success } = useSelector(state => state.userProfileUpdate);
  const { register: registerHandler, handleSubmit } = useForm();

  error && toast.error(error);
  success && toast.success('Successfully updated');

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      if (!user) {
        dispatch(getUserDetails('profile'));
      }
    }
  }, [dispatch, history, userInfo, user]);

  const onSubmit = ({ name, email, password, confirmPassword }) => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (email !== '' && name !== '') {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
    }
  };

  return (
    <Row>
      <Col md={4}>
        <h1>Dashboard</h1>
        {loading && <Loader />}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              name='name'
              defaultValue={user?.name}
              ref={registerHandler({ required: true })}
              placeholder='Enter Name'
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              name='email'
              defaultValue={user?.email}
              ref={registerHandler({ required: true })}
              placeholder='Enter email'
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='password'>
            <Form.Label>password</Form.Label>
            <Form.Control
              type='password'
              name='password'
              ref={registerHandler}
              placeholder='Enter password'
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='confirmPassword'>
            <Form.Label>password</Form.Label>
            <Form.Control
              type='password'
              name='confirmPassword'
              ref={registerHandler}
              placeholder='Confirm your password'
            ></Form.Control>
          </Form.Group>
          <Button variant='primary' type='submit'>
            Sign in
          </Button>
        </Form>
      </Col>
      <Col md={8}>
        <h2>My Orders</h2>
      </Col>
    </Row>
  );
};

export default ProfileScreen;
