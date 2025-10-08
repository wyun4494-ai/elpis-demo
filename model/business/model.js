
module.exports = {
  model: 'dashboard',
  name: '电商系统',
  menu: [
    {
    key: 'product',
    name: '商品管理',
    menuType: 'module',
    moduleType: 'schema',
    schemaConfig: {
      api: '/api/proj/product',
      schema: {
        type: 'object',
        properties: {
          product_id: {
            type: 'string',
            label: '商品编号',
            tableOption: {
              width: 300,
              'show-overflow-tooltip': true // 超出宽度显示 tooltip
            },
            editFormOption: {
              comType: 'input',
              disabled: true
            },
            detailPanelOption: {}
          },
          product_name: {
            type: 'string',
            label: '商品名称',
            minLength: 3,
            maxLength: 10,
            tableOption: {
              width: 300,
            },
            searchOption: {
              comType: 'dynamicSelect',
              api: '/api/proj/product_enum/list'
            },
            createFormOption: {
              comType: 'input',
              default: '',
            },
            editFormOption: {
              comType: 'input',
            },
            detailPanelOption: {}
          },
          price: {
            type: 'number', 
            label: '价格',
            maximum: 1000,
            minimum: 0,
            tableOption: {
              width: 200,
              toFixed: 2
            },
            searchOption: { 
              comType: 'select',
              enumList: [{
                label: '全部',
                value: -999
              },{
                label: '$100',
                value: 100
              },{
                label: '$200',
                value: 200
              },{
                label: '$300',
                value: 300
              }]
            },
            createFormOption: {
              comType: 'input-number',
            },
            editFormOption: {
              comType: 'input-number',
            },
            detailPanelOption: {}
          },
          inventory: {
            type: 'number',
            label: '库存',
            tableOption: {
              width: 200,
            },
            searchOption: {
              comType: 'input',
              placeholder: '请输入库存'
            },
            createFormOption: {
              comType: 'select',
              enumList: [{
                label: '100',
                value: 100
              },{
                label: '200',
                value: 200
              },{
                label: '300',
                value: 300
              }]
            },
            editFormOption: {
              comType: 'select',
              enumList: [{
                label: '100',
                value: 100
              },{
                label: '200',
                value: 200
              },{
                label: '300',
                value: 300
              }]
            },
            detailPanelOption: {}
          },
          create_time: {
            type: 'date',
            label: '创建时间',
            tableOption: {},
            searchOption: {
              comType: 'dateRange',
            },
            detailPanelOption: {}
          }
        },
        required: ['product_name']
      },
      tableConfig: {
        headerButtons: [{
          label: '添加商品',
          type: 'primary',
          eventKey: 'showComponent',
          eventOption: { // 按钮配置
            comName: 'createForm'
          },
          plain: true // 按钮样式
        },{
          label: '展示demo',
          type: 'info',
          eventKey: 'showComponent',
          eventOption: { // 按钮配置
            comName: 'demoComponent'
          },
          plain: true // 按钮样式
        }],
        rowButtons: [{
          label: '查看',
          type: 'primary',
          eventKey: 'showComponent',
          eventOption: {
            comName: 'detailPanel'
          }
        },{
          label: '编辑',
          type: 'warning',
          eventKey: 'showComponent',
          eventOption: {
            comName: 'editForm'
          }
        }, {
          label: '删除',
          type: 'danger',
          eventKey: 'remove',
          eventOption: {
            params: {
              product_id: 'schema::product_id'
            }
          }
        }]
      },
      componentConfig: {
        createForm: {
          title: '添加商品',
          saveBtnText: '添加商品'
        },
        editForm: {
          mainKey: 'product_id',
          title: '编辑商品',
          saveBtnText: '编辑商品'
        },
        detailPanel: {
          mainKey: 'product_id',
          title: '查看商品'
        },
        demoComponent: {}
      }
    }
  }, {
    key: 'order',
    name: '订单管理',
    menuType: 'module',
    moduleType: 'custom',
    customConfig: {
      path: '/todo'
    }
  }, {
    key: 'client',
    name: '客户管理',
    menuType: 'module',
    moduleType: 'custom',
    customConfig: {
      path: '/todo'
    }
  }]
}