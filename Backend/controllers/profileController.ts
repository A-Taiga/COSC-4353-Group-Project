import { Request, Response } from 'express'
import asyncHandler from '../middlewares/asyncHandler'
import {
  findUserProfile,
  upsertUserProfile,
} from '../services/profile.service'
import { UserProfileDbReturn } from '../types/type'

export const profile = asyncHandler(
  async (req: Request, res: Response) => {
    const states = [
      'AL',
      'AK',
      'AZ',
      'AR',
      'CA',
      'CO',
      'CT',
      'DE',
      'FL',
      'GA',
      'HI',
      'ID',
      'IL',
      'IN',
      'IA',
      'KS',
      'KY',
      'LA',
      'ME',
      'MD',
      'MA',
      'MI',
      'MN',
      'MS',
      'MO',
      'MT',
      'NE',
      'NV',
      'NH',
      'NJ',
      'NM',
      'NY',
      'NC',
      'ND',
      'OH',
      'OK',
      'OR',
      'PA',
      'RI',
      'SC',
      'SD',
      'TN',
      'TX',
      'UT',
      'VT',
      'VA',
      'WA',
      'WV',
      'WI',
      'WY',
    ]

    let {
      firstName,
      lastName,
      address1,
      address2,
      city,
      state,
      zipcode,
      user_id,
    } = req.body

    const zipCodePattern1: RegExp = /^\d{5}$/
    const zipCodePattern2: RegExp = /^\d{5}-\d{4}$/

    if (
      !firstName ||
      !lastName ||
      !address1 ||
      !city ||
      !state ||
      !zipcode ||
      typeof firstName !== 'string' ||
      typeof lastName !== 'string' ||
      typeof address1 !== 'string' ||
      typeof city !== 'string' ||
      typeof state !== 'string' ||
      typeof zipcode !== 'string'
    ) {
      res.status(400).json({
        message: 'Missing required fields.',
        firstName: firstName,
        lastName: lastName,
        address1: address1,
        address2: address2,
        city: city,
        state: state,
        zipcode: zipcode,
      })
    }

    if (!user_id) {
      throw new Error('Unauthorized')
    }

    firstName = firstName.toLowerCase()
    lastName = lastName.toLowerCase()

    const is = (s: string) => {
      return s === state
    }

    if (!states.find(is)) {
      res.status(400).json({
        message: 'Not a valid state code',
        state: state,
      })
    }

    if (
      !zipCodePattern1.test(zipcode) &&
      !zipCodePattern2.test(zipcode)
    ) {
      res.status(400).json({
        message: 'Zipcode invalid',
        zipcode: zipcode,
      })
    }

    const profile: UserProfileDbReturn | null =
      await upsertUserProfile(user_id, {
        firstName,
        lastName,
        address1,
        address2,
        city,
        state,
        zipcode,
      })

    res.status(200).json({
      message: 'profile saved',
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      address1: profile?.addressOne,
      address2: profile?.addressTwo,
      city: profile?.city,
      state: profile?.state,
      zipcode: profile?.zip,
    })
  },
)


export const loadProfile = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      let { user_id } = req.body

      if (!user_id) {
        throw new Error('Unauthorized')
      }

      const profile: UserProfileDbReturn | null =
        await findUserProfile(user_id)

      if (
        !profile ||
        !profile.firstName ||
        !profile.lastName
      ) {
        return res.status(200).json({
          message: 'Profile not found',
          profile: profile,
        })
      }

      return res.status(200).json({
        message: 'Profile loaded successfully',
        profile: profile,
      })
    } catch (err) {
      throw new Error((err as Error).message)
    }
  },
)
