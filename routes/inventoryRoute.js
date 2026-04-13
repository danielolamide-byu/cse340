
// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require('../utilities');

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:invId", utilities.handleErrors(invController.getSingleVehicle));
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView));
router.post("/update", utilities.handleErrors(invController.updateInventory));
router.delete("/delete/:inv_id", utilities.handleErrors(invController.deleteInventory));


// router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

module.exports = router;