import React from 'react';
import Section from 'react-bulma-companion/lib/Section';
import Title from 'react-bulma-companion/lib/Title';
import { postQuizResults } from '../../../api/quiz';
import ScrollDialog from '../../molecules/ProductModal';
import {
  Category,
  CategoryContainer,
  CategoryDescription,
  CategoryScore,
  Container,
  ProductContainer,
  ProductImage,
  ProductTitle,
  ProductScore,
  SingleProductContainer,
  EmptyText,
} from './styled';

import ResultSlider from '../../molecules/ResultSlider/ResultSlider';
import ResultSliderV2 from '../../molecules/ResultSliderV2';
import ReactGA from 'react-ga';

export default function ProductResult(props) {
  const { data, arrayOfCategories } = props;
  const [currentCardData, setCurrentCardData] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  // TODO: Put a use effect to sort it all once
  const handleClickOpen = (product) => {
    setCurrentCardData(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const { products = [], categoryScores = [] } = data;
  // if (products.length > 0 && categoryScores.length > 0) {
  ReactGA.pageview('Product Result Viewed');

  // Should just be able to go through available categories
  // and display products and names
  return (
    <React.Fragment>
      <ResultSliderV2
        handleCardClick={handleClickOpen}
        categoryScores={categoryScores}
        arrayOfCategories={arrayOfCategories}
      />
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
