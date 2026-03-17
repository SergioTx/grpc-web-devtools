// This interceptor will be passed every request and response. We will take that request and response
// and post a message to the window. This will allow us to access this message in the content script. This
// is all to make the manifest v3 happy.

/**
 * Creates an interceptor with optional custom toJson function
 * @param {Function} [customToJson] - Optional custom function to serialize messages to JSON.
 *                                     Should accept a message object and return a JSON-serializable object.
 * @returns {Function} The interceptor function
 */
const createInterceptor = (customToJson) => {
  // Default to using the message's toJson method if no custom function is provided
  const toJson = customToJson || ((message) => message.toJson());

  return (next) =>
    async (req) => {
      return await next(req).then((resp) => {
        if (!resp.stream) {
          window.postMessage({
            type: "__GRPCWEB_DEVTOOLS__",
            methodType: "unary",
            method: req.method.name,
            request: toJson(req.message),
            response: toJson(resp.message),
          }, "*")
          return resp;
        } else {
          return {
            ...resp,
            async read() {
              const streamResp = await resp.read();
              // "value" could be undefined when "done" is true
              if (streamResp.value) {
                window.postMessage({
                  type: "__GRPCWEB_DEVTOOLS__",
                  methodType: "server_streaming",
                  method: req.method.name,
                  request: toJson(req.message),
                  response: toJson(streamResp.value),
                }, "*");
              }
              return streamResp;
            }
          }
        }
      }).catch((e) => {
        window.postMessage({
          type: "__GRPCWEB_DEVTOOLS__",
          methodType: req.stream ? "server_streaming" : "unary",
          method: req.method.name,
          request: toJson(req.message),
          response: undefined,
          error: {
            message: e.message,
            code: e.code,
          }
        }, "*")
        throw e;
      });
    };
};

// Default interceptor for backward compatibility
window.__CONNECT_WEB_DEVTOOLS__ = createInterceptor();

// Export the factory function for custom usage
window.__CREATE_CONNECT_WEB_DEVTOOLS__ = createInterceptor;

// Since we are loading inject.js as a script, the order at which it is loaded is not guaranteed.
// So we will publish a custom event that can be used, to be used to assign the interceptor.
const readyEvent = new CustomEvent("connect-web-dev-tools-ready");
window.dispatchEvent(readyEvent);
