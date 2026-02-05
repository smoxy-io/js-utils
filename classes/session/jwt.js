import {isNumber, isPlainObject, merge} from 'lodash';
import {plain} from '../../lib/object';
import {isAsync} from '../../lib/function';
import {Session} from '../session.js';
import {decodeToken} from '../../lib/jwt';

const defaultProps = {
  token: '',
  _decodedToken: null,
};

export class JwtSession extends Session {
  constructor(props = {}) {
    if (!isPlainObject(props)) {
      props = plain(props);
    }

    if (!props.token && props.jwt) {
      props.token = props.jwt;
      delete props.jwt;
    }

    if (props._decodedToken) {
      delete props._decodedToken;
    }

    super(merge({}, defaultProps, props));

    if (this.token) {
      this._decodedToken = decodeToken(this.token);
    }
  }

  async renew(apiClient) {
    if (!this.token || !this.sid) {
      throw new Error('cannot renew session: missing token or sid');
    }

    if (!apiClient || !isAsync(apiClient.renew)) {
      throw new Error('cannot renew session: no renew function set');
    }

    const resp = await apiClient.renew(this.token, this.sid);

    if (!resp) {
      throw new Error('failed to renew session');
    }

    const newSession = new JwtSession(resp);

    this.token = newSession.token;
    this.sid = newSession.sid;
    this._decodedToken = null;

    if (this.token) {
      this._decodedToken = decodeToken(this.token);
    }
  }

  clear() {
    super.clear();

    this.token = '';
    this._decodedToken = null;
  }

  isExpired() {
    if (!this.token) {
      return true;
    }

    if (!this._decodedToken) {
      this._decodedToken = decodeToken(this.token);

      if (!this._decodedToken) {
        // invalid token, clear it out
        this.clear();
        return true;
      }
    }

    if (!this._decodedToken.exp || !isNumber(this._decodedToken.exp)) {
      // all jwt tokens have an exp claim formatted as a Unix timestamp. if it is missing, assume the token is invalid
      this.clear();
      return true;
    }

    return this._decodedToken.exp * 1000 <= Date.now();
  }

  isLoggedIn() {
    return !this.isExpired();
  }
}
