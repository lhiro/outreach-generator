import { IAgentCreateData, IAgentCreatePayload } from "./model";
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
}
