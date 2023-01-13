import React, { useEffect, useContext } from "react";
import ProductCardV2 from "../../atoms/CardV2/CardV2";
import { useParams } from "react-router-dom";
import { getFavorites } from "../../../api/getFavorites";
import styled from "styled-components";
import { UserContext } from "../../../context/UserContext";
import ReactGA from "react-ga";
import ScrollDialog from "../../molecules/ProductModal";
const ProductGrid = styled.div`
  max-width: 1250px;

  margin: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 2em;
  @media (max-width: 768px) {
    justify-content: center;
    width: 75%;
  }
`;

export default function FavoritesPage() {
  let { quizId } = useParams();
  const { token } = useContext(UserContext);
  const [currentCardData, setCurrentCardData] = React.useState(null);
  const [open, setOpen] = React.useState(false);

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
  const handleClose = () => {
    setOpen(false);
  };

  console.log("quizId", quizId);
  const [productResults, setProductResults] = React.useState(null);

  useEffect(() => {
    if (token) {
      const productPromise = Promise.resolve(getFavorites(quizId, token));
      productPromise.then((productRes) => {
        console.log("RES", productRes);
        setProductResults(productRes);
      });
    }
  }, [token]);

  return (
    <div>
      Favorites
      <ProductGrid>
        {productResults &&
          productResults.map((product, index) => (
            <>
              <ProductCardV2
                quizId={quizId}
                isFavorite={true}
                key={index}
                handleCardClick={handleClickOpen}
                product={product}
              />
            </>
          ))}
      </ProductGrid>
      {open && productResults && (
        <ScrollDialog
          open={open}
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
          product={currentCardData}
        />
      )}
    </div>
  );
}
