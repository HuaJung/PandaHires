function convertUtcToLocalDate (utcDate) {
  const date = new Date(utcDate)
  return date.toLocaleDateString("en-ca")
}

function convertDateTimeFormat(dateTime) {
  if (dateTime === '-') return dateTime
  const formattedDate = `${dateTime.split(':')[0]}:${dateTime.split(':')[1]}`
  return formattedDate
}

export {convertUtcToLocalDate, convertDateTimeFormat }