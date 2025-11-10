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
          role_id: {
            type: 'number',
            label: '角色',
            tableOption: {
              width: 150,
              'show-overflow-tooltip': true,
              sortable: true,
              comType: 'textFormat',
              formatMap: {
                1: '超级管理员',
                2: '审核管理员',
                3: '商品管理员',
                4: '订单管理员'
              }
            },
            searchOption: {
              comType: 'select',
              enumList: [
                { label: '全部', value: -999 },
                { label: '超级管理员', value: 1 },
                { label: '审核管理员', value: 2 },
                { label: '商品管理员', value: 3 },
                { label: '订单管理员', value: 4 }
              ]
            },
            createFormOption: {
              comType: 'select',
              enumList: [
                { label: '超级管理员', value: 1 },
                { label: '审核管理员', value: 2 },
                { label: '商品管理员', value: 3 },
                { label: '订单管理员', value: 4 }
              ],
              required: true
            },
            editFormOption: {
              comType: 'select',
              enumList: [
                { label: '超级管理员', value: 1 },
                { label: '审核管理员', value: 2 },
                { label: '商品管理员', value: 3 },
                { label: '订单管理员', value: 4 }
              ],
              required: true
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
        required: ['username', 'nickname', 'sex', 'role_id']
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
  }, {
    key: 'role',
    name: '角色管理',
    menuType: 'module',
    moduleType: 'schema',
    schemaConfig: {
      api: '/api/proj/role',
      primaryKey: 'role_id',  // 配置主键，消除 rowKey 警告
      schema: {
        type: 'object',
        properties: {
          role_id: {
            type: 'number',
            label: '编号',
            tableOption: {
              width: 70,
              sortable: true
            },
            editFormOption: {
              comType: 'input',
              disabled: true
            }
          },
          role_name: {
            type: 'string',
            label: '角色名称',
            tableOption: {
              width: 150,
              'show-overflow-tooltip': true,
              sortable: true
            },
            searchOption: {
              comType: 'input',
              placeholder: '请输入角色名称'
            },
            createFormOption: {
              comType: 'input',
              placeholder: '请输入角色名称',
              required: true
            },
            editFormOption: {
              comType: 'input',
              required: true
            }
          },
          role_desc: {
            type: 'string',
            label: '描述',
            tableOption: {
              minWidth: 200,
              'show-overflow-tooltip': true
            },
            createFormOption: {
              comType: 'textarea',
              placeholder: '请输入角色描述'
            },
            editFormOption: {
              comType: 'textarea'
            }
          },
          user_count: {
            type: 'number',
            label: '用户数量',
            tableOption: {
              width: 100,
              sortable: true
            }
          },
          status: {
            type: 'number',
            label: '是否启用',
            tableOption: {
              width: 100,
              comType: 'switch',
              activeValue: 1,
              inactiveValue: 0,
              activeText: '',
              inactiveText: '',
              showLabel: false
            },
            createFormOption: {
              comType: 'select',
              enumList: [
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 }
              ]
            },
            editFormOption: {
              comType: 'select',
              enumList: [
                { label: '启用', value: 1 },
                { label: '禁用', value: 0 }
              ]
            }
          },
          create_time: {
            type: 'string',
            label: '添加时间',
            tableOption: {
              width: 180
            }
          }
        },
        required: ['role_name']
      },
      tableConfig: {
        headerButtons: [{
          label: '添加角色',
          type: 'primary',
          plain: true,
          eventKey: 'showComponent',
          eventOption: {
            comName: 'createForm'
          }
        }],
        rowButtons: [{
          label: '分配菜单',
          type: 'info',
          eventKey: 'showComponent',
          eventOption: {
            comName: 'assignMenuDialog'
          }
        }, {
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
              role_id: 'schema::role_id'
            }
          }
        }]
      },
      componentConfig: {
        createForm: {
          title: '添加角色',
          saveBtnText: '保存'
        },
        editForm: {
          mainKey: 'role_id',
          title: '编辑角色',
          saveBtnText: '保存'
        },
        assignMenuDialog: {
          mainKey: 'role_id',
          title: '分配菜单权限',
          saveBtnText: '保存'
        }
      }
    }
  }]
}