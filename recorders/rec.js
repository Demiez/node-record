module.exports = (options) => {
  const cmd = 'rec';

  let args = [
    '-q',
    '-r',
    options.sampleRate,
    '-c',
    options.channels,
    '-e',
    'signed-integer',
    '-b',
    '16',
    '-t',
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

  return { cmd, args };
};
