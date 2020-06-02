module.exports = (res, error) => {
  console.log(error)
  res.status(500).json({
    success: false,
    message: error.message ? error.message : error
  })
}