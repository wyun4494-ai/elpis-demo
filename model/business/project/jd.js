
module.exports = {
  name:  '京东',
  desc: '京东电商系统',
  homePage: '/sider/schema?proj_key=jd&key=product&sider_key=product-list',
  menu: [{
    key: 'product',
    name: '商品管理(京东)'
  }, {
    key: 'marketing',
    name: '营销活动',
    menuType: 'module',
    moduleType: 'sider',
    siderConfig: {
      menu: [{
        key: 'marketing-list',
        name: '营销活动列表',
      }]
    }
  }, {
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
      moduleType: 'iframe',
      iframeConfig: {
        path: 'https://leetcode.cn/'
      }
    }]
  }
  ]

} 