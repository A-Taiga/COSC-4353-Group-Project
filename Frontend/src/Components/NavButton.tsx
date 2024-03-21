import { useNavigate } from "react-router-dom"

interface NavButtonProps {
  id: string
  to: string
  children: React.ReactNode
}

export default function NavButton(props: NavButtonProps): JSX.Element {
  const navigate = useNavigate()
  const handleClick = () => navigate(props.to)
  return (
    <button id={props.id} type="button" onClick={handleClick}>
      {props.children}
    </button>
  )
}
