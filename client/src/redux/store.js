import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import reducers from './reducers';

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : [];

const middleware = [thunk];
const initial = {
  cart: { cartItems: cartItemsFromStorage },
};

export const store = createStore(
  reducers,
  initial,
  composeWithDevTools(applyMiddleware(...middleware))
);
