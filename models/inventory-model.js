
const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

async function getVehicleById(inv_id) {
    try {
        const info = await pool.query(
            `SELECT * FROM public.inventory
              WHERE inv_id = $1`,
            [inv_id]
        )
        return info.rows
    } catch(error) {
        console.error("Big Error" + error)
    }
};


async function addClassification(classification_name) {
    try {
        const info = "INSERT INTO public.classification(classification_name) VALUES($1) RETURNING *"
            return await pool.query(info, [classification_name])
        
    } catch (error) {

        console.log("Error in The Database.", error);
    }
};

async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
    try {
        const info = "INSERT INTO public.inventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
        return await pool.query(info, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
    } catch (error) {
        console.log("Error in The Database", error);
    }
};
async function addDreamInventory(dreamcar_make, dreamcar_model, dreamcar_year, dreamcar_description, dreamcar_image, dreamcar_thumbnail, dreamcar_price, dreamcar_miles, dreamcar_color) {
      try {
        const info = "INSERT INTO public.dreamcar(dreamcar_make, dreamcar_model, dreamcar_year, dreamcar_description, dreamcar_image, dreamcar_thumbnail, dreamcar_price, dreamcar_miles, dreamcar_color) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *"
        return await pool.query(info, [dreamcar_make, dreamcar_model, dreamcar_year, dreamcar_description, dreamcar_image, dreamcar_thumbnail, dreamcar_price, dreamcar_miles, dreamcar_color])
    } catch (error) {
        console.log("Error in The Database while addding Dream Car.", error);
    }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}; 

async function deleteInventory(inv_id) {
    try {
        const sqlQuery = 'DELETE FROM public.inventory WHERE inv_id = $1'
        const info = await pool.query(sqlQuery, [inv_id]);
        return info;
    } catch (error) {
        console.log("Unable to Delete.Thank you.", error);
    }
}

async function getDreamVehicleById(dreamcar_id) {
    try {
        const info = await pool.query(
            `SELECT * FROM public.dreamcar
              WHERE dreamcar_id = $1`,
            [dreamcar_id]
        )
        return info.rows
    } catch(error) {
        console.error("Big Error in Getting Dream Car." + error)
    }
};

async function getDreamCar() {
    try {
        const sql = 'SELECT * FROM public.dreamcar'
        const result = await pool.query(sql)
        return result.rows;
    } catch (error) {
        console.log("Cannot get all Dream Cars.", error)
    }
};


module.exports = { getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventory, updateInventory, deleteInventory, getDreamVehicleById, getDreamCar, addDreamInventory };