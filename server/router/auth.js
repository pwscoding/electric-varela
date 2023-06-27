const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const pageAuth = require("../middleware/pageAuth")
const userPageAuth = require("../middleware/userPageAuth");
const multer = require('multer');
const fs = require('fs');

// Schemas
const ProductSchema = require('../models/ProductSchema')
const Admin = require('../models/admin')
const Service = require('../models/Services');
const Category = require("../models/Category");
const userSchema = require("../models/users");
const enquirySchema = require('../models/ProductEnquiry');
const ServiceCategory = require("../models/ServiceCategory");

// Admin Login Route 
router.post("/admin_login", async (req, res) => {
  try {
    const { emailId, password } = req.body

    const AdminData = await Admin.findOne({ email: emailId })
    console.log(AdminData);
    if (!AdminData) {
      res.status(400).json({ message: "Invalid Data" })
    } else {
      const isMatch = await bcrypt.compare(password, AdminData.password)
      if (isMatch) {
        // Getting Generated Tokens 
        const token = await AdminData.generateAuthToken()

        res.cookie("electricianCookies", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true
        })
        res.status(200).json({ message: "Logged Successfully" })
      } else {
        res.status(400).json({ message: "Invalid Credentials" })
      }
    }
  } catch (error) {
    console.log(error);
  }
})

// Profile Page Router
router.get("/admin_profile", pageAuth, (req, res) => {
  res.send(req.rootAdmin)
})

//Admin Logout
router.get("/admin_logout", (req, res) => {
  res.cookie('electricianCookies', '', { expires: new Date(1) });
  res.send('Cookie cleared');
})

// Admin Update
router.post('/admin_update', async (req, res) => {
  try {
    const { id, firstName, lastName, middleName, position, joined_this_position_on, status } = req.body
    let status_num = status==='Active' ? 1 : 0
    // console.log(id)
    Admin.findByIdAndUpdate(id, { firstname: firstName, lastname: lastName, middlename: middleName, position, joined_this_position_on, status: status_num }, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Admin updated successfully!');
        res.status(200).send({ status: 200, message: 'done' })
      }
    });
  } catch (error) {
    console.log(error)
  }
})

// Add Product
router.post('/add_product', async (req, res) => {
  // Creating a new Product
  try {
    const { product_name, category, color, description, material, price, quantity, size, weight, cta } = req.body.values
    const newProduct = new ProductSchema({ product_name, category, color, description, material, price, quantity, size, weight, cta, images0: [], images1: [], images2: [], images3: [], images4: [], images5: [], images6: [] })

    newProduct.save((error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Product saved successfully!');
        res.status(200).send({ status: 200, message: 'done' })
      }
    });


  } catch (error) {
    console.log(error)
  }
})

// Update product
router.post('/update_product', async (req, res) => {
  // Creating a new product
  try {
    const { selectedKey } = req.body
    const { product_name, category, color, description, material, price, quantity, size, weight, cta } = req.body.values
    // console.log(name,party)
    ProductSchema.findByIdAndUpdate(selectedKey, { product_name, category, color, description, material, price, quantity, size, weight, cta }, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Product updated successfully!');
        res.status(200).send({ status: 200, message: 'done' })
      }
    });
  } catch (error) {
    console.log(error)
  }
})

// Delete Products
router.post('/delete_product', async (req, res) => {
  try {
    const { selectedKey } = req.body
    ProductSchema.deleteOne({ _id: selectedKey }, (err) => {
      if (!err) {
        res.status(200).send({ status: 200, message: 'done' })
      }
    })
  } catch (error) {
    console.log(error)
  }
})

// get all Products list 
router.get('/getAllProducts', (req, res) => {
  try {
    ProductSchema.find({}, function (err, Products) {
      if (err) throw err;
      res.status(200).send(Products);
    });
  } catch (error) {
    res.status(400).send(error);
  }
})

// Product Image upload on server
// Handle file upload
// img storage path
const imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/products")
  },
  filename: (req, file, callback) => {
    callback(null, `image-${Date.now()} - ${file.originalname}`)
  }
})

// img filter
const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true)
  } else {
    callback(new Error("only images is allowd"))
  }
}

