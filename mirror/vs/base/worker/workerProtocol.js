define("vs/base/worker/workerProtocol", ["require", "exports"], function(e, t) {
  t.MessageType = {
    INITIALIZE: "$initialize",
    REPLY: "$reply",
    PRINT: "$print"
  };

  t.ReplyType = {
    COMPLETE: "complete",
    ERROR: "error",
    PROGRESS: "progress"
  };

  t.PrintType = {
    LOG: "log",
    DEBUG: "debug",
    INFO: "info",
    WARN: "warn",
    ERROR: "error"
  };
});