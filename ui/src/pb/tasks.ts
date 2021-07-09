/* eslint-disable */
import { util, configure, Writer, Reader } from "protobufjs/minimal";
import * as Long from "long";
import { grpc } from "@improbable-eng/grpc-web";
import { Empty } from "./google/protobuf/empty";
import { BrowserHeaders } from "browser-headers";
import { Timestamp } from "./google/protobuf/timestamp";
import { Duration } from "./google/protobuf/duration";

export const protobufPackage = "badgerodon.tasks";

export interface Queue {
  /** ID is the queue id. */
  id: string;
  /** Name is the queue name. */
  name: string;
  /** RetryConfig indicates how the queue will handle task failure retries. */
  retryConfig: Queue_RetryConfig | undefined;
}

/** The RetryConfig contains fields for configuring task retries. */
export interface Queue_RetryConfig {
  /**
   * MaxAttempts is the maximum number of attempts before a task will be
   * considered failed.
   */
  maxAttempts: number;
  /** MaxDuration is the maximum duration for the task. */
  maxDuration: Duration | undefined;
  /** MinBackoff is the minimum backoff time. */
  minBackoff: Duration | undefined;
  /** MaxBackoff is the maximum backoff time. */
  maxBackoff: Duration | undefined;
}

/** A Task is a single unit of work. */
export interface Task {
  /**
   * ID is a unique identifier for the task. If not provided it is
   * generated.
   */
  id: string;
  /** QueueID is the queue for the task. */
  queueId: string;
  /** InitiatorType is either a user or a scheduled task. */
  initiatorType: Task_InitiatorType;
  /**
   * InitiatorId is the user id for user tasks, or the scheduled task id for
   * scheduled tasks.
   */
  initiatorId: string;
  /**
   * GroupID is used to tie tasks together. If a task kicks off another
   * task, that new task will have the same GroupID.
   */
  groupId: string;
  /** Status indicates the task's status. */
  status: Task_Status;
  /** Name is the task name. */
  name: string;
  /** CreatedAt indicates when the task was created. */
  createdAt: Date | undefined;
  /** ScheduledAt indicates when the task is scheduled to be run. */
  scheduledAt?: Date | undefined;
  /**
   * Deadline indicates when the task must be completed by (including retries)
   * before its considered failed.
   */
  deadline?: Date | undefined;
  /** Timeout is the maximum amount of time a single attempt can run. */
  timeout?: Duration | undefined;
  /**
   * MaxAttempts is the maximum number of attempts that will be made before a
   * task is considered failed
   */
  maxAttempts?: number | undefined;
  /** Attempts are all the attempts that have been made. (output-only) */
  attempts: Task_Attempt[];
}

export enum Task_InitiatorType {
  USER = 0,
  SCHEDULED_TASK = 1,
  UNRECOGNIZED = -1,
}

export function task_InitiatorTypeFromJSON(object: any): Task_InitiatorType {
  switch (object) {
    case 0:
    case "USER":
      return Task_InitiatorType.USER;
    case 1:
    case "SCHEDULED_TASK":
      return Task_InitiatorType.SCHEDULED_TASK;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Task_InitiatorType.UNRECOGNIZED;
  }
}

export function task_InitiatorTypeToJSON(object: Task_InitiatorType): string {
  switch (object) {
    case Task_InitiatorType.USER:
      return "USER";
    case Task_InitiatorType.SCHEDULED_TASK:
      return "SCHEDULED_TASK";
    default:
      return "UNKNOWN";
  }
}

export enum Task_Status {
  NEW = 0,
  LEASED = 1,
  COMPLETED = 2,
  FAILED = 3,
  UNRECOGNIZED = -1,
}

export function task_StatusFromJSON(object: any): Task_Status {
  switch (object) {
    case 0:
    case "NEW":
      return Task_Status.NEW;
    case 1:
    case "LEASED":
      return Task_Status.LEASED;
    case 2:
    case "COMPLETED":
      return Task_Status.COMPLETED;
    case 3:
    case "FAILED":
      return Task_Status.FAILED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return Task_Status.UNRECOGNIZED;
  }
}

export function task_StatusToJSON(object: Task_Status): string {
  switch (object) {
    case Task_Status.NEW:
      return "NEW";
    case Task_Status.LEASED:
      return "LEASED";
    case Task_Status.COMPLETED:
      return "COMPLETED";
    case Task_Status.FAILED:
      return "FAILED";
    default:
      return "UNKNOWN";
  }
}

/** An Attempt is a single attempt at running a task. */
export interface Task_Attempt {
  /** ScheduledAt is when the attempt was scheduled. */
  scheduledAt: Date | undefined;
  /** LeasedAt is when the attempt was leased by a worker. */
  leasedAt: Date | undefined;
  /** CompletedAt is when the attempt was completed succesfully. */
  completedAt?: Date | undefined;
  /** FailedAt is when the attempt was failed. */
  failedAt?: Date | undefined;
  /** FailedMessage is the reason for the failure. */
  failedReason?: string | undefined;
}

export interface AppendTaskLogsRequest {
  taskId: string;
  logs: string[];
}

export interface CompleteTaskRequest {
  leaseId: string;
}

export interface DeleteTaskRequest {
  taskId: string;
}

export interface GetTaskRequest {
  taskId: string;
}

export interface GetTaskResponse {
  task: Task | undefined;
}

export interface GetTaskLogsRequest {
  taskId: string;
}

export interface GetTaskLogsResponse {
  logs: string[];
}

export interface FailTaskRequest {
  leaseId: string;
  errorMessage: string;
}

export interface LeaseTaskRequest {
  queueId: string;
  duration: Duration | undefined;
}

export interface LeaseTaskResponse {
  leaseId: string;
  task: Task | undefined;
}

export interface ListTasksRequest {
  queueId: string;
  pageSize: number;
  pageToken: string;
}

export interface ListTasksResponse {
  tasks: Task[];
  nextPageToken: string;
}

export interface RenewTaskLeaseRequest {
  leaseId: string;
  duration: Duration | undefined;
}

export interface SubmitTaskRequest {
  task: Task | undefined;
}

export interface SubmitTaskResponse {
  task: Task | undefined;
}

const baseQueue: object = { id: "", name: "" };

