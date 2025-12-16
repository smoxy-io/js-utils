import {isFunction} from 'lodash/lang';

export const arrowAsyncNoop = async () => {};
export const asyncNoop = async function () {};

export const isAsync = (fn) => {
  return fn && (fn.constructor === arrowAsyncNoop.constructor || fn.constructor === asyncNoop.constructor);
};

export const isArrow = (fn) => {
  return fn && isFunction(fn) && fn.prototype === undefined;
};
