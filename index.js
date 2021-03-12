'use strict';

const assert = require('assert');
const debug = require('debug')('record');
const { spawn } = require('child_process');
const recorders = require('./recorders');

class Recording {
  constructor(options = {}) {
    const defaults = {
      sampleRate: 16000,
      channels: 1,
      compress: true,
      threshold: 0.5,
      thresholdStart: null,
      thresholdEnd: null,
      silence: '1.0',
      recorder: 'sox',
      endOnSilence: false,
      audioType: 'wav',
    };

    this.options = Object.assign(defaults, options);

    const recorder = recorders.load(this.options.recorder);
    const { cmd, args, spawnOptions = {} } = recorder(this.options);

    this.cmd = cmd;
    this.args = args;
    this.cmdOptions = Object.assign(
      { encoding: 'binary', stdio: 'pipe' },
      spawnOptions
    );

    debug(`Started recording`);
    debug(this.options);
    debug(` ${this.cmd} ${this.args.join(' ')}`);

    return this.start();
  }

  start() {
    const { cmd, args, cmdOptions } = this;

    const cp = spawn(cmd, args, cmdOptions);
    const rec = cp.stdout;
    const err = cp.stderr;

    this.process = cp;
    this._stream = rec;

    cp.on('close', (code) => {
      if (code === 0) return;
      rec.emit('error', `${this.cmd} has exited with error code ${code}.`);
    });

    err.on('data', (chunk) => {
      debug(`STDERR: ${chunk}`);
    });

    rec.on('data', (chunk) => {
      debug(`Recording ${chunk.length} bytes`);
    });

    rec.on('end', () => {
      debug('Recording ended');
    });

    return this;
  }
}

module.exports = {
  record: (...args) => new Recording(...args),
};
