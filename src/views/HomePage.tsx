import { useState, useRef, useEffect } from 'react'
import mapboxgl, { Map as MapGl, accessToken } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from "react-router-dom";

interface Position {
	latitude: number;
	longitude: number;
}


mapboxgl.accessToken = "pk.eyJ1IjoiaXZhbmhhbW91IiwiYSI6ImNsbTdmZm83ZTAwNmUzY281eThlZGVrc20ifQ.F3Bf3aNyt5aF8_V_iRdYCw"
console.log('Kontrollera att access token hittas: ', accessToken);


export function HomePage() {

    const navigate = useNavigate()

	const [message, setMessage] = useState<string>('')
    const [viewQuiz, setViewQuiz] = useState<{ question: string; username: string, quizId: string }[]>([]);

	
	const mapContainer = useRef(null)
	const mapRef = useRef<MapGl | null>(null)
	const [lat, setLat] = useState<number>(57.7)
	const [lng, setLng] = useState<number>(11.89)
	const [zoom, setZoom] = useState<number>(10)
	const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);

	
	useEffect(() => {
		if( mapRef.current || !mapContainer.current ) return
		
		mapRef.current = new MapGl({
			container: mapContainer.current,
			style: 'mapbox://styles/mapbox/streets-v12',
			center: [lng, lat],
			zoom: zoom
		});
		const map: MapGl = mapRef.current
		
			map.on('move', () => {
			interface Position {
				lng: number;
				lat: number;
			}
			const position: Position = map.getCenter()
			setLat(Number(position.lat.toFixed(4)))
			setLng(Number(position.lng.toFixed(4)))
			setZoom(map.getZoom());
		})

    
	}, [lat, lng, zoom])


	const getQuiz = async (map: MapGl | null,
		marker: mapboxgl.Marker | null) => {
		const url = 'https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz'
		const settings = {
			method: 'GET',
		}
    
		const response = await fetch(url, settings)
		const data = await response.json()
		console.log('getQuiz: ', data);
		
        
		if (data.success && map) {
            const questions: { question: string, username: string, quizId: string }[] = [];

			data.quizzes.forEach((quiz: any) => {
			  quiz.questions.forEach((question: any) => {
				const { longitude, latitude } = question.location;
				if (longitude !== undefined && latitude !== undefined) {
				   marker = new mapboxgl.Marker({ color: "green" })
					.setLngLat([Number(longitude), Number(latitude)])
					.addTo(map);
                    console.log(question.question);
                    
                    
					const popup = new mapboxgl.Popup()
                    .setHTML(`<h3>${question.question}</h3>`)
                    
        			marker.setPopup(popup);
                    questions.push({
                        question: question.question,
                        username: quiz.username,
                        quizId: quiz.quizId
                    });
				}
            });
            setViewQuiz(questions);
            console.log(viewQuiz);   
        });
        }
         
	} 
	


  async function getPosition(): Promise<Position> {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        const geo = navigator.geolocation;
        geo.getCurrentPosition(pos => {
          const position: Position = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
            
          }
          const message = `Your current position is : Latitude: ${position.latitude}, Longitude: ${position.longitude}`;
          setMessage(message)
          console.log(position);
          resolve(position)
        }, error => {
          reject(error.message)
        })
      } else {
        reject('Please upgrade your browser to use this web app.')
      }
    })
  
  
  }

  async function markCurrentLocationOnMap(
	map: MapGl | null,
	marker: mapboxgl.Marker | null
  ) {
	const position = await getPosition();
	const { latitude, longitude } = position;
  
	if (map) {
	  marker = new mapboxgl.Marker({ color: "red" })
		.setLngLat([longitude, latitude])
		.addTo(map);
	  setMarker(marker); 
	} else {
	}
  
	const popup = new mapboxgl.Popup({
	  offset: 25,
	  closeButton: false,
	}).setHTML("<h2 style='color: black;'>You are here!</h2>");
  
	if (map) {
	  popup.addTo(map).setLngLat([longitude, latitude]);
	} else {
	}
  }
  
  

	return (
		<div className="app">
			<header>
				<h3> Logga in eller registrera ett konto för att skapa egen quiz: </h3>
                <button onClick={() => navigate("/Login")}> Skapa användare </button>
				<button onClick={() => navigate("/Login")}> Logga in </button>
			</header>
			<main>
        <div ref={mapContainer} className="map-container" />

        <p> Center position: {lat} lat, {lng} lng </p>
				<section>
					<div>
						<button onClick={() => getQuiz(mapRef.current, marker)}> Show all quizzes </button>
						<button onClick={getPosition}> Hämta nuvarande position </button>
						<button onClick={() => markCurrentLocationOnMap(mapRef.current, marker)}>Mark Current Location</button>

					</div>
					<p> {message} </p>
				</section>

                <section>
                    {viewQuiz.map((item, index) => (
                        <div key={index} style={{ marginTop: "4rem" }}>
                            <h3>Question: {item.question}</h3>
                            <p>Created By: {item.username}</p>
                            <p>Quiz Name: {item.quizId}</p>
                            <hr></hr>
                        </div>
                    ))}
                </section>



			</main>
		</div>
	)
}

export default HomePage