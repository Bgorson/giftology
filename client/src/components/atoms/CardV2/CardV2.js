import { useState, useContext, useEffect } from "react";
import ReactCardFlip from "react-card-flip";
import ReactGA from "react-ga4";
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
  ProductDescription,
  ProductDescriptionHeading,
  ButtonContainer,
  FancyButton,
  CardBackContainer,
  CardBackContentContainer,
  Tag,
  BadgeContainer,
  TopButtonContainer,
  Card,
} from "./styled";
import { UserContext } from "../../../context/UserContext";
import placeHolder from "../../../placeholder.jpeg";
import { AddToFavorites } from "../../atoms/AddToFavorites/AddToFavorites";
import { addFavorites } from "../../../api/addFavorites.js";
import { removeFavorites } from "../../../api/removeFavorites.js";

import Badge from "./Badge";
import { postUserBehavior } from "../../../api/postUserBehavior";
export default function ProductCard({
  product,
  showScore,
  isAI,
  isFavorite,
  quizId,
}) {
  const extractLinks = (str) => {
    const regex = /~~ID=“(\d+)” text=“(.*?)”~~/g;
    let match = regex.exec(str);
    let links = [];

    while (match !== null) {
      // eslint-disable-next-line no-unused-vars
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
    if (isAI) return text;
    let newText = text;
    aTags.forEach((tag) => {
      newText = newText.replace(/~~.*~~/, tag);
    });
    return newText;
  };
  const { token, email } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [parsedLabText, setParsedLabText] = useState(null);
  useEffect(() => {
    if (product?.lab_results) {
      // If there are links- parse them
      let parse = extractLinks(product.lab_results);
      if (parse.length > 0) {
        let aTagCreation = createATags(product.lab_results, quizId);
        setParsedLabText(insertATags(product.lab_results, aTagCreation));
      } else {
        setParsedLabText(product.lab_results);
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
    if (
      e.target.textContent !== "Visit Retailer" &&
      e.target.textContent !== "Add to Favorites"
    ) {
      postUserBehavior(product.product_id, quizId, email, token, {
        clicked_info: true,
      });
      ReactGA.event({
        category: "Card Flip",
        action: isFlipped ? "Flipped Card to A side" : "Flipped Card to B Side",
        label: product?.product_name,
        value: product?.product_name,
      });
      setIsFlipped(!isFlipped);
    }
  };
  const handleAddToFavorites = (product, quizId) => {
    if (isFavorite || filled) {
      ReactGA.event({
        category: "Favorites",
        action: "Removed from Favorites",
        label: product?.product_name,
        value: product?.product_name,
      });
      removeFavorites(product, quizId, token);
      setFilled(false);
    } else {
      postUserBehavior(product.product_id, quizId, email, token, {
        clicked_favorite: true,
      });
      ReactGA.event({
        category: "Favorites",
        action: "Add to Favorites",
        label: product?.product_name,
        value: product?.product_name,
      });
      addFavorites(product, quizId, token);
      setFilled(true);
    }
  };
  const [filled, setFilled] = useState(isFavorite);
  useEffect(() => {
    setFilled(isFavorite);
  }, [isFavorite]);
  let tags = product.tags;
  if (tags) {
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
  }
  let parsedImage = product?.html_tag
    ? product?.html_tag.split("src")[1]?.substring(2)?.slice(0, -12) || ""
    : "";
  if (!parsedImage.includes("//ws-na.amazon")) {
    parsedImage = product?.html_tag
      ? product?.html_tag.split("src")[2]?.substring(2)?.slice(0, -12) || ""
      : "";
  }
  if (!parsedImage.includes("//ws-na.amazon")) {
    parsedImage = product?.html_tag
      ? product.html_tag.split("src")[3]?.substring(2)?.slice(0, -12) || ""
      : "";
  }
  let finalImage =
    product.website === "Etsy" || product.direct_image_src !== ""
      ? product.direct_image_src
      : parsedImage;
  if (!finalImage && isAI) {
    finalImage = product.directImageSrc;
  }
  if (!finalImage) {
    finalImage = product?.directImageSrc || placeHolder;
  }
  return (
    product && (
      <Card>
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
            onMouseDown={(e) => handleClick(e)}
            // onClick={() => handleCardClick(product, isHighlighted)}
          >
            {product.product_id && (
              <FavoriteContainer
                onMouseDown={(e) => {
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
            )}
            <ImageWrapper>
              <Image alt={product.product_name} src={finalImage} />
            </ImageWrapper>

            <CardContentContainer>
              <Typography
                style={{ margin: 0 }}
                gutterBottom
                variant="h6"
                component="div"
              >
                {product.product_name || product.productName}
              </Typography>
              <SubTextContainer>
                <FlavorText variant="body2" color="text.secondary">
                  ${product.product_base_price || product.price}
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
                  <Badge
                    text={isAI ? "AI Generated" : product.product_card_banner}
                  />
                </BadgeContainer>
              )}
            </CardContentContainer>
            <ButtonContainer>
              <TopButtonContainer>
                {product.product_id && (
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
                )}
                <a href={product.link} target="_blank" rel="noreferrer">
                  <FancyButton
                    isPurchase={true}
                    onMouseDown={() => {
                      ReactGA.event({
                        category: "Retailer Visited",
                        action: product.product_name,
                        label: "Home",
                      });
                      postUserBehavior(
                        product.product_id,
                        quizId,
                        email,
                        token,
                        { clicked_retailer: true }
                      );
                    }}
                  >
                    Visit Retailer
                  </FancyButton>
                </a>
              </TopButtonContainer>

              <FancyButton>Info</FancyButton>

              {/* <ProductPrice>${product.productBasePrice}</ProductPrice> */}
            </ButtonContainer>
          </CardContainer>
          <CardBackContainer onMouseDown={(e) => handleClick(e)}>
            <CardBackContentContainer onMouseDown={(e) => handleClick(e)}>
              {!isAI ? (
                <>
                  <ProductDescriptionHeading>
                    Who do we like this for?
                  </ProductDescriptionHeading>
                  <ProductDescription>{product.flavor_text}</ProductDescription>
                  {product.lab_results ? (
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
                </>
              ) : null}
            </CardBackContentContainer>
          </CardBackContainer>
        </ReactCardFlip>
      </Card>
    )
  );
}
