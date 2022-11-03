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

  const [parsedLabText, setParsedLabText] = React.useState(null);

  let tags = [...product.tags_display];
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
    } else if (tag === 'bathAndBody') {
      tags[index] = ' Bath And Body';
    } else if (tag === 'justForFun') {
      tags[index] = ' Just For Fun';
    } else if (tag === 'artsAndCrafts') {
      tags[index] = ' Arts And Crafts';
    } else if (tag === 'samplerkits') {
      tags[index] = ' Sampler Kits';
    } else {
      tags[index] = ' ' + tag.charAt(0).toUpperCase() + tag.slice(1);
    }
  });
  //Creates the availle Links
  const linkCreator = (link) => {
    let urlMatches = link.match(/[ID=](?=[ID=]).*?(?=\s)/gm);
    if (urlMatches) {
      urlMatches = urlMatches.map((match) => {
        return match.replace(/ID=/g, '');
      });
    }

    const textMatches = link.match(/text=(.*)~~/gm);
    return { url: urlMatches, text: textMatches };
  };

  // Creates A tags for insertion

  const createATags = (matches) => {
    let aTags = [];
    matches.url.forEach((url, index) => {
      let cleanUrl = url.replace(/['‘’"“”]/g, '');
      let cleanText = matches.text[index].replace(/['‘’"“”]/g, '');
      let newText1 = cleanText.replace(/text=/g, '');
      let newText = newText1.replace(/\~~/g, '');

      aTags.push(
        `<a  target="_blank" href=.././product/${cleanUrl}> ${newText}</a>`
      );
    });
    return aTags;
  };
  const insertATags = (text, aTags) => {
    let newText = text;
    aTags.forEach((tag) => {
      newText = newText.replace(/~~.*~~/, tag);
    });
    return newText;
  };

  React.useEffect(() => {
    if (product?.labResults) {
      // If there are links- parse them
      let parse = linkCreator(product.labResults);
      if (parse.url) {
        let parsedMatches = linkCreator(product.labResults);
        let aTagCreation = createATags(parsedMatches);
        setParsedLabText(insertATags(product.labResults, aTagCreation));
      } else {
        setParsedLabText(product.labResults);
      }
    }
  }, []);

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
      <ModalClose onClick={() => handleClose()} src={CloseIcon} />

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
              {/* <ModalClose onClick={() => handleClose()} src={CloseIcon} /> */}
            </ModalHeading>
            <ProductDescriptionHeading>
              Who do we like this for?
            </ProductDescriptionHeading>
            <ProductDescription>{product.flavorText}</ProductDescription>
            {product.labResults ? (
              <div dangerouslySetInnerHTML={{ __html: parsedLabText }} />
            ) : null}

            <ProductPrice>${product.productBasePrice}</ProductPrice>
            <ProductTags>{`Tags: ${tags}`}</ProductTags>
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
            </ModalHeading>
            <ProductDescriptionHeading>
              Who do we like this for?
            </ProductDescriptionHeading>
            <ProductDescription>{product.flavorText}</ProductDescription>
            {product.labResults ? (
              <div dangerouslySetInnerHTML={{ __html: parsedLabText }} />
            ) : null}

            <ProductPrice>${product.productBasePrice}</ProductPrice>
            <ProductTags>{`Tags: ${tags}`}</ProductTags>
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
