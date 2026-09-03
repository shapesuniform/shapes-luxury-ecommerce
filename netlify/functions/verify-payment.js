const crypto = require("crypto");

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = JSON.parse(event.body);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required signature verification properties." })
      };
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Razorpay Key Secret is not configured on the server." })
      };
    }

    // Generate HMAC SHA256 Signature
    const hmac = crypto.createHmac("sha256", keySecret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Signature mismatch. Unverified transaction failed." })
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: "success" })
    };
  } catch (err) {
    console.error("Error verifying payment signature:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error occurred during payment signature verification." })
    };
  }
};
