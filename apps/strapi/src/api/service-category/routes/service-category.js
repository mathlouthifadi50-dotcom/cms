module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/service-categories',
      handler: 'service-category.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/service-categories/:id',
      handler: 'service-category.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/service-categories',
      handler: 'service-category.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/service-categories/:id',
      handler: 'service-category.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/service-categories/:id',
      handler: 'service-category.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
