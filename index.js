
import classes from './classes/index.js';
import lib from './lib/index.js';

import {name, license, repository, version} from './package.json' with {type: 'json'};

export default {
  classes,
  lib,
  license,
  name,
  repository,
  version
};
