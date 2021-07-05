import {
  TwirpContext,
  TwirpServer,
  RouterEvents,
  TwirpError,
  TwirpErrorCode,
  Interceptor,
  TwirpContentType,
  chainInterceptors,
} from "twirp-ts";
import {
  DeleteTaskRequest,
  GetTaskRequest,
  GetTaskResponse,
  ListTasksRequest,
  ListTasksResponse,
  CompleteTaskRequest,
  LeaseTaskRequest,
  LeaseTaskResponse,
  RenewTaskLeaseRequest,
  SubmitTaskRequest,
  AppendTaskLogsRequest,
  GetTaskLogsRequest,
  GetTaskLogsResponse,
} from "./tasks";
import { Empty } from "./google/protobuf/empty";

//==================================//
//          Client Code             //
//==================================//

interface Rpc {
  request(
    service: string,
    method: string,
    contentType: "application/json" | "application/protobuf",
    data: object | Uint8Array
  ): Promise<object | Uint8Array>;
}

export interface TasksClient {
  DeleteTask(request: DeleteTaskRequest): Promise<Empty>;
  GetTask(request: GetTaskRequest): Promise<GetTaskResponse>;
  ListTasks(request: ListTasksRequest): Promise<ListTasksResponse>;
  CompleteTask(request: CompleteTaskRequest): Promise<Empty>;
  LeaseTask(request: LeaseTaskRequest): Promise<LeaseTaskResponse>;
  RenewTaskLease(request: RenewTaskLeaseRequest): Promise<Empty>;
  SubmitTask(request: SubmitTaskRequest): Promise<Empty>;
  AppendTaskLogs(request: AppendTaskLogsRequest): Promise<Empty>;
  GetTaskLogs(request: GetTaskLogsRequest): Promise<GetTaskLogsResponse>;
}

export class TasksClientJSON implements TasksClient {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.DeleteTask.bind(this);
    this.GetTask.bind(this);
    this.ListTasks.bind(this);
    this.CompleteTask.bind(this);
    this.LeaseTask.bind(this);
    this.RenewTaskLease.bind(this);
    this.SubmitTask.bind(this);
    this.AppendTaskLogs.bind(this);
    this.GetTaskLogs.bind(this);
  }
  DeleteTask(request: DeleteTaskRequest): Promise<Empty> {
    const data = DeleteTaskRequest.toJson(request, { useProtoFieldName: true });
    const promise = this.rpc.request(
      "badgerodon.tasks.Tasks",
      "DeleteTask",
      "application/json",
      data as object
    );
    return promise.then((data) =>
      Empty.fromJson(data as any, { ignoreUnknownFields: true })
    );
  }

  GetTask(request: GetTaskRequest): Promise<GetTaskResponse> {
    const data = GetTaskRequest.toJson(request, { useProtoFieldName: true });
    const promise = this.rpc.request(
      "badgerodon.tasks.Tasks",
      "GetTask",
      "application/json",
      data as object
    );
    return promise.then((data) =>
      GetTaskResponse.fromJson(data as any, { ignoreUnknownFields: true })
    );
  }

  ListTasks(request: ListTasksRequest): Promise<ListTasksResponse> {
    const data = ListTasksRequest.toJson(request, { useProtoFieldName: true });
    const promise = this.rpc.request(
      "badgerodon.tasks.Tasks",
      "ListTasks",
      "application/json",
      data as object
    );
    return promise.then((data) =>
      ListTasksResponse.fromJson(data as any, { ignoreUnknownFields: true })
    );
  }

  CompleteTask(request: CompleteTaskRequest): Promise<Empty> {
    const data = CompleteTaskRequest.toJson(request, {
      useProtoFieldName: true,
    });
    const promise = this.rpc.request(
      "badgerodon.tasks.Tasks",
      "CompleteTask",
      "application/json",
      data as object
    );
    return promise.then((data) =>
      Empty.fromJson(data as any, { ignoreUnknownFields: true })
    );
  }

  LeaseTask(request: LeaseTaskRequest): Promise<LeaseTaskResponse> {
    const data = LeaseTaskRequest.toJson(request, { useProtoFieldName: true });
    const promise = this.rpc.request(
      "badgerodon.tasks.Tasks",
      "LeaseTask",
      "application/json",
      data as object
    );
    return promise.then((data) =>
      LeaseTaskResponse.fromJson(data as any, { ignoreUnknownFields: true })
    );
  }

  RenewTaskLease(request: RenewTaskLeaseRequest): Promise<Empty> {
    const data = RenewTaskLeaseRequest.toJson(request, {
      useProtoFieldName: true,
    });
    const promise = this.rpc.request(
      "badgerodon.tasks.Tasks",
      "RenewTaskLease",
      "application/json",
      data as object
    );
    return promise.then((data) =>
      Empty.fromJson(data as any, { ignoreUnknownFields: true })
    );
  }

  SubmitTask(request: SubmitTaskRequest): Promise<Empty> {
    const data = SubmitTaskRequest.toJson(request, { useProtoFieldName: true });
    const promise = this.rpc.request(
      "badgerodon.tasks.Tasks",
      "SubmitTask",
      "application/json",
      data as object
    );
    return promise.then((data) =>
      Empty.fromJson(data as any, { ignoreUnknownFields: true })
    );
  }

  AppendTaskLogs(request: AppendTaskLogsRequest): Promise<Empty> {
    const data = AppendTaskLogsRequest.toJson(request, {
      useProtoFieldName: true,
    });
    const promise = this.rpc.request(
      "badgerodon.tasks.Tasks",
      "AppendTaskLogs",
      "application/json",
      data as object
    );
    return promise.then((data) =>
      Empty.fromJson(data as any, { ignoreUnknownFields: true })
    );
  }

  GetTaskLogs(request: GetTaskLogsRequest): Promise<GetTaskLogsResponse> {
    const data = GetTaskLogsRequest.toJson(request, {
      useProtoFieldName: true,
    });
    const promise = this.rpc.request(
      "badgerodon.tasks.Tasks",
      "GetTaskLogs",
      "application/json",
      data as object
    );
    return promise.then((data) =>
      GetTaskLogsResponse.fromJson(data as any, { ignoreUnknownFields: true })
    );
  }
}

