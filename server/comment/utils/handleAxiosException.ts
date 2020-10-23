function handleAxiosException(err) {
  if (err.response && err.response.data && err.response.data.message) {
    return new Error(err.response.data.message);
  }
  else if (err.message) {
      return new Error(err.message);
  }
  else {
      return err;
  }
}

export { handleAxiosException }