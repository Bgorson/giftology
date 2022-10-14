import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GiftBox from '../../../components/box/box';
import ScrollDialog from '../../molecules/ProductModal';
// import ProductCard from '../../atoms/Card/Card';
import ProductCardV2 from '../../atoms/CardV2/CardV2';
import { postAllQuizResults } from '../../../api/allQuiz';
import ResultSliderV2 from '../../molecules/ResultSliderV2';
import {
  ProductGrid,
  Filter,
  FilterLabel,
  FilterSelect,
  FilterOption,
} from './styled';
import ReactGA from 'react-ga';

export default function ProductResult(props) {
  const { data, arrayOfCategories, results } = props;

  const { products } = data;
  const [currentCardData, setCurrentCardData] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [quizResults, setQuizResults] = React.useState(results);
  const [productResults, setProductResults] = React.useState(products);

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
  const handlePriceChange = (newPrice) => {
    const updatedPriceResults = { ...quizResults, price: newPrice };
    setQuizResults(updatedPriceResults);
    localStorage.setItem('quizResults', JSON.stringify(updatedPriceResults));

    const productPromise = Promise.resolve(
      postAllQuizResults(updatedPriceResults)
    );
    productPromise.then((productRes) => {
      setProductResults(productRes.products);
    });
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setQuizResults(JSON.parse(localStorage.getItem('quizResults')));
  }, []);

  const { categoryScores = [] } = data;
  // if (products.length > 0 && categoryScores.length > 0) {
  ReactGA.pageview('Product Result Viewed');

  // Should just be able to go through available categories
  // and display products and names
  return (
    <React.Fragment>
      {quizResults.price && (
        <Filter>
          <FilterLabel for="prices">Current Prices:</FilterLabel>
          <FilterSelect
            onChange={(e) => handlePriceChange(e.target.value)}
            name="prices"
          >
            <FilterOption selected={quizResults.price == '0-10'} value="0-10">
              $0-$10
            </FilterOption>
            <FilterOption selected={quizResults.price == '10-30'} value="10-30">
              $10-$30
            </FilterOption>
            <FilterOption selected={quizResults.price == '30-50'} value="30-50">
              $30-$50
            </FilterOption>
            <FilterOption
              selected={quizResults.price == '100-999999'}
              value="100-999999"
            >
              +$100
            </FilterOption>
          </FilterSelect>
        </Filter>
      )}
      <ProductGrid>
        <GiftBox handleCardClick={handleClickOpen} product={products[0]} />
        <GiftBox handleCardClick={handleClickOpen} product={products[1]} />
        <GiftBox handleCardClick={handleClickOpen} product={products[2]} />

        {productResults.map((product, index) => (
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
