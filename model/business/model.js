
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
                  width: 110
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
    key: 'client',
    name: '客户管理',
    menuType: 'module',
    moduleType: 'custom',
    customConfig: {
      path: '/todo'
    }
  }, {
    key: 'order',
    name: '订单管理',
    menuType: 'module',
    moduleType: 'custom',
    customConfig: {
      path: '/todo'
    }
  }]
}
