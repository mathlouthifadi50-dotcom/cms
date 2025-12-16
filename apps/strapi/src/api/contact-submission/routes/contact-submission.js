module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/contact-submissions',
      handler: 'contact-submission.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/contact-submissions',
      handler: 'contact-submission.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/contact-submissions/:id',
      handler: 'contact-submission.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/contact-submissions/:id',
      handler: 'contact-submission.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/contact-submissions/:id',
      handler: 'contact-submission.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
