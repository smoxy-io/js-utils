import FrameBus from 'framebus';
import {isPlainObject, merge} from 'lodash';
import {mergeEnv, ParentWindowLocation} from '../classes/env';
import {mergeConfig} from '../classes/config';

export const init = () => {
  if (window.parent === window) {
    return;
  }

  const bus = new FrameBus({
    targetFrames: [window.parent],
  });

  bus.emitAsPromise('env').then((pEnv) => {
    if (pEnv && isPlainObject(pEnv)) {
      if (!pEnv[ParentWindowLocation]) {
        pEnv[ParentWindowLocation] = {hostname: 'example.com', origin: 'https://example.com'};
      }

      mergeEnv(merge({}, pEnv, {inIframe: true}));
    }
  }).catch((e) => {
    console.error('failed to get env from parent frame', e);
  });

  bus.emitAsPromise('config').then((pConfig) => {
    mergeConfig(merge({}, pConfig));
  }).catch((e) => {
    console.error('failed to get config from parent frame', e);
  });

  let prevScrollHeight = 0;

  const resizeObserver = new ResizeObserver(() => {
    const newScrollHeight = document.body.scrollHeight;

    if (prevScrollHeight !== newScrollHeight) {
      bus.emit('resize', {height: newScrollHeight, width: document.body.scrollWidth});
      prevScrollHeight = newScrollHeight;
    }
  });

  resizeObserver.observe(document.body);
};
