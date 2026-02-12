module.exports = {
  apps: [
    {
      name: 'collegechalo',
      script: 'npm',
      args: 'start',
      cwd: '/home/ubuntu/collegechalo-website',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/pm2/collegechalo-error.log',
      out_file: '/var/log/pm2/collegechalo-out.log',
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
