define('vs/base/worker/workerProtocol', [
  'require',
  'exports'
], function(e, r) {
  r.MessageType = {
    INITIALIZE: '$initialize',
    REPLY: '$reply',
    PRINT: '$print'
  }, r.ReplyType = {
    COMPLETE: 'complete',
    ERROR: 'error',
    PROGRESS: 'progress'
  }, r.PrintType = {
    LOG: 'log',
    DEBUG: 'debug',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error'
  };
})