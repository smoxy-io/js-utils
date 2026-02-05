import {isEqual, isFunction, isPlainObject, merge} from 'lodash';
import {plain} from '../lib/object.js';
import {isAsync} from '../lib/function.js';

export const WindowLocation = 'windowLocation';
export const ParentWindowLocation = 'parentWindowLocation';

export class Env {
  constructor(props = {}) {
    if (!isPlainObject(props)) {
      if (props instanceof Env) {
        props = plain(props);
      } else {
        props = {};
      }
    }

    merge(this, {}, props);
  }
}

let env = new Env();
let setEnvFn = (o) => {};   // a noop function by default

export const loadEnv = async (setEnv, apiClient) => {
  let getEnv = null;

  if (setEnv && !isFunction(setEnv) && isAsync(setEnv.getEnv)) {
    // setEnv is actually the apiClient. adjust accordingly
    getEnv = apiClient.getEnv;
    setEnv = null;
    apiClient = null;
  }

  if (isFunction(setEnv)) {
    setEnvFn = setEnv;
  }

  const e = {};

  if (window) {
    e[WindowLocation] = {
      href: window.location.href,
      origin: window.location.origin,
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      host: window.location.host,
      hostname: window.location.hostname,
      port: window.location.port,
      protocol: window.location.protocol
    };
  }

  if (apiClient && isAsync(apiClient.getEnv)) {
    getEnv = apiClient.getEnv;
  }

  if (getEnv) {
    const envInfo = await getEnv();

    if (!isPlainObject(envInfo)) {
      mergeEnv(e);

      throw new Error('failed to load env. invalid response: ' + JSON.stringify(envInfo));
    }

    merge(e, envInfo);
  }

  mergeEnv(merge(e));
};

export const mergeEnv = (delta) => {
  if (!isPlainObject(delta)) {
    delta = plain(delta);
  }

  let _env = new Env(merge({}, env, delta));

  if (isEqual(plain(env), plain(_env))) {
    // nothing changed, so don't update the env object'
    return;
  }

  // console.log('[DEBUG] updating env state', 'old', plain(env), 'delta', delta);

  setEnvFn(_env);

  env = _env;
}

export const getEnv = (name, defaultValue = '') => {
  const e = env[name];

  if (e) {
    return e;
  }

  return defaultValue;
};

export const getTopWindowLocation = (e = null) => {
  const _env = e || env;
  
  if (_env[ParentWindowLocation] && isPlainObject(_env[ParentWindowLocation])) {
    return _env[ParentWindowLocation];
  }

  return _env[WindowLocation];
}
