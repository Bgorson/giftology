import * as React from 'react';

import Typography from '@mui/material/Typography';
import {
  CardContainer,
  FlavorText,
  CardContentContainer,
  ImageWrapper,
} from './styled';
export default function ProductCard({ product, handleCardClick }) {
  let parsedImage =
    product.htmlTag.split('src')[1]?.substring(2)?.slice(0, -12) || '';
  if (!parsedImage.includes('//ws-na.amazon')) {
    parsedImage =
      product.htmlTag.split('src')[2]?.substring(2)?.slice(0, -12) || '';
  }
  if (!parsedImage.includes('//ws-na.amazon')) {
    parsedImage =
      product.htmlTag.split('src')[3]?.substring(2)?.slice(0, -12) || '';
  }

  return (
    <CardContainer onClick={() => handleCardClick(product)}>
      <ImageWrapper>
        <img
          alt={product.productName}
          src={
            product.website === 'Etsy' ? product.directImageSrc : parsedImage
          }
        />
      </ImageWrapper>

      <CardContentContainer>
        <Typography
          style={{ fontWeight: 'bold', textAlign: 'left' }}
          gutterBottom
          variant="h5"
          component="div"
        >
          {product.productName}
        </Typography>
        <FlavorText variant="body2" color="text.secondary">
          ${product.productBasePrice}
        </FlavorText>
        <FlavorText variant="body2" color="text.secondary">
          {`Tags: ${product.tags}`}
        </FlavorText>

        {/* <Typography variant="body2" color="text.secondary">
            {product.score}
          </Typography> */}
      </CardContentContainer>
    </CardContainer>
  );
}
