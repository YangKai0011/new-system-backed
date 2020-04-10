const jwt = require('jsonwebtoken');

module.exports = {
  secret: 'check',
  time: '1d',
  createToken: function (data) {
    return jwt.sign(data, this.secret, { expiresIn: this.time });
  },
  checkToken: function (token) {
    return jwt.verify(token, this.secret, (err, decoded) => {
      console.log(decoded);
      
      if (err) {
        return false;
      } else {
        return true;
      }
    });
  },
};
