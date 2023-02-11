module.exports = {

  ClearResouresOnMainProcessExitEventForLocalEnv: require('./ClearResouresOnMainProcessExitEventForLocalEnv'),
  ClearResouresOnMainProcessExitEventForProdEnv: require('./ClearResouresOnMainProcessExitEventForProdEnv'),
  ClearResouresOnMainProcessUncaughtExceptionEvent: require('./ClearResouresOnMainProcessUncaughtExceptionEvent'),
  ClearResouresOnSubprocessExitEventInLocalEnv: require('./ClearResouresOnSubprocessExitEventInLocalEnv'),
  ClearResouresOnSubprocessExitEventInProdEnv: require('./ClearResouresOnSubprocessExitEventInProdEnv'),
  ClusterWithExitEvent: require('./ClusterWithForkedWorkers'),
  ClusterWithForkedWorkers: require('./ClusterWithForkedWorkers'),
  CreatedCluster: require('./CreatedCluster'),
  ExitSubprocessOnMessageFromPrimaryProcessEvent: require('./ExitSubprocessOnMessageFromPrimaryProcessEvent'),
  ForkedWorker: require('./ForkedWorker'),
  GracefullyRestartGuseynEvent: require('./GracefullyRestartGuseynEvent'),
  IsMaster: require('./IsMaster'),
  ReloadEventForExitedWorker: require('./ReloadEventForExitedWorker'),
  Worker: require('./Worker'),
  WorkerWithExitEvent: require('./WorkerWithExitEvent')

}
