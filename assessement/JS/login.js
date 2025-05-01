const express = require("express");
const path = require("node:path");
const fs = require("fs");

const app = express();
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "css")));

let jproducts = [];
try {
  const product = fs.readFileSync("product.json", "utf-8");
  jproducts = JSON.parse(product);
} catch (err) {
  console.error("Failed to read  the products file :", err.message);
}

app.get("/", (req, res) => {
  console.log("GET / hit");
  res.render("login");
});

app.get("/admin", (req, res) => {
  console.log("GET /admin hit");
  res.render("admin");
});

app.get("/standard", (req, res) => {
  res.render("standard");
});
app.get("/home", (req, res) => {
    res.render("home");
  });
app.get("/products", (req, res) => {
    res.render("products", { jproducts }); 
  });

app.get("/newproducts", (req, res) => {
    res.render("newproducts"); 
  });

app.get("/Dashboard", (req, res) => {
    res.render("dashboard"); 
});

app.post("/logout", (req, res) => {
  res.redirect("/login");
});

app.post("/submit", (req, res) => {
  const credentials = req.body;

  if (
    credentials.password === "12345" &&
    (credentials.username === "admin" || credentials.username === "standard")
  ) {
    if (credentials.username === "admin") {
      console.log("Redirecting to admin");
      return res.redirect("/admin");
    } else if (credentials.username === "standard") {
      return res.redirect("/standard");
    }
  }

  res.redirect("/");
});

app.get("/products", (req, res) => {
  res.render("products", { jproducts });
});

app.post("/addproduct", (req, res) => {
    const newProduct = {
        id: jproducts.length + 1, 
        name: req.body.name,
        category: req.body.category,
        quantity: parseInt(req.body.quantity, 10),
        price: parseFloat(req.body.price)
    };

    try {
    
        const productFilePath = path.join(__dirname, "product.json");

        // Read the  products from product.json
        const productData = fs.existsSync(productFilePath)
            ? JSON.parse(fs.readFileSync(productFilePath, "utf-8"))
            : [];

        // Add the new product arry 
        productData.push(newProduct);

        // Write in back to product.json
        fs.writeFileSync(productFilePath, JSON.stringify(productData, null, 2), "utf-8");

        console.log("New product added:", newProduct);

        // Update the in-memory `jproducts` array to reflect the changes
        jproducts = productData;

        // Redirect back to the products
        res.redirect("/products");
    } catch (error) {
        console.error("Error adding product:", error.message);
        res.status(500).send("error occurred while adding the product.");
    }
});

app.listen(8000, () => {
  console.log(" Server listening on http://localhost:8000");
});