export class TasksClientProtobuf implements TasksClient {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.DeleteTask.bind(this);
    this.GetTask.bind(this);
    this.ListTasks.bind(this);
    this.CompleteTask.bind(this);
    this.LeaseTask.bind(this);
    this.RenewTaskLease.bind(this);
    this.SubmitTask.bind(this);
    this.AppendTaskLogs.bind(this);
    this.GetTaskLogs.bind(this);
  }
  DeleteTask(request: DeleteTaskRequest): Promise<Empty> {
    const data = DeleteTaskRequest.toBinary(request);
    const promise = this.rpc.request(
      "badgerodon.tasks.Tasks",
      "DeleteTask",
      "application/protobuf",
      data
    );
    return promise.then((data) => Empty.fromBinary(data as Uint8Array));
  }

  GetTask(request: GetTaskRequest): Promise<GetTaskResponse> {
    const data = GetTaskRequest.toBinary(request);
    const promise = this.rpc.request(
      "badgerodon.tasks.Tasks",
      "GetTask",
      "application/protobuf",
      data
    );
    return promise.then((data) =>
      GetTaskResponse.fromBinary(data as Uint8Array)
    );
  }

  ListTasks(request: ListTasksRequest): Promise<ListTasksResponse> {
    const data = ListTasksRequest.toBinary(request);
    const promise = this.rpc.request(
      "badgerodon.tasks.Tasks",
      "ListTasks",
      "application/protobuf",
      data
    );
    return promise.then((data) =>
      ListTasksResponse.fromBinary(data as Uint8Array)
    );
  }

  CompleteTask(request: CompleteTaskRequest): Promise<Empty> {
    const data = CompleteTaskRequest.toBinary(request);
    const promise = this.rpc.request(
      "badgerodon.tasks.Tasks",
      "CompleteTask",
      "application/protobuf",
      data
    );
    return promise.then((data) => Empty.fromBinary(data as Uint8Array));
  }

  LeaseTask(request: LeaseTaskRequest): Promise<LeaseTaskResponse> {
    const data = LeaseTaskRequest.toBinary(request);
    const promise = this.rpc.request(
      "badgerodon.tasks.Tasks",
      "LeaseTask",
      "application/protobuf",
      data
    );
    return promise.then((data) =>
      LeaseTaskResponse.fromBinary(data as Uint8Array)
    );
  }

  RenewTaskLease(request: RenewTaskLeaseRequest): Promise<Empty> {
    const data = RenewTaskLeaseRequest.toBinary(request);
    const promise = this.rpc.request(
      "badgerodon.tasks.Tasks",
      "RenewTaskLease",
      "application/protobuf",
      data
    );
    return promise.then((data) => Empty.fromBinary(data as Uint8Array));
  }

  SubmitTask(request: SubmitTaskRequest): Promise<Empty> {
    const data = SubmitTaskRequest.toBinary(request);
    const promise = this.rpc.request(
      "badgerodon.tasks.Tasks",
      "SubmitTask",
      "application/protobuf",
      data
    );
    return promise.then((data) => Empty.fromBinary(data as Uint8Array));
  }

  AppendTaskLogs(request: AppendTaskLogsRequest): Promise<Empty> {
    const data = AppendTaskLogsRequest.toBinary(request);
    const promise = this.rpc.request(
      "badgerodon.tasks.Tasks",
      "AppendTaskLogs",
      "application/protobuf",
      data
    );
    return promise.then((data) => Empty.fromBinary(data as Uint8Array));
  }

  GetTaskLogs(request: GetTaskLogsRequest): Promise<GetTaskLogsResponse> {
    const data = GetTaskLogsRequest.toBinary(request);
    const promise = this.rpc.request(
      "badgerodon.tasks.Tasks",
      "GetTaskLogs",
      "application/protobuf",
      data
    );
    return promise.then((data) =>
      GetTaskLogsResponse.fromBinary(data as Uint8Array)
    );
  }
}

