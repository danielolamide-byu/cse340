
const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul class= 'navUl'>"
  list += '<li><a href="/" title="Home page" class="ab">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a class="navUl" href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  grid += '<div class="carsGrid">' 
  if(data.length > 0){
    
    data.forEach(vehicle => { 
      grid += '<div class="carsInfo">' 


      grid += '<a href="/inv/detail/' + vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img class="classificationThumbnail" src="' + vehicle.inv_thumbnail +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2 class="des">'
      grid += '<a class="des" href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
      grid += vehicle.inv_make + ' ' + vehicle.inv_model
      grid += '</h2>'
      grid += '<h4 class="des">' + '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>' + '</h4>'
      grid += '</a>'
      
      // grid += vehicle.inv_description + '</span>'
      grid += '</div>'

      grid += '</div>'
      
    })
    grid += '</div>'
  
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}
//  WEEK 03
Util.details = async function (data) {
  let grid

  grid += '<div class="vehDetail">'

  if (data.length > 0) {
    data.forEach(vehicle => {
      grid += '<div class="carDetails">'
      grid += '<h1 class="make">' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h1>'
      grid += '<div class="detailsGrid">'

      grid += '<div class"infoArea">'
      grid += '<img class="vehImg" src="' + vehicle.inv_image + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors" />'
      grid += '</div>'
      
      grid += '<div class="vehDes">'

      grid += '<div>'
      grid += '<h2>' + 'Make: ' + vehicle.inv_make + '</h2>'
      grid += '<h2>' + 'Model: ' + vehicle.inv_model + '</h2>'
      grid += '<h2>' + 'Year: ' + vehicle.inv_year + '</h2>'
      grid += '<h2>' + 'Mileage: ' + vehicle.inv_miles + '</h2>'
      grid += '<h2>' + 'Price: ' + '<span>$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>' + '</h2>'
      grid += '</div>'

      grid += '<div>'
      grid += '<h2>' + "Description: " + '</h2>' + '<h3>' + '<p class="carDescription">' + vehicle.inv_description + '</p>' + '</h3>'
      grid += '</div>'

      grid += '</div>'

      grid += '</div>'

      grid += '</div>'
    })

    grid += '</div>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
};

// WEEK 04
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)



module.exports = Util