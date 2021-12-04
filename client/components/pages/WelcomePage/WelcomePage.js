import React from "react";

import Section from "react-bulma-companion/lib/Section";
import Container from "react-bulma-companion/lib/Container";
import Title from "react-bulma-companion/lib/Title";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

import Button from "../../atoms/Button";
import ProductResult from "../../organisms/ProductResult/ProductResult";
import {
  Hero,
  HeroCallToAction,
  HeroDescription,
  HeroTitle,
  HeroImage,
  HeroText,
} from "./styles";

const data = {
  categoryScores: [
    {
      name: "Camping",
      score: 2,
    },
    {
      name: "Home Chef",
      score: 0,
    },
    {
      name: "Technology",
      score: 1,
    },
  ],
  products: [
    {
      hobbiesInterests: "camping",
      _id: "6199b4e3c855b94d731cf4b6",
      productId: "",
      productName:
        "PETZL, ACTIK CORE Headlamp, 450 Lumens, Rechargeable, with CORE Battery, Black",
      category: "Camping",
      website: "Amazon",
      htmlTag: `<a href="https://www.amazon.com/gp/product/B01LW30I5S?ie=UTF8&linkCode=li3&tag=giftology04-20&linkId=70b29d1bc637fa1d9ac51845b331281b&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01LW30I5S&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B01LW30I5S" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />`,
      flavorText:
        "Who do we like this for?\n\nnullone looking for a reliable, hands-free light source, with some excellent features.",
      productBasePrice: "69.95",
      gender: "null",
      indoorOutdoor: "outdoor",
      ageMin: "12",
      ageMax: "120",
      occasion: "null",
      practicalWhimsical: "null",
      score: 2,
    },
    {
      hobbiesInterests: "camping",
      _id: "6199b4e3c855b94d731cf4b7",
      productId: "",
      productName: "Mountain Hardwear Men's Stretch Ozonic Jacket",
      category: "Camping",
      website: "Amazon",
      htmlTag: `<a href="https://www.amazon.com/gp/product/B01LW30I5S?ie=UTF8&linkCode=li3&tag=giftology04-20&linkId=70b29d1bc637fa1d9ac51845b331281b&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01LW30I5S&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B01LW30I5S" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />`,
      flavorText:
        "Who do we like this for?\n\nnullone that’s had bad weather mess up a great trip.",
      productBasePrice: "199.99",
      gender: "null",
      indoorOutdoor: "outdoor",
      ageMin: "12",
      ageMax: "120",
      occasion: "null",
      practicalWhimsical: "null",
      score: 2,
    },
    {
      hobbiesInterests: "music,technology",
      _id: "6199b4e3c855b94d731cf4b8",
      productId: "",
      productName: "JBL CLIP 3 - Waterproof Portable Bluetooth Speaker",
      category: "Technology",
      website: "Amazon",
      htmlTag: `<a href="https://www.amazon.com/gp/product/B01LW30I5S?ie=UTF8&linkCode=li3&tag=giftology04-20&linkId=70b29d1bc637fa1d9ac51845b331281b&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01LW30I5S&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B01LW30I5S" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />`,
      flavorText:
        "For those of you who either want a budget-friendly version of the JBL FLIP 5 or an even more portable alternative, we recommend the JBL CLIP 3.",
      productBasePrice: "49.95",
      gender: "null",
      indoorOutdoor: "null",
      ageMin: "12",
      ageMax: "120",
      occasion: "null",
      practicalWhimsical: "null",
      score: 0,
    },
    {
      hobbiesInterests: "music,technology",
      _id: "6199b4e3c855b94d731cf4b9",
      productId: "",
      productName: "JBL FLIP 5, Waterproof Portable Bluetooth Speaker",
      category: "Technology",
      website: "Amazon",
      htmlTag: `<a href="https://www.amazon.com/gp/product/B01LW30I5S?ie=UTF8&linkCode=li3&tag=giftology04-20&linkId=70b29d1bc637fa1d9ac51845b331281b&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01LW30I5S&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B01LW30I5S" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />`,
      flavorText:
        "Who do we like this for?\n\nFor those who consider music an important part of their daily routine, we recommend the JBL family of portable Bluetooth speakers.'",
      productBasePrice: "129.95",
      gender: "null",
      indoorOutdoor: "null",
      ageMin: "12",
      ageMax: "120",
      occasion: "null",
      practicalWhimsical: "null",
      score: 0,
    },
    {
      hobbiesInterests: "homeChef",
      _id: "6199b4e3c855b94d731cf4ba",
      productId: "",
      productName:
        "Nespresso BEC250BLK Essenza Mini Espresso Machine with Aeroccino Milk Frother by Breville, Piano Black",
      category: "Home Chef",
      website: "Amazon",
      htmlTag: `<a href="https://www.amazon.com/gp/product/B01LW30I5S?ie=UTF8&linkCode=li3&tag=giftology04-20&linkId=70b29d1bc637fa1d9ac51845b331281b&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01LW30I5S&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B01LW30I5S" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />`,
      flavorText:
        "Who do we like this for?\n\nCoffee connoisseurs who like their espresso just so… and strong!",
      productBasePrice: "219.95",
      gender: "null",
      indoorOutdoor: "indoor",
      ageMin: "12",
      ageMax: "120",
      occasion: "null",
      practicalWhimsical: "null",
      score: 0,
    },
    {
      hobbiesInterests: "homeChef",
      _id: "6199b4e3c855b94d731cf4bb",
      productId: "",
      productName:
        'WÜSTHOF CLASSIC IKON 8 Inch Chef’s Knife | Full-Tang Half Bolster 8" Cook’s Knife | Precision Forged High-Carbon Stainless Steel German Made Chef’s Knife – Model ,Black',
      category: "Home Chef",
      website: "Amazon",
      htmlTag: `<a href="https://www.amazon.com/gp/product/B01LW30I5S?ie=UTF8&linkCode=li3&tag=giftology04-20&linkId=70b29d1bc637fa1d9ac51845b331281b&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01LW30I5S&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B01LW30I5S" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />`,
      flavorText:
        "Who do we like this for?\n\nnullone who loves to cook, and most people who don’t. This is our #1 gift for null home chef.",
      productBasePrice: "180",
      gender: "null",
      indoorOutdoor: "indoor",
      ageMin: "18",
      ageMax: "120",
      occasion: "null",
      practicalWhimsical: "null",
      score: 0,
    },
    {
      hobbiesInterests: "camping",
      _id: "6199b4e3c855b94d731cf4be",
      productId: "",
      productName: "PETZL - TIKKINA Headlamp, 150 Lumens, Standard Lighting",
      category: "Camping",
      website: "Amazon",
      htmlTag: `<a href="https://www.amazon.com/gp/product/B01LW30I5S?ie=UTF8&linkCode=li3&tag=giftology04-20&linkId=70b29d1bc637fa1d9ac51845b331281b&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01LW30I5S&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B01LW30I5S" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />`,
      flavorText:
        "Who do we like it for?\nCampers who just need a basic headlamp.",
      productBasePrice: "34.97",
      gender: "null",
      indoorOutdoor: "outdoor",
      ageMin: "12",
      ageMax: "120",
      occasion: "null",
      practicalWhimsical: "null",
      score: 2,
    },
    {
      hobbiesInterests: "camping",
      _id: "6199b4e3c855b94d731cf4be",
      productId: "",
      productName: "PETZL - TIKKINA Headlamp, 150 Lumens, Standard Lighting",
      category: "Camping",
      website: "Amazon",
      htmlTag: `<a href="https://www.amazon.com/gp/product/B01LW30I5S?ie=UTF8&linkCode=li3&tag=giftology04-20&linkId=70b29d1bc637fa1d9ac51845b331281b&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01LW30I5S&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B01LW30I5S" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />`,
      flavorText:
        "Who do we like it for?\nCampers who just need a basic headlamp.",
      productBasePrice: "34.97",
      gender: "null",
      indoorOutdoor: "outdoor",
      ageMin: "12",
      ageMax: "120",
      occasion: "null",
      practicalWhimsical: "null",
      score: 2,
    },
    {
      hobbiesInterests: "camping",
      _id: "6199b4e3c855b94d731cf4be",
      productId: "",
      productName: "PETZL - TIKKINA Headlamp, 150 Lumens, Standard Lighting",
      category: "Camping",
      website: "Amazon",
      htmlTag: `<a href="https://www.amazon.com/gp/product/B01LW30I5S?ie=UTF8&linkCode=li3&tag=giftology04-20&linkId=70b29d1bc637fa1d9ac51845b331281b&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01LW30I5S&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B01LW30I5S" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />`,
      flavorText:
        "Who do we like it for?\nCampers who just need a basic headlamp.",
      productBasePrice: "34.97",
      gender: "null",
      indoorOutdoor: "outdoor",
      ageMin: "12",
      ageMax: "120",
      occasion: "null",
      practicalWhimsical: "null",
      score: 2,
    },
  ],
};

