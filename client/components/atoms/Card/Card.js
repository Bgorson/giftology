import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

export default function ProductCard({ product }) {
  let parsedImage =
    product.htmlTag.split('src')[1]?.substring(2)?.slice(0, -12) || '';
  console.log(product);
  console.log(product.link);

  return (
    <Card style={{ height: '390px' }}>
      <CardActionArea href={product.link} target="_blank">
        <CardMedia
          component="img"
          alt={product.productName}
          height="200"
          image={
            product.website === 'Etsy' ? product.directImageSrc : parsedImage
          }
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {product.productName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.flavorText}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
