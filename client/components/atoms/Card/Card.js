import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { FlavorText } from './styled';
export default function ProductCard({ product }) {
  console.log(product);
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
  console.log(product);
  console.log(product.link);

  return (
    <Card style={{ minHeight: '450px' }}>
      <CardActionArea href={product.link} target="_blank">
        <CardMedia
          component="img"
          alt={product.productName}
          height="200"
          image={
            product.website === 'Etsy' ? product.directImageSrc : parsedImage
          }
        />
        <CardContent style={{ display: 'flex', flexDirection: 'column' }}>
          <Typography gutterBottom variant="h5" component="div">
            {product.productName}
          </Typography>
          <FlavorText variant="body2" color="text.secondary">
            {'Who do we like this for?'}
          </FlavorText>
          <FlavorText>{product.flavorText}</FlavorText>
          <FlavorText variant="body2" color="text.secondary">
            ${product.productBasePrice}
          </FlavorText>
          {/* <Typography variant="body2" color="text.secondary">
            {product.score}
          </Typography> */}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
