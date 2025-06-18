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
      type: IAgentCreatePayloadTypeEnum;
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

export enum IAgentCreatePayloadTypeEnum {
  Text = "text",
  ImageUrl = "image_url",
}
