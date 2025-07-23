const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  // Default to 30 days if JWT_EXPIRE is not set
  const expiresIn = process.env.JWT_EXPIRE || '30d';
  
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: expiresIn
  });
};

module.exports = generateToken;