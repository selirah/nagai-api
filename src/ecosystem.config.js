module.exports = {
  apps: [
    {
      script: 'index.js',
      watch: '.',
      env: {
        PORT: 4000,
        NODE_ENV: 'development',
        DB_NAME: 'nagai',
        DB_USER: 'postgres',
        DB_PASS: 'q$[9m6=&nY]zjZ4B',
        DB_PORT: 5432,
        DB_SYNC: false,
        DB_LOG: false,
        SMS_API_KEY: 'ncFNdrBwJS0GMRiNbLiBAFLiW',
        SMS_ENDPOINT: 'https://apps.mnotify.net/smsapi?',
        SMS_SENDER: 'NAGAI',
        SECRET_KEY: 'wDEZVncdNhPhxho',
      },
      env_production: {
        PORT: 4000,
        NODE_ENV: 'production',
        DB_NAME: 'nagai',
        DB_USER: 'postgres',
        DB_PASS: 'q$[9m6=&nY]zjZ4B',
        DB_PORT: 5432,
        DB_SYNC: false,
        DB_LOG: false,
        SMS_API_KEY: 'ncFNdrBwJS0GMRiNbLiBAFLiW',
        SMS_ENDPOINT: 'https://apps.mnotify.net/smsapi?',
        SMS_SENDER: 'NAGAI',
        SECRET_KEY: 'wDEZVncdNhPhxho',
      },
    },
    {
      script: './service-worker/',
      watch: ['./service-worker'],
    },
  ],

  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy':
        'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};
