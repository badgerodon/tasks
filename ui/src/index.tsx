import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";

import "tailwindcss/dist/tailwind-dark.css";

import { GrpcWebImpl, TasksClientImpl } from "./pb/tasks";

const rpc = new GrpcWebImpl(location.origin, {});
const client = new TasksClientImpl(rpc);

(async function () {
  for (let i = 0; i < 100; i++) {
    await client.SubmitTask({
      queueId: "QUEUE-1",
      name: `TASK-${i}`,
    });
  }

  const res = await client.ListTasks({});
  console.log("RESULT", res);
})();

ReactDOM.render(<App />, document.getElementById("root"));
