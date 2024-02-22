import { useNavigate } from "react-router-dom";


export default function NavButton (props: any): JSX.Element
{
  const navigate = useNavigate();
  const handleClick = () => navigate(props.to);
  return (
    <button id={props.id} type="button" onClick={(handleClick)}>{props.children}</button>
  );
};