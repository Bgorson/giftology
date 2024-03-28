import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../context/UserContext";
import { postProduct } from "../../../api/postProduct";
import { MainForm, Input } from "./styles";
import Papa from "papaparse";

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
  const [uploadedData, setUploadedData] = useState({});

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
  useEffect(() => {
    if (uploadedData) {
      setProduct({
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
    }
  }, [uploadedData]);

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
            name="product_base_price"
            value={product.product_base_price}
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

      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={(e) => {
          const files = e.target.files;
          console.log(files);
          if (files) {
            console.log(files[0]);
            Papa.parse(files[0], {
              complete: function (results) {
                let headers = results.data[0];
                headers = headers.map((header) => {
                  if (header === "productId") {
                    return "product_id";
                  } else if (header === "category") {
                    return "product_category";
                  } else if (header === "productBasePrice") {
                    return "product_base_price";
                  } else if (header === "directImageSrc") {
                    return "direct_image_src";
                  } else if (header === "link") {
                    return "link";
                  } else if (header === "flavorText") {
                    return "flavor_text";
                  } else if (header === "website") {
                    return "website";
                  } else if (header === "productCardBanner") {
                    return "product_card_banner";
                  } else if (header === "labResults") {
                    return "lab_results";
                  } else if (header === "productName") {
                    return "product_name";
                  } else if (header === "ageMin") {
                    return "age_min";
                  } else if (header === "ageMax") {
                    return "age_max";
                  } else if (header === "whoIsItFor") {
                    return "who_ind";
                  } else if (header === "hobbiesInterests") {
                    return "hobbies_interests";
                  } else if (header === "htmlTag") {
                    return "html_tag";
                  } else if (header === "giftType") {
                    return "gift_type";
                  } else if (header === "listingId") {
                    return "listing_id";
                  } else if (header === "Review Link") {
                    return "review_link";
                  } else if (header === "Website") {
                    return "website";
                  } else if (header === "Discount Codes") {
                    return "discount_code";
                  } else {
                    return header;
                  }
                });
                console.log(headers);
                console.log(results.data);
                const formattedProducts = [];
                for (let i = 1; i < results.data.length; i++) {
                  let product = {};
                  for (let j = 0; j < headers.length; j++) {
                    product[headers[j]] = results.data[i][j];
                  }
                  formattedProducts.push(product);
                }
                console.log("final", formattedProducts);
                setUploadedData(formattedProducts);
              },
            });
          }
        }}
      />

      <button
        onClick={(e) => {
          e.preventDefault();
          if (uploadedData.length > 0) {
            postProduct(uploadedData, token);
          } else {
            postProduct(product, token);
          }
        }}
      >
        Submit
      </button>
    </>
  );
};

export default AdminPage;
