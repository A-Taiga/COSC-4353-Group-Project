import asyncHandler from '../middlewares/asyncHandler'
import { Request, Response } from 'express'



const profile = asyncHandler(async (req: Request, res: Response) => 
{
	const states = ["AL","AK","AZ","AR","CA","CO","CT","DE"
					,"FL","GA","HI","ID","IL","IN","IA","KS"
					,"KY","LA","ME","MD","MA","MI","MN","MS"
					,"MO","MT","NE","NV","NH","NJ","NM","NY"
					,"NC","ND","OH","OK","OR","PA","RI","SC"
					,"SD","TN","TX","UT","VT","VA","WA","WV"
					,"WI","WY",]

	let {fullName
			, address1
			, address2
			, city
			, state
			, zipcode} = req.body

	const zipCodePattern: RegExp = /^\d{5}-\d{4}$/;
	const zipCodePattern2: RegExp = /^\d{5}$/;


	if (!fullName || !address1 || !city || !state || !zipcode)
	{
		throw new Error('Bad request.');
	}

	fullName = fullName.toLowerCase()

	const is = (s:string) =>
	{
		return s === state;
	};	

	if (!states.find(is))
	{
		throw new Error ('Bad request. state');
	}
	
	if (!zipCodePattern.test(zipcode))
	{
		if (!zipCodePattern2.test(zipcode))
			throw new Error ('Bad request. zip');
	}

	res.status(200).json({
		message: 'profile saved',
	})

});

export default profile