// Create the multer upload instance
const upload = multer({ storage: imgconfig, fileFilter: isImage });
router.post('/uploadProductImage', upload.array('images'), (req, res) => {
  const files = req.files;
  const { ids, index } = req.body;
  if (files && files.length > 1) {
    res.status(401).json({ status: 400, message: 'Upload 1 image at a time.' });
  } else {
    ProductSchema.findByIdAndUpdate(
      ids,
      { $set: { [`images${index}`]: [] } },
      { new: true },
      (err, doc) => {
        if (err) {
          console.error(err);
          res.status(400).json({ status: 400, message: err });
        } else {
          doc[`images${index}`].push(files[0].filename);
          doc.save((err) => {
            if (err) {
              console.error(err);
              res.status(400).json({ status: 401, message: err });
            } else {
              res.status(200).json({ status: 200, message: 'Image Uploaded Successfully' });
            }
          });
        }
      }
    );
  }
});

router.delete('/deleteProductImage', async (req, res) => {
  const { imageUrl, selectedKey, imageIndex } = req.body;
  
  try {
    // Delete the image file from the folder
    fs.unlink(`uploads/products/${imageUrl}`, async (error) => {
      if (error) {
        console.log('Error deleting image file:', error);
        return res.status(500).json({ message: 'Error deleting image file' });
      }
      try {
        // Update the ProductSchema to set the specified imageIndex as an empty string
        const updateQuery = { $set: { [imageIndex]: "" } };
        const updatedProduct = await ProductSchema.findByIdAndUpdate(selectedKey, updateQuery, { new: true });
        
        if (updatedProduct) {
          console.log('Product Image updated successfully!');
          return res.status(200).json({ status: 200, message: 'done' });
        } else {
          console.log('Product not found');
          return res.status(404).json({ status: 404, message: 'Product not found' });
        }
      } catch (error) {
        console.log('Error updating product:', error);
        return res.status(500).json({ message: 'Error updating product' });
      }
    });
  } catch (error) {
    console.log('Error deleting image:', error);
    return res.status(500).json({ message: 'Error deleting image' });
  }
});


// ------------------------- SERVICE AUTH ------------------------------- //
// Add service
router.post('/add_service', async (req, res) => {
  // Creating a new service
  try {
    const { descriptionCkeditor } = req.body

    const { service_title, contactTitle, contactDescription, service_category_name, contactNumber } = req.body.values
    const newService = new Service({ service_title, description: descriptionCkeditor, service_category_name, contactTitle, contactDescription, contactNumber })

    newService.save((error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Service saved successfully!');
        res.status(200).send({ status: 200, message: 'done' })
      }
    });
  } catch (error) {
    console.log(error)
  }
})

// Update service
router.post('/update_service', async (req, res) => {
  // Creating a new service
  try {
    const { selectedKey, descriptionCkeditor } = req.body
    const { service_title, contactTitle, contactDescription, service_category_name, contactNumber } = req.body.values
    Service.findByIdAndUpdate(selectedKey, { service_title, description: descriptionCkeditor, service_category_name, contactTitle, contactDescription, contactNumber }, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Service updated successfully!');
        res.status(200).send({ status: 200, message: 'done' })
      }
    });
  } catch (error) {
    console.log(error)
  }
})

// get all Services list 
router.get('/getAllServices', (req, res) => {
  try {
    Service.find({}, function (err, Service) {
      if (err) throw err;
      res.status(200).send(Service);
    });
  } catch (error) {
    res.status(400).send(error);
  }
})

// Delete Service
router.post('/delete_service', async (req, res) => {
  try {
    const { selectedKey } = req.body
    Service.deleteOne({ _id: selectedKey }, (err) => {
      if (!err) {
        res.status(200).send({ status: 200, message: 'done' })
      }
    })
  } catch (error) {
    console.log(error)
  }
})

// Service Image upload on server
// Handle file upload
// img storage path
const imgconfigService = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/services")
  },
  filename: (req, file, callback) => {
    callback(null, `Service_image-${Date.now()} - ${file.originalname}`)
  }
})

// img filter
const isImageService = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true)
  } else {
    callback(new Error("only images is allowd"))
  }
}
// Create the multer upload instance
const uploadService = multer({ storage: imgconfigService, fileFilter: isImageService });
router.post('/uploadServiceImage', uploadService.array('images'), (req, res) => {
  const files = req.files;
  const { ids, index } = req.body;
  Service.findByIdAndUpdate(ids, { imageBody: files[0].filename }, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Service Image updated successfully!');
      res.status(200).send({ status: 200, message: 'Service Image updated successfully!' })
    }
  });
});

