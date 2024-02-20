const Item = require("../models/item");
const Category = require("../models/category");

const asyncHandler = require("express-async-handler");

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

// Display detail page for a specific book.
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
  res.send("NOT IMPLEMENTED: Item create GET");
});

// Handle item create on POST.
exports.item_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item create POST");
});

// Display item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item delete GET");
});

// Handle item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item delete POST");
});

// Display item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item update GET");
});

// Handle item update on POST.
exports.item_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Item update POST");
});
