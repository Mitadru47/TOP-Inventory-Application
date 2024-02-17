#! /usr/bin/env node

console.log('This script populates some test items & categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://Admin-Mitadru:DB1234@clustermg.e4fjgoy.mongodb.net/inventoryAppDB?retryWrites=true&w=majority"');
  
// Get arguments passed on command line -> node populatedb <your MongoDB url>
const userArgs = process.argv.slice(2);

const Item = require("./models/item");
const Category = require("./models/category");

const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {

    console.log("Debug: About to connect");
    
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");

    await createCategories();
    await createItems();
    
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
}

// We pass the index to the categoryCreate function so that, for example,
// category[0] will always be the Standard Category, regardless of the order
// in which the elements of promise.all's argument complete.

async function categoryCreate(index, name) {

    const category = new Category({ name: name });
    await category.save();
    
    categories[index] = category;
    console.log(`Added category: ${name}`);
}

async function itemCreate(title, summary, category) {
    
    const itemdetail = {

        title: title,
        summary: summary,
    };

    if (category != false) itemdetail.category = category;

    const item = new Item(itemdetail);
    await item.save();

    console.log(`Added item: ${title}`);
}

async function createCategories() {

    console.log("Adding categories");

    await Promise.all([
        categoryCreate(0, "Category 1"),
        categoryCreate(1, "Category 2"),
    ]);
}

async function createItems() {
    console.log("Adding items");

    await Promise.all([

        itemCreate(
        "Test Item 1",
        "Summary of Test Item 1.",
        [categories[0]]
        ),

        itemCreate(
        "Test Item 2",
        "Summary of Test Item 2.",
        [categories[0], categories[1]]
        )
    ]);
}  