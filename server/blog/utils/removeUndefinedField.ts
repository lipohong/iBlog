const removeUndefinedField = (obj: object) => {
  for (let i in obj) {
    if (typeof obj[i] == 'object') {
      removeUndefinedField(obj[i]);
    } else {
      if (obj[i] === undefined || obj[i] === null || obj[i] === '') {
        delete obj[i];
      }
    }
  }

  return obj;
}

export { removeUndefinedField }