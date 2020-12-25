import Product from "../models/productschema.js";

export const createProduct = async (req, res) => {
  try {
    const { type, stock } = req.body;

    if (!type || !stock) {
      res.status(422).json({
        status: "Fails",
        message: "Please provide all fields",
      });
    }
    const checkType = await Product.findOne({ type });
    if (checkType) {
      res.status(422).json({
        status: "Fails",
        message: "Type already exist",
      });
    }

    const newProduct = new Product({
      type,
      stock,
    });

    const saveProduct = await newProduct.save();
    res.status(200).json({
      status: "success",
      message: "Product add successfully",
      data: saveProduct,
    });
  } catch (error) {
    res.status(409).json({
      message: error.message,
    });
  }
};

export const getProduct = async (req, res) => {
  try {
    const productAll = await Product.find();
    res.status(200).json({
      status: "0",
      message: "success",
      data: productAll,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  console.log(req.params);
  const product = await Product.findOne({ _id: req.params.productId });
  res.status(200).json({
    status: "success",
    data: product,
  });
};

export const updateProduct = async (req, res) => {
  try {
    console.log(req.params.productId);
    await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true },
      (error, result) => {
        if (error) {
          return res.status(422).json({
            status: "Fail",
            message: "Type already exist",
          });
        }
        res.status(200).json({
          status: "success",
          message: "Stock was successfully product",
          data: result,
        });
      }
    );
  } catch (error) {
    return res.status(422).json({
      status: "Fail",
      message: `${error.message} error`,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    console.log(req.params.productId);
    await Product.findByIdAndDelete(req.params.productId, (error, result) => {
      if (error) {
        return res.status(422).json({
          status: "Fail",
          message: "Type already exist",
        });
      }
      res.status(200).json({
        message: "Success",
        data: {
          data: result,
        },
      });
    });
  } catch (error) {
    return res.status(422).json({
      status: "Fail",
      message: error,
    });
  }
};
