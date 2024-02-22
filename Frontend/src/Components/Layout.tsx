import HeaderMain from "./HeaderMain"
import { useState } from "react"
import { Outlet } from "react-router-dom"

export default function Layout() {
  const [selected, setSelected] = useState("")

  return (
    <>
      <div className="w-screen">
        <HeaderMain />
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <Outlet context={[selected, setSelected]} />
          </div>
        </main>
      </div>
    </>
  )
}
