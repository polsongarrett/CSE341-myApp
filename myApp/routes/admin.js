const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const router = express.Router();
const isAuth = require('../middleware/is-auth');
const { body } = require('express-validator/check');

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

// /admin/products => GET
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post(
  '/add-product', 
  [
    body('title').isString().isLength({ min: 1 }).trim(),
    body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description').isLength({ min: 1, max: 250 }).trim()
  ], 
  isAuth, adminController.postAddProduct
);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post(
  '/edit-product',
  [
    body('title').isString().isLength({ min: 1 }).trim(),
    body('imageUrl').isURL(),
    body('price').isFloat(),
    body('description').isLength({ min: 1, max: 250 }).trim()
  ],  
  isAuth, adminController.postEditProduct);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);
module.exports = router;
