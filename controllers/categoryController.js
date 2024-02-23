const Item = require("../models/item");
const Category = require("../models/category");

const asyncHandler = require("express-async-handler");

// Display list of all Category.
exports.category_list = asyncHandler(async (req, res, next) => {
  
  const categories = await Category.find().sort({ name: 1 }).exec();
  res.render("category_list", { title: "Category List", category_list: categories });
});

// Display detail page for a specific Category.
exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, items] = await Promise.all([

    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }).exec()
  ]);

  res.render("category_detail", { title: category.name, category: category, items: items });
});

// Display Category create form on GET.
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category create GET");
});

// Handle Category create on POST.
exports.category_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category create POST");
});

// Display Category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category delete GET");
});

// Handle Category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category delete POST");
});

// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category update GET");
});

// Handle Category update on POST.
exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category update POST");
});
