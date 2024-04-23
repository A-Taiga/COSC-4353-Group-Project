import React, { useEffect, useState } from "react"
import { useLoadProfileQuery, useUpsertProfileMutation } from "../api/apiSlice"
// Define the type for your form state

interface ProfileFormState {
  firstName: string
  lastName: string
  address1: string
  address2: string
  city: string
  state: string
  zipcode: string
}

export default function Profile() {
  const [formState, setFormState] = useState<ProfileFormState>({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipcode: "",
  })
  const [upsertUserProfile, isSuccess] = useUpsertProfileMutation()
  const { data, isSuccess: loadIsSuccess } = useLoadProfileQuery({})
  // useEffect to update formState only when profile data changes
  useEffect(() => {
    if (loadIsSuccess && data && data.profile) {
      console.log(data.profile)
      setFormState((prevState) => ({
        firstName: data.profile.firstName ?? prevState.firstName,
        lastName: data.profile.lastName ?? prevState.lastName,
        address1: data.profile.address1 ?? prevState.address1,
        address2: data.profile.address2 ?? prevState.address2,
        city: data.profile.city ?? prevState.city,
        state: data.profile.state ?? prevState.state,
        zipcode: data.profile.zipcode ?? prevState.zipcode,
      }))
    }
  }, [data, loadIsSuccess]) // Dependencies array includes profile and isSuccess

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLFormElement
    e.preventDefault()
    const data = new FormData(target)
    const form = Object.fromEntries(data.entries())
    try {
      const response = await upsertUserProfile(form).unwrap()
      if (!isSuccess) throw new Error()
      console.log("Profile saved successfully", response)
    } catch (err) {
      console.log("Profile failed to save", err)
    }
  }

  // Assuming you have a states array somewhere in your code
  const states = [
    { name: "Alabama", code: "AL" },
    { name: "Alaska", code: "AK" },
    { name: "Arizona", code: "AZ" },
    { name: "Arkansas", code: "AR" },
    { name: "California", code: "CA" },
    { name: "Colorado", code: "CO" },
    { name: "Connecticut", code: "CT" },
    { name: "Delaware", code: "DE" },
    { name: "Florida", code: "FL" },
    { name: "Georgia", code: "GA" },
    { name: "Hawaii", code: "HI" },
    { name: "Idaho", code: "ID" },
    { name: "Illinois", code: "IL" },
    { name: "Indiana", code: "IN" },
    { name: "Iowa", code: "IA" },
    { name: "Kansas", code: "KS" },
    { name: "Kentucky", code: "KY" },
    { name: "Louisiana", code: "LA" },
    { name: "Maine", code: "ME" },
    { name: "Maryland", code: "MD" },
    { name: "Massachusetts", code: "MA" },
    { name: "Michigan", code: "MI" },
    { name: "Minnesota", code: "MN" },
    { name: "Mississippi", code: "MS" },
    { name: "Missouri", code: "MO" },
    { name: "Montana", code: "MT" },
    { name: "Nebraska", code: "NE" },
    { name: "Nevada", code: "NV" },
    { name: "New Hampshire", code: "NH" },
    { name: "New Jersey", code: "NJ" },
    { name: "New Mexico", code: "NM" },
    { name: "New York", code: "NY" },
    { name: "North Carolina", code: "NC" },
    { name: "North Dakota", code: "ND" },
    { name: "Ohio", code: "OH" },
    { name: "Oklahoma", code: "OK" },
    { name: "Oregon", code: "OR" },
    { name: "Pennsylvania", code: "PA" },
    { name: "Rhode Island", code: "RI" },
    { name: "South Carolina", code: "SC" },
    { name: "South Dakota", code: "SD" },
    { name: "Tennessee", code: "TN" },
    { name: "Texas", code: "TX" },
    { name: "Utah", code: "UT" },
    { name: "Vermont", code: "VT" },
    { name: "Virginia", code: "VA" },
    { name: "Washington", code: "WA" },
    { name: "West Virginia", code: "WV" },
    { name: "Wisconsin", code: "WI" },
    { name: "Wyoming", code: "WY" },
  ]

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <form onSubmit={handleOnSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="firstName"
          className="block text-sm font-medium text-gray-700"
        >
          First Name
        </label>
        <input
          type="text"
          name="firstName"
          value={formState.firstName}
          onChange={handleChange}
          placeholder="John"
          required
          maxLength={50}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label
          htmlFor="lastName"
          className="block text-sm font-medium text-gray-700"
        >
          Last Name
        </label>
        <input
          type="text"
          name="lastName"
          value={formState.lastName}
          onChange={handleChange}
          placeholder="Doe"
          required
          maxLength={50}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label
          htmlFor="address1"
          className="block text-sm font-medium text-gray-700"
        >
          Address 1
        </label>
        <input
          type="text"
          name="address1"
          value={formState.address1}
          onChange={handleChange}
          placeholder="123 Main St"
          required
          maxLength={100}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label
          htmlFor="address2"
          className="block text-sm font-medium text-gray-700"
        >
          Address 2
        </label>
        <input
          type="text"
          name="address2"
          value={formState.address2}
          onChange={handleChange}
          placeholder="Apt 123"
          maxLength={100}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label
          htmlFor="city"
          className="block text-sm font-medium text-gray-700"
        >
          City
        </label>
        <input
          type="text"
          name="city"
          value={formState.city}
          onChange={handleChange}
          placeholder="Anytown"
          required
          maxLength={100}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label
          htmlFor="state"
          className="block text-sm font-medium text-gray-700"
        >
          State
        </label>
        <select
          name="state"
          value={formState.state}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="" disabled>
            Select a State
          </option>
          {states.map((state) => (
            <option key={state.code} value={state.code}>
              {state.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="zipcode"
          className="block text-sm font-medium text-gray-700"
        >
          Zipcode
        </label>
        <input
          type="text"
          name="zipcode"
          value={formState.zipcode}
          onChange={handleChange}
          placeholder="12345-6789"
          required
          maxLength={10}
          pattern="^\d{5}(-\d{4})?$"
          title="Zipcode must be 5 digits or 9 digits with a dash"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <button
        type="submit"
        className="mt-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Save Profile
      </button>
    </form>
  )
}
