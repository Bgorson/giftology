import styles, { css } from "styled-components";

export const Container = styles.div`
max-width: 380px;
border: 1px solid #e5e5e5;
border-radius: 20px;
text-align: center;
display: flex;
flex-direction: column;
justify-content: space-between;
text-align: center;
position: ;

`;
export const ImageWrapper = styles.div`
position: relative;

`;
export const Image = styles.img`
cursor: pointer;
border-radius: 20px 20px 0 0;
height: 380px;
max-width: 380x;
width:100%;

object-fit: cover;


`;
export const UpdateProfileContainer = styles.div`
cursor: pointer;

z-index: 100;
position: absolute;
display:none;
top: 50%; 
right: 35%;



`;
export const UpdateProfileImage = styles.img`
width:24px;
height:24px;
`;
export const UpdateProfileText = styles.p``;
export const NameText = styles.p`
font-size: 24px;
margin-bottom:12px;
`;
export const InterestsText = styles.p`
font-size: 16px;
width: 80%;
margin: auto;
`;
export const ImportantDateText = styles.div``;
export const Type = styles.p``;
export const Date = styles.p``;
export const TextLink = styles.div`
display:flex;
align-items:center;
gap:8px;
cursor: pointer;
padding:12px 0;
`;
export const ActionsContainer = styles.div`
display: flex;
justify-content: space-around;
`;
export const ViewWishListButton = styles.button`
background-color:black;
color:white;
width:100%;
padding:24px;
border-radius:0 0 20px 20px;
text-transform:uppercase;
font-size:12px;
cursor:pointer;
:hover{
    background-color:white;
    color:black;
}
${(props) =>
  props.disabled &&
  css`
    background-color: grey;
    cursor: not-allowed;
  `}
`;
export const Icon = styles.img`
width: 13px;
height: 16px;
`;
export const NextArrow = styles.button`
position: absolute;
top: 40%;
right: -7%;
transform: translateY(-50%);
background-color: transparent;
border: none;
cursor: pointer;
rotate: 90deg;
@media(max-width: 768px){
    display:none;
}

`;
export const PreviousArrow = styles.button`
position: absolute;
top: 40%;
left: -7%;
transform: translateY(-50%);
background-color: transparent;
border: none;
cursor: pointer;
rotate: -90deg;
@media(max-width: 768px){
  display:none;
}


`;
