module.exports = (options) => {
  const cmd = 'arecord';

  const args = [
    '-q',
    '-r',
    options.sampleRate,
    '-c',
    options.channels,
    '-t',
    options.audioType,
    '-f',
    'S16_LE',
    '-',
  ];

  if (options.device) {
    args.unshift('-D', options.device);
  }

  return { cmd, args };
};