// ------------------------- Category AUTH ------------------------------- //
// Add Category
router.post('/add_category', async (req, res) => {
  // Creating a new Category
  try {
    const { category_name } = req.body.values
    const newCategory = new Category({ category_name })

    newCategory.save((error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Category saved successfully!');
        res.status(200).send({ status: 200, message: 'done' })
      }
    });


  } catch (error) {
    console.log(error)
  }
})

// get all Category list 
router.get('/getAllcategories', (req, res) => {
  try {
    Category.find({}, function (err, Category) {
      if (err) throw err;
      res.status(200).send(Category);
    });
  } catch (error) {
    res.status(400).send(error);
  }
})

// Update category
router.post('/update_category', async (req, res) => {
  // Creating a new category
  try {

    const { selectedKey } = req.body
    const { category_name } = req.body.values

    Category.findByIdAndUpdate(selectedKey, { category_name }, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Category updated successfully!');
        res.status(200).send({ status: 200, message: 'done' })
      }
    });
  } catch (error) {
    console.log(error)
  }
})

// Delete category
router.post('/delete_category', async (req, res) => {
  try {
    const { selectedKey } = req.body
    Category.deleteOne({ _id: selectedKey }, (err) => {
      if (!err) {
        res.status(200).send({ status: 200, message: 'done' })
      }
    })
  } catch (error) {
    console.log(error)
  }
})

// CATEGORY Image upload on server
// Handle file upload
// img storage path
const imgconfigCategory = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads/category")
  },
  filename: (req, file, callback) => {
    callback(null, `Category-${Date.now()} - ${file.originalname}`)
  }
})
// img filter
const isImageCategpry = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true)
  } else {
    callback(new Error("only images is allowd"))
  }
}
// Create the multer upload instance
const uploadCategory = multer({ storage: imgconfigCategory, fileFilter: isImageCategpry });
router.post('/uploadCategoryImage', uploadCategory.array('images'), (req, res) => {
  const files = req.files;
  const { ids } = req.body;
  Category.findByIdAndUpdate(ids, { imageCategory: files[0].filename }, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Category Image updated successfully!');
      res.status(200).send({ status: 200, message: 'Image Uploaded Successfully' })
    }
  });
});

router.delete('/deleteCategoryImage', async (req, res) => {
  const { imageUrl, selectedKey } = req.body;
  
  try {
    // Delete the image file from the folder
    fs.unlink(`uploads/category/${imageUrl}`, async (error) => {
      if (error) {
        console.log('Error deleting image file:', error);
        return res.status(500).json({ message: 'Error deleting image file' });
      }
      try {
        // Update the Category to set the specified imageIndex as an empty string
        const updateQuery = { $set: { imageCategory : "" } };
        const updateCategory = await Category.findByIdAndUpdate(selectedKey, updateQuery, { new: true });
        
        if (updateCategory) {
          console.log('Category Image updated successfully!');
          return res.status(200).json({ status: 200, message: 'done' });
        } else {
          console.log('Category not found');
          return res.status(404).json({ status: 404, message: 'Category not found' });
        }
      } catch (error) {
        console.log('Error updating Category:', error);
        return res.status(500).json({ message: 'Error updating Category' });
      }
    });
  } catch (error) {
    console.log('Error deleting image:', error);
    return res.status(500).json({ message: 'Error deleting image' });
  }
});

// -------------------------- SERVICE CATEGORY Auth ------------------------- //
router.post('/add_service_category', async (req, res) => {
  // Creating a new Service Category
  try {
    const { service_category_name } = req.body.values
    const newServiceCategory = new ServiceCategory({ service_category_name })

    newServiceCategory.save((error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Service Category saved successfully!');
        res.status(200).send({ status: 200, message: 'done' })
      }
    });


  } catch (error) {
    console.log(error)
  }
})

// get all Service Category list 
router.get('/getAllServicecategories', (req, res) => {
  try {
    ServiceCategory.find({}, function (err, Category) {
      if (err) throw err;
      res.status(200).send(Category);
    });
  } catch (error) {
    res.status(400).send(error);
  }
})

// Update Service category
router.post('/update_service_category', async (req, res) => {
  // Creating a new Service category
  try {

    const { selectedKey } = req.body
    const { service_category_name } = req.body.values

    ServiceCategory.findByIdAndUpdate(selectedKey, { service_category_name }, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Service Category updated successfully!');
        res.status(200).send({ status: 200, message: 'done' })
      }
    });
  } catch (error) {
    console.log(error)
  }
})

