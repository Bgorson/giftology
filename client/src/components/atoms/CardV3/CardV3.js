import { useState, useContext, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Robot from "../../../../src/robot.png";
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

  useEffect(() => {
    const fetchProduct = async () => {
      for (let i = 0; i < 3; i++) {
        const productName = GPTResults[i];
        try {
          const response = await postAmazonProductInfo(productName);
          if (response.status !== 429 && response.productName) {
            setAmazonProducts((prev) => [...prev, response]);
          }
        } catch (error) {
          console.log(error);
        }

        // Introduce a delay between each request (e.g., 1 second)
        await new Promise((resolve) => setTimeout(resolve, 1100));
      }
    };

    fetchProduct();
  }, []);
  return amazonProducts.length >= 3 ? (
    amazonProducts.map((product, index) => (
      <CardContainer
        key={index + product.productName}
        href={product.link}
        target="_blank"
        data-id={product?.score}
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
            {"AI is loading..."}
          </Typography>
          <SubTextContainer>
            <FlavorText variant="body2" color="text.secondary">
              {"Our AI is calculating a gift for you"}
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
            {"AI is loading..."}
          </Typography>
          <SubTextContainer>
            <FlavorText variant="body2" color="text.secondary">
              {"Our AI is calculating a gift for you"}
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
            {"AI is loading..."}
          </Typography>
          <SubTextContainer>
            <FlavorText variant="body2" color="text.secondary">
              {"Our AI is calculating a gift for you"}
            </FlavorText>
            {/* <FlavorText>Click here to Purchase</FlavorText> */}
          </SubTextContainer>
        </CardContentContainer>
      </CardContainer>
    </>
  );
}
