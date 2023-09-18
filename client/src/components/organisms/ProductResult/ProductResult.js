import React, { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import GiftBox from "../../../components/GiftBox/GiftBox";
import ScrollDialog from "../../molecules/ProductModal";
import ProductCardV2 from "../../atoms/CardV2/CardV2";
import ChatGPTCard from "../../atoms/CardV3/CardV3";

import { postAllQuizResults } from "../../../api/allQuiz";
import { Audio } from "react-loader-spinner";
import { UserContext } from "../../../context/UserContext";
import {
  ProductGrid,
  Filter,
  FilterLabel,
  FilterSelect,
  FilterOption,
  LoaderContainer,
} from "./styled";
import ReactGA from "react-ga4";

export default function ProductResult(props) {
  const { data, results, chatGPTResponses } = props;
  const { email } = useContext(UserContext);
  const { products } = data;
  const [currentCardData, setCurrentCardData] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [quizResults, setQuizResults] = React.useState(results);
  const [productResults, setProductResults] = React.useState(products);
  const [quizData, setQuizData] = React.useState(data?.quizData);
  const [isLoading, setIsLoading] = React.useState(false);
  const [backupQuizId, setBackupQuizId] = React.useState(null);
  const location = useLocation();
  // TODO: Put a use effect to sort it all once
  const handleClickOpen = (product, isHighlighted) => {
    if (isHighlighted) {
      ReactGA.event({
        category: "Highlighted Product Selected",
        action: product.product_name,
      });
    } else {
      ReactGA.event({
        category: "Product Selected",
        action: product.product_name,
        value: product?.product_name,
      });
    }

    setCurrentCardData(product);
    setOpen(true);
  };

  useEffect(() => {
    let backupQuizVal = localStorage.getItem("quizId");
    if (backupQuizVal) {
      setBackupQuizId(backupQuizVal);
    }
  }, []);

  const renderGiftBoxes = (products) => {
    return (
      <>
        {products[0] && (
          <GiftBox
            isFavorite={
              quizData?.wishlist
                ? quizData.wishlist.includes(products[0].product_id)
                : false
            }
            handleCardClick={handleClickOpen}
            quizId={quizData?.id || backupQuizId}
            product={products[0]}
          />
        )}
        {products[1] && (
          <GiftBox
            isFavorite={
              quizData?.wishlist
                ? quizData.wishlist.includes(products[1].product_id)
                : false
            }
            handleCardClick={handleClickOpen}
            quizId={quizData?.id || backupQuizId}
            product={products[1]}
          />
        )}
        {products[2] && (
          <GiftBox
            isFavorite={
              quizData?.wishlist
                ? quizData.wishlist.includes(products[2].productId)
                : false
            }
            handleCardClick={handleClickOpen}
            quizId={quizData?.id || backupQuizId}
            product={products[2]}
          />
        )}
      </>
    );
  };

  const handlePriceChange = (newPrice) => {
    setIsLoading(true);
    const updatedPriceResults = { ...quizResults, price: newPrice };
    setQuizResults(updatedPriceResults);
    localStorage.setItem("quizResults", JSON.stringify(updatedPriceResults));

    const productPromise = Promise.resolve(
      postAllQuizResults(
        updatedPriceResults,
        email || localStorage.getItem("userEmail")
      )
    );
    productPromise.then((productRes) => {
      setIsLoading(false);

      setProductResults(productRes.products);
      setQuizData(productRes.quizData);
    });
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setQuizResults(JSON.parse(localStorage.getItem("quizResults")));
  }, []);

  const { categoryScores = [] } = data;
  // if (products.length > 0 && categoryScores.length > 0) {

  // Should just be able to go through available categories
  // and display products and names
  return (
    <React.Fragment>
      {quizResults.price && (
        <Filter>
          <FilterLabel for="prices">Preferred Price Range:</FilterLabel>
          <FilterSelect
            onChange={(e) => handlePriceChange(e.target.value)}
            name="prices"
          >
            <FilterOption selected={quizResults.price == "0-10"} value="0-10">
              $0-$10
            </FilterOption>
            <FilterOption selected={quizResults.price == "10-30"} value="10-30">
              $10-$30
            </FilterOption>
            <FilterOption selected={quizResults.price == "30-50"} value="30-50">
              $30-$50
            </FilterOption>
            <FilterOption
              selected={quizResults.price == "50-999999"}
              value="50-999999"
            >
              +$50
            </FilterOption>
          </FilterSelect>
        </Filter>
      )}
      {isLoading && (
        <LoaderContainer>
          Calculating the perfect gift...
          <Audio heigth="500" width="500" color="grey" ariaLabel="loading" />
        </LoaderContainer>
      )}
      {!isLoading && (
        <>
          <ProductGrid blurred={open}>
            {/* {renderGiftBoxes(productResults)} */}
            <ChatGPTCard GPTResults={chatGPTResponses?.gptChoices} />

            {productResults?.length > 1 &&
              productResults.map(
                (product, index) => (
                  // index > 3 ? (
                  <ProductCardV2
                    quizId={quizData?.id || backupQuizId}
                    isFavorite={
                      quizData?.wishlist
                        ? quizData.wishlist.includes(product.product_id)
                        : false
                    }
                    showScore={location.search ? true : false}
                    key={`${index}-${product.product_id}`}
                    handleCardClick={handleClickOpen}
                    product={product}
                  />
                )
                // ) : null
              )}
          </ProductGrid>
        </>
      )}

      {open && (
        <ScrollDialog
          quizId={quizData?.id || backupQuizId}
          open={open}
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
          product={currentCardData}
        />
      )}
    </React.Fragment>
  );
}
