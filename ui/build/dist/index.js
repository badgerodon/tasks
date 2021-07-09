import React from "../_snowpack/pkg/react.js";
import ReactDOM from "../_snowpack/pkg/react-dom.js";
import App from "./components/App.js";
import "../_snowpack/pkg/tailwindcss/dist/tailwind-dark.css";
import {GrpcWebImpl, TasksClientImpl} from "./pb/tasks.js";
const rpc = new GrpcWebImpl(location.origin, {});
const client = new TasksClientImpl(rpc);
(async function() {
  for (let i = 0; i < 100; i++) {
    await client.SubmitTask({
      queueId: "QUEUE-1",
      name: `TASK-${i}`
    });
  }
  const res = await client.ListTasks({});
  console.log("RESULT", res);
})();
ReactDOM.render(/* @__PURE__ */ React.createElement(App, null), document.getElementById("root"));
