import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { USER_UPDATE_RESET } from '../redux/actions/type';
import { getUserDetails, updateUser } from '../redux/actions/userActions';

const UserEditScreen = ({ match, history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const userId = match.params.id;
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector(state => state.userDetails);
  const { success: updateSuccess } = useSelector(state => state.userUpdate);

  error && toast.error(error);
  updateSuccess && toast.success('User updated');

  useEffect(() => {
    if (updateSuccess) {
      dispatch({ type: USER_UPDATE_RESET });
    } else {
      if (user?._id !== userId) {
        dispatch(getUserDetails(userId));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    }
  }, [dispatch, userId, user, updateSuccess]);

  const onSubmit = e => {
    e.preventDefault();
    console.log({ userId, name, email, isAdmin });
    dispatch(updateUser({ _id: userId, name, email, isAdmin }));
  };

  return (
    <>
      <Link to='/admin/userslist' className='btn btn-light mb-5'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit user</h1>
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
          <Form.Group controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              name='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder='Enter email'
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='isAdmin'>
            <Form.Check
              type='checkbox'
              name='isAdmin'
              label='Is Admin'
              checked={isAdmin}
              onChange={e => setIsAdmin(e.target.checked)}
            ></Form.Check>
          </Form.Group>
          <Button variant='primary' type='submit'>
            update
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default UserEditScreen;
