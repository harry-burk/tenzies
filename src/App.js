import {useState, useEffect} from 'react'
import Die from './components/Die.js';
import {nanoid} from 'nanoid'
import Confetti from 'react-confetti'

// App root
function App() {
	const [diceArray, setDiceArray] = useState(allNewDice())
	const [tenzies, setTenzies] = useState(false)
	const [rolls, setRolls] = useState(0)	
	const bestRolls = JSON.parse(localStorage.getItem('bestRolls'))
	const [timer, setTimer] = useState({
		time: 0,
		running: true
	})

	// Check victory conditions
	// We use an effect for this not because it is an 'outside effect', but because it's function is to keep two pieces of state in sync with each other, which React does not handle
	useEffect(() => {
		const firstNumber = diceArray[0].value	
		const allMatch = diceArray.every(die => die.value == firstNumber)
		const allHeld = diceArray.every(die => die.isHeld)		

		if (allMatch && allHeld) {
			setTenzies(true)
			console.log('Victory!')

			if (rolls < bestRolls || bestRolls == 0) {
				localStorage.setItem('bestRolls', rolls)
				console.log('New high score! Only ' + rolls + ' rolls!')
			}			
		} else {
			setTenzies(false)
		}
	}, [diceArray])

	// Timer
	useEffect(() => {
		let interval;
		
		// if (timer.running) {			
		// 	interval = setInterval(() => {
		//         setTimer((prevTimer) => prevTimer.time + 10);		        
		//     }, 10);

		//     console.log(timer.time)
		// }

		return interval;
	})

	// HELPER function to generate random dice
	function generateDie () {
		return {
			id: nanoid(),
			value: Math.ceil(Math.random() * 6), 
			isHeld: false,
			value: 2, 
			// isHeld: true,	
		}
	}
	
	// Generate original values	
	function allNewDice () {		
		const diceArray = []
		for (let i = 0; i < 10; i++) {
			diceArray.push(generateDie())
		}				
		return diceArray		
	}

	// Roll dice that aren't 'held'
	function rollDice () {		
		if (tenzies) {
			setTenzies(false)
			setDiceArray(allNewDice())	
			setRolls(0)
		} else {
			setRolls(oldRoll => oldRoll + 1)
			setDiceArray(oldDiceArray => oldDiceArray.map(die => {
				return die.isHeld ? die : generateDie()
			}))	
		}			
	}

	// Hold the clicked die
	function holdDice (id) {
		setDiceArray(oldDiceArray => oldDiceArray.map(die => {
			return die.id == id ? {...die, isHeld: !die.isHeld} : die
		}))
	}

	const diceElements = diceArray.map(die => <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)} />)

  	return (
  		<div className="App">
  			{tenzies && <Confetti />}

	  	  	<main>
	  	  		<h1 className="title mb-3">Tenzies</h1>
	  	  	    <p className="instructions mb-5">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>

	  	  	    <div className="score mb-5">
	  	  	    	<div className="d-flex justify-content-between">
	  	  	    		<p className="mb-0">Rolls: {rolls}</p>
	  	  	    		<p className="mb-0"><strong>Best: {bestRolls}</strong></p>
	  	  	    	</div>	  	  	   
	  	  	    	<div className="d-flex justify-content-between">
	  	  	    		<p className="mb-0">Time: </p>
	  	  	    		<p className="mb-0"><strong>Best: </strong></p>
	  	  	    	</div>	  	  	  
	  	  	    	<div className="d-flex justify-content-between">
	  	  	    		<p className="mb-0">Score: </p>
	  	  	    		<p className="mb-0"><strong>Best: </strong></p>
	  	  	    	</div>	  	  	     	
	  	  	    </div>	  	  	    

	  	  		<div className="dice-wrap">
	  	  			{diceElements}
	  	  		</div>
	  	  		<button className="roll-dice mt-5" onClick={rollDice}>{tenzies ? 'New Game' : 'Roll'}</button>
	  	  	</main>
  	  	</div>  	  	
  	);
}

export default App;