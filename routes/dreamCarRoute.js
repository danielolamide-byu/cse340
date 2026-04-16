
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

router.get("/", utilities.handleErrors(invController.getAllDreamCars));
router.get("/detail/:dreamCarId", utilities.handleErrors(invController.getSingleDreamCar));

router.get("/manage", utilities.handleErrors(invController.dreamCarManagement));

router.get("/add-dream-inventory", utilities.handleErrors(invController.dreamInventoryForm));

router.post("/add-dream-inventory",
    // regValidate.classificationRules(),
    // regValidate.checkClassificationData,
    utilities.handleErrors(invController.addDreamInventory));




module.exports = router

