const Item = require("../models/item");
const Category = require("../models/category");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
  res.render("category_form", { title: "Add Category" });
});

// Handle Category create on POST.
exports.category_create_post = [
  
  // Validate and sanitize fields.

  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(), 
  
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Category object with escaped and trimmed data.
    const category = new Category({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.
      res.render("category_form", { title: "Add Category", category: category });

    } else {
      // Data from form is valid. Save category.
      await category.save();
      res.redirect(category.url);
    }
  })
];

// Display Category delete form on GET.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  
  const [category, items] = await Promise.all([
    
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id}).exec()
  ]);
  
  console.log(items);

  if(category === null){

    const error = new Error("Item not found!");
    error.status = 404;

    return next(error);
  }

  res.render("category_delete", { title: "Delete Category", category: category, items: items });
});

// Handle Category delete on POST.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  
  const [category, items] = await Promise.all([
    
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id}).exec()
  ]);

  if(items.length > 0){

    res.render("category_delete", {

      title: "Delete Category",
      items: items
    });

    return;

  } else {

    // Delete object and redirect to the list of categories.
    await Category.findByIdAndDelete(req.body.categoryid);
    res.redirect("/catalog/categories");
  }
});

// Display Category update form on GET.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category update GET");
});

// Handle Category update on POST.
exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Category update POST");
});
