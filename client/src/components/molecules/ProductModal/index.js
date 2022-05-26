import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import CloseIcon from '../../../close.png';
import DialogContent from '@mui/material/DialogContent';
import {
  TextContainer,
  ProductTitle,
  ProductDescription,
  ProductPrice,
  ProductTags,
  ProductImage,
  Image,
  DesktopWrapper,
  MobileWrapper,
  ProductDescriptionHeading,
  FancyButton,
  ModalClose,
  ModalHeading,
} from './styles';
import ReactGA from 'react-ga';

export default function ScrollDialog(props) {
  const { product, handleClose } = props;
  const [scroll, setScroll] = React.useState('paper');
  let tags = [...product.tags];
  tags.forEach((tag, index) => {
    if (tag === null || tag === 'null' || tag === 'Null') {
      tags = tags.splice(index, 1);
      if (tags.length === 1) {
        tags = [];
      }
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
    <Dialog
      disableScrollLock={true}
      maxWidth={'lg'}
      open={true}
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
            <ModalHeading>
              <ProductTitle>{product.productName}</ProductTitle>
              <ModalClose onClick={() => handleClose()} src={CloseIcon} />
            </ModalHeading>
            <ProductDescriptionHeading>
              Who do we like this for?
            </ProductDescriptionHeading>
            <ProductDescription>{product.flavorText}</ProductDescription>
            <ProductPrice>${product.productBasePrice}</ProductPrice>
            <ProductTags>
              {`Tags: ${product.category}${tags.length > 0 ? ',' : ''}${tags}`}
            </ProductTags>
            <a
              onClick={() =>
                ReactGA.event({
                  category: 'Retailer Visited',
                  action: product.productName,
                  label: 'Home',
                })
              }
              href={product.link}
              target="_blank"
            >
              <FancyButton>View Retailer</FancyButton>
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
            <ModalHeading>
              <ProductTitle>{product.productName}</ProductTitle>
              <ModalClose onClick={() => handleClose()} src={CloseIcon} />
            </ModalHeading>
            <ProductDescriptionHeading>
              Who do we like this for?
            </ProductDescriptionHeading>
            <ProductDescription>{product.flavorText}</ProductDescription>
            <ProductPrice>${product.productBasePrice}</ProductPrice>
            <ProductTags>
              {`Tags: ${product.category}${tags.length > 0 ? ',' : ''}${tags}`}
            </ProductTags>
            <a href={product.link} target="_blank">
              <FancyButton
                onClick={() =>
                  ReactGA.event({
                    category: 'Retailer Visited',
                    action: product.productName,
                    label: 'Home',
                  })
                }
              >
                View Retailer
              </FancyButton>
            </a>
          </TextContainer>
        </DialogContent>
      </DesktopWrapper>
      <DialogActions></DialogActions>
    </Dialog>
  );
}
