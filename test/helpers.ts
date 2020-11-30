import chai from 'chai'

const { expect } = chai

export const expectThrows = (method: Function, errorMessage: string) => {
  let error = null
  let msg: string = '';

  try {
    method()
    msg = 'Expect method to throw'

    if (errorMessage) {
      msg += ` with message: ${errorMessage}`
    }
  } catch (err) {
    error = err
  }

  if (!error) {
    throw Error(msg)
  }

  expect(error).to.be.an.instanceOf(Error)

  if (errorMessage) {
    expect(error.message).to.equal(errorMessage)
  }
}

export const expectThrowsAsync = async (method: Function, errorMessage: string) => {
  let error = null
  let msg: string = ''

  try {
    await method()
    msg = 'Expect method to throw'

    if (errorMessage) {
      msg += ` with message: ${errorMessage}`
    }
  } catch (err) {
    error = err
  }

  if (!error) {
    throw Error(msg)
  }

  expect(error).to.be.an.instanceOf(Error)

  if (errorMessage) {
    expect(error.message).to.equal(errorMessage)
  }
}

