const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "AdskXBvauHkjqohBBKMrIot9DD4rvKCCJqGi6OvmOBuivdrL_SlI-PzhJ6CcAADvIj5vq_dDCepuAHIQ",
  client_secret: "ECu80OjlgG0NqcjkwCgvwSiU5H823Ywa1aqUEH9jmNtbD8SCI97zFDgUxCg3yf31z4H2o_0BPTqyc3wA",
});

module.exports = paypal;