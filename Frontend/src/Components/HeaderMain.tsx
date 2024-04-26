import FingerprintJS from "@fingerprintjs/fingerprintjs"
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { Fragment } from "react"
import { Link, useLocation } from "react-router-dom"
import { useLogoutMutation } from "../api/apiSlice"
import profilePic from "../assets/images/profilePic.avif"
import useAuth from "../hooks/useAuth"

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl: profilePic,
}
const navigation = [
  { name: "Dashboard", href: "/fuel-quote" },
  { name: "History", href: "/history" },
  { name: "Projects", href: "#" },
  { name: "Calendar", href: "#" },
  { name: "Reports", href: "#" },
]
const userNavigation = [
  { name: "Your Profile", href: "/profile" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

// Define a type for the path to title mapping
interface PathToTitleMap {
  [key: string]: string
}

export default function HeaderMain() {
  const { auth } = useAuth()
  const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation()
  const username = auth.user

  user.name = username
    ? username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()
    : user.name

  user.email = username ? `${username.toLowerCase()}@example.com` : user.email

  const location = useLocation()
  // const navigate = useNavigate()

  const getFingerprint = async () => {
    const fpPromise = await FingerprintJS.load()
    const fp = await fpPromise.get()
    return fp.visitorId
  }

  const handleSignOut = async () => {
    try {
      const fingerprint = await getFingerprint()
      await logout({ fingerprint })
      // Perform additional sign-out actions (clear local storage, redirect to login page)
      localStorage.clear()
      sessionStorage.clear()

      // Redirect to login page
      window.location.href = "/login"
    } catch (error) {
      console.error("Error during sign-out:", error)
    }
  }

  // Type the event parameter and href parameter in the handleLinkClick function
  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href: string
  ) => {
    if (location.pathname === href) {
      e.preventDefault() // Prevent the link from navigating
      e.stopPropagation() // Stop the event from propagating further
    }
  }

  // Mapping of paths to their respective header titles with typed object
  const pathToTitle: PathToTitleMap = {
    "/fuelform": "Dashboard",
    "/history": "History",
    "/profile": "Profile",
    // Add other paths and their titles here
  }

  // Determine the header title based on the current path
  // Default to "Dashboard" if the current path isn't found in the mapping
  const headerTitle = pathToTitle[location.pathname] || "Dashboard"
  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800 sticky top-0 z-50">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-8 w-8"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                        alt="Your Company"
                      />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            onClick={(e) => handleLinkClick(e, item.href)}
                            className={classNames(
                              location.pathname == item.href
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                            aria-current={
                              location.pathname === item.href
                                ? "page"
                                : undefined
                            }
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <button
                        type="button"
                        className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <img
                              className="h-8 w-8 rounded-full"
                              src={user.imageUrl}
                              alt=""
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) =>
                              item.name === "Sign out" ? (
                                <Menu.Item key={item.name}>
                                  {() => (
                                    <Link
                                      to="#"
                                      onClick={(e) => {
                                        e.preventDefault()
                                        handleSignOut()
                                      }}
                                      className="block w-full px-4 py-2 text-left text-sm text-gray-700"
                                    >
                                      {isLogoutLoading
                                        ? "Signing out..."
                                        : "Sign out"}
                                    </Link>
                                  )}
                                </Menu.Item>
                              ) : (
                                <Menu.Item key={item.name}>
                                  {() => (
                                    <Link
                                      to={item.href}
                                      onClick={(e) =>
                                        handleLinkClick(e, item.href)
                                      }
                                      className="block px-4 py-2 text-sm text-gray-700"
                                    >
                                      {item.name}
                                    </Link>
                                  )}
                                </Menu.Item>
                              )
                            )}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                {/* ... */}
                <div className="mt-3 space-y-1 px-2">
                  {userNavigation.map((item) =>
                    item.name === "Sign out" ? (
                      <Link
                        key={item.name}
                        to="#"
                        onClick={(e) => {
                          e.preventDefault()
                          handleSignOut()
                        }}
                        className="block w-full rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        {isLogoutLoading ? "Signing out..." : "Sign out"}
                      </Link>
                    ) : (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </Disclosure.Button>
                    )
                  )}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {/* {headerTitle == "Dashboard" && auth.user
                ? `Hey ${
                    auth.user.charAt(0).toUpperCase() +
                    auth.user.slice(1).toLowerCase()
                  }. Welcome!`
                : headerTitle} */}
              {headerTitle}
            </h1>
          </div>
        </header>
      </div>
    </>
  )
}
