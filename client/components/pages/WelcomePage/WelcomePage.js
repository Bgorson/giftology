import React from 'react';

import Section from 'react-bulma-companion/lib/Section';
import Container from 'react-bulma-companion/lib/Container';
import Title from 'react-bulma-companion/lib/Title';
import { useHistory } from 'react-router';
import Button from '../../atoms/Button';
import ProductResult from '../../organisms/ProductResult/ProductResult';

const data = [
  {
    occassions: { Type: [] },
    hobbiesInterests: '{Camping}',
    _id: '61993690e23f275ea01d746a',
    productId: '',
    productName: 'PETZL - TIKKINA Headlamp, 150 Lumens, Standard Lighting',
    category: 'Camping',
    website: 'Amazon',
    link: 'https://www.amazon.com/PETZL-TIKKINA-Headlamp-Standard-Lighting/dp/B01KYTRHLQ?dchild=1&keywords=Petzl%2BTikkina%2BHeadlamp&qid=1626036560&s=sporting-goods&sr=1-5&th=1&linkCode=sl1&tag=giftologyshop-20&linkId=8c570e0d8b3da9654ef3dacbeabf4abe&language=en_US&ref_=as_li_ss_tl',
    flavorText:
      'Who do we like it for?\nCampers who just need a basic headlamp.',
    productBasePrice: '34.97',
    gender: 'null',
    indoorOutdoor: '{outdoor}',
    ageMin: '12',
    ageMax: '120',
    occasion: 'null',
    practicalWhimsical: 'null',
  },
  {
    occassions: { Type: [] },
    hobbiesInterests: '{Camping}',
    _id: '61993690e23f275ea01d746b',
    productId: '',
    productName:
      'Hydro Flask Water Bottle - Stainless Steel, Reusable, Vacuum Insulated- Wide Mouth with Leak Proof Flex Cap',
    category: 'Camping',
    website: 'Amazon',
    link: 'https://www.amazon.com/Hydro-Flask-Water-Bottle-Stainless/dp/B07YXMJZQW?dchild=1&keywords=Hydro%2BFlask%2BWide-Mouth%2BVacuum%2BWater%2BBottle%2B-%2B32%2Bfl.%2Boz.&qid=1626031702&sr=8-2&th=1&psc=1&linkCode=sl1&tag=giftologyshop-20&linkId=2f993aa25a0081fb4edb9bb8e0aaa833&language=en_US&ref_=as_li_ss_tl',
    flavorText:
      'Who do we like this for?\n\nCampers and hikers who want cold, refreshing water, or nullone who needs to sneak wine into a family reunion.',
    productBasePrice: '33.95',
    gender: 'null',
    indoorOutdoor: '{outdoor}',
    ageMin: '12',
    ageMax: '120',
    occasion: 'null',
    practicalWhimsical: 'null',
  },
  {
    occassions: { Type: [] },
    hobbiesInterests: '{Camping}',
    _id: '61993690e23f275ea01d746c',
    productId: '',
    productName: "Mountain Hardwear Men's Stretch Ozonic Jacket",
    category: 'Camping',
    website: 'Amazon',
    link: 'https://www.amazon.com/gp/product/B082QX7G1K?ie=UTF8&th=1&linkCode=sl1&tag=giftologyshop-20&linkId=00836c10ee4f41920c2b6e3e12647a3d&language=en_US&ref_=as_li_ss_tl&psc=1',
    flavorText:
      'Who do we like this for?\n\nnullone that’s had bad weather mess up a great trip.',
    productBasePrice: '199.99',
    gender: 'null',
    indoorOutdoor: '{outdoor}',
    ageMin: '12',
    ageMax: '120',
    occasion: 'null',
    practicalWhimsical: 'null',
  },
  {
    occassions: { Type: [] },
    hobbiesInterests: '{Camping}',
    _id: '61993690e23f275ea01d746d',
    productId: '',
    productName: 'REI Co-op Half Dome SL 2+ Tent with Footprint',
    category: 'Camping',
    website: 'REI',
    link: 'https://www.rei.com/product/185632/rei-co-op-half-dome-sl-2-tent-with-footprint',
    flavorText:
      'Who do we like this for?\n\nnullone looking for an all-around, quality tent with a little extra room to sprawl out.',
    productBasePrice: '279',
    gender: 'null',
    indoorOutdoor: '{outdoor}',
    ageMin: '12',
    ageMax: '120',
    occasion: 'null',
    practicalWhimsical: 'null',
  },
  {
    occassions: { Type: [] },
    hobbiesInterests: '{Home Chef/Cooking}',
    _id: '61993690e23f275ea01d746e',
    productId: '',
    productName:
      'Cooking Gift Set Co | Wood Smoked Grill Kit - 8 Piece BBQ Set | Top Grilling Gifts for Dad, Grill Sets for Men, BBQ Gifts for Men',
    category: 'Home Chef',
    website: 'Amazon',
    link: 'https://www.amazon.com/Cooking-Gift-Set-Smoker-Birthday/dp/B01DVJ66H2?dchild=1&keywords=barbecue+smoker+kit&qid=1625525079&sr=8-9&linkCode=sl1&tag=giftologyshop-20&linkId=50b3cdbaddccc78ac3c740cc485ba665&language=en_US&ref_=as_li_ss_tl',
    flavorText:
      'Who do we like this for?\n\nFolks who want to experiment with smoking but have large smoker commitment issues.',
    productBasePrice: '49.99',
    gender: 'null',
    indoorOutdoor: '{indoor}',
    ageMin: '12',
    ageMax: '120',
    occasion: 'null',
    practicalWhimsical: 'null',
  },
  {
    occassions: { Type: [] },
    hobbiesInterests: '{Camping}',
    _id: '61993690e23f275ea01d746f',
    productId: '',
    productName:
      'PETZL, ACTIK CORE Headlamp, 450 Lumens, Rechargeable, with CORE Battery, Black',
    category: 'Camping',
    website: 'Amazon',
    link: 'https://www.amazon.com/gp/product/B07T5RLZTX?ie=UTF8&linkCode=sl1&tag=giftologyshop-20&linkId=8f456fb9b9579537f8f1e9b7c0f9de10&language=en_US&ref_=as_li_ss_tl&th=1',
    flavorText:
      'Who do we like this for?\n\nnullone looking for a reliable, hands-free light source, with some excellent features.',
    productBasePrice: '69.95',
    gender: 'null',
    indoorOutdoor: '{outdoor}',
    ageMin: '12',
    ageMax: '120',
    occasion: 'null',
    practicalWhimsical: 'null',
  },
  {
    occassions: { Type: [] },
    hobbiesInterests: '{Home Chef/Cooking,Technology,Gardening}',
    _id: '61993690e23f275ea01d7470',
    productId: '',
    productName:
      'Click and Grow Smart Garden 3 Indoor Herb Garden (Includes Basil Plant Pods), White',
    category: 'Home Chef',
    website: 'Amazon',
    link: 'https://www.amazon.com/gp/product/B01MRVMKQH?ie=UTF8&linkCode=sl1&tag=giftologyshop-20&linkId=39f8eb6b9cc31718c5e2e96ba4d8d4cf&language=en_US&ref_=as_li_ss_tl&th=1',
    flavorText:
      'Who do we like this for?\n\nPeople who desperately need fresh pesto year-round.',
    productBasePrice: '99.95',
    gender: 'null',
    indoorOutdoor: '{indoor}',
    ageMin: '12',
    ageMax: '120',
    occasion: 'null',
    practicalWhimsical: 'null',
  },
  {
    occassions: { Type: [] },
    hobbiesInterests: '{Camping}',
    _id: '61993690e23f275ea01d7471',
    productId: '',
    productName: "Mountain Hardwear Women's Stretch Ozonic Jacket",
    category: 'Camping',
    website: 'Amazon',
    link: 'https://www.amazon.com/gp/product/B082QML2Y6?ie=UTF8&th=1&linkCode=sl1&tag=giftologyshop-20&linkId=95564400595012db9ab6c3a9b4c0b733&language=en_US&ref_=as_li_ss_tl&psc=1',
    flavorText:
      'Who do we like this for?\n\nnullone that’s had bad weather mess up a great trip.',
    productBasePrice: '199.97',
    gender: 'null',
    indoorOutdoor: '{outdoor}',
    ageMin: '12',
    ageMax: '120',
    occasion: 'null',
    practicalWhimsical: 'null',
  },
  {
    occassions: { Type: [] },
    hobbiesInterests: '{Home Chef/Cooking}',
    _id: '61993690e23f275ea01d7472',
    productId: '',
    productName:
      'GoWISE USA GW22921-S 8-in-1 Digital Air Fryer with Recipe Book, 5.0-Qt, Black',
    category: 'Home Chef',
    website: 'Amazon',
    link: 'https://www.amazon.com/gp/product/B07JP1GFNW?ie=UTF8&th=1&linkCode=sl1&tag=giftologyshop-20&linkId=2c9f26b7df90970ca71f1148d6c581e4&language=en_US&ref_=as_li_ss_tl',
    flavorText:
      'Who do we like this for?\n\nPeople who hate soggy leftovers and home cooks who want to prepare a meal quickly.',
    productBasePrice: '69.99',
    gender: 'null',
    indoorOutdoor: '{indoor}',
    ageMin: '12',
    ageMax: '120',
    occasion: 'null',
    practicalWhimsical: 'null',
  },
];
export default function WelcomePage() {
  const history = useHistory();
  return (
    <div className="welcome-page page">
      <Section>
        <Container>
          <Title size="1">Welcome to Giftology!</Title>
          <Button
            onClick={() => history.push('/quiz')}
            label="Click to Access Quiz"
          />
        </Container>
        {/* <ProductResult data={data} /> */}
      </Section>
    </div>
  );
}