export const Queue = {
  encode(message: Queue, writer: Writer = Writer.create()): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.retryConfig !== undefined) {
      Queue_RetryConfig.encode(
        message.retryConfig,
        writer.uint32(26).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Queue {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueue } as Queue;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.retryConfig = Queue_RetryConfig.decode(
            reader,
            reader.uint32()
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Queue {
    const message = { ...baseQueue } as Queue;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = "";
    }
    if (object.retryConfig !== undefined && object.retryConfig !== null) {
      message.retryConfig = Queue_RetryConfig.fromJSON(object.retryConfig);
    } else {
      message.retryConfig = undefined;
    }
    return message;
  },

  toJSON(message: Queue): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.retryConfig !== undefined &&
      (obj.retryConfig = message.retryConfig
        ? Queue_RetryConfig.toJSON(message.retryConfig)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Queue>): Queue {
    const message = { ...baseQueue } as Queue;
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = "";
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = "";
    }
    if (object.retryConfig !== undefined && object.retryConfig !== null) {
      message.retryConfig = Queue_RetryConfig.fromPartial(object.retryConfig);
    } else {
      message.retryConfig = undefined;
    }
    return message;
  },
};

const baseQueue_RetryConfig: object = { maxAttempts: 0 };

export const Queue_RetryConfig = {
  encode(message: Queue_RetryConfig, writer: Writer = Writer.create()): Writer {
    if (message.maxAttempts !== 0) {
      writer.uint32(8).int32(message.maxAttempts);
    }
    if (message.maxDuration !== undefined) {
      Duration.encode(message.maxDuration, writer.uint32(18).fork()).ldelim();
    }
    if (message.minBackoff !== undefined) {
      Duration.encode(message.minBackoff, writer.uint32(26).fork()).ldelim();
    }
    if (message.maxBackoff !== undefined) {
      Duration.encode(message.maxBackoff, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Queue_RetryConfig {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseQueue_RetryConfig } as Queue_RetryConfig;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.maxAttempts = reader.int32();
          break;
        case 2:
          message.maxDuration = Duration.decode(reader, reader.uint32());
          break;
        case 3:
          message.minBackoff = Duration.decode(reader, reader.uint32());
          break;
        case 4:
          message.maxBackoff = Duration.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Queue_RetryConfig {
    const message = { ...baseQueue_RetryConfig } as Queue_RetryConfig;
    if (object.maxAttempts !== undefined && object.maxAttempts !== null) {
      message.maxAttempts = Number(object.maxAttempts);
    } else {
      message.maxAttempts = 0;
    }
    if (object.maxDuration !== undefined && object.maxDuration !== null) {
      message.maxDuration = Duration.fromJSON(object.maxDuration);
    } else {
      message.maxDuration = undefined;
    }
    if (object.minBackoff !== undefined && object.minBackoff !== null) {
      message.minBackoff = Duration.fromJSON(object.minBackoff);
    } else {
      message.minBackoff = undefined;
    }
    if (object.maxBackoff !== undefined && object.maxBackoff !== null) {
      message.maxBackoff = Duration.fromJSON(object.maxBackoff);
    } else {
      message.maxBackoff = undefined;
    }
    return message;
  },

  toJSON(message: Queue_RetryConfig): unknown {
    const obj: any = {};
    message.maxAttempts !== undefined &&
      (obj.maxAttempts = message.maxAttempts);
    message.maxDuration !== undefined &&
      (obj.maxDuration = message.maxDuration
        ? Duration.toJSON(message.maxDuration)
        : undefined);
    message.minBackoff !== undefined &&
      (obj.minBackoff = message.minBackoff
        ? Duration.toJSON(message.minBackoff)
        : undefined);
    message.maxBackoff !== undefined &&
      (obj.maxBackoff = message.maxBackoff
        ? Duration.toJSON(message.maxBackoff)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<Queue_RetryConfig>): Queue_RetryConfig {
    const message = { ...baseQueue_RetryConfig } as Queue_RetryConfig;
    if (object.maxAttempts !== undefined && object.maxAttempts !== null) {
      message.maxAttempts = object.maxAttempts;
    } else {
      message.maxAttempts = 0;
    }
    if (object.maxDuration !== undefined && object.maxDuration !== null) {
      message.maxDuration = Duration.fromPartial(object.maxDuration);
    } else {
      message.maxDuration = undefined;
    }
    if (object.minBackoff !== undefined && object.minBackoff !== null) {
      message.minBackoff = Duration.fromPartial(object.minBackoff);
    } else {
      message.minBackoff = undefined;
    }
    if (object.maxBackoff !== undefined && object.maxBackoff !== null) {
      message.maxBackoff = Duration.fromPartial(object.maxBackoff);
    } else {
      message.maxBackoff = undefined;
    }
    return message;
  },
};

const baseTask: object = {
  id: "",
  queueId: "",
  initiatorType: 0,
  initiatorId: "",
  groupId: "",
  status: 0,
  name: "",
};

export const Task = {
  encode(message: Task, writer: Writer = Writer.create()): Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.queueId !== "") {
      writer.uint32(18).string(message.queueId);
    }
    if (message.initiatorType !== 0) {
      writer.uint32(24).int32(message.initiatorType);
    }
    if (message.initiatorId !== "") {
      writer.uint32(34).string(message.initiatorId);
    }
    if (message.groupId !== "") {
      writer.uint32(42).string(message.groupId);
    }
    if (message.status !== 0) {
      writer.uint32(48).int32(message.status);
    }
    if (message.name !== "") {
      writer.uint32(58).string(message.name);
    }
    if (message.createdAt !== undefined) {
      Timestamp.encode(
        toTimestamp(message.createdAt),
        writer.uint32(66).fork()
      ).ldelim();
    }
    if (message.scheduledAt !== undefined) {
      Timestamp.encode(
        toTimestamp(message.scheduledAt),
        writer.uint32(74).fork()
      ).ldelim();
    }
    if (message.deadline !== undefined) {
      Timestamp.encode(
        toTimestamp(message.deadline),
        writer.uint32(82).fork()
      ).ldelim();
    }
    if (message.timeout !== undefined) {
      Duration.encode(message.timeout, writer.uint32(90).fork()).ldelim();
    }
    if (message.maxAttempts !== undefined) {
      writer.uint32(96).int32(message.maxAttempts);
    }
    for (const v of message.attempts) {
      Task_Attempt.encode(v!, writer.uint32(106).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Task {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseTask } as Task;
    message.attempts = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.queueId = reader.string();
          break;
        case 3:
          message.initiatorType = reader.int32() as any;
          break;
        case 4:
          message.initiatorId = reader.string();
          break;
        case 5:
          message.groupId = reader.string();
          break;
        case 6:
          message.status = reader.int32() as any;
          break;
        case 7:
          message.name = reader.string();
          break;
        case 8:
          message.createdAt = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 9:
          message.scheduledAt = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 10:
          message.deadline = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 11:
          message.timeout = Duration.decode(reader, reader.uint32());
          break;
        case 12:
          message.maxAttempts = reader.int32();
          break;
        case 13:
          message.attempts.push(Task_Attempt.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Task {
    const message = { ...baseTask } as Task;
    message.attempts = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = "";
    }
    if (object.queueId !== undefined && object.queueId !== null) {
      message.queueId = String(object.queueId);
    } else {
      message.queueId = "";
    }
    if (object.initiatorType !== undefined && object.initiatorType !== null) {
      message.initiatorType = task_InitiatorTypeFromJSON(object.initiatorType);
    } else {
      message.initiatorType = 0;
    }
    if (object.initiatorId !== undefined && object.initiatorId !== null) {
      message.initiatorId = String(object.initiatorId);
    } else {
      message.initiatorId = "";
    }
    if (object.groupId !== undefined && object.groupId !== null) {
      message.groupId = String(object.groupId);
    } else {
      message.groupId = "";
    }
    if (object.status !== undefined && object.status !== null) {
      message.status = task_StatusFromJSON(object.status);
    } else {
      message.status = 0;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = "";
    }
    if (object.createdAt !== undefined && object.createdAt !== null) {
      message.createdAt = fromJsonTimestamp(object.createdAt);
    } else {
      message.createdAt = undefined;
    }
    if (object.scheduledAt !== undefined && object.scheduledAt !== null) {
      message.scheduledAt = fromJsonTimestamp(object.scheduledAt);
    } else {
      message.scheduledAt = undefined;
    }
    if (object.deadline !== undefined && object.deadline !== null) {
      message.deadline = fromJsonTimestamp(object.deadline);
    } else {
      message.deadline = undefined;
    }
    if (object.timeout !== undefined && object.timeout !== null) {
      message.timeout = Duration.fromJSON(object.timeout);
    } else {
      message.timeout = undefined;
    }
    if (object.maxAttempts !== undefined && object.maxAttempts !== null) {
      message.maxAttempts = Number(object.maxAttempts);
    } else {
      message.maxAttempts = undefined;
    }
    if (object.attempts !== undefined && object.attempts !== null) {
      for (const e of object.attempts) {
        message.attempts.push(Task_Attempt.fromJSON(e));
      }
    }
    return message;
  },

  toJSON(message: Task): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.queueId !== undefined && (obj.queueId = message.queueId);
    message.initiatorType !== undefined &&
      (obj.initiatorType = task_InitiatorTypeToJSON(message.initiatorType));
    message.initiatorId !== undefined &&
      (obj.initiatorId = message.initiatorId);
    message.groupId !== undefined && (obj.groupId = message.groupId);
    message.status !== undefined &&
      (obj.status = task_StatusToJSON(message.status));
    message.name !== undefined && (obj.name = message.name);
    message.createdAt !== undefined &&
      (obj.createdAt = message.createdAt.toISOString());
    message.scheduledAt !== undefined &&
      (obj.scheduledAt = message.scheduledAt.toISOString());
    message.deadline !== undefined &&
      (obj.deadline = message.deadline.toISOString());
    message.timeout !== undefined &&
      (obj.timeout = message.timeout
        ? Duration.toJSON(message.timeout)
        : undefined);
    message.maxAttempts !== undefined &&
      (obj.maxAttempts = message.maxAttempts);
    if (message.attempts) {
      obj.attempts = message.attempts.map((e) =>
        e ? Task_Attempt.toJSON(e) : undefined
      );
    } else {
      obj.attempts = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<Task>): Task {
    const message = { ...baseTask } as Task;
    message.attempts = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = object.id;
    } else {
      message.id = "";
    }
    if (object.queueId !== undefined && object.queueId !== null) {
      message.queueId = object.queueId;
    } else {
      message.queueId = "";
    }
    if (object.initiatorType !== undefined && object.initiatorType !== null) {
      message.initiatorType = object.initiatorType;
    } else {
      message.initiatorType = 0;
    }
    if (object.initiatorId !== undefined && object.initiatorId !== null) {
      message.initiatorId = object.initiatorId;
    } else {
      message.initiatorId = "";
    }
    if (object.groupId !== undefined && object.groupId !== null) {
      message.groupId = object.groupId;
    } else {
      message.groupId = "";
    }
    if (object.status !== undefined && object.status !== null) {
      message.status = object.status;
    } else {
      message.status = 0;
    }
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = "";
    }
    if (object.createdAt !== undefined && object.createdAt !== null) {
      message.createdAt = object.createdAt;
    } else {
      message.createdAt = undefined;
    }
    if (object.scheduledAt !== undefined && object.scheduledAt !== null) {
      message.scheduledAt = object.scheduledAt;
    } else {
      message.scheduledAt = undefined;
    }
    if (object.deadline !== undefined && object.deadline !== null) {
      message.deadline = object.deadline;
    } else {
      message.deadline = undefined;
    }
    if (object.timeout !== undefined && object.timeout !== null) {
      message.timeout = Duration.fromPartial(object.timeout);
    } else {
      message.timeout = undefined;
    }
    if (object.maxAttempts !== undefined && object.maxAttempts !== null) {
      message.maxAttempts = object.maxAttempts;
    } else {
      message.maxAttempts = undefined;
    }
    if (object.attempts !== undefined && object.attempts !== null) {
      for (const e of object.attempts) {
        message.attempts.push(Task_Attempt.fromPartial(e));
      }
    }
    return message;
  },
};

const baseTask_Attempt: object = {};

export const Task_Attempt = {
  encode(message: Task_Attempt, writer: Writer = Writer.create()): Writer {
    if (message.scheduledAt !== undefined) {
      Timestamp.encode(
        toTimestamp(message.scheduledAt),
        writer.uint32(10).fork()
      ).ldelim();
    }
    if (message.leasedAt !== undefined) {
      Timestamp.encode(
        toTimestamp(message.leasedAt),
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.completedAt !== undefined) {
      Timestamp.encode(
        toTimestamp(message.completedAt),
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.failedAt !== undefined) {
      Timestamp.encode(
        toTimestamp(message.failedAt),
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.failedReason !== undefined) {
      writer.uint32(42).string(message.failedReason);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): Task_Attempt {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseTask_Attempt } as Task_Attempt;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.scheduledAt = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 2:
          message.leasedAt = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 3:
          message.completedAt = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 4:
          message.failedAt = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 5:
          message.failedReason = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Task_Attempt {
    const message = { ...baseTask_Attempt } as Task_Attempt;
    if (object.scheduledAt !== undefined && object.scheduledAt !== null) {
      message.scheduledAt = fromJsonTimestamp(object.scheduledAt);
    } else {
      message.scheduledAt = undefined;
    }
    if (object.leasedAt !== undefined && object.leasedAt !== null) {
      message.leasedAt = fromJsonTimestamp(object.leasedAt);
    } else {
      message.leasedAt = undefined;
    }
    if (object.completedAt !== undefined && object.completedAt !== null) {
      message.completedAt = fromJsonTimestamp(object.completedAt);
    } else {
      message.completedAt = undefined;
    }
    if (object.failedAt !== undefined && object.failedAt !== null) {
      message.failedAt = fromJsonTimestamp(object.failedAt);
    } else {
      message.failedAt = undefined;
    }
    if (object.failedReason !== undefined && object.failedReason !== null) {
      message.failedReason = String(object.failedReason);
    } else {
      message.failedReason = undefined;
    }
    return message;
  },

  toJSON(message: Task_Attempt): unknown {
    const obj: any = {};
    message.scheduledAt !== undefined &&
      (obj.scheduledAt = message.scheduledAt.toISOString());
    message.leasedAt !== undefined &&
      (obj.leasedAt = message.leasedAt.toISOString());
    message.completedAt !== undefined &&
      (obj.completedAt = message.completedAt.toISOString());
    message.failedAt !== undefined &&
      (obj.failedAt = message.failedAt.toISOString());
    message.failedReason !== undefined &&
      (obj.failedReason = message.failedReason);
    return obj;
  },

  fromPartial(object: DeepPartial<Task_Attempt>): Task_Attempt {
    const message = { ...baseTask_Attempt } as Task_Attempt;
    if (object.scheduledAt !== undefined && object.scheduledAt !== null) {
      message.scheduledAt = object.scheduledAt;
    } else {
      message.scheduledAt = undefined;
    }
    if (object.leasedAt !== undefined && object.leasedAt !== null) {
      message.leasedAt = object.leasedAt;
    } else {
      message.leasedAt = undefined;
    }
    if (object.completedAt !== undefined && object.completedAt !== null) {
      message.completedAt = object.completedAt;
    } else {
      message.completedAt = undefined;
    }
    if (object.failedAt !== undefined && object.failedAt !== null) {
      message.failedAt = object.failedAt;
    } else {
      message.failedAt = undefined;
    }
    if (object.failedReason !== undefined && object.failedReason !== null) {
      message.failedReason = object.failedReason;
    } else {
      message.failedReason = undefined;
    }
    return message;
  },
};

const baseAppendTaskLogsRequest: object = { taskId: "", logs: "" };

export const AppendTaskLogsRequest = {
  encode(
    message: AppendTaskLogsRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.taskId !== "") {
      writer.uint32(10).string(message.taskId);
    }
    for (const v of message.logs) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): AppendTaskLogsRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseAppendTaskLogsRequest } as AppendTaskLogsRequest;
    message.logs = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.taskId = reader.string();
          break;
        case 2:
          message.logs.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AppendTaskLogsRequest {
    const message = { ...baseAppendTaskLogsRequest } as AppendTaskLogsRequest;
    message.logs = [];
    if (object.taskId !== undefined && object.taskId !== null) {
      message.taskId = String(object.taskId);
    } else {
      message.taskId = "";
    }
    if (object.logs !== undefined && object.logs !== null) {
      for (const e of object.logs) {
        message.logs.push(String(e));
      }
    }
    return message;
  },

  toJSON(message: AppendTaskLogsRequest): unknown {
    const obj: any = {};
    message.taskId !== undefined && (obj.taskId = message.taskId);
    if (message.logs) {
      obj.logs = message.logs.map((e) => e);
    } else {
      obj.logs = [];
    }
    return obj;
  },

  fromPartial(
    object: DeepPartial<AppendTaskLogsRequest>
  ): AppendTaskLogsRequest {
    const message = { ...baseAppendTaskLogsRequest } as AppendTaskLogsRequest;
    message.logs = [];
    if (object.taskId !== undefined && object.taskId !== null) {
      message.taskId = object.taskId;
    } else {
      message.taskId = "";
    }
    if (object.logs !== undefined && object.logs !== null) {
      for (const e of object.logs) {
        message.logs.push(e);
      }
    }
    return message;
  },
};

const baseCompleteTaskRequest: object = { leaseId: "" };

export const CompleteTaskRequest = {
  encode(
    message: CompleteTaskRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.leaseId !== "") {
      writer.uint32(10).string(message.leaseId);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): CompleteTaskRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCompleteTaskRequest } as CompleteTaskRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.leaseId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CompleteTaskRequest {
    const message = { ...baseCompleteTaskRequest } as CompleteTaskRequest;
    if (object.leaseId !== undefined && object.leaseId !== null) {
      message.leaseId = String(object.leaseId);
    } else {
      message.leaseId = "";
    }
    return message;
  },

  toJSON(message: CompleteTaskRequest): unknown {
    const obj: any = {};
    message.leaseId !== undefined && (obj.leaseId = message.leaseId);
    return obj;
  },

  fromPartial(object: DeepPartial<CompleteTaskRequest>): CompleteTaskRequest {
    const message = { ...baseCompleteTaskRequest } as CompleteTaskRequest;
    if (object.leaseId !== undefined && object.leaseId !== null) {
      message.leaseId = object.leaseId;
    } else {
      message.leaseId = "";
    }
    return message;
  },
};

const baseDeleteTaskRequest: object = { taskId: "" };

export const DeleteTaskRequest = {
  encode(message: DeleteTaskRequest, writer: Writer = Writer.create()): Writer {
    if (message.taskId !== "") {
      writer.uint32(10).string(message.taskId);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): DeleteTaskRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseDeleteTaskRequest } as DeleteTaskRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.taskId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeleteTaskRequest {
    const message = { ...baseDeleteTaskRequest } as DeleteTaskRequest;
    if (object.taskId !== undefined && object.taskId !== null) {
      message.taskId = String(object.taskId);
    } else {
      message.taskId = "";
    }
    return message;
  },

  toJSON(message: DeleteTaskRequest): unknown {
    const obj: any = {};
    message.taskId !== undefined && (obj.taskId = message.taskId);
    return obj;
  },

  fromPartial(object: DeepPartial<DeleteTaskRequest>): DeleteTaskRequest {
    const message = { ...baseDeleteTaskRequest } as DeleteTaskRequest;
    if (object.taskId !== undefined && object.taskId !== null) {
      message.taskId = object.taskId;
    } else {
      message.taskId = "";
    }
    return message;
  },
};

const baseGetTaskRequest: object = { taskId: "" };

export const GetTaskRequest = {
  encode(message: GetTaskRequest, writer: Writer = Writer.create()): Writer {
    if (message.taskId !== "") {
      writer.uint32(10).string(message.taskId);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): GetTaskRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseGetTaskRequest } as GetTaskRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.taskId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetTaskRequest {
    const message = { ...baseGetTaskRequest } as GetTaskRequest;
    if (object.taskId !== undefined && object.taskId !== null) {
      message.taskId = String(object.taskId);
    } else {
      message.taskId = "";
    }
    return message;
  },

  toJSON(message: GetTaskRequest): unknown {
    const obj: any = {};
    message.taskId !== undefined && (obj.taskId = message.taskId);
    return obj;
  },

  fromPartial(object: DeepPartial<GetTaskRequest>): GetTaskRequest {
    const message = { ...baseGetTaskRequest } as GetTaskRequest;
    if (object.taskId !== undefined && object.taskId !== null) {
      message.taskId = object.taskId;
    } else {
      message.taskId = "";
    }
    return message;
  },
};

const baseGetTaskResponse: object = {};

export const GetTaskResponse = {
  encode(message: GetTaskResponse, writer: Writer = Writer.create()): Writer {
    if (message.task !== undefined) {
      Task.encode(message.task, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): GetTaskResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseGetTaskResponse } as GetTaskResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.task = Task.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetTaskResponse {
    const message = { ...baseGetTaskResponse } as GetTaskResponse;
    if (object.task !== undefined && object.task !== null) {
      message.task = Task.fromJSON(object.task);
    } else {
      message.task = undefined;
    }
    return message;
  },

  toJSON(message: GetTaskResponse): unknown {
    const obj: any = {};
    message.task !== undefined &&
      (obj.task = message.task ? Task.toJSON(message.task) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<GetTaskResponse>): GetTaskResponse {
    const message = { ...baseGetTaskResponse } as GetTaskResponse;
    if (object.task !== undefined && object.task !== null) {
      message.task = Task.fromPartial(object.task);
    } else {
      message.task = undefined;
    }
    return message;
  },
};

const baseGetTaskLogsRequest: object = { taskId: "" };

export const GetTaskLogsRequest = {
  encode(
    message: GetTaskLogsRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.taskId !== "") {
      writer.uint32(10).string(message.taskId);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): GetTaskLogsRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseGetTaskLogsRequest } as GetTaskLogsRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.taskId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetTaskLogsRequest {
    const message = { ...baseGetTaskLogsRequest } as GetTaskLogsRequest;
    if (object.taskId !== undefined && object.taskId !== null) {
      message.taskId = String(object.taskId);
    } else {
      message.taskId = "";
    }
    return message;
  },

  toJSON(message: GetTaskLogsRequest): unknown {
    const obj: any = {};
    message.taskId !== undefined && (obj.taskId = message.taskId);
    return obj;
  },

  fromPartial(object: DeepPartial<GetTaskLogsRequest>): GetTaskLogsRequest {
    const message = { ...baseGetTaskLogsRequest } as GetTaskLogsRequest;
    if (object.taskId !== undefined && object.taskId !== null) {
      message.taskId = object.taskId;
    } else {
      message.taskId = "";
    }
    return message;
  },
};

const baseGetTaskLogsResponse: object = { logs: "" };

export const GetTaskLogsResponse = {
  encode(
    message: GetTaskLogsResponse,
    writer: Writer = Writer.create()
  ): Writer {
    for (const v of message.logs) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): GetTaskLogsResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseGetTaskLogsResponse } as GetTaskLogsResponse;
    message.logs = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.logs.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetTaskLogsResponse {
    const message = { ...baseGetTaskLogsResponse } as GetTaskLogsResponse;
    message.logs = [];
    if (object.logs !== undefined && object.logs !== null) {
      for (const e of object.logs) {
        message.logs.push(String(e));
      }
    }
    return message;
  },

  toJSON(message: GetTaskLogsResponse): unknown {
    const obj: any = {};
    if (message.logs) {
      obj.logs = message.logs.map((e) => e);
    } else {
      obj.logs = [];
    }
    return obj;
  },

  fromPartial(object: DeepPartial<GetTaskLogsResponse>): GetTaskLogsResponse {
    const message = { ...baseGetTaskLogsResponse } as GetTaskLogsResponse;
    message.logs = [];
    if (object.logs !== undefined && object.logs !== null) {
      for (const e of object.logs) {
        message.logs.push(e);
      }
    }
    return message;
  },
};

const baseFailTaskRequest: object = { leaseId: "", errorMessage: "" };

export const FailTaskRequest = {
  encode(message: FailTaskRequest, writer: Writer = Writer.create()): Writer {
    if (message.leaseId !== "") {
      writer.uint32(10).string(message.leaseId);
    }
    if (message.errorMessage !== "") {
      writer.uint32(18).string(message.errorMessage);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): FailTaskRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseFailTaskRequest } as FailTaskRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.leaseId = reader.string();
          break;
        case 2:
          message.errorMessage = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FailTaskRequest {
    const message = { ...baseFailTaskRequest } as FailTaskRequest;
    if (object.leaseId !== undefined && object.leaseId !== null) {
      message.leaseId = String(object.leaseId);
    } else {
      message.leaseId = "";
    }
    if (object.errorMessage !== undefined && object.errorMessage !== null) {
      message.errorMessage = String(object.errorMessage);
    } else {
      message.errorMessage = "";
    }
    return message;
  },

  toJSON(message: FailTaskRequest): unknown {
    const obj: any = {};
    message.leaseId !== undefined && (obj.leaseId = message.leaseId);
    message.errorMessage !== undefined &&
      (obj.errorMessage = message.errorMessage);
    return obj;
  },

  fromPartial(object: DeepPartial<FailTaskRequest>): FailTaskRequest {
    const message = { ...baseFailTaskRequest } as FailTaskRequest;
    if (object.leaseId !== undefined && object.leaseId !== null) {
      message.leaseId = object.leaseId;
    } else {
      message.leaseId = "";
    }
    if (object.errorMessage !== undefined && object.errorMessage !== null) {
      message.errorMessage = object.errorMessage;
    } else {
      message.errorMessage = "";
    }
    return message;
  },
};

const baseLeaseTaskRequest: object = { queueId: "" };

export const LeaseTaskRequest = {
  encode(message: LeaseTaskRequest, writer: Writer = Writer.create()): Writer {
    if (message.queueId !== "") {
      writer.uint32(10).string(message.queueId);
    }
    if (message.duration !== undefined) {
      Duration.encode(message.duration, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): LeaseTaskRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseLeaseTaskRequest } as LeaseTaskRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.queueId = reader.string();
          break;
        case 2:
          message.duration = Duration.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LeaseTaskRequest {
    const message = { ...baseLeaseTaskRequest } as LeaseTaskRequest;
    if (object.queueId !== undefined && object.queueId !== null) {
      message.queueId = String(object.queueId);
    } else {
      message.queueId = "";
    }
    if (object.duration !== undefined && object.duration !== null) {
      message.duration = Duration.fromJSON(object.duration);
    } else {
      message.duration = undefined;
    }
    return message;
  },

  toJSON(message: LeaseTaskRequest): unknown {
    const obj: any = {};
    message.queueId !== undefined && (obj.queueId = message.queueId);
    message.duration !== undefined &&
      (obj.duration = message.duration
        ? Duration.toJSON(message.duration)
        : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<LeaseTaskRequest>): LeaseTaskRequest {
    const message = { ...baseLeaseTaskRequest } as LeaseTaskRequest;
    if (object.queueId !== undefined && object.queueId !== null) {
      message.queueId = object.queueId;
    } else {
      message.queueId = "";
    }
    if (object.duration !== undefined && object.duration !== null) {
      message.duration = Duration.fromPartial(object.duration);
    } else {
      message.duration = undefined;
    }
    return message;
  },
};

const baseLeaseTaskResponse: object = { leaseId: "" };

export const LeaseTaskResponse = {
  encode(message: LeaseTaskResponse, writer: Writer = Writer.create()): Writer {
    if (message.leaseId !== "") {
      writer.uint32(10).string(message.leaseId);
    }
    if (message.task !== undefined) {
      Task.encode(message.task, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): LeaseTaskResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseLeaseTaskResponse } as LeaseTaskResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.leaseId = reader.string();
          break;
        case 2:
          message.task = Task.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LeaseTaskResponse {
    const message = { ...baseLeaseTaskResponse } as LeaseTaskResponse;
    if (object.leaseId !== undefined && object.leaseId !== null) {
      message.leaseId = String(object.leaseId);
    } else {
      message.leaseId = "";
    }
    if (object.task !== undefined && object.task !== null) {
      message.task = Task.fromJSON(object.task);
    } else {
      message.task = undefined;
    }
    return message;
  },

  toJSON(message: LeaseTaskResponse): unknown {
    const obj: any = {};
    message.leaseId !== undefined && (obj.leaseId = message.leaseId);
    message.task !== undefined &&
      (obj.task = message.task ? Task.toJSON(message.task) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<LeaseTaskResponse>): LeaseTaskResponse {
    const message = { ...baseLeaseTaskResponse } as LeaseTaskResponse;
    if (object.leaseId !== undefined && object.leaseId !== null) {
      message.leaseId = object.leaseId;
    } else {
      message.leaseId = "";
    }
    if (object.task !== undefined && object.task !== null) {
      message.task = Task.fromPartial(object.task);
    } else {
      message.task = undefined;
    }
    return message;
  },
};

const baseListTasksRequest: object = {
  queueId: "",
  pageSize: 0,
  pageToken: "",
};

export const ListTasksRequest = {
  encode(message: ListTasksRequest, writer: Writer = Writer.create()): Writer {
    if (message.queueId !== "") {
      writer.uint32(10).string(message.queueId);
    }
    if (message.pageSize !== 0) {
      writer.uint32(16).int32(message.pageSize);
    }
    if (message.pageToken !== "") {
      writer.uint32(26).string(message.pageToken);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ListTasksRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseListTasksRequest } as ListTasksRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.queueId = reader.string();
          break;
        case 2:
          message.pageSize = reader.int32();
          break;
        case 3:
          message.pageToken = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListTasksRequest {
    const message = { ...baseListTasksRequest } as ListTasksRequest;
    if (object.queueId !== undefined && object.queueId !== null) {
      message.queueId = String(object.queueId);
    } else {
      message.queueId = "";
    }
    if (object.pageSize !== undefined && object.pageSize !== null) {
      message.pageSize = Number(object.pageSize);
    } else {
      message.pageSize = 0;
    }
    if (object.pageToken !== undefined && object.pageToken !== null) {
      message.pageToken = String(object.pageToken);
    } else {
      message.pageToken = "";
    }
    return message;
  },

  toJSON(message: ListTasksRequest): unknown {
    const obj: any = {};
    message.queueId !== undefined && (obj.queueId = message.queueId);
    message.pageSize !== undefined && (obj.pageSize = message.pageSize);
    message.pageToken !== undefined && (obj.pageToken = message.pageToken);
    return obj;
  },

  fromPartial(object: DeepPartial<ListTasksRequest>): ListTasksRequest {
    const message = { ...baseListTasksRequest } as ListTasksRequest;
    if (object.queueId !== undefined && object.queueId !== null) {
      message.queueId = object.queueId;
    } else {
      message.queueId = "";
    }
    if (object.pageSize !== undefined && object.pageSize !== null) {
      message.pageSize = object.pageSize;
    } else {
      message.pageSize = 0;
    }
    if (object.pageToken !== undefined && object.pageToken !== null) {
      message.pageToken = object.pageToken;
    } else {
      message.pageToken = "";
    }
    return message;
  },
};

const baseListTasksResponse: object = { nextPageToken: "" };

export const ListTasksResponse = {
  encode(message: ListTasksResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.tasks) {
      Task.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.nextPageToken !== "") {
      writer.uint32(18).string(message.nextPageToken);
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): ListTasksResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseListTasksResponse } as ListTasksResponse;
    message.tasks = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tasks.push(Task.decode(reader, reader.uint32()));
          break;
        case 2:
          message.nextPageToken = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ListTasksResponse {
    const message = { ...baseListTasksResponse } as ListTasksResponse;
    message.tasks = [];
    if (object.tasks !== undefined && object.tasks !== null) {
      for (const e of object.tasks) {
        message.tasks.push(Task.fromJSON(e));
      }
    }
    if (object.nextPageToken !== undefined && object.nextPageToken !== null) {
      message.nextPageToken = String(object.nextPageToken);
    } else {
      message.nextPageToken = "";
    }
    return message;
  },

  toJSON(message: ListTasksResponse): unknown {
    const obj: any = {};
    if (message.tasks) {
      obj.tasks = message.tasks.map((e) => (e ? Task.toJSON(e) : undefined));
    } else {
      obj.tasks = [];
    }
    message.nextPageToken !== undefined &&
      (obj.nextPageToken = message.nextPageToken);
    return obj;
  },

  fromPartial(object: DeepPartial<ListTasksResponse>): ListTasksResponse {
    const message = { ...baseListTasksResponse } as ListTasksResponse;
    message.tasks = [];
    if (object.tasks !== undefined && object.tasks !== null) {
      for (const e of object.tasks) {
        message.tasks.push(Task.fromPartial(e));
      }
    }
    if (object.nextPageToken !== undefined && object.nextPageToken !== null) {
      message.nextPageToken = object.nextPageToken;
    } else {
      message.nextPageToken = "";
    }
    return message;
  },
};

const baseRenewTaskLeaseRequest: object = { leaseId: "" };

export const RenewTaskLeaseRequest = {
  encode(
    message: RenewTaskLeaseRequest,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.leaseId !== "") {
      writer.uint32(10).string(message.leaseId);
    }
    if (message.duration !== undefined) {
      Duration.encode(message.duration, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): RenewTaskLeaseRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseRenewTaskLeaseRequest } as RenewTaskLeaseRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.leaseId = reader.string();
          break;
        case 2:
          message.duration = Duration.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RenewTaskLeaseRequest {
    const message = { ...baseRenewTaskLeaseRequest } as RenewTaskLeaseRequest;
    if (object.leaseId !== undefined && object.leaseId !== null) {
      message.leaseId = String(object.leaseId);
    } else {
      message.leaseId = "";
    }
    if (object.duration !== undefined && object.duration !== null) {
      message.duration = Duration.fromJSON(object.duration);
    } else {
      message.duration = undefined;
    }
    return message;
  },

  toJSON(message: RenewTaskLeaseRequest): unknown {
    const obj: any = {};
    message.leaseId !== undefined && (obj.leaseId = message.leaseId);
    message.duration !== undefined &&
      (obj.duration = message.duration
        ? Duration.toJSON(message.duration)
        : undefined);
    return obj;
  },

  fromPartial(
    object: DeepPartial<RenewTaskLeaseRequest>
  ): RenewTaskLeaseRequest {
    const message = { ...baseRenewTaskLeaseRequest } as RenewTaskLeaseRequest;
    if (object.leaseId !== undefined && object.leaseId !== null) {
      message.leaseId = object.leaseId;
    } else {
      message.leaseId = "";
    }
    if (object.duration !== undefined && object.duration !== null) {
      message.duration = Duration.fromPartial(object.duration);
    } else {
      message.duration = undefined;
    }
    return message;
  },
};

const baseSubmitTaskRequest: object = {};

export const SubmitTaskRequest = {
  encode(message: SubmitTaskRequest, writer: Writer = Writer.create()): Writer {
    if (message.task !== undefined) {
      Task.encode(message.task, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): SubmitTaskRequest {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSubmitTaskRequest } as SubmitTaskRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.task = Task.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SubmitTaskRequest {
    const message = { ...baseSubmitTaskRequest } as SubmitTaskRequest;
    if (object.task !== undefined && object.task !== null) {
      message.task = Task.fromJSON(object.task);
    } else {
      message.task = undefined;
    }
    return message;
  },

  toJSON(message: SubmitTaskRequest): unknown {
    const obj: any = {};
    message.task !== undefined &&
      (obj.task = message.task ? Task.toJSON(message.task) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<SubmitTaskRequest>): SubmitTaskRequest {
    const message = { ...baseSubmitTaskRequest } as SubmitTaskRequest;
    if (object.task !== undefined && object.task !== null) {
      message.task = Task.fromPartial(object.task);
    } else {
      message.task = undefined;
    }
    return message;
  },
};

const baseSubmitTaskResponse: object = {};

export const SubmitTaskResponse = {
  encode(
    message: SubmitTaskResponse,
    writer: Writer = Writer.create()
  ): Writer {
    if (message.task !== undefined) {
      Task.encode(message.task, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: Reader | Uint8Array, length?: number): SubmitTaskResponse {
    const reader = input instanceof Reader ? input : new Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSubmitTaskResponse } as SubmitTaskResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.task = Task.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SubmitTaskResponse {
    const message = { ...baseSubmitTaskResponse } as SubmitTaskResponse;
    if (object.task !== undefined && object.task !== null) {
      message.task = Task.fromJSON(object.task);
    } else {
      message.task = undefined;
    }
    return message;
  },

  toJSON(message: SubmitTaskResponse): unknown {
    const obj: any = {};
    message.task !== undefined &&
      (obj.task = message.task ? Task.toJSON(message.task) : undefined);
    return obj;
  },

  fromPartial(object: DeepPartial<SubmitTaskResponse>): SubmitTaskResponse {
    const message = { ...baseSubmitTaskResponse } as SubmitTaskResponse;
    if (object.task !== undefined && object.task !== null) {
      message.task = Task.fromPartial(object.task);
    } else {
      message.task = undefined;
    }
    return message;
  },
};

export interface Tasks {
  /** viewing */
  DeleteTask(
    request: DeepPartial<DeleteTaskRequest>,
    metadata?: grpc.Metadata
  ): Promise<Empty>;
  GetTask(
    request: DeepPartial<GetTaskRequest>,
    metadata?: grpc.Metadata
  ): Promise<GetTaskResponse>;
  ListTasks(
    request: DeepPartial<ListTasksRequest>,
    metadata?: grpc.Metadata
  ): Promise<ListTasksResponse>;
  /** leasing */
  CompleteTask(
    request: DeepPartial<CompleteTaskRequest>,
    metadata?: grpc.Metadata
  ): Promise<Empty>;
  LeaseTask(
    request: DeepPartial<LeaseTaskRequest>,
    metadata?: grpc.Metadata
  ): Promise<LeaseTaskResponse>;
  RenewTaskLease(
    request: DeepPartial<RenewTaskLeaseRequest>,
    metadata?: grpc.Metadata
  ): Promise<Empty>;
  SubmitTask(
    request: DeepPartial<SubmitTaskRequest>,
    metadata?: grpc.Metadata
  ): Promise<SubmitTaskResponse>;
  /** logs */
  AppendTaskLogs(
    request: DeepPartial<AppendTaskLogsRequest>,
    metadata?: grpc.Metadata
  ): Promise<Empty>;
  GetTaskLogs(
    request: DeepPartial<GetTaskLogsRequest>,
    metadata?: grpc.Metadata
  ): Promise<GetTaskLogsResponse>;
}

export class TasksClientImpl implements Tasks {
  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.DeleteTask = this.DeleteTask.bind(this);
    this.GetTask = this.GetTask.bind(this);
    this.ListTasks = this.ListTasks.bind(this);
    this.CompleteTask = this.CompleteTask.bind(this);
    this.LeaseTask = this.LeaseTask.bind(this);
    this.RenewTaskLease = this.RenewTaskLease.bind(this);
    this.SubmitTask = this.SubmitTask.bind(this);
    this.AppendTaskLogs = this.AppendTaskLogs.bind(this);
    this.GetTaskLogs = this.GetTaskLogs.bind(this);
  }

  DeleteTask(
    request: DeepPartial<DeleteTaskRequest>,
    metadata?: grpc.Metadata
  ): Promise<Empty> {
    return this.rpc.unary(
      TasksDeleteTaskDesc,
      DeleteTaskRequest.fromPartial(request),
      metadata
    );
  }

  GetTask(
    request: DeepPartial<GetTaskRequest>,
    metadata?: grpc.Metadata
  ): Promise<GetTaskResponse> {
    return this.rpc.unary(
      TasksGetTaskDesc,
      GetTaskRequest.fromPartial(request),
      metadata
    );
  }

  ListTasks(
    request: DeepPartial<ListTasksRequest>,
    metadata?: grpc.Metadata
  ): Promise<ListTasksResponse> {
    return this.rpc.unary(
      TasksListTasksDesc,
      ListTasksRequest.fromPartial(request),
      metadata
    );
  }

  CompleteTask(
    request: DeepPartial<CompleteTaskRequest>,
    metadata?: grpc.Metadata
  ): Promise<Empty> {
    return this.rpc.unary(
      TasksCompleteTaskDesc,
      CompleteTaskRequest.fromPartial(request),
      metadata
    );
  }

  LeaseTask(
    request: DeepPartial<LeaseTaskRequest>,
    metadata?: grpc.Metadata
  ): Promise<LeaseTaskResponse> {
    return this.rpc.unary(
      TasksLeaseTaskDesc,
      LeaseTaskRequest.fromPartial(request),
      metadata
    );
  }

  RenewTaskLease(
    request: DeepPartial<RenewTaskLeaseRequest>,
    metadata?: grpc.Metadata
  ): Promise<Empty> {
    return this.rpc.unary(
      TasksRenewTaskLeaseDesc,
      RenewTaskLeaseRequest.fromPartial(request),
      metadata
    );
  }

  SubmitTask(
    request: DeepPartial<SubmitTaskRequest>,
    metadata?: grpc.Metadata
  ): Promise<SubmitTaskResponse> {
    return this.rpc.unary(
      TasksSubmitTaskDesc,
      SubmitTaskRequest.fromPartial(request),
      metadata
    );
  }

  AppendTaskLogs(
    request: DeepPartial<AppendTaskLogsRequest>,
    metadata?: grpc.Metadata
  ): Promise<Empty> {
    return this.rpc.unary(
      TasksAppendTaskLogsDesc,
      AppendTaskLogsRequest.fromPartial(request),
      metadata
    );
  }

  GetTaskLogs(
    request: DeepPartial<GetTaskLogsRequest>,
    metadata?: grpc.Metadata
  ): Promise<GetTaskLogsResponse> {
    return this.rpc.unary(
      TasksGetTaskLogsDesc,
      GetTaskLogsRequest.fromPartial(request),
      metadata
    );
  }
}

export const TasksDesc = {
  serviceName: "badgerodon.tasks.Tasks",
};

export const TasksDeleteTaskDesc: UnaryMethodDefinitionish = {
  methodName: "DeleteTask",
  service: TasksDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return DeleteTaskRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...Empty.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const TasksGetTaskDesc: UnaryMethodDefinitionish = {
  methodName: "GetTask",
  service: TasksDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetTaskRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...GetTaskResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const TasksListTasksDesc: UnaryMethodDefinitionish = {
  methodName: "ListTasks",
  service: TasksDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return ListTasksRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...ListTasksResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const TasksCompleteTaskDesc: UnaryMethodDefinitionish = {
  methodName: "CompleteTask",
  service: TasksDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return CompleteTaskRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...Empty.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const TasksLeaseTaskDesc: UnaryMethodDefinitionish = {
  methodName: "LeaseTask",
  service: TasksDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return LeaseTaskRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...LeaseTaskResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const TasksRenewTaskLeaseDesc: UnaryMethodDefinitionish = {
  methodName: "RenewTaskLease",
  service: TasksDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return RenewTaskLeaseRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...Empty.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const TasksSubmitTaskDesc: UnaryMethodDefinitionish = {
  methodName: "SubmitTask",
  service: TasksDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return SubmitTaskRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...SubmitTaskResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const TasksAppendTaskLogsDesc: UnaryMethodDefinitionish = {
  methodName: "AppendTaskLogs",
  service: TasksDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return AppendTaskLogsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...Empty.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

export const TasksGetTaskLogsDesc: UnaryMethodDefinitionish = {
  methodName: "GetTaskLogs",
  service: TasksDesc,
  requestStream: false,
  responseStream: false,
  requestType: {
    serializeBinary() {
      return GetTaskLogsRequest.encode(this).finish();
    },
  } as any,
  responseType: {
    deserializeBinary(data: Uint8Array) {
      return {
        ...GetTaskLogsResponse.decode(data),
        toObject() {
          return this;
        },
      };
    },
  } as any,
};

interface UnaryMethodDefinitionishR
  extends grpc.UnaryMethodDefinition<any, any> {
  requestStream: any;
  responseStream: any;
}

type UnaryMethodDefinitionish = UnaryMethodDefinitionishR;

interface Rpc {
  unary<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    request: any,
    metadata: grpc.Metadata | undefined
  ): Promise<any>;
}

export class GrpcWebImpl {
  private host: string;
  private options: {
    transport?: grpc.TransportFactory;

    debug?: boolean;
    metadata?: grpc.Metadata;
  };

  constructor(
    host: string,
    options: {
      transport?: grpc.TransportFactory;

      debug?: boolean;
      metadata?: grpc.Metadata;
    }
  ) {
    this.host = host;
    this.options = options;
  }

  unary<T extends UnaryMethodDefinitionish>(
    methodDesc: T,
    _request: any,
    metadata: grpc.Metadata | undefined
  ): Promise<any> {
    const request = { ..._request, ...methodDesc.requestType };
    const maybeCombinedMetadata =
      metadata && this.options.metadata
        ? new BrowserHeaders({
            ...this.options?.metadata.headersMap,
            ...metadata?.headersMap,
          })
        : metadata || this.options.metadata;
    return new Promise((resolve, reject) => {
      grpc.unary(methodDesc, {
        request,
        host: this.host,
        metadata: maybeCombinedMetadata,
        transport: this.options.transport,
        debug: this.options.debug,
        onEnd: function (response) {
          if (response.status === grpc.Code.OK) {
            resolve(response.message);
          } else {
            const err = new Error(response.statusMessage) as any;
            err.code = response.status;
            err.metadata = response.trailers;
            reject(err);
          }
        },
      });
    });
  }
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;
export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
