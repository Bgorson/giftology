import React from 'react';
import { useLocation } from 'react-router-dom';
import GiftBox from '../../../components/box/box';
import ScrollDialog from '../../molecules/ProductModal';
// import ProductCard from '../../atoms/Card/Card';
import ProductCardV2 from '../../atoms/CardV2/CardV2';

import ResultSliderV2 from '../../molecules/ResultSliderV2';
import { ProductGrid, BoxContainer } from './styled';
import ReactGA from 'react-ga';

export default function ProductResult(props) {
  const { data, arrayOfCategories } = props;
  const { products } = data;
  const [currentCardData, setCurrentCardData] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const location = useLocation();

  // TODO: Put a use effect to sort it all once
  const handleClickOpen = (product, isHighlighted) => {
    if (isHighlighted) {
      ReactGA.event({
        category: 'Highlighted Product Selected',
        action: product.productName,
      });
    } else {
      ReactGA.event({
        category: 'Product Selected',
        action: product.productName,
      });
    }

    setCurrentCardData(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { categoryScores = [] } = data;
  // if (products.length > 0 && categoryScores.length > 0) {
  ReactGA.pageview('Product Result Viewed');

  // Should just be able to go through available categories
  // and display products and names
  return (
    <React.Fragment>
      <BoxContainer>
        <GiftBox handleCardClick={handleClickOpen} product={products[0]} />
        <GiftBox handleCardClick={handleClickOpen} product={products[1]} />
        <GiftBox handleCardClick={handleClickOpen} product={products[2]} />
      </BoxContainer>

      <ProductGrid>
        {products.map((product, index) => (
          <>
            {index > 3 ? (
              <ProductCardV2
                showScore={location.search ? true : false}
                key={index}
                handleCardClick={handleClickOpen}
                product={product}
              />
            ) : null}
          </>
        ))}
      </ProductGrid>

      {/* <ResultSliderV2
        handleCardClick={handleClickOpen}
        categoryScores={categoryScores}
        arrayOfCategories={arrayOfCategories}
      /> */}
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
  // }
  //   else {
  //     return <EmptyText>No Products matching</EmptyText>;
  //   }
  // }
}
/* <p key={index}>{"product"}</p>
            <p key={index}>{"product"}</p>
            <p key={index}>{"product"}</p> */
