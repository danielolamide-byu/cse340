


const utilities = require(".")
  const { body, validationResult } = require("express-validator")
const inValidate = {}
  
/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  inValidate.classificationRules = () => {
    return [
      // firstname is required and must be string
      body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a classification name."), // on error this message is sent.
    ]
}
  
/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
inValidate.checkClassificationData = async (req, res, next) => {
  const classificationSelect = await utilities.buildClassificationList()
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
    if (!errors.isEmpty()) {
        // const errorList = errors.array();
        // console.log(errorList);
      

    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add Inventory.",
      nav,
        classification_name,
      classificationSelect
    })
    return
  }
  next()
};



inValidate.checkInventoryData = async (req, res, next) => {
      const classificationSelect = await utilities.buildClassificationList()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/maanagement", {
      errors,
      title: "Inventory Management",
      nav,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classificationSelect
    })
    return
  }
  next()
  
};


 inValidate.inventoryRules = () => {
   return [  
      
      // valid email is required and cannot already exist in the DB
      body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid inv_make is required."),
  
      // password is required and must be strong password
      body("inv_model")
        .trim()
        .notEmpty()
        .escape()       
           .withMessage("Inv_model does not meet requirements."),
      
       body("inv_year")
        .isNumeric()
        .notEmpty()
        .escape()       
        .withMessage("Year does not meet requirements."),
       
        body("inv_description")
        .trim()
        .notEmpty()
        .escape()       
        .withMessage("Description does not meet requirements."),
        
         body("inv_price")
        .isNumeric()
        .notEmpty()
        .escape()       
        .withMessage("Price does not meet requirements."),
         
          body("inv_miles")
        .isNumeric()
        .notEmpty()
        .escape()       
           .withMessage("Miles does not meet requirements."),
          
          body("inv_color")
        .trim()
        .notEmpty()
        .escape()       
        .withMessage("Color does not meet requirements."),
    ]
}


module.exports = inValidate;
