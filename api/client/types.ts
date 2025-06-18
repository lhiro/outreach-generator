import { IAgentCreateData, IAgentCreatePayload } from "./model";

export namespace Api {
  /**
   * @description chat to agent
   * @name AgentCreate
   * @request POST:/api/agent/{id}
   */
  export namespace AgentCreate {
    export type RequestParams = {
      /**
       * conversation id
       * @example ""
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = IAgentCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = IAgentCreateData;
  }
}
