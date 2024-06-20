const express =  require('express')
const admin_router = express()
const session = require('express-session')
const multer = require('multer')
const bodyparser = require('body-parser')
const adminController =   require("../controllers/adminController")
const  productController  = require("../controllers/productController")
const categoryController = require("../controllers/categoryController");


//controlers

const {isAdmin,isLoggedAdmin} =    require('../middleware/adminAuth')
const categoryModel = require('../models/categoryModel')


admin_router.get("/adminLogin",isLoggedAdmin, adminController.adminLogin);
admin_router.post("/adminValidation", adminController.adminValidation);
admin_router.get("/adminPanel", isAdmin, adminController.adminPanel);


admin_router.get("/users", isAdmin, adminController.users);
admin_router.get('/block', adminController.blockUser);
admin_router.get('/unBlock', adminController.unBlockUser);

//Category 

admin_router.get("/Categories", isAdmin, categoryController.Categories);
admin_router.get( "/addCategories",isAdmin,categoryController.addCategoriesPage);
admin_router.post("/addCategory", isAdmin, categoryController.addCategory);
admin_router.get( "/editCategory/:id",isAdmin, categoryController.editCategoryPage);
admin_router.post("/editCategory", isAdmin, categoryController.editCategory);
admin_router.patch("/unlistCategory/:id",isAdmin,categoryController.unlistCategory);
admin_router.patch("/listCategory/:id",isAdmin, categoryController.listCategory);


//Product 
admin_router.get("/productList", isAdmin, productController.productList);
// admin_router.get('/productList/:page',isAdmin,productController.getProductsPagination)
admin_router.get("/addProductPage", isAdmin, productController.addProductPage);
admin_router.post("/addproducts", isAdmin, productController.addProduct);
admin_router.get("/unPublish", isAdmin, productController.unPublish);
admin_router.get("/publish", isAdmin, productController.publish);
admin_router.get("/editProductPage/:id",isAdmin, productController.editProductPage);
admin_router.post("/editProduct/:id", isAdmin, productController.editProduct);


module.exports = admin_router;