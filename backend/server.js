if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const app = require("./src/app");
const { connectDB } = require("./src/config/db");
const ExpressError = require("./src/utils/ExpressError"); 
const dns = require("dns");

dns.setServers(["1.1.1.1","8.8.8.8"])

const port = process.env.PORT || 8080;

// Connect to the database before starting the server
connectDB();

// ---------------------------------------------------------
// 🔥 ERROR HANDLERS HAMESHA ROUTES KE BAAD AUR LISTEN SE PEHLE HOTE HAIN
// ---------------------------------------------------------

// 1. Agar koi aisi API hit kare jo exist nahi karti (404)
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not found"));
});
  
// 2. Global Error Handler (WrapAsync se aane wale errors yahan aayenge)
app.use((err, req, res, next) => {
  // 🔥 FIX 2: statusCode (CamelCase) use kiya
  let { statusCode = 500, message = "Something Went wrong" } = err;

  // Console mein error print karna zaroori hai taaki aapko pata chale backend mein kya fata
  console.error(`[ERROR] ${statusCode}:`, message);

  res.status(statusCode).json({ message });
});

// ---------------------------------------------------------
// 🔥 FIX 3: app.listen hamesha sabse aakhri mein aayega!
// ---------------------------------------------------------
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
