


const utilities = require("../utilities");
const invController = require("../controllers/invController");
const regValidate = require("../utilities/inventory-validation");

// Needed Resources 
const express = require("express");
const router = new express.Router();


// Route to build inventory by classification view
router.get("/", utilities.handleErrors(invController.vehicleManagement));

router.get("/add-classification", utilities.handleErrors(invController.classificationForm));
// router.get("/add-classification", accountController.requiresAdmin, utilities.handleErrors(invController.classificationForm));
// router.get("/add-inventory", accountController.requiresAdmin, utilities.handleErrors(invController.inventoryForm));
router.get("/add-inventory", utilities.handleErrors(invController.inventoryForm));

// //Add Dream Car
// router.get("/add-dream-car", utilities.handleErrors(dreamCarController.dreamCarForm));
// router.get("/dream-car/:dream_id", utilities.handleErrors(dreamCarController.getDetails))



router.post(
    "/add-classification",
    regValidate.classificationRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification));

    
router.post(
    "/add-inventory",
    // regValidate.inventoryRules(),
    // regValidate.checkClassificationData,
    utilities.handleErrors(invController.addInventory));

// router.post(
//     "/add-dream-car",
//     // regValidate.inventoryRules(),
//     // regValidate.checkClassificationData,
//     utilities.handleErrors(dreamCarController.addDreamCar)
// );






module.exports = router;