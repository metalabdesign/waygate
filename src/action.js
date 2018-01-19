/* @flow */

export type NavigateAction = {
  type: '@@waygate/NAVIGATE',
  payload: {
    path: string,
  },
  meta?: Object,
};

export const navigate = (path: string, meta?: Object): NavigateAction => {
  return {
    type: '@@waygate/NAVIGATE',
    payload: {path},
    meta,
  };
};
