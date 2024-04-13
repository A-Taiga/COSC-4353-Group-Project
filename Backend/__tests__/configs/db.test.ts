import {
  client,
  connectDB,
} from '../../configs/dbConnection'

describe('connectDB', () => {
  let consoleSpy: jest.SpyInstance<
    void,
    [message?: any, ...optionalParams: any[]],
    any
  >
  let processExitSpy: jest.SpyInstance<
    (...args: any[]) => any,
    [...args: any[]]
  > // Declare processExitSpy

  beforeEach(() => {
    consoleSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => {})

    processExitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation() // Initialize processExitSpy
  })

  afterEach(async () => {
    consoleSpy.mockRestore()
    processExitSpy.mockRestore() // Restore processExitSpy after each test
    await client.end()
  })

  it('should connect to the database without errors', async () => {
    // Act
    await connectDB()
    console.log(client)
    // Assert
    expect(await client._connecting).toBe(true)
  })

  it('should log an error if connection fails', async () => {
    // Act
    await connectDB(true)

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(
        /Error: Test connection failed/,
      ),
    )
    expect(processExitSpy).toHaveBeenCalledWith(1)
  })
})
