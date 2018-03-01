module.exports = {
  apps: [
    {
      name: process.env.NAME,
      script: 'index.js',
      instances: Number(process.env.CONCURRENT || 1),
      exec_mode: 'cluster',
      log_type: 'json',
    },
  ],
};
