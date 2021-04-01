import { combineReducers } from 'redux';
import { cartReducer } from './cartReducers';
import {
  orderCreateReducer,
  orderDeliverReducer,
  orderDetailsReducer,
  orderPayReducer,
  OrdersListReducer,
  stripePaymentReducer,
  userOrdersListReducer,
} from './orderReducers';
import {
  productCreateReducer,
  productDeleteReducer,
  productDetailsReducer,
  productListReducer,
  productReviewReducer,
  productUpdateReducer,
} from './productReducers';
import {
  userDeleteReducer,
  userDetailsReducer,
  userListReducer,
  userLoginReducer,
  userProfileUpdateReducer,
  userRegisterReducer,
  userUpdateReducer,
} from './userReducers';

export default combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productReview: productReviewReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userProfileUpdate: userProfileUpdateReducer,
  userOrdersList: userOrdersListReducer,
  usersList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  cart: cartReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  ordersList: OrdersListReducer,
  stripePayment: stripePaymentReducer,
  orderPay: orderPayReducer,
  orderDeliver: orderDeliverReducer,
});
