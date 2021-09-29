import chai from 'chai';

const { expect } = chai;

// eslint-disable-next-line @typescript-eslint/ban-types
export const expectThrowsAsync = async (method: Function, errorType: object, errorMessage: string): Promise<void> => {
  let msg = '';

  try {
    await method();
    msg = 'Expect method to throw';

    if (errorMessage) {
      msg += ` with message: ${errorMessage}`;
    }
  } catch (err) {
    expect(err).to.be.an.instanceOf(errorType);

    if (errorMessage) {
      expect(err.message).to.equal(errorMessage);
    }
  }

  if (msg) {
    throw Error(msg);
  }
};

// eslint-disable-next-line @typescript-eslint/ban-types
export const expectThrows = (method: Function, errorMessage: string): void => {
  let error = null;
  let msg = '';

  try {
    method();
    msg = 'Expect method to throw';

    if (errorMessage) {
      msg += ` with message: ${errorMessage}`;
    }
  } catch (err) {
    error = err;
  }

  if (!error) {
    throw Error(msg);
  }

  expect(error).to.be.an.instanceOf(Error);

  if (errorMessage) {
    expect(error.message).to.equal(errorMessage);
  }
};
