import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connected = await mongoose.connect(process.env.MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log(
      `MongoDB connected: ${connected.connection.host}`.bgGreen.underline.black
    );
  } catch (err) {
    console.error(`Error: ${err}`.red.underline.bold);
    process.exit(1);
  }
};

export default connectDB;
