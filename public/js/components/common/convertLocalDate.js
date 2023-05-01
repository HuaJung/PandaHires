function convertUtcToLocalDate (utcDate) {
  const date = new Date(utcDate)
  return date.toLocaleDateString("en-ca")
}



export {convertUtcToLocalDate }