// Delete Service category
router.post('/delete_service_category', async (req, res) => {
  try {
    const { selectedKey } = req.body
    ServiceCategory.deleteOne({ _id: selectedKey }, (err) => {
      if (!err) {
        res.status(200).send({ status: 200, message: 'done' })
      }
    })
  } catch (error) {
    console.log(error)
  }
})

router.delete('/deleteServiceImage', async (req, res) => {
  const { imageUrl, selectedKey } = req.body;
  
  try {
    // Delete the image file from the folder
    fs.unlink(`uploads/services/${imageUrl}`, async (error) => {
      if (error) {
        console.log('Error deleting image file:', error);
        return res.status(500).json({ message: 'Error deleting image file' });
      }
      try {
        // Update the Category to set the specified imageIndex as an empty string
        const updateQuery = { $set: { imageBody : "" } };
        const updateService = await Service.findByIdAndUpdate(selectedKey, updateQuery, { new: true });
        
        if (updateService) {
          console.log('Service Image updated successfully!');
          return res.status(200).json({ status: 200, message: 'Service Image updated successfully!' });
        } else {
          console.log('Service not found');
          return res.status(404).json({ status: 404, message: 'Service not found' });
        }
      } catch (error) {
        console.log('Error updating Service:', error);
        return res.status(500).json({ message: 'Error updating Service' });
      }
    });
  } catch (error) {
    console.log('Error deleting image:', error);
    return res.status(500).json({ message: 'Error deleting image' });
  }
});

// ------------------------- USER AUTHENTICATION LOGICS ------------------- //
router.post('/user_register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    const UserExists = await userSchema.findOne({ email: email });

    if (UserExists) {
      res.status(400).json({ message: "User Already Exists" });
    } else {
      const UserSave = new userSchema({ fullName: name, email, password })
      const savedUser = await UserSave.save();
      const userId = savedUser._id;
      res.status(200).json({ userId, message: "Registered Successfully" });
    }

  } catch (error) {
    console.log(error)
  }
})

router.post("/productEnquirySchema", async (req, res) => {
  try {
    const { name, email, pid, productQuantity, description, status, userId } = req.body;

    // Check if the enquiry already exists based on name, email, and product
    const existingEnquiry = await enquirySchema.findOne({
      name: name,
      email: email,
      product: pid
    });

    if (existingEnquiry) {
      return res.status(400).send({ status: 400, message: 'Enquiry already exists' });
    }

    const newEnquiry = new enquirySchema({
      name,
      email,
      product: pid,
      quantity: productQuantity,
      message: description,
      status,
      user: userId
    });

    await newEnquiry.save();
    console.log('Enquiry saved successfully:', newEnquiry);
    res.status(200).send({ status: 200, message: 'Enquiry sent successfully' });
  } catch (error) {
    console.error('Error saving enquiry:', error);
    res.status(500).send({ status: 500, message: 'Something went wrong...' });
  }
});

// User Login Route 
router.post("/user_login", async (req, res) => {
  try {
    const { email, password } = req.body

    const UserData = await userSchema.findOne({ email: email })

    if (!UserData) {
      res.status(400).json({ message: "Invalid Data" })
    } else {
      const isMatch = await bcrypt.compare(password, UserData.password)
      if (isMatch) {
        // Getting Generated Tokens 
        const token = await UserData.generateAuthToken()

        res.cookie("electricianCookiesUser", token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true
        })
        res.status(200).json({ message: "Logged Successfully" })
      } else {
        res.status(400).json({ message: "Invalid Credentials" })
      }
    }
  } catch (error) {
    console.log(error);
  }
})

// User Profile Page 
router.get("/user_profile", userPageAuth, (req, res) => {
  res.send(req.rootUser)
  console.log(req.rootUser);
})

router.get("/user_logout", (req, res) => {
  res.cookie('electricianCookiesUser', '', { expires: new Date(1) });
  res.send('Cookie cleared');
})

// Get ALL Enquires 
router.get('/getAllEnquiries', (req, res) => {
  try {
    enquirySchema.find({}, function (err, enquirySchema) {
      if (err) throw err;
      res.status(200).send(enquirySchema);
    });
  } catch (error) {
    res.status(400).send(error);
  }
})
module.exports = router
