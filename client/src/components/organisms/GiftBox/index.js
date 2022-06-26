import {
  BirthdayGift,
  Click,
  ClickLabel,
  Gift,
  Wishes,
  Sparkles,
  SparkOne,
  SparkTwo,
  SparkThree,
  SparkFour,
  SparkFive,
  SparkSix,
} from './styled';
import { useState } from 'react';

const GiftBox = (props) => {
  const { product } = props;
  const [checked, setChecked] = useState(false);
  console.log(checked);
  return (
    <BirthdayGift>
      <Gift>
        <Click
          onChange={() => setChecked(!checked)}
          checked={checked}
          type="checkbox"
        />
        <ClickLabel class="click" for="click"></ClickLabel>
        <Wishes>{product.productName}</Wishes>
        <Sparkles>
          <SparkOne></SparkOne>
          <SparkTwo></SparkTwo>
          <SparkThree></SparkThree>
          <SparkFour></SparkFour>
          <SparkFive></SparkFive>
          <SparkSix></SparkSix>
        </Sparkles>
      </Gift>
    </BirthdayGift>
  );
};

export default GiftBox;
