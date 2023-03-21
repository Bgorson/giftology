import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
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
import ReactGA from "react-ga";

export default function ScrollDialog(props) {
  const { product, handleClose, quizId } = props;
  const [scroll, setScroll] = React.useState("paper");
  const { token } = React.useContext(UserContext);

  const [parsedLabText, setParsedLabText] = React.useState(null);
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

  React.useEffect(() => {
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
  return (
    product && (
      <Dialog
        disableScrollLock={true}
        maxWidth={"60%"}
        open={true}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <ModalClose onClick={() => handleClose()} src={CloseIcon} />

        {/* <DialogTitle id="scroll-dialog-title">{product.productName}</DialogTitle> */}
        <MobileWrapper>
          <DialogContent>
            {product.directImageSrc !== "" ? (
              <Image src={product.directImageSrc} />
            ) : (
              <ProductImage
                dangerouslySetInnerHTML={{
                  __html: product.htmlTag,
                }}
              />
            )}

            <TextContainer>
              <ModalHeading>
                <ProductTitle>{product.productName}</ProductTitle>
                {/* <ModalClose onClick={() => handleClose()} src={CloseIcon} /> */}
              </ModalHeading>
              <ProductDescriptionHeading>
                Who do we like this for?
              </ProductDescriptionHeading>
              <ProductDescription>{product.flavorText}</ProductDescription>
              {product.labResults ? (
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
                        action: product.productName,
                        label: "Home",
                      })
                    }
                  >
                    Visit Retailer
                  </FancyButton>
                </a>
                <FancyButton
                  disabled={!token}
                  onClick={() => addFavorites(product, quizId, token)}
                >
                  Add to Wishlist
                </FancyButton>
                <ProductPrice>${product.productBasePrice}</ProductPrice>
              </ButtonContainer>
            </TextContainer>
          </DialogContent>
        </MobileWrapper>

        <DesktopWrapper>
          <DialogContent style={{ display: "flex" }}>
            {product.directImageSrc !== "" ? (
              <Image src={product.directImageSrc} />
            ) : (
              <ProductImage
                dangerouslySetInnerHTML={{
                  __html: product.htmlTag,
                }}
              />
            )}

            <TextContainer>
              <ModalHeading>
                <ProductTitle>{product.productName}</ProductTitle>
              </ModalHeading>
              <ProductDescriptionHeading>
                Who do we like this for?
              </ProductDescriptionHeading>
              <ProductDescription>{product.flavorText}</ProductDescription>
              {product.labResults ? (
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
                        action: product.productName,
                        label: "Home",
                      })
                    }
                  >
                    Visit Retailer
                  </FancyButton>
                </a>
                <FancyButton
                  disabled={!token}
                  onClick={() => addFavorites(product, quizId, token)}
                >
                  Add to Wishlist
                </FancyButton>
                <ProductPrice>${product.productBasePrice}</ProductPrice>
              </ButtonContainer>
            </TextContainer>
          </DialogContent>
        </DesktopWrapper>
      </Dialog>
    )
  );
}
