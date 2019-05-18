const { ObjectId } = require('mongodb');
const Product = require('../models/product.js');
const User = require('../models/user.js');

const createProduct = async (req, res, next) => {
    try {
        const {
            name,
            userId,
            price,
            color,
            isAvailable,
            payload
        } = req.body;
        const existedUser = await User.findOne({_id: userId}).lean();
        if (!existedUser) {
            return next(new Error('USER_NOT_FOUND'));
        }
            // const existedProduct = await Product.findOne({name});
        // if (existedProduct) {
        //     return next(new Error('Product_already_existed'))
        // }// khog can dung vi da bat valition tai models user.js
        const product = new Product ({
            name,
            userId: ObjectId(userId),
            price,
            color,
            isAvailable,
            payload
        })
        const savedProduct = await product.save();
        return res.status(200).json({
            message: 'Create new product successfully',
            savedProduct
        });
    } catch (e) {
        return next(e);
    }
}

const deleteProduct = async (req, res, next) => {
    try {   
        const { id } = req.params;
        const deletingProduct = await Product.findOneAndDelete({_id: ObjectId(id)}).lean().select('_id name');
        if (!deletingProduct) {
            return next(new Error('PRODUCT_NOT_FOUND'));
        }
        return res.status(200).json({
            message: 'Delete product succesfully',
            deletedProductData : deletingProduct 
        });
    } catch (e) {
        return next(e);
    }
}

const getProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const getProduct = await Product.findOne({_id: ObjectId(id)});
        if (!getProduct) {
            return next(new Error('PRODUCT_NOT_FOUND'));
        }
        const getUserOfProduct = await User.find({_id: getProduct.userId});;
        const product = {...getProduct._doc};
        product.users = getUserOfProduct;
        return res.status(200).json({
            message : 'Info Product : ' + id ,
            data : product
        });
    } catch (e) {
        return next(e);
    }
};

const getListProduct = async (req, res, next) => {
    try {
        const getProducts = await Product.find().populate({
            path: 'userId',
            select: 'username'
        }).lean().select('_id name isAvailable');
        if (!getProducts) {
            return next(new Error('NOT_DATA'));
        }
        return res.status(200).json({
            message: 'List products',
            getProducts
        });
    } catch (e) {
        return next(e);
    }
}

const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            name,
            userId,
            price,
            color,
            isAvailable,
            payload
        } = req.body;
        const existedUser = User.findOne({_id: userId}).lean();
        if (!existedUser) {
            return next(new Error('UserId_does_not_exist'));
        }
        const newValues = {
            name,
            userId,
            price,
            color,
            isAvailable,
            payload
        };
        Object.keys(newValues).forEach( function(key) {
            if (newValues[key] === undefined) {
                delete newValues[key];
            }
        });
        const updateInfo = {$set: newValues};
        const updatingProduct = await Product.findOneAndUpdate({_id: ObjectId(id)}, updateInfo).lean();
        if (!updatingProduct) {
            return next(new Error('PRODUCT_NOT_FOUND'));
        }

        return res.status(200).json({
            message: 'Update product successfully',
            oldData: updatingProduct,
            dataChanges: newValues
        });
    } catch (e) {
        return next(e);
    }
}

module.exports = {
    createProduct,
    deleteProduct,
    getProduct,     
    getListProduct,
    updateProduct
};