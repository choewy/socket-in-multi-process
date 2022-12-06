module.exports = {
  apps: [
    {
      name: 'socket-test',
      script: './dist/main.js',
      instances: 'max',
      watch: false,
      listen_timeout: 10000,
      error_file: './logs/error.log',
      out_file: './logs/output.log',
      combine_logs: true,
      node_args: '--max_old_space_size=4096',
    },
  ],
};
