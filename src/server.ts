import app from "@/src/app";
import connectToMongoDB from "@/src/database/connection";

async function run() {
  try {
    await connectToMongoDB();
    app.listen(3000, () => {
      console.log("----------------------->");
      console.log("server running port 3000");
      console.log("----------------------->");
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
