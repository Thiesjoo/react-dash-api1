module.exports = {
  apps : [{
    name: "react-dash-api1",
    script: 'src/app.js',
    restart_delay: 3000,
    instances: "max",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  },],
};
