import styles from "styled-components";

export const Container = styles.div`
background:rgba(0, 0, 0, 0.05);
padding:3em 0;

`;
export const InnerContainer = styles.div`
margin:auto;
display:flex;
flex-direction:column;
width:90%;


`;
export const Title = styles.h3`
padding-bottom:1em;
`;
export const CategoryContainer = styles.div`
display:grid;
grid-template-columns: repeat(3, 1fr);
gap:20px;
@media (max-width: 768px) {
    display:flex;
    flex-direction:column;
     }
`;
export const Image = styles.img`
width:355px;
height:355px;

object-fit:cover;

`;

export const HeaderText = styles.h4`
font-size:20px;
margin:24px 0 8px 24px;

`;
export const Description = styles.p`
margin:0 0 24px 24px;

font-size:12px;
`;
export const Tile = styles.div`
margin:auto;
background:white;
display:flex;
flex-direction:column;
cursor:pointer;


`;
export const TileText = styles.div`
`;
