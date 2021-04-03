import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';

import Footer from './components/Footer';
import Header from './components/Header';

import {
  CartScreen,
  HomeScreen,
  LoginScreen,
  OrderScreen,
  PaymentScreen,
  PlaceOrderScreen,
  ProductCreateScreen,
  ProductEditScreen,
  ProductScreen,
  ProductsListScreen,
  ProfileScreen,
  RegisterScreen,
  ShippingScreen,
  UserEditScreen,
  UserListScreen,
} from './screens';
import OrdersListScreen from './screens/OrdersListScreen';
import Meta from './components/Meta';

const App = () => {
  return (
    <Router>
      <Header />
      <Meta />
      <main>
        <Container>
          <Switch>
            <Route exact path='/' component={HomeScreen} />
            <Route exact path='/page/:pageNumber' component={HomeScreen} />
            <Route exact path='/search/:keyword' component={HomeScreen} />
            <Route
              exact
              path='/search/:keyword/page/:pageNumber'
              component={HomeScreen}
            />
            <Route exact path='/login' component={LoginScreen} />
            <Route exact path='/register' component={RegisterScreen} />
            <Route exact path='/profile' component={ProfileScreen} />
            <Route exact path='/product/:id' component={ProductScreen} />
            <Route exact path='/cart/:id?' component={CartScreen} />
            <Route exact path='/shipping' component={ShippingScreen} />
            <Route exact path='/payment' component={PaymentScreen} />
            <Route exact path='/placeorder' component={PlaceOrderScreen} />
            <Route exact path='/order/:id' component={OrderScreen} />
            <Route exact path='/admin/userslist' component={UserListScreen} />
            <Route
              exact
              path='/admin/user/:id/edit'
              component={UserEditScreen}
            />
            <Route
              exact
              path='/admin/product/create'
              component={ProductCreateScreen}
            />
            <Route
              exact
              path='/admin/productslist'
              component={ProductsListScreen}
            />
            <Route
              exact
              path='/admin/productslist/:pageNumber'
              component={ProductsListScreen}
            />
            <Route
              exact
              path='/admin/product/:id/edit'
              component={ProductEditScreen}
            />
            <Route
              exact
              path='/admin/orderslist'
              component={OrdersListScreen}
            />
          </Switch>
        </Container>
      </main>
      <ToastContainer />
      <Footer />
    </Router>
  );
};

export default App;
