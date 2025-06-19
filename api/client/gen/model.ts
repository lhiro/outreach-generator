export type IAgentCreateData = any;

export interface IAgentCreatePayload {
  /** user company */
  company?: string;
  /** message id */
  id: string;
  /** user linkedin url */
  linkedinUrl?: string;
  messages: {
    /** user message */
    content: string;
    parts?: {
      text?: string;
      type: string;
    }[];
    role: IAgentCreatePayloadRoleEnum;
  }[];
  /** user name */
  name?: string;
  /** user role */
  role?: string;
}

export enum IAgentCreatePayloadRoleEnum {
  Data = "data",
  System = "system",
  User = "user",
  Assistant = "assistant",
}

export interface IClientUpdateData {
  success: boolean;
}

export interface IClientUpdatePayload {
  status: IClientUpdatePayloadStatusEnum;
}

export enum IClientUpdatePayloadStatusEnum {
  Draft = "draft",
  Approved = "approved",
  Sent = "sent",
}

export interface IClientsListData {
  data?: {
    company: string;
    conversationId: string;
    /** @format date-time */
    createdAt: Date;
    id: string;
    linkedin?: string;
    name: string;
    role: string;
    status: IDataStatusEnum;
  }[];
  success: boolean;
}

export interface IConversationDetailData {
  data?: {
    content: string;
    /** @format date-time */
    createdAt: Date;
    id: string;
    role: string | null;
  }[];
  success: boolean;
}

export interface IConversationsListData {
  data?: {
    /** @format date-time */
    createdAt: Date;
    id: string;
    title: string | null;
  }[];
  message?: string;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
  success: boolean;
}

export interface IConversationsListParams {
  /**
   * page number
   * @example "1"
   */
  page: string;
  /**
   * page size
   * @example "10"
   */
  pageSize: string;
}

export enum IDataStatusEnum {
  Draft = "draft",
  Approved = "approved",
  Sent = "sent",
}
