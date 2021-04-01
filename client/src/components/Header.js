import React from 'react';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { logout } from '../redux/actions/userActions';
import SearchBox from './SearchBox';

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.userLogin);

  const logoutHandler = () => {
    dispatch(logout());
  };
  return (
    <header className='mb-5'>
      <Navbar bg='light' expand='lg'>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>ProShop</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <SearchBox />
            <Nav className='ml-auto'>
              <LinkContainer to='/cart'>
                <Nav.Link>Cart</Nav.Link>
              </LinkContainer>
              {user ? (
                <NavDropdown title={user.name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>

                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>Sign in</Nav.Link>
                </LinkContainer>
              )}
              {user?.isAdmin && (
                <NavDropdown title='Admin' id='admin'>
                  <LinkContainer to='/admin/userslist'>
                    <NavDropdown.Item>All users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/productslist'>
                    <NavDropdown.Item>All products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderslist'>
                    <NavDropdown.Item>All orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
