import express from 'express';
const router = express.Router();

import {createProduct,getProduct} from '../controllers/productcontroller.js';


router.post('/',createProduct);
router.get('/',getProduct);

export default router;

