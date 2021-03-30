import React, { useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { USER_DELETE_RESET } from '../redux/actions/type';
import { deleteUser, usersList } from '../redux/actions/userActions';

const UserListScreen = ({ history }) => {
  const dispatch = useDispatch();
  const { error, loading, users } = useSelector(({ usersList }) => usersList);
  const { user } = useSelector(({ userLogin }) => userLogin);
  const { success: deleteSuccess } = useSelector(
    ({ userDelete }) => userDelete
  );

  useEffect(() => {
    if (user && user.isAdmin) {
      dispatch(usersList());
    } else {
      history.push('/login');
    }
  }, [dispatch, user, history, deleteSuccess]);

  const deleteHandler = id => {
    if (user._id === id) {
      toast.error('You cannot delete admin account');
      return;
    }
    dispatch(deleteUser(id));
    dispatch({ type: USER_DELETE_RESET });
  };

  return (
    <>
      {loading && <Loader />}
      <h1>All users</h1>
      <Table hover bordered responsive className='table-sm text-center'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Admin</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users?.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>
                <a href={`mailto:${user.email}`}>{user.email}</a>
              </td>
              <td>
                {user.isAdmin ? (
                  <i className='fa fa-check' style={{ color: 'green' }}></i>
                ) : (
                  <i className='fas fa-times' style={{ color: 'red' }} />
                )}
              </td>
              <td>
                <LinkContainer to={`/admin/user/${user._id}/edit`}>
                  <Button variant='light' className='btn-sm'>
                    <i className='fas fa-edit'></i>
                  </Button>
                </LinkContainer>
                <Button
                  variant='danger'
                  className='btn-sm'
                  type='button'
                  onClick={() => deleteHandler(user._id)}
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

export default UserListScreen;
