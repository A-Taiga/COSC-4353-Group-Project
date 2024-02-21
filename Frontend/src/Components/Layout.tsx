import HeaderMain from "./HeaderMain"
import { useState } from "react"
import { Outlet } from "react-router-dom"

export default function Layout() {
  const [selected, setSelected] = useState("")

  return (
    <>
      <div className="w-screen">
        <HeaderMain />
        <Outlet context={[selected, setSelected]} />
      </div>
    </>
  )
}