//==================================//
//          Server Code             //
//==================================//

export interface TasksTwirp<T extends TwirpContext = TwirpContext> {
  DeleteTask(ctx: T, request: DeleteTaskRequest): Promise<Empty>;
  GetTask(ctx: T, request: GetTaskRequest): Promise<GetTaskResponse>;
  ListTasks(ctx: T, request: ListTasksRequest): Promise<ListTasksResponse>;
  CompleteTask(ctx: T, request: CompleteTaskRequest): Promise<Empty>;
  LeaseTask(ctx: T, request: LeaseTaskRequest): Promise<LeaseTaskResponse>;
  RenewTaskLease(ctx: T, request: RenewTaskLeaseRequest): Promise<Empty>;
  SubmitTask(ctx: T, request: SubmitTaskRequest): Promise<Empty>;
  AppendTaskLogs(ctx: T, request: AppendTaskLogsRequest): Promise<Empty>;
  GetTaskLogs(
    ctx: T,
    request: GetTaskLogsRequest
  ): Promise<GetTaskLogsResponse>;
}

export enum TasksMethod {
  DeleteTask = "DeleteTask",
  GetTask = "GetTask",
  ListTasks = "ListTasks",
  CompleteTask = "CompleteTask",
  LeaseTask = "LeaseTask",
  RenewTaskLease = "RenewTaskLease",
  SubmitTask = "SubmitTask",
  AppendTaskLogs = "AppendTaskLogs",
  GetTaskLogs = "GetTaskLogs",
}

export const TasksMethodList = [
  TasksMethod.DeleteTask,
  TasksMethod.GetTask,
  TasksMethod.ListTasks,
  TasksMethod.CompleteTask,
  TasksMethod.LeaseTask,
  TasksMethod.RenewTaskLease,
  TasksMethod.SubmitTask,
  TasksMethod.AppendTaskLogs,
  TasksMethod.GetTaskLogs,
];

export function createTasksServer<T extends TwirpContext = TwirpContext>(
  service: TasksTwirp<T>
) {
  return new TwirpServer<TasksTwirp, T>({
    service,
    packageName: "badgerodon.tasks",
    serviceName: "Tasks",
    methodList: TasksMethodList,
    matchRoute: matchTasksRoute,
  });
}

