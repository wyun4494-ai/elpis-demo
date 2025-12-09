# 商品详情富文本编辑器实现文档

> 实现时间：2025-11
> 功能：为商品管理模块添加富文本编辑器，支持商品详情的富文本编辑

---

## 📋 实现概览

### 功能说明
- 使用 Tiptap 富文本编辑器
- 支持富文本编辑（加粗、斜体、下划线、标题、列表、引用、代码块等）
- 支持图片上传和插入
- 支持链接插入
- 支持撤销/重做
- 在商品添加和编辑表单的第二步显示

### 涉及文件
1. **数据库脚本**：`schema-hub/database/03_add_product_detail.sql`
2. **前端组件**：`elpis/app/pages/widgets/schema-form/complex-view/tiptap-editor/tiptap-editor.vue`
3. **组件注册**：`elpis/app/pages/widgets/schema-form/form-item-config.js`
4. **Schema 配置**：`schema-hub/model/business/model.js`
5. **后端 Service**：`schema-hub/app/service/business.js`
6. **参数验证**：`schema-hub/app/router-schema/business.js`

---

## 🚀 执行步骤

### 步骤 1：执行数据库脚本

**操作**：手动执行 SQL 脚本

```bash
# 连接到 MySQL 数据库
mysql -u root -p

# 执行脚本
source d:/Elpis/schema-hub/database/03_add_product_detail.sql
```

**或者直接执行 SQL**：
```sql
USE elpis_beta;

ALTER TABLE t_product 
ADD COLUMN product_detail LONGTEXT COMMENT '商品详情（富文本HTML内容）' AFTER product_images;

-- 验证字段是否添加成功
DESCRIBE t_product;
```

**预期结果**：
- `t_product` 表新增 `product_detail` 字段
- 字段类型：`LONGTEXT`
- 字段位置：在 `product_images` 字段之后

---

### 步骤 2：安装 Tiptap 依赖

**操作**：在 `elpis` 目录下执行以下命令

```bash
cd d:/Elpis/elpis
npm install @tiptap/vue-3 @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-link @tiptap/extension-placeholder @tiptap/extension-underline
```

**依赖说明**：
- `@tiptap/vue-3` - Tiptap Vue 3 核心库
- `@tiptap/starter-kit` - 基础功能包（加粗、斜体、标题、列表等）
- `@tiptap/extension-image` - 图片插入扩展
- `@tiptap/extension-link` - 链接插入扩展
- `@tiptap/extension-placeholder` - 占位符扩展
- `@tiptap/extension-underline` - 下划线扩展

---

### 步骤 3：重新构建 Elpis 框架

**操作**：构建框架核心文件

```bash
cd d:/Elpis/elpis
npm run build
```

**说明**：
- 由于修改了框架核心文件（`form-item-config.js` 和新增了 `tiptap-editor.vue`），需要重新构建
- 构建完成后，schema-hub 项目会自动使用最新的框架代码

---

### 步骤 4：重启 schema-hub 服务

**操作**：重启开发服务器

```bash
cd d:/Elpis/schema-hub
npm run dev
```

---

## 📝 代码修改详情

### 1. 数据库修改

**文件**：`schema-hub/database/03_add_product_detail.sql`

**修改内容**：
```sql
ALTER TABLE t_product 
ADD COLUMN product_detail LONGTEXT COMMENT '商品详情（富文本HTML内容）' AFTER product_images;
```

---

### 2. 前端组件创建

**文件**：`elpis/app/pages/widgets/schema-form/complex-view/tiptap-editor/tiptap-editor.vue`

**功能特点**：
- ✅ 工具栏包含常用格式化按钮（加粗、斜体、下划线、删除线）
- ✅ 支持 3 级标题（H1、H2、H3）
- ✅ 支持无序列表和有序列表
- ✅ 支持引用和代码块
- ✅ 支持图片上传（复用 `/api/upload/image` 接口）
- ✅ 支持链接插入
- ✅ 支持撤销/重做
- ✅ 支持清除格式
- ✅ 响应式设计，最小高度 300px，最大高度 600px
- ✅ 支持 v-model 双向绑定
- ✅ 支持 disabled 禁用状态
- ✅ 支持 placeholder 占位符

