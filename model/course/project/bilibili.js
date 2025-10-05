module.exports = {
  name: 'B站课堂',
  desc: '哔哩哔哩课程管理系统',
  homePage: '/todo?proj_key=bilibili&key=video',
  menu: [{
    key: 'video',
    name: '视频管理(B站)'
  }, {
    key: 'user',
    name: '用户管理(B站)'
  }, {
    key: 'course',
    name: '课程管理',
    menuType: 'module',
    moduleType: 'sider',
    siderConfig: {
      menu: [{
        key: 'pdf',
        name: 'PDF',
        menuType: 'module',
        moduleType: 'custom',
        customConfig: {
          path: '/todo'
        }
      }, {
        key: 'excel',
        name: 'Excel',
        menuType: 'module',
        moduleType: 'custom',
        customConfig: {
          path: '/todo'
        }
      }, {
        key: 'ppt',
        name: 'PPT',
        menuType: 'module',
        moduleType: 'custom',
        customConfig: {
          path: '/todo'
        }
      }]
    }
  }]
}