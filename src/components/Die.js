function Die(props) {
  	return (
  	  	<div className={"die m-0 " + (props.isHeld && 'held')} onClick={props.holdDice}>
  	  		<span>{props.value}</span>
  	  	</div>
  	);
}

export default Die;