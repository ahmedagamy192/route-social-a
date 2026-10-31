import app from "./index.js";
import { PORT } from "./config/env.js";

const port = PORT || 3000;

app.listen(port, () => {
  console.log(`app work at http://localhost:${port}`);
});
