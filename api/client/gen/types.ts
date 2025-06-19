import {
  IAgentCreateData,
  IAgentCreatePayload,
  IClientUpdateData,
  IClientUpdatePayload,
  IClientsListData,
  IConversationDetailData,
  IConversationsListData,
} from "./model";

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

  /**
   * No description
   * @name ClientsList
   * @request GET:/api/clients
   */
  export namespace ClientsList {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = IClientsListData;
  }

  /**
   * @description update client status
   * @name ClientUpdate
   * @request PUT:/api/client/{id}
   */
  export namespace ClientUpdate {
    export type RequestParams = {
      /**
       * client id
       * @example ""
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = IClientUpdatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = IClientUpdateData;
  }

  /**
   * @description get all messages by conversation id
   * @name ConversationDetail
   * @request GET:/api/conversation/{id}
   */
  export namespace ConversationDetail {
    export type RequestParams = {
      /**
       * conversation id
       * @example ""
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = IConversationDetailData;
  }

  /**
   * @description get conversations
   * @name ConversationsList
   * @request GET:/api/conversations
   */
  export namespace ConversationsList {
    export type RequestParams = {};
    export type RequestQuery = {
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
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = IConversationsListData;
  }
}
