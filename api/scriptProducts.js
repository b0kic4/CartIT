const mongoose = require("mongoose");
const Product = require("./schemas/Product");
const fs = require("fs");

mongoose
  .connect(
    "mongodb+srv://borisnikolic2302:Dcvw1cvuPLPaZbhT@cluster0.u2oogu4.mongodb.net/test",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB from script");
    insertData();
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB in script: " + err);
  });

const rawData = fs.readFileSync("products.json");
const productsData = JSON.parse(rawData);

async function insertData() {
  try {
    for (const productData of productsData.products) {
      // Check if a product with the same title already exists
      const existingProduct = await Product.findOne({
        title: productData.title,
      });

      if (existingProduct) {
        console.log("Product already exists: ", productData.title);
      } else {
        const product = new Product(productData);
        await product.save();
        console.log("Data inserted: ", productData.title);
      }
    }
  } catch (error) {
    console.error("Error inserting data", error);
  } finally {
    mongoose.disconnect();
  }
}
async function removeDuplicates() {
  try {
    // Find all products and group them by title to identify duplicates
    const duplicateProducts = await Product.aggregate([
      {
        $group: {
          _id: "$title",
          count: { $sum: 1 },
          ids: { $push: "$_id" },
        },
      },
      {
        $match: {
          count: { $gt: 1 }, // Find titles with more than one occurrence
        },
      },
    ]);

    // Iterate through duplicate titles and keep one instance, remove the rest
    for (const duplicate of duplicateProducts) {
      const [keepId, ...removeIds] = duplicate.ids;
      await Product.deleteMany({ _id: { $in: removeIds } });
      console.log(`Removed duplicates for title: ${duplicate._id}`);
    }

    console.log("Duplicate removal complete.");
  } catch (error) {
    console.error("Error removing duplicates", error);
  } finally {
    mongoose.disconnect();
  }
}

removeDuplicates();
insertData();
