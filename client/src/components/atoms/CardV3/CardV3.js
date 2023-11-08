import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Robot from "../../../../src/robot.png";
import ReactGA from "react-ga4";
import ProductCardV2 from "../CardV2";
import { postAmazonProductInfo } from "../../../api/postAmazonProductInfo";
import {
  CardContainer,
  FlavorText,
  CardContentContainer,
  ImageWrapper,
  SubTextContainer,
  Image,
  CategoryTitleCard,
  MainSection,
  // ViewMoreCard,
  // FancyButton,
} from "./styled";

// import Badge from "./Badge";

export default function ProductCard({
  GPTResults,
  handleClickOpen,
  categoryName,
  quizData,
}) {
  const numberOfLoadingCards = 3; // Number of loading cards to display

  const [amazonProducts, setAmazonProducts] = useState([]);
  const [error, setError] = useState(null);
  const [firstLoad, setFirstLoad] = useState(false);
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
          if (
            response.status !== 429 &&
            (response.productName || response.product_name)
          ) {
            setAmazonProducts((prev) => [...prev, response]);
            ReactGA.event({
              category: "AI",
              action: "AI Item Loaded",
              label: response.productName || response.product_name,
              value: response.productName || response.product_name,
            });
          }
        } catch (error) {
          setAmazonProducts("No AI Results found");
          console.log(error);
          setError(error);
        }

        // Introduce a delay between each request (e.g., 1 second)
        // eslint-disable-next-line no-undef
        await new Promise((resolve) => setTimeout(resolve, 1100));
      }
    }
  };
  useEffect(() => {
    fetchProduct();
  }, [GPTResults]);

  useEffect(() => {}, [amazonProducts]);

  const renderLoadingCardContent = () => (
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
  );

  return amazonProducts?.length >= 3 ? (
    <div>
      <CategoryTitleCard>{categoryName}</CategoryTitleCard>
      <MainSection>
        {amazonProducts.slice(0, 5).map((product, index) => (
          <ProductCardV2
            isAi={true}
            index={index}
            quizId={quizData?.id}
            isFavorite={false}
            // showScore={location.search ? true : false}
            key={`${index}-${product.product_id}`}
            handleCardClick={handleClickOpen}
            product={product}
          />
        ))}
        {/* <ViewMoreCard>
          Click Button to see all matches in this category
          <FancyButton>View More</FancyButton>
        </ViewMoreCard> */}
      </MainSection>
    </div>
  ) : (
    <>
      {Array.from({ length: numberOfLoadingCards }).map((_, index) => (
        <CardContainer key={index}>
          <ImageWrapper>
            <Image alt={"AI loading"} src={Robot} />
          </ImageWrapper>
          {renderLoadingCardContent()}
        </CardContainer>
      ))}
    </>
  );
}