// const dataImg = `<a href="https://www.amazon.com/Hydro-Flask-Insulated-Stainless-Pacific/dp/B01MSCXO76?keywords=Hydro+Flask+Water+Bottle+-+Stainless+Steel%2C+Reusable%2C+Vacuum+Insulated-+Wide+Mouth+with+Leak+Proof+Flex+Cap&qid=1637941040&qsid=146-6939056-5844667&sr=8-5&sres=B01MSCXO76%2CB083GBK2HY%2CB083GBTPSY%2CB07YXMJZQW%2CB07YXMFPBM%2CB07MZBR1BL%2CB083GBXKCK%2CB01GW2G92W%2CB083GBQ236%2CB083GBLFN7%2CB01GW2H09S%2CB083GBH38N%2CB01ACARNIO%2CB083G9QV62%2CB07YXLYFZF%2CB07MZ6SD6X%2CB01N34YZD8%2CB08B2BD7S3%2CB08WX17BZN%2CB01ACAXD9C&srpt=BOTTLE&linkCode=li3&tag=giftology04-20&linkId=89622dbea2cfa5daaeb79538b7606750&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01MSCXO76&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology04-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology04-20&language=en_US&l=li3&o=1&a=B01MSCXO76" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />`;

export default function WelcomePage() {
  return (
    <div className="welcome-page page">
      {/* <CategoryImage src="/images/default-profile.png" /> */}

      <Hero>
        <HeroImage
          src="/images/backgroundImage.jpeg"
        />
        <HeroText>
          <HeroTitle>Having Trouble Finding the right gift?</HeroTitle>
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
      {/* <ProductResult data={data} /> */}
    </div>
  );
}
