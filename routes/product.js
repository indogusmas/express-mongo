import express from 'express';
const router = express.Router();

import {createProduct,getProduct,getProductById, updateProduct,deleteProduct} from '../controllers/productcontroller.js';


router.post('/',createProduct);
router.get('/',getProduct);
router.get('/:productId',getProductById);
router.put('/:productId',updateProduct);
router.delete('/:productId',deleteProduct);

export default router;

