class CustomException {
  constructor(message) {
    this.message = message;
    this.timestamp = new Date().toISOString();
  }
}

module.exports = CustomException;
