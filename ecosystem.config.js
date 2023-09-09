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
      script: "cd server && yarn start",
    },
    {
      name: "chatAppSocker",
      script: "cd socket && yarn start",
    },
  ],
};
