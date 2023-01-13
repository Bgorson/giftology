import React, { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import GiftBox from "../../../components/GiftBox/GiftBox";
import ScrollDialog from "../../molecules/ProductModal";
import ProductCardV2 from "../../atoms/CardV2/CardV2";
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
import ReactGA from "react-ga";

export default function ProductResult(props) {
  const { data, results } = props;
  const { email } = useContext(UserContext);
  const { products } = data;
  const [currentCardData, setCurrentCardData] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [quizResults, setQuizResults] = React.useState(results);
  const [productResults, setProductResults] = React.useState(products);
  const [quizData, setQuizData] = React.useState(data?.quizData);
  const [isLoading, setIsLoading] = React.useState(false);
  const location = useLocation();
  // TODO: Put a use effect to sort it all once
  const handleClickOpen = (product, isHighlighted) => {
    if (isHighlighted) {
      ReactGA.event({
        category: "Highlighted Product Selected",
        action: product.productName,
      });
    } else {
      ReactGA.event({
        category: "Product Selected",
        action: product.productName,
      });
    }

    setCurrentCardData(product);
    setOpen(true);
  };

  const renderGiftBoxes = (products) => {
    return (
      <>
        <GiftBox handleCardClick={handleClickOpen} product={products[0]} />
        <GiftBox handleCardClick={handleClickOpen} product={products[1]} />
        <GiftBox handleCardClick={handleClickOpen} product={products[2]} />
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
  ReactGA.pageview("Product Result Viewed");

  // Should just be able to go through available categories
  // and display products and names
  return (
    <React.Fragment>
      {quizResults.price && (
        <Filter>
          <FilterLabel for="prices">Prefer Price Range:</FilterLabel>
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
          <ProductGrid>
            {renderGiftBoxes(productResults)}

            {productResults.map((product, index) =>
              index > 3 ? (
                <ProductCardV2
                  quizId={quizData?.id}
                  isFavorite={
                    quizData?.wishlist
                      ? quizData.wishlist.includes(product.productId)
                      : false
                  }
                  showScore={location.search ? true : false}
                  key={`${index}-${product.productId}`}
                  handleCardClick={handleClickOpen}
                  product={product}
                />
              ) : null
            )}
          </ProductGrid>
        </>
      )}

      {open && (
        <ScrollDialog
          open={open}
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
          product={currentCardData}
        />
      )}
    </React.Fragment>
  );
}
