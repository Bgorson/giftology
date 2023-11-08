import { useState, useEffect, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import LoginModal from "../LoginModal";
import CloseIcon from "../../../close.svg";
import DialogContent from "@mui/material/DialogContent";
import { addFavorites } from "../../../api/addFavorites.js";
import { UserContext } from "../../../context/UserContext";

import {
  TextContainer,
  ProductTitle,
  ProductDescription,
  ProductPrice,
  ProductTags,
  ProductImage,
  Image,
  DesktopWrapper,
  MobileWrapper,
  ProductDescriptionHeading,
  FancyButton,
  ModalClose,
  ModalHeading,
  ButtonContainer,
  Tag,
} from "./styles";
import ReactGA from "react-ga4";

export default function ScrollDialog(props) {
  const { product, handleClose, quizId } = props;
  const { token } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const handleClickOpen = () => {
    setIsOpen(true);
  };
  const handleModalClose = () => {
    setIsOpen(false);
  };
  const [parsedLabText, setParsedLabText] = useState(null);
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

  //Creates the availle Links

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
    let newText = text;
    aTags.forEach((tag) => {
      newText = newText.replace(/~~.*~~/, tag);
    });
    return newText;
  };

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

  let parsedImage =
    product.html_tag.split("src")[1]?.substring(2)?.slice(0, -12) || "";
  if (!parsedImage.includes("//ws-na.amazon")) {
    parsedImage =
      product.html_tag.split("src")[2]?.substring(2)?.slice(0, -12) || "";
  }
  if (!parsedImage.includes("//ws-na.amazon")) {
    parsedImage =
      product.html_tag.split("src")[3]?.substring(2)?.slice(0, -12) || "";
  }
  return (
    product && (
      <Dialog
        disableScrollLock={true}
        maxWidth={"60%"}
        open={true}
        onClose={handleClose}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        {isOpen && (
          <LoginModal
            open={isOpen}
            handleClickOpen={handleClickOpen}
            handleClose={handleModalClose}
          />
        )}
        <ModalClose onClick={() => handleClose()} src={CloseIcon} />

        {/* <DialogTitle id="scroll-dialog-title">{product.productName}</DialogTitle> */}
        <MobileWrapper>
          <DialogContent>
            {product.direct_image_src !== "" ? (
              <Image src={product.direct_image_src} />
            ) : (
              <ProductImage
                dangerouslySetInnerHTML={{
                  __html: product.html_tag,
                }}
              />
            )}

            <TextContainer>
              <ModalHeading>
                <ProductTitle>{product.product_name}</ProductTitle>
                {/* <ModalClose onClick={() => handleClose()} src={CloseIcon} /> */}
              </ModalHeading>
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
                <a href={product.link} target="_blank" rel="noreferrer">
                  <FancyButton
                    isPurchase={true}
                    onClick={() =>
                      ReactGA.event({
                        category: "Retailer Visited",
                        action: product.product_name,
                        label: "Home",
                        value: product?.product_name,
                      })
                    }
                  >
                    Visit Retailer
                  </FancyButton>
                </a>
                <FancyButton
                  onClick={() =>
                    token
                      ? addFavorites(product, quizId, token)
                      : setIsOpen(true)
                  }
                >
                  Add to Wishlist
                </FancyButton>
                <ProductPrice>${product.product_base_price}</ProductPrice>
              </ButtonContainer>
            </TextContainer>
          </DialogContent>
        </MobileWrapper>

        <DesktopWrapper>
          <DialogContent style={{ display: "flex" }}>
            {product.direct_image_src !== "" ? (
              <Image src={product.direct_image_src} />
            ) : (
              <ProductImage
                dangerouslySetInnerHTML={{
                  __html: product.html_tag,
                }}
              />
            )}

            <TextContainer>
              <ModalHeading>
                <ProductTitle>{product.product_name}</ProductTitle>
              </ModalHeading>
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
                <a href={product.link} target="_blank" rel="noreferrer">
                  <FancyButton
                    isPurchase={true}
                    onClick={() =>
                      ReactGA.event({
                        category: "Retailer Visited",
                        action: product.product_name,
                        label: "Home",
                        value: product?.product_name,
                      })
                    }
                  >
                    Visit Retailer
                  </FancyButton>
                </a>
                <FancyButton
                  onClick={() =>
                    token
                      ? addFavorites(product, quizId, token)
                      : setIsOpen(true)
                  }
                >
                  Add to Wishlist
                </FancyButton>
                <ProductPrice>${product.product_base_price}</ProductPrice>
              </ButtonContainer>
            </TextContainer>
          </DialogContent>
        </DesktopWrapper>
      </Dialog>
    )
  );
}
