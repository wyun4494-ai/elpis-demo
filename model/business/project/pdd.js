
module.exports = {
  name: '拼多多',
  desc: '拼多多电商系统',
  homePage: '/schema?proj_key=pdd&key=product',
  menu: [{
    key: 'product',
    name: '商品管理(拼多多)'
  }, {
    key: 'client',
    name: '客户管理(拼多多)',
  }, {
    key: 'data',
    name: '数据分析',
    menuType: 'module',
    moduleType: 'sider',
    siderConfig: {
      menu: [{
        key: 'analysis',
        name: '电商罗盘',
        menuType: 'module',
        moduleType: 'custom',
        customConfig: {
          path: '/todo'
        }
      }, {
        key: 'sider-report', 
        name: '信息查询',
        menuType: 'module',
        moduleType: 'iframe',
        iframeConfig: {
          path: 'https://leetcode.cn/'
        }
      },{
    key: 'shop-settings',
    name: '店铺设置', 
    menuType: 'group',
    subMenu: [{
      key: 'info',
      name: '店铺信息',
      menuType: 'module',
      moduleType: 'custom',
      customConfig: {
        path: '/todo'
      }
    }, {
      key: 'quality',
      name: '资质信息',
      menuType: 'module',
      moduleType: 'custom',
      customConfig: {
        path: '/todo'
      }
    }]
  }]
    }
  },{
    key: 'search',
    name: '信息查询',
    menuType: 'module',
    moduleType: 'iframe',
    iframeConfig: {
      path: 'https://leetcode.cn/'
    }
  }]
}