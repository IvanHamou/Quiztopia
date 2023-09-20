import { useState } from 'react'
import { useNavigate } from "react-router-dom";

interface ApiSignupResponse {
	success: boolean;
	message?: string;
}
interface ApiLoginResponse {
	success: boolean;
	message?: string;
	token?: string;
}


export function Login() {

    const navigate = useNavigate()


    const [username, setUsername] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [token, setToken] = useState<string>('')
	const [message, setMessage] = useState<string>('')

    const handleCreateUser = async () => {
		const url = 'https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/signup'
		const settings = {
			method: 'POST',
			body: JSON.stringify({
				username: username,
				password: password
			})
		}
		const response = await fetch(url, settings)
		const data: ApiSignupResponse = await response.json()
		console.log('handleCreateUser: ', data);
		
		if( data.success ) {
			setMessage('Användaren skapades.')
		} else {
			setMessage('Kunde inte skapa användare.')
		}
	}
  
	const handleLogin = async () => {
    const url = 'https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/login'
		const settings = {
			method: 'POST',
			body: JSON.stringify({
        username: username,
				password: password
			})
		}
		const response = await fetch(url, settings)
		const data: ApiLoginResponse = await response.json()
		console.log('handleLogin: ', data);
		if( data.success ) {
      setMessage('Du är inloggad!')
			if( data.token ) setToken(data.token)
      
      console.log(token);
		} else {
			setMessage('Kunde inte logga in.')
		}
    
	}
    

    return(
        <section>
            <h1>{message}</h1>
            <article>
                <input type="text" placeholder="Användarnamn" value={username} onChange={event => setUsername(event.target.value)} />
				<input type="text" placeholder="Lösenord" value={password} onChange={event => setPassword(event.target.value)} />
            </article>

            <button onClick={handleCreateUser}> Skapa användare </button>
			<button onClick={handleLogin}> Logga in </button>
            <button onClick={() => navigate("/QuizName", { state: { token } })}>Create Question</button>
        </section>
    )
}