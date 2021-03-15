import { combineReducers } from 'redux';
import { cartReducer } from './cartReducers';
import { productDetailsReducer, productListReducer } from './productReducers';

export default combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  cart: cartReducer,
});