**核心代码**：
```vue
<template>
  <div class="tiptap-editor-wrapper">
    <!-- 工具栏 -->
    <div v-if="editor" class="tiptap-toolbar">
      <!-- 格式化按钮 -->
    </div>
    
    <!-- 编辑器内容区 -->
    <editor-content :editor="editor" class="tiptap-content" />
    
    <!-- 图片上传对话框 -->
    <el-dialog v-model="imageDialogVisible" title="插入图片">
      <el-upload ... />
    </el-dialog>
    
    <!-- 链接插入对话框 -->
    <el-dialog v-model="linkDialogVisible" title="插入链接">
      <el-form ... />
    </el-dialog>
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'

const editor = useEditor({
  content: props.modelValue,
  editable: !props.disabled,
  extensions: [
    StarterKit,
    Underline,
    Image.configure({ inline: true, allowBase64: true }),
    Link.configure({ openOnClick: false }),
    Placeholder.configure({ placeholder: props.placeholder })
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})
</script>
```

---

### 3. 组件注册

**文件**：`elpis/app/pages/widgets/schema-form/form-item-config.js`

**修改内容**：
```javascript
// 导入组件
import tiptapEditor from "./complex-view/tiptap-editor/tiptap-editor.vue"

// 注册组件
const FormItemConfig = {
  // ... 其他组件
  'tiptap-editor': {
    component: tiptapEditor
  }
}
```

---

### 4. Schema 配置

**文件**：`schema-hub/model/business/model.js`

**修改内容**：
```javascript
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
  }
}
```

**说明**：
- 字段位置：在 `product_images` 字段之后
- 只在创建表单和编辑表单中显示
- 不在表格列、搜索栏、详情面板中显示

---

### 5. 后端 Service 修改

**文件**：`schema-hub/app/service/business.js`

**修改内容**：

#### createProduct 方法
```javascript
async createProduct(params) {
  const { 
    product_name, 
    category_id, 
    brand_id, 
    price, 
    item_number, 
    inventory, 
    shelf_status,
    product_images,
    product_detail,  // ✅ 新增
    skus = [],
    params: productParams = {}
  } = params;

  // 插入商品数据
  await app.database('t_product').insert({
    product_id: productId,
    product_name,
    product_images: product_images ? JSON.stringify(product_images) : null,
    product_detail: product_detail || null,  // ✅ 新增
    // ... 其他字段
  });
}
```

#### updateProduct 方法
```javascript
async updateProduct(params) {
  const {
    product_id: productId,
    product_name,
    category_id,
    brand_id,
    price,
    item_number,
    inventory,
    shelf_status,
    product_images,
    product_detail,  // ✅ 新增
    skus,
    params: productParams
  } = params;

  // 构建更新对象
  const updateData = { update_time: new Date() };
  
  if (product_name !== undefined) updateData.product_name = product_name;
  if (product_images !== undefined) updateData.product_images = product_images ? JSON.stringify(product_images) : null;
  if (product_detail !== undefined) updateData.product_detail = product_detail || null;  // ✅ 新增
  // ... 其他字段
}
```

---

### 6. 参数验证修改

**文件**：`schema-hub/app/router-schema/business.js`

**修改内容**：

#### POST /api/proj/product（创建商品）
```javascript
post: {
  body: {
    type: 'object',
    properties: {
      product_name: { type: 'string' },
      category_id: { type: 'string' },
      brand_id: { type: 'string' },
      price: { type: 'number' },
      item_number: { type: 'string' },
      inventory: { type: 'number' },
      shelf_status: { type: 'number' },
      product_images: { type: 'array' },
      product_detail: { type: 'string' },  // ✅ 新增
      skus: { type: 'array' },
      params: { type: 'object' }
    },
    required: ['product_name', 'category_id']
  }
}
```

