import React from "react";
import ProductCardV2 from "../../atoms/CardV2/CardV2";
import { useHistory } from "react-router-dom";
import {
  MainSection,
  CategoryTitleCard,
  FancyButton,
  ViewMoreCard,
} from "./styles";
function CategoryResult({
  categoryName,
  products,
  quizData,
  backupQuizId,
  favorites,
  handleClickOpen,
}) {
  const history = useHistory();

  const handleViewMoreClick = (e) => {
    e.preventDefault();
    let quizID = quizData?.id || backupQuizId;
    // Define your dynamic route here
    const dynamicRoute = `/categories/${quizID}/${categoryName}`; // Modify this according to your needs
    history.push(dynamicRoute); // Navigate to the dynamic route
  };
  return (
    <div>
      <CategoryTitleCard>{categoryName}</CategoryTitleCard>

      <MainSection>
        {products.map(
          (product, index) =>
            index <= 4 && (
              <ProductCardV2
                index={index}
                quizId={quizData?.id || backupQuizId}
                isFavorite={favorites.includes(product.product_id)}
                // showScore={location.search ? true : false}
                key={`${index}-${product.product_id}`}
                handleCardClick={handleClickOpen}
                product={product}
              />
            )
        )}
        {products.length > 5 && (
          <ViewMoreCard>
            Click Button to see all matches!! in this category
            <FancyButton
              onClick={(e) => {
                e.preventDefault();
                handleViewMoreClick(e);
              }}
            >
              View More
            </FancyButton>
          </ViewMoreCard>
        )}
      </MainSection>
    </div>
  );
}

export default CategoryResult;
