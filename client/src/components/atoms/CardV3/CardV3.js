import { useState, useContext, useEffect } from "react";
import Typography from "@mui/material/Typography";
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
  console.log("PRODUCT", GPTResults);
  const [amazonProducts, setAmazonProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      for (let i = 0; i < GPTResults.length; i++) {
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
  return (
    amazonProducts.length > 0 &&
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
            <FlavorText>Click To Learn More</FlavorText>
          </SubTextContainer>
        </CardContentContainer>
      </CardContainer>
    ))
  );
}