function matchTasksRoute<T extends TwirpContext = TwirpContext>(
  method: string,
  events: RouterEvents<T>
) {
  switch (method) {
    case "DeleteTask":
      return async (
        ctx: T,
        service: TasksTwirp,
        data: Buffer,
        interceptors?: Interceptor<T, DeleteTaskRequest, Empty>[]
      ) => {
        ctx = { ...ctx, methodName: "DeleteTask" };
        await events.onMatch(ctx);
        return handleDeleteTaskRequest(ctx, service, data, interceptors);
      };
    case "GetTask":
      return async (
        ctx: T,
        service: TasksTwirp,
        data: Buffer,
        interceptors?: Interceptor<T, GetTaskRequest, GetTaskResponse>[]
      ) => {
        ctx = { ...ctx, methodName: "GetTask" };
        await events.onMatch(ctx);
        return handleGetTaskRequest(ctx, service, data, interceptors);
      };
    case "ListTasks":
      return async (
        ctx: T,
        service: TasksTwirp,
        data: Buffer,
        interceptors?: Interceptor<T, ListTasksRequest, ListTasksResponse>[]
      ) => {
        ctx = { ...ctx, methodName: "ListTasks" };
        await events.onMatch(ctx);
        return handleListTasksRequest(ctx, service, data, interceptors);
      };
    case "CompleteTask":
      return async (
        ctx: T,
        service: TasksTwirp,
        data: Buffer,
        interceptors?: Interceptor<T, CompleteTaskRequest, Empty>[]
      ) => {
        ctx = { ...ctx, methodName: "CompleteTask" };
        await events.onMatch(ctx);
        return handleCompleteTaskRequest(ctx, service, data, interceptors);
      };
    case "LeaseTask":
      return async (
        ctx: T,
        service: TasksTwirp,
        data: Buffer,
        interceptors?: Interceptor<T, LeaseTaskRequest, LeaseTaskResponse>[]
      ) => {
        ctx = { ...ctx, methodName: "LeaseTask" };
        await events.onMatch(ctx);
        return handleLeaseTaskRequest(ctx, service, data, interceptors);
      };
    case "RenewTaskLease":
      return async (
        ctx: T,
        service: TasksTwirp,
        data: Buffer,
        interceptors?: Interceptor<T, RenewTaskLeaseRequest, Empty>[]
      ) => {
        ctx = { ...ctx, methodName: "RenewTaskLease" };
        await events.onMatch(ctx);
        return handleRenewTaskLeaseRequest(ctx, service, data, interceptors);
      };
    case "SubmitTask":
      return async (
        ctx: T,
        service: TasksTwirp,
        data: Buffer,
        interceptors?: Interceptor<T, SubmitTaskRequest, Empty>[]
      ) => {
        ctx = { ...ctx, methodName: "SubmitTask" };
        await events.onMatch(ctx);
        return handleSubmitTaskRequest(ctx, service, data, interceptors);
      };
    case "AppendTaskLogs":
      return async (
        ctx: T,
        service: TasksTwirp,
        data: Buffer,
        interceptors?: Interceptor<T, AppendTaskLogsRequest, Empty>[]
      ) => {
        ctx = { ...ctx, methodName: "AppendTaskLogs" };
        await events.onMatch(ctx);
        return handleAppendTaskLogsRequest(ctx, service, data, interceptors);
      };
    case "GetTaskLogs":
      return async (
        ctx: T,
        service: TasksTwirp,
        data: Buffer,
        interceptors?: Interceptor<T, GetTaskLogsRequest, GetTaskLogsResponse>[]
      ) => {
        ctx = { ...ctx, methodName: "GetTaskLogs" };
        await events.onMatch(ctx);
        return handleGetTaskLogsRequest(ctx, service, data, interceptors);
      };
    default:
      events.onNotFound();
      const msg = `no handler found`;
      throw new TwirpError(TwirpErrorCode.BadRoute, msg);
  }
}

function handleDeleteTaskRequest<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, DeleteTaskRequest, Empty>[]
): Promise<string | Uint8Array> {
  switch (ctx.contentType) {
    case TwirpContentType.JSON:
      return handleDeleteTaskJSON<T>(ctx, service, data, interceptors);
    case TwirpContentType.Protobuf:
      return handleDeleteTaskProtobuf<T>(ctx, service, data, interceptors);
    default:
      const msg = "unexpected Content-Type";
      throw new TwirpError(TwirpErrorCode.BadRoute, msg);
  }
}

function handleGetTaskRequest<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, GetTaskRequest, GetTaskResponse>[]
): Promise<string | Uint8Array> {
  switch (ctx.contentType) {
    case TwirpContentType.JSON:
      return handleGetTaskJSON<T>(ctx, service, data, interceptors);
    case TwirpContentType.Protobuf:
      return handleGetTaskProtobuf<T>(ctx, service, data, interceptors);
    default:
      const msg = "unexpected Content-Type";
      throw new TwirpError(TwirpErrorCode.BadRoute, msg);
  }
}

