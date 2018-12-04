import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';

export default function configureStore(middleware) {

  const middlewares = [
    thunk,
    middleware,
    logger
  ];

  return createStore(rootReducer, applyMiddleware(...middlewares));
}
