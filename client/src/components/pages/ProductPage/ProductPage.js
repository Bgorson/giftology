import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProducts } from '../../../api/getSingleProduct';
import {
  Image,
  TextContainer,
  ProductTitle,
  ProductDescriptionHeading,
  ProductDescription,
  ProductPrice,
  ProductTags,
  FancyButton,
  ProductContainer,
} from './styles';
export default function ProductPage() {
  let { id } = useParams();

  const [product, setProduct] = useState();
  const [tags, setTags] = useState();
  const [error, setError] = useState(false);
  const [parsedLabText, setParsedLabText] = useState(null);

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

  useEffect(() => {
    getProducts({ id }).then((data) => {
      const { product } = data;
      if (product) {
        setProduct(product);

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
        setTags(tags);
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
      } else {
        setError(true);
        return;
      }
    });
  }, []);
  return product ? (
    <ProductContainer>
      <Image src={product.directImageSrc} />

      <TextContainer>
        <ProductTitle>{product.productName}</ProductTitle>

        <ProductDescriptionHeading>
          Who do we like this for?
        </ProductDescriptionHeading>
        <ProductDescription>{product.flavorText}</ProductDescription>
        {product.labResults ? (
          <div dangerouslySetInnerHTML={{ __html: parsedLabText }} />
        ) : null}

        <ProductPrice>${product.productBasePrice}</ProductPrice>
        {tags && <ProductTags>{`Tags: ${tags}`}</ProductTags>}
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
    </ProductContainer>
  ) : error ? (
    <p>Product Not Found</p>
  ) : (
    <p>Loading</p>
  );
}