function handleListTasksRequest<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, ListTasksRequest, ListTasksResponse>[]
): Promise<string | Uint8Array> {
  switch (ctx.contentType) {
    case TwirpContentType.JSON:
      return handleListTasksJSON<T>(ctx, service, data, interceptors);
    case TwirpContentType.Protobuf:
      return handleListTasksProtobuf<T>(ctx, service, data, interceptors);
    default:
      const msg = "unexpected Content-Type";
      throw new TwirpError(TwirpErrorCode.BadRoute, msg);
  }
}

function handleCompleteTaskRequest<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, CompleteTaskRequest, Empty>[]
): Promise<string | Uint8Array> {
  switch (ctx.contentType) {
    case TwirpContentType.JSON:
      return handleCompleteTaskJSON<T>(ctx, service, data, interceptors);
    case TwirpContentType.Protobuf:
      return handleCompleteTaskProtobuf<T>(ctx, service, data, interceptors);
    default:
      const msg = "unexpected Content-Type";
      throw new TwirpError(TwirpErrorCode.BadRoute, msg);
  }
}

function handleLeaseTaskRequest<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, LeaseTaskRequest, LeaseTaskResponse>[]
): Promise<string | Uint8Array> {
  switch (ctx.contentType) {
    case TwirpContentType.JSON:
      return handleLeaseTaskJSON<T>(ctx, service, data, interceptors);
    case TwirpContentType.Protobuf:
      return handleLeaseTaskProtobuf<T>(ctx, service, data, interceptors);
    default:
      const msg = "unexpected Content-Type";
      throw new TwirpError(TwirpErrorCode.BadRoute, msg);
  }
}

function handleRenewTaskLeaseRequest<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, RenewTaskLeaseRequest, Empty>[]
): Promise<string | Uint8Array> {
  switch (ctx.contentType) {
    case TwirpContentType.JSON:
      return handleRenewTaskLeaseJSON<T>(ctx, service, data, interceptors);
    case TwirpContentType.Protobuf:
      return handleRenewTaskLeaseProtobuf<T>(ctx, service, data, interceptors);
    default:
      const msg = "unexpected Content-Type";
      throw new TwirpError(TwirpErrorCode.BadRoute, msg);
  }
}

function handleSubmitTaskRequest<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, SubmitTaskRequest, Empty>[]
): Promise<string | Uint8Array> {
  switch (ctx.contentType) {
    case TwirpContentType.JSON:
      return handleSubmitTaskJSON<T>(ctx, service, data, interceptors);
    case TwirpContentType.Protobuf:
      return handleSubmitTaskProtobuf<T>(ctx, service, data, interceptors);
    default:
      const msg = "unexpected Content-Type";
      throw new TwirpError(TwirpErrorCode.BadRoute, msg);
  }
}

function handleAppendTaskLogsRequest<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, AppendTaskLogsRequest, Empty>[]
): Promise<string | Uint8Array> {
  switch (ctx.contentType) {
    case TwirpContentType.JSON:
      return handleAppendTaskLogsJSON<T>(ctx, service, data, interceptors);
    case TwirpContentType.Protobuf:
      return handleAppendTaskLogsProtobuf<T>(ctx, service, data, interceptors);
    default:
      const msg = "unexpected Content-Type";
      throw new TwirpError(TwirpErrorCode.BadRoute, msg);
  }
}

function handleGetTaskLogsRequest<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, GetTaskLogsRequest, GetTaskLogsResponse>[]
): Promise<string | Uint8Array> {
  switch (ctx.contentType) {
    case TwirpContentType.JSON:
      return handleGetTaskLogsJSON<T>(ctx, service, data, interceptors);
    case TwirpContentType.Protobuf:
      return handleGetTaskLogsProtobuf<T>(ctx, service, data, interceptors);
    default:
      const msg = "unexpected Content-Type";
      throw new TwirpError(TwirpErrorCode.BadRoute, msg);
  }
}
async function handleDeleteTaskJSON<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, DeleteTaskRequest, Empty>[]
) {
  let request: DeleteTaskRequest;
  let response: Empty;

  try {
    const body = JSON.parse(data.toString() || "{}");
    request = DeleteTaskRequest.fromJson(body, { ignoreUnknownFields: true });
  } catch (e) {
    const msg = "the json request could not be decoded";
    throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      DeleteTaskRequest,
      Empty
    >;
    response = await interceptor(ctx, request, (ctx, inputReq) => {
      return service.DeleteTask(ctx, inputReq);
    });
  } else {
    response = await service.DeleteTask(ctx, request);
  }

  return JSON.stringify(
    Empty.toJson(response, { useProtoFieldName: true }) as string
  );
}

