import React, { useState, useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import { postProduct } from "../../../api/postProduct";
import { MainForm, Input } from "./styles";

const AdminPage = () => {
  const { token } = useContext(UserContext);

  const [product, setProduct] = useState({
    product_name: "",
    product_category: "",
    product_base_price: "",
    direct_image_src: "",
    product_link: "",
    flavor_text: "",
    website: "",
    product_card_banner: "",
    lab_results: "",
    gender: "",
    who_ind: "",
    age_min: "",
    age_max: "",
    occasion: "",
    hobbies_interests: [],
    tags: [],
    is_added_directly: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "hobbies_interests" || name === "tags") {
      const splitValue = value.split(",");
      setProduct({
        ...product,
        [name]: splitValue,
      });
    } else {
      setProduct({
        ...product,
        [name]: value,
      });
    }
  };

  return (
    <>
      <MainForm>
        <label>
          Product Name:
          <Input
            type="text"
            name="product_name"
            value={product.product_name}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Product Category:
          <Input
            type="text"
            name="product_category"
            value={product.product_category}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Product Price:
          <Input
            type="text"
            name="product_price"
            value={product.product_price}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Product Image URL:
          <Input
            type="text"
            name="product_image"
            value={product.product_image}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Product Link URL:
          <Input
            type="text"
            name="product_link"
            value={product.product_link}
            onChange={handleInputChange}
          />
        </label>

        <label>
          Flavor Text:
          <textarea
            type="text"
            name="flavor_text"
            value={product.flavor_text}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Website:
          <Input
            type="text"
            name="website"
            value={product.website}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Product Card Banner:
          <Input
            type="text"
            name="product_card_banner"
            value={product.product_card_banner}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Lab Results:
          <textarea
            type="text"
            name="lab_results"
            value={product.lab_results}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Gender:
          <input
            type="text"
            name="gender"
            value={product.gender}
            onChange={handleInputChange}
          ></input>
        </label>
        <label>
          Who is it for?:
          <input
            placeholder="Coworker or Blank"
            type="text"
            name="who_ind"
            value={product.who_ind}
            onChange={handleInputChange}
          ></input>
        </label>
        <label>
          Age Min:
          <input
            type="text"
            name="age_min"
            value={product.age_min}
            onChange={handleInputChange}
          ></input>
        </label>
        <label>
          Age Max:
          <input
            type="text"
            name="age_max"
            value={product.age_max}
            onChange={handleInputChange}
          ></input>
        </label>
        <label>
          Occasion:
          <input
            type="text"
            name="occasion"
            value={product.occasion}
            onChange={handleInputChange}
          ></input>
        </label>

        <label>
          Hobbies:
          <Input
            placeholder="Separate by comma"
            type="text"
            name="hobbies_interests"
            value={product.hobbies_interests}
            onChange={handleInputChange}
          ></Input>
        </label>
        <label>
          Tags:
          <Input
            placeholder="Separate by comma"
            type="text"
            name="tags"
            value={product.tags}
            onChange={handleInputChange}
          ></Input>
        </label>
      </MainForm>

      <button
        onClick={(e) => {
          e.preventDefault();
          postProduct(product, token);
        }}
      >
        Submit
      </button>
    </>
  );
};

export default AdminPage;
