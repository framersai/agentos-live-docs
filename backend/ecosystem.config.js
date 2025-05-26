// ecosystem.config.js
module.exports = {
    apps : [{
      name   : "voice-coding-assistant-backend",
      script : "dist/server.js",
      // Pass Node.js options directly
      node_args: "--import tsx/esm",
      // Standard PM2 options
      exec_mode: "fork", // or "cluster" if you want multiple instances
      instances: 1, // Number of instances, can be "max" for cluster mode
      watch: false, // Set to true for development, false for production
      ignore_watch : ["node_modules", "logs"], // Files/folders to ignore when watching
      output: "/dev/null", // or specify a log file path like "./logs/out.log"
      error: "/dev/null", // or specify an error log file path like "./logs/err.log"
      env: {
        "NODE_ENV": "production",
        "PORT": 3333 // Ensure your PORT is set here or in your .env file
      },
      env_development: {
        "NODE_ENV": "development",
        "PORT": 3333
      }
    }]
  };