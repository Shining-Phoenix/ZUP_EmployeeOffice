module.exports = (res, error) => {
  console.log(error)
  if (res.status !== undefined) {
    res.status(500).json({
      success: false,
      message: error.message ? error.message : error
    })    
  }
}