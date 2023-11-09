import { useState, useContext, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Robot from "../../../../src/robot.png";
import ReactGA, { set } from "react-ga4";

import { postAmazonProductInfo } from "../../../api/postAmazonProductInfo";
import {
  CardContainer,
  FlavorText,
  CardContentContainer,
  ImageWrapper,
  SubTextContainer,
  Image,
  FancyButton,
} from "./styled";

// import Badge from "./Badge";

export default function ProductCard({ GPTResults, demo }) {
  const [amazonProducts, setAmazonProducts] = useState([]);
  const [error, setError] = useState(null);
  const [firstLoad, setFirstLoad] = useState(false);
  console.log("to search for:", GPTResults);
  useEffect(() => {
    const fetchProduct = async () => {
      if (GPTResults?.length >= 0 && !firstLoad) {
        setFirstLoad(true);
        for (let i = 0; i < GPTResults.length; i++) {
          const productName = GPTResults[i].trim();
          try {
            const response = await postAmazonProductInfo(productName);
            if (!response) {
              setAmazonProducts((prev) => [...prev, {}]);
            }
            if (response.status !== 429 && response.productName) {
              setAmazonProducts((prev) => [...prev, response]);
              ReactGA.event({
                category: "AI",
                action: "AI Item Loaded",
                label: response.productName,
                value: response?.productName,
              });
            }
          } catch (error) {
            setAmazonProducts("No AI Results found");
            console.log(error);
          }

          // Introduce a delay between each request (e.g., 1 second)
          await new Promise((resolve) => setTimeout(resolve, 1100));
        }
      }
    };

    fetchProduct();
  }, [GPTResults]);

  useEffect(() => {
    console.log(amazonProducts);
  }, [amazonProducts]);

  return amazonProducts?.length >= 3 ? (
    amazonProducts.map(
      (product, index) =>
        // only display the first 3
        (index < 3 || demo) &&
        product && (
          <CardContainer
            key={index + product.productName}
            href={product.link}
            target="_blank"
            data-id={product?.score}
            onClick={() => {
              ReactGA.event({
                category: "AI",
                action: product.productName,
                value: product?.productName,
              });
              ReactGA.event({
                category: "Retailer Visited",
                action: "Clicked to purchase AI Item",
                label: product.productName,
                value: product?.productName,
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
                <a href={product.link} target="_blank">
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
                        {
                          clicked_retailer: true,
                        }
                      );
                    }}
                  >
                    Visit Retailer
                  </FancyButton>
                </a>
              </SubTextContainer>
            </CardContentContainer>
          </CardContainer>
        )
    )
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
