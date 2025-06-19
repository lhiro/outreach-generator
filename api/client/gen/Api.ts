import {
  IAgentCreateData,
  IAgentCreatePayload,
  IClientUpdateData,
  IClientUpdatePayload,
  IClientsListData,
  IConversationDetailData,
  IConversationsListData,
  IConversationsListParams,
} from "./model";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Api<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description chat to agent
   *
   * @name AgentCreate
   * @request POST:/api/agent/{id}
   */
  agentCreate = (
    id: string,
    data: IAgentCreatePayload,
    params: RequestParams = {},
  ) =>
    this.request<IAgentCreateData, any>({
      path: `/api/agent/${id}`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @name ClientsList
   * @request GET:/api/clients
   */
  clientsList = (params: RequestParams = {}) =>
    this.request<IClientsListData, any>({
      path: `/api/clients`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * @description update client status
   *
   * @name ClientUpdate
   * @request PUT:/api/client/{id}
   */
  clientUpdate = (
    id: string,
    data: IClientUpdatePayload,
    params: RequestParams = {},
  ) =>
    this.request<IClientUpdateData, any>({
      path: `/api/client/${id}`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description get all messages by conversation id
   *
   * @name ConversationDetail
   * @request GET:/api/conversation/{id}
   */
  conversationDetail = (id: string, params: RequestParams = {}) =>
    this.request<IConversationDetailData, any>({
      path: `/api/conversation/${id}`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * @description get conversations
   *
   * @name ConversationsList
   * @request GET:/api/conversations
   */
  conversationsList = (
    query: IConversationsListParams,
    params: RequestParams = {},
  ) =>
    this.request<IConversationsListData, any>({
      path: `/api/conversations`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
}
