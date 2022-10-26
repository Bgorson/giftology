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
  const [image, setImage] = useState();
  const [error, setError] = useState(false);
  const [parsedLabText, setParsedLabText] = useState(null);
  const linkCreator = (link) => {
    let urlMatches = link.match(/(?<=URL=).*?(?=\s)/);
    urlMatches = urlMatches[0].replaceAll('"', '');
    const textMatches = link.match(/(?<=text=).*/);
    return { url: urlMatches, text: textMatches[0] };
  };

  useEffect(() => {
    getProducts({ id }).then((data) => {
      const { product } = data;
      if (product) {
        setProduct(product);
        let tags = [...product.tags_display];
        tags = tags[0].split(',');
        tags.forEach((tag, index) => {
          if (tag === null || tag === 'null' || tag === 'Null' || tag === '') {
            tags = tags.splice(index, 1);
            if (tags.length === 1) {
              tags = [];
            }
          } else {
            tags[index] = ' ' + tag.charAt(0).toUpperCase() + tag.slice(1);
          }
          setTags(tags);
        });
        setParsedLabText(linkCreator(product.labResults.split('~~')[1]));
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
        {parsedLabText && (
          <>
            <p>
              {product.labResults.split('~~')[0]}
              <a href={parsedLabText.url}>{parsedLabText.text}</a>
              {product.labResults.split('~~')[2]}
            </p>
          </>
        )}

        <ProductPrice>${product.productBasePrice}</ProductPrice>
        {tags && (
          <ProductTags>
            {`Tags: ${tags.length > 0 ? ',' : ''}${tags}`}
          </ProductTags>
        )}
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
