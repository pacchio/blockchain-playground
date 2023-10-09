const shouldThrow = async (promise) => {
  try {
    await promise;
    assert(true);
  } catch (err) {
    if (err.data && Object.keys(err.data)[0]) {
      return err.data[Object.keys(err.data)[0]]?.reason;
    }
    return err;
  }
  assert(false, "The contract did not throw.");
}

const toNumberWithDecimals = (n, decimals = 18) => {
  return n + ('0'.repeat(decimals));
}

const fromNumberWithDecimals = (n, decimals = 18) => {
  return n.replace('0'.repeat(decimals), '');
}

module.exports = {
  shouldThrow,
  toNumberWithDecimals,
  fromNumberWithDecimals,
};
