import { CardContainer,CardHeader,Arrow,CardContainerEffective, FancyButton,CardContentContainer, MassButtons,ButtonContainer } from "./styled"
import arrowCurly from '../../../arrowCurly.png'
import ReactGA from "react-ga4";
import { useState } from "react";

const options =[
    'Pricier','Cheaper','Better suggestions','Mix it up!', 'More hobbies','More thoughtful','More customizable', 'More occassions'
]

const UserCard= ({type}) => {
    const [isHidden, setIsHidden] = useState(false);
    const [isRemoved, setIsRemoved]= useState(false);
    const handleFancyButtonClick = () => {
        setIsHidden(true);
    
        // Add a delay to ensure the animation completes before removing the card
        setTimeout(() => {
            setIsRemoved(true)  
                    // You can remove the card or perform any other action you need here
          // For example, you can call a callback function to remove the card from the parent component.
        }, 500); // Adjust the delay as needed to match the CSS transition duration
      };
    if (isRemoved) {
        return null;
        }
    if (type==='info'){
        return (
            <CardContainer isHidden={isHidden}>  
                <CardContentContainer>
            <CardHeader>
                Click the Info button to learn more about products!
            </CardHeader>
            <Arrow src = {arrowCurly} alt = "arrowCurly" />
            <FancyButton onClick={handleFancyButtonClick}>Info</FancyButton>
            </CardContentContainer>          
            
            </CardContainer>
                )
    }
    if (type==='checkEffective'){
        return (
            <CardContainer isHidden={isHidden}>  
                <CardContainerEffective>
            <CardHeader>
Am I missing the mark? What can I do better?
            </CardHeader>
            <ButtonContainer>

            {options.map((option) => (
                <MassButtons
                onClick={() => {
                    ReactGA.event({
                        category: "User Feedback Card Clicked",
                        action: option,
                        label: option,
                        value: option,
                      });
                      handleFancyButtonClick()
                    }
                }
                >{option}</MassButtons>
            ))}
            </ButtonContainer>

          

            </CardContainerEffective>          
            
            </CardContainer>
                
        )
    }


}
export default UserCard