module.exports = {
  apps: [
    {
      name: 'ghostpay-telegram-bot',
      script: './dist/index.js',
      cwd: '/root/ghostpay-telegram',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
