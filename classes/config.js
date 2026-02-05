import {isBoolean, isEqual, isFunction, isPlainObject, isString, merge} from 'lodash';
import {plain} from '../lib/object.js';
import {has} from 'lodash/object';

const defaultProps = {};

export class Config {
  constructor(props = {}) {
    if (!props) {
      props = {};
    }

    if (!isPlainObject(props)) {
      props = plain(props);
    }

    merge(this, defaultProps, props);
  }

  getConfig(key, defaultValue = null) {
    return getConfig(key, defaultValue);
  }

  getTitle(defaultValue = '') {
    return getTitle(defaultValue);
  }

  getSubTitle(defaultValue = '') {
    return getSubTitle(defaultValue);
  }

  getStyles() {
    return getStyles();
  }
}

let config = new Config();
let setConfigFn = (o) => {};

export const mergeConfig = (delta) => {
  if (!isPlainObject(delta)) {
    delta = plain(delta);
  }

  let _config = new Config(merge({}, config, delta));

  if (isEqual(plain(config), plain(_config))) {
    // nothing changed, so don't update the config object'
    return;
  }

  // console.log('[DEBUG] updating config state', 'old', plain(config), 'delta', delta);

  setConfigFn(_config);

  config = _config;
};

export const loadConfig = (setConfig) => {
  if (isFunction(setConfig)) {
    setConfigFn = setConfig;
  }
};

export const getConfig = (key, defaultValue = null) => {
  if (!key || !isString(key)) {
    return defaultValue;
  }

  key = key.trim();

  if (!key || !has(config, key)) {
    return defaultValue;
  }

  if (isBoolean(config[key])) {
    return config[key];
  }

  if (!config[key]) {
    return defaultValue;
  }

  return config[key];
};

export const getTitle = (defaultValue = '') => {
  let title = getConfig('title', defaultValue);

  if (title === false) {
    return '';
  } else if (title === true) {
    return defaultValue;
  }

  return title;
};

export const getSubTitle = (defaultValue = '') => {
  let subTitle = getConfig('subTitle', defaultValue);

  if (subTitle === false) {
    return '';
  } else if (subTitle === true) {
    return defaultValue;
  }

  return subTitle;
};

export const getStyles = () => {
  const styles = getConfig('styles', {});

  if (!isPlainObject(styles)) {
    return {};
  }

  return styles;
};
