
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  // className.classList.add('des')
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
};

invCont.getSingleVehicle = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getVehicleById(inv_id)
  const grids = await utilities.details(data)
  let nav = await utilities.getNav()
  const className = data[0].inv_make
  res.render("./inventory/classifications", {
    title: className + " vehicle",
    nav,
    grids,
  })
};

invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getVehicleById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
};



// invCont.vehicleManagement = async function (req, res, next) {
//   let nav = await utilities.getNav()
//     res.render("inventory/management", {
//         title: "Vehicle Management",
//         nav,
//     });
// };


// invCont.addClassification = async function (req, res, next) {
//   let nav = await utilities.getNav()
//   res.render("inventory/add-classification", {
//     title: "Add Classification",
//     nav,
//   })
// };


invCont.vehicleManagement = async function(req, res, next) {
  const classificationSelect = await utilities.buildClassificationList()
  let nav = await utilities.getNav()
    res.render("inventory/management", {
        title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect
    });
};

invCont.classificationForm = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: 'Add Classification',
    nav,
    errors: null
  })
};

 invCont.addClassification = async function(req, res, next) {
     
   let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
   
  // const { classification_name } = req.body
  const { classification_name } = req.body
  
    
   const addResult = await invModel.addClassification(
     classification_name,
   )

   if (classification_name.length < 1) {
         req.flash("notice", "Sorry, the attempt to add a new classification failed.")
        return res.status(500).render("inventory/add-classification", {
        title: "Add Classification",
          nav,
        classificationSelect
    })
   }
   
    if (addResult) {
        req.flash(
      "good-notice",
      `Congratulations, you added a new classification.`)
        res.redirect("/inv", 201, {
        title: "Add Classification",
          nav,
        classificationSelect
        
    });
    } else {
        req.flash("error-notice", "Sorry, the attempt to add a new classification failed.")
        res.status(500).render("inventory/add-classification", {
        title: "Add Classification",
          nav,
        classificationSelect
    })
    }
};

 invCont.inventoryForm = async function(req, res, next) {
  let nav = await utilities.getNav();
  const classification_id = req.params.classificationId
  const list = await utilities.buildClassificationList(classification_id)
  res.render("inventory/add-inventory", {
    title: 'Add Inventory',
    nav,
    list,
    errors: null
  })
};


 invCont.addInventory = async function(req, res, next) {
  let nav = await utilities.getNav()
  
      const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    
      const addResult = await invModel.addInventory(
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
  )
  
    if (addResult) {
        req.flash(
      "good-notice",
      `Congratulations, you added a new inventory item.`)
        res.redirect("/inv", 201, {
        title: "Inventory Management.",
        nav,
        errors: null
        });
      
    } else {
        req.flash("error-notice", "Sorry, the attempt to add a new inventory item failed.")
        res.status(500).render("inventory/add-inventory", {
        title: "Add Inventory",
        nav,
    })
    }
};



// invCont.dreamCarForm = async function(req, res) {
//     // let nav = await utilities.getNav()
//       let nav = await utilities.getNav()
    
//     res.render("dream-car/details", {
//         title: "Add Dream Car",
//         nav,
//         errors:null
//     })


// }
   

// module.exports = { vehicleManagement, addClassification, classificationForm, addInventory, inventoryForm };


 module.exports = invCont