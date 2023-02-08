import styles from "styled-components";

export const Container = styles.div`
margin-top:80px;
height: 296px;
background:  linear-gradient(90deg, #0B8AFD 0%, #C576FF 100%);
display: flex;
align-items: center;
justify-content: center;
gap: 80px;

`;
export const GiftInformation = styles.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
max-width: 285px;
`;
export const Icon = styles.img`
width:56px;
height:56px;
color:white;

`;
export const GiftText = styles.p`
color:white;
font-size: 20px;
font-family:Roboto;
font-weight: 400;
text-align: center;
`;
