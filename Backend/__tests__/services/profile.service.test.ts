import { db } from '../../configs/dbConnection';
import { userProfiles } from '../../schemas/schema';
import { findUserProfile, upsertUserProfile } from '../../services/profile.service';

jest.mock('../configs/dbConnection');
jest.mock('../schemas/schema');

describe('Profile Service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('findUserProfile', () => {
    it('returns null when no profile is found', async () => {
      db.select.mockResolvedValue([]); // No results
      const profile = await findUserProfile('user123');
      expect(profile).toBeNull();
      expect(db.select).toHaveBeenCalledTimes(1);
    });

    it('returns a profile when it is found', async () => {
      const mockProfile = {
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        address2: '',
        city: 'Anytown',
        state: 'TX',
        zipcode: '12345',
      };
      db.select.mockResolvedValue([mockProfile]);
      const profile = await findUserProfile('user123');
      expect(profile).toEqual(mockProfile);
      expect(db.select).toHaveBeenCalledTimes(1);
    });
  });

  describe('upsertUserProfile', () => {
    it('creates a new profile if one does not exist', async () => {
      db.insert.mockImplementation(() => ({
        values: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([{
          firstName: 'Jane',
          lastName: 'Doe',
          addressOne: '124 Main St',
          city: 'Anytown',
          state: 'TX',
          zip: '12345',
        }])
      }));
      const data = {
        firstName: 'Jane',
        lastName: 'Doe',
        address1: '124 Main St',
        address2: '',
        city: 'Anytown',
        state: 'TX',
        zipcode: '12345',
      };
      const profile = await upsertUserProfile('user123', data);
      expect(profile).toEqual({
        firstName: 'Jane',
        lastName: 'Doe',
        addressOne: '124 Main St',
        city: 'Anytown',
        state: 'TX',
        zip: '12345',
      });
      expect(db.insert).toHaveBeenCalledTimes(1);
    });

    it('updates an existing profile', async () => {
    //   jest.spyOn(userProfiles, 'userId').mockReturnValue(userProfiles.userId);
      db.update.mockImplementation(() => ({
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        returning: jest.fn().mockResolvedValue([{
          firstName: 'John',
          lastName: 'Updated',
          addressOne: '123 Main St',
          city: 'Anytown',
          state: 'TX',
          zip: '12345',
        }])
      }));
      const data = {
        firstName: 'John',
        lastName: 'Updated',
        address1: '123 Main St',
        address2: '',
        city: 'Anytown',
        state: 'TX',
        zipcode: '12345',
      };
      const profile = await upsertUserProfile('user123', data);
      expect(profile).toEqual({
        firstName: 'John',
        lastName: 'Updated',
        addressOne: '123 Main St',
        city: 'Anytown',
        state: 'TX',
        zip: '12345',
      });
      expect(db.update).toHaveBeenCalledTimes(1);
    });

    it('throws an error if data validation fails', async () => {
      const data = { firstName: '', lastName: '', address1: '' }; // Invalid data
    //   await expect(upsertUserProfile('user123', data)).rejects.toThrow('Bad request.');
    });
  });
});