#### PUT /api/proj/product（更新商品）
```javascript
put: {
  body: {
    type: 'object',
    properties: {
      product_id: { type: 'string' },
      product_name: { type: 'string' },
      category_id: { type: 'string' },
      brand_id: { type: 'string' },
      price: { type: 'number' },
      item_number: { type: 'string' },
      inventory: { type: 'number' },
      shelf_status: { type: 'number' },
      product_images: { type: 'array' },
      product_detail: { type: 'string' },  // ✅ 新增
      skus: { type: 'array' },
      params: { type: 'object' }
    },
    required: ['product_id']
  }
}
```

---

## ✅ 测试步骤

### 1. 测试添加商品
1. 打开"商品管理" → "商品列表"
2. 点击"添加商品"按钮
3. 填写第一步的基本信息（商品名称、分类、品牌等）
4. 点击"下一步"进入第二步
5. 在"商品详情"字段中测试富文本编辑器：
   - ✅ 输入文本并使用格式化按钮（加粗、斜体、下划线等）
   - ✅ 插入标题（H1、H2、H3）
   - ✅ 插入列表（无序列表、有序列表）
   - ✅ 插入引用和代码块
   - ✅ 上传并插入图片
   - ✅ 插入链接
   - ✅ 测试撤销/重做功能
6. 填写其他必填字段（SKU 规格、商品参数）
7. 点击"提交"保存商品
8. 检查数据库中 `t_product` 表的 `product_detail` 字段是否保存了 HTML 内容

### 2. 测试编辑商品
1. 在商品列表中点击"编辑"按钮
2. 进入第二步，查看"商品详情"字段是否正确回显富文本内容
3. 修改富文本内容
4. 点击"提交"保存
5. 检查数据库中 `product_detail` 字段是否更新

### 3. 测试图片上传
1. 在富文本编辑器中点击"插入图片"按钮
2. 上传图片（支持 jpg/png/gif，最大 2MB）
3. 检查图片是否成功插入到编辑器中
4. 保存后检查 HTML 内容中是否包含图片 URL

### 4. 测试链接插入
1. 在富文本编辑器中选中文本
2. 点击"插入链接"按钮
3. 输入链接地址
4. 检查链接是否成功插入
5. 保存后检查 HTML 内容中是否包含链接标签

---

## 🔒 安全性说明

### XSS 防护
- **问题**：富文本编辑器存储的是 HTML 内容，可能存在 XSS 攻击风险
- **建议**：在后端添加 HTML 内容过滤（使用 DOMPurify 或类似库）

**后端过滤示例**（可选）：
```javascript
// 安装依赖
npm install dompurify jsdom

// 在 Service 层添加过滤
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// 过滤 HTML 内容
const cleanHtml = DOMPurify.sanitize(product_detail, {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'img'],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'target', 'rel']
});
```

---

## 📌 注意事项

1. **数据库字段类型**：使用 `LONGTEXT` 类型，支持最大 4GB 的文本内容
2. **图片上传**：复用现有的 `/api/upload/image` 接口，确保接口正常工作
3. **框架构建**：修改框架核心文件后必须重新构建（`npm run build`）
4. **浏览器兼容性**：Tiptap 支持现代浏览器（Chrome、Firefox、Safari、Edge）
5. **性能优化**：富文本内容较大时，建议在列表页不显示此字段，只在详情页显示

---

## 🎯 后续优化建议

1. **添加更多格式化选项**：
   - 文本颜色和背景色
   - 字体大小
   - 对齐方式（左对齐、居中、右对齐）
   - 表格插入

2. **添加内容预览功能**：
   - 在详情面板中显示富文本内容的渲染结果
   - 添加"预览"按钮，实时查看渲染效果

3. **添加内容统计**：
   - 字数统计
   - 图片数量统计

4. **添加自动保存**：
   - 定时自动保存草稿
   - 防止内容丢失

---

## 🎨 列表样式选择功能实现

### 功能描述
为富文本编辑器添加列表样式选择功能，支持用户自定义无序列表和有序列表的显示样式。

**无序列表样式**：
- 圆点（disc）- 实心圆点 ●
- 空心圆（circle）- 空心圆 ○
- 方块（square）- 方块 ■

**有序列表样式**：
- 数字编号（decimal）- 1. 2. 3.
- 小写字母（lower-alpha）- a. b. c.
- 大写字母（upper-alpha）- A. B. C.
- 小写罗马数字（lower-roman）- i. ii. iii.
- 大写罗马数字（upper-roman）- I. II. III.

### 实现方案：自定义 Tiptap 扩展

#### 1. 扩展 BulletList 和 OrderedList

**核心思路**：通过自定义扩展添加 `listStyleType` 属性，并在 `renderHTML()` 钩子中渲染内联样式和 CSS 类。

**代码位置**：`elpis/app/pages/widgets/schema-form/complex-view/tiptap-editor/tiptap-editor.vue` 第 720-763 行

**关键代码片段**：
```javascript
// 自定义 BulletList 扩展，支持 listStyleType 属性
const CustomBulletList = BulletList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      listStyleType: {
        default: 'disc',
        parseHTML: element => element.style.listStyleType || element.getAttribute('data-list-style-type') || 'disc',
        renderHTML: attributes => {
          if (!attributes.listStyleType || attributes.listStyleType === 'disc') {
            return {}
          }
          return {
            style: `list-style-type: ${attributes.listStyleType} !important`,
            'data-list-style-type': attributes.listStyleType,
            class: `list-style-${attributes.listStyleType}`
          }
        }
      }
    }
  }
})
```

**技术要点**：
- `addAttributes()`：扩展节点属性，添加 `listStyleType` 字段
- `parseHTML()`：从 HTML 解析属性值（支持内联样式、data 属性、默认值）
- `renderHTML()`：渲染 HTML 时添加内联样式、data 属性和 CSS 类
- `...this.parent?.()`：继承父扩展的所有属性

#### 2. 禁用 StarterKit 中的默认列表扩展

**代码位置**：`elpis/app/pages/widgets/schema-form/complex-view/tiptap-editor/tiptap-editor.vue` 第 779-808 行

```javascript
StarterKit.configure({
  link: false,
  underline: false,
  bulletList: false,    // 禁用默认 BulletList
  orderedList: false    // 禁用默认 OrderedList
}),
// 使用自定义的列表扩展
CustomBulletList,
CustomOrderedList,
```

#### 3. 使用 updateAttributes API 更新列表样式

**代码位置**：`elpis/app/pages/widgets/schema-form/complex-view/tiptap-editor/tiptap-editor.vue` 第 1040-1098 行

**setBulletListStyle() 方法**：
```javascript
const setBulletListStyle = (styleType) => {
  if (!editor.value) return

  // 更新全局状态
  currentBulletListStyle.value = styleType

  // 如果当前不是无序列表，先创建无序列表
  if (!editor.value.isActive('bulletList')) {
    editor.value.chain().focus().toggleBulletList().run()
  }

  // 使用 Tiptap 的 updateAttributes API 更新列表属性
  editor.value
    .chain()
    .focus()
    .updateAttributes('bulletList', { listStyleType: styleType })
    .run()

  ElMessage.success(`已设置无序列表样式：${styleNames[styleType]}`)
}
```

**关键 API**：
- `editor.chain().focus()`：链式调用，聚焦编辑器
- `updateAttributes('bulletList', { listStyleType: styleType })`：更新节点属性
- `.run()`：执行命令

### 数据持久化

列表样式通过以下方式持久化到数据库：

1. **内联样式**：`style="list-style-type: square !important"`
2. **Data 属性**：`data-list-style-type="square"`
3. **CSS 类**：`class="list-style-square"`

**示例 HTML**（保存到数据库）：
```html
<ul style="list-style-type: square !important" data-list-style-type="square" class="list-style-square">
  <li><p>列表项 1</p></li>
  <li><p>列表项 2</p></li>
</ul>
```

**回显机制**：
- `parseHTML()` 从内联样式或 data 属性中读取 `listStyleType` 值
- `renderHTML()` 根据属性值重新渲染样式
- 确保编辑和详情面板中样式一致

