import { useState } from 'react'
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";


interface CreateQuiz {
    success: boolean;
    token?: string;
    quizId?: string;
  }

  
  export function QuizName() {

    const navigate = useNavigate()
      
    const location = useLocation();
    const token = location.state.token;
    console.log(token);
    

    const [quizName,setQuizName] = useState<string>('')
    const [message,setMessage] = useState<string>('')



    const createQuiz = async () => {

		const url = 'https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz'
		const settings = {
			method: 'POST',
      headers: {
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({
				name: quizName,
			})
		}
		const response = await fetch(url, settings)    
		const data: CreateQuiz = await response.json()
		console.log('createQuiz: ', data);

        if (data.success) {
            setMessage("Quiz Name Confirmed!")
        } else{
            setMessage("Couldn't create quiz. Make sure you are logged in.")
        }
	}
    

    return(
        <div>
            <h4>Type in the name of your quiz</h4>
            <h2>{message}</h2>
            <input type="text" placeholder="Quiz Name" value={quizName} onChange={event => setQuizName(event.target.value)} />
            <button onClick={createQuiz}> Confirm quiz name </button>
            <h4>Click here to add question and answer</h4>
            <button onClick={() => navigate("/CreateQuestion", { state: { token, quizName } })}> Create Quiz </button>
        </div>
    )
}