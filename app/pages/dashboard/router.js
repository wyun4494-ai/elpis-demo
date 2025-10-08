module.exports = ({ routes, siderRoutes }) => {

// custom 路由
routes.push({
  path: '/view/dashboard/todo',
  component: () => import('./todo/todo.vue')
})
// sider 路由
siderRoutes.push({
  path: 'todo',
  component: () => import('./todo/todo.vue')
})
}