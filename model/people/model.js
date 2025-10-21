module.exports = {
  model: 'people',
  name: '人员管理系统',
  menu: [{
    key: 'user',
    name: '人员管理',
    menuType: 'module',
    moduleType: 'schema',
    schemaConfig: {
      api: '/api/proj/user',
      schema: {
        type: 'object',
        properties: {
          user_id: {
            type: 'string',
            label: '用户ID',
            tableOption: {
              width: 200,
              'show-overflow-tooltip': true,
              sortable: true
            }
          },
          username: {
            type: 'string',
            label: '账号',
            tableOption: {
              width: 200,
              'show-overflow-tooltip': true,
              sortable: true
            },
            searchOption: {
              comType: 'input',
              placeholder: '请输入账号'
            },
            createFormOption: {
              comType: 'input',
              placeholder: '请输入账号'
            },
            editFormOption: {
              comType: 'input',
              disabled: true
            },
            detailPanelOption: {}
          },
          password: {
            type: 'string',
            label: '密码',
            detailPanelOption: {}
          },
          nickname: {
            type: 'string',
            label: '昵称',
            tableOption: {
              width: 200,
              'show-overflow-tooltip': true,
              sortable: true
            },
            editFormOption: {
              comType: 'input',
            },
            createFormOption: {
              comType: 'input',
              placeholder: '请输入昵称'
            },
            searchOption: {
              comType: 'input',
              placeholder: '请输入昵称'
            }
          },
          desc: {
            type: 'string',
            label: '描述',
            createFormOption: {
              comType: 'textarea',
            },
            editFormOption: {
              comType: 'textarea',
            },
            detailPanelOption: {}
          },
          sex: {
            type: 'number',
            label: '性别',
            tableOption: {
              width: 150,
              'show-overflow-tooltip': true,
              sortable: true
            },
            searchOption: {
              comType: 'select',
              enumList: [{
                label: '全部',
                value: -999
              },{
                label: '男',
                value: 1
              },{
                label: '女',
                value: 2
              }]
            },
            editFormOption: {
              comType: 'select',
              enumList: [{
                label: '男',
                value: 1
              },{
                label: '女',
                value: 2
              }]
            },
            createFormOption: {
              comType: 'select',
              enumList: [{
                label: '男',
                value: 1
              },{
                label: '女',
                value: 2
              }]
            }
          },
          create_time: {
            type: 'string',
            label: '创建时间',
            tableOption: {},
            searchOption: {
              comType: 'dateRange',
            }
          }
        },
        required: ['username', 'nickname', 'sex']
      },
      tableConfig: {
        headerButtons: [{
          label: '添加人员',
          type: 'primary',
          plain: true,
          eventKey: 'showComponent',
          eventOption: {
            comName: 'createForm'
          }
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
        },{
          label: '删除',
          type: 'danger',
          eventKey: 'remove',
          eventOption: {
            params: {
              user_id: 'schema::user_id'
            }
          }
        }],
      },
      componentConfig: {
        createForm: {
          title: '添加人员',
          saveBtnText: '保存'
        },
        editForm: {
          mainKey: 'user_id',
          title: '编辑人员',
          saveBtnText: '保存'
        },
        detailPanel: {
          mainKey: 'user_id',
          title: '查看人员'
        }
      }
    }
  }]
}