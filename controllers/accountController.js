
const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();




/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
};

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
};


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    
    // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("error-notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
    };

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    );
    
    

  if (regResult) {
    req.flash(
      "good-notice",
      `Congratulations, you\'re registered ${account_firstname} successfully. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("error-notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
};

// async function accountLogin(req, res, next) {
//      let nav = await utilities.getNav()
//   const { account_email, account_password } = req.body
//   const accountData = await accountModel.getAccountByEmail(account_email)
//   if (!accountData) {
//     req.flash("notice", "Please check your credentials and try again.")
//     res.status(400).render("account/login", {
//       title: "Login",
//       nav,
//       errors: null,
//       account_email,
//     })
//     return
//   }
//   try {
//     if (await bcrypt.compare(account_password, accountData.account_password)) {
//       delete accountData.account_password
//       const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
//       if(process.env.NODE_ENV === 'development') {
//         res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
//       } else {
//         res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
//       }
//       return res.redirect("/account/")
//     }
//     else {
//       req.flash("message error-notice", "Please check your credentials and try again.")
//       res.status(400).render("account/login", {
//         title: "Login",
//         nav,
//         errors: null,
//         account_email,
//       })
//     }
//   } catch (error) {
//     throw new Error('Access Forbidden')
//   }
// };

async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      req.session.userId = accountData.account_id; 
      return res.redirect("/account/");
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
};

function decodeToken(req, res) {

    const token = req.cookies.jwt; 
    if (!token) {
      return res.redirect("/account/login");
      
    
    }
    const decoded = jwt.decode(token);
  console.log(decoded);
  return decoded
};

async function buildManagement(req, res) {
  
  const nav = await utilities.getNav();
  const decodedData = decodeToken(req, res)

    // const accountType = decodedData.account_type;
    const accountFirstname = decodedData.account_firstname
  const accountType = decodedData.account_type
  const id = req.session.userId
  
  const acountUpdatePath = `<a href="/account/edit/${id}" class="link">Edit account details.</a>` + '<br>'          
  
    

  if (accountType === 'Client') {
    const greet = `Welcome ${accountFirstname}`
    
    res.render("account/account-management", {
      title: "Account Management",
      nav,
      greet,
      acountUpdatePath
    });
  }
  
    if (accountType === 'Employee' || accountType === 'Admin') {
      const greet = "Welcome " + accountFirstname
      // const invLink = await utilities.getLink();
      res.render("account/admin-employee-management", {
        title: "Account Management",
        nav,
        greet,
        acountUpdatePath
        // invLink
        // errors: null
      })
    }
  
};

async function editAccountInformation(req, res, next) {
  const account_id = parseInt(req.params.account_id);
  const nav = await utilities.getNav();
  const accountInformation = await accountModel.getAccountById(account_id);
  const name = `${accountInformation.account_firstname} ${accountInformation.account_lastname}`
  res.render("./account/edit-account", {
    title: "Edit " + name + "' s account",
    nav,
    errors: null,
    locals: {account_id: accountInformation.account_id},
    account_firstname: accountInformation.account_firstname, 
    account_lastname: accountInformation.account_lastname, 
    account_email: accountInformation.account_email, 
  })
};

async function updateAccount(req, res) {
  // const nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body

  const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)
  if (!updateResult) {
    console.log("Account not Updated");
  } else {
    console.log("Account Updated.");
    return res.redirect("/account/"); 
  }
};

// Logout
async function logout(req, res, next) {
  req.session.destroy((err) => {
    if (!err) {
      res.clearCookie('jwt')
      return res.redirect("/");
    } else {
      console.log("Could not logout.");
    }
  })
};

//  Requires Admin or Employee.
  async function requiresAdmin(req, res, next) {
    const decodedData = decodeToken(req, res)

    const accountType = decodedData.account_type;
    // const accountFirstname = decodedData.account_firstname
    
    if (accountType === 'Admin' || accountType === 'Employee') {
    next()
    console.log(accountType);
  }
  else {
      console.log("Access Forbidden.")
      req.flash("message error-notice", "Please login as an Admin or Employee to access this resource.")
      res.redirect('/account/');
  }
};


module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, decodeToken, buildManagement, editAccountInformation, updateAccount, logout, requiresAdmin };