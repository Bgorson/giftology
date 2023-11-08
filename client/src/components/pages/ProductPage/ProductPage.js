import React, { useEffect, useState } from "react";
import ReactGA from "react-ga4";

import { useParams, useLocation } from "react-router-dom";
import { getProducts } from "../../../api/getSingleProduct";
import { addFavorites } from "../../../api/addFavorites.js";
import { UserContext } from "../../../context/UserContext";
import {
  Image,
  TextContainer,
  ProductTitle,
  ProductDescriptionHeading,
  ProductDescription,
  ProductPrice,
  ProductTags,
  FancyButton,
  ProductContainer,
  Tag,
  ButtonContainer,
} from "./styles";
export default function ProductPage() {
  let { id } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const quizId = queryParams.get("quizId");
  const { token } = React.useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const handleClickOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  const [product, setProduct] = useState();
  const [tags, setTags] = useState();
  const [error, setError] = useState(false);
  const [parsedLabText, setParsedLabText] = useState(null);

  const linkCreator = (link) => {
    let urlMatches = link.match(/[ID=](?=[ID=]).*?(?=\s)/gm);
    if (urlMatches) {
      urlMatches = urlMatches.map((match) => {
        return match.replace(/ID=/g, "");
      });
    }
    const textMatches = link.match(/text=(.*)~~/gm);
    return { url: urlMatches, text: textMatches };
  };

  // Creates A tags for insertion

  const createATags = (matches) => {
    let aTags = [];
    matches.url.forEach((url, index) => {
      let cleanUrl = url.replace(/['‘’"“”]/g, "");
      let cleanText = matches.text[index].replace(/['‘’"“”]/g, "");
      let newText1 = cleanText.replace(/text=/g, "");
      let newText = newText1.replace(/\~~/g, "");

      aTags.push(
        `<a  target="_blank" href=.././product/${cleanUrl}> ${newText}</a>`
      );
    });
    return aTags;
  };
  const insertATags = (text, aTags) => {
    let newText = text;
    aTags.forEach((tag) => {
      newText = newText.replace(/~~.*~~/, tag);
    });
    return newText;
  };

  useEffect(() => {
    getProducts({ id }).then((data) => {
      const { product } = data;
      if (product) {
        setProduct(product);

        let tags = product.tags_display
        tags.forEach((tag, index) => {
          if (tag === null || tag === "null" || tag === "Null") {
            tags = tags.splice(index, 1);
            if (tags.length === 1) {
              tags = [];
            }
          } else if (tag === "healthNut") {
            tags[index] = " Health Nut";
          } else if (tag === "mustOwn") {
            tags[index] = " Must Own";
          } else if (tag === "MustOwn") {
            tags[index] = " Must Own";
          } else if (tag === "WhiteElephant") {
            tags[index] = " White Elephant";
          } else if (tag === "whiteElephant") {
            tags[index] = " White Elephant";
          } else if (tag === "bathAndBody") {
            tags[index] = " Bath And Body";
          } else if (tag === "justForFun") {
            tags[index] = " Just For Fun";
          } else if (tag === "artsAndCrafts") {
            tags[index] = " Arts And Crafts";
          } else if (tag === "samplerkits") {
            tags[index] = " Sampler Kits";
          } else {
            tags[index] = " " + tag.charAt(0).toUpperCase() + tag.slice(1);
          }
        });
        setTags(tags);
        if (product?.lab_results) {
          // If there are links- parse them
          let parse = linkCreator(product.lab_results);
          if (parse.url) {
            let parsedMatches = linkCreator(product.lab_results);
            let aTagCreation = createATags(parsedMatches);
            setParsedLabText(insertATags(product.lab_results, aTagCreation));
          } else {
            setParsedLabText(product.lab_results);
          }
        }
      } else {
        setError(true);
        return;
      }
    });
  }, []);
  return product ? (
    <ProductContainer>
      {isOpen && (
        <LoginModal
          open={isOpen}
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
        />
      )}
      <Image src={product.direct_image_src} />

      <TextContainer>
        <ProductTitle>{product.product_name}</ProductTitle>
        <ProductDescriptionHeading>
          Who do we like this for?
        </ProductDescriptionHeading>
        <ProductDescription>{product.flavor_text}</ProductDescription>
        {product.lab_results ? (
          <div dangerouslySetInnerHTML={{ __html: parsedLabText }} />
        ) : null}
        <ProductTags>
          {tags &&
            tags.map((tag, index) => {
              return <Tag key={index}>{tag}</Tag>;
            })}
        </ProductTags>
        <ButtonContainer>
          <a href={product.link} target="_blank">
            <FancyButton
              isPurchase={true}
              onClick={() =>
                ReactGA.event({
                  category: "Retailer Visited",
                  action: product.product_name,
                  label: "Home",
                  value: product.product_name,
                })
              }
            >
              Visit Retailer
            </FancyButton>
          </a>
          {quizId && (
            <FancyButton
              onClick={() =>
                token ? addFavorites(product, quizId, token) : setIsOpen(true)
              }
            >
              Add to Wishlist
            </FancyButton>
          )}
          <ProductPrice>${product.product_base_price}</ProductPrice>
        </ButtonContainer>
      </TextContainer>
    </ProductContainer>
  ) : error ? (
    <p>Product Not Found</p>
  ) : (
    <p>Loading</p>
  );
}
