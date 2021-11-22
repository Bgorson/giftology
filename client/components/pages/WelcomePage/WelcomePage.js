import React from 'react';

import Section from 'react-bulma-companion/lib/Section';
import Container from 'react-bulma-companion/lib/Container';
import Title from 'react-bulma-companion/lib/Title';
import { useHistory } from 'react-router';
import Button from '../../atoms/Button';
import ProductResult from '../../organisms/ProductResult/ProductResult';

const data = {
  categoryScores: [
    {
      name: 'Camping',
      score: 2,
    },
    {
      name: 'Technology',
      score: 0,
    },
    {
      name: 'Home Chef',
      score: 0,
    },
    {
      name: 'Outdoor Games',
      score: 1,
    },
    {
      name: 'Health And Wellness',
      score: 1,
    },
    {
      name: 'Reading',
      score: 0,
    },
    {
      name: 'Gaming',
      score: 0,
    },
    {
      name: 'Board Games',
      score: 0,
    },
    {
      name: 'Pets - Dog',
      score: 0,
    },
    {
      name: 'null',
      score: 0,
    },
  ],
  products: [
    {
      hobbiesInterests: 'Camping',
      _id: '6199b4e3c855b94d731cf4b6',
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
      indoorOutdoor: 'outdoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      practicalWhimsical: 'null',
      score: 2,
    },
    {
      hobbiesInterests: 'Camping',
      _id: '6199b4e3c855b94d731cf4b7',
      productId: '',
      productName: "Mountain Hardwear Men's Stretch Ozonic Jacket",
      category: 'Camping',
      website: 'Amazon',
      link: 'https://www.amazon.com/gp/product/B082QX7G1K?ie=UTF8&th=1&linkCode=sl1&tag=giftologyshop-20&linkId=00836c10ee4f41920c2b6e3e12647a3d&language=en_US&ref_=as_li_ss_tl&psc=1',
      flavorText:
        'Who do we like this for?\n\nnullone that’s had bad weather mess up a great trip.',
      productBasePrice: '199.99',
      gender: 'null',
      indoorOutdoor: 'outdoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      practicalWhimsical: 'null',
      score: 2,
    },
    {
      hobbiesInterests: 'Music,Technology',
      _id: '6199b4e3c855b94d731cf4b8',
      productId: '',
      productName: 'JBL CLIP 3 - Waterproof Portable Bluetooth Speaker',
      category: 'Technology',
      website: 'Amazon',
      link: 'https://www.amazon.com/JBL-Waterproof-Portable-Bluetooth-Speaker/dp/B07Q6ZWMLR?linkCode=sl1&tag=giftologyshop-20&linkId=cdff2308edba579a986a2367db08d830&language=en_US&ref_=as_li_ss_tl&th=1',
      flavorText:
        'For those of you who either want a budget-friendly version of the JBL FLIP 5 or an even more portable alternative, we recommend the JBL CLIP 3.',
      productBasePrice: '49.95',
      gender: 'null',
      indoorOutdoor: 'null',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      practicalWhimsical: 'null',
      score: 0,
    },
    {
      hobbiesInterests: 'Music,Technology',
      _id: '6199b4e3c855b94d731cf4b9',
      productId: '',
      productName: 'JBL FLIP 5, Waterproof Portable Bluetooth Speaker',
      category: 'Technology',
      website: 'Amazon',
      link: 'https://www.amazon.com/JBL-Waterproof-Portable-Bluetooth-Speaker/dp/B07QK2SPP7?th=1&linkCode=sl1&tag=giftologyshop-20&linkId=653808aa96dba7e9eeecefdf450b52e7&language=en_US&ref_=as_li_ss_tl',
      flavorText:
        "Who do we like this for?\n\nFor those who consider music an important part of their daily routine, we recommend the JBL family of portable Bluetooth speakers.'",
      productBasePrice: '129.95',
      gender: 'null',
      indoorOutdoor: 'null',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      practicalWhimsical: 'null',
      score: 0,
    },
    {
      hobbiesInterests: 'Home Chef',
      _id: '6199b4e3c855b94d731cf4ba',
      productId: '',
      productName:
        'Nespresso BEC250BLK Essenza Mini Espresso Machine with Aeroccino Milk Frother by Breville, Piano Black',
      category: 'Home Chef',
      website: 'Amazon',
      link: 'https://www.amazon.com/Nespresso-Essenza-Original-Espresso-Breville/dp/B073ZHT2FM?crid=2RIMDTXACX4B0&dchild=1&keywords=nespresso%2Bessenza%2Bmini&qid=1613014542&sprefix=nespresso%2Be%2Caps%2C179&sr=8-3&th=1&linkCode=sl1&tag=giftologyshop-20&linkId=19686603b2d67c4305c4d0b8900ae59d&language=en_US&ref_=as_li_ss_tl',
      flavorText:
        'Who do we like this for?\n\nCoffee connoisseurs who like their espresso just so… and strong!',
      productBasePrice: '219.95',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      practicalWhimsical: 'null',
      score: 0,
    },
    {
      hobbiesInterests: 'Home Chef',
      _id: '6199b4e3c855b94d731cf4bb',
      productId: '',
      productName:
        'WÜSTHOF CLASSIC IKON 8 Inch Chef’s Knife | Full-Tang Half Bolster 8" Cook’s Knife | Precision Forged High-Carbon Stainless Steel German Made Chef’s Knife – Model ,Black',
      category: 'Home Chef',
      website: 'Amazon',
      link: 'https://www.amazon.com/Wusthof-4596-7-20-4596-7-20-Knife/dp/B000YMURSE?dchild=1&keywords=wusthof+classic+ikon&qid=1624038319&s=industrial&sr=1-8&linkCode=sl1&tag=giftologyshop-20&linkId=f4a8d863046316447f5e36f8735a2d48&language=en_US&ref_=as_li_ss_tl',
      flavorText:
        'Who do we like this for?\n\nnullone who loves to cook, and most people who don’t. This is our #1 gift for null home chef.',
      productBasePrice: '180',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '18',
      ageMax: '120',
      occasion: 'null',
      practicalWhimsical: 'null',
      score: 0,
    },
    {
      hobbiesInterests: 'Camping',
      _id: '6199b4e3c855b94d731cf4be',
      productId: '',
      productName: 'PETZL - TIKKINA Headlamp, 150 Lumens, Standard Lighting',
      category: 'Camping',
      website: 'Amazon',
      link: 'https://www.amazon.com/PETZL-TIKKINA-Headlamp-Standard-Lighting/dp/B01KYTRHLQ?dchild=1&keywords=Petzl%2BTikkina%2BHeadlamp&qid=1626036560&s=sporting-goods&sr=1-5&th=1&linkCode=sl1&tag=giftologyshop-20&linkId=8c570e0d8b3da9654ef3dacbeabf4abe&language=en_US&ref_=as_li_ss_tl',
      flavorText:
        'Who do we like it for?\nCampers who just need a basic headlamp.',
      productBasePrice: '34.97',
      gender: 'null',
      indoorOutdoor: 'outdoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      practicalWhimsical: 'null',
      score: 2,
    },
  ],
};

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
