/* @flow */
// https://github.com/devote/HTML5-History-API
import type {Action} from './types';

const createMiddleware = () => {
  if (typeof window === 'undefined') {
    return () => (next: Function) => next;
  }
  return (store: Object) => {
    window.addEventListener('popstate', (ev) => {
      store.dispatch(ev.state || {
        type: '@@waygate/NAVIGATE',
        payload: {
          path: window.location.pathname,
        },
      });
    });
    return (next: Function) => (action: Action) => {
      if (action.type === '@@waygate/NAVIGATE') {
        if (action.meta && action.meta.replace) {
          history.replaceState(action, '', action.payload.path);
        } else {
          history.pushState(action, '', action.payload.path);
        }
      }
      return next(action);
    };
  };
};

export default createMiddleware;
