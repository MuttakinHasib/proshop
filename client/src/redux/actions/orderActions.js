import axios from 'axios';
import {
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  STRIPE_PAYMENT_FAIL,
  STRIPE_PAYMENT_REQUEST,
  STRIPE_PAYMENT_SUCCESS,
  USER_ORDERS_LIST_FAIL,
  USER_ORDERS_LIST_REQUEST,
  USER_ORDERS_LIST_SUCCESS,
} from './type';

export const createOrder = order => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST });
    const { user } = getState().userLogin;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.post(`/api/orders`, order, config);

    dispatch({ type: ORDER_CREATE_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export const getOrderDetails = id => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST });
    const { user } = getState().userLogin;

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.get(`/api/orders/${id}`, config);

    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload:
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export const stripePayment = payment => async (dispatch, getState) => {
  try {
    dispatch({ type: STRIPE_PAYMENT_REQUEST });
    const { user } = getState().userLogin;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.post(`/api/orders/payment`, payment, config);

    dispatch({ type: STRIPE_PAYMENT_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: STRIPE_PAYMENT_FAIL,
      payload:
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export const payOrder = (orderId, paymentResult) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({ type: ORDER_PAY_REQUEST });
    const { user } = getState().userLogin;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.put(
      `/api/orders/${orderId}/paid`,
      paymentResult,
      config
    );

    dispatch({ type: ORDER_PAY_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: ORDER_PAY_FAIL,
      payload:
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};

export const getUserOrders = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_ORDERS_LIST_REQUEST });
    const { user } = getState().userLogin;

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.get(`/api/orders/userOrders`, config);

    dispatch({ type: USER_ORDERS_LIST_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: USER_ORDERS_LIST_FAIL,
      payload:
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};
