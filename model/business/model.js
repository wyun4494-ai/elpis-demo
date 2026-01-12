
module.exports = {
  model: 'dashboard',
  name: '电商系统',
  menu: [{
    key: 'product',
    name: '商品管理',
    menuType: 'module',
    moduleType: 'sider',
    siderConfig: {
      menu: [{
        key: 'product-list',
        name: '商品列表',
        icon: 'List',
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
                  width: 200,
                  'show-overflow-tooltip': true, // 超出宽度显示 tooltip
                  sortable: true
                },
                editFormOption: {
                  comType: 'input',
                  disabled: true
                },
                detailPanelOption: {}
              },
              product_images: {
                type: 'array',
                label: '商品图片',
                tableOption: {
                  width: 100,
                  comType: 'image',
                  imageSize: 80
                },
                createFormOption: {
                  comType: 'upload',
                  uploadUrl: '/api/upload/product-image',
                  accept: 'image/*',
                  limit: 10,
                  maxSize: 2048  // 2MB
                },
                editFormOption: {
                  comType: 'upload',
                  uploadUrl: '/api/upload/product-image',
                  accept: 'image/*',
                  limit: 10,
                  maxSize: 2048
                },
              },
              product_detail: {
                type: 'string',
                label: '商品详情',
                createFormOption: {
                  comType: 'tiptap-editor',
                  placeholder: '请输入商品详情描述（支持富文本编辑）'
                },
                editFormOption: {
                  comType: 'tiptap-editor',
                  placeholder: '请输入商品详情描述（支持富文本编辑）'
                },
                detailPanelOption: {
                  comType: 'html',
                  span: 24
                }
              },
              product_name: {
                type: 'string',
                label: '商品名称',
                minLength: 3,
                maxLength: 10,
                tableOption: {},
                searchOption: {
                  comType: 'remote-select',
                  api: '/api/proj/product/search',
                  placeholder: '请输入商品名称搜索',
                  labelKey: 'label',
                  valueKey: 'value'
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
              category_id: {
                type: 'string',
                label: '商品分类',
                tableOption: {
                  visible: false
                },
                searchOption: {
                  comType: 'cascader',
                  api: '/api/proj/category/children',
                  placeholder: '请选择商品分类',
                  props: {
                    checkStrictly: true  // 搜索时可选任意级
                  }
                },
                createFormOption: {
                  comType: 'cascader',
                  api: '/api/proj/category/children',
                  placeholder: '请选择商品分类',
                  required: true,
                  props: {
                    checkStrictly: false  // 创建时只能选末级
                  }
                },
                editFormOption: {
                  comType: 'cascader',
                  api: '/api/proj/category/children',
                  props: {
                    checkStrictly: false
                  }
                }
              },
              category_name: {
                type: 'string',
                label: '商品分类',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {}
              },
              brand_id: {
                type: 'string',
                label: '商品品牌',
                tableOption: {
                  visible: false
                },
                searchOption: {
                  comType: 'remote-select',
                  api: '/api/proj/brand/search',
                  placeholder: '请输入品牌名称搜索',
                  labelKey: 'label',
                  valueKey: 'value'
                },
                createFormOption: {
                  comType: 'remote-select',
                  api: '/api/proj/brand/search',
                  detailApi: '/api/proj/brand',
                  placeholder: '请输入品牌名称搜索',
                  labelKey: 'label',
                  valueKey: 'value'
                },
                editFormOption: {
                  comType: 'remote-select',
                  api: '/api/proj/brand/search',
                  detailApi: '/api/proj/brand',
                  placeholder: '请输入品牌名称搜索',
                  labelKey: 'label',
                  valueKey: 'value'
                }
              },
              brand_name: {
                type: 'string',
                label: '商品品牌',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {}
              },
              price: {
                type: 'number',
                label: '价格',
                tableOption: {
                  width: 180,
                  comType: 'priceItemNumber',
                  sortable: 'custom'  // 启用后端排序
                },
                searchOption: {
                  label: '价格',
                  comType: 'input',
                  placeholder: '请输入价格'
                },
                createFormOption: {
                  comType: 'input-number',
                  min: 0,
                  max: 999999
                },
                editFormOption: {
                  comType: 'input-number',
                  min: 0,
                  max: 999999
                },
                detailPanelOption: {}
              },
              item_number: {
                type: 'string',
                label: '货号',
                tableOption: {
                  visible: false
                },
                searchOption: {
                  comType: 'input',
                  placeholder: '请输入货号'
                },
                createFormOption: {
                  comType: 'input',
                  placeholder: '请输入货号'
                },
                editFormOption: {
                  comType: 'input',
                  placeholder: '请输入货号'
                },
                detailPanelOption: {}
              },
              inventory: {
                type: 'number',
                label: '总库存',
                tableOption: {
                  width: 100,
                  sortable: 'custom'  // 启用后端排序
                },
                searchOption: {
                  comType: 'input',
                  placeholder: '请输入库存'
                },
                createFormOption: {
                  comType: 'input-number',
                  min: 0,
                  max: 999999
                },
                editFormOption: {
                  comType: 'input-number',
                  min: 0,
                  max: 999999
                },
                detailPanelOption: {}
              },
              sort_order: {
                type: 'number',
                label: '排序',
                tableOption: {
                  width: 100,
                  sortable: 'custom'
                },
                createFormOption: {
                  comType: 'input-number',
                  default: 0,
                  min: 0,
                  step: 1,
                  placeholder: '数字越小越靠前'
                },
                editFormOption: {
                  comType: 'input-number',
                  min: 0,
                  step: 1,
                  placeholder: '数字越小越靠前'
                },
                detailPanelOption: {}
              },
              shelf_status: {
                type: 'number',
                label: '标签',
                tableOption: {
                  comType: 'switch',
                  activeValue: 1,
                  inactiveValue: 0,
                  width: 110,
                  validateRules: ['checkInventory', 'checkAuditStatus']
                },
                searchOption: {
                  comType: 'select',
                  enumList: [{
                    label: '全部',
                    value: -999
                  }, {
                    label: '上架',
                    value: 1
                  }, {
                    label: '下架',
                    value: 0
                  }]
                },
                editFormOption: {
                  comType: 'switch',
                  activeValue: 1,
                  inactiveValue: 0,
                  activeText: '上架',
                  inactiveText: '下架'
                },
                detailPanelOption: {}
              },
              audit_status: {
                type: 'number',
                label: '审核状态',
                tableOption: {
                  width: 130,
                  comType: 'auditStatusButton'
                },
                searchOption: {
                  comType: 'select',
                  enumList: [
                    { label: '全部', value: -999 },
                    { label: '未审核', value: 0 },
                    { label: '已审核', value: 1 },
                    { label: '审核不通过', value: 2 }
                  ]
                },
                detailPanelOption: {}
              },
              sku_stock_status: {
                type: 'string',
                label: 'SKU库存',
                tableOption: {
                  width: 100,
                  comType: 'skuStatus'
                }
              },
              create_time: {
                type: 'date',
                label: '创建时间',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {}
              }
            },
            required: ['product_name']
          },
          tableConfig: {
            selectable: true, // 启用多选功能
            headerButtons: [{
              label: '添加商品',
              type: 'primary',
              eventKey: 'showComponent',
              eventOption: { // 按钮配置
                comName: 'stepForm'
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
                comName: 'stepForm'
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
            }],
            batchButtons: [{
              label: '批量上架',
              value: 'batchShelfOn',
              type: 'success',
              eventKey: 'batchShelfOn'
            }, {
              label: '批量下架',
              value: 'batchShelfOff',
              type: 'warning',
              eventKey: 'batchShelfOff'
            }, {
              label: '批量删除',
              value: 'batchDelete',
              type: 'danger',
              eventKey: 'batchDelete'
            }]
          },
          componentConfig: {
            stepForm: {
              mainKey: 'product_id',
              title: '商品管理',
              saveBtnText: '保存商品'
            },
            skuEditDialog: {
              mainKey: 'product_id',
              title: '编辑SKU',
              saveBtnText: '保存',
              size: '70%'
            },
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
            auditDetailDialog: {},
            demoComponent: {}
          }
        }
      }, {
        key: 'product-config',
        name: '商品配置',
        icon: 'Setting',
        menuType: 'group',
        subMenu: [{
          key: 'product-category',
          name: '商品分类',
          icon: 'FolderOpened',
          menuType: 'module',
          moduleType: 'schema',
          schemaConfig: {
            api: '/api/proj/category',
            schema: {
              type: 'object',
              properties: {
                category_id: {
                  type: 'string',
                  label: '分类ID',
                  tableOption: {
                    width: 200,
                    'show-overflow-tooltip': true
                  },
                  editFormOption: {
                    comType: 'input',
                    disabled: true
                  },
                  detailPanelOption: {}
                },
                category_name: {
                  type: 'string',
                  label: '分类名称',
                  tableOption: {
                    width: 150
                  },
                  searchOption: {
                    comType: 'input',
                    placeholder: '请输入分类名称'
                  },
                  createFormOption: {
                    comType: 'input',
                    placeholder: '请输入分类名称'
                  },
                  editFormOption: {
                    comType: 'input'
                  },
                  detailPanelOption: {}
                },
                parent_id: {
                  type: 'string',
                  label: '上级分类',
                  tableOption: {
                    visible: false
                  },
                  createFormOption: {
                    comType: 'cascader',
                    api: '/api/proj/category/children',
                    placeholder: '请选择上级分类（为空则为一级分类）',
                    props: {
                      checkStrictly: true  // 可选任意一级
                    }
                  },
                  editFormOption: {
                    comType: 'cascader',
                    api: '/api/proj/category/children',
                    disabled: true
                  },
                  detailPanelOption: {}
                },
                full_name: {
                  type: 'string',
                  label: '完整路径',
                  tableOption: {
                    'show-overflow-tooltip': true
                  },
                  detailPanelOption: {}
                },
                level: {
                  type: 'number',
                  label: '层级',
                  tableOption: {
                    width: 80,
                    sortable: 'custom'  // 启用后端排序
                  },
                  searchOption: {
                    comType: 'select',
                    default: 1,  // 默认搜索一级分类
                    enumList: [
                      { label: '全部', value: -999 },
                      { label: '一级', value: 1 },
                      { label: '二级', value: 2 },
                      { label: '三级', value: 3 },
                      { label: '四级', value: 4 }
                    ]
                  },
                  detailPanelOption: {}
                },
                sort_order: {
                  type: 'number',
                  label: '排序',
                  tableOption: {
                    width: 80,
                    sortable: 'custom'  // 启用后端排序
                  },
                  createFormOption: {
                    comType: 'input-number',
                    min: 0,
                    default: 0
                  },
                  editFormOption: {
                    comType: 'input-number',
                    min: 0
                  },
                  detailPanelOption: {}
                },
                has_children: {
                  type: 'number',
                  label: '有子分类',
                  tableOption: {
                    visible: false
                  }
                },
                create_time: {
                  type: 'date',
                  label: '创建时间',
                  tableOption: {
                    width: 180,
                    sortable: 'custom'  // 启用后端排序
                  },
                  detailPanelOption: {}
                }
              },
              required: ['category_name']
            },
            tableConfig: {
              headerButtons: [{
                label: '添加分类',
                type: 'primary',
                eventKey: 'showComponent',
                eventOption: { comName: 'createForm' },
                plain: true
              }],
              rowButtons: [{
                label: '查看子分类',
                type: 'primary',
                eventKey: 'viewSubCategories',
                eventOption: {
                  params: {
                    parent_id: 'schema::category_id',
                    parent_name: 'schema::category_name',
                    has_children: 'schema::has_children'
                  }
                }
              }, {
                label: '编辑',
                type: 'warning',
                eventKey: 'showComponent',
                eventOption: { comName: 'editForm' }
              }, {
                label: '删除',
                type: 'danger',
                eventKey: 'remove',
                eventOption: {
                  params: { category_id: 'schema::category_id' }
                }
              }]
            },
            componentConfig: {
              createForm: {
                title: '添加分类',
                saveBtnText: '保存'
              },
              editForm: {
                mainKey: 'category_id',
                title: '编辑分类',
                saveBtnText: '保存'
              },
              detailPanel: {
                mainKey: 'category_id',
                title: '查看分类'
              }
            }
          }
        },{
          key: 'product-type',
          name: '商品类型',
          icon: 'Grid',
          menuType: 'group',
          subMenu: [{
            key: 'type-manage',
            name: '类型管理',
            icon: 'Management',
            menuType: 'module',
            moduleType: 'schema',
            schemaConfig: {
              api: '/api/proj/type',
              schema: {
                type: 'object',
                properties: {
                  category_id: {
                    type: 'string',
                    label: '编号',
                    tableOption: {
                      width: 200,
                      'show-overflow-tooltip': true
                    }
                  },
                  type_name: {
                    type: 'string',
                    label: '类型名称',
                    tableOption: {}
                  },
                  attr_count: {
                    type: 'number',
                    label: '属性数量',
                    tableOption: {
                      width: 100
                    }
                  },
                  param_count: {
                    type: 'number',
                    label: '参数数量',
                    tableOption: {
                      width: 100
                    }
                  }
                }
              },
              tableConfig: {
                rowButtons: [{
                  label: '管理属性',
                  type: 'primary',
                  eventKey: 'navigate',
                  eventOption: {
                    sider_key: 'product-attribute',
                    params: {
                      category_id: 'schema::category_id',
                      type_name: 'schema::type_name'
                    }
                  }
                }, {
                  label: '管理参数',
                  type: 'primary',
                  eventKey: 'navigate',
                  eventOption: {
                    sider_key: 'product-param',
                    params: {
                      category_id: 'schema::category_id',
                      type_name: 'schema::type_name'
                    }
                  }
                }, {
                  label: '编辑',
                  type: 'warning',
                  eventKey: 'showComponent',
                  eventOption: {
                    comName: 'editTypeNameDialog'
                  }
                }, {
                  label: '删除',
                  type: 'danger',
                  eventKey: 'remove',
                  eventOption: {
                    params: {
                      category_id: 'schema::category_id'
                    }
                  }
                }]
              },
              componentConfig: {
                editTypeNameDialog: {
                  mainKey: 'category_id',
                  title: '编辑类型名称',
                  saveBtnText: '保存'
                }
              }
            }
          }, {
            key: 'product-attribute',
            name: '商品属性管理',
            icon: 'Tickets',
            menuType: 'module',
            moduleType: 'schema',
            schemaConfig: {
              api: '/api/proj/attribute',
              schema: {
                type: 'object',
                properties: {
                  attr_id: {
                    type: 'string',
                    label: '属性ID',
                    tableOption: {
                      width: 200,
                      'show-overflow-tooltip': true
                    },
                    editFormOption: {
                      comType: 'input',
                      disabled: true
                    }
                  },
                  attr_name: {
                    type: 'string',
                    label: '属性名称',
                    tableOption: {
                      width: 150
                    },
                    searchOption: {
                      comType: 'input',
                      placeholder: '请输入属性名称'
                    },
                    createFormOption: {
                      comType: 'input',
                      placeholder: '请输入属性名称',
                      required: true
                    },
                    editFormOption: {
                      comType: 'input'
                    }
                  },
                  category_id: {
                    type: 'string',
                    label: '商品类型',
                    tableOption: {
                      visible: false
                    },
                    searchOption: {
                      comType: 'cascader',
                      api: '/api/proj/category/children',
                      placeholder: '请选择商品类型',
                      props: {
                        checkStrictly: false
                      }
                    },
                    createFormOption: {
                      comType: 'cascader',
                      api: '/api/proj/category/children',
                      placeholder: '请选择商品类型',
                      required: true,
                      props: {
                        checkStrictly: false
                      }
                    },
                    editFormOption: {
                      comType: 'cascader',
                      api: '/api/proj/category/children',
                      disabled: true
                    }
                  },
                  type_name: {
                    type: 'string',
                    label: '商品类型',
                    tableOption: {}
                  },
                  predefined_values: {
                    type: 'array',
                    label: '预定义值',
                    tableOption: {
                      comType: 'textFormat',
                      'show-overflow-tooltip': true,
                      formatter: (val) => {
                        if (!val || !Array.isArray(val)) return '-';
                        return val.join(', ');
                      }
                    },
                    createFormOption: {
                      comType: 'tag-input',
                      placeholder: '输入值后回车添加'
                    },
                    editFormOption: {
                      comType: 'tag-input'
                    }
                  },
                  allow_custom: {
                    type: 'number',
                    label: '允许自定义',
                    tableOption: {
                      width: 120,
                      comType: 'textFormat',
                      displayAsSwitch: true,
                      formatter: (val) => val === 1 ? '是' : '否'
                    },
                    createFormOption: {
                      comType: 'switch',
                      activeValue: 1,
                      inactiveValue: 0,
                      default: 1
                    },
                    editFormOption: {
                      comType: 'switch',
                      activeValue: 1,
                      inactiveValue: 0
                    }
                  },
                  is_required: {
                    type: 'number',
                    label: '是否必填',
                    tableOption: {
                      width: 100,
                      comType: 'textFormat',
                      displayAsSwitch: true,
                      formatter: (val) => val === 1 ? '是' : '否'
                    },
                    createFormOption: {
                      comType: 'switch',
                      activeValue: 1,
                      inactiveValue: 0,
                      default: 1
                    },
                    editFormOption: {
                      comType: 'switch',
                      activeValue: 1,
                      inactiveValue: 0
                    }
                  },
                  sort_order: {
                    type: 'number',
                    label: '排序',
                    tableOption: {
                      width: 80,
                      sortable: 'custom'  // 启用后端排序
                    },
                    createFormOption: {
                      comType: 'input-number',
                      min: 0,
                      default: 0
                    },
                    editFormOption: {
                      comType: 'input-number',
                      min: 0
                    }
                  }
                }
              },
              tableConfig: {
                headerButtons: [{
                  label: '添加属性',
                  type: 'primary',
                  eventKey: 'showComponent',
                  eventOption: { comName: 'createForm' },
                  plain: true
                }],
                rowButtons: [{
                  label: '编辑',
                  type: 'warning',
                  eventKey: 'showComponent',
                  eventOption: { comName: 'editForm' }
                }, {
                  label: '删除',
                  type: 'danger',
                  eventKey: 'remove',
                  eventOption: {
                    params: { attr_id: 'schema::attr_id' }
                  }
                }]
              },
              componentConfig: {
                createForm: {
                  title: '添加属性',
                  saveBtnText: '保存'
                },
                editForm: {
                  mainKey: 'attr_id',
                  title: '编辑属性',
                  saveBtnText: '保存'
                }
              }
            }
          }, {
            key: 'product-param',
            name: '商品参数管理',
            icon: 'List',
            menuType: 'module',
            moduleType: 'schema',
            schemaConfig: {
              api: '/api/proj/category-param',
              schema: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    label: '关联ID',
                    tableOption: {
                      width: 250,
                      'show-overflow-tooltip': true
                    },
                    editFormOption: {
                      comType: 'input',
                      disabled: true
                    }
                  },
                  param_name: {
                    type: 'string',
                    label: '参数名称',
                    tableOption: {
                      width: 150
                    },
                    searchOption: {
                      comType: 'input',
                      placeholder: '请输入参数名称'
                    },
                    editFormOption: {
                      comType: 'input',
                      disabled: true
                    }
                  },
                  category_id: {
                    type: 'string',
                    label: '商品类型',
                    tableOption: {
                      visible: false
                    },
                    searchOption: {
                      comType: 'cascader',
                      api: '/api/proj/category/children',
                      placeholder: '请选择商品类型',
                      props: {
                        checkStrictly: false
                      }
                    }
                  },
                  type_name: {
                    type: 'string',
                    label: '商品类型',
                    tableOption: {},
                    editFormOption: {
                      comType: 'input',
                      disabled: true
                    }
                  },
                  param_category: {
                    type: 'string',
                    label: '参数来源',
                    tableOption: {
                      width: 120
                    },
                    editFormOption: {
                      comType: 'input',
                      disabled: true
                    }
                  },
                  is_required: {
                    type: 'number',
                    label: '是否必填',
                    tableOption: {
                      width: 100,
                      comType: 'textFormat',
                      displayAsSwitch: true,
                      formatter: (val) => val === 1 ? '是' : '否'
                    },
                    editFormOption: {
                      comType: 'switch',
                      activeValue: 1,
                      inactiveValue: 0
                    }
                  },
                  allow_custom: {
                    type: 'number',
                    label: '允许自定义',
                    tableOption: {
                      width: 120,
                      comType: 'textFormat',
                      displayAsSwitch: true,
                      formatter: (val) => val === 1 ? '是' : '否'
                    },
                    editFormOption: {
                      comType: 'switch',
                      activeValue: 1,
                      inactiveValue: 0
                    }
                  },
                  sort_order: {
                    type: 'number',
                    label: '排序',
                    tableOption: {
                      width: 80,
                      sortable: 'custom'  // 启用后端排序
                    },
                    editFormOption: {
                      comType: 'input-number',
                      min: 0
                    }
                  }
                }
              },
              tableConfig: {
                headerButtons: [{
                  label: '从参数库添加',
                  type: 'primary',
                  eventKey: 'showComponent',
                  eventOption: { comName: 'addFromLibrary' },
                  plain: true
                }, {
                  label: '新建参数',
                  type: 'success',
                  eventKey: 'showComponent',
                  eventOption: { comName: 'createParam' },
                  plain: true
                }],
                rowButtons: [{
                  label: '编辑',
                  type: 'warning',
                  eventKey: 'showComponent',
                  eventOption: { comName: 'editForm' }
                }, {
                  label: '删除',
                  type: 'danger',
                  eventKey: 'remove',
                  eventOption: {
                    params: { id: 'schema::id' }
                  }
                }]
              },
              componentConfig: {
                addFromLibrary: {
                  title: '从参数库添加',
                  saveBtnText: '添加'
                },
                createParam: {
                  title: '新建参数',
                  saveBtnText: '保存'
                },
                editForm: {
                  mainKey: 'id',
                  title: '编辑参数配置',
                  saveBtnText: '保存'
                }
              }
            }
          }, {
            key: 'param-library',
            name: '参数库管理',
            icon: 'Collection',
            menuType: 'module',
            moduleType: 'schema',
            schemaConfig: {
              api: '/api/proj/param-category',
              schema: {
                type: 'object',
                properties: {
                  category_id: {
                    type: 'string',
                    label: '分类ID',
                    tableOption: {
                      minWidth: 250,
                      'show-overflow-tooltip': true
                    },
                    editFormOption: {
                      comType: 'input',
                      disabled: true
                    }
                  },
                  category_name: {
                    type: 'string',
                    label: '分类名称',
                    tableOption: {
                      minWidth: 200
                    },
                    searchOption: {
                      comType: 'input',
                      placeholder: '请输入分类名称'
                    },
                    createFormOption: {
                      comType: 'input',
                      placeholder: '请输入分类名称',
                      required: true
                    },
                    editFormOption: {
                      comType: 'input',
                      placeholder: '请输入分类名称',
                      required: true
                    }
                  },
                  param_count: {
                    type: 'number',
                    label: '参数数量',
                    tableOption: {
                      width: 120,
                      align: 'center'
                    }
                  },
                  sort_order: {
                    type: 'number',
                    label: '排序',
                    tableOption: {
                      width: 100,
                      align: 'center',
                      sortable: 'custom'  // 启用后端排序
                    },
                    createFormOption: {
                      comType: 'input-number',
                      min: 0,
                      default: 0
                    },
                    editFormOption: {
                      comType: 'input-number',
                      min: 0
                    }
                  },
                  create_time: {
                    type: 'date',
                    label: '创建时间',
                    tableOption: {
                      minWidth: 180,
                      align: 'center',
                      sortable: 'custom'  // 启用后端排序
                    }
                  },
                  update_time: {
                    type: 'date',
                    label: '更新时间',
                    tableOption: {
                      minWidth: 180,
                      align: 'center',
                      sortable: 'custom'  // 启用后端排序
                    }
                  }
                },
                required: ['category_name']
              },
              tableConfig: {
                headerButtons: [{
                  label: '添加参数分类',
                  type: 'primary',
                  eventKey: 'showComponent',
                  eventOption: { comName: 'createForm' },
                  plain: true
                }, {
                  label: '新建参数',
                  type: 'success',
                  eventKey: 'showComponent',
                  eventOption: { comName: 'createParamDialog' },
                  plain: true
                }],
                rowButtons: [{
                  label: '查看',
                  type: 'primary',
                  eventKey: 'showComponent',
                  eventOption: {
                    comName: 'viewParamsDrawer'
                  }
                }, {
                  label: '编辑',
                  type: 'warning',
                  eventKey: 'showComponent',
                  eventOption: {
                    comName: 'editParamCategoryDrawer'
                  }
                }, {
                  label: '删除',
                  type: 'danger',
                  eventKey: 'remove',
                  eventOption: {
                    params: {
                      category_id: 'schema::category_id'
                    }
                  }
                }]
              },
              componentConfig: {
                createForm: {
                  title: '添加参数分类',
                  saveBtnText: '保存'
                },
                editForm: {
                  mainKey: 'category_id',
                  title: '编辑参数分类',
                  saveBtnText: '保存'
                },
                viewParamsDrawer: {
                  mainKey: 'category_id',
                  title: '查看参数',
                  type: 'drawer',
                  size: '80%'
                },
                editParamCategoryDrawer: {
                  mainKey: 'category_id',
                  title: '编辑参数分类',
                  type: 'drawer',
                  size: '80%'
                },
                createParamDialog: {
                  title: '新建参数',
                  saveBtnText: '保存'
                }
              }
            }
          }]
        },{
          key: 'product-brand',
          name: '商品品牌',
          icon: 'Star',
          menuType: 'module',
          moduleType: 'schema',
          schemaConfig: {
            api: '/api/proj/brand',
            schema: {
              type: 'object',
              properties: {
                brand_id: {
                  type: 'string',
                  label: '品牌ID',
                  tableOption: {
                    width: 200,
                    'show-overflow-tooltip': true
                  },
                  editFormOption: {
                    comType: 'input',
                    disabled: true
                  },
                  detailPanelOption: {}
                },
                brand_name: {
                  type: 'string',
                  label: '品牌名称',
                  tableOption: {
                    width: 150
                  },
                  searchOption: {
                    comType: 'input',
                    placeholder: '请输入品牌名称'
                  },
                  createFormOption: {
                    comType: 'input',
                    placeholder: '请输入品牌名称'
                  },
                  editFormOption: {
                    comType: 'input'
                  },
                  detailPanelOption: {}
                },
                brand_name_en: {
                  type: 'string',
                  label: '英文名称',
                  tableOption: {
                    visible: false
                  },
                  createFormOption: {
                    comType: 'input',
                    placeholder: '请输入英文名称'
                  },
                  editFormOption: {
                    comType: 'input'
                  },
                  detailPanelOption: {}
                },
                first_letter: {
                  type: 'string',
                  label: '首字母',
                  tableOption: {
                    width: 90,
                    sortable: 'custom'  // 启用后端排序
                  },
                  searchOption: {
                    comType: 'select',
                    enumList: [
                      { label: '全部', value: -999 },
                      { label: 'A', value: 'A' },
                      { label: 'B', value: 'B' },
                      { label: 'C', value: 'C' },
                      { label: 'D', value: 'D' },
                      { label: 'E', value: 'E' },
                      { label: 'F', value: 'F' },
                      { label: 'G', value: 'G' },
                      { label: 'H', value: 'H' },
                      { label: 'I', value: 'I' },
                      { label: 'J', value: 'J' },
                      { label: 'K', value: 'K' },
                      { label: 'L', value: 'L' },
                      { label: 'M', value: 'M' },
                      { label: 'N', value: 'N' },
                      { label: 'O', value: 'O' },
                      { label: 'P', value: 'P' },
                      { label: 'Q', value: 'Q' },
                      { label: 'R', value: 'R' },
                      { label: 'S', value: 'S' },
                      { label: 'T', value: 'T' },
                      { label: 'U', value: 'U' },
                      { label: 'V', value: 'V' },
                      { label: 'W', value: 'W' },
                      { label: 'X', value: 'X' },
                      { label: 'Y', value: 'Y' },
                      { label: 'Z', value: 'Z' },
                      { label: '#', value: '#' }
                    ]
                  },
                  detailPanelOption: {}
                },
                logo_url: {
                  type: 'string',
                  label: '品牌Logo',
                  tableOption: {
                    width: 120,
                    comType: 'image',
                    imageSize: 80  // 图片大小
                  },
                  createFormOption: {
                    comType: 'upload',
                    uploadUrl: '/api/upload/brand-logo',
                    accept: 'image/*',
                    limit: 1,
                    maxSize: 500
                  },
                  editFormOption: {
                    comType: 'upload',
                    uploadUrl: '/api/upload/brand-logo',
                    accept: 'image/*',
                    limit: 1,
                    maxSize: 500
                  },
                  detailPanelOption: {}
                },
                description: {
                  type: 'string',
                  label: '品牌描述',
                  tableOption: {
                    'show-overflow-tooltip': true
                  },
                  createFormOption: {
                    comType: 'input',
                    type: 'textarea',
                    rows: 3,
                    placeholder: '请输入品牌描述'
                  },
                  editFormOption: {
                    comType: 'input',
                    type: 'textarea',
                    rows: 3
                  },
                  detailPanelOption: {}
                },
                sort_order: {
                  type: 'number',
                  label: '排序',
                  tableOption: {
                    width: 80,
                    sortable: 'custom'  // 启用后端排序
                  },
                  createFormOption: {
                    comType: 'input-number',
                    min: 0,
                    default: 0
                  },
                  editFormOption: {
                    comType: 'input-number',
                    min: 0
                  },
                  detailPanelOption: {}
                },
                create_time: {
                  type: 'date',
                  label: '创建时间',
                  tableOption: {
                    width: 180,
                    sortable: 'custom'  // 启用后端排序
                  },
                  detailPanelOption: {}
                }
              },
              required: ['brand_name']
            },
            tableConfig: {
              headerButtons: [{
                label: '添加品牌',
                type: 'primary',
                eventKey: 'showComponent',
                eventOption: { comName: 'createForm' },
                plain: true
              }],
              rowButtons: [{
                label: '查看',
                type: 'primary',
                eventKey: 'showComponent',
                eventOption: { comName: 'detailPanel' }
              }, {
                label: '编辑',
                type: 'warning',
                eventKey: 'showComponent',
                eventOption: { comName: 'editForm' }
              }, {
                label: '删除',
                type: 'danger',
                eventKey: 'remove',
                eventOption: {
                  params: { brand_id: 'schema::brand_id' }
                }
              }]
            },
            componentConfig: {
              createForm: {
                title: '添加品牌',
                saveBtnText: '保存'
              },
              editForm: {
                mainKey: 'brand_id',
                title: '编辑品牌',
                saveBtnText: '保存'
              },
              detailPanel: {
                mainKey: 'brand_id',
                title: '查看品牌'
              }
            }
          }
        }
      ]
    },{
      key: 'product-audit',
      name: '商品审核',
      icon: 'CircleCheck',
      menuType: 'module',
      moduleType: 'schema',
      schemaConfig: {
        api: '/api/proj/product-audit',
        schema: {
          type: 'object',
          properties: {
            product_name: {
              type: 'string',
              label: '商品名称',
              tableOption: {
                minWidth: 200  // 使用 minWidth 代替 width，让列自动填充剩余空间
              },
              searchOption: {
                comType: 'input',
                placeholder: '请输入商品名称'
              }
            },
            category_name: {
              type: 'string',
              label: '商品分类',
              tableOption: {
                width: 150
              }
            },
            brand_name: {
              type: 'string',
              label: '品牌',
              tableOption: {
                width: 120
              }
            },
            price: {
              type: 'number',
              label: '价格',
              tableOption: {
                width: 120
              }
            },
            audit_status: {
              type: 'number',
              label: '审核状态',
              tableOption: {
                width: 130,
                comType: 'auditStatusButton',
                eventKey: 'showComponent',
                eventOption: {
                  comName: 'auditDetailDialog',
                  mode: 'view'
                }
              },
              searchOption: {
                comType: 'select',
                default: 0,  // 默认选中"未审核"
                enumList: [{
                  label: '全部',
                  value: -999
                }, {
                  label: '未审核',
                  value: 0
                }, {
                  label: '已审核',
                  value: 1
                }, {
                  label: '审核不通过',
                  value: 2
                }]
              }
            },
            create_time: {
              type: 'string',
              label: '创建时间',
              tableOption: {
                width: 180,
                sortable: 'custom'
              },
              searchOption: {
                comType: 'dateRange',  // ✅ 修复：使用正确的组件类型名称
                placeholder: '请选择创建时间范围'
              },
              detailPanelOption: {}
            },
            update_time: {
              type: 'string',
              label: '更新时间',
              tableOption: {
                width: 180,
                sortable: 'custom'
              },
              detailPanelOption: {}
            }
          }
        },
        tableConfig: {
          selectable: true,  // ✅ 启用多选功能（用于批量审核）
          rowButtons: [{
            label: '审核',
            type: 'primary',
            eventKey: 'showComponent',
            eventOption: {
              comName: 'auditDetailDialog'
            },
            show: (row) => row.audit_status === 0
          }],
          batchButtons: [{
            label: '批量审核通过',
            value: 'batchApprove',
            type: 'success',
            eventKey: 'batchApprove'
          }, {
            label: '批量审核拒绝',
            value: 'batchReject',
            type: 'danger',
            eventKey: 'batchReject'
          }]
        },
        componentConfig: {
          auditDetailDialog: {},
          batchAuditDialog: {}
        }
      }
    },{
      key: 'stock-alert',
      name: '库存预警',
      icon: 'Warning',
      menuType: 'module',
      moduleType: 'schema',
      schemaConfig: {
        api: '/api/proj/stock-alert',
        schema: {
          type: 'object',
          properties: {
            product_name: {
              type: 'string',
              label: '商品名称',
              tableOption: {},
              searchOption: {
                comType: 'input',
                placeholder: '请输入商品名称'
              }
            },
            sku_name: {
              type: 'string',
              label: 'SKU',
              tableOption: {
                width: 200
              }
            },
            inventory: {
              type: 'number',
              label: '当前库存',
              tableOption: {
                width: 100
              }
            },
            stock_alert: {
              type: 'number',
              label: '预警值',
              tableOption: {
                width: 100
              }
            },
            alert_label: {
              type: 'string',
              label: '预警级别',
              tableOption: {
                width: 120
              },
              searchOption: {
                label: '预警级别',
                comType: 'select',
                enumList: [{
                  label: '全部',
                  value: -999
                }, {
                  label: '缺货',
                  value: 3
                }, {
                  label: '严重',
                  value: 2
                }, {
                  label: '警告',
                  value: 1
                }]
              }
            },
            create_time: {
              type: 'date',
              label: '创建时间',
              tableOption: {
                width: 180,
                sortable: 'custom'  // 启用后端排序
              },
              searchOption: {
                comType: 'dateRange',  // ✅ 修复：使用正确的组件类型名称
                placeholder: '请选择创建时间范围'
              }
            }
          }
        },
        tableConfig: {
          selectable: true,  // ✅ 启用多选功能
          rowButtons: [{
            label: '补货',
            type: 'primary',
            eventKey: 'showComponent',
            eventOption: {
              comName: 'restockDialog'
            }
          }],
          batchButtons: [{
            label: '批量补货',
            value: 'batchRestock',  // ✅ 批量操作的唯一标识
            type: 'primary',
            eventKey: 'batchRestock'  // ✅ 触发的事件名
          }]
        },
        componentConfig: {
          restockDialog: {
            title: '库存补货',
            saveBtnText: '确认补货'
          },
          batchRestockDialog: {
            title: '批量库存补货',
            saveBtnText: '确认补货'
          }
        },
        components: {
          batchRestockDialog: {}
        }
      }
    },{
      key: 'product-recycle',
      name: '商品回收站',
      icon: 'Delete',
      menuType: 'module',
      moduleType: 'schema',
      schemaConfig: {
        api: '/api/proj/product/recycle',
        schema: {
          type: 'object',
          properties: {
            product_id: {
              type: 'string',
              label: '商品编号',
              tableOption: {
                width: 200,
                'show-overflow-tooltip': true,
                sortable: true
              },
              detailPanelOption: {}
            },
            product_name: {
              type: 'string',
              label: '商品名称',
              tableOption: {
                width: 200,
              },
              searchOption: {
                comType: 'input',
                placeholder: '请输入商品名称'
              },
              detailPanelOption: {}
            },
            price: {
              type: 'number',
              label: '价格',
              tableOption: {
                width: 150,
                toFixed: 2
              },
              detailPanelOption: {}
            },
            inventory: {
              type: 'number',
              label: '库存',
              tableOption: {
                width: 150,
              },
              detailPanelOption: {}
            },
            create_time: {
              type: 'date',
              label: '创建时间',
              tableOption: {
                width: 180,
                sortable: 'custom'  // ✅ 启用后端排序
              },
              detailPanelOption: {}
            },
            delete_time: {
              type: 'date',
              label: '删除时间',
              tableOption: {
                width: 180,
                sortable: 'custom'  // ✅ 启用后端排序
              },
              searchOption: {
                comType: 'dateRange',
                placeholder: '请选择删除时间范围'
              },
              detailPanelOption: {}
            },
            delete_reason: {
              type: 'string',
              label: '删除原因',
              tableOption: {
                width: 200,
                'show-overflow-tooltip': true
              },
              detailPanelOption: {}
            },
            deleted_by: {
              type: 'string',
              label: '删除人',
              tableOption: {
                width: 120
              },
              detailPanelOption: {}
            }
          }
        },
        tableConfig: {
          selectable: true,  // ✅ 启用多选功能
          headerButtons: [],
          rowButtons: [{
            label: '查看',
            type: 'primary',
            eventKey: 'showComponent',
            eventOption: {
              comName: 'detailPanel'
            }
          }, {
            label: '恢复',
            type: 'success',
            eventKey: 'restore',
            eventOption: {
              params: {
                product_id: 'schema::product_id'
              }
            }
          }, {
            label: '永久删除',
            type: 'danger',
            eventKey: 'permanentDelete',
            eventOption: {
              params: {
                product_id: 'schema::product_id'
              }
            }
          }],
          batchButtons: [{
            label: '批量恢复',
            value: 'batchRestore',
            type: 'success',
            eventKey: 'batchRestore'
          }, {
            label: '批量永久删除',
            value: 'batchPermanentDelete',
            type: 'danger',
            eventKey: 'batchPermanentDelete'
          }]
        },
        componentConfig: {
          detailPanel: {
            mainKey: 'product_id',
            title: '查看删除商品详情'
          },
          batchRestoreDialog: {
            title: '批量恢复商品'
          },
          batchPermanentDeleteDialog: {
            title: '批量永久删除商品'
          }
        },
        components: {
          batchRestoreDialog: {},
          batchPermanentDeleteDialog: {}
        }
      }
    }]
  }
},{
    key: 'marketing',
    name: '营销管理',
    menuType: 'module',
    moduleType: 'sider',
    siderConfig: {
      menu: [{
        key: 'flash-sale',
        name: '秒杀活动列表',
        icon: 'Timer',
        menuType: 'module',
        moduleType: 'schema',
        schemaConfig: {
        api: '/api/proj/flash-sale',
        primaryKey: 'flash_sale_id',
        schema: {
          type: 'object',
          properties: {
            flash_sale_id: {
              type: 'string',
              label: '活动ID',
              tableOption: {
                'min-width': 180,
                'show-overflow-tooltip': true
              },
              detailPanelOption: {}
            },
            activity_name: {
              type: 'string',
              label: '活动名称',
              tableOption: {
                'min-width': 200,
                'show-overflow-tooltip': true
              },
              searchOption: {
                comType: 'input',
                placeholder: '请输入活动名称'
              },
              createFormOption: {
                comType: 'input',
                placeholder: '请输入活动名称',
                required: true
              },
              editFormOption: {
                comType: 'input',
                required: true
              },
              detailPanelOption: {}
            },
            activity_desc: {
              type: 'string',
              label: '活动描述',
              tableOption: {
                visible: false
              },
              createFormOption: {
                comType: 'textarea',
                placeholder: '请输入活动描述'
              },
              editFormOption: {
                comType: 'textarea'
              },
              detailPanelOption: {}
            },
            start_time: {
              type: 'string',
              label: '开始时间',
              tableOption: {
                'min-width': 180
              },
              searchOption: {
                comType: 'dateRange'
              },
              createFormOption: {
                comType: 'datetime',
                placeholder: '请选择开始时间',
                required: true
              },
              editFormOption: {
                comType: 'datetime',
                required: true
              },
              detailPanelOption: {}
            },
            end_time: {
              type: 'string',
              label: '结束时间',
              tableOption: {
                'min-width': 180
              },
              createFormOption: {
                comType: 'datetime',
                placeholder: '请选择结束时间',
                required: true
              },
              editFormOption: {
                comType: 'datetime',
                required: true
              },
              detailPanelOption: {}
            },
            activity_status: {
              type: 'number',
              label: '开始/结束',
              tableOption: {
                width: 120,
                comType: 'switch',
                activeValue: 1,
                inactiveValue: 0,
                showLabel: false,
                validateRules: ['checkStartTime']
              },
              searchOption: {
                comType: 'select',
                enumList: [
                  { label: '全部', value: -999 },
                  { label: '未开始', value: 0 },
                  { label: '进行中', value: 1 }
                ]
              },
              createFormOption: {
                comType: 'switch',
                activeValue: 1,
                inactiveValue: 0,
                activeText: '开始',
                inactiveText: '结束',
                default: 0
              },
              editFormOption: {
                comType: 'switch',
                activeValue: 1,
                inactiveValue: 0,
                activeText: '开始',
                inactiveText: '结束'
              },
              detailPanelOption: {
                comType: 'textFormat',
                formatter: (val) => val === 1 ? '进行中' : '未开始'
              }
            },
            total_stock: {
              type: 'number',
              label: '总库存',
              tableOption: {
                visible: false
              },
              detailPanelOption: {}
            },
            sold_count: {
              type: 'number',
              label: '已售数量',
              tableOption: {
                visible: false
              },
              detailPanelOption: {}
            },
            total_amount: {
              type: 'number',
              label: '总销售额',
              tableOption: {
                visible: false
              },
              detailPanelOption: {}
            },
            participant_count: {
              type: 'number',
              label: '参与人数',
              tableOption: {
                visible: false
              },
              detailPanelOption: {}
            },
            sort_order: {
              type: 'number',
              label: '排序',
              tableOption: {
                visible: false
              },
              createFormOption: {
                comType: 'input-number',
                placeholder: '数字越小越靠前',
                default: 0
              },
              editFormOption: {
                comType: 'input-number'
              },
              detailPanelOption: {}
            },
            banner_image: {
              type: 'string',
              label: 'Banner图',
              tableOption: {
                visible: false
              },
              createFormOption: {
                comType: 'upload',
                uploadUrl: '/api/upload/image',
                accept: 'image/*',
                limit: 1,
                maxSize: 1024
              },
              editFormOption: {
                comType: 'upload',
                uploadUrl: '/api/upload/image',
                accept: 'image/*',
                limit: 1,
                maxSize: 1024
              },
              detailPanelOption: {
                comType: 'image'
              }
            },
            create_time: {
              type: 'string',
              label: '创建时间',
              tableOption: {
                visible: false
              },
              detailPanelOption: {}
            }
          },
          required: ['activity_name', 'start_time', 'end_time']
        },
        tableConfig: {
          selectable: true,
          headerButtons: [{
            label: '秒杀时间段列表',
            type: 'info',
            plain: true,
            eventKey: 'showComponent',
            eventOption: {
              comName: 'timeSlotListDialog'
            }
          }, {
            label: '添加活动',
            type: 'primary',
            plain: true,
            eventKey: 'showComponent',
            eventOption: {
              comName: 'createForm'
            }
          }],
          batchButtons: [{
            label: '批量删除',
            value: 'batchDelete',
            type: 'danger',
            eventKey: 'batchDelete'
          }],
          rowButtons: [{
            label: '查看',
            type: 'primary',
            eventKey: 'showComponent',
            eventOption: {
              comName: 'detailPanel'
            }
          }, {
            label: '设置商品',
            type: 'primary',
            eventKey: 'showComponent',
            eventOption: {
              comName: 'productDrawer'
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
                flash_sale_id: 'schema::flash_sale_id'
              }
            }
          }]
        },
        componentConfig: {
          createForm: {
            mainKey: 'flash_sale_id',
            title: '添加秒杀活动',
            saveBtnText: '保存'
          },
          editForm: {
            mainKey: 'flash_sale_id',
            title: '编辑秒杀活动',
            saveBtnText: '保存'
          },
          detailPanel: {
            mainKey: 'flash_sale_id',
            title: '查看秒杀活动详情'
          },
          timeSlotListDialog: {
            title: '秒杀时间段列表',
            size: '80%'
          },
          productDrawer: {
            mainKey: 'flash_sale_id',
            title: '设置秒杀商品',
            saveBtnText: '保存'
          }
        }
        }
      }, {
        key: 'coupon-list',
        name: '优惠券列表',
        icon: 'Ticket',
        menuType: 'module',
        moduleType: 'schema',
        schemaConfig: {
          api: '/api/proj/coupon',
          primaryKey: 'coupon_id',
          schema: {
            type: 'object',
            properties: {
              coupon_id: {
                type: 'string',
                label: '优惠券ID',
                tableOption: {
                  'min-width': 180,
                  'show-overflow-tooltip': true
                },
                detailPanelOption: {}
              },
              coupon_name: {
                type: 'string',
                label: '优惠券名称',
                tableOption: {
                  'min-width': 200,
                  'show-overflow-tooltip': true
                },
                searchOption: {
                  comType: 'input',
                  placeholder: '请输入优惠券名称'
                },
                createFormOption: {
                  comType: 'input',
                  placeholder: '请输入优惠券名称',
                  required: true,
                  maxlength: 200
                },
                editFormOption: {
                  comType: 'input',
                  required: true,
                  maxlength: 200
                },
                detailPanelOption: {}
              },
              coupon_config: {
                type: 'object',
                label: '优惠券配置',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'coupon-form'
                },
                editFormOption: {
                  comType: 'coupon-form'
                }
              },
              coupon_type: {
                type: 'number',
                label: '优惠券类型',
                tableOption: {
                  visible: false
                },
                searchOption: {
                  comType: 'select',
                  placeholder: '请选择类型',
                  enumList: [
                    { label: '全部', value: -999 },
                    { label: '满减券', value: 1 },
                    { label: '折扣券', value: 2 },
                    { label: '无门槛券', value: 3 }
                  ]
                },
                detailPanelOption: {
                  comType: 'textFormat',
                  formatter: (val) => {
                    const typeMap = { 1: '满减券', 2: '折扣券', 3: '无门槛券' }
                    return typeMap[val] || '-'
                  }
                }
              },
              coupon_type_text: {
                type: 'string',
                label: '优惠券类型',
                tableOption: {
                  width: 120
                }
              },
              discount_amount: {
                type: 'number',
                label: '优惠金额（元）',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {}
              },
              discount_rate: {
                type: 'number',
                label: '折扣率',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {}
              },
              min_amount: {
                type: 'number',
                label: '最低消费（元）',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {}
              },
              max_discount: {
                type: 'number',
                label: '最高优惠（元）',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {}
              },
              total_count: {
                type: 'number',
                label: '发行总量',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {}
              },
              received_count: {
                type: 'number',
                label: '已领取',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {}
              },
              used_count: {
                type: 'number',
                label: '已使用',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {}
              },
              limit_per_user: {
                type: 'number',
                label: '每人限领',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {}
              },
              valid_days: {
                type: 'number',
                label: '有效天数',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {}
              },
              start_time: {
                type: 'string',
                label: '开始时间',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {}
              },
              end_time: {
                type: 'string',
                label: '结束时间',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {}
              },
              coupon_status: {
                type: 'number',
                label: '状态',
                tableOption: {
                  visible: false
                },
                searchOption: {
                  comType: 'select',
                  placeholder: '请选择状态',
                  enumList: [
                    { label: '全部', value: -999 },
                    { label: '未开始', value: 0 },
                    { label: '进行中', value: 1 },
                    { label: '已结束', value: 2 }
                  ]
                },
                detailPanelOption: {
                  comType: 'textFormat',
                  formatter: (val) => {
                    const statusMap = { 0: '未开始', 1: '进行中', 2: '已结束' }
                    return statusMap[val] || '-'
                  }
                }
              },
              coupon_status_text: {
                type: 'string',
                label: '状态',
                tableOption: {
                  width: 100
                }
              },
              description: {
                type: 'string',
                label: '使用说明',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {}
              },
              applicable_products: {
                type: 'array',
                label: '适用商品',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {
                  comType: 'textFormat',
                  formatter: (val) => {
                    if (!val || val.length === 0) {
                      return '全场通用'
                    }
                    return val.map(item => `${item.product_name} (${item.item_number || '无货号'})`).join('、')
                  }
                }
              },
              applicable_categories: {
                type: 'array',
                label: '适用分类',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {
                  comType: 'textFormat',
                  formatter: (val) => {
                    if (!val || val.length === 0) {
                      return '全场通用'
                    }
                    return val.map(item => item.category_name).join('、')
                  }
                }
              },
              sort_order: {
                type: 'number',
                label: '排序',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {}
              },
              create_time: {
                type: 'string',
                label: '创建时间',
                tableOption: {
                  'min-width': 180
                },
                detailPanelOption: {}
              }
            },
            required: ['coupon_name', 'coupon_type']
          },
          tableConfig: {
            selectable: true,
            headerButtons: [{
              label: '添加优惠券',
              type: 'primary',
              plain: true,
              eventKey: 'showComponent',
              eventOption: {
                comName: 'createForm'
              }
            }],
            batchButtons: [{
              label: '批量删除',
              value: 'batchDelete',
              type: 'danger',
              eventKey: 'batchDelete'
            }],
            rowButtons: [{
              label: '查看',
              type: 'primary',
              eventKey: 'showComponent',
              eventOption: {
                comName: 'couponDetailDrawer'
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
                  coupon_id: 'schema::coupon_id'
                }
              }
            }]
          },
          componentConfig: {
            createForm: {
              mainKey: 'coupon_id',
              title: '添加优惠券',
              saveBtnText: '保存'
            },
            editForm: {
              mainKey: 'coupon_id',
              title: '编辑优惠券',
              saveBtnText: '保存'
            },
            couponDetailDrawer: {
              mainKey: 'coupon_id',
              title: '优惠券详情',
              size: '80%'
            }
          }
        }
      }, {
        key: 'brand-recommend-list',
        name: '品牌推荐列表',
        icon: 'Star',
        menuType: 'module',
        moduleType: 'schema',
        schemaConfig: {
          api: '/api/proj/brand-recommend',
          primaryKey: 'recommend_id',
          schema: {
            type: 'object',
            properties: {
              recommend_id: {
                type: 'string',
                label: '推荐ID',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {}
              },
              brand_id: {
                type: 'string',
                label: '品牌ID',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'remote-select',
                  placeholder: '请选择品牌',
                  required: true,
                  api: '/api/proj/brand-recommend/available-brands',
                  labelKey: 'brand_name',
                  valueKey: 'brand_id'
                },
                detailPanelOption: {}
              },
              brand_name: {
                type: 'string',
                label: '品牌名称',
                tableOption: {
                  'min-width': 200,
                  'show-overflow-tooltip': true
                },
                searchOption: {
                  comType: 'input',
                  placeholder: '请输入品牌名称'
                },
                detailPanelOption: {}
              },
              brand_logo: {
                type: 'string',
                label: '品牌Logo',
                tableOption: {
                  width: 100,
                  comType: 'image'
                },
                detailPanelOption: {
                  comType: 'image'
                }
              },
              recommend_title: {
                type: 'string',
                label: '推荐标题',
                tableOption: {
                  'min-width': 200,
                  'show-overflow-tooltip': true
                },
                createFormOption: {
                  comType: 'input',
                  placeholder: '请输入推荐标题（可选）',
                  maxlength: 200
                },
                editFormOption: {
                  comType: 'input',
                  maxlength: 200
                },
                detailPanelOption: {}
              },
              recommend_desc: {
                type: 'string',
                label: '推荐描述',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'textarea',
                  placeholder: '请输入推荐描述（可选）',
                  rows: 3
                },
                editFormOption: {
                  comType: 'textarea',
                  rows: 3
                },
                detailPanelOption: {}
              },
              banner_image: {
                type: 'string',
                label: '推荐图片',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'upload',
                  placeholder: '上传推荐图片（可选，覆盖品牌Logo）',
                  uploadUrl: '/api/upload/image',
                  accept: 'image/*'
                },
                editFormOption: {
                  comType: 'upload',
                  uploadUrl: '/api/upload/image',
                  accept: 'image/*'
                },
                detailPanelOption: {
                  comType: 'image'
                }
              },
              link_url: {
                type: 'string',
                label: '跳转链接',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'input',
                  placeholder: '请输入跳转链接（可选，默认跳转品牌页）',
                  maxlength: 500
                },
                editFormOption: {
                  comType: 'input',
                  maxlength: 500
                },
                detailPanelOption: {}
              },
              time_range: {
                type: 'string',
                label: '推荐时间',
                tableOption: {
                  'min-width': 300,
                  'show-overflow-tooltip': true
                },
                detailPanelOption: {}
              },
              start_time: {
                type: 'string',
                label: '开始时间',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'datetime',
                  placeholder: '请选择开始时间（可选）'
                },
                editFormOption: {
                  comType: 'datetime'
                },
                detailPanelOption: {}
              },
              end_time: {
                type: 'string',
                label: '结束时间',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'datetime',
                  placeholder: '请选择结束时间（可选）'
                },
                editFormOption: {
                  comType: 'datetime'
                },
                detailPanelOption: {}
              },
              view_count: {
                type: 'number',
                label: '点击量',
                tableOption: {
                  width: 100
                },
                detailPanelOption: {}
              },
              is_enabled: {
                type: 'number',
                label: '是否推荐',
                tableOption: {
                  width: 120,
                  comType: 'switch',
                  activeValue: 1,
                  inactiveValue: 0,
                  showLabel: false,
                  eventKey: 'switchChange',
                  eventOption: {
                    api: '/api/proj/brand-recommend/toggle',
                    params: {
                      recommend_id: 'schema::recommend_id',
                      is_enabled: 'schema::is_enabled'
                    }
                  }
                },
                searchOption: {
                  comType: 'select',
                  placeholder: '请选择状态',
                  enumList: [
                    { label: '全部', value: '' },
                    { label: '已启用', value: 1 },
                    { label: '已禁用', value: 0 }
                  ]
                },
                createFormOption: {
                  comType: 'switch',
                  activeValue: 1,
                  inactiveValue: 0,
                  default: 1
                },
                editFormOption: {
                  comType: 'switch',
                  activeValue: 1,
                  inactiveValue: 0
                },
                detailPanelOption: {}
              },
              recommend_status_text: {
                type: 'string',
                label: '推荐状态',
                tableOption: {
                  width: 100
                },
                searchOption: {
                  comType: 'select',
                  placeholder: '请选择推荐状态',
                  enumList: [
                    { label: '全部', value: '' },
                    { label: '未开始', value: 0 },
                    { label: '进行中', value: 1 },
                    { label: '已结束', value: 2 }
                  ]
                },
                detailPanelOption: {}
              },
              sort_order: {
                type: 'number',
                label: '排序',
                tableOption: {
                  width: 100
                },
                createFormOption: {
                  comType: 'input-number',
                  placeholder: '数字越小越靠前',
                  min: 0,
                  default: 0
                },
                editFormOption: {
                  comType: 'input-number',
                  min: 0
                },
                detailPanelOption: {}
              },
              create_time: {
                type: 'string',
                label: '创建时间',
                tableOption: {
                  'min-width': 180
                },
                detailPanelOption: {}
              }
            },
            required: ['brand_id']
          },
          tableConfig: {
            selectable: true,
            headerButtons: [{
              label: '添加推荐',
              type: 'primary',
              plain: true,
              eventKey: 'showComponent',
              eventOption: {
                comName: 'createForm'
              }
            }],
            batchButtons: [{
              label: '批量设为推荐',
              value: 'batchEnable',
              type: 'success',
              eventKey: 'batchEnable',
              eventOption: {
                api: '/api/proj/brand-recommend/batch/enable',
                dataKey: 'recommend_ids',
                primaryKey: 'recommend_id'
              }
            }, {
              label: '批量取消推荐',
              value: 'batchDisable',
              type: 'warning',
              eventKey: 'batchDisable',
              eventOption: {
                api: '/api/proj/brand-recommend/batch/disable',
                dataKey: 'recommend_ids',
                primaryKey: 'recommend_id'
              }
            }, {
              label: '批量删除',
              value: 'batchDelete',
              type: 'danger',
              eventKey: 'batchDelete'
            }],
            rowButtons: [{
              label: '查看',
              type: 'primary',
              eventKey: 'showComponent',
              eventOption: {
                comName: 'detailPanel'
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
                  recommend_id: 'schema::recommend_id'
                }
              }
            }]
          },
          componentConfig: {
            createForm: {
              mainKey: 'recommend_id',
              title: '添加品牌推荐',
              saveBtnText: '保存'
            },
            editForm: {
              mainKey: 'recommend_id',
              title: '编辑品牌推荐',
              saveBtnText: '保存'
            },
            detailPanel: {
              mainKey: 'recommend_id',
              title: '品牌推荐详情'
            }
          }
        }
      }, {
        key: 'new-product-recommend-list',
        name: '新品推荐列表',
        icon: 'Goods',
        menuType: 'module',
        moduleType: 'schema',
        schemaConfig: {
          api: '/api/proj/new-product-recommend',
          primaryKey: 'recommend_id',
          schema: {
            type: 'object',
            properties: {
              recommend_id: {
                type: 'string',
                label: '推荐ID',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {}
              },
              product_id: {
                type: 'string',
                label: '商品ID',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'remote-select',
                  placeholder: '请选择商品',
                  required: true,
                  api: '/api/proj/new-product-recommend/available-products',
                  labelKey: 'product_name',
                  valueKey: 'product_id'
                },
                detailPanelOption: {}
              },
              product_name: {
                type: 'string',
                label: '商品名称',
                tableOption: {
                  'min-width': 200,
                  'show-overflow-tooltip': true
                },
                searchOption: {
                  comType: 'input',
                  placeholder: '请输入商品名称'
                },
                detailPanelOption: {}
              },
              product_images: {
                type: 'array',
                label: '商品图片',
                tableOption: {
                  width: 100,
                  comType: 'image'
                },
                detailPanelOption: {
                  comType: 'image'
                }
              },
              price: {
                type: 'number',
                label: '商品价格',
                tableOption: {
                  width: 120
                },
                detailPanelOption: {}
              },
              recommend_title: {
                type: 'string',
                label: '推荐标题',
                tableOption: {
                  'min-width': 200,
                  'show-overflow-tooltip': true
                },
                createFormOption: {
                  comType: 'input',
                  placeholder: '请输入推荐标题（可选）',
                  maxlength: 200
                },
                editFormOption: {
                  comType: 'input',
                  maxlength: 200
                },
                detailPanelOption: {}
              },
              recommend_desc: {
                type: 'string',
                label: '推荐描述',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'textarea',
                  placeholder: '请输入推荐描述（可选）',
                  rows: 3
                },
                editFormOption: {
                  comType: 'textarea',
                  rows: 3
                },
                detailPanelOption: {}
              },
              recommend_image: {
                type: 'string',
                label: '推荐图片',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'upload',
                  placeholder: '上传推荐图片（可选，覆盖商品图）',
                  uploadUrl: '/api/upload/image',
                  accept: 'image/*'
                },
                editFormOption: {
                  comType: 'upload',
                  uploadUrl: '/api/upload/image',
                  accept: 'image/*'
                },
                detailPanelOption: {
                  comType: 'image'
                }
              },
              time_range: {
                type: 'string',
                label: '推荐时间',
                tableOption: {
                  'min-width': 300,
                  'show-overflow-tooltip': true
                },
                detailPanelOption: {}
              },
              start_time: {
                type: 'string',
                label: '开始时间',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'datetime',
                  placeholder: '请选择开始时间（可选）'
                },
                editFormOption: {
                  comType: 'datetime'
                },
                detailPanelOption: {}
              },
              end_time: {
                type: 'string',
                label: '结束时间',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'datetime',
                  placeholder: '请选择结束时间（可选）'
                },
                editFormOption: {
                  comType: 'datetime'
                },
                detailPanelOption: {}
              },
              view_count: {
                type: 'number',
                label: '点击量',
                tableOption: {
                  width: 100
                },
                detailPanelOption: {}
              },
              is_enabled: {
                type: 'number',
                label: '是否推荐',
                tableOption: {
                  width: 120,
                  comType: 'switch',
                  activeValue: 1,
                  inactiveValue: 0,
                  showLabel: false,
                  eventKey: 'switchChange',
                  eventOption: {
                    api: '/api/proj/new-product-recommend/toggle',
                    params: {
                      recommend_id: 'schema::recommend_id',
                      is_enabled: 'schema::is_enabled'
                    }
                  }
                },
                searchOption: {
                  comType: 'select',
                  placeholder: '请选择状态',
                  enumList: [
                    { label: '全部', value: '' },
                    { label: '已启用', value: 1 },
                    { label: '已禁用', value: 0 }
                  ]
                },
                createFormOption: {
                  comType: 'switch',
                  activeValue: 1,
                  inactiveValue: 0,
                  default: 1
                },
                editFormOption: {
                  comType: 'switch',
                  activeValue: 1,
                  inactiveValue: 0
                },
                detailPanelOption: {}
              },
              recommend_status_text: {
                type: 'string',
                label: '推荐状态',
                tableOption: {
                  width: 100
                },
                searchOption: {
                  comType: 'select',
                  placeholder: '请选择推荐状态',
                  enumList: [
                    { label: '全部', value: '' },
                    { label: '未开始', value: 0 },
                    { label: '进行中', value: 1 },
                    { label: '已结束', value: 2 }
                  ]
                },
                detailPanelOption: {}
              },
              sort_order: {
                type: 'number',
                label: '排序',
                tableOption: {
                  width: 100
                },
                createFormOption: {
                  comType: 'input-number',
                  placeholder: '数字越小越靠前',
                  min: 0,
                  default: 0
                },
                editFormOption: {
                  comType: 'input-number',
                  min: 0
                },
                detailPanelOption: {}
              },
              create_time: {
                type: 'string',
                label: '创建时间',
                tableOption: {
                  'min-width': 180
                },
                detailPanelOption: {}
              }
            },
            required: ['product_id']
          },
          tableConfig: {
            selectable: true,
            headerButtons: [{
              label: '添加推荐',
              type: 'primary',
              plain: true,
              eventKey: 'showComponent',
              eventOption: {
                comName: 'createForm'
              }
            }],
            batchButtons: [{
              label: '批量设为推荐',
              value: 'batchEnable',
              type: 'success',
              eventKey: 'batchEnable',
              eventOption: {
                api: '/api/proj/new-product-recommend/batch/enable',
                dataKey: 'recommend_ids',
                primaryKey: 'recommend_id'
              }
            }, {
              label: '批量取消推荐',
              value: 'batchDisable',
              type: 'warning',
              eventKey: 'batchDisable',
              eventOption: {
                api: '/api/proj/new-product-recommend/batch/disable',
                dataKey: 'recommend_ids',
                primaryKey: 'recommend_id'
              }
            }, {
              label: '批量删除',
              value: 'batchDelete',
              type: 'danger',
              eventKey: 'batchDelete'
            }],
            rowButtons: [{
              label: '查看',
              type: 'primary',
              eventKey: 'showComponent',
              eventOption: {
                comName: 'detailPanel'
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
                  recommend_id: 'schema::recommend_id'
                }
              }
            }]
          },
          componentConfig: {
            createForm: {
              mainKey: 'recommend_id',
              title: '添加新品推荐',
              saveBtnText: '保存'
            },
            editForm: {
              mainKey: 'recommend_id',
              title: '编辑新品推荐',
              saveBtnText: '保存'
            },
            detailPanel: {
              mainKey: 'recommend_id',
              title: '新品推荐详情'
            }
          }
        }
      }, {
        key: 'popular-product-recommend-list',
        name: '人气推荐列表',
        icon: 'TrendCharts',
        menuType: 'module',
        moduleType: 'schema',
        schemaConfig: {
          api: '/api/proj/popular-product-recommend',
          primaryKey: 'recommend_id',
          schema: {
            type: 'object',
            properties: {
              recommend_id: {
                type: 'string',
                label: '推荐ID',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {}
              },
              product_id: {
                type: 'string',
                label: '商品ID',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'remote-select',
                  placeholder: '请选择商品',
                  required: true,
                  api: '/api/proj/popular-product-recommend/available-products',
                  labelKey: 'product_name',
                  valueKey: 'product_id'
                },
                detailPanelOption: {}
              },
              product_name: {
                type: 'string',
                label: '商品名称',
                tableOption: {
                  'min-width': 200,
                  'show-overflow-tooltip': true
                },
                searchOption: {
                  comType: 'input',
                  placeholder: '请输入商品名称'
                },
                detailPanelOption: {}
              },
              product_images: {
                type: 'string',
                label: '商品图片',
                tableOption: {
                  width: 100,
                  comType: 'image'
                },
                detailPanelOption: {
                  comType: 'image'
                }
              },
              price: {
                type: 'number',
                label: '商品价格',
                tableOption: {
                  width: 120
                },
                detailPanelOption: {}
              },
              recommend_title: {
                type: 'string',
                label: '推荐标题',
                tableOption: {
                  'min-width': 200,
                  'show-overflow-tooltip': true
                },
                createFormOption: {
                  comType: 'input',
                  placeholder: '请输入推荐标题（可选）',
                  maxlength: 200
                },
                editFormOption: {
                  comType: 'input',
                  maxlength: 200
                },
                detailPanelOption: {}
              },
              recommend_desc: {
                type: 'string',
                label: '推荐描述',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'textarea',
                  placeholder: '请输入推荐描述（可选）',
                  rows: 3
                },
                editFormOption: {
                  comType: 'textarea',
                  rows: 3
                },
                detailPanelOption: {}
              },
              recommend_image: {
                type: 'string',
                label: '推荐图片',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'upload',
                  placeholder: '上传推荐图片（可选，覆盖商品图片）',
                  uploadUrl: '/api/upload/image',
                  accept: 'image/*'
                },
                editFormOption: {
                  comType: 'upload',
                  uploadUrl: '/api/upload/image',
                  accept: 'image/*'
                },
                detailPanelOption: {
                  comType: 'image'
                }
              },
              time_range: {
                type: 'string',
                label: '推荐时间',
                tableOption: {
                  'min-width': 300,
                  'show-overflow-tooltip': true
                },
                detailPanelOption: {}
              },
              start_time: {
                type: 'string',
                label: '开始时间',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'datetime',
                  placeholder: '请选择开始时间（可选）'
                },
                editFormOption: {
                  comType: 'datetime'
                },
                detailPanelOption: {}
              },
              end_time: {
                type: 'string',
                label: '结束时间',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'datetime',
                  placeholder: '请选择结束时间（可选）'
                },
                editFormOption: {
                  comType: 'datetime'
                },
                detailPanelOption: {}
              },
              view_count: {
                type: 'number',
                label: '点击量',
                tableOption: {
                  width: 100
                },
                detailPanelOption: {}
              },
              is_enabled: {
                type: 'number',
                label: '是否推荐',
                tableOption: {
                  width: 120,
                  comType: 'switch',
                  activeValue: 1,
                  inactiveValue: 0,
                  showLabel: false,
                  eventKey: 'switchChange',
                  eventOption: {
                    api: '/api/proj/popular-product-recommend/toggle',
                    params: {
                      recommend_id: 'schema::recommend_id',
                      is_enabled: 'schema::is_enabled'
                    }
                  }
                },
                searchOption: {
                  comType: 'select',
                  placeholder: '请选择状态',
                  enumList: [
                    { label: '全部', value: '' },
                    { label: '已启用', value: 1 },
                    { label: '已禁用', value: 0 }
                  ]
                },
                createFormOption: {
                  comType: 'switch',
                  activeValue: 1,
                  inactiveValue: 0,
                  default: 1
                },
                editFormOption: {
                  comType: 'switch',
                  activeValue: 1,
                  inactiveValue: 0
                },
                detailPanelOption: {}
              },
              recommend_status_text: {
                type: 'string',
                label: '推荐状态',
                tableOption: {
                  width: 100
                },
                searchOption: {
                  comType: 'select',
                  placeholder: '请选择推荐状态',
                  enumList: [
                    { label: '全部', value: '' },
                    { label: '未开始', value: 0 },
                    { label: '进行中', value: 1 },
                    { label: '已结束', value: 2 }
                  ]
                },
                detailPanelOption: {}
              },
              sort_order: {
                type: 'number',
                label: '排序',
                tableOption: {
                  width: 100
                },
                createFormOption: {
                  comType: 'input-number',
                  placeholder: '数字越小越靠前',
                  min: 0,
                  default: 0
                },
                editFormOption: {
                  comType: 'input-number',
                  min: 0
                },
                detailPanelOption: {}
              },
              create_time: {
                type: 'string',
                label: '创建时间',
                tableOption: {
                  'min-width': 180
                },
                detailPanelOption: {}
              }
            },
            required: ['product_id']
          },
          tableConfig: {
            selectable: true,
            headerButtons: [{
              label: '添加推荐',
              type: 'primary',
              plain: true,
              eventKey: 'showComponent',
              eventOption: {
                comName: 'createForm'
              }
            }],
            batchButtons: [{
              label: '批量设为推荐',
              value: 'batchEnable',
              type: 'success',
              eventKey: 'batchEnable',
              eventOption: {
                api: '/api/proj/popular-product-recommend/batch/enable',
                dataKey: 'recommend_ids',
                primaryKey: 'recommend_id'
              }
            }, {
              label: '批量取消推荐',
              value: 'batchDisable',
              type: 'warning',
              eventKey: 'batchDisable',
              eventOption: {
                api: '/api/proj/popular-product-recommend/batch/disable',
                dataKey: 'recommend_ids',
                primaryKey: 'recommend_id'
              }
            }, {
              label: '批量删除',
              value: 'batchDelete',
              type: 'danger',
              eventKey: 'batchDelete'
            }],
            rowButtons: [{
              label: '查看',
              type: 'primary',
              eventKey: 'showComponent',
              eventOption: {
                comName: 'detailPanel'
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
                  recommend_id: 'schema::recommend_id'
                }
              }
            }]
          },
          componentConfig: {
            createForm: {
              mainKey: 'recommend_id',
              title: '添加人气推荐',
              saveBtnText: '保存'
            },
            editForm: {
              mainKey: 'recommend_id',
              title: '编辑人气推荐',
              saveBtnText: '保存'
            },
            detailPanel: {
              mainKey: 'recommend_id',
              title: '人气推荐详情'
            }
          }
        }
      }, {
        key: 'topic-recommend-list',
        name: '专题推荐列表',
        icon: 'Collection',
        menuType: 'module',
        moduleType: 'schema',
        schemaConfig: {
          api: '/api/proj/topic-recommend',
          primaryKey: 'topic_id',
          schema: {
            type: 'object',
            properties: {
              topic_id: {
                type: 'string',
                label: '专题ID',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {}
              },
              topic_name: {
                type: 'string',
                label: '专题名称',
                tableOption: {
                  'min-width': 200,
                  'show-overflow-tooltip': true
                },
                searchOption: {
                  comType: 'input',
                  placeholder: '请输入专题名称'
                },
                createFormOption: {
                  comType: 'input',
                  placeholder: '请输入专题名称',
                  required: true,
                  maxlength: 200
                },
                editFormOption: {
                  comType: 'input',
                  required: true,
                  maxlength: 200
                },
                detailPanelOption: {}
              },
              topic_type: {
                type: 'number',
                label: '专题类型',
                tableOption: {
                  visible: false
                },
                searchOption: {
                  comType: 'select',
                  placeholder: '请选择专题类型',
                  enumList: [
                    { label: '全部', value: '' },
                    { label: '商品专题', value: 1 },
                    { label: '品牌专题', value: 2 },
                    { label: '分类专题', value: 3 }
                  ]
                },
                createFormOption: {
                  comType: 'select',
                  placeholder: '请选择专题类型',
                  required: true,
                  enumList: [
                    { label: '商品专题', value: 1 },
                    { label: '品牌专题', value: 2 },
                    { label: '分类专题', value: 3 }
                  ]
                },
                editFormOption: {
                  comType: 'select',
                  required: true,
                  enumList: [
                    { label: '商品专题', value: 1 },
                    { label: '品牌专题', value: 2 },
                    { label: '分类专题', value: 3 }
                  ]
                },
                detailPanelOption: {}
              },
              topic_type_text: {
                type: 'string',
                label: '专题类型',
                tableOption: {
                  width: 120
                },
                detailPanelOption: {}
              },
              cover_image: {
                type: 'string',
                label: '封面图片',
                tableOption: {
                  width: 100,
                  comType: 'image'
                },
                createFormOption: {
                  comType: 'upload',
                  placeholder: '上传封面图片',
                  required: true,
                  uploadUrl: '/api/upload/image',
                  accept: 'image/*'
                },
                editFormOption: {
                  comType: 'upload',
                  required: true,
                  uploadUrl: '/api/upload/image',
                  accept: 'image/*'
                },
                detailPanelOption: {
                  comType: 'image'
                }
              },
              banner_image: {
                type: 'string',
                label: 'Banner图片',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'upload',
                  placeholder: '上传Banner图片（可选）',
                  uploadUrl: '/api/upload/image',
                  accept: 'image/*'
                },
                editFormOption: {
                  comType: 'upload',
                  uploadUrl: '/api/upload/image',
                  accept: 'image/*'
                },
                detailPanelOption: {
                  comType: 'image'
                }
              },
              topic_desc: {
                type: 'string',
                label: '专题描述',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'textarea',
                  placeholder: '请输入专题描述（可选）',
                  rows: 3
                },
                editFormOption: {
                  comType: 'textarea',
                  rows: 3
                },
                detailPanelOption: {}
              },
              related_count: {
                type: 'number',
                label: '关联数量',
                tableOption: {
                  width: 100
                },
                detailPanelOption: {}
              },
              link_url: {
                type: 'string',
                label: '跳转链接',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'input',
                  placeholder: '请输入跳转链接（可选）',
                  maxlength: 500
                },
                editFormOption: {
                  comType: 'input',
                  maxlength: 500
                },
                detailPanelOption: {}
              },
              related_products: {
                type: 'array',
                label: '关联商品',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'product-selector',
                  placeholder: '请选择关联商品（商品专题必填）'
                },
                editFormOption: {
                  comType: 'product-selector'
                },
                detailPanelOption: {}
              },
              related_brands: {
                type: 'array',
                label: '关联品牌',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'brand-selector',
                  placeholder: '请选择关联品牌（品牌专题必填）'
                },
                editFormOption: {
                  comType: 'brand-selector'
                },
                detailPanelOption: {}
              },
              related_categories: {
                type: 'array',
                label: '关联分类',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'category-selector',
                  placeholder: '请选择关联分类（分类专题必填）'
                },
                editFormOption: {
                  comType: 'category-selector'
                },
                detailPanelOption: {}
              },
              time_range: {
                type: 'string',
                label: '推荐时间',
                tableOption: {
                  'min-width': 300,
                  'show-overflow-tooltip': true
                },
                detailPanelOption: {}
              },
              start_time: {
                type: 'string',
                label: '开始时间',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'datetime',
                  placeholder: '请选择开始时间（可选）'
                },
                editFormOption: {
                  comType: 'datetime'
                },
                detailPanelOption: {}
              },
              end_time: {
                type: 'string',
                label: '结束时间',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'datetime',
                  placeholder: '请选择结束时间（可选）'
                },
                editFormOption: {
                  comType: 'datetime'
                },
                detailPanelOption: {}
              },
              view_count: {
                type: 'number',
                label: '浏览次数',
                tableOption: {
                  width: 100
                },
                detailPanelOption: {}
              },
              is_enabled: {
                type: 'number',
                label: '是否推荐',
                tableOption: {
                  width: 120,
                  comType: 'switch',
                  activeValue: 1,
                  inactiveValue: 0,
                  showLabel: false,
                  eventKey: 'switchChange',
                  eventOption: {
                    api: '/api/proj/topic-recommend/toggle',
                    params: {
                      topic_id: 'schema::topic_id',
                      is_enabled: 'schema::is_enabled'
                    }
                  }
                },
                searchOption: {
                  comType: 'select',
                  placeholder: '请选择状态',
                  enumList: [
                    { label: '全部', value: '' },
                    { label: '已启用', value: 1 },
                    { label: '已禁用', value: 0 }
                  ]
                },
                createFormOption: {
                  comType: 'switch',
                  activeValue: 1,
                  inactiveValue: 0,
                  default: 1
                },
                editFormOption: {
                  comType: 'switch',
                  activeValue: 1,
                  inactiveValue: 0
                },
                detailPanelOption: {}
              },
              topic_status_text: {
                type: 'string',
                label: '专题状态',
                tableOption: {
                  width: 100
                },
                searchOption: {
                  comType: 'select',
                  placeholder: '请选择专题状态',
                  enumList: [
                    { label: '全部', value: '' },
                    { label: '未开始', value: 0 },
                    { label: '进行中', value: 1 },
                    { label: '已结束', value: 2 }
                  ]
                },
                detailPanelOption: {}
              },
              sort_order: {
                type: 'number',
                label: '排序',
                tableOption: {
                  width: 100
                },
                createFormOption: {
                  comType: 'input-number',
                  placeholder: '数字越小越靠前',
                  min: 0,
                  default: 0
                },
                editFormOption: {
                  comType: 'input-number',
                  min: 0
                },
                detailPanelOption: {}
              },
              create_time: {
                type: 'string',
                label: '创建时间',
                tableOption: {
                  'min-width': 180
                },
                detailPanelOption: {}
              }
            },
            required: ['topic_name', 'cover_image', 'topic_type']
          },
          tableConfig: {
            selectable: true,
            headerButtons: [{
              label: '添加专题',
              type: 'primary',
              plain: true,
              eventKey: 'showComponent',
              eventOption: {
                comName: 'createForm'
              }
            }],
            batchButtons: [{
              label: '批量设为推荐',
              value: 'batchEnable',
              type: 'success',
              eventKey: 'batchEnable',
              eventOption: {
                api: '/api/proj/topic-recommend/batch/enable',
                dataKey: 'topic_ids',
                primaryKey: 'topic_id'
              }
            }, {
              label: '批量取消推荐',
              value: 'batchDisable',
              type: 'warning',
              eventKey: 'batchDisable',
              eventOption: {
                api: '/api/proj/topic-recommend/batch/disable',
                dataKey: 'topic_ids',
                primaryKey: 'topic_id'
              }
            }, {
              label: '批量删除',
              value: 'batchDelete',
              type: 'danger',
              eventKey: 'batchDelete'
            }],
            rowButtons: [{
              label: '查看',
              type: 'primary',
              eventKey: 'showComponent',
              eventOption: {
                comName: 'detailPanel'
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
                  topic_id: 'schema::topic_id'
                }
              }
            }]
          },
          componentConfig: {
            createForm: {
              mainKey: 'topic_id',
              title: '添加专题推荐',
              saveBtnText: '保存'
            },
            editForm: {
              mainKey: 'topic_id',
              title: '编辑专题推荐',
              saveBtnText: '保存'
            },
            detailPanel: {
              mainKey: 'topic_id',
              title: '专题推荐详情'
            }
          }
        }
      }, {
        key: 'advertisement-list',
        name: '广告列表',
        icon: 'Picture',
        menuType: 'module',
        moduleType: 'schema',
        schemaConfig: {
          api: '/api/proj/advertisement',
          primaryKey: 'ad_id',
          schema: {
            type: 'object',
            properties: {
              ad_id: {
                type: 'string',
                label: '广告ID',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {}
              },
              ad_name: {
                type: 'string',
                label: '广告名称',
                tableOption: {
                  'min-width': 200,
                  'show-overflow-tooltip': true
                },
                searchOption: {
                  comType: 'input',
                  placeholder: '请输入广告名称'
                },
                createFormOption: {
                  comType: 'input',
                  placeholder: '请输入广告名称',
                  required: true,
                  maxlength: 200
                },
                editFormOption: {
                  comType: 'input',
                  required: true,
                  maxlength: 200
                },
                detailPanelOption: {}
              },
              ad_position: {
                type: 'string',
                label: '广告位置',
                tableOption: {
                  width: 150
                },
                searchOption: {
                  comType: 'select',
                  placeholder: '请选择广告位置',
                  enumList: [
                    { label: '全部', value: '' },
                    { label: '首页轮播图', value: 'home_banner' },
                    { label: '首页侧边栏', value: 'home_sidebar' },
                    { label: '分类页顶部', value: 'category_top' },
                    { label: '商品详情页', value: 'product_detail' }
                  ]
                },
                createFormOption: {
                  comType: 'ad-position-selector',
                  placeholder: '请选择或输入广告位置',
                  required: true
                },
                editFormOption: {
                  comType: 'ad-position-selector',
                  required: true
                },
                detailPanelOption: {}
              },
              ad_type: {
                type: 'number',
                label: '广告类型',
                tableOption: {
                  visible: false
                },
                searchOption: {
                  comType: 'select',
                  placeholder: '请选择广告类型',
                  enumList: [
                    { label: '全部', value: '' },
                    { label: '图片', value: 1 },
                    { label: '视频', value: 2 },
                    { label: 'HTML', value: 3 }
                  ]
                },
                createFormOption: {
                  comType: 'select',
                  placeholder: '请选择广告类型',
                  required: true,
                  enumList: [
                    { label: '图片', value: 1 },
                    { label: '视频', value: 2 },
                    { label: 'HTML', value: 3 }
                  ]
                },
                editFormOption: {
                  comType: 'select',
                  required: true,
                  enumList: [
                    { label: '图片', value: 1 },
                    { label: '视频', value: 2 },
                    { label: 'HTML', value: 3 }
                  ]
                },
                detailPanelOption: {}
              },
              ad_type_text: {
                type: 'string',
                label: '广告类型',
                tableOption: {
                  width: 100
                },
                detailPanelOption: {}
              },
              ad_image: {
                type: 'string',
                label: '广告图片',
                tableOption: {
                  width: 100,
                  comType: 'image'
                },
                createFormOption: {
                  comType: 'upload',
                  placeholder: '上传广告图片（图片类型必填）',
                  uploadUrl: '/api/upload/image',
                  accept: 'image/*'
                },
                editFormOption: {
                  comType: 'upload',
                  uploadUrl: '/api/upload/image',
                  accept: 'image/*'
                },
                detailPanelOption: {
                  comType: 'image'
                }
              },
              ad_video: {
                type: 'string',
                label: '广告视频',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'input',
                  placeholder: '请输入视频URL（视频类型必填）',
                  maxlength: 500
                },
                editFormOption: {
                  comType: 'input',
                  maxlength: 500
                },
                detailPanelOption: {}
              },
              ad_html: {
                type: 'string',
                label: '广告HTML',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'code-editor',
                  placeholder: '请输入HTML代码（HTML类型必填）'
                },
                editFormOption: {
                  comType: 'code-editor'
                },
                detailPanelOption: {}
              },
              link_config: {
                type: 'object',
                label: '跳转链接配置',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'link-target-selector',
                  placeholder: '请配置跳转链接（可选）'
                },
                editFormOption: {
                  comType: 'link-target-selector'
                },
                detailPanelOption: {}
              },
              link_type: {
                type: 'number',
                label: '链接类型',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {}
              },
              link_type_text: {
                type: 'string',
                label: '链接类型',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {}
              },
              link_target: {
                type: 'string',
                label: '链接目标',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {}
              },
              link_url: {
                type: 'string',
                label: '跳转链接',
                tableOption: {
                  visible: false
                },
                detailPanelOption: {}
              },
              time_range: {
                type: 'string',
                label: '投放时间',
                tableOption: {
                  'min-width': 300,
                  'show-overflow-tooltip': true
                },
                detailPanelOption: {}
              },
              start_time: {
                type: 'string',
                label: '开始时间',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'datetime',
                  placeholder: '请选择开始时间（可选）'
                },
                editFormOption: {
                  comType: 'datetime'
                },
                detailPanelOption: {}
              },
              end_time: {
                type: 'string',
                label: '结束时间',
                tableOption: {
                  visible: false
                },
                createFormOption: {
                  comType: 'datetime',
                  placeholder: '请选择结束时间（可选）'
                },
                editFormOption: {
                  comType: 'datetime'
                },
                detailPanelOption: {}
              },
              click_count: {
                type: 'number',
                label: '点击次数',
                tableOption: {
                  width: 100
                },
                detailPanelOption: {}
              },
              is_enabled: {
                type: 'number',
                label: '是否启用',
                tableOption: {
                  width: 120,
                  comType: 'switch',
                  activeValue: 1,
                  inactiveValue: 0,
                  showLabel: false,
                  eventKey: 'switchChange',
                  eventOption: {
                    api: '/api/proj/advertisement/toggle',
                    params: {
                      ad_id: 'schema::ad_id',
                      is_enabled: 'schema::is_enabled'
                    }
                  }
                },
                searchOption: {
                  comType: 'select',
                  placeholder: '请选择状态',
                  enumList: [
                    { label: '全部', value: '' },
                    { label: '已启用', value: 1 },
                    { label: '已禁用', value: 0 }
                  ]
                },
                createFormOption: {
                  comType: 'switch',
                  activeValue: 1,
                  inactiveValue: 0,
                  default: 1
                },
                editFormOption: {
                  comType: 'switch',
                  activeValue: 1,
                  inactiveValue: 0
                },
                detailPanelOption: {}
              },
              ad_status_text: {
                type: 'string',
                label: '广告状态',
                tableOption: {
                  width: 100
                },
                searchOption: {
                  comType: 'select',
                  placeholder: '请选择广告状态',
                  enumList: [
                    { label: '全部', value: '' },
                    { label: '未开始', value: 0 },
                    { label: '进行中', value: 1 },
                    { label: '已结束', value: 2 }
                  ]
                },
                detailPanelOption: {}
              },
              sort_order: {
                type: 'number',
                label: '排序',
                tableOption: {
                  width: 100
                },
                createFormOption: {
                  comType: 'input-number',
                  placeholder: '数字越小越靠前',
                  min: 0,
                  default: 0
                },
                editFormOption: {
                  comType: 'input-number',
                  min: 0
                },
                detailPanelOption: {}
              },
              create_time: {
                type: 'string',
                label: '创建时间',
                tableOption: {
                  'min-width': 180
                },
                detailPanelOption: {}
              }
            },
            required: ['ad_name', 'ad_position', 'ad_type']
          },
          tableConfig: {
            selectable: true,
            headerButtons: [{
              label: '添加广告',
              type: 'primary',
              plain: true,
              eventKey: 'showComponent',
              eventOption: {
                comName: 'createForm'
              }
            }, {
              label: '管理广告位置',
              type: 'success',
              plain: true,
              eventKey: 'showComponent',
              eventOption: {
                comName: 'adPositionManager'
              }
            }],
            batchButtons: [{
              label: '批量启用',
              value: 'batchEnable',
              type: 'success',
              eventKey: 'batchEnable',
              eventOption: {
                api: '/api/proj/advertisement/batch/enable',
                dataKey: 'ad_ids',
                primaryKey: 'ad_id'
              }
            }, {
              label: '批量禁用',
              value: 'batchDisable',
              type: 'warning',
              eventKey: 'batchDisable',
              eventOption: {
                api: '/api/proj/advertisement/batch/disable',
                dataKey: 'ad_ids',
                primaryKey: 'ad_id'
              }
            }, {
              label: '批量删除',
              value: 'batchDelete',
              type: 'danger',
              eventKey: 'batchDelete'
            }],
            rowButtons: [{
              label: '查看',
              type: 'primary',
              eventKey: 'showComponent',
              eventOption: {
                comName: 'detailPanel'
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
                  ad_id: 'schema::ad_id'
                }
              }
            }]
          },
          componentConfig: {
            createForm: {
              mainKey: 'ad_id',
              title: '添加广告',
              saveBtnText: '保存'
            },
            editForm: {
              mainKey: 'ad_id',
              title: '编辑广告',
              saveBtnText: '保存'
            },
            detailPanel: {
              mainKey: 'ad_id',
              title: '广告详情'
            },
            adPositionManager: {
              title: '广告位置管理',
              width: '80%'
            }
          }
        }
      }]
    }
  }, {
    key: 'order',
    name: '订单管理',
    menuType: 'module',
    moduleType: 'sider',
    siderConfig: {
      menu: [{
        key: 'order-list',
        name: '订单列表',
        icon: 'Document',
        menuType: 'module',
        moduleType: 'schema',
        schemaConfig: {
          api: '/api/proj/order',
          primaryKey: 'order_id',
          schema: {
            type: 'object',
            properties: {
              order_no: {
                type: 'string',
                label: '订单号',
                tableOption: {
                  'min-width': 180,
                  'show-overflow-tooltip': true,
                  sortable: false
                },
                searchOption: {
                  comType: 'input',
                  placeholder: '请输入订单号'
                },
                detailPanelOption: {}
              },
              customer_name: {
                type: 'string',
                label: '用户姓名',
                tableOption: {
                  'min-width': 120
                },
                searchOption: {
                  comType: 'input',
                  placeholder: '请输入用户姓名'
                },
                detailPanelOption: {}
              },
              first_product_name: {
                type: 'string',
                label: '商品信息',
                tableOption: {
                  'min-width': 200,
                  'show-overflow-tooltip': true,
                  formatter: (row) => {
                    const count = row.item_count || 0;
                    return count > 1 ? `${row.first_product_name} 等${count}件商品` : row.first_product_name;
                  }
                }
              },
              total_amount: {
                type: 'number',
                label: '订单金额',
                tableOption: {
                  'min-width': 120,
                  sortable: 'custom',
                  formatter: (row) => `¥${row.total_amount}`
                },
                detailPanelOption: {}
              },
              pay_amount: {
                type: 'number',
                label: '实付金额',
                tableOption: {
                  'min-width': 120,
                  sortable: 'custom',
                  formatter: (row) => `¥${row.pay_amount}`
                },
                detailPanelOption: {}
              },
              order_status: {
                type: 'number',
                label: '订单状态',
                tableOption: {
                  visible: false  // 隐藏数字字段
                },
                searchOption: {
                  comType: 'select',
                  placeholder: '请选择订单状态',
                  enumList: [
                    { label: '全部', value: 'all' },
                    { label: '待支付', value: 0 },
                    { label: '待发货', value: 1 },
                    { label: '待收货', value: 2 },
                    { label: '已完成', value: 3 },
                    { label: '已取消', value: 4 },
                    { label: '退款中', value: 5 },
                    { label: '已退款', value: 6 }
                  ],
                  default: 'all'
                },
                detailPanelOption: {
                  visible: false  // 详情中也隐藏数字
                }
              },
              order_status_text: {
                type: 'string',
                label: '订单状态',
                tableOption: {
                  width: 100
                },
                detailPanelOption: {}
              },
              pay_status: {
                type: 'number',
                label: '支付状态',
                tableOption: {
                  visible: false  // 隐藏数字字段
                },
                searchOption: {
                  comType: 'select',
                  placeholder: '请选择支付状态',
                  enumList: [
                    { label: '全部', value: 'all' },
                    { label: '未支付', value: 0 },
                    { label: '已支付', value: 1 },
                    { label: '已退款', value: 2 }
                  ],
                  default: 'all'
                },
                detailPanelOption: {
                  visible: false  // 详情中也隐藏数字
                }
              },
              pay_status_text: {
                type: 'string',
                label: '支付状态',
                tableOption: {
                  width: 100
                },
                detailPanelOption: {}
              },
              order_time: {
                type: 'string',
                label: '下单时间',
                tableOption: {
                  'min-width': 180,
                  sortable: 'custom'
                },
                searchOption: {
                  comType: 'datetime-range',
                  placeholder: '请选择下单时间范围',
                  startKey: 'order_time_start',
                  endKey: 'order_time_end'
                },
                detailPanelOption: {}
              },
              receiver_name: {
                type: 'string',
                label: '收货人',
                detailPanelOption: {}
              },
              receiver_phone: {
                type: 'string',
                label: '联系电话',
                detailPanelOption: {}
              },
              receiver_address: {
                type: 'string',
                label: '收货地址',
                detailPanelOption: {
                  formatter: (row) => {
                    return `${row.receiver_province} ${row.receiver_city} ${row.receiver_district} ${row.receiver_address}`;
                  }
                }
              },
              seller_remark: {
                type: 'string',
                label: '卖家备注',
                editFormOption: {
                  comType: 'textarea',
                  placeholder: '请输入卖家备注'
                },
                detailPanelOption: {}
              }
            }
          },
          tableConfig: {
            selectable: true,  // 启用多选功能
            headerButtons: [{
              label: '导出订单',
              type: 'primary',
              icon: 'Download',
              eventKey: 'exportOrders'
            }],
            rowButtons: [{
              label: '查看详情',
              type: 'primary',
              eventKey: 'showComponent',
              eventOption: {
                comName: 'detailPanel'
              }
            }, {
              label: '发货',
              type: 'success',
              eventKey: 'showComponent',
              condition: 'order_status === 1',
              eventOption: {
                comName: 'deliverDialog'
              }
            }, {
              label: '取消订单',
              type: 'warning',
              eventKey: 'showComponent',
              condition: 'order_status === 0',
              eventOption: {
                comName: 'cancelDialog'
              }
            }, {
              label: '编辑',
              type: 'primary',
              eventKey: 'showComponent',
              eventOption: {
                comName: 'editForm'
              }
            }, {
              label: '删除',
              type: 'danger',
              eventKey: 'remove',
              condition: 'order_status === 3 || order_status === 4',
              eventOption: {
                params: {
                  order_id: 'schema::order_id'
                }
              }
            }],
            batchButtons: [{
              label: '批量发货',
              value: 'batchDeliver',
              type: 'success',
              eventKey: 'batchDeliver'
            }, {
              label: '批量取消',
              value: 'batchCancel',
              type: 'warning',
              eventKey: 'batchCancel'
            }, {
              label: '批量删除',
              value: 'batchDelete',
              type: 'danger',
              eventKey: 'batchDelete'
            }]
          },
          componentConfig: {
            editForm: {
              mainKey: 'order_id',
              title: '编辑订单',
              saveBtnText: '保存'
            },
            detailPanel: {
              mainKey: 'order_id',
              title: '订单详情',
              comType: 'order-detail',
              size: '80%'
            },
            deliverDialog: {
              mainKey: 'order_id'
            },
            cancelDialog: {
              mainKey: 'order_id'
            },
            orderListHandler: {}
          }
        }
      }]
    }
  }]
}
