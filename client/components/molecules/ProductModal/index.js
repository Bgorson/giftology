import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  TextContainer,
  ProductTitle,
  ProductDescription,
  ProductPrice,
  ProductTags,
  Button,
  Image,
} from './styles';
export default function ScrollDialog(props) {
  const { product, open, handleClickOpen, handleClose } = props;
  const [scroll, setScroll] = React.useState('paper');

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);
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
  console.log('PRODUCT', product);
  return (
    <Dialog
      maxWidth={'lg'}
      open={open}
      onClose={handleClose}
      scroll={scroll}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogTitle id="scroll-dialog-title">{product.productName}</DialogTitle>
      <DialogContent style={{ display: 'flex' }} dividers={scroll === 'paper'}>
        <Image
          alt={product.productName}
          src={
            product.website === 'Etsy' ? product.directImageSrc : parsedImage
          }
        />
        <TextContainer>
          <ProductTitle>{product.productName}</ProductTitle>
          <ProductDescription>{product.flavorText}</ProductDescription>
          <ProductPrice>${product.productBasePrice}</ProductPrice>
          <ProductTags>{`Tags: ${product.tags}`}</ProductTags>
          <a href={product.wordpressLink} target="_blank">
            <Button onClick={handleClose}>View Retailer</Button>
          </a>
        </TextContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}