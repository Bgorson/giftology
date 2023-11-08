/* eslint-disable no-unused-vars */
import React, { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import ScrollDialog from "../../molecules/ProductModal";
import ChatGPTCard from "../../atoms/CardV3/CardV3";
import { getFavorites } from "../../../api/getFavorites";
import CategoryResult from "../../organisms/CategoryResult/CategoryResult";

import { Audio } from "react-loader-spinner";
import { UserContext } from "../../../context/UserContext";
import {
  ProductGrid,
  LoaderContainer,
  AIGenerated,
  CategoryTitleCard,
} from "./styled";
import ReactGA from "react-ga4";

export default function ProductResult(props) {
  const { data, results, chatGPTResponses } = props;
  console.log("as a prop", data);
  const { token } = useContext(UserContext);
  const { products, categoryScores } = data;
  const [currentCardData, setCurrentCardData] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [quizResults, setQuizResults] = React.useState(results);
  const [categories, setCategories] = React.useState(categoryScores);
  const [quizData, setQuizData] = React.useState(data?.quizData);
  const [isLoading, setIsLoading] = React.useState(false);
  const [favorites, setFavorites] = React.useState([]);
  const [backupQuizId, setBackupQuizId] = React.useState(null);
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

  useEffect(() => {
    if (quizData && token) {
      const favoritesPromise = Promise.resolve(
        getFavorites(quizData?.id || backupQuizId, token)
      );
      favoritesPromise.then((favoritesRes) => {
        const turnIntoProductIds = favoritesRes.map(
          (favorite) => favorite.product_id
        );

        setFavorites(turnIntoProductIds);
      });
    }
  }, [quizData]);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setQuizResults(JSON.parse(localStorage.getItem("quizResults")));
  }, []);

  // if (products.length > 0 && categoryScores.length > 0) {

  // Should just be able to go through available categories
  // and display products and names
  return (
    <React.Fragment>
      {/* {quizResults.price && (
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
      )} */}
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

            <AIGenerated>
              <ChatGPTCard
                handleClickOpen={handleClickOpen}
                quizData={quizData}
                categoryName={"AI Generated Gift Ideas"}
                GPTResults={chatGPTResponses?.gptChoices}
              />
            </AIGenerated>

            {categories?.length > 1 &&
              categories.map((category, index) => {
                return (
                  index <= 5 && (
                    <CategoryResult
                      key={index}
                      favorites={favorites}
                      categoryName={category.name}
                      products={products[category.name]}
                      quizData={quizData}
                      backupQuizId={backupQuizId}
                      handleClickOpen={handleClickOpen}
                    />
                  )
                );
              })}
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
