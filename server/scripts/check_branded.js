const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
  const conn = await mongoose.createConnection(process.env.MONGO_FOODS_URI).asPromise();
  const doc = await conn.collection('brandedfoods').findOne({ description: /cheerios/i });
  console.log(JSON.stringify(doc, null, 2));
  process.exit(0);
}
check();
