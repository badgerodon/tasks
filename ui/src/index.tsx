import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import axios from "axios";

import "tailwindcss/dist/tailwind-dark.css";

import { TasksClientJSON } from "./pb/tasks.twirp";
import type { Rpc } from "twirp-ts";
import { ListTasksRequest } from "./pb/tasks";

const rpc: Rpc = {
  async request(
    service,
    method,
    contentType,
    data
  ): Promise<Object | Uint8Array> {
    const client = axios.create({
      baseURL: "http://localhost:8080/twirp",
    });
    const response = await client.post(`${service}/${method}`, data, {
      responseType:
        contentType === "application/protobuf" ? "arraybuffer" : "json",
      headers: {
        "content-type": contentType,
      },
    });
    return response.data;
  },
};
const client = new TasksClientJSON(rpc);

(async function () {
  const res = await client.ListTasks({
    queueId: "",
    pageSize: 10,
    pageToken: "",
  });
  console.log("RESPONSE", res);
})();

ReactDOM.render(<App />, document.getElementById("root"));
