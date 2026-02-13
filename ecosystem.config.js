const path = require('path');

module.exports = {
  apps: [
    {
      name: 'collegechalo',
      script: 'npm',
      args: 'start',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: path.join(__dirname, 'logs', 'collegechalo-error.log'),
      out_file: path.join(__dirname, 'logs', 'collegechalo-out.log'),
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],

  deploy: {
    production: {
      user: 'ubuntu',
      host: 'your-server-ip-or-domain',
      ref: 'origin/main',
      repo: 'git@github.com:your-username/collegechalo-website.git',
      path: '/home/ubuntu/collegechalo-website',
      'post-deploy':
        'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-deploy-local': 'echo "Deploying to production"',
    },
  },
};
