import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { CreateQuestion } from './views/CreateQuestion'
import { Login } from './views/Login'
import { QuizName } from './views/QuizName'
import { HomePage } from './views/HomePage'

function App() {

	const router = createBrowserRouter([
		{
		  path:'/',
		  element: <HomePage/>
		},
		{
		  path:'/CreateQuestion',
		  element: <CreateQuestion/>
		},
		{
		  path:'/LogIn',
		  element: <Login/>
		},
		{
		  path:'/QuizName',
		  element: <QuizName/>
		}
	  ])

	return (
		<div className='App'>
      		<RouterProvider  router = { router }/>
    	</div>
	)
}

export default App