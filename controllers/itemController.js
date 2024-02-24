const Item = require("../models/item");
const Category = require("../models/category");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  
  const [itemCount, categoryCount] = await Promise.all([

    Item.countDocuments({}).exec(),
    Category.countDocuments({}).exec()
  ]);

  res.render("index", { title: "Inventory Application Home", itemCount: itemCount, categoryCount: categoryCount });
});

// Display list of all items.
exports.item_list = asyncHandler(async (req, res, next) => {
  const items = await Item.find().sort({ title: 1 }).exec();
  res.render("item_list", { title: "Item List", item_list: items });
});

// Display detail page for a specific item.
exports.item_detail = asyncHandler(async (req, res, next) => {
  
  const item = await Item.findById(req.params.id).populate("category").exec();
  
  if(item === null){

    const error = new Error("Item not found!");
    error.status = 404;

    return next(error);
  }

  res.render("item_detail", { title: item.title, item_detail: item });
});

// Display item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().sort({ name: 1 }).exec();
  res.render("item_form", { title: "Add Item", categories: categories });
});

// Handle item create on POST.
exports.item_create_post = [

  // Converting category to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  // Validate and sanitize fields.

  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("category.*").escape(), 
  // We use a wildcard (*) in the sanitizer to individually validate each of the genre array entries. 
  
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create an Item object with escaped and trimmed data.
    const item = new Item({
      title: req.body.title,
      summary: req.body.summary,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get categories for form.
      const categories = await Category.find().sort({ name: 1 }).exec();
  
      // Mark our selected categories as checked.
      for (const category of categories) {
        if (item.category.includes(category._id)) {
          category.checked = "true";
        }
      }

      // In order to mark the categories that were checked by the user we iterate through all the categories and add the 
      // checked="true" parameter to those that were in our post data.
      res.render("item_form", { title: "Add Item", categories: categories, errors: errors.array() });

    } else {
      // Data from form is valid. Save item.
      await item.save();
      res.redirect(item.url);
    }
  })
];

// Display item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  
  const item = await Item.findById(req.params.id).populate("category").exec();
  
  if(item === null){

    const error = new Error("Item not found!");
    error.status = 404;

    return next(error);
  }

  res.render("item_delete", { title: "Delete Item", item: item });
});

// Handle item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndDelete(req.body.itemid);
  res.redirect("/catalog/items");
});

// Display item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {

  const [item, categories] = await Promise.all([

    await Item.findById(req.params.id).exec(),
    await Category.find().sort({ name: 1 }).exec()
  ]);

  // Mark our selected categories as checked.
  categories.forEach((category) => {
    if (item.category.includes(category._id)) category.checked = "true";
  });

  res.render("item_form", { title: "Add Item", item: item, categories: categories });
});

// Handle item update on POST.
exports.item_update_post = [

  // Converting category to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    next();
  },

  // Validate and sanitize fields.

  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("category.*").escape(), 
  // We use a wildcard (*) in the sanitizer to individually validate each of the genre array entries. 
  
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create an Item object with escaped/trimmed data and old id.
    const item = new Item({
      title: req.body.title,
      summary: req.body.summary,
      category: req.body.category,

      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get categories for form.
      const categories = await Category.find().sort({ name: 1 }).exec();
  
      // Mark our selected categories as checked.
      for (const category of categories) {
        if (item.category.includes(category._id)) {
          category.checked = "true";
        }
      }

      // In order to mark the categories that were checked by the user we iterate through all the categories and add the 
      // checked="true" parameter to those that were in our post data.
      res.render("item_form", { title: "Add Item", categories: categories, errors: errors.array() });

    } else {
      // Data from form is valid. Update the record.
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {});
      // Redirect to item detail page.
      res.redirect(updatedItem.url);
    }
  })
];