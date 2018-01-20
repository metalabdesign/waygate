/* @flow */

type Meta = {
  replace?: boolean,
};

export type NavigateAction = {
  type: '@@waygate/NAVIGATE',
  payload: {
    path: string,
  },
  meta?: Meta,
};

export const navigate = (path: string, meta?: Meta): NavigateAction => {
  return {
    type: '@@waygate/NAVIGATE',
    payload: {path},
    meta,
  };
};
