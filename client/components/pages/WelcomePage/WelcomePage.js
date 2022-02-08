import React from 'react';

import Section from 'react-bulma-companion/lib/Section';
import Title from 'react-bulma-companion/lib/Title';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import Card from '../../atoms/Card';
import Button from '../../atoms/Button';
import ProductResult from '../../organisms/ProductResult/ProductResult';
import {
  Hero,
  HeroCallToAction,
  HeroDescription,
  HeroTitle,
  HeroImage,
  HeroText,
} from './styles';

const data = {
  categoryScores: [
    {
      name: 'Camping',
      score: 1.9,
    },
    {
      name: 'Home Chef',
      score: 2.8,
    },
    {
      name: 'Technology',
      score: 1.5,
    },
    {
      name: 'Outdoor Games',
      score: 1,
    },
    {
      name: 'Health And Wellness',
      score: 0.5,
    },
    {
      name: 'Reading',
      score: 2,
    },
    {
      name: 'Mixology',
      score: 1.5,
    },
    {
      name: 'Gaming',
      score: 1.8,
    },
    {
      name: 'Board Games',
      score: 1,
    },
    {
      name: 'Pets - Dog',
      score: 1,
    },
    {
      name: 'Just for Fun',
      score: 1,
    },
  ],
  products: [
    {
      occasion: {
        Type: [],
      },
      tags: 'trendy',
      giftType: 'essentials',
      hobbiesInterests: 'camping',
      _id: '61c8e3a223109f7bf514e63a',
      productId: '100001',
      productName:
        'Hydro Flask Water Bottle - Stainless Steel, Reusable, Vacuum Insulated- Wide Mouth with Leak Proof Flex Cap',
      category: 'Camping',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Hydro-Flask-Insulated-Stainless-Pacific/dp/B01MSCXO76?keywords=Hydro+Flask+Water+Bottle+-+Stainless+Steel%2C+Reusable%2C+Vacuum+Insulated-+Wide+Mouth+with+Leak+Proof+Flex+Cap&qid=1637941040&qsid=146-6939056-5844667&sr=8-5&sres=B01MSCXO76%2CB083GBK2HY%2CB083GBTPSY%2CB07YXMJZQW%2CB07YXMFPBM%2CB07MZBR1BL%2CB083GBXKCK%2CB01GW2G92W%2CB083GBQ236%2CB083GBLFN7%2CB01GW2H09S%2CB083GBH38N%2CB01ACARNIO%2CB083G9QV62%2CB07YXLYFZF%2CB07MZ6SD6X%2CB01N34YZD8%2CB08B2BD7S3%2CB08WX17BZN%2CB01ACAXD9C&srpt=BOTTLE&linkCode=li3&tag=giftology04-20&linkId=89622dbea2cfa5daaeb79538b7606750&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01MSCXO76&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B01MSCXO76" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        '<a href="https://www.amazon.com/Hydro-Flask-Insulated-Stainless-Pacific/dp/B01MSCXO76?keywords=Hydro+Flask+Water+Bottle+-+Stainless+Steel%2C+Reusable%2C+Vacuum+Insulated-+Wide+Mouth+with+Leak+Proof+Flex+Cap&qid=1637941040&qsid=146-6939056-5844667&sr=8-5&sres=B01MSCXO76%2CB083GBK2HY%2CB083GBTPSY%2CB07YXMJZQW%2CB07YXMFPBM%2CB07MZBR1BL%2CB083GBXKCK%2CB01GW2G92W%2CB083GBQ236%2CB083GBLFN7%2CB01GW2H09S%2CB083GBH38N%2CB01ACARNIO%2CB083G9QV62%2CB07YXLYFZF%2CB07MZ6SD6X%2CB01N34YZD8%2CB08B2BD7S3%2CB08WX17BZN%2CB01ACAXD9C&srpt=BOTTLE&linkCode=li3&tag=giftology04-20&linkId=89622dbea2cfa5daaeb79538b7606750&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01MSCXO76&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B01MSCXO76" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      flavorText:
        'Who do we like this for?\n\nCampers and hikers who want cold, refreshing water, or Anyone who needs to sneak wine into a family reunion.',
      productBasePrice: '33.95',
      gender: 'null',
      indoorOutdoor: 'outdoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'essentials',
      hobbiesInterests: 'camping',
      _id: '61c8e3a223109f7bf514e63b',
      productId: '100004',
      productName: "Mountain Hardwear Men's Stretch Ozonic Jacket",
      category: 'Camping',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/gp/product/B082QX7G1K?ie=UTF8&th=1&psc=1&linkCode=li3&tag=giftology04-20&linkId=cd8016818d93e67e149c2334155563f9&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B082QX7G1K&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B082QX7G1K" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/gp/product/B082QX7G1K?ie=UTF8&th=1&linkCode=sl1&tag=giftologyshop-20&linkId=00836c10ee4f41920c2b6e3e12647a3d&language=en_US&ref_=as_li_ss_tl&psc=1',
      flavorText:
        'Who do we like this for?\n\nAnyone that’s had bad weather mess up a great trip.',
      productBasePrice: '199.99',
      gender: 'null',
      indoorOutdoor: 'outdoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'essentials',
      hobbiesInterests: 'camping',
      _id: '61c8e3a223109f7bf514e63c',
      productId: '100006',
      productName: 'REI Co-op Half Dome SL 2+ Tent with Footprint',
      category: 'Camping',
      website: 'REI',
      htmlTag: '',
      wordpressLink:
        'https://www.rei.com/product/185632/rei-co-op-half-dome-sl-2-tent-with-footprint',
      flavorText:
        'Who do we like this for?\n\nAnyone looking for an all-around, quality tent with a little extra room to sprawl out.',
      productBasePrice: '279',
      gender: 'null',
      indoorOutdoor: 'outdoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 1,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'essentials',
      hobbiesInterests: 'camping',
      _id: '61c8e3a223109f7bf514e63d',
      productId: '100002',
      productName:
        'PETZL, ACTIK CORE Headlamp, 450 Lumens, Rechargeable, with CORE Battery, Black',
      category: 'Camping',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/gp/product/B07T5RLZTX?ie=UTF8&th=1&linkCode=li3&tag=giftology04-20&linkId=0a46d1fa6751f4263fdd00c7d1804588&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07T5RLZTX&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B07T5RLZTX" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/gp/product/B07T5RLZTX?ie=UTF8&linkCode=sl1&tag=giftologyshop-20&linkId=8f456fb9b9579537f8f1e9b7c0f9de10&language=en_US&ref_=as_li_ss_tl&th=1',
      flavorText:
        'Who do we like this for?\n\nAnyone looking for a reliable, hands-free light source, with some excellent features.',
      productBasePrice: '69.95',
      gender: 'null',
      indoorOutdoor: 'outdoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'essentials',
      hobbiesInterests: 'camping',
      _id: '61c8e3a223109f7bf514e63e',
      productId: '100007',
      productName: 'Jetboil Flash Camping',
      category: 'Camping',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/gp/product/B0753NBMJ5?ie=UTF8&th=1&linkCode=li3&tag=giftology04-20&linkId=17187162d7ebf71ca0f74cf777eb5a11&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0753NBMJ5&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B0753NBMJ5" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/gp/product/B0753NBMJ5?ie=UTF8&linkCode=sl1&tag=giftologyshop-20&linkId=b6eeddf6c2f161aaa046642b7beaa44b&language=en_US&ref_=as_li_ss_tl&th=1',
      flavorText:
        'Who do we like this for?\n\nHikers that still need that morning cup of coffee, like, immediately.',
      productBasePrice: '109.95',
      gender: 'null',
      indoorOutdoor: 'outdoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'essentials',
      hobbiesInterests: 'camping',
      _id: '61c8e3a223109f7bf514e63f',
      productId: '100005',
      productName: "Mountain Hardwear Women's Stretch Ozonic Jacket",
      category: 'Camping',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/gp/product/B082QML2Y6?ie=UTF8&th=1&psc=1&linkCode=li3&tag=giftology04-20&linkId=a309252e5b75aa16d179e2d6fae49402&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B082QML2Y6&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B082QML2Y6" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/gp/product/B082QML2Y6?ie=UTF8&th=1&linkCode=sl1&tag=giftologyshop-20&linkId=95564400595012db9ab6c3a9b4c0b733&language=en_US&ref_=as_li_ss_tl&psc=1',
      flavorText:
        'Who do we like this for?\n\nAnyone that’s had bad weather mess up a great trip.',
      productBasePrice: '199.97',
      gender: 'null',
      indoorOutdoor: 'outdoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'creative,science',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'homeChef,technology,gardening',
      _id: '61c8e3a223109f7bf514e640',
      productId: '100009',
      productName:
        'Click and Grow Smart Garden 3 Indoor Herb Garden (Includes Basil Plant Pods), White',
      category: 'Home Chef',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/gp/product/B01MRVMKQH?ie=UTF8&th=1&linkCode=li3&tag=giftology04-20&linkId=f6bd2c1f092f8eeac61db91678a5cdd5&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01MRVMKQH&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B01MRVMKQH" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/gp/product/B01MRVMKQH?ie=UTF8&linkCode=sl1&tag=giftologyshop-20&linkId=39f8eb6b9cc31718c5e2e96ba4d8d4cf&language=en_US&ref_=as_li_ss_tl&th=1',
      flavorText:
        'Who do we like this for?\n\nPeople who desperately need fresh pesto year-round.',
      productBasePrice: '99.95',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 3,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'essentials',
      hobbiesInterests: 'homeChef',
      _id: '61c8e3a223109f7bf514e641',
      productId: '100008',
      productName:
        'Cooking Gift Set Co | Wood Smoked Grill Kit - 8 Piece BBQ Set | Top Grilling Gifts for Dad, Grill Sets for Men, BBQ Gifts for Men',
      category: 'Home Chef',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Cooking-Gift-Set-Smoker-Birthday/dp/B01DVJ66H2?dchild=1&keywords=barbecue+smoker+kit&qid=1625525079&sr=8-9&linkCode=li3&tag=giftology04-20&linkId=3d9fa451516ca8d2c102e1d3441fa42f&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01DVJ66H2&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B01DVJ66H2" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Cooking-Gift-Set-Smoker-Birthday/dp/B01DVJ66H2?dchild=1&keywords=barbecue+smoker+kit&qid=1625525079&sr=8-9&linkCode=sl1&tag=giftologyshop-20&linkId=50b3cdbaddccc78ac3c740cc485ba665&language=en_US&ref_=as_li_ss_tl',
      flavorText:
        'Who do we like this for?\n\nFolks who want to experiment with smoking but have large smoker commitment issues.',
      productBasePrice: '49.99',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 3,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'essentials',
      hobbiesInterests: 'camping',
      _id: '61c8e3a223109f7bf514e642',
      productId: '100003',
      productName: 'PETZL - TIKKINA Headlamp, 150 Lumens, Standard Lighting',
      category: 'Camping',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/PETZL-TIKKINA-Headlamp-Standard-Lighting/dp/B01KYTRHLQ?dchild=1&keywords=Petzl%2BTikkina%2BHeadlamp&qid=1626036560&s=sporting-goods&sr=1-5&th=1&linkCode=li3&tag=giftology04-20&linkId=94fe01760bac4e17a1fdb3e75299a3cd&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01KYTRHLQ&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B01KYTRHLQ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/PETZL-TIKKINA-Headlamp-Standard-Lighting/dp/B01KYTRHLQ?dchild=1&keywords=Petzl%2BTikkina%2BHeadlamp&qid=1626036560&s=sporting-goods&sr=1-5&th=1&linkCode=sl1&tag=giftologyshop-20&linkId=8c570e0d8b3da9654ef3dacbeabf4abe&language=en_US&ref_=as_li_ss_tl',
      flavorText:
        'Who do we like it for?\nCampers who just need a basic headlamp.',
      productBasePrice: '34.97',
      gender: 'null',
      indoorOutdoor: 'outdoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'efficient',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'homeChef,technology',
      _id: '61c8e3a223109f7bf514e643',
      productId: '100010',
      productName:
        'DASH Hot Air Popcorn Popper Maker with Measuring Cup to Portion Popping Corn Kernels + Melt Butter, 16, Aqua',
      category: 'Home Chef',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/gp/product/B07NWCTXHH?ie=UTF8&th=1&linkCode=li3&tag=giftology04-20&linkId=d0ebcc091984b349b328fc65512d377a&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07NWCTXHH&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B07NWCTXHH" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/gp/product/B07NWCTXHH?ie=UTF8&linkCode=sl1&tag=giftologyshop-20&linkId=ca71bcf1a8d6acd22eea1eec6e7ccb38&language=en_US&ref_=as_li_ss_tl',
      flavorText:
        'Who do we like this for?\n\nFolks who would rather stay home with a pause button than visit the cinema, but still crave that delicious popcorn.',
      productBasePrice: '23',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'whiteElephant',
      score: 3,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'essentials',
      hobbiesInterests: 'homeChef',
      _id: '61c8e3a223109f7bf514e644',
      productId: '100011',
      productName:
        'GoWISE USA GW22921-S 8-in-1 Digital Air Fryer with Recipe Book, 5.0-Qt, Black',
      category: 'Home Chef',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/gp/product/B07JP1GFNW?ie=UTF8&th=1&linkCode=li3&tag=giftology04-20&linkId=be63e97d030eb0f4fc75fa53c708f4e4&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07JP1GFNW&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B07JP1GFNW" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/gp/product/B07JP1GFNW?ie=UTF8&th=1&linkCode=sl1&tag=giftologyshop-20&linkId=2c9f26b7df90970ca71f1148d6c581e4&language=en_US&ref_=as_li_ss_tl',
      flavorText:
        'Who do we like this for?\n\nPeople who hate soggy leftovers and home cooks who want to prepare a meal quickly.',
      productBasePrice: '69.99',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 3,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'essentials',
      hobbiesInterests: 'homeChef,mixology',
      _id: '61c8e3a223109f7bf514e645',
      productId: '100012',
      productName:
        'SodaStream Fizzi Sparkling Water Maker (White) with CO2 and BPA free Bottle',
      category: 'Home Chef',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/gp/product/B01HW6P4TQ?ie=UTF8&th=1&linkCode=li3&tag=giftology04-20&linkId=46859dac46904216ad9aea8256f9fa9a&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01HW6P4TQ&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B01HW6P4TQ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/gp/product/B01HW6P4TQ?ie=UTF8&linkCode=sl1&tag=giftologyshop-20&linkId=30eb754a07e74f46ae662f27cbba323d&language=en_US&ref_=as_li_ss_tl',
      flavorText:
        'Who do we like this for?\n\nAnyone looking to spice up their dinner parties, drink healthy, or always forget the mixers.',
      productBasePrice: '86.99',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 3,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'practical',
      giftType: 'essentials',
      hobbiesInterests: 'homeChef',
      _id: '61c8e3a223109f7bf514e646',
      productId: '100013',
      productName: "Victorinox Fibrox Pro Chef's Knife, 8-Inch",
      category: 'Home Chef',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Victorinox-Fibrox-Chefs-Knife-8-Inch/dp/B000638D32?dchild=1&keywords=victorinox+fibrox+pro+chef%27s+knife&qid=1625505383&s=industrial&sr=1-5&linkCode=li3&tag=giftology04-20&linkId=c1543da800fbeb799d64cd20da27cc73&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B000638D32&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B000638D32" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Victorinox-Fibrox-Chefs-Knife-8-Inch/dp/B000638D32?dchild=1&keywords=victorinox+fibrox+pro+chef%27s+knife&qid=1625505383&s=industrial&sr=1-5&linkCode=sl1&tag=giftologyshop-20&linkId=0749b957f5186ebc658d7511b487d2e4&language=en_US&ref_=as_li_ss_tl',
      flavorText:
        'Who do we like this for?\n\nAnyone who loves to cook, and most people who don’t. This is our #1 gift for null home chef.',
      productBasePrice: '54',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '18',
      ageMax: '120',
      occasion: 'null',
      score: 3,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'essentials',
      hobbiesInterests: 'music,technology',
      _id: '61c8e3a223109f7bf514e647',
      productId: '100014',
      productName: 'JBL FLIP 5, Waterproof Portable Bluetooth Speaker',
      category: 'Technology',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/JBL-Waterproof-Portable-Bluetooth-Speaker/dp/B07QK2SPP7?th=1&linkCode=li3&tag=giftology04-20&linkId=bfcdf1881e0982ffd94ea5553983e758&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07QK2SPP7&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B07QK2SPP7" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/JBL-Waterproof-Portable-Bluetooth-Speaker/dp/B07QK2SPP7?th=1&linkCode=sl1&tag=giftologyshop-20&linkId=653808aa96dba7e9eeecefdf450b52e7&language=en_US&ref_=as_li_ss_tl',
      flavorText:
        "Who do we like this for?\n\nFor those who consider music an important part of their daily routine, we recommend the JBL family of portable Bluetooth speakers.'",
      productBasePrice: '129.95',
      gender: 'null',
      indoorOutdoor: 'null',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'essentials',
      hobbiesInterests: 'music,technology',
      _id: '61c8e3a223109f7bf514e648',
      productId: '100015',
      productName: 'JBL CLIP 3 - Waterproof Portable Bluetooth Speaker',
      category: 'Technology',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/JBL-Waterproof-Portable-Bluetooth-Speaker/dp/B07Q6ZWMLR?th=1&linkCode=li3&tag=giftology04-20&linkId=3404bbe862d7a77d6ad7e18e78cd4970&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07Q6ZWMLR&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B07Q6ZWMLR" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/JBL-Waterproof-Portable-Bluetooth-Speaker/dp/B07Q6ZWMLR?linkCode=sl1&tag=giftologyshop-20&linkId=cdff2308edba579a986a2367db08d830&language=en_US&ref_=as_li_ss_tl&th=1',
      flavorText:
        'For those of you who either want a budget-friendly version of the JBL FLIP 5 or an even more portable alternative, we recommend the JBL CLIP 3.',
      productBasePrice: '49.95',
      gender: 'null',
      indoorOutdoor: 'null',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'coffee',
      giftType: 'essentials',
      hobbiesInterests: 'homeChef',
      _id: '61c8e3a223109f7bf514e649',
      productId: '100016',
      productName:
        'Nespresso BEC250BLK Essenza Mini Espresso Machine with Aeroccino Milk Frother by Breville, Piano Black',
      category: 'Home Chef',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Nespresso-Essenza-Original-Espresso-Breville/dp/B073ZHT2FM?crid=2RIMDTXACX4B0&dchild=1&keywords=nespresso%2Bessenza%2Bmini&qid=1613014542&sprefix=nespresso%2Be%2Caps%2C179&sr=8-3&th=1&linkCode=li3&tag=giftology04-20&linkId=3779ea526e6a518859081874cb82a8a0&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B073ZHT2FM&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B073ZHT2FM" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Nespresso-Essenza-Original-Espresso-Breville/dp/B073ZHT2FM?crid=2RIMDTXACX4B0&dchild=1&keywords=nespresso%2Bessenza%2Bmini&qid=1613014542&sprefix=nespresso%2Be%2Caps%2C179&sr=8-3&th=1&linkCode=sl1&tag=giftologyshop-20&linkId=19686603b2d67c4305c4d0b8900ae59d&language=en_US&ref_=as_li_ss_tl',
      flavorText:
        'Who do we like this for?\n\nCoffee connoisseurs who like their espresso just so… and strong!',
      productBasePrice: '219.95',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'practical',
      giftType: 'essentials',
      hobbiesInterests: 'homeChef',
      _id: '61c8e3a223109f7bf514e64a',
      productId: '100017',
      productName:
        'WÜSTHOF CLASSIC IKON 8 Inch Chef’s Knife | Full-Tang Half Bolster 8" Cook’s Knife | Precision Forged High-Carbon Stainless Steel German Made Chef’s Knife – Model ,Black',
      category: 'Home Chef',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Wusthof-4596-7-20-4596-7-20-Knife/dp/B000YMURSE?dchild=1&keywords=wusthof%2Bclassic%2Bikon&qid=1624038319&s=industrial&sr=1-8&th=1&linkCode=li3&tag=giftology04-20&linkId=1aa1667a00985943e2f97fc921a94b56&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B000YMURSE&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B000YMURSE" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Wusthof-4596-7-20-4596-7-20-Knife/dp/B000YMURSE?dchild=1&keywords=wusthof+classic+ikon&qid=1624038319&s=industrial&sr=1-8&linkCode=sl1&tag=giftologyshop-20&linkId=f4a8d863046316447f5e36f8735a2d48&language=en_US&ref_=as_li_ss_tl',
      flavorText:
        'Who do we like this for?\n\nAnyone who loves to cook, and most people who don’t. This is our #1 gift for null home chef.',
      productBasePrice: '180',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '18',
      ageMax: '120',
      occasion: 'null',
      score: 3,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'athletic,competitive',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'null',
      _id: '61c8e3a223109f7bf514e655',
      productId: '100028',
      productName:
        'Spikeball Standard 3 Ball Kit - Game for The Backyard, Beach, Park, Indoors',
      category: 'Outdoor Games',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Spikeball-Ball-Kit-Playing-Drawstring/dp/B002V7A7MQ?crid=UCMQUXTYNYQ2&dchild=1&keywords=spikeball&qid=1631144332&sprefix=spikeball%2Caps%2C195&sr=8-6&th=1&linkCode=li3&tag=giftology04-20&linkId=0074270a97c02fd998e0531e25049473&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B002V7A7MQ&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B002V7A7MQ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Spikeball-Ball-Kit-Playing-Drawstring/dp/B002V7A7MQ?crid=UCMQUXTYNYQ2&dchild=1&keywords=spikeball&qid=1631144332&sprefix=spikeball%2Caps%2C195&sr=8-6&linkCode=sl1&tag=giftologyshop-20&linkId=45b3c7c7e553e154998f5dbe1fc7ef95&language=en_US&ref_=as_li_ss_tl&th=1',
      flavorText:
        'Who do we like this for?\n\nnullbody who loves an active day at the beach, or needs a little extra excitement at a barbecue.',
      productBasePrice: '69.96',
      gender: 'null',
      indoorOutdoor: 'outdoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 1,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'athletic,competitive',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'null',
      _id: '61c8e3a223109f7bf514e656',
      productId: '100029',
      productName:
        'Bottle Bash Standard Outdoor Game Set – New Fun Disc Toss Game for Family Adult & Kid to Play at Backyard Lawn Beach Game - Frisbee Target Yard Game with Poles & Bottles (Beersbee & Polish Horseshoes)',
      category: 'Outdoor Games',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Bottle-Bash-Standard-Surface-Spike/dp/B003HG5LF8?dchild=1&keywords=beer%2Bfrisbee&qid=1616974638&sr=8-4&th=1&linkCode=li3&tag=giftology04-20&linkId=c4fea60211e4da8446b93a4ea5209fd3&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B003HG5LF8&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B003HG5LF8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Bottle-Bash-Standard-Surface-Spike/dp/B003HG5LF8?dchild=1&keywords=beer%2Bfrisbee&qid=1616974638&sr=8-4&linkCode=sl1&tag=giftologyshop-20&linkId=bfa078ef68617b93213d46acc3640df1&language=en_US&ref_=as_li_ss_tl&th=1',
      flavorText:
        'Who do we like this for?\n\nnullbody who loves an active day at the beach, or needs a little extra excitement at a barbecue.',
      productBasePrice: '39.99',
      gender: 'null',
      indoorOutdoor: 'outdoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 1,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'athletic,competitive',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'null',
      _id: '61c8e3a223109f7bf514e657',
      productId: '100030',
      productName:
        'GoSports Backyard Bocce Sets with 8 Balls, Pallino, Case and Measuring Rope - Choose Between Classic Resin, Soft and Light Up LED Sets',
      category: 'Outdoor Games',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/GoSports-Backyard-Pallino-Measuring-Choose/dp/B00T0GYEGG?dchild=1&keywords=bocce%2Bball&qid=1616974675&sr=8-5&th=1&linkCode=li3&tag=giftology04-20&linkId=62ceaccd7e840c3c0c78eec6b33bd76f&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00T0GYEGG&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B00T0GYEGG" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/GoSports-Backyard-Pallino-Measuring-Choose/dp/B00T0GYEGG?dchild=1&keywords=bocce%2Bball&qid=1616974675&sr=8-5&linkCode=sl1&tag=giftologyshop-20&linkId=81e78f62961abde2799636f2670d07bf&language=en_US&ref_=as_li_ss_tl&th=1',
      flavorText:
        'Who do we like this for?\n\nnullbody who loves an active day at the beach, or needs a little extra excitement at a barbecue.',
      productBasePrice: '39.95',
      gender: 'null',
      indoorOutdoor: 'outdoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 1,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'athletic,competitive',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'null',
      _id: '61c8e3a223109f7bf514e658',
      productId: '100031',
      productName:
        'GoSports Classic Cornhole Set – Includes 8 Bean Bags, Travel Case and Game Rules (Choice of style)',
      category: 'Outdoor Games',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/GoSports-Classic-Cornhole-Rustic-Finish/dp/B07TB5LNB2?dchild=1&keywords=cornhole&qid=1616974708&sr=8-2&th=1&linkCode=li3&tag=giftology04-20&linkId=0da4fc92c2efd017d504f8d8cfc97612&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07TB5LNB2&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B07TB5LNB2" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/GoSports-Classic-Cornhole-Rustic-Finish/dp/B07TB5LNB2?dchild=1&keywords=cornhole&qid=1616974708&sr=8-2&linkCode=sl1&tag=giftologyshop-20&linkId=c48020e626d4daab6a3b311e988ee970&language=en_US&ref_=as_li_ss_tl&th=1',
      flavorText:
        'Who do we like this for?\n\nnullbody who loves an active day at the beach, or needs a little extra excitement at a barbecue.',
      productBasePrice: '99.99',
      gender: 'null',
      indoorOutdoor: 'outdoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 1,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'athletic,competitive',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'null',
      _id: '61c8e3a223109f7bf514e659',
      productId: '100032',
      productName:
        'Tiki Toss Golf Ball Deluxe Toss Game - Indoor or Outdoor Family Fun Backyard Games for Kids and Adults',
      category: 'Outdoor Games',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Golf-Ball-Deluxe-Toss-Game/dp/B071FHNF8W?dchild=1&keywords=golf%2Bball%2Btree%2Bgame&qid=1616975116&sr=8-5&th=1&linkCode=li3&tag=giftology04-20&linkId=1d9d4a10009a9a6f01d2d55d50bef961&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B071FHNF8W&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B071FHNF8W" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Golf-Ball-Deluxe-Toss-Game/dp/B071FHNF8W?dchild=1&keywords=golf+ball+tree+game&qid=1616975116&sr=8-5&linkCode=sl1&tag=giftologyshop-20&linkId=ebc06a10e2c6e8db98a79ce9c0395386&language=en_US&ref_=as_li_ss_tl',
      flavorText:
        'Who do we like this for?\n\nnullbody who loves an active day at the beach, or needs a little extra excitement at a barbecue.',
      productBasePrice: '39.95',
      gender: 'null',
      indoorOutdoor: 'outdoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 1,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'athletic,healthNut',
      giftType: 'essentials',
      hobbiesInterests: 'healthAndWellness,technology',
      _id: '61c8e3a223109f7bf514e65a',
      productId: '100033',
      productName:
        'Fitbit Sense Advanced Smartwatch with Tools for Heart Health, Stress Management & Skin Temperature Trends, Carbon/Graphite, One Size (S & L Bands Included)',
      category: 'Health And Wellness',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Fitbit-Advanced-Smartwatch-Management-Temperature/dp/B08DFCWVZ4?dchild=1&keywords=fitbit&qid=1629729932&rdc=1&sr=8-1-spons&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUFBNU5VNEc4U0lFUFUmZW5jcnlwdGVkSWQ9QTAyNDE5MDQyTzVVSTZOWUFXSVM0JmVuY3J5cHRlZEFkSWQ9QTA5MDA4MzJWVTRIWUNSUlhOVkQmd2lkZ2V0TmFtZT1zcF9hdGYmYWN0aW9uPWNsaWNrUmVkaXJlY3QmZG9Ob3RMb2dDbGljaz10cnVl&th=1&linkCode=li3&tag=giftology04-20&linkId=144b3baa925a28f1ef48f2864f6c10f7&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B08DFCWVZ4&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B08DFCWVZ4" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Fitbit-Advanced-Smartwatch-Management-Temperature/dp/B08DFCWVZ4?dchild=1&keywords=fitbit&qid=1629729932&rdc=1&sr=8-1-spons&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUFBNU5VNEc4U0lFUFUmZW5jcnlwdGVkSWQ9QTAyNDE5MDQyTzVVSTZOWUFXSVM0JmVuY3J5cHRlZEFkSWQ9QTA5MDA4MzJWVTRIWUNSUlhOVkQmd2lkZ2V0TmFtZT1zcF9hdGYmYWN0aW9uPWNsaWNrUmVkaXJlY3QmZG9Ob3RMb2dDbGljaz10cnVl&linkCode=sl1&tag=giftologyshop-20&linkId=b47c781e5daf665c6b3e0b32a1dbbfe8&language=en_US&ref_=as_li_ss_tl&th=1',
      flavorText:
        'Who do we like this for?\n\nWhether you’re out and about or remaining cautious, a Fitbit can help you get your physical health back on track.',
      productBasePrice: '297.9',
      gender: 'null',
      indoorOutdoor: 'outdoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 0,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'athletic,healthNut',
      giftType: 'essentials',
      hobbiesInterests: 'healthAndWellness,technology',
      _id: '61c8e3a223109f7bf514e65b',
      productId: '100034',
      productName:
        'Fitbit Charge 4 Fitness and Activity Tracker with Built-in GPS, Heart Rate, Sleep & Swim Tracking',
      category: 'Health And Wellness',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Fitbit-Activity-Tracking-Rosewood-Included/dp/B084CQSL3Q?dchild=1&keywords=fitbit&qid=1629729932&rdc=1&sr=8-5&th=1&linkCode=li3&tag=giftology04-20&linkId=699c18306cc7e35d8b24b761ff46cfb2&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B084CQSL3Q&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B084CQSL3Q" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Fitbit-Activity-Tracking-Rosewood-Included/dp/B084CQSL3Q?dchild=1&keywords=fitbit&qid=1629729932&rdc=1&sr=8-5&linkCode=sl1&tag=giftologyshop-20&linkId=376e460dfef8d445d5e884aec24dce36&language=en_US&ref_=as_li_ss_tl',
      flavorText:
        'Who do we like this for?\n\nWhether you’re out and about or remaining cautious, a Fitbit can help you get your physical health back on track.',
      productBasePrice: '139.95',
      gender: 'null',
      indoorOutdoor: 'outdoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 1,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'nerdy',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'reading',
      _id: '61c8e3a223109f7bf514e65c',
      productId: '100035',
      productName: "The Complete Isaac Asimov's Foundation Series Books 1-7",
      category: 'Reading',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Complete-Asimovs-Foundation-Foundations-Prelude/dp/B01EFDEMS8?crid=3APTFL37XSUH0&dchild=1&keywords=the+foundation+series&qid=1629583939&sprefix=the+foundation+ser%2Caps%2C180&sr=8-2&linkCode=li3&tag=giftology04-20&linkId=edd67eae815793276961d5e13f7dad52&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01EFDEMS8&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B01EFDEMS8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Complete-Asimovs-Foundation-Foundations-Prelude/dp/B01EFDEMS8?crid=3APTFL37XSUH0&dchild=1&keywords=the+foundation+series&qid=1629583939&sprefix=the+foundation+ser,aps,180&sr=8-2&linkCode=sl1&tag=giftologyshop-20&linkId=990a96d9f38999b6df6a2a9312576537&language=en_US&ref_=as_li_ss_tl',
      flavorText:
        'Who do we like this for?\n\nIf they own one of these series, they will love the rest, and if they are just getting started in Sci-Fi they might as well start at the beginning.',
      productBasePrice: '56.93',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'nerdy',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'reading',
      _id: '61c8e3a223109f7bf514e65d',
      productId: '100036',
      productName: "Frank Herbert's Dune Saga Collection: Books 1 - 6",
      category: 'Reading',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Frank-Herberts-Dune-Saga-Collection-ebook/dp/B088QLJGZC?dchild=1&keywords=dune+box+set&qid=1635208554&qsid=146-2465125-7697967&sr=8-1&sres=B07WDM3D5T%2C0593201892%2C1250263352%2C0425052125%2CB001AT61PI%2CB09HRDJC8F%2CB07W9GCT9D%2C0441013597%2C0358653037%2C1419759469%2C0593098269%2C0593201744%2C0008260184%2C1101965487%2C1909306800%2C1473224462&linkCode=li3&tag=giftology04-20&linkId=85d25e73e19dfe30d0aef6b018288ab7&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B088QLJGZC&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B088QLJGZC" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Frank-Herberts-Dune-Saga-Collection-ebook/dp/B088QLJGZC/ref=sr_1_1?dchild=1&keywords=dune+box+set&qid=1635208554&qsid=146-2465125-7697967&sr=8-1&sres=B07WDM3D5T%2C0593201892%2C1250263352%2C0425052125%2CB001AT61PI%2CB09HRDJC8F%2CB07W9GCT9D%2C0441013597%2C0358653037%2C1419759469%2C0593098269%2C0593201744%2C0008260184%2C1101965487%2C1909306800%2C1473224462',
      flavorText:
        'Who do we like this for?\n\nIf they own one of these series, they will love the rest, and if they are just getting started in Sci-Fi they might as well start at the beginning.',
      productBasePrice: '54.99',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'nerdy',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'reading',
      _id: '61c8e3a223109f7bf514e65e',
      productId: '100037',
      productName: 'Ringworld',
      category: 'Reading',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Ringworld-Larry-Niven/dp/0575077026?_encoding=UTF8&qid=1629584007&sr=8-1&linkCode=li3&tag=giftology04-20&linkId=a9805b979b401b66c9558737939c9283&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=0575077026&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=0575077026" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Ringworld-Larry-Niven/dp/0575077026?_encoding=UTF8&qid=1629584007&sr=8-1&linkCode=sl1&tag=giftologyshop-20&linkId=0bd754dd4d3355b7d15945aa0a63ea67&language=en_US&ref_=as_li_ss_tl',
      flavorText:
        'Who do we like this for?\n\nIf they own one of these series, they will love the rest, and if they are just getting started in Sci-Fi they might as well start at the beginning.',
      productBasePrice: '18.15',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'nerdy',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'reading',
      _id: '61c8e3a223109f7bf514e65f',
      productId: '100038',
      productName:
        "The Complete Hitchhiker's Guide to the Galaxy Boxset: Guide to the Galaxy",
      category: 'Reading',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Complete-Hitchhikers-Guide-Galaxy-Boxset/dp/1529044197?crid=37IY4LK7U3Y8N&dchild=1&keywords=hitchikers+guide+to+galaxy&qid=1629584255&sprefix=hitchikers+%2Caps%2C187&sr=8-3&linkCode=li3&tag=giftology04-20&linkId=7461e94908680ec68e52bde8fca674be&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=1529044197&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=1529044197" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Complete-Hitchhikers-Guide-Galaxy-Boxset/dp/1529044197?crid=37IY4LK7U3Y8N&dchild=1&keywords=hitchikers+guide+to+galaxy&qid=1629584255&sprefix=hitchikers+,aps,187&sr=8-3&linkCode=sl1&tag=giftologyshop-20&linkId=63665a00b2ec39fb06ef11119838a760&language=en_US&ref_=as_li_ss_tl',
      flavorText:
        'Who do we like this for?\n\nIf they own one of these series, they will love the rest, and if they are just getting started in Sci-Fi they might as well start at the beginning.',
      productBasePrice: '34.99',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'nerdy',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'reading',
      _id: '61c8e3a223109f7bf514e660',
      productId: '100039',
      productName: 'Hyperion Cantos Book Series (Complete Set)',
      category: 'Reading',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Hyperion-Cantos-Book-Complete-Set/dp/B084ZB7SMP?crid=34PWIFG80ZST6&dchild=1&keywords=the+hyperion+cantos+box+set&qid=1629584302&sprefix=The+Hyperion+C%2Caps%2C185&sr=8-1-fkmr0&linkCode=li3&tag=giftology04-20&linkId=8c0e0d8fa4b50490fc31fbb9b2231bbe&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B084ZB7SMP&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B084ZB7SMP" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Hyperion-Cantos-Book-Complete-Set/dp/B084ZB7SMP?crid=34PWIFG80ZST6&dchild=1&keywords=the+hyperion+cantos+box+set&qid=1629584302&sprefix=The+Hyperion+C,aps,185&sr=8-1-fkmr0&linkCode=sl1&tag=giftologyshop-20&linkId=d16d1ef2820d134dc17be7990f6f77cf&language=en_US&ref_=as_li_ss_tl',
      flavorText:
        'Who do we like this for?\n\nIf they own one of these series, they will love the rest, and if they are just getting started in Sci-Fi they might as well start at the beginning.',
      productBasePrice: '42.99',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'essentials',
      hobbiesInterests: 'reading',
      _id: '61c8e3a223109f7bf514e661',
      productId: '100040',
      productName:
        'All-new Kindle Paperwhite (8 GB) – Now with a 6.8" display and adjustable warm light – Ad-Supported',
      category: 'Reading',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/All-new-Kindle-Paperwhite-adjustable-Ad-Supported/dp/B08KTZ8249?dchild=1&keywords=kindle&qid=1635208726&qsid=146-2465125-7697967&sr=8-4&sres=B07745PV5G%2CB07978J597%2CB08B495319%2CB08KTZ8249%2CB07KR2N2GF%2CB07HSL23CW%2CB075RNKT6G%2CB07746ZX4Y%2CB07FJ91TLB%2CB07NQKJVKR%2CB08WPB8PW9%2CB07L5GDTYY%2CB077448K76%2CB07F81WWKP%2CB07741S7Y8%2CB075QRWPPJ&linkCode=li3&tag=giftology04-20&linkId=9e93fc9a24c85daa5f83f03dcec38e50&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B08KTZ8249&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B08KTZ8249" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/All-new-Kindle-Paperwhite-adjustable-Ad-Supported/dp/B08KTZ8249/ref=sr_1_4?dchild=1&keywords=kindle&qid=1635208726&qsid=146-2465125-7697967&sr=8-4&sres=B07745PV5G%2CB07978J597%2CB08B495319%2CB08KTZ8249%2CB07KR2N2GF%2CB07HSL23CW%2CB075RNKT6G%2CB07746ZX4Y%2CB07FJ91TLB%2CB07NQKJVKR%2CB08WPB8PW9%2CB07L5GDTYY%2CB077448K76%2CB07F81WWKP%2CB07741S7Y8%2CB075QRWPPJ',
      flavorText:
        'Who do we like this for?\n\nFolks who want to give the gift of a few good books – and a convenient way to read them.',
      productBasePrice: '139.99',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'mixology',
      _id: '61c8e3a223109f7bf514e662',
      productId: '100041',
      productName: 'Drizly',
      category: 'Mixology',
      website: 'Drizly',
      htmlTag: '',
      wordpressLink: 'https://drizly.com/',
      flavorText:
        "Who do we like this for?\n\nCan't celebrate in person? Send a nice wine or their favorite scotch. Unsure of their favorite scotch? Try Lagavulin 12, it's pure class.",
      productBasePrice: 'null',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '21',
      ageMax: '120',
      occasion: 'null',
      score: 1,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'reading,mixology',
      _id: '61c8e3a223109f7bf514e663',
      productId: '100042',
      productName: 'The Waldorf Astoria Bar Book',
      category: 'Reading',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/gp/product/0143124803?ie=UTF8&linkCode=li3&tag=giftology04-20&linkId=82a3d3db073db3b9cb0b279f7fcf0e7c&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=0143124803&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=0143124803" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/gp/product/0143124803?ie=UTF8&linkCode=sl1&tag=giftologyshop-20&linkId=1ef1494ad96f447456dcfac02fa9f9d1&language=en_US&ref_=as_li_ss_tl',
      flavorText:
        'Who do we like this for?\n\nReading and sipping a cocktail go hand in hand. So why not gift a mixology book to your friends and family?',
      productBasePrice: '14.99',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '21',
      ageMax: '120',
      occasion: 'null',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'DIY',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'reading,mixology',
      _id: '61c8e3a223109f7bf514e664',
      productId: '100043',
      productName: 'The Fine Art of Mixing Drinks',
      category: 'Reading',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Fine-Art-Mixing-Drinks/dp/1603111646?crid=2JIBF0NQKMM5G&dchild=1&keywords=the+fine+art+of+mixing+drinks&qid=1635209084&qsid=146-2465125-7697967&s=books&sprefix=the+fine+art+of+mixin%2Cstripbooks%2C159&sr=1-1&sres=1603111646%2CB000EUJEAI%2CB000BUZRDO%2C0385096836%2C1680524100%2C0393089037%2C1607748622%2C0811843513%2C0358362024%2C1607745259%2C0525533893%2C145211384X%2C1641528249%2C1614278377%2C0399579311%2C1945644001&srpt=ABIS_BOOK&linkCode=li3&tag=giftology04-20&linkId=c65eeb8ccb14b8a39674de7203ade324&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=1603111646&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=1603111646" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Fine-Art-Mixing-Drinks/dp/1603111646/ref=sr_1_1?crid=2JIBF0NQKMM5G&dchild=1&keywords=the+fine+art+of+mixing+drinks&qid=1635209084&qsid=146-2465125-7697967&s=books&sprefix=the+fine+art+of+mixin%2Cstripbooks%2C159&sr=1-1&sres=1603111646%2CB000EUJEAI%2CB000BUZRDO%2C0385096836%2C1680524100%2C0393089037%2C1607748622%2C0811843513%2C0358362024%2C1607745259%2C0525533893%2C145211384X%2C1641528249%2C1614278377%2C0399579311%2C1945644001&srpt=ABIS_BOOK',
      flavorText:
        'Who do we like this for?\n\nReading and sipping a cocktail go hand in hand. So why not gift a mixology book to your friends and family?',
      productBasePrice: '39.95',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '21',
      ageMax: '120',
      occasion: 'null',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'DIY',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'reading,mixology',
      _id: '61c8e3a223109f7bf514e665',
      productId: '100044',
      productName: 'The Tender Bar: A Memoir',
      category: 'Reading',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/gp/product/0786888768?ie=UTF8&linkCode=li3&tag=giftology04-20&linkId=a5bb973fd6a1efe4e71b057b837fb82d&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=0786888768&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=0786888768" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/gp/product/0786888768?ie=UTF8&linkCode=sl1&tag=giftologyshop-20&linkId=93c0ce6fd13965fa153c0c6cf3c5ca2b&language=en_US&ref_=as_li_ss_tl',
      flavorText:
        'Who do we like this for?\n\nReading and sipping a cocktail go hand in hand. So why not gift a mixology book to your friends and family?',
      productBasePrice: '13.39',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '21',
      ageMax: '120',
      occasion: 'null',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'essentials',
      hobbiesInterests: 'mixology',
      _id: '61c8e3a223109f7bf514e666',
      productId: '100045',
      productName:
        'Moscow Mule Copper Mugs - Set of 2 - 100% HANDCRAFTED - Food Safe Pure Solid Copper Mugs - 16 oz Gift Set with BONUS - Highest Quality Cocktail Copper Straws, Straw Cleaning Brush and Jigger!',
      category: 'Mixology',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/gp/product/B01LW30I5S?ie=UTF8&linkCode=li3&tag=giftology04-20&linkId=70b29d1bc637fa1d9ac51845b331281b&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01LW30I5S&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B01LW30I5S" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/gp/product/B01LW30I5S?ie=UTF8&linkCode=sl1&tag=giftologyshop-20&linkId=e381aaaca828aa488f6054e53620a76a&language=en_US&ref_=as_li_ss_tl',
      flavorText:
        'Who do we like this for?\n\nAnyone that eats, and drinks, with their eyes.',
      productBasePrice: '19.97',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '21',
      ageMax: '120',
      occasion: 'null',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'classy',
      giftType: 'essentials',
      hobbiesInterests: 'mixology',
      _id: '61c8e3a223109f7bf514e667',
      productId: '100046',
      productName:
        'Godinger Bar Set – A Gift That Says I’m Classy And You Are Too',
      category: 'Mixology',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Piece-Hammered-Finish-Steel-Godinger/dp/B000CRC6LC?hvadid=193129986239&hvpos=&hvnetw=g&hvrand=5832730225501502743&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9021716&hvtargid=pla-311501460881&psc=1&linkCode=li3&tag=giftology04-20&linkId=88d34c7c57deb36f395137145485fab7&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B000CRC6LC&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B000CRC6LC" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Piece-Hammered-Finish-Steel-Godinger/dp/B000CRC6LC?hvadid=193129986239&hvpos=&hvnetw=g&hvrand=5832730225501502743&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9021716&hvtargid=pla-311501460881&psc=1&linkCode=sl1&tag=giftologyshop-20&linkId=1e93523deac447152f5afe200e85e7eb&language=en_US&ref_=as_li_ss_tl',
      flavorText:
        'Who do we like this for?\n\nHome entertainers who want to show off their bartending skills or Anyone who wants drinks at home – done right.',
      productBasePrice: '44',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '21',
      ageMax: '120',
      occasion: 'null',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'gaming',
      _id: '61c8e3a223109f7bf514e668',
      productId: '100047',
      productName: 'Animal Crossing: New Horizons - Nintendo Switch',
      category: 'Gaming',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/gp/product/B07SL6ZXBL?ie=UTF8&linkCode=li3&tag=giftology04-20&linkId=95c4ea5d2ccc6455ac4d8db7a9815d86&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07SL6ZXBL&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B07SL6ZXBL" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/gp/product/B07SL6ZXBL/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=tizziewebsite-20&creative=9325&linkCode=as2&creativeASIN=B07SL6ZXBL&linkId=9362b504069a88794fb20bd69f22c8cb',
      flavorText: 'null',
      productBasePrice: '49.99',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'gaming',
      _id: '61c8e3a223109f7bf514e669',
      productId: '100048',
      productName: 'The Legend of Zelda: Breath of the Wild (Nintendo Switch)',
      category: 'Gaming',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Legend-Zelda-Breath-Wild-switch-Nintendo/dp/B01N1083WZ?crid=1ZMYWXG65Z0D1&dchild=1&keywords=nintendo+switch+zelda+breath+of+the+wild&qid=1612741811&s=videogames&sprefix=nintendo+switch+zeld%2Cvideogames%2C177&sr=1-1&linkCode=li3&tag=giftology04-20&linkId=89e1a4392a38bf22685cabd68511bb63&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01N1083WZ&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B01N1083WZ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Legend-Zelda-Breath-Wild-switch-Nintendo/dp/B01N1083WZ/ref=sr_1_1?crid=1ZMYWXG65Z0D1&dchild=1&keywords=nintendo+switch+zelda+breath+of+the+wild&qid=1612741811&s=videogames&sprefix=nintendo+switch+zeld%2Cvideogames%2C177&sr=1-1',
      flavorText: 'null',
      productBasePrice: '58',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'essentials',
      hobbiesInterests: 'gaming',
      _id: '61c8e3a223109f7bf514e66a',
      productId: '100049',
      productName: 'Nintendo Switch Joy-Con Wheel Accessory Pair',
      category: 'Gaming',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/gp/product/B01N7RIIR2?ie=UTF8&linkCode=li3&tag=giftology04-20&linkId=a16ed79dba3b4e83a6e3e196ab50a09a&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01N7RIIR2&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B01N7RIIR2" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/gp/product/B01N7RIIR2/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=tizziewebsite-20&creative=9325&linkCode=as2&creativeASIN=B01N7RIIR2&linkId=acdc0c6896aab9e5c09b8a7be88b148c',
      flavorText: 'null',
      productBasePrice: '26.99',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'essentials',
      hobbiesInterests: 'gaming',
      _id: '61c8e3a223109f7bf514e66b',
      productId: '100050',
      productName:
        'amFilm Tempered Glass Screen Protector for Nintendo Switch 2017 (2-Pack)',
      category: 'Gaming',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/gp/product/B01N3ASPNV?ie=UTF8&psc=1&linkCode=li3&tag=giftology04-20&linkId=45dd8886f8bcdd71fd78033a11d29ef3&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01N3ASPNV&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B01N3ASPNV" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/gp/product/B01N3ASPNV/ref=ppx_yo_dt_b_asin_title_o03_s00?ie=UTF8&psc=1',
      flavorText: 'null',
      productBasePrice: '7.59',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'essentials',
      hobbiesInterests: 'gaming',
      _id: '61c8e3a223109f7bf514e66c',
      productId: '100051',
      productName: 'Nintendo Switch with Neon Blue and Neon Red Joy‑Con',
      category: 'Gaming',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/gp/product/B07VGRJDFY?ie=UTF8&th=1&linkCode=li3&tag=giftology04-20&linkId=8419a246887ec4413bf0b2c747ee5604&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07VGRJDFY&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B07VGRJDFY" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/gp/product/B07VGRJDFY/ref=as_li_qf_asin_il_tl?ie=UTF8&tag=tizziewebsite-20&creative=9325&linkCode=as2&creativeASIN=B07VGRJDFY&linkId=4f05e45c7126e0c0f91d9dc91c8c0b78',
      flavorText: 'null',
      productBasePrice: '299.99',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'null',
      score: 1,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'homeChef,technology',
      _id: '61c8e3a223109f7bf514e66d',
      productId: '100052',
      productName: 'Mini-pancake Maker',
      category: 'Home Chef',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/DMS001AQ-Electric-Individual-Breakfast-Indicator/dp/B0169N1YMO?crid=35TS9EX95FO7C&keywords=mini%2Bpancakes%2Bmaker&qid=1636514961&qsid=145-7991310-5477726&sprefix=mini%2Bpancka%2Caps%2C226&sr=8-4&sres=B081W936XD%2CB0169N1YMO%2CB08SKL2V8W%2CB08FBHN5H7%2CB00HEXQGFE%2CB07H4ZJ4K9%2CB08HLYD57N%2CB07L4XW3QG%2CB093KV94L5%2CB09B9VK256%2CB091BBW9DK%2CB07CG3T1H6%2CB08JYHM26R%2CB0922TWSHK%2CB096KGW39G%2CB09GK2Z259&srpt=COUNTERTOP_GRIDDLE_APPLIANCE&th=1&linkCode=li3&tag=giftology04-20&linkId=f4e255ac48558540559f307d91cf9395&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0169N1YMO&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B0169N1YMO" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/DMS001AQ-Electric-Individual-Breakfast-Indicator/dp/B0169N1YMO/ref=sr_1_4?crid=35TS9EX95FO7C&keywords=mini+pancakes+maker&qid=1636514961&qsid=145-7991310-5477726&sprefix=mini+pancka%2Caps%2C226&sr=8-4&sres=B081W936XD%2CB0169N1YMO%2CB08SKL2V8W%2CB08FBHN5H7%2CB00HEXQGFE%2CB07H4ZJ4K9%2CB08HLYD57N%2CB07L4XW3QG%2CB093KV94L5%2CB09B9VK256%2CB091BBW9DK%2CB07CG3T1H6%2CB08JYHM26R%2CB0922TWSHK%2CB096KGW39G%2CB09GK2Z259&srpt=COUNTERTOP_GRIDDLE_APPLIANCE',
      flavorText: 'null',
      productBasePrice: '12.99',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'whiteElephant',
      score: 3,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'homeChef,technology',
      _id: '61c8e3a223109f7bf514e66e',
      productId: '100053',
      productName: 'Mini-Waffle Maker',
      category: 'Home Chef',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/DMW100GP-Machine-Individual-Paninis-Browns/dp/B08BCQZF9N?keywords=mini%2Bwaffle%2Bmaker&qid=1636516372&qsid=145-7991310-5477726&s=home-garden&sr=1-5&sres=B07WNXSB3D%2CB08FBHN5H7%2CB08BCQZF9N%2CB01MSVSU1O%2CB08P3RQ86F%2CB097YCJK94%2CB00QHUT7MO%2CB092R489HX%2CB09HFCWDW4%2CB07X1V64ZQ%2CB07L4XW3QG%2CB00ESDVSTC%2CB00006JKZN%2CB07C632MTG%2CB01AVWGBG8%2CB08HRNZV32%2CB07T8XF5Q2%2CB08L85RD6G%2CB08ZMP692F%2CB000BQO7ZM&srpt=COUNTERTOP_GRIDDLE_APPLIANCE&th=1&linkCode=li3&tag=giftology04-20&linkId=f51bf8fce8dcf9bc1c559548f52fa7a1&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B08BCQZF9N&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B08BCQZF9N" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/DMW100GP-Machine-Individual-Paninis-Browns/dp/B08BCQZF9N/ref=sr_1_5?keywords=mini+waffle+maker&qid=1636516372&qsid=145-7991310-5477726&s=home-garden&sr=1-5&sres=B07WNXSB3D%2CB08FBHN5H7%2CB08BCQZF9N%2CB01MSVSU1O%2CB08P3RQ86F%2CB097YCJK94%2CB00QHUT7MO%2CB092R489HX%2CB09HFCWDW4%2CB07X1V64ZQ%2CB07L4XW3QG%2CB00ESDVSTC%2CB00006JKZN%2CB07C632MTG%2CB01AVWGBG8%2CB08HRNZV32%2CB07T8XF5Q2%2CB08L85RD6G%2CB08ZMP692F%2CB000BQO7ZM&srpt=COUNTERTOP_GRIDDLE_APPLIANCE',
      flavorText: 'null',
      productBasePrice: '17.99',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'whiteElephant',
      score: 3,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'quirky',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'homeChef',
      _id: '61c8e3a223109f7bf514e66f',
      productId: '100054',
      productName: 'Nana Hats',
      category: 'Home Chef',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Preserver-Bananas-Fresher-BPA-Free-Silicone/dp/B08Z3QZ664?keywords=nana%2Bhats&qid=1636515282&qsid=145-7991310-5477726&sr=8-2&sres=B08QMY9CR5%2CB085KVLKPL%2CB07SXJ4T2L%2CB08YCYL2J5%2CB07VJYYZ32%2CB093BVZBQV%2CB01MRYUN1W%2CB08SY84NSY%2CB084YRKVLS%2CB07XD74LLG%2CB08BKXH7PF%2CB097D27BJ7%2CB08113SKDM%2CB00O1473C4%2CB07VFF9VNF%2CB0831FVQK1%2CB08L78J5N8%2CB081121FYN%2CB07QGFHLBR%2CB0153W5216&th=1&linkCode=li3&tag=giftology04-20&linkId=75f78b8be22fedb81d52c3163217b9cc&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B08Z3QZ664&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B08Z3QZ664" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Preserver-Bananas-Fresher-BPA-Free-Silicone/dp/B08Z3QZ664/ref=sr_1_2?keywords=nana%2Bhats&qid=1636515282&qsid=145-7991310-5477726&sr=8-2&sres=B08QMY9CR5%2CB085KVLKPL%2CB07SXJ4T2L%2CB08YCYL2J5%2CB07VJYYZ32%2CB093BVZBQV%2CB01MRYUN1W%2CB08SY84NSY%2CB084YRKVLS%2CB07XD74LLG%2CB08BKXH7PF%2CB097D27BJ7%2CB08113SKDM%2CB00O1473C4%2CB07VFF9VNF%2CB0831FVQK1%2CB08L78J5N8%2CB081121FYN%2CB07QGFHLBR%2CB0153W5216&th=1',
      flavorText: 'null',
      productBasePrice: '12.99',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'whiteElephant',
      score: 3,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'homeChef, reading',
      _id: '61c8e3a223109f7bf514e670',
      productId: '100055',
      productName: 'From Crook to Cook',
      category: 'Home Chef',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Crook-Cook-Platinum-Recipes-Kitchen/dp/1452179611?crid=UBDIXXTBZ59D&keywords=snoop+dogg+cookbook&qid=1636515351&qsid=145-7991310-5477726&sprefix=snoop+%2Caps%2C225&sr=8-2&sres=1452179611%2C1954220006%2CB08JZWNGJQ%2C9185639702%2C1786270897%2C1368071066%2C1984826859%2CB08NDVHYVB%2C1507214510%2C161765860X%2C1335522522%2C1641523107%2C1638788014%2C1612438725%2C1683838440%2C1641521198&srpt=ABIS_BOOK&linkCode=li3&tag=giftology04-20&linkId=782566c9934aebc229e8efd05ea9a3c8&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=1452179611&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=1452179611" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Crook-Cook-Platinum-Recipes-Kitchen/dp/1452179611/ref=sr_1_2?crid=UBDIXXTBZ59D&keywords=snoop+dogg+cookbook&qid=1636515351&qsid=145-7991310-5477726&sprefix=snoop+%2Caps%2C225&sr=8-2&sres=1452179611%2C1954220006%2CB08JZWNGJQ%2C9185639702%2C1786270897%2C1368071066%2C1984826859%2CB08NDVHYVB%2C1507214510%2C161765860X%2C1335522522%2C1641523107%2C1638788014%2C1612438725%2C1683838440%2C1641521198&srpt=ABIS_BOOK',
      flavorText: 'null',
      productBasePrice: '12.74',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'whiteElephant',
      score: 3,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'homeChef,technology',
      _id: '61c8e3a223109f7bf514e671',
      productId: '100056',
      productName: 'Breakfast Sandwich Maker',
      category: 'Home Chef',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Hamilton-Beach-25475A-Breakfast-Sandwich/dp/B00EI7DPOO?crid=2RVDD7UA0O176&keywords=breakfast%2Bsandwich%2Bmaker&qid=1636515912&qsid=145-7991310-5477726&sprefix=breakfast%2Bsa%2Caps%2C229&sr=8-4&sres=B00N3L2DMG%2CB00EI7DPOO%2CB00C95O3HK%2CB0799V41GS%2CB087RHSLG6%2CB0833QL921%2CB08PWVH7J3%2CB07D7DTFM5%2CB09DFC2DZT%2CB07SRKPQ9Z%2CB08B28SGFH%2CB097ZMMQPK%2CB089B5VJ2J%2CB08W1VPTCN%2CB08ZSF1729%2CB092QN38TN&srpt=COUNTERTOP_GRIDDLE_APPLIANCE&th=1&linkCode=li3&tag=giftology04-20&linkId=920f09e97ec3c58a20dada23f178e90a&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00EI7DPOO&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B00EI7DPOO" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Hamilton-Beach-25475A-Breakfast-Sandwich/dp/B00EI7DPOO/ref=sr_1_4?crid=2RVDD7UA0O176&keywords=breakfast+sandwich+maker&qid=1636515912&qsid=145-7991310-5477726&sprefix=breakfast+sa%2Caps%2C229&sr=8-4&sres=B00N3L2DMG%2CB00EI7DPOO%2CB00C95O3HK%2CB0799V41GS%2CB087RHSLG6%2CB0833QL921%2CB08PWVH7J3%2CB07D7DTFM5%2CB09DFC2DZT%2CB07SRKPQ9Z%2CB08B28SGFH%2CB097ZMMQPK%2CB089B5VJ2J%2CB08W1VPTCN%2CB08ZSF1729%2CB092QN38TN&srpt=COUNTERTOP_GRIDDLE_APPLIANCE',
      flavorText: 'null',
      productBasePrice: '29.99',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'whiteElephant',
      score: 3,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'gaming',
      _id: '61c8e3a223109f7bf514e672',
      productId: '100057',
      productName: 'Monoply Deal',
      category: 'Gaming',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Hasbro-B0965-Monopoly-Deal-Card/dp/B00NQQTZCO?keywords=monopoly+deal&qid=1636516052&qsid=145-7991310-5477726&sr=8-1&sres=B00NQQTZCO%2CB07H5HFTWC%2CB07MBKDPF2%2CB092541K72%2CB07L9DZ5DV%2CB07F8JBWZR%2CB08GR812RV%2CB08HJN16XC%2CB08GV4QL2V%2CB08GXCD8BN%2CB01MU9K3XU%2CB07VVLQ5LS%2CB06XYLL66Y%2CB01ALHAMTK%2CB07K968Q1C%2CB00EDBY7X8%2CB0771YL7DZ%2CB08TPD82SC%2CB08WM26LZB%2CB07TS96J7Q&srpt=TABLETOP_GAME&linkCode=li3&tag=giftology04-20&linkId=e74be8586fdacdf16543fce519feed14&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00NQQTZCO&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B00NQQTZCO" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Hasbro-B0965-Monopoly-Deal-Card/dp/B00NQQTZCO/ref=sr_1_1?keywords=monopoly+deal&qid=1636516052&qsid=145-7991310-5477726&sr=8-1&sres=B00NQQTZCO%2CB07H5HFTWC%2CB07MBKDPF2%2CB092541K72%2CB07L9DZ5DV%2CB07F8JBWZR%2CB08GR812RV%2CB08HJN16XC%2CB08GV4QL2V%2CB08GXCD8BN%2CB01MU9K3XU%2CB07VVLQ5LS%2CB06XYLL66Y%2CB01ALHAMTK%2CB07K968Q1C%2CB00EDBY7X8%2CB0771YL7DZ%2CB08TPD82SC%2CB08WM26LZB%2CB07TS96J7Q&srpt=TABLETOP_GAME',
      flavorText: 'null',
      productBasePrice: '5.99',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'whiteElephant',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'homeChef',
      _id: '61c8e3a223109f7bf514e673',
      productId: '100058',
      productName:
        'The Unemployed Philosophers Guild Heat Changing Constellation Mug',
      category: 'Home Chef',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Unemployed-Philosophers-Guild-Changing-Constellation/dp/B00B7LUVZK?keywords=constellation+mug&qid=1636516407&qsid=145-7991310-5477726&s=home-garden&sr=1-4&sres=B00B7LUVZK%2CB07GVCP5W2%2CB07BVQKXVF%2CB08LKT4LKR%2CB084B73Q76%2CB08N61W3CW%2CB08DFT69TD%2CB097968BWB%2CB0823S9CNK%2CB07RB1NJRZ%2CB07QZLJ2HW%2CB07F2QCR2K%2CB09793XK6X%2CB089KNLF2T%2CB093TLVQZ9%2CB07R7QQRZN%2CB07R8VM5GP%2CB07DY9QKJC%2CB07WHQQTSZ%2CB07L1BB986&srpt=DRINKING_CUP&linkCode=li3&tag=giftology04-20&linkId=f4702af484f88b89c9dacd8139b9cc06&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00B7LUVZK&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B00B7LUVZK" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Unemployed-Philosophers-Guild-Changing-Constellation/dp/B00B7LUVZK/ref=sr_1_4?keywords=constellation+mug&qid=1636516407&qsid=145-7991310-5477726&s=home-garden&sr=1-4&sres=B00B7LUVZK%2CB07GVCP5W2%2CB07BVQKXVF%2CB08LKT4LKR%2CB084B73Q76%2CB08N61W3CW%2CB08DFT69TD%2CB097968BWB%2CB0823S9CNK%2CB07RB1NJRZ%2CB07QZLJ2HW%2CB07F2QCR2K%2CB09793XK6X%2CB089KNLF2T%2CB093TLVQZ9%2CB07R7QQRZN%2CB07R8VM5GP%2CB07DY9QKJC%2CB07WHQQTSZ%2CB07L1BB986&srpt=DRINKING_CUP',
      flavorText: 'null',
      productBasePrice: '16.95',
      gender: 'null',
      indoorOutdoor: 'indoor',
      ageMin: '12',
      ageMax: '120',
      occasion: 'whiteElephant',
      score: 3,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'competitive',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'boardGames',
      _id: '61c8e3a223109f7bf514e674',
      productId: '100059',
      productName: 'Mini Chess Board',
      category: 'Board Games',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Folding-Magnetic-Pieces-Travel-Family/dp/B0926XS1KJ?keywords=mini%2Bboard%2Bgames&qid=1636923127&s=toys-and-games&sr=1-27&th=1&linkCode=li3&tag=giftology04-20&linkId=e1b26bb200df12fcffb8b9ad31e15459&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0926XS1KJ&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B0926XS1KJ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Folding-Magnetic-Pieces-Travel-Family/dp/B0926XS1KJ/ref=sr_1_27?keywords=mini%2Bboard%2Bgames&qid=1636923127&s=toys-and-games&sr=1-27&th=1',
      flavorText: 'null',
      productBasePrice: '12.99',
      gender: 'null',
      indoorOutdoor: 'null',
      ageMin: '12',
      ageMax: '120',
      occasion: 'whiteElephant',
      score: 1,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'boardGames',
      _id: '61c8e3a223109f7bf514e675',
      productId: '100060',
      productName: 'The New York Times Big Book of Mini Crosswords',
      category: 'Board Games',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/dp/1250309875?ascsubtag=%5Bartid%7C2164.g.34212065%5Bsrc%7C%5Bch%7C%5Blt%7Csale&linkCode=li3&tag=giftology04-20&linkId=93ec363b99cb3b7c3dd5f30d0b55c07c&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=1250309875&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=1250309875" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/dp/1250309875?linkCode=ogi&tag=pioneerwoman-auto-append-20&ascsubtag=artid|2164.g.34212065src|ch|lt|sale',
      flavorText: 'null',
      productBasePrice: '15.89',
      gender: 'null',
      indoorOutdoor: 'null',
      ageMin: '12',
      ageMax: '120',
      occasion: 'whiteElephant',
      score: 1,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'mixology',
      _id: '61c8e3a223109f7bf514e676',
      productId: '100061',
      productName: 'Mixology Dice® (pouch)',
      category: 'Mixology',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/dp/B016AU1M0K?ascsubtag=%5Bartid%7C2164.g.34212065%5Bsrc%7C%5Bch%7C%5Blt%7C&linkCode=li3&tag=giftology04-20&linkId=27b9df9f19dbc295717f5da2a2ce423b&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B016AU1M0K&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B016AU1M0K" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/dp/B016AU1M0K?linkCode=ogi&tag=pioneerwoman-auto-append-20&ascsubtag=artid|2164.g.34212065src|ch|lt|',
      flavorText: 'null',
      productBasePrice: '24',
      gender: 'null',
      indoorOutdoor: 'null',
      ageMin: '21',
      ageMax: '120',
      occasion: 'whiteElephant',
      score: 1,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'essentials',
      hobbiesInterests: 'technology',
      _id: '61c8e3a223109f7bf514e677',
      productId: '100062',
      productName: 'Echo Dot (3rd Gen) - Smart speaker with Alexa',
      category: 'Technology',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Echo-Dot/dp/B07FZ8S74R?keywords=alexa+mini&qid=1636922296&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUExTjdRNVMzMjZNV0JZJmVuY3J5cHRlZElkPUEwNDU1MTAzQk5LOUZRUFJORFUmZW5jcnlwdGVkQWRJZD1BMDI2NDA4OTFZMlRUOThUU0dETVcmd2lkZ2V0TmFtZT1zcF9hdGYmYWN0aW9uPWNsaWNrUmVkaXJlY3QmZG9Ob3RMb2dDbGljaz10cnVl&linkCode=li3&tag=giftology04-20&linkId=b6cc64056a20480c0ca62b390f4873a7&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07FZ8S74R&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B07FZ8S74R" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Echo-Dot/dp/B07FZ8S74R/ref=sr_1_1_sspa?keywords=alexa+mini&qid=1636922296&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUExTjdRNVMzMjZNV0JZJmVuY3J5cHRlZElkPUEwNDU1MTAzQk5LOUZRUFJORFUmZW5jcnlwdGVkQWRJZD1BMDI2NDA4OTFZMlRUOThUU0dETVcmd2lkZ2V0TmFtZT1zcF9hdGYmYWN0aW9uPWNsaWNrUmVkaXJlY3QmZG9Ob3RMb2dDbGljaz10cnVl',
      flavorText: 'null',
      productBasePrice: '24.99',
      gender: 'null',
      indoorOutdoor: 'null',
      ageMin: '12',
      ageMax: '120',
      occasion: 'whiteElephant',
      score: 1,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'boardGames',
      _id: '61c8e3a223109f7bf514e678',
      productId: '100063',
      productName:
        'Cavallini Papers & Co. National Parks 1,000 Piece Puzzle, Multi',
      category: 'Board Games',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Cavallini-Papers-Co-National-Puzzle/dp/1635447208?keywords=national+parks+puzzle&qid=1636922411&sr=8-6&linkCode=li3&tag=giftology04-20&linkId=850df1c234d46c1a55db948c6e21f259&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=1635447208&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=1635447208" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Cavallini-Papers-Co-National-Puzzle/dp/1635447208/ref=sr_1_6?keywords=national+parks+puzzle&qid=1636922411&sr=8-6',
      flavorText: 'null',
      productBasePrice: '28.99',
      gender: 'null',
      indoorOutdoor: 'null',
      ageMin: '12',
      ageMax: '120',
      occasion: 'whiteElephant',
      score: 1,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'coffee',
      giftType: 'essentials',
      hobbiesInterests: 'homeChef',
      _id: '61c8e3a223109f7bf514e679',
      productId: '100064',
      productName: 'Pour Over Coffee Maker with Permanent Filter',
      category: 'Home Chef',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Bodum-Coffee-Maker-Permanent-Filter/dp/B01JLY1HSE?keywords=pour%2Bover%2Bcoffee%2Bmaker&qid=1636922671&sr=8-1&th=1&linkCode=li3&tag=giftology04-20&linkId=693cd4c56512429d1af5f02c045b96b3&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01JLY1HSE&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B01JLY1HSE" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Bodum-Coffee-Maker-Permanent-Filter/dp/B01JLY1HSE/ref=sr_1_1?keywords=pour+over+coffee+maker&qid=1636922671&sr=8-1',
      flavorText: 'null',
      productBasePrice: '19.99',
      gender: 'null',
      indoorOutdoor: 'null',
      ageMin: '12',
      ageMax: '120',
      occasion: 'whiteElephant',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'technology',
      _id: '61c8e3a223109f7bf514e67a',
      productId: '100065',
      productName: 'Tile Mate',
      category: 'Technology',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Tile-RE-19001-Mate-1-Pack/dp/B07W9BBCTB?crid=2ONCG5UD8UJJP&keywords=tiles%2Btracker&qid=1636922788&sprefix=tile%2Caps%2C197&sr=8-3&th=1&linkCode=li3&tag=giftology04-20&linkId=d2cab82f18a6c3edd668718865f5b6f5&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07W9BBCTB&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B07W9BBCTB" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Tile-RE-19001-Mate-1-Pack/dp/B07W9BBCTB/ref=sr_1_3?crid=2ONCG5UD8UJJP&keywords=tiles%2Btracker&qid=1636922788&sprefix=tile%2Caps%2C197&sr=8-3&th=1',
      flavorText: 'null',
      productBasePrice: '24.99',
      gender: 'null',
      indoorOutdoor: 'null',
      ageMin: '12',
      ageMax: '120',
      occasion: 'whiteElephant',
      score: 1,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'coffee',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'homeChef',
      _id: '61c8e3a223109f7bf514e67b',
      productId: '100066',
      productName: 'Holiday Coffee Mug',
      category: 'Home Chef',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/dp/B082DJNKKB?ascsubtag=%5Bartid%7C2164.g.34212065%5Bsrc%7C%5Bch%7C%5Blt%7C&th=1&linkCode=li3&tag=giftology04-20&linkId=19b7807d4720296a6264529b19278873&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B082DJNKKB&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B082DJNKKB" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/dp/B082DJNKKB?linkCode=ogi&tag=pioneerwoman-auto-append-20&ascsubtag=%5Bartid%7C2164.g.34212065%5Bsrc%7C%5Bch%7C%5Blt%7C&th=1',
      flavorText: 'null',
      productBasePrice: '16.99',
      gender: 'null',
      indoorOutdoor: 'null',
      ageMin: '12',
      ageMax: '120',
      occasion: 'whiteElephant',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'homeChef',
      _id: '61c8e3a223109f7bf514e67c',
      productId: '100067',
      productName: 'Queen Majesty Hot Sauce Trinity Sampler',
      category: 'Home Chef',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/Queen-Majesty-Hot-Sauce-Trinity/dp/B075QPBX3B?keywords=queen+majesty+hot+sauce&qid=1636922928&sr=8-1-spons&psc=1&smid=A1VAOWZNDCV6C6&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEyUEk5TjhOUlRBV1A4JmVuY3J5cHRlZElkPUEwMTAxMzU4MzhTOFIzWEtBRFRBQyZlbmNyeXB0ZWRBZElkPUEwMDk4NjE2M0kxQU1JUElGR05WNiZ3aWRnZXROYW1lPXNwX2F0ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU%3D&linkCode=li3&tag=giftology04-20&linkId=4a439c320cc390eae96e9a527c3ae2cc&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B075QPBX3B&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B075QPBX3B" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/Queen-Majesty-Hot-Sauce-Trinity/dp/B075QPBX3B/ref=sr_1_1_sspa?keywords=queen+majesty+hot+sauce&qid=1636922928&sr=8-1-spons&psc=1&smid=A1VAOWZNDCV6C6&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEyUEk5TjhOUlRBV1A4JmVuY3J5cHRlZElkPUEwMTAxMzU4MzhTOFIzWEtBRFRBQyZlbmNyeXB0ZWRBZElkPUEwMDk4NjE2M0kxQU1JUElGR05WNiZ3aWRnZXROYW1lPXNwX2F0ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU=',
      flavorText: 'null',
      productBasePrice: '19.95',
      gender: 'null',
      indoorOutdoor: 'null',
      ageMin: '12',
      ageMax: '120',
      occasion: 'whiteElephant',
      score: 2,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'sentimental',
      hobbiesInterests: 'petsDog',
      _id: '61c8e3a223109f7bf514e67d',
      productId: '100068',
      productName: 'dog mom GIFT, pet owner gift, dog owner gift',
      category: 'Pets - Dog',
      website: 'Etsy',
      htmlTag: '',
      wordpressLink:
        'https://www.etsy.com/listing/752451543/dog-mom-gift-pet-owner-gift-dog-owner?utm_custom1=thepioneerwoman.com&source=aw&utm_source=affiliate_window&utm_medium=affiliate&utm_campaign=us_location_buyer&utm_content=78888&awc=6220_1636919427_e32c9ef2a39a8408bfae7466e7979d3e&utm_term=0',
      flavorText: 'null',
      productBasePrice: '12',
      gender: 'female',
      indoorOutdoor: 'null',
      ageMin: '12',
      ageMax: '120',
      occasion: 'whiteElephant',
      score: 1,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'petsDog',
      _id: '61c8e3a223109f7bf514e67e',
      productId: '100069',
      productName:
        "PetSafe Busy Buddy Twist 'n Treat, Treat Dispensing Dog Toy",
      category: 'Pets - Dog',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/gp/product/B008JCHGLW?smid=ATVPDKIKX0DER&th=1&linkCode=li3&tag=giftology04-20&linkId=e05e79d2002e186662a84cd49f3d862a&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B008JCHGLW&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B008JCHGLW" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/gp/product/B008JCHGLW/ref=ox_sc_act_title_1?smid=ATVPDKIKX0DER&th=1',
      flavorText: 'null',
      productBasePrice: '9.95',
      gender: 'null',
      indoorOutdoor: 'null',
      ageMin: '12',
      ageMax: '120',
      occasion: 'whiteElephant',
      score: 1,
    },
    {
      occasion: {
        Type: [],
      },
      tags: '',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'petsDog',
      _id: '61c8e3a223109f7bf514e67f',
      productId: '100070',
      productName:
        'UEETEK Dog Treat Dispenser Ball, Interactive Tumbler Design',
      category: 'Pets - Dog',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/gp/product/B07C5QKXJG?ie=UTF8&psc=1&linkCode=li3&tag=giftology04-20&linkId=9a362dc30fea31a08d8ec5e353fd8b49&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07C5QKXJG&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B07C5QKXJG" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/gp/product/B07C5QKXJG/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1',
      flavorText: 'null',
      productBasePrice: '13.9',
      gender: 'null',
      indoorOutdoor: 'null',
      ageMin: '12',
      ageMax: '120',
      occasion: 'whiteElephant',
      score: 1,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'quirky',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'null',
      _id: '61c8e3a223109f7bf514e680',
      productId: '100071',
      productName: 'Sushi Socks Box',
      category: 'Just for Fun',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/dp/B0776XCN86?ascsubtag=AwEAAAAAAAAAAdy9&linkCode=li3&tag=giftology04-20&linkId=bab25309dd72492adc3a7fd3db9d6959&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0776XCN86&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B0776XCN86" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/dp/B0776XCN86/?tag=thewire06-20&linkCode=xm2&ascsubtag=AwEAAAAAAAAAAdy9',
      flavorText: 'null',
      productBasePrice: '19.99',
      gender: 'null',
      indoorOutdoor: 'null',
      ageMin: '12',
      ageMax: '120',
      occasion: 'whiteElephant',
      score: 1,
    },
    {
      occasion: {
        Type: [],
      },
      tags: 'quirky',
      giftType: 'interestingAndFun',
      hobbiesInterests: 'null',
      _id: '61c8e3a223109f7bf514e681',
      productId: '100072',
      productName:
        "Jeasona Women's Fun Socks Cute Cat Animals Funny Funky Novelty Cotton Gifts",
      category: 'Just for Fun',
      website: 'Amazon',
      htmlTag:
        '<a href="https://www.amazon.com/dp/B075P7R3VN?ascsubtag=AwEAAAAAAAAAAeQM&linkCode=li3&tag=giftology04-20&linkId=cae0dc1b7b43145207cc2d5d6bf049c2&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B075P7R3VN&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B075P7R3VN" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
      wordpressLink:
        'https://www.amazon.com/dp/B075P7R3VN/?tag=thewire06-20&linkCode=xm2&ascsubtag=AwEAAAAAAAAAAeQM',
      flavorText: 'null',
      productBasePrice: '18.99',
      gender: 'null',
      indoorOutdoor: 'null',
      ageMin: '12',
      ageMax: '120',
      occasion: 'whiteElephant',
      score: 1,
    },
  ],
};
// const dataImg = `<a href="https://www.amazon.com/Hydro-Flask-Insulated-Stainless-Pacific/dp/B01MSCXO76?keywords=Hydro+Flask+Water+Bottle+-+Stainless+Steel%2C+Reusable%2C+Vacuum+Insulated-+Wide+Mouth+with+Leak+Proof+Flex+Cap&qid=1637941040&qsid=146-6939056-5844667&sr=8-5&sres=B01MSCXO76%2CB083GBK2HY%2CB083GBTPSY%2CB07YXMJZQW%2CB07YXMFPBM%2CB07MZBR1BL%2CB083GBXKCK%2CB01GW2G92W%2CB083GBQ236%2CB083GBLFN7%2CB01GW2H09S%2CB083GBH38N%2CB01ACARNIO%2CB083G9QV62%2CB07YXLYFZF%2CB07MZ6SD6X%2CB01N34YZD8%2CB08B2BD7S3%2CB08WX17BZN%2CB01ACAXD9C&srpt=BOTTLE&linkCode=li3&tag=giftology04-20&linkId=89622dbea2cfa5daaeb79538b7606750&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01MSCXO76&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B01MSCXO76" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />`;

export default function WelcomePage() {
  return (
    <div className="welcome-page page">
      {/* <CategoryImage src="/images/default-profile.png" /> */}

      <Hero>
        <HeroImage src="/images/backgroundImage.jpeg" />
        <HeroText>
          <HeroTitle>Having Trouble Finding The Right Gift?</HeroTitle>
          <HeroDescription>
            Check out our quiz and we’ll do the searching for you. All you need
            to know is who you’re shopping for and what they do for fun. We’ll
            handle the rest.
          </HeroDescription>
          <HeroCallToAction as={Link} to="/quiz">
            Take The Quiz
          </HeroCallToAction>
        </HeroText>
      </Hero>
      {/* <Container>
          <Title size="1">Welcome to Giftology!</Title>
          <Button
            onClick={() => history.push("/quiz")}
            label="Click to Access Quiz"
          />
        </Container> */}
      {/* <Card product={data.products[0]} /> */}
      <ProductResult data={data} />
    </div>
  );
}
