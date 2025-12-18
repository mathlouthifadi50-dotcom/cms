module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/health-check',
      handler: 'health-check.index',
      config: {
        auth: false,
      },
    },
  ],
};
