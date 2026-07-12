import mongoose from "mongoose";

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB...")   
    }
    catch(err){
        console.log(err)
    }
}

export default connectDB;

// lib/ConnectDB.js

// import mongoose from "mongoose";

// const connectDB = async () => {
//   const mongoUri = process.env.MONGO_URI || process.env.mongo_URI;
//   if (!mongoUri) {
//     console.error("❌ DB Connection Error: MONGO_URI (or mongo_URI) is not set in environment");
//     process.exit(1);
//   }

//   try {
//     const conn = await mongoose.connect(mongoUri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`❌ DB Connection Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// export default connectDB;
