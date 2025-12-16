import {isPlainObject, merge} from 'lodash';
import {plain} from '../lib/object';

const defaultProps = {
  sid: ''
};

export class Session {
  constructor(props = {}) {
    if (!isPlainObject(props)) {
      props = plain(props);
    }

    if (!props.sid && props.sessionId) {
      props.sid = props.sessionId;
      delete props.sessionId;
    }

    if (!props.sid && props.sessionID) {
      props.sid = props.sessionID;
      delete props.sessionID;
    }

    if (props.renew) {
      delete props.renew;
    }

    merge(this, {}, defaultProps, props);
  }

  renew(apiClient) {
    throw new Error('Session.renew() must be implemented in the child class');
  }

  clear() {
    this.sid = '';
  }

  isLoggedIn() {
    return this.sid !== '';
  }
}