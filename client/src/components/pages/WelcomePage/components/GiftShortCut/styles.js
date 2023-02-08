import styles from "styled-components";

export const Header = styles.h2`
margin-bottom: 32px;
`;

export const CallToActionContainer = styles.div`

`;

export const ShortCutCollection = styles.div`
display: flex;
justify-content: space-between;
gap:20px;
@media (max-width: 768px) {
 flex-direction: column;
  }
`;
export const ShortCut = styles.button`
font-size: 12px;
cursor: pointer;
color: black;
background-color: white;
padding: 16px 24px;
text-transform: uppercase;
border:1px solid grey;
width:285px;
&:hover {
  color: white;
  background-color: black;
}
`;
export const Container = styles.div`
height: 250px;
display: flex;
align-items: center;
justify-content: center;
flex-direction: column;
@media (max-width: 768px) {
  height:100%;
  }
`;
