import React from 'react';
import { useLocation } from 'react-router-dom';
import GiftBox from '../../organisms/GiftBox';
import ScrollDialog from '../../molecules/ProductModal';
// import ProductCard from '../../atoms/Card/Card';
import ProductCardV2 from '../../atoms/CardV2/CardV2';

import ResultSliderV2 from '../../molecules/ResultSliderV2';
import { ProductGrid } from './styled';
import ReactGA from 'react-ga';

export default function ProductResult(props) {
  function useQuery() {
    const { search } = useLocation();
    return search;
  }
  const score = useQuery();
  const { data, arrayOfCategories } = props;
  const { products } = data;
  const [currentCardData, setCurrentCardData] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  // TODO: Put a use effect to sort it all once
  const handleClickOpen = (product) => {
    ReactGA.event({
      category: 'Product Selected',
      action: product.productName,
    });
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
      {/* <GiftBox product={products[0]} /> */}
      <ProductGrid>
        {products.map((product, index) => (
          <ProductCardV2
            showScore={score === '?score'}
            key={index}
            handleCardClick={handleClickOpen}
            product={product}
          />
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
