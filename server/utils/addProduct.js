const pool = require("../dataBaseSQL/db");

const addProduct = async ({ product, userAdded }) => {
  const client = await pool.connect();
  // Check if product exists
  try {
    const checkProductQuery = "SELECT * FROM products WHERE product_name = $1";
    const checkProductResult = await client.query(checkProductQuery, [
      product.product_name,
    ]);
    if (checkProductResult.rows.length === 0) {
      const insertProductQuery = `
    INSERT INTO products (
      product_name, 
      website,
      html_tag,
      link,
      flavor_text, 
      lab_results, 
      product_base_price,
      product_card_banner,
      direct_image_src,
      gender, 
      who_ind,
      age_min,
      age_max,
      is_added_directly,
      is_ai_generated
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
    )
    RETURNING product_id
  `;

      const insertProduct = await client.query(insertProductQuery, [
        product.product_name,
        product.website,
        product.html_tag,
        product.link,
        product.flavor_text,
        product.lab_results,
        product.product_base_price,
        product.product_card_banner,
        product.direct_image_src,
        product.gender,
        product.who_ind,
        product.age_min,
        product.age_max,
        userAdded ? true : false,
        userAdded ? false : true,
      ]);
      const categoryInsert =
        "INSERT INTO categories (product_id, category_id) VALUES ($1, $2)";
      const giftTypeInsert =
        "INSERT INTO gift_type (product_id, gift_type_id) VALUES ($1, $2)";
      const hobbiesInsert =
        "INSERT INTO hobbies_interests (product_id, hobbies_interests_id) VALUES ($1, $2)";
      const tagsInsert =
        "INSERT INTO tags (product_id, tag_id) VALUES ($1, $2)";

      await client.query(categoryInsert, [
        insertProduct.rows[0].product_id,
        product.category_id,
      ]);
      product.gift_type_id.forEach(async (giftType) => {
        await client.query(giftTypeInsert, [
          insertProduct.rows[0].product_id,
          giftType,
        ]);
      });
      product.hobbies_id.forEach(async (hobbies) => {
        await client.query(hobbiesInsert, [
          insertProduct.rows[0].product_id,
          hobbies,
        ]);
      });

      product.tags_id.forEach(async (tags) => {
        await client.query(tagsInsert, [
          insertProduct.rows[0].product_id,
          tags,
        ]);
      });

      return insertProduct.rows[0].product_id;
    } else {
      return checkProductResult.rows[0].product_id;
    }
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
};

module.exports = addProduct;
