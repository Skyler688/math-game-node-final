const hello = async (req, res) => {
  try {
    res.status(200).send("Hello from the hello route");
  } catch (error) {
    console.error(error);
  }
};

module.exports = { hello };