---

## 🐛 列表样式切换 Bug 修复历程

### Bug 现象
用户从下拉菜单选择不同的列表样式（如：圆点 → 方块）后，列表符号不发生变化，始终显示默认样式。

### 尝试的修复方案

#### ❌ 方案 1：调整 CSS 优先级
**思路**：移除默认样式的 `!important`，保留自定义样式类的 `!important`

```css
/* 默认样式（无 !important） */
.tiptap-content :deep(.ProseMirror) ul {
  list-style-type: disc;
}

/* 自定义样式类（有 !important） */
.tiptap-content :deep(.ProseMirror) ul.list-style-square {
  list-style-type: square !important;
}
```

**结果**：失败 ❌ - CSS 类被成功添加，但立即被清除

#### ❌ 方案 2：使用 DOM 操作 + setProperty
**思路**：直接操作 DOM，使用 `setProperty()` 设置内联样式并添加 `!important` 标志

```javascript
const domNode = editor.value.view.nodeDOM(pos)
domNode.classList.add(`list-style-${styleType}`)
domNode.style.setProperty('list-style-type', styleType, 'important')
```

**结果**：失败 ❌ - 样式被成功设置，但 Tiptap 重新渲染后被清除

#### ❌ 方案 3：在 onUpdate 回调中重新应用样式
**思路**：监听 Tiptap 的 `onUpdate` 事件，每次渲染后重新应用样式

```javascript
onUpdate: ({ editor }) => {
  const html = editor.getHTML()
  emit('update:modelValue', html)
  applyListStyles()  // 重新应用样式
}
```

**结果**：失败 ❌ - 样式被成功应用，但 Tiptap 在 `onUpdate` 之后再次渲染，清除了样式

### 根本原因分析

通过浏览器 DevTools 诊断发现：

1. ✅ `setBulletListStyle()` 方法被正确调用
2. ✅ DOM 节点被成功找到
3. ✅ CSS 类被成功添加（`list-style-square`）
4. ✅ 内联样式被成功设置（`style="list-style-type: square !important"`）
5. ❌ **但修改后的 classList 长度为 0**（`Array(0)`）

**关键发现**：
- 被修改的 DOM 节点是一个**空列表**（`class="is-empty is-editor-empty"`）
- 当用户开始输入并创建列表项时，**Tiptap 重新渲染 DOM**
- 重新渲染时，Tiptap 根据内部的节点数据重新生成 HTML，**清除了所有手动添加的 CSS 类和内联样式**

**根本原因**：
> Tiptap 使用 ProseMirror 的虚拟 DOM 机制，DOM 操作不会持久化到节点数据中。当 Tiptap 重新渲染时，会根据节点数据重新生成 HTML，导致手动添加的样式丢失。

### ✅ 最终解决方案：使用 Tiptap 官方 API

**核心思路**：
1. 扩展 BulletList 和 OrderedList，添加 `listStyleType` 属性
2. 使用 `updateAttributes()` API 更新节点属性（而不是直接操作 DOM）
3. 在 `renderHTML()` 钩子中根据属性值渲染样式

**优势**：
- ✅ 样式存储在节点数据中，不会被 Tiptap 重新渲染清除
- ✅ 使用官方 API，符合 Tiptap 的设计理念
- ✅ 样式可以正确保存到数据库并回显
- ✅ 代码简洁，易于维护

**实现步骤**：
1. 导入 BulletList 和 OrderedList 扩展
2. 使用 `.extend()` 方法创建自定义扩展
3. 在 `addAttributes()` 中添加 `listStyleType` 属性
4. 在 `renderHTML()` 中渲染内联样式和 CSS 类
5. 在编辑器配置中禁用默认扩展，注册自定义扩展
6. 使用 `updateAttributes()` API 更新列表样式

**参考文档**：
- Tiptap 官方文档：[Custom Extensions](https://tiptap.dev/guide/custom-extensions)
- Tiptap 官方文档：[Node Attributes](https://tiptap.dev/guide/custom-extensions#attributes)

---

**实现完成！** 🎉