async function handleGetTaskJSON<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, GetTaskRequest, GetTaskResponse>[]
) {
  let request: GetTaskRequest;
  let response: GetTaskResponse;

  try {
    const body = JSON.parse(data.toString() || "{}");
    request = GetTaskRequest.fromJson(body, { ignoreUnknownFields: true });
  } catch (e) {
    const msg = "the json request could not be decoded";
    throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      GetTaskRequest,
      GetTaskResponse
    >;
    response = await interceptor(ctx, request, (ctx, inputReq) => {
      return service.GetTask(ctx, inputReq);
    });
  } else {
    response = await service.GetTask(ctx, request);
  }

  return JSON.stringify(
    GetTaskResponse.toJson(response, { useProtoFieldName: true }) as string
  );
}

async function handleListTasksJSON<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, ListTasksRequest, ListTasksResponse>[]
) {
  let request: ListTasksRequest;
  let response: ListTasksResponse;

  try {
    const body = JSON.parse(data.toString() || "{}");
    request = ListTasksRequest.fromJson(body, { ignoreUnknownFields: true });
  } catch (e) {
    const msg = "the json request could not be decoded";
    throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      ListTasksRequest,
      ListTasksResponse
    >;
    response = await interceptor(ctx, request, (ctx, inputReq) => {
      return service.ListTasks(ctx, inputReq);
    });
  } else {
    response = await service.ListTasks(ctx, request);
  }

  return JSON.stringify(
    ListTasksResponse.toJson(response, { useProtoFieldName: true }) as string
  );
}

async function handleCompleteTaskJSON<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, CompleteTaskRequest, Empty>[]
) {
  let request: CompleteTaskRequest;
  let response: Empty;

  try {
    const body = JSON.parse(data.toString() || "{}");
    request = CompleteTaskRequest.fromJson(body, { ignoreUnknownFields: true });
  } catch (e) {
    const msg = "the json request could not be decoded";
    throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      CompleteTaskRequest,
      Empty
    >;
    response = await interceptor(ctx, request, (ctx, inputReq) => {
      return service.CompleteTask(ctx, inputReq);
    });
  } else {
    response = await service.CompleteTask(ctx, request);
  }

  return JSON.stringify(
    Empty.toJson(response, { useProtoFieldName: true }) as string
  );
}

async function handleLeaseTaskJSON<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, LeaseTaskRequest, LeaseTaskResponse>[]
) {
  let request: LeaseTaskRequest;
  let response: LeaseTaskResponse;

  try {
    const body = JSON.parse(data.toString() || "{}");
    request = LeaseTaskRequest.fromJson(body, { ignoreUnknownFields: true });
  } catch (e) {
    const msg = "the json request could not be decoded";
    throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      LeaseTaskRequest,
      LeaseTaskResponse
    >;
    response = await interceptor(ctx, request, (ctx, inputReq) => {
      return service.LeaseTask(ctx, inputReq);
    });
  } else {
    response = await service.LeaseTask(ctx, request);
  }

  return JSON.stringify(
    LeaseTaskResponse.toJson(response, { useProtoFieldName: true }) as string
  );
}

async function handleRenewTaskLeaseJSON<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, RenewTaskLeaseRequest, Empty>[]
) {
  let request: RenewTaskLeaseRequest;
  let response: Empty;

  try {
    const body = JSON.parse(data.toString() || "{}");
    request = RenewTaskLeaseRequest.fromJson(body, {
      ignoreUnknownFields: true,
    });
  } catch (e) {
    const msg = "the json request could not be decoded";
    throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      RenewTaskLeaseRequest,
      Empty
    >;
    response = await interceptor(ctx, request, (ctx, inputReq) => {
      return service.RenewTaskLease(ctx, inputReq);
    });
  } else {
    response = await service.RenewTaskLease(ctx, request);
  }

  return JSON.stringify(
    Empty.toJson(response, { useProtoFieldName: true }) as string
  );
}

