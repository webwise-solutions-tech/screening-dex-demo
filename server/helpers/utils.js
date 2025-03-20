const serverErrorResponse = (res, e) => {
  return res.status(500).json({ message: e instanceof Error? e.message : 'Unknown Error occured' })
}

module.exports = serverErrorResponse;