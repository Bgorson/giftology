import styles from "styled-components";

export const Container = styles.div`
height:312px;
background: linear-gradient(90deg, #0B8AFD 0%, #C576FF 100%);
width:70%;
margin:96px auto 0 auto;
border-radius: 1em;
display:flex;
flex-direction:column;
justify-content:center;
align-items:center;
padding-top:64px;
@media (max-width: 768px) {
    width:95%;
    height:100%;

       }
`;
export const Header = styles.h3`
font-size:32px;
color:white;
width:40%;
text-align:center;
@media (max-width: 768px) {
    width:80%;
  
         }
`;
export const Description = styles.p`
color:white;
text-align:center;
width:40%;
margin-bottom:32px;
@media (max-width: 768px) {
    width:80%;
  
         }

`;
export const InputContainer = styles.div`
display:flex;
width:100%;
justify-content:center;
gap:16px;
padding-bottom:72px;
@media (max-width: 768px) {
   flex-direction:column;
   align-items:center;

       }
`;
export const InputField = styles.input`
color:white;
padding-left:8px;
width:220px;
background: rgba(255, 255, 255, 0.3);
border-radius: 8px;
border:none;
::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: white;
}

:-ms-input-placeholder { /* Internet Explorer 10-11 */
color: white;

}
@media (max-width: 768px) {
   padding:16px;
 
        }


`;
export const SubmitButton = styles.button`
font-size: 12px;
cursor: pointer;
color: black;
background-color: white;
padding: 16px 24px;
border-radius: 1em;
text-transform: uppercase;
&:hover {
  color: #44a2bb;
  background-color: black;
}
&:disabled {
  color: #44a2bb;
  background-color: black;
  cursor: not-allowed;
}
`;