async function handleSubmitTaskJSON<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, SubmitTaskRequest, Empty>[]
) {
  let request: SubmitTaskRequest;
  let response: Empty;

  try {
    const body = JSON.parse(data.toString() || "{}");
    request = SubmitTaskRequest.fromJson(body, { ignoreUnknownFields: true });
  } catch (e) {
    const msg = "the json request could not be decoded";
    throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      SubmitTaskRequest,
      Empty
    >;
    response = await interceptor(ctx, request, (ctx, inputReq) => {
      return service.SubmitTask(ctx, inputReq);
    });
  } else {
    response = await service.SubmitTask(ctx, request);
  }

  return JSON.stringify(
    Empty.toJson(response, { useProtoFieldName: true }) as string
  );
}

async function handleAppendTaskLogsJSON<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, AppendTaskLogsRequest, Empty>[]
) {
  let request: AppendTaskLogsRequest;
  let response: Empty;

  try {
    const body = JSON.parse(data.toString() || "{}");
    request = AppendTaskLogsRequest.fromJson(body, {
      ignoreUnknownFields: true,
    });
  } catch (e) {
    const msg = "the json request could not be decoded";
    throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      AppendTaskLogsRequest,
      Empty
    >;
    response = await interceptor(ctx, request, (ctx, inputReq) => {
      return service.AppendTaskLogs(ctx, inputReq);
    });
  } else {
    response = await service.AppendTaskLogs(ctx, request);
  }

  return JSON.stringify(
    Empty.toJson(response, { useProtoFieldName: true }) as string
  );
}

async function handleGetTaskLogsJSON<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, GetTaskLogsRequest, GetTaskLogsResponse>[]
) {
  let request: GetTaskLogsRequest;
  let response: GetTaskLogsResponse;

  try {
    const body = JSON.parse(data.toString() || "{}");
    request = GetTaskLogsRequest.fromJson(body, { ignoreUnknownFields: true });
  } catch (e) {
    const msg = "the json request could not be decoded";
    throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      GetTaskLogsRequest,
      GetTaskLogsResponse
    >;
    response = await interceptor(ctx, request, (ctx, inputReq) => {
      return service.GetTaskLogs(ctx, inputReq);
    });
  } else {
    response = await service.GetTaskLogs(ctx, request);
  }

  return JSON.stringify(
    GetTaskLogsResponse.toJson(response, { useProtoFieldName: true }) as string
  );
}
async function handleDeleteTaskProtobuf<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, DeleteTaskRequest, Empty>[]
) {
  let request: DeleteTaskRequest;
  let response: Empty;

  try {
    request = DeleteTaskRequest.fromBinary(data);
  } catch (e) {
    const msg = "the protobuf request could not be decoded";
    throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      DeleteTaskRequest,
      Empty
    >;
    response = await interceptor(ctx, request, (ctx, inputReq) => {
      return service.DeleteTask(ctx, inputReq);
    });
  } else {
    response = await service.DeleteTask(ctx, request);
  }

  return Buffer.from(Empty.toBinary(response));
}

async function handleGetTaskProtobuf<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, GetTaskRequest, GetTaskResponse>[]
) {
  let request: GetTaskRequest;
  let response: GetTaskResponse;

  try {
    request = GetTaskRequest.fromBinary(data);
  } catch (e) {
    const msg = "the protobuf request could not be decoded";
    throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      GetTaskRequest,
      GetTaskResponse
    >;
    response = await interceptor(ctx, request, (ctx, inputReq) => {
      return service.GetTask(ctx, inputReq);
    });
  } else {
    response = await service.GetTask(ctx, request);
  }

  return Buffer.from(GetTaskResponse.toBinary(response));
}

async function handleListTasksProtobuf<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, ListTasksRequest, ListTasksResponse>[]
) {
  let request: ListTasksRequest;
  let response: ListTasksResponse;

  try {
    request = ListTasksRequest.fromBinary(data);
  } catch (e) {
    const msg = "the protobuf request could not be decoded";
    throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      ListTasksRequest,
      ListTasksResponse
    >;
    response = await interceptor(ctx, request, (ctx, inputReq) => {
      return service.ListTasks(ctx, inputReq);
    });
  } else {
    response = await service.ListTasks(ctx, request);
  }

  return Buffer.from(ListTasksResponse.toBinary(response));
}

async function handleCompleteTaskProtobuf<
  T extends TwirpContext = TwirpContext
