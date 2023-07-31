import { useState, useContext, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Robot from "../../../../src/robot.png";
import ReactGA from "react-ga";

import { postAmazonProductInfo } from "../../../api/postAmazonProductInfo";
import {
  CardContainer,
  FlavorText,
  CardContentContainer,
  ImageWrapper,
  SubTextContainer,
  Image,
} from "./styled";

// import Badge from "./Badge";

export default function ProductCard({ GPTResults }) {
  const [amazonProducts, setAmazonProducts] = useState([]);
  const [error, setError] = useState(null);
  console.log("to search for:", GPTResults)
  useEffect(() => {
    const fetchProduct = async () => {
      if (GPTResults?.length >= 3) {
        for (let i = 0; i < 3; i++) {
          const productName = GPTResults[i].trim();
          try {
            const response = await postAmazonProductInfo(productName);
            if (response.status !== 429 && response.productName) {
              setAmazonProducts((prev) => [...prev, response]);
              ReactGA.event({
                category: "AI item Loaded",
                action: response.productName,
              });
            }
          } catch (error) {
            console.log(error);
          }

          // Introduce a delay between each request (e.g., 1 second)
          await new Promise((resolve) => setTimeout(resolve, 1100));
        }
      } else {
        setError("No AI Results found");
      }
    };

    fetchProduct();
  }, []);

  useEffect(() => {
    console.log(amazonProducts);
  }, [amazonProducts]);

  return amazonProducts?.length >= 3 ? (
    amazonProducts.map((product, index) => (
      <CardContainer
        key={index + product.productName}
        href={product.link}
        target="_blank"
        data-id={product?.score}
        onClick={() => {
          ReactGA.event({
            category: "AI item Selected",
            action: product.productName,
          });
        }}
      >
        <ImageWrapper>
          <Image alt={product?.productName} src={product.directImageSrc} />
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
              {product.price}
            </FlavorText>
            <FlavorText>Click To Purchase!</FlavorText>
          </SubTextContainer>
        </CardContentContainer>
      </CardContainer>
    ))
  ) : error ? (
    <CardContainer>
      <ImageWrapper>
        <Image alt={"AI loading"} src={Robot} />
      </ImageWrapper>

      <CardContentContainer>
        <Typography
          style={{ textAlign: "left" }}
          gutterBottom
          variant="h6"
          component="div"
        >
          {error ? error : "AI is loading..."}
        </Typography>
        <SubTextContainer>
          <FlavorText variant="body2" color="text.secondary">
            {error ? error : "Our AI is calculating a gift for you"}
          </FlavorText>
          {/* <FlavorText>Click here to Purchase</FlavorText> */}
        </SubTextContainer>
      </CardContentContainer>
    </CardContainer>
  ) : (
    <>
      <CardContainer>
        <ImageWrapper>
          <Image alt={"AI loading"} src={Robot} />
        </ImageWrapper>

        <CardContentContainer>
          <Typography
            style={{ textAlign: "left" }}
            gutterBottom
            variant="h6"
            component="div"
          >
            {error ? error : "AI is loading..."}
          </Typography>
          <SubTextContainer>
            <FlavorText variant="body2" color="text.secondary">
              {error ? error : "Our AI is calculating a gift for you"}
            </FlavorText>
            {/* <FlavorText>Click here to Purchase</FlavorText> */}
          </SubTextContainer>
        </CardContentContainer>
      </CardContainer>
      <CardContainer>
        <ImageWrapper>
          <Image alt={"AI loading"} src={Robot} />
        </ImageWrapper>

        <CardContentContainer>
          <Typography
            style={{ textAlign: "left" }}
            gutterBottom
            variant="h6"
            component="div"
          >
            {error ? error : "AI is loading..."}
          </Typography>
          <SubTextContainer>
            <FlavorText variant="body2" color="text.secondary">
              {error ? error : "Our AI is calculating a gift for you"}
            </FlavorText>
            {/* <FlavorText>Click here to Purchase</FlavorText> */}
          </SubTextContainer>
        </CardContentContainer>
      </CardContainer>
      <CardContainer>
        <ImageWrapper>
          <Image alt={"AI loading"} src={Robot} />
        </ImageWrapper>

        <CardContentContainer>
          <Typography
            style={{ textAlign: "left" }}
            gutterBottom
            variant="h6"
            component="div"
          >
            {error ? error : "AI is loading..."}
          </Typography>
          <SubTextContainer>
            <FlavorText variant="body2" color="text.secondary">
              {error ? error : "Our AI is calculating a gift for you"}
            </FlavorText>
            {/* <FlavorText>Click here to Purchase</FlavorText> */}
          </SubTextContainer>
        </CardContentContainer>
      </CardContainer>
    </>
  );
}
