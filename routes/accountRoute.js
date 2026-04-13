

const regValidate = require("../utilities/account-validation");
// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require('../controllers/accountController');
const utilities = require('../utilities');

// GET.
router.get("/", utilities.handleErrors(accountController.buildManagement));
router.get('/login', utilities.handleErrors(accountController.buildLogin));
router.get('/register', utilities.handleErrors(accountController.buildRegister));
router.get('/edit/:account_id', utilities.handleErrors(accountController.editAccountInformation));
// router.get('/edit/information', utilities.handleErrors(accountController.edit));

// POST.
//  Processes the login data.
router.post(
    "/login",
    // regValidate.loginRules(),
    // regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
);

// Processes the registration data.
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Proecsses the Update.
router.post(
    "/update",
    utilities.handleErrors(accountController.updateAccount)
);

//  Processes the Logout.
router.post("/logout", utilities.handleErrors(accountController.logout));

module.exports = router;