>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, CompleteTaskRequest, Empty>[]
) {
  let request: CompleteTaskRequest;
  let response: Empty;

  try {
    request = CompleteTaskRequest.fromBinary(data);
  } catch (e) {
    const msg = "the protobuf request could not be decoded";
    throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      CompleteTaskRequest,
      Empty
    >;
    response = await interceptor(ctx, request, (ctx, inputReq) => {
      return service.CompleteTask(ctx, inputReq);
    });
  } else {
    response = await service.CompleteTask(ctx, request);
  }

  return Buffer.from(Empty.toBinary(response));
}

async function handleLeaseTaskProtobuf<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, LeaseTaskRequest, LeaseTaskResponse>[]
) {
  let request: LeaseTaskRequest;
  let response: LeaseTaskResponse;

  try {
    request = LeaseTaskRequest.fromBinary(data);
  } catch (e) {
    const msg = "the protobuf request could not be decoded";
    throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      LeaseTaskRequest,
      LeaseTaskResponse
    >;
    response = await interceptor(ctx, request, (ctx, inputReq) => {
      return service.LeaseTask(ctx, inputReq);
    });
  } else {
    response = await service.LeaseTask(ctx, request);
  }

  return Buffer.from(LeaseTaskResponse.toBinary(response));
}

async function handleRenewTaskLeaseProtobuf<
  T extends TwirpContext = TwirpContext
>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, RenewTaskLeaseRequest, Empty>[]
) {
  let request: RenewTaskLeaseRequest;
  let response: Empty;

  try {
    request = RenewTaskLeaseRequest.fromBinary(data);
  } catch (e) {
    const msg = "the protobuf request could not be decoded";
    throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      RenewTaskLeaseRequest,
      Empty
    >;
    response = await interceptor(ctx, request, (ctx, inputReq) => {
      return service.RenewTaskLease(ctx, inputReq);
    });
  } else {
    response = await service.RenewTaskLease(ctx, request);
  }

  return Buffer.from(Empty.toBinary(response));
}

async function handleSubmitTaskProtobuf<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, SubmitTaskRequest, Empty>[]
) {
  let request: SubmitTaskRequest;
  let response: Empty;

  try {
    request = SubmitTaskRequest.fromBinary(data);
  } catch (e) {
    const msg = "the protobuf request could not be decoded";
    throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      SubmitTaskRequest,
      Empty
    >;
    response = await interceptor(ctx, request, (ctx, inputReq) => {
      return service.SubmitTask(ctx, inputReq);
    });
  } else {
    response = await service.SubmitTask(ctx, request);
  }

  return Buffer.from(Empty.toBinary(response));
}

async function handleAppendTaskLogsProtobuf<
  T extends TwirpContext = TwirpContext
>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, AppendTaskLogsRequest, Empty>[]
) {
  let request: AppendTaskLogsRequest;
  let response: Empty;

  try {
    request = AppendTaskLogsRequest.fromBinary(data);
  } catch (e) {
    const msg = "the protobuf request could not be decoded";
    throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      AppendTaskLogsRequest,
      Empty
    >;
    response = await interceptor(ctx, request, (ctx, inputReq) => {
      return service.AppendTaskLogs(ctx, inputReq);
    });
  } else {
    response = await service.AppendTaskLogs(ctx, request);
  }

  return Buffer.from(Empty.toBinary(response));
}

async function handleGetTaskLogsProtobuf<T extends TwirpContext = TwirpContext>(
  ctx: T,
  service: TasksTwirp,
  data: Buffer,
  interceptors?: Interceptor<T, GetTaskLogsRequest, GetTaskLogsResponse>[]
) {
  let request: GetTaskLogsRequest;
  let response: GetTaskLogsResponse;

  try {
    request = GetTaskLogsRequest.fromBinary(data);
  } catch (e) {
    const msg = "the protobuf request could not be decoded";
    throw new TwirpError(TwirpErrorCode.Malformed, msg).withCause(e, true);
  }

  if (interceptors && interceptors.length > 0) {
    const interceptor = chainInterceptors(...interceptors) as Interceptor<
      T,
      GetTaskLogsRequest,
      GetTaskLogsResponse
    >;
    response = await interceptor(ctx, request, (ctx, inputReq) => {
      return service.GetTaskLogs(ctx, inputReq);
    });
  } else {
    response = await service.GetTaskLogs(ctx, request);
  }

  return Buffer.from(GetTaskLogsResponse.toBinary(response));
}
