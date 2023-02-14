import * as React from "react";
import Typography from "@mui/material/Typography";
import {
  CardContainer,
  FlavorText,
  CardContentContainer,
  ImageWrapper,
  SubTextContainer,
  FavoriteContainer,
  Image,
} from "./styled";
import { UserContext } from "../../../context/UserContext";
import placeHolder from "../../../placeholder.jpeg";
import { AddToFavorites } from "../../atoms/AddToFavorites/AddToFavorites";
import { addFavorites } from "../../../api/addFavorites.js";
import { removeFavorites } from "../../../api/removeFavorites.js";

import Badge from "./Badge";
export default function ProductCard({
  product,
  showScore,
  handleCardClick,
  isHighlighted,
  isFavorite,
  quizId,
}) {
  const { token } = React.useContext(UserContext);
  const handleAddToFavorites = (product, quizId) => {
    if (isFavorite || filled) {
      removeFavorites(product, quizId, token);
      setFilled(false);
    } else {
      addFavorites(product, quizId, token);
      setFilled(true);
    }
  };
  const [filled, setFilled] = React.useState(isFavorite);
  let tags = [...product.tags_display];
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
  let parsedImage =
    product.htmlTag.split("src")[1]?.substring(2)?.slice(0, -12) || "";
  if (!parsedImage.includes("//ws-na.amazon")) {
    parsedImage =
      product.htmlTag.split("src")[2]?.substring(2)?.slice(0, -12) || "";
  }
  if (!parsedImage.includes("//ws-na.amazon")) {
    parsedImage =
      product.htmlTag.split("src")[3]?.substring(2)?.slice(0, -12) || "";
  }
  let finalImage =
    product.website === "Etsy" || product.directImageSrc !== ""
      ? product.directImageSrc
      : parsedImage;

  if (!finalImage) {
    finalImage = placeHolder;
  }
  return (
    product && (
      <div>
        <CardContainer
          data-id={product.score}
          onClick={() => handleCardClick(product, isHighlighted)}
        >
          {token && (
            <FavoriteContainer
              onClick={(e) => {
                e.stopPropagation(), handleAddToFavorites(product, quizId);
              }}
            >
              <AddToFavorites filled={filled} />
            </FavoriteContainer>
          )}
          <ImageWrapper>
            <Image alt={product.productName} src={finalImage} />
          </ImageWrapper>

          <CardContentContainer>
            <Typography
              style={{ textAlign: "left" }}
              gutterBottom
              variant="h6"
              component="div"
            >
              {product.productName}
            </Typography>
            <SubTextContainer>
              <FlavorText variant="body2" color="text.secondary">
                ${product.productBasePrice}
              </FlavorText>
              {showScore && <FlavorText>SCORE:{product.score}</FlavorText>}
              {/* <FlavorText variant="body2" color="text.secondary">
                {`Tags: ${tags}`}
              </FlavorText> */}
            </SubTextContainer>

            {/* <Typography variant="body2" color="text.secondary">
            {product.score}
          </Typography> */}
            {product?.product_card_banner && (
              <Badge text={product.product_card_banner} />
            )}
          </CardContentContainer>
        </CardContainer>
      </div>
    )
  );
}
