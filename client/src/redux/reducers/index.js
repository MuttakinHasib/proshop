import { combineReducers } from 'redux';
import { cartReducer } from './cartReducers';
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  stripePaymentReducer,
  userOrdersListReducer,
} from './orderReducers';
import { productDetailsReducer, productListReducer } from './productReducers';
import {
  userDetailsReducer,
  userLoginReducer,
  userProfileUpdateReducer,
  userRegisterReducer,
} from './userReducers';

export default combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userProfileUpdate: userProfileUpdateReducer,
  userOrdersList: userOrdersListReducer,
  cart: cartReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  stripePayment: stripePaymentReducer,
  orderPay: orderPayReducer,
});
