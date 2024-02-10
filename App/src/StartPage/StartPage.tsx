
import React from 'react';
import Login from './Login';
import Registration from './Registration';
import "./StartPage.css";

export default function StartPage() {


	const [current, setCurrent] = React.useState("login");
	const currentRef = React.useRef(current);

	const set = (name: string) =>
	{
		setCurrent(name);
	}

  return (
	<>
		<div {...{"visible":current}} id = "loginWrapper">
			<Login set={set}  {...{currentRef}} />
		</div>
		<div {...{"visible":current}} id = "registrationWrapper">
			<Registration set={set}  {...{currentRef}} />
		</div>
	</>
  );
}