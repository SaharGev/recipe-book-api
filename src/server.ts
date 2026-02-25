// src/server.ts
import initApp from "./app";

const port = process.env.PORT;

initApp().then((app) => {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});

