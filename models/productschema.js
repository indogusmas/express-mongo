import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    type:{
        type: String,
        required: [true, 'Provide  your tipe data'],
        unique: true,
    },
    stock:{
        type: Number,
        required: [true, 'Provide your tipe data']
    },
});

const Product = mongoose.model('Product',productSchema);

export default Product;