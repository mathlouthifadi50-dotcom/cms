module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/global-setting',
      handler: 'global-setting.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/global-setting',
      handler: 'global-setting.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/global-setting',
      handler: 'global-setting.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
