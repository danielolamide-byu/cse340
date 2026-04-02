

const utilities = require("../utilities");


async function serverError (req, res, next) {
  let nav = await utilities.getNav()
  res.render("a500Error", {
    title: "Error",
    nav,
  })
}

module.exports = { serverError }