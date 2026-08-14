const Razorpay = require("razorpay");

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const { amount } = JSON.parse(event.body);

    if (!amount || amount < 100) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Amount must be at least 100 paise (1 INR)" })
      };
    }

    // Read environment variables (Set on Netlify Panel or local .env)
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Razorpay credentials are not configured on the server." })
      };
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    const options = {
      amount: amount, // Amount in paise
      currency: "INR",
      receipt: "rcpt_" + Math.floor(100000 + Math.random() * 900000)
    };

    const order = await razorpay.orders.create(options);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        order_id: order.id,
        amount: order.amount,
        currency: order.currency
      })
    };
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to initialize secure transaction order." })
    };
  }
};
