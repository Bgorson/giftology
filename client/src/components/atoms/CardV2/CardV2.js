import { useState, useContext, useEffect } from "react";
import ReactCardFlip from "react-card-flip";
import ReactGA from "react-ga";
import Typography from "@mui/material/Typography";
import LoginModal from "../../molecules/LoginModal";
import {
  CardContainer,
  FlavorText,
  CardContentContainer,
  ImageWrapper,
  SubTextContainer,
  FavoriteContainer,
  Image,
  ProductTags,
  ProductDescription,
  ProductDescriptionHeading,
  ButtonContainer,
  FancyButton,
  ProductPrice,
  CardBackContainer,
  CardBackContentContainer,
  Tag,
  BadgeContainer,
  TopButtonContainer,
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
  const extractLinks = (str) => {
    const regex = /~~ID=“(\d+)” text=“(.*?)”~~/g;
    let match = regex.exec(str);
    let links = [];

    while (match !== null) {
      let [_, url, linkText] = match;
      links.push({ url: url, linkText: linkText });
      match = regex.exec(str);
    }

    return links;
  };

  const createATags = (str, quizId) => {
    const links = extractLinks(str);
    const quizParam = quizId ? `?quizId=${quizId}` : "";
    const aTags = links.map((link) => {
      return `<a href=".././product/${link.url}${quizParam}" target="_blank">${link.linkText}</a>`;
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
  const { token } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [parsedLabText, setParsedLabText] = useState(null);
  useEffect(() => {
    if (product?.labResults) {
      // If there are links- parse them
      let parse = extractLinks(product.labResults);
      if (parse.length > 0) {
        let aTagCreation = createATags(product.labResults, quizId);
        setParsedLabText(insertATags(product.labResults, aTagCreation));
      } else {
        setParsedLabText(product.labResults);
      }
    }
  }, []);
  const handleClickOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  const handleClick = (e) => {
    // e.preventDefault();
    setIsFlipped(!isFlipped);
  };
  const handleAddToFavorites = (product, quizId) => {
    if (isFavorite || filled) {
      removeFavorites(product, quizId, token);
      setFilled(false);
    } else {
      addFavorites(product, quizId, token);
      setFilled(true);
    }
  };
  const [filled, setFilled] = useState(isFavorite);
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
        {isOpen && (
          <LoginModal
            open={isOpen}
            handleClickOpen={handleClickOpen}
            handleClose={handleClose}
          />
        )}
        <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
          <CardContainer
            data-id={product.score}
            onClick={(e) => handleClick(e)}
            // onClick={() => handleCardClick(product, isHighlighted)}
          >
            {
              <FavoriteContainer
                onClick={(e) => {
                  e.stopPropagation();
                  if (token) {
                    handleAddToFavorites(product, quizId);
                  } else {
                    setIsOpen(true);
                  }
                }}
              >
                <AddToFavorites filled={filled} />
              </FavoriteContainer>
            }
            <ImageWrapper>
              <Image alt={product.productName} src={finalImage} />
            </ImageWrapper>

            <CardContentContainer>
              <Typography
                style={{ margin: 0 }}
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
                {/* <FlavorText>Click To Learn More</FlavorText> */}
                {showScore && <FlavorText>SCORE:{product.score}</FlavorText>}
                {/* <FlavorText variant="body2" color="text.secondary">
                {`Tags: ${tags}`}
              </FlavorText> */}
              </SubTextContainer>

              {/* <Typography variant="body2" color="text.secondary">
            {product.score}
          </Typography> */}
              {product?.product_card_banner && (
                <BadgeContainer>
                  <Badge text={product.product_card_banner} />
                </BadgeContainer>
              )}
            </CardContentContainer>
            <ButtonContainer>
              <TopButtonContainer>
                <FancyButton
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    if (token) {
                      handleAddToFavorites(product, quizId);
                    } else {
                      setIsOpen(true);
                    }
                  }}
                  // onClick={(e) =>
                  //   e.stopPropagation() && token
                  //     ? addFavorites(product, quizId, token)
                  //     : setIsOpen(true)
                  // }
                >
                  {!filled ? `Add to Favorites` : `Remove Favorite`}
                </FancyButton>
                <a href={product.link} target="_blank">
                  <FancyButton
                    isPurchase={true}
                    onClick={() =>
                      ReactGA.event({
                        category: "Retailer Visited",
                        action: product.productName,
                        label: "Home",
                      })
                    }
                  >
                    Visit Retailer
                  </FancyButton>
                </a>
              </TopButtonContainer>

              <FancyButton>Info</FancyButton>

              {/* <ProductPrice>${product.productBasePrice}</ProductPrice> */}
            </ButtonContainer>
          </CardContainer>
          <CardBackContainer onClick={(e) => handleClick(e)}>
            <CardBackContentContainer onClick={(e) => handleClick(e)}>
              <ProductDescriptionHeading>
                Who do we like this for?
              </ProductDescriptionHeading>
              <ProductDescription>{product.flavorText}</ProductDescription>
              {product.labResults ? (
                <>
                  <ProductDescriptionHeading>
                    Lab Results
                  </ProductDescriptionHeading>
                  <div
                    style={{ fontSize: "16px" }}
                    dangerouslySetInnerHTML={{
                      __html: parsedLabText
                        ? parsedLabText.replace("Lab Results: ", "")
                        : "",
                    }}
                  />
                </>
              ) : null}
              <ProductDescriptionHeading>Tags</ProductDescriptionHeading>
              {tags && <Tag>{tags.join(",")}</Tag>}
              <ButtonContainer>
                <FancyButton>Back</FancyButton>
              </ButtonContainer>
            </CardBackContentContainer>
          </CardBackContainer>
        </ReactCardFlip>
      </div>
    )
  );
}
