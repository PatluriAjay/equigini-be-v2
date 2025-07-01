const app = require("./app");

// Change port to 4000 to match frontend
const defaultPort = 4000;
const PORT = process.env.PORT || defaultPort;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server URL: http://localhost:${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
});
