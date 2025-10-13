const { serverStart } = require('@lesheng/elpis');

const app = serverStart({
  name: 'ElpisDemo',
  icon: 'static/logo.png',
  homePage: '/view/project-list'
})

// console.log('middlewares',app.middlewares)
// console.log('controller',app.controller)
// console.log('routerSchema',app.routerSchema)
// console.log('service',app.service)
// console.log('config',app.config)
// console.log('extend',app.logger)
// console.log('extend',app.demo)