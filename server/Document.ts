const { Scheme, model, Schema } = require("mongoose");

const DocumentObject = new Schema({
  _id: String,
  data: Object,
});

module.exports = model("DocumentObject", DocumentObject);
