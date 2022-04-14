import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import {
  TextContainer,
  ProductTitle,
  ProductDescription,
  ProductPrice,
  ProductTags,
  Button,
  ProductImage,
  Image,
  DesktopWrapper,
  MobileWrapper,
  ProductDescriptionHeading,
} from './styles';
export default function ScrollDialog(props) {
  const { product, open, handleClickOpen, handleClose } = props;
  const [scroll, setScroll] = React.useState('paper');
  const descriptionElementRef = React.useRef(null);
  let tags = [...product.tags];
  tags.forEach((tag, index) => {
    console.log(tag);
    if (tag === null || tag === 'null' || tag === 'Null') {
      console.log('MATCH');

      tags = tags.splice(index, 1);
      if (tags.length === 1) {
        tags = [];
      }
    } else {
      tags[index] = ' ' + tag.charAt(0).toUpperCase() + tag.slice(1);
    }
  });
  console.log('THESE ARE TAGS', tags);
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
  console.log('PRODUCT', product.htmlTag);
  return (
    <Dialog
      maxWidth={'lg'}
      open={open}
      onClose={handleClose}
      scroll={scroll}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      {/* <DialogTitle id="scroll-dialog-title">{product.productName}</DialogTitle> */}
      <MobileWrapper>
        <DialogContent dividers={scroll === 'paper'}>
          {product.directImageSrc !== '' ? (
            <Image src={product.directImageSrc} />
          ) : (
            <ProductImage
              dangerouslySetInnerHTML={{
                __html: product.htmlTag,
              }}
            />
          )}

          <TextContainer>
            <ProductTitle>{product.productName}</ProductTitle>
            <ProductDescriptionHeading>
              Who do we like this for?
            </ProductDescriptionHeading>
            <ProductDescription>{product.flavorText}</ProductDescription>
            <ProductPrice>${product.productBasePrice}</ProductPrice>
            <ProductTags>
              {`Tags: ${product.category}${tags.length > 0 ? ',' : ''}${tags}`}
            </ProductTags>
            <a href={product.link} target="_blank">
              <Button>View Retailer</Button>
            </a>
          </TextContainer>
        </DialogContent>
      </MobileWrapper>
      <DesktopWrapper>
        <DialogContent
          style={{ display: 'flex' }}
          dividers={scroll === 'paper'}
        >
          {product.directImageSrc !== '' ? (
            <Image src={product.directImageSrc} />
          ) : (
            <ProductImage
              dangerouslySetInnerHTML={{
                __html: product.htmlTag,
              }}
            />
          )}

          <TextContainer>
            <ProductTitle>{product.productName}</ProductTitle>
            <ProductDescriptionHeading>
              Who do we like this for?
            </ProductDescriptionHeading>
            <ProductDescription>{product.flavorText}</ProductDescription>
            <ProductPrice>${product.productBasePrice}</ProductPrice>
            <ProductTags>
              {`Tags: ${product.category}${tags.length > 0 ? ',' : ''}${tags}`}
            </ProductTags>
            <a href={product.link} target="_blank">
              <Button>View Retailer</Button>
            </a>
          </TextContainer>
        </DialogContent>
      </DesktopWrapper>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
