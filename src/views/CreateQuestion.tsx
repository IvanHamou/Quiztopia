import { useState} from 'react'
import { useLocation,useNavigate } from "react-router-dom";

interface CreateQuestion {
    success: boolean;
    message?: string;
    quizId?: string;
  }

export function CreateQuestion() {

    const navigate = useNavigate()
    const location = useLocation()
    const token = location.state.token
    const quizName = location.state.quizName
    
    const [message, setMessage] = useState<string>('')
	const [question,setQuestion] = useState<string>('')
	const [answer,setAnswer] = useState<string>('')
    const [lat, setLat] = useState<number>(0)
	const [lng, setLng] = useState<number>(0)

    const createQuestions = async () => {
        const url = 'https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/question'
        const settings = {
          method:"POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: quizName,
            question: question,
            answer: answer,
            location: {
              longitude: lng,
              latitude: lat
            }
          })
          
        }
    
        const response = await fetch(url, settings)
        console.log(settings);
        const data: CreateQuestion = await response.json()
        console.log('createQuestion: ', data);

        if (data.success) {
            setMessage("Quiz Successfully created!")
        } else{
            setMessage("Couldn't create quiz.")
        }
    }


    return(
        <div>
            <section>
                <h3>Type Question</h3>
                <input type="text" value={question} onChange={event => setQuestion(event.target.value)}/>
                <h3>Type Answer</h3>
                <input type="text" value={answer} onChange={event => setAnswer(event.target.value)}/>
                <h3>Type Longitude</h3>
                <input type="text" value={lat} onChange={event => setLat(Number(event.target.value))}/>
                <h3>Type Latitude</h3>
                <input type="text" value={lng} onChange={event => setLng(Number(event.target.value))}/>
            </section>
            <button onClick={ createQuestions }>Confirm quiz</button>
            <h2>{message}</h2>
            <button onClick={() => navigate("/")}> Back to Home Page</button>
        </div>
    )
}