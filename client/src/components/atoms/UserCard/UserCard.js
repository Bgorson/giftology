import { CardContainer,CardHeader,Arrow,CardContainerEffective, FancyButton,CardContentContainer, MassButtons,ButtonContainer } from "./styled"
import arrowCurly from '../../../arrowCurly.png'
import ReactGA from "react-ga4";


const options =[
    'Pricier','Cheaper','Better suggestions','Mix it up!', 'More hobbies','More thoughtful','More customizable', 'More occassions'
]

const UserCard= ({type}) => {
    if (type==='info'){
        return (
            <CardContainer>  
                <CardContentContainer>
            <CardHeader>
                Click the Info button to learn more about products!
            </CardHeader>
            <Arrow src = {arrowCurly} alt = "arrowCurly" />
            <FancyButton>Info</FancyButton>
            </CardContentContainer>          
            
            </CardContainer>
                )
    }
    if (type==='checkEffective'){
        return (
            <CardContainer>  
                <CardContainerEffective>
            <CardHeader>
Am I missing the mark? What can I do better?
            </CardHeader>
            <ButtonContainer>

            {options.map((option) => (
                <MassButtons
                onClick={() => 
                    ReactGA.event({
                        category: "User Feedback Card Clicked",
                        action: option,
                        label: option,
                        value: option,
                      })
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