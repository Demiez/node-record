module.exports = (options) => {
  const cmd = 'sox';

  let args = [
    '--default-device',
    '--no-show-progress',
    '--rate',
    options.sampleRate,
    '--channels',
    options.channels,
    '--encoding',
    'signed-integer',
    '--bits',
    '16',
    '--type',
    options.audioType,
    '-',
  ];

  if (options.endOnSilence) {
    args = args.concat([
      'silence',
      '1',
      '0.1',
      options.thresholdStart || options.threshold + '%',
      '1',
      options.silence,
      options.thresholdEnd || options.threshold + '%',
    ]);
  }

  const spawnOptions = {};

  if (options.device) {
    spawnOptions.env = { ...process.env, AUDIODEV: options.device };
  }

  return { cmd, args, spawnOptions };
};
