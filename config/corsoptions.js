// const allowedOrigins = require("./allowedorigins");
// const corsoptions = {
//   origin: (origin, callback) => {
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   optionsSuccessStatus: 200,
// };
// module.exports = corsoptions;
// ...existing code...
const allowedOrigins = require("./allowedorigins");

const corsoptions = {
  origin: (origin, callback) => {
    // origin can be undefined for same-origin / tools like Postman — allow if undefined
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, origin || true); // echo origin so Access-Control-Allow-Origin === origin
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsoptions;
// ...existing code...