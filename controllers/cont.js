
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
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

// WEEK 03.
invCont.getSingleVehicle = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getVehicleById(inv_id)
  const grids = await utilities.details(data)
  let nav = await utilities.getNav()
  const className = data[0].inv_make
  res.render("./inventory/classifications", {
    title: className + " vehicle.",
    nav,
    grids,
  })
};


// WEEK04
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

invCont.addClassification = async function (req, res, next) {
     
    let nav = await utilities.getNav()
    // const classificationSelect = await utilities.buildClassificationList()
   
    // const { classification_name } = req.body
    const { classification_name } = req.body
  
    
    const addResult = await invModel.addClassification(
        classification_name,
    )

    if (classification_name.length < 1) {
        console.log(classification_name.length);
        req.flash("error-notice", "Sorry, the attempt to add a new classification failed.")
        // addResult = false;
        return render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            // classificationSelect
        })
    } else {
        req.flash(
            "good-notice",
            `Congratulations, you added a new classification.`)
        res.redirect('/inv', 201, {
            title: "Add Classification",
            nav,
        
        
        });
        // } else {
        //     req.flash("error-notice", "Sorry, the attempt to add a new classification failed.")
        //     res.status(500).render("inventory/add-classification", {
        //     title: "Add Classification",
        //       nav,
        //     // classificationSelect
        // })
        // }
    }
}

  invCont.inventoryForm = async function (req, res, next) {
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




  invCont.addInventory = async function (req, res, next) {
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
      res.redirect('/inv', 201, {
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



module.exports = invCont