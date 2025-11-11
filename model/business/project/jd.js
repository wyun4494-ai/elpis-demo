
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
  }
  ]

} 