module.exports = {
  apps: [{
    name: "recipe-book-api",
    script: "./dist/src/server.js",
    env_production: {
      NODE_ENV: "production"
    }
  }]
}