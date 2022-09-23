import * as React from 'react';
import Typography from '@mui/material/Typography';
import {
  CardContainer,
  FlavorText,
  CardContentContainer,
  ImageWrapper,
  SubTextContainer,
} from './styled';

export default function ProductCard({
  product,
  showScore,
  handleCardClick,
  isHighlighted,
}) {
  let tags = [...product.tags];
  tags.forEach((tag, index) => {
    if (tag === null || tag === 'null' || tag === 'Null') {
      tags = tags.splice(index, 1);
      if (tags.length === 1) {
        tags = [];
      }
    } else if (tag === 'healthNut') {
      tags[index] = ' Health Nut';
    } else if (tag === 'mustOwn') {
      tags[index] = ' Must Own';
    } else if (tag === 'MustOwn') {
      tags[index] = ' Must Own';
    } else if (tag === 'WhiteElephant') {
      tags[index] = ' White Elephant';
    } else if (tag === 'whiteElephant') {
      tags[index] = ' White Elephant';
    } else {
      tags[index] = ' ' + tag.charAt(0).toUpperCase() + tag.slice(1);
    }
  });
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
    <CardContainer
      data-id={product.score}
      onClick={() => handleCardClick(product, isHighlighted)}
    >
      <ImageWrapper>
        <img
          alt={product.productName}
          src={
            product.website === 'Etsy' || product.directImageSrc !== ''
              ? product.directImageSrc
              : parsedImage
          }
        />
      </ImageWrapper>

      <CardContentContainer>
        <Typography
          style={{ textAlign: 'left' }}
          gutterBottom
          variant="h6"
          component="div"
        >
          {product.productName}
        </Typography>
        <SubTextContainer>
          <FlavorText variant="body2" color="text.secondary">
            ${product.productBasePrice}
          </FlavorText>
          {showScore && <FlavorText>SCORE:{product.score}</FlavorText>}
          <FlavorText variant="body2" color="text.secondary">
            {`Tags: ${product.category}${tags.length > 0 ? ',' : ''}${tags}`}
          </FlavorText>
        </SubTextContainer>

        {/* <Typography variant="body2" color="text.secondary">
            {product.score}
          </Typography> */}
      </CardContentContainer>
    </CardContainer>
  );
}
