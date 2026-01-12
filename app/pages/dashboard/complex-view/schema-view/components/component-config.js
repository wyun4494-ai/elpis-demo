import viewParamsDrawer from "./view-params-drawer/view-params-drawer.vue"
import editParamCategoryDrawer from "./edit-param-category-drawer/edit-param-category-drawer.vue"
import createParamDialog from "./create-param-dialog/create-param-dialog.vue"
import assignMenuDialog from "./assign-menu-dialog/assign-menu-dialog.vue"
import timeSlotListDialog from "./time-slot-list-dialog/time-slot-list-dialog.vue"
import productDrawer from "./product-drawer/product-drawer.vue"
import flashSaleProductListDrawer from "./flash-sale-product-list-drawer/flash-sale-product-list-drawer.vue"
import addProductDialog from "./add-product-dialog/add-product-dialog.vue"
import editProductDialog from "./edit-product-dialog/edit-product-dialog.vue"
import addTimeSlotDialog from "./add-time-slot-dialog/add-time-slot-dialog.vue"
import couponDetailDrawer from "./coupon-detail-drawer/coupon-detail-drawer.vue"
import adPositionManager from "./ad-position-manager/ad-position-manager.vue"
import deliverDialog from "../../../../widgets/schema-form/complex-view/deliver-dialog/deliver-dialog.vue"
import cancelDialog from "../../../../widgets/schema-form/complex-view/cancel-dialog/cancel-dialog.vue"
import orderListHandler from "./order-list-handler/order-list-handler.vue"

const ComponentConfig = {
  viewParamsDrawer: {
    component: viewParamsDrawer
  },
  editParamCategoryDrawer: {
    component: editParamCategoryDrawer
  },
  createParamDialog: {
    component: createParamDialog
  },
  assignMenuDialog: {
    component: assignMenuDialog
  },
  timeSlotListDialog: {
    component: timeSlotListDialog
  },
  productDrawer: {
    component: productDrawer
  },
  flashSaleProductListDrawer: {
    component: flashSaleProductListDrawer
  },
  addProductDialog: {
    component: addProductDialog
  },
  editProductDialog: {
    component: editProductDialog
  },
  addTimeSlotDialog: {
    component: addTimeSlotDialog
  },
  couponDetailDrawer: {
    component: couponDetailDrawer
  },
  adPositionManager: {
    component: adPositionManager
  },
  deliverDialog: {
    component: deliverDialog
  },
  cancelDialog: {
    component: cancelDialog
  },
  orderListHandler: {
    component: orderListHandler
  }
}

export default ComponentConfig;