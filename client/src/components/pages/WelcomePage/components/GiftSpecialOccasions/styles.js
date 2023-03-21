import styles, { css } from "styled-components";

export const Container = styles.div`
display:flex;
flex-direction:column;
width:70%;
margin:auto;
gap:16px;
@media (max-width: 768px) {
  width:95%;
     }
`;
export const HeaderText = styles.h3`
align-self:center;
`;
export const StepsContainer = styles.div`
display:flex;
align-items:center;
gap:24px;
border:1px solid lightgrey;
border-radius:8px;
padding-left:24px;
justify-content:space-between;

`;
export const Icon = styles.img`
width: 72px;
height:72px;
${(props) =>
  props.size === "small" &&
  css`
    width: 20px;
    height: 20px;
    padding-right: 48px;
  `}}
`;
export const StepText = styles.p``;
export const StepDescription = styles.p``;
export const StepHeader = styles.h4`
font-size:16px;
`;
export const CreateAccountButton = styles.button`
font-size: 16px;
cursor: pointer;
color: black;
background-color: white;
padding: 16px 24px;
border-radius: 1.5em;
border-color:grey;
text-transform: uppercase;
&:hover {
  background-color: black;
    color: white;

}
`;
export const TakeQuizButton = styles.button`
font-size: 16px;
cursor: pointer;
color: black;
background-color: white;
padding: 16px 24px;
border-radius: 1.5em;
text-transform: uppercase;
&:hover {
  background-color: black;
    color: white;

}
`;
export const StepContent = styles.div`
padding:16px;
`;

export const StepMainContent = styles.div`
display:flex;
align-items:center;
`;
export const ButtonContainer = styles.div`
padding-top:32px;
width:100%;
display:flex;
justify-content:center;
gap:24px;
`;
