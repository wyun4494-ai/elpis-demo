import Textarea from './complex-view/textarea/textarea.vue'
import Datetime from './complex-view/datetime/datetime.vue'
import DatetimeRange from './complex-view/datetime-range/datetime-range.vue'
import CouponForm from './complex-view/coupon-form/coupon-form.vue'
import ProductSelector from './complex-view/product-selector/product-selector.vue'
import BrandSelector from './complex-view/brand-selector/brand-selector.vue'
import CategorySelector from './complex-view/category-selector/category-selector.vue'
import AdPositionSelector from './complex-view/ad-position-selector/ad-position-selector.vue'
import CodeEditor from './complex-view/code-editor/code-editor.vue'
import LinkTargetSelector from './complex-view/link-target-selector/link-target-selector.vue'

const FormItemConfig = {
  textarea: {
    component: Textarea,
  },
  datetime: {
    component: Datetime,
  },
  'datetime-range': {
    component: DatetimeRange,
  },
  'coupon-form': {
    component: CouponForm,
  },
  'product-selector': {
    component: ProductSelector,
  },
  'brand-selector': {
    component: BrandSelector,
  },
  'category-selector': {
    component: CategorySelector,
  },
  'ad-position-selector': {
    component: AdPositionSelector,
  },
  'code-editor': {
    component: CodeEditor,
  },
  'link-target-selector': {
    component: LinkTargetSelector,
  }
}

export default FormItemConfig;