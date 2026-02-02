// Original file: exa/cortex_pb/cortex.proto

import type { AutoRunDecision as _exa_cortex_pb_AutoRunDecision, AutoRunDecision__Output as _exa_cortex_pb_AutoRunDecision__Output } from '../../exa/cortex_pb/AutoRunDecision';
import type { RunCommandOutput as _exa_cortex_pb_RunCommandOutput, RunCommandOutput__Output as _exa_cortex_pb_RunCommandOutput__Output } from '../../exa/cortex_pb/RunCommandOutput';
import type { SimpleCommand as _exa_cortex_pb_SimpleCommand, SimpleCommand__Output as _exa_cortex_pb_SimpleCommand__Output } from '../../exa/cortex_pb/SimpleCommand';
import type { Long } from '@grpc/proto-loader';

export interface CortexStepRunCommand {
  'command'?: (string);
  'cwd'?: (string);
  'args'?: (string)[];
  'stdout'?: (string);
  'stderr'?: (string);
  'exitCode'?: (number);
  'stdoutBuffer'?: (string);
  'stderrBuffer'?: (string);
  'stdoutLinesAbove'?: (number);
  'stderrLinesAbove'?: (number);
  'blocking'?: (boolean);
  'waitMsBeforeAsync'?: (number | string | Long);
  'commandId'?: (string);
  'userRejected'?: (boolean);
  'shouldAutoRun'?: (boolean);
  'autoRunDecision'?: (_exa_cortex_pb_AutoRunDecision);
  'requestedTerminalId'?: (string);
  'terminalId'?: (string);
  'stdoutOutput'?: (_exa_cortex_pb_RunCommandOutput | null);
  'stderrOutput'?: (_exa_cortex_pb_RunCommandOutput | null);
  'combinedOutput'?: (_exa_cortex_pb_RunCommandOutput | null);
  'usedIdeTerminal'?: (boolean);
  'commandLine'?: (string);
  'rawDebugOutput'?: (string);
  'proposedCommandLine'?: (string);
  'agentHarness'?: (string);
  'shellIntegrationFailureReason'?: (string);
  'shellName'?: (string);
  'parsedCommands'?: (_exa_cortex_pb_SimpleCommand)[];
  '_exitCode'?: "exitCode";
}

export interface CortexStepRunCommand__Output {
  'command': (string);
  'cwd': (string);
  'args': (string)[];
  'stdout': (string);
  'stderr': (string);
  'exitCode'?: (number);
  'stdoutBuffer': (string);
  'stderrBuffer': (string);
  'stdoutLinesAbove': (number);
  'stderrLinesAbove': (number);
  'blocking': (boolean);
  'waitMsBeforeAsync': (string);
  'commandId': (string);
  'userRejected': (boolean);
  'shouldAutoRun': (boolean);
  'autoRunDecision': (_exa_cortex_pb_AutoRunDecision__Output);
  'requestedTerminalId': (string);
  'terminalId': (string);
  'stdoutOutput': (_exa_cortex_pb_RunCommandOutput__Output | null);
  'stderrOutput': (_exa_cortex_pb_RunCommandOutput__Output | null);
  'combinedOutput': (_exa_cortex_pb_RunCommandOutput__Output | null);
  'usedIdeTerminal': (boolean);
  'commandLine': (string);
  'rawDebugOutput': (string);
  'proposedCommandLine': (string);
  'agentHarness': (string);
  'shellIntegrationFailureReason': (string);
  'shellName': (string);
  'parsedCommands': (_exa_cortex_pb_SimpleCommand__Output)[];
  '_exitCode'?: "exitCode";
}
