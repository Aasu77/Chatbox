module.exports = {
  apps: [
    {
      name: "chatAppClient",
      script: "npx",
      interpreter: "none",
      args: "serve -s ./client/dist -l 8080",
    },
    {
      name: "chatAppServer",
      script: "./server/index.js",
    },
    {
      name: "chatAppSocker",
      script: "./socket/index.js",
    },
  ],
};
