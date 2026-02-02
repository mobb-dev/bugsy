import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { AnyRules as _buf_validate_AnyRules, AnyRules__Output as _buf_validate_AnyRules__Output } from './buf/validate/AnyRules';
import type { BoolRules as _buf_validate_BoolRules, BoolRules__Output as _buf_validate_BoolRules__Output } from './buf/validate/BoolRules';
import type { BytesRules as _buf_validate_BytesRules, BytesRules__Output as _buf_validate_BytesRules__Output } from './buf/validate/BytesRules';
import type { DoubleRules as _buf_validate_DoubleRules, DoubleRules__Output as _buf_validate_DoubleRules__Output } from './buf/validate/DoubleRules';
import type { DurationRules as _buf_validate_DurationRules, DurationRules__Output as _buf_validate_DurationRules__Output } from './buf/validate/DurationRules';
import type { EnumRules as _buf_validate_EnumRules, EnumRules__Output as _buf_validate_EnumRules__Output } from './buf/validate/EnumRules';
import type { FieldPath as _buf_validate_FieldPath, FieldPath__Output as _buf_validate_FieldPath__Output } from './buf/validate/FieldPath';
import type { FieldPathElement as _buf_validate_FieldPathElement, FieldPathElement__Output as _buf_validate_FieldPathElement__Output } from './buf/validate/FieldPathElement';
import type { FieldRules as _buf_validate_FieldRules, FieldRules__Output as _buf_validate_FieldRules__Output } from './buf/validate/FieldRules';
import type { Fixed32Rules as _buf_validate_Fixed32Rules, Fixed32Rules__Output as _buf_validate_Fixed32Rules__Output } from './buf/validate/Fixed32Rules';
import type { Fixed64Rules as _buf_validate_Fixed64Rules, Fixed64Rules__Output as _buf_validate_Fixed64Rules__Output } from './buf/validate/Fixed64Rules';
import type { FloatRules as _buf_validate_FloatRules, FloatRules__Output as _buf_validate_FloatRules__Output } from './buf/validate/FloatRules';
import type { Int32Rules as _buf_validate_Int32Rules, Int32Rules__Output as _buf_validate_Int32Rules__Output } from './buf/validate/Int32Rules';
import type { Int64Rules as _buf_validate_Int64Rules, Int64Rules__Output as _buf_validate_Int64Rules__Output } from './buf/validate/Int64Rules';
import type { MapRules as _buf_validate_MapRules, MapRules__Output as _buf_validate_MapRules__Output } from './buf/validate/MapRules';
import type { MessageRules as _buf_validate_MessageRules, MessageRules__Output as _buf_validate_MessageRules__Output } from './buf/validate/MessageRules';
import type { OneofRules as _buf_validate_OneofRules, OneofRules__Output as _buf_validate_OneofRules__Output } from './buf/validate/OneofRules';
import type { PredefinedRules as _buf_validate_PredefinedRules, PredefinedRules__Output as _buf_validate_PredefinedRules__Output } from './buf/validate/PredefinedRules';
import type { RepeatedRules as _buf_validate_RepeatedRules, RepeatedRules__Output as _buf_validate_RepeatedRules__Output } from './buf/validate/RepeatedRules';
import type { Rule as _buf_validate_Rule, Rule__Output as _buf_validate_Rule__Output } from './buf/validate/Rule';
import type { SFixed32Rules as _buf_validate_SFixed32Rules, SFixed32Rules__Output as _buf_validate_SFixed32Rules__Output } from './buf/validate/SFixed32Rules';
import type { SFixed64Rules as _buf_validate_SFixed64Rules, SFixed64Rules__Output as _buf_validate_SFixed64Rules__Output } from './buf/validate/SFixed64Rules';
import type { SInt32Rules as _buf_validate_SInt32Rules, SInt32Rules__Output as _buf_validate_SInt32Rules__Output } from './buf/validate/SInt32Rules';
import type { SInt64Rules as _buf_validate_SInt64Rules, SInt64Rules__Output as _buf_validate_SInt64Rules__Output } from './buf/validate/SInt64Rules';
import type { StringRules as _buf_validate_StringRules, StringRules__Output as _buf_validate_StringRules__Output } from './buf/validate/StringRules';
import type { TimestampRules as _buf_validate_TimestampRules, TimestampRules__Output as _buf_validate_TimestampRules__Output } from './buf/validate/TimestampRules';
import type { UInt32Rules as _buf_validate_UInt32Rules, UInt32Rules__Output as _buf_validate_UInt32Rules__Output } from './buf/validate/UInt32Rules';
import type { UInt64Rules as _buf_validate_UInt64Rules, UInt64Rules__Output as _buf_validate_UInt64Rules__Output } from './buf/validate/UInt64Rules';
import type { Violation as _buf_validate_Violation, Violation__Output as _buf_validate_Violation__Output } from './buf/validate/Violation';
import type { Violations as _buf_validate_Violations, Violations__Output as _buf_validate_Violations__Output } from './buf/validate/Violations';
import type { GitRepoInfo as _exa_auto_cascade_common_pb_GitRepoInfo, GitRepoInfo__Output as _exa_auto_cascade_common_pb_GitRepoInfo__Output } from './exa/auto_cascade_common_pb/GitRepoInfo';
import type { GithubInstallationInfo as _exa_auto_cascade_common_pb_GithubInstallationInfo, GithubInstallationInfo__Output as _exa_auto_cascade_common_pb_GithubInstallationInfo__Output } from './exa/auto_cascade_common_pb/GithubInstallationInfo';
import type { GithubPullRequestInfo as _exa_auto_cascade_common_pb_GithubPullRequestInfo, GithubPullRequestInfo__Output as _exa_auto_cascade_common_pb_GithubPullRequestInfo__Output } from './exa/auto_cascade_common_pb/GithubPullRequestInfo';
import type { SessionInfo as _exa_auto_cascade_common_pb_SessionInfo, SessionInfo__Output as _exa_auto_cascade_common_pb_SessionInfo__Output } from './exa/auto_cascade_common_pb/SessionInfo';
import type { SessionInfos as _exa_auto_cascade_common_pb_SessionInfos, SessionInfos__Output as _exa_auto_cascade_common_pb_SessionInfos__Output } from './exa/auto_cascade_common_pb/SessionInfos';
import type { Bug as _exa_bug_checker_pb_Bug, Bug__Output as _exa_bug_checker_pb_Bug__Output } from './exa/bug_checker_pb/Bug';
import type { Fix as _exa_bug_checker_pb_Fix, Fix__Output as _exa_bug_checker_pb_Fix__Output } from './exa/bug_checker_pb/Fix';
import type { CascadePluginCommand as _exa_cascade_plugins_pb_CascadePluginCommand, CascadePluginCommand__Output as _exa_cascade_plugins_pb_CascadePluginCommand__Output } from './exa/cascade_plugins_pb/CascadePluginCommand';
import type { CascadePluginCommandTemplate as _exa_cascade_plugins_pb_CascadePluginCommandTemplate, CascadePluginCommandTemplate__Output as _exa_cascade_plugins_pb_CascadePluginCommandTemplate__Output } from './exa/cascade_plugins_pb/CascadePluginCommandTemplate';
import type { CascadePluginCommandVariable as _exa_cascade_plugins_pb_CascadePluginCommandVariable, CascadePluginCommandVariable__Output as _exa_cascade_plugins_pb_CascadePluginCommandVariable__Output } from './exa/cascade_plugins_pb/CascadePluginCommandVariable';
import type { CascadePluginLocalConfig as _exa_cascade_plugins_pb_CascadePluginLocalConfig, CascadePluginLocalConfig__Output as _exa_cascade_plugins_pb_CascadePluginLocalConfig__Output } from './exa/cascade_plugins_pb/CascadePluginLocalConfig';
import type { CascadePluginRemoteConfig as _exa_cascade_plugins_pb_CascadePluginRemoteConfig, CascadePluginRemoteConfig__Output as _exa_cascade_plugins_pb_CascadePluginRemoteConfig__Output } from './exa/cascade_plugins_pb/CascadePluginRemoteConfig';
import type { CascadePluginRemoteConfigTemplate as _exa_cascade_plugins_pb_CascadePluginRemoteConfigTemplate, CascadePluginRemoteConfigTemplate__Output as _exa_cascade_plugins_pb_CascadePluginRemoteConfigTemplate__Output } from './exa/cascade_plugins_pb/CascadePluginRemoteConfigTemplate';
import type { CascadePluginTemplate as _exa_cascade_plugins_pb_CascadePluginTemplate, CascadePluginTemplate__Output as _exa_cascade_plugins_pb_CascadePluginTemplate__Output } from './exa/cascade_plugins_pb/CascadePluginTemplate';
import type { CascadePluginsServiceClient as _exa_cascade_plugins_pb_CascadePluginsServiceClient, CascadePluginsServiceDefinition as _exa_cascade_plugins_pb_CascadePluginsServiceDefinition } from './exa/cascade_plugins_pb/CascadePluginsService';
import type { GetAvailableCascadePluginsRequest as _exa_cascade_plugins_pb_GetAvailableCascadePluginsRequest, GetAvailableCascadePluginsRequest__Output as _exa_cascade_plugins_pb_GetAvailableCascadePluginsRequest__Output } from './exa/cascade_plugins_pb/GetAvailableCascadePluginsRequest';
import type { GetAvailableCascadePluginsResponse as _exa_cascade_plugins_pb_GetAvailableCascadePluginsResponse, GetAvailableCascadePluginsResponse__Output as _exa_cascade_plugins_pb_GetAvailableCascadePluginsResponse__Output } from './exa/cascade_plugins_pb/GetAvailableCascadePluginsResponse';
import type { GetCascadePluginByIdRequest as _exa_cascade_plugins_pb_GetCascadePluginByIdRequest, GetCascadePluginByIdRequest__Output as _exa_cascade_plugins_pb_GetCascadePluginByIdRequest__Output } from './exa/cascade_plugins_pb/GetCascadePluginByIdRequest';
import type { GetCascadePluginByIdResponse as _exa_cascade_plugins_pb_GetCascadePluginByIdResponse, GetCascadePluginByIdResponse__Output as _exa_cascade_plugins_pb_GetCascadePluginByIdResponse__Output } from './exa/cascade_plugins_pb/GetCascadePluginByIdResponse';
import type { GetMcpClientInfosRequest as _exa_cascade_plugins_pb_GetMcpClientInfosRequest, GetMcpClientInfosRequest__Output as _exa_cascade_plugins_pb_GetMcpClientInfosRequest__Output } from './exa/cascade_plugins_pb/GetMcpClientInfosRequest';
import type { GetMcpClientInfosResponse as _exa_cascade_plugins_pb_GetMcpClientInfosResponse, GetMcpClientInfosResponse__Output as _exa_cascade_plugins_pb_GetMcpClientInfosResponse__Output } from './exa/cascade_plugins_pb/GetMcpClientInfosResponse';
import type { InstallCascadePluginRequest as _exa_cascade_plugins_pb_InstallCascadePluginRequest, InstallCascadePluginRequest__Output as _exa_cascade_plugins_pb_InstallCascadePluginRequest__Output } from './exa/cascade_plugins_pb/InstallCascadePluginRequest';
import type { InstallCascadePluginResponse as _exa_cascade_plugins_pb_InstallCascadePluginResponse, InstallCascadePluginResponse__Output as _exa_cascade_plugins_pb_InstallCascadePluginResponse__Output } from './exa/cascade_plugins_pb/InstallCascadePluginResponse';
import type { McpClientInfo as _exa_cascade_plugins_pb_McpClientInfo, McpClientInfo__Output as _exa_cascade_plugins_pb_McpClientInfo__Output } from './exa/cascade_plugins_pb/McpClientInfo';
import type { ChatExperimentStatus as _exa_chat_pb_ChatExperimentStatus, ChatExperimentStatus__Output as _exa_chat_pb_ChatExperimentStatus__Output } from './exa/chat_pb/ChatExperimentStatus';
import type { ChatMentionsSearchRequest as _exa_chat_pb_ChatMentionsSearchRequest, ChatMentionsSearchRequest__Output as _exa_chat_pb_ChatMentionsSearchRequest__Output } from './exa/chat_pb/ChatMentionsSearchRequest';
import type { ChatMentionsSearchResponse as _exa_chat_pb_ChatMentionsSearchResponse, ChatMentionsSearchResponse__Output as _exa_chat_pb_ChatMentionsSearchResponse__Output } from './exa/chat_pb/ChatMentionsSearchResponse';
import type { ChatMessage as _exa_chat_pb_ChatMessage, ChatMessage__Output as _exa_chat_pb_ChatMessage__Output } from './exa/chat_pb/ChatMessage';
import type { ChatMessageAction as _exa_chat_pb_ChatMessageAction, ChatMessageAction__Output as _exa_chat_pb_ChatMessageAction__Output } from './exa/chat_pb/ChatMessageAction';
import type { ChatMessageActionEdit as _exa_chat_pb_ChatMessageActionEdit, ChatMessageActionEdit__Output as _exa_chat_pb_ChatMessageActionEdit__Output } from './exa/chat_pb/ChatMessageActionEdit';
import type { ChatMessageActionGeneric as _exa_chat_pb_ChatMessageActionGeneric, ChatMessageActionGeneric__Output as _exa_chat_pb_ChatMessageActionGeneric__Output } from './exa/chat_pb/ChatMessageActionGeneric';
import type { ChatMessageActionSearch as _exa_chat_pb_ChatMessageActionSearch, ChatMessageActionSearch__Output as _exa_chat_pb_ChatMessageActionSearch__Output } from './exa/chat_pb/ChatMessageActionSearch';
import type { ChatMessageError as _exa_chat_pb_ChatMessageError, ChatMessageError__Output as _exa_chat_pb_ChatMessageError__Output } from './exa/chat_pb/ChatMessageError';
import type { ChatMessageIntent as _exa_chat_pb_ChatMessageIntent, ChatMessageIntent__Output as _exa_chat_pb_ChatMessageIntent__Output } from './exa/chat_pb/ChatMessageIntent';
import type { ChatMessagePrompt as _exa_chat_pb_ChatMessagePrompt, ChatMessagePrompt__Output as _exa_chat_pb_ChatMessagePrompt__Output } from './exa/chat_pb/ChatMessagePrompt';
import type { ChatMessageStatus as _exa_chat_pb_ChatMessageStatus, ChatMessageStatus__Output as _exa_chat_pb_ChatMessageStatus__Output } from './exa/chat_pb/ChatMessageStatus';
import type { ChatMessageStatusContextRelevancy as _exa_chat_pb_ChatMessageStatusContextRelevancy, ChatMessageStatusContextRelevancy__Output as _exa_chat_pb_ChatMessageStatusContextRelevancy__Output } from './exa/chat_pb/ChatMessageStatusContextRelevancy';
import type { ChatMetrics as _exa_chat_pb_ChatMetrics, ChatMetrics__Output as _exa_chat_pb_ChatMetrics__Output } from './exa/chat_pb/ChatMetrics';
import type { ChatToolChoice as _exa_chat_pb_ChatToolChoice, ChatToolChoice__Output as _exa_chat_pb_ChatToolChoice__Output } from './exa/chat_pb/ChatToolChoice';
import type { ChatToolDefinition as _exa_chat_pb_ChatToolDefinition, ChatToolDefinition__Output as _exa_chat_pb_ChatToolDefinition__Output } from './exa/chat_pb/ChatToolDefinition';
import type { CodeBlockInfo as _exa_chat_pb_CodeBlockInfo, CodeBlockInfo__Output as _exa_chat_pb_CodeBlockInfo__Output } from './exa/chat_pb/CodeBlockInfo';
import type { ComputerUseToolConfig as _exa_chat_pb_ComputerUseToolConfig, ComputerUseToolConfig__Output as _exa_chat_pb_ComputerUseToolConfig__Output } from './exa/chat_pb/ComputerUseToolConfig';
import type { Conversation as _exa_chat_pb_Conversation, Conversation__Output as _exa_chat_pb_Conversation__Output } from './exa/chat_pb/Conversation';
import type { DeepWikiContext as _exa_chat_pb_DeepWikiContext, DeepWikiContext__Output as _exa_chat_pb_DeepWikiContext__Output } from './exa/chat_pb/DeepWikiContext';
import type { DeepWikiHoverContext as _exa_chat_pb_DeepWikiHoverContext, DeepWikiHoverContext__Output as _exa_chat_pb_DeepWikiHoverContext__Output } from './exa/chat_pb/DeepWikiHoverContext';
import type { DeepWikiSymbolContext as _exa_chat_pb_DeepWikiSymbolContext, DeepWikiSymbolContext__Output as _exa_chat_pb_DeepWikiSymbolContext__Output } from './exa/chat_pb/DeepWikiSymbolContext';
import type { DeepWikiSymbolRange as _exa_chat_pb_DeepWikiSymbolRange, DeepWikiSymbolRange__Output as _exa_chat_pb_DeepWikiSymbolRange__Output } from './exa/chat_pb/DeepWikiSymbolRange';
import type { FormattedChatMessage as _exa_chat_pb_FormattedChatMessage, FormattedChatMessage__Output as _exa_chat_pb_FormattedChatMessage__Output } from './exa/chat_pb/FormattedChatMessage';
import type { FunctionCallInfo as _exa_chat_pb_FunctionCallInfo, FunctionCallInfo__Output as _exa_chat_pb_FunctionCallInfo__Output } from './exa/chat_pb/FunctionCallInfo';
import type { GetChatMessageRequest as _exa_chat_pb_GetChatMessageRequest, GetChatMessageRequest__Output as _exa_chat_pb_GetChatMessageRequest__Output } from './exa/chat_pb/GetChatMessageRequest';
import type { GetDeepWikiRequest as _exa_chat_pb_GetDeepWikiRequest, GetDeepWikiRequest__Output as _exa_chat_pb_GetDeepWikiRequest__Output } from './exa/chat_pb/GetDeepWikiRequest';
import type { IntentClassExplain as _exa_chat_pb_IntentClassExplain, IntentClassExplain__Output as _exa_chat_pb_IntentClassExplain__Output } from './exa/chat_pb/IntentClassExplain';
import type { IntentCodeBlockExplain as _exa_chat_pb_IntentCodeBlockExplain, IntentCodeBlockExplain__Output as _exa_chat_pb_IntentCodeBlockExplain__Output } from './exa/chat_pb/IntentCodeBlockExplain';
import type { IntentCodeBlockRefactor as _exa_chat_pb_IntentCodeBlockRefactor, IntentCodeBlockRefactor__Output as _exa_chat_pb_IntentCodeBlockRefactor__Output } from './exa/chat_pb/IntentCodeBlockRefactor';
import type { IntentFastApply as _exa_chat_pb_IntentFastApply, IntentFastApply__Output as _exa_chat_pb_IntentFastApply__Output } from './exa/chat_pb/IntentFastApply';
import type { IntentFunctionDocstring as _exa_chat_pb_IntentFunctionDocstring, IntentFunctionDocstring__Output as _exa_chat_pb_IntentFunctionDocstring__Output } from './exa/chat_pb/IntentFunctionDocstring';
import type { IntentFunctionExplain as _exa_chat_pb_IntentFunctionExplain, IntentFunctionExplain__Output as _exa_chat_pb_IntentFunctionExplain__Output } from './exa/chat_pb/IntentFunctionExplain';
import type { IntentFunctionRefactor as _exa_chat_pb_IntentFunctionRefactor, IntentFunctionRefactor__Output as _exa_chat_pb_IntentFunctionRefactor__Output } from './exa/chat_pb/IntentFunctionRefactor';
import type { IntentFunctionUnitTests as _exa_chat_pb_IntentFunctionUnitTests, IntentFunctionUnitTests__Output as _exa_chat_pb_IntentFunctionUnitTests__Output } from './exa/chat_pb/IntentFunctionUnitTests';
import type { IntentGenerateCode as _exa_chat_pb_IntentGenerateCode, IntentGenerateCode__Output as _exa_chat_pb_IntentGenerateCode__Output } from './exa/chat_pb/IntentGenerateCode';
import type { IntentGeneric as _exa_chat_pb_IntentGeneric, IntentGeneric__Output as _exa_chat_pb_IntentGeneric__Output } from './exa/chat_pb/IntentGeneric';
import type { IntentProblemExplain as _exa_chat_pb_IntentProblemExplain, IntentProblemExplain__Output as _exa_chat_pb_IntentProblemExplain__Output } from './exa/chat_pb/IntentProblemExplain';
import type { IntentSearch as _exa_chat_pb_IntentSearch, IntentSearch__Output as _exa_chat_pb_IntentSearch__Output } from './exa/chat_pb/IntentSearch';
import type { ParameterInfo as _exa_chat_pb_ParameterInfo, ParameterInfo__Output as _exa_chat_pb_ParameterInfo__Output } from './exa/chat_pb/ParameterInfo';
import type { PromptCacheOptions as _exa_chat_pb_PromptCacheOptions, PromptCacheOptions__Output as _exa_chat_pb_PromptCacheOptions__Output } from './exa/chat_pb/PromptCacheOptions';
import type { RawChatMessage as _exa_chat_pb_RawChatMessage, RawChatMessage__Output as _exa_chat_pb_RawChatMessage__Output } from './exa/chat_pb/RawChatMessage';
import type { RawGetChatMessageRequest as _exa_chat_pb_RawGetChatMessageRequest, RawGetChatMessageRequest__Output as _exa_chat_pb_RawGetChatMessageRequest__Output } from './exa/chat_pb/RawGetChatMessageRequest';
import type { CodeChangeWithContext as _exa_code_edit_code_edit_pb_CodeChangeWithContext, CodeChangeWithContext__Output as _exa_code_edit_code_edit_pb_CodeChangeWithContext__Output } from './exa/code_edit/code_edit_pb/CodeChangeWithContext';
import type { CodeContextItemChange as _exa_code_edit_code_edit_pb_CodeContextItemChange, CodeContextItemChange__Output as _exa_code_edit_code_edit_pb_CodeContextItemChange__Output } from './exa/code_edit/code_edit_pb/CodeContextItemChange';
import type { CodeContextItemWithClassification as _exa_code_edit_code_edit_pb_CodeContextItemWithClassification, CodeContextItemWithClassification__Output as _exa_code_edit_code_edit_pb_CodeContextItemWithClassification__Output } from './exa/code_edit/code_edit_pb/CodeContextItemWithClassification';
import type { CodeRetrievalEvalResult as _exa_code_edit_code_edit_pb_CodeRetrievalEvalResult, CodeRetrievalEvalResult__Output as _exa_code_edit_code_edit_pb_CodeRetrievalEvalResult__Output } from './exa/code_edit/code_edit_pb/CodeRetrievalEvalResult';
import type { CodeRetrievalEvalTask as _exa_code_edit_code_edit_pb_CodeRetrievalEvalTask, CodeRetrievalEvalTask__Output as _exa_code_edit_code_edit_pb_CodeRetrievalEvalTask__Output } from './exa/code_edit/code_edit_pb/CodeRetrievalEvalTask';
import type { CodeRetrievalResult as _exa_code_edit_code_edit_pb_CodeRetrievalResult, CodeRetrievalResult__Output as _exa_code_edit_code_edit_pb_CodeRetrievalResult__Output } from './exa/code_edit/code_edit_pb/CodeRetrievalResult';
import type { CommitToFileChangeRequest as _exa_code_edit_code_edit_pb_CommitToFileChangeRequest, CommitToFileChangeRequest__Output as _exa_code_edit_code_edit_pb_CommitToFileChangeRequest__Output } from './exa/code_edit/code_edit_pb/CommitToFileChangeRequest';
import type { CommitToFileChangeResponse as _exa_code_edit_code_edit_pb_CommitToFileChangeResponse, CommitToFileChangeResponse__Output as _exa_code_edit_code_edit_pb_CommitToFileChangeResponse__Output } from './exa/code_edit/code_edit_pb/CommitToFileChangeResponse';
import type { FileChange as _exa_code_edit_code_edit_pb_FileChange, FileChange__Output as _exa_code_edit_code_edit_pb_FileChange__Output } from './exa/code_edit/code_edit_pb/FileChange';
import type { GitCommit as _exa_code_edit_code_edit_pb_GitCommit, GitCommit__Output as _exa_code_edit_code_edit_pb_GitCommit__Output } from './exa/code_edit/code_edit_pb/GitCommit';
import type { GitFilePatch as _exa_code_edit_code_edit_pb_GitFilePatch, GitFilePatch__Output as _exa_code_edit_code_edit_pb_GitFilePatch__Output } from './exa/code_edit/code_edit_pb/GitFilePatch';
import type { InstructionWithId as _exa_code_edit_code_edit_pb_InstructionWithId, InstructionWithId__Output as _exa_code_edit_code_edit_pb_InstructionWithId__Output } from './exa/code_edit/code_edit_pb/InstructionWithId';
import type { InstructionWithIdList as _exa_code_edit_code_edit_pb_InstructionWithIdList, InstructionWithIdList__Output as _exa_code_edit_code_edit_pb_InstructionWithIdList__Output } from './exa/code_edit/code_edit_pb/InstructionWithIdList';
import type { Intent as _exa_code_edit_code_edit_pb_Intent, Intent__Output as _exa_code_edit_code_edit_pb_Intent__Output } from './exa/code_edit/code_edit_pb/Intent';
import type { IntentRelevance as _exa_code_edit_code_edit_pb_IntentRelevance, IntentRelevance__Output as _exa_code_edit_code_edit_pb_IntentRelevance__Output } from './exa/code_edit/code_edit_pb/IntentRelevance';
import type { RelevantCodeContext as _exa_code_edit_code_edit_pb_RelevantCodeContext, RelevantCodeContext__Output as _exa_code_edit_code_edit_pb_RelevantCodeContext__Output } from './exa/code_edit/code_edit_pb/RelevantCodeContext';
import type { RetrievalMetrics as _exa_code_edit_code_edit_pb_RetrievalMetrics, RetrievalMetrics__Output as _exa_code_edit_code_edit_pb_RetrievalMetrics__Output } from './exa/code_edit/code_edit_pb/RetrievalMetrics';
import type { RetrieverClassification as _exa_code_edit_code_edit_pb_RetrieverClassification, RetrieverClassification__Output as _exa_code_edit_code_edit_pb_RetrieverClassification__Output } from './exa/code_edit/code_edit_pb/RetrieverClassification';
import type { RetrieverInfo as _exa_code_edit_code_edit_pb_RetrieverInfo, RetrieverInfo__Output as _exa_code_edit_code_edit_pb_RetrieverInfo__Output } from './exa/code_edit/code_edit_pb/RetrieverInfo';
import type { ActionPointer as _exa_codeium_common_pb_ActionPointer, ActionPointer__Output as _exa_codeium_common_pb_ActionPointer__Output } from './exa/codeium_common_pb/ActionPointer';
import type { AllowedModelConfig as _exa_codeium_common_pb_AllowedModelConfig, AllowedModelConfig__Output as _exa_codeium_common_pb_AllowedModelConfig__Output } from './exa/codeium_common_pb/AllowedModelConfig';
import type { ApiProviderConfig as _exa_codeium_common_pb_ApiProviderConfig, ApiProviderConfig__Output as _exa_codeium_common_pb_ApiProviderConfig__Output } from './exa/codeium_common_pb/ApiProviderConfig';
import type { ApiProviderConfigMap as _exa_codeium_common_pb_ApiProviderConfigMap, ApiProviderConfigMap__Output as _exa_codeium_common_pb_ApiProviderConfigMap__Output } from './exa/codeium_common_pb/ApiProviderConfigMap';
import type { ApiProviderRoutingConfig as _exa_codeium_common_pb_ApiProviderRoutingConfig, ApiProviderRoutingConfig__Output as _exa_codeium_common_pb_ApiProviderRoutingConfig__Output } from './exa/codeium_common_pb/ApiProviderRoutingConfig';
import type { BrowserClickInteraction as _exa_codeium_common_pb_BrowserClickInteraction, BrowserClickInteraction__Output as _exa_codeium_common_pb_BrowserClickInteraction__Output } from './exa/codeium_common_pb/BrowserClickInteraction';
import type { BrowserCodeBlockScopeItem as _exa_codeium_common_pb_BrowserCodeBlockScopeItem, BrowserCodeBlockScopeItem__Output as _exa_codeium_common_pb_BrowserCodeBlockScopeItem__Output } from './exa/codeium_common_pb/BrowserCodeBlockScopeItem';
import type { BrowserInteraction as _exa_codeium_common_pb_BrowserInteraction, BrowserInteraction__Output as _exa_codeium_common_pb_BrowserInteraction__Output } from './exa/codeium_common_pb/BrowserInteraction';
import type { BrowserPageMetadata as _exa_codeium_common_pb_BrowserPageMetadata, BrowserPageMetadata__Output as _exa_codeium_common_pb_BrowserPageMetadata__Output } from './exa/codeium_common_pb/BrowserPageMetadata';
import type { BrowserPageScopeItem as _exa_codeium_common_pb_BrowserPageScopeItem, BrowserPageScopeItem__Output as _exa_codeium_common_pb_BrowserPageScopeItem__Output } from './exa/codeium_common_pb/BrowserPageScopeItem';
import type { BrowserScrollInteraction as _exa_codeium_common_pb_BrowserScrollInteraction, BrowserScrollInteraction__Output as _exa_codeium_common_pb_BrowserScrollInteraction__Output } from './exa/codeium_common_pb/BrowserScrollInteraction';
import type { BrowserTextScopeItem as _exa_codeium_common_pb_BrowserTextScopeItem, BrowserTextScopeItem__Output as _exa_codeium_common_pb_BrowserTextScopeItem__Output } from './exa/codeium_common_pb/BrowserTextScopeItem';
import type { CaptureFileRequestData as _exa_codeium_common_pb_CaptureFileRequestData, CaptureFileRequestData__Output as _exa_codeium_common_pb_CaptureFileRequestData__Output } from './exa/codeium_common_pb/CaptureFileRequestData';
import type { CascadeDataMetadata as _exa_codeium_common_pb_CascadeDataMetadata, CascadeDataMetadata__Output as _exa_codeium_common_pb_CascadeDataMetadata__Output } from './exa/codeium_common_pb/CascadeDataMetadata';
import type { CascadeModelConfigData as _exa_codeium_common_pb_CascadeModelConfigData, CascadeModelConfigData__Output as _exa_codeium_common_pb_CascadeModelConfigData__Output } from './exa/codeium_common_pb/CascadeModelConfigData';
import type { CascadeModelHeaderWarningExperimentPayload as _exa_codeium_common_pb_CascadeModelHeaderWarningExperimentPayload, CascadeModelHeaderWarningExperimentPayload__Output as _exa_codeium_common_pb_CascadeModelHeaderWarningExperimentPayload__Output } from './exa/codeium_common_pb/CascadeModelHeaderWarningExperimentPayload';
import type { CascadeNUXConfig as _exa_codeium_common_pb_CascadeNUXConfig, CascadeNUXConfig__Output as _exa_codeium_common_pb_CascadeNUXConfig__Output } from './exa/codeium_common_pb/CascadeNUXConfig';
import type { CascadeNUXState as _exa_codeium_common_pb_CascadeNUXState, CascadeNUXState__Output as _exa_codeium_common_pb_CascadeNUXState__Output } from './exa/codeium_common_pb/CascadeNUXState';
import type { CciWithSubrange as _exa_codeium_common_pb_CciWithSubrange, CciWithSubrange__Output as _exa_codeium_common_pb_CciWithSubrange__Output } from './exa/codeium_common_pb/CciWithSubrange';
import type { ChatCompletionInfo as _exa_codeium_common_pb_ChatCompletionInfo, ChatCompletionInfo__Output as _exa_codeium_common_pb_ChatCompletionInfo__Output } from './exa/codeium_common_pb/ChatCompletionInfo';
import type { ChatNodeConfig as _exa_codeium_common_pb_ChatNodeConfig, ChatNodeConfig__Output as _exa_codeium_common_pb_ChatNodeConfig__Output } from './exa/codeium_common_pb/ChatNodeConfig';
import type { ChatStats as _exa_codeium_common_pb_ChatStats, ChatStats__Output as _exa_codeium_common_pb_ChatStats__Output } from './exa/codeium_common_pb/ChatStats';
import type { ChatStatsByDateEntry as _exa_codeium_common_pb_ChatStatsByDateEntry, ChatStatsByDateEntry__Output as _exa_codeium_common_pb_ChatStatsByDateEntry__Output } from './exa/codeium_common_pb/ChatStatsByDateEntry';
import type { ChatStatsByModelEntry as _exa_codeium_common_pb_ChatStatsByModelEntry, ChatStatsByModelEntry__Output as _exa_codeium_common_pb_ChatStatsByModelEntry__Output } from './exa/codeium_common_pb/ChatStatsByModelEntry';
import type { ChatToolCall as _exa_codeium_common_pb_ChatToolCall, ChatToolCall__Output as _exa_codeium_common_pb_ChatToolCall__Output } from './exa/codeium_common_pb/ChatToolCall';
import type { ClassInfo as _exa_codeium_common_pb_ClassInfo, ClassInfo__Output as _exa_codeium_common_pb_ClassInfo__Output } from './exa/codeium_common_pb/ClassInfo';
import type { ClientModelConfig as _exa_codeium_common_pb_ClientModelConfig, ClientModelConfig__Output as _exa_codeium_common_pb_ClientModelConfig__Output } from './exa/codeium_common_pb/ClientModelConfig';
import type { ClientModelGroup as _exa_codeium_common_pb_ClientModelGroup, ClientModelGroup__Output as _exa_codeium_common_pb_ClientModelGroup__Output } from './exa/codeium_common_pb/ClientModelGroup';
import type { ClientModelSort as _exa_codeium_common_pb_ClientModelSort, ClientModelSort__Output as _exa_codeium_common_pb_ClientModelSort__Output } from './exa/codeium_common_pb/ClientModelSort';
import type { CodeAnnotation as _exa_codeium_common_pb_CodeAnnotation, CodeAnnotation__Output as _exa_codeium_common_pb_CodeAnnotation__Output } from './exa/codeium_common_pb/CodeAnnotation';
import type { CodeAnnotationsState as _exa_codeium_common_pb_CodeAnnotationsState, CodeAnnotationsState__Output as _exa_codeium_common_pb_CodeAnnotationsState__Output } from './exa/codeium_common_pb/CodeAnnotationsState';
import type { CodeContextItem as _exa_codeium_common_pb_CodeContextItem, CodeContextItem__Output as _exa_codeium_common_pb_CodeContextItem__Output } from './exa/codeium_common_pb/CodeContextItem';
import type { CodeDiagnostic as _exa_codeium_common_pb_CodeDiagnostic, CodeDiagnostic__Output as _exa_codeium_common_pb_CodeDiagnostic__Output } from './exa/codeium_common_pb/CodeDiagnostic';
import type { CodeMapScopeItem as _exa_codeium_common_pb_CodeMapScopeItem, CodeMapScopeItem__Output as _exa_codeium_common_pb_CodeMapScopeItem__Output } from './exa/codeium_common_pb/CodeMapScopeItem';
import type { CodebaseCluster as _exa_codeium_common_pb_CodebaseCluster, CodebaseCluster__Output as _exa_codeium_common_pb_CodebaseCluster__Output } from './exa/codeium_common_pb/CodebaseCluster';
import type { CodebaseClusterList as _exa_codeium_common_pb_CodebaseClusterList, CodebaseClusterList__Output as _exa_codeium_common_pb_CodebaseClusterList__Output } from './exa/codeium_common_pb/CodebaseClusterList';
import type { CommandStats as _exa_codeium_common_pb_CommandStats, CommandStats__Output as _exa_codeium_common_pb_CommandStats__Output } from './exa/codeium_common_pb/CommandStats';
import type { CommandStatsByDateEntry as _exa_codeium_common_pb_CommandStatsByDateEntry, CommandStatsByDateEntry__Output as _exa_codeium_common_pb_CommandStatsByDateEntry__Output } from './exa/codeium_common_pb/CommandStatsByDateEntry';
import type { Completion as _exa_codeium_common_pb_Completion, Completion__Output as _exa_codeium_common_pb_Completion__Output } from './exa/codeium_common_pb/Completion';
import type { CompletionByDateEntry as _exa_codeium_common_pb_CompletionByDateEntry, CompletionByDateEntry__Output as _exa_codeium_common_pb_CompletionByDateEntry__Output } from './exa/codeium_common_pb/CompletionByDateEntry';
import type { CompletionByLanguageEntry as _exa_codeium_common_pb_CompletionByLanguageEntry, CompletionByLanguageEntry__Output as _exa_codeium_common_pb_CompletionByLanguageEntry__Output } from './exa/codeium_common_pb/CompletionByLanguageEntry';
import type { CompletionConfiguration as _exa_codeium_common_pb_CompletionConfiguration, CompletionConfiguration__Output as _exa_codeium_common_pb_CompletionConfiguration__Output } from './exa/codeium_common_pb/CompletionConfiguration';
import type { CompletionDelta as _exa_codeium_common_pb_CompletionDelta, CompletionDelta__Output as _exa_codeium_common_pb_CompletionDelta__Output } from './exa/codeium_common_pb/CompletionDelta';
import type { CompletionDeltaMap as _exa_codeium_common_pb_CompletionDeltaMap, CompletionDeltaMap__Output as _exa_codeium_common_pb_CompletionDeltaMap__Output } from './exa/codeium_common_pb/CompletionDeltaMap';
import type { CompletionExample as _exa_codeium_common_pb_CompletionExample, CompletionExample__Output as _exa_codeium_common_pb_CompletionExample__Output } from './exa/codeium_common_pb/CompletionExample';
import type { CompletionExampleWithMetadata as _exa_codeium_common_pb_CompletionExampleWithMetadata, CompletionExampleWithMetadata__Output as _exa_codeium_common_pb_CompletionExampleWithMetadata__Output } from './exa/codeium_common_pb/CompletionExampleWithMetadata';
import type { CompletionLatencyInfo as _exa_codeium_common_pb_CompletionLatencyInfo, CompletionLatencyInfo__Output as _exa_codeium_common_pb_CompletionLatencyInfo__Output } from './exa/codeium_common_pb/CompletionLatencyInfo';
import type { CompletionProfile as _exa_codeium_common_pb_CompletionProfile, CompletionProfile__Output as _exa_codeium_common_pb_CompletionProfile__Output } from './exa/codeium_common_pb/CompletionProfile';
import type { CompletionResponse as _exa_codeium_common_pb_CompletionResponse, CompletionResponse__Output as _exa_codeium_common_pb_CompletionResponse__Output } from './exa/codeium_common_pb/CompletionResponse';
import type { CompletionStatistics as _exa_codeium_common_pb_CompletionStatistics, CompletionStatistics__Output as _exa_codeium_common_pb_CompletionStatistics__Output } from './exa/codeium_common_pb/CompletionStatistics';
import type { CompletionWithLatencyInfo as _exa_codeium_common_pb_CompletionWithLatencyInfo, CompletionWithLatencyInfo__Output as _exa_codeium_common_pb_CompletionWithLatencyInfo__Output } from './exa/codeium_common_pb/CompletionWithLatencyInfo';
import type { CompletionsRequest as _exa_codeium_common_pb_CompletionsRequest, CompletionsRequest__Output as _exa_codeium_common_pb_CompletionsRequest__Output } from './exa/codeium_common_pb/CompletionsRequest';
import type { ConsoleLogLine as _exa_codeium_common_pb_ConsoleLogLine, ConsoleLogLine__Output as _exa_codeium_common_pb_ConsoleLogLine__Output } from './exa/codeium_common_pb/ConsoleLogLine';
import type { ConsoleLogScopeItem as _exa_codeium_common_pb_ConsoleLogScopeItem, ConsoleLogScopeItem__Output as _exa_codeium_common_pb_ConsoleLogScopeItem__Output } from './exa/codeium_common_pb/ConsoleLogScopeItem';
import type { ContextScope as _exa_codeium_common_pb_ContextScope, ContextScope__Output as _exa_codeium_common_pb_ContextScope__Output } from './exa/codeium_common_pb/ContextScope';
import type { ContextScopeItem as _exa_codeium_common_pb_ContextScopeItem, ContextScopeItem__Output as _exa_codeium_common_pb_ContextScopeItem__Output } from './exa/codeium_common_pb/ContextScopeItem';
import type { ContextSubrange as _exa_codeium_common_pb_ContextSubrange, ContextSubrange__Output as _exa_codeium_common_pb_ContextSubrange__Output } from './exa/codeium_common_pb/ContextSubrange';
import type { ConversationBrainConfig as _exa_codeium_common_pb_ConversationBrainConfig, ConversationBrainConfig__Output as _exa_codeium_common_pb_ConversationBrainConfig__Output } from './exa/codeium_common_pb/ConversationBrainConfig';
import type { ConversationScopeItem as _exa_codeium_common_pb_ConversationScopeItem, ConversationScopeItem__Output as _exa_codeium_common_pb_ConversationScopeItem__Output } from './exa/codeium_common_pb/ConversationScopeItem';
import type { CustomProviderSettings as _exa_codeium_common_pb_CustomProviderSettings, CustomProviderSettings__Output as _exa_codeium_common_pb_CustomProviderSettings__Output } from './exa/codeium_common_pb/CustomProviderSettings';
import type { DOMElementScopeItem as _exa_codeium_common_pb_DOMElementScopeItem, DOMElementScopeItem__Output as _exa_codeium_common_pb_DOMElementScopeItem__Output } from './exa/codeium_common_pb/DOMElementScopeItem';
import type { DOMTree as _exa_codeium_common_pb_DOMTree, DOMTree__Output as _exa_codeium_common_pb_DOMTree__Output } from './exa/codeium_common_pb/DOMTree';
import type { DefaultOverrideModelConfig as _exa_codeium_common_pb_DefaultOverrideModelConfig, DefaultOverrideModelConfig__Output as _exa_codeium_common_pb_DefaultOverrideModelConfig__Output } from './exa/codeium_common_pb/DefaultOverrideModelConfig';
import type { DefaultPinnedContextConfig as _exa_codeium_common_pb_DefaultPinnedContextConfig, DefaultPinnedContextConfig__Output as _exa_codeium_common_pb_DefaultPinnedContextConfig__Output } from './exa/codeium_common_pb/DefaultPinnedContextConfig';
import type { DeployTarget as _exa_codeium_common_pb_DeployTarget, DeployTarget__Output as _exa_codeium_common_pb_DeployTarget__Output } from './exa/codeium_common_pb/DeployTarget';
import type { DiagnosticFix as _exa_codeium_common_pb_DiagnosticFix, DiagnosticFix__Output as _exa_codeium_common_pb_DiagnosticFix__Output } from './exa/codeium_common_pb/DiagnosticFix';
import type { Document as _exa_codeium_common_pb_Document, Document__Output as _exa_codeium_common_pb_Document__Output } from './exa/codeium_common_pb/Document';
import type { DocumentLinesElement as _exa_codeium_common_pb_DocumentLinesElement, DocumentLinesElement__Output as _exa_codeium_common_pb_DocumentLinesElement__Output } from './exa/codeium_common_pb/DocumentLinesElement';
import type { DocumentOutline as _exa_codeium_common_pb_DocumentOutline, DocumentOutline__Output as _exa_codeium_common_pb_DocumentOutline__Output } from './exa/codeium_common_pb/DocumentOutline';
import type { DocumentOutlineElement as _exa_codeium_common_pb_DocumentOutlineElement, DocumentOutlineElement__Output as _exa_codeium_common_pb_DocumentOutlineElement__Output } from './exa/codeium_common_pb/DocumentOutlineElement';
import type { DocumentPosition as _exa_codeium_common_pb_DocumentPosition, DocumentPosition__Output as _exa_codeium_common_pb_DocumentPosition__Output } from './exa/codeium_common_pb/DocumentPosition';
import type { DocumentQuery as _exa_codeium_common_pb_DocumentQuery, DocumentQuery__Output as _exa_codeium_common_pb_DocumentQuery__Output } from './exa/codeium_common_pb/DocumentQuery';
import type { EditorOptions as _exa_codeium_common_pb_EditorOptions, EditorOptions__Output as _exa_codeium_common_pb_EditorOptions__Output } from './exa/codeium_common_pb/EditorOptions';
import type { Embedding as _exa_codeium_common_pb_Embedding, Embedding__Output as _exa_codeium_common_pb_Embedding__Output } from './exa/codeium_common_pb/Embedding';
import type { EmbeddingMetadata as _exa_codeium_common_pb_EmbeddingMetadata, EmbeddingMetadata__Output as _exa_codeium_common_pb_EmbeddingMetadata__Output } from './exa/codeium_common_pb/EmbeddingMetadata';
import type { EmbeddingResponse as _exa_codeium_common_pb_EmbeddingResponse, EmbeddingResponse__Output as _exa_codeium_common_pb_EmbeddingResponse__Output } from './exa/codeium_common_pb/EmbeddingResponse';
import type { EmbeddingsRequest as _exa_codeium_common_pb_EmbeddingsRequest, EmbeddingsRequest__Output as _exa_codeium_common_pb_EmbeddingsRequest__Output } from './exa/codeium_common_pb/EmbeddingsRequest';
import type { ErrorTrace as _exa_codeium_common_pb_ErrorTrace, ErrorTrace__Output as _exa_codeium_common_pb_ErrorTrace__Output } from './exa/codeium_common_pb/ErrorTrace';
import type { Event as _exa_codeium_common_pb_Event, Event__Output as _exa_codeium_common_pb_Event__Output } from './exa/codeium_common_pb/Event';
import type { ExperimentConfig as _exa_codeium_common_pb_ExperimentConfig, ExperimentConfig__Output as _exa_codeium_common_pb_ExperimentConfig__Output } from './exa/codeium_common_pb/ExperimentConfig';
import type { ExperimentLanguageServerVersionPayload as _exa_codeium_common_pb_ExperimentLanguageServerVersionPayload, ExperimentLanguageServerVersionPayload__Output as _exa_codeium_common_pb_ExperimentLanguageServerVersionPayload__Output } from './exa/codeium_common_pb/ExperimentLanguageServerVersionPayload';
import type { ExperimentMiddleModeTokenPayload as _exa_codeium_common_pb_ExperimentMiddleModeTokenPayload, ExperimentMiddleModeTokenPayload__Output as _exa_codeium_common_pb_ExperimentMiddleModeTokenPayload__Output } from './exa/codeium_common_pb/ExperimentMiddleModeTokenPayload';
import type { ExperimentModelConfigPayload as _exa_codeium_common_pb_ExperimentModelConfigPayload, ExperimentModelConfigPayload__Output as _exa_codeium_common_pb_ExperimentModelConfigPayload__Output } from './exa/codeium_common_pb/ExperimentModelConfigPayload';
import type { ExperimentMultilineModelThresholdPayload as _exa_codeium_common_pb_ExperimentMultilineModelThresholdPayload, ExperimentMultilineModelThresholdPayload__Output as _exa_codeium_common_pb_ExperimentMultilineModelThresholdPayload__Output } from './exa/codeium_common_pb/ExperimentMultilineModelThresholdPayload';
import type { ExperimentProfilingTelemetrySampleRatePayload as _exa_codeium_common_pb_ExperimentProfilingTelemetrySampleRatePayload, ExperimentProfilingTelemetrySampleRatePayload__Output as _exa_codeium_common_pb_ExperimentProfilingTelemetrySampleRatePayload__Output } from './exa/codeium_common_pb/ExperimentProfilingTelemetrySampleRatePayload';
import type { ExperimentSentryPayload as _exa_codeium_common_pb_ExperimentSentryPayload, ExperimentSentryPayload__Output as _exa_codeium_common_pb_ExperimentSentryPayload__Output } from './exa/codeium_common_pb/ExperimentSentryPayload';
import type { ExperimentWithVariant as _exa_codeium_common_pb_ExperimentWithVariant, ExperimentWithVariant__Output as _exa_codeium_common_pb_ExperimentWithVariant__Output } from './exa/codeium_common_pb/ExperimentWithVariant';
import type { ExternalModel as _exa_codeium_common_pb_ExternalModel, ExternalModel__Output as _exa_codeium_common_pb_ExternalModel__Output } from './exa/codeium_common_pb/ExternalModel';
import type { FaissStateStats as _exa_codeium_common_pb_FaissStateStats, FaissStateStats__Output as _exa_codeium_common_pb_FaissStateStats__Output } from './exa/codeium_common_pb/FaissStateStats';
import type { FastStatus as _exa_codeium_common_pb_FastStatus, FastStatus__Output as _exa_codeium_common_pb_FastStatus__Output } from './exa/codeium_common_pb/FastStatus';
import type { FeatureUsageData as _exa_codeium_common_pb_FeatureUsageData, FeatureUsageData__Output as _exa_codeium_common_pb_FeatureUsageData__Output } from './exa/codeium_common_pb/FeatureUsageData';
import type { FileLineRange as _exa_codeium_common_pb_FileLineRange, FileLineRange__Output as _exa_codeium_common_pb_FileLineRange__Output } from './exa/codeium_common_pb/FileLineRange';
import type { FileRangeContent as _exa_codeium_common_pb_FileRangeContent, FileRangeContent__Output as _exa_codeium_common_pb_FileRangeContent__Output } from './exa/codeium_common_pb/FileRangeContent';
import type { FunctionInfo as _exa_codeium_common_pb_FunctionInfo, FunctionInfo__Output as _exa_codeium_common_pb_FunctionInfo__Output } from './exa/codeium_common_pb/FunctionInfo';
import type { GRPCStatus as _exa_codeium_common_pb_GRPCStatus, GRPCStatus__Output as _exa_codeium_common_pb_GRPCStatus__Output } from './exa/codeium_common_pb/GRPCStatus';
import type { GitCommitData as _exa_codeium_common_pb_GitCommitData, GitCommitData__Output as _exa_codeium_common_pb_GitCommitData__Output } from './exa/codeium_common_pb/GitCommitData';
import type { GitDiffData as _exa_codeium_common_pb_GitDiffData, GitDiffData__Output as _exa_codeium_common_pb_GitDiffData__Output } from './exa/codeium_common_pb/GitDiffData';
import type { GitRepoInfo as _exa_codeium_common_pb_GitRepoInfo, GitRepoInfo__Output as _exa_codeium_common_pb_GitRepoInfo__Output } from './exa/codeium_common_pb/GitRepoInfo';
import type { GitScopeItem as _exa_codeium_common_pb_GitScopeItem, GitScopeItem__Output as _exa_codeium_common_pb_GitScopeItem__Output } from './exa/codeium_common_pb/GitScopeItem';
import type { GitWorkingChangesData as _exa_codeium_common_pb_GitWorkingChangesData, GitWorkingChangesData__Output as _exa_codeium_common_pb_GitWorkingChangesData__Output } from './exa/codeium_common_pb/GitWorkingChangesData';
import type { GithubPullRequestItem as _exa_codeium_common_pb_GithubPullRequestItem, GithubPullRequestItem__Output as _exa_codeium_common_pb_GithubPullRequestItem__Output } from './exa/codeium_common_pb/GithubPullRequestItem';
import type { GraphExecutionState as _exa_codeium_common_pb_GraphExecutionState, GraphExecutionState__Output as _exa_codeium_common_pb_GraphExecutionState__Output } from './exa/codeium_common_pb/GraphExecutionState';
import type { Guideline as _exa_codeium_common_pb_Guideline, Guideline__Output as _exa_codeium_common_pb_Guideline__Output } from './exa/codeium_common_pb/Guideline';
import type { GuidelineItem as _exa_codeium_common_pb_GuidelineItem, GuidelineItem__Output as _exa_codeium_common_pb_GuidelineItem__Output } from './exa/codeium_common_pb/GuidelineItem';
import type { ImageData as _exa_codeium_common_pb_ImageData, ImageData__Output as _exa_codeium_common_pb_ImageData__Output } from './exa/codeium_common_pb/ImageData';
import type { IndexerDbStats as _exa_codeium_common_pb_IndexerDbStats, IndexerDbStats__Output as _exa_codeium_common_pb_IndexerDbStats__Output } from './exa/codeium_common_pb/IndexerDbStats';
import type { IndexerStats as _exa_codeium_common_pb_IndexerStats, IndexerStats__Output as _exa_codeium_common_pb_IndexerStats__Output } from './exa/codeium_common_pb/IndexerStats';
import type { IntellisenseSuggestion as _exa_codeium_common_pb_IntellisenseSuggestion, IntellisenseSuggestion__Output as _exa_codeium_common_pb_IntellisenseSuggestion__Output } from './exa/codeium_common_pb/IntellisenseSuggestion';
import type { KnowledgeBaseChunk as _exa_codeium_common_pb_KnowledgeBaseChunk, KnowledgeBaseChunk__Output as _exa_codeium_common_pb_KnowledgeBaseChunk__Output } from './exa/codeium_common_pb/KnowledgeBaseChunk';
import type { KnowledgeBaseGroup as _exa_codeium_common_pb_KnowledgeBaseGroup, KnowledgeBaseGroup__Output as _exa_codeium_common_pb_KnowledgeBaseGroup__Output } from './exa/codeium_common_pb/KnowledgeBaseGroup';
import type { KnowledgeBaseItem as _exa_codeium_common_pb_KnowledgeBaseItem, KnowledgeBaseItem__Output as _exa_codeium_common_pb_KnowledgeBaseItem__Output } from './exa/codeium_common_pb/KnowledgeBaseItem';
import type { KnowledgeBaseItemWithMetadata as _exa_codeium_common_pb_KnowledgeBaseItemWithMetadata, KnowledgeBaseItemWithMetadata__Output as _exa_codeium_common_pb_KnowledgeBaseItemWithMetadata__Output } from './exa/codeium_common_pb/KnowledgeBaseItemWithMetadata';
import type { KnowledgeBaseScopeItem as _exa_codeium_common_pb_KnowledgeBaseScopeItem, KnowledgeBaseScopeItem__Output as _exa_codeium_common_pb_KnowledgeBaseScopeItem__Output } from './exa/codeium_common_pb/KnowledgeBaseScopeItem';
import type { LanguageServerDiagnostics as _exa_codeium_common_pb_LanguageServerDiagnostics, LanguageServerDiagnostics__Output as _exa_codeium_common_pb_LanguageServerDiagnostics__Output } from './exa/codeium_common_pb/LanguageServerDiagnostics';
import type { LastUpdateRecord as _exa_codeium_common_pb_LastUpdateRecord, LastUpdateRecord__Output as _exa_codeium_common_pb_LastUpdateRecord__Output } from './exa/codeium_common_pb/LastUpdateRecord';
import type { LifeguardConfig as _exa_codeium_common_pb_LifeguardConfig, LifeguardConfig__Output as _exa_codeium_common_pb_LifeguardConfig__Output } from './exa/codeium_common_pb/LifeguardConfig';
import type { LifeguardModeConfig as _exa_codeium_common_pb_LifeguardModeConfig, LifeguardModeConfig__Output as _exa_codeium_common_pb_LifeguardModeConfig__Output } from './exa/codeium_common_pb/LifeguardModeConfig';
import type { LocalSqliteFaissDbStats as _exa_codeium_common_pb_LocalSqliteFaissDbStats, LocalSqliteFaissDbStats__Output as _exa_codeium_common_pb_LocalSqliteFaissDbStats__Output } from './exa/codeium_common_pb/LocalSqliteFaissDbStats';
import type { LspReference as _exa_codeium_common_pb_LspReference, LspReference__Output as _exa_codeium_common_pb_LspReference__Output } from './exa/codeium_common_pb/LspReference';
import type { MQueryConfig as _exa_codeium_common_pb_MQueryConfig, MQueryConfig__Output as _exa_codeium_common_pb_MQueryConfig__Output } from './exa/codeium_common_pb/MQueryConfig';
import type { MarkdownChunk as _exa_codeium_common_pb_MarkdownChunk, MarkdownChunk__Output as _exa_codeium_common_pb_MarkdownChunk__Output } from './exa/codeium_common_pb/MarkdownChunk';
import type { McpCommandTemplate as _exa_codeium_common_pb_McpCommandTemplate, McpCommandTemplate__Output as _exa_codeium_common_pb_McpCommandTemplate__Output } from './exa/codeium_common_pb/McpCommandTemplate';
import type { McpCommandVariable as _exa_codeium_common_pb_McpCommandVariable, McpCommandVariable__Output as _exa_codeium_common_pb_McpCommandVariable__Output } from './exa/codeium_common_pb/McpCommandVariable';
import type { McpLocalServer as _exa_codeium_common_pb_McpLocalServer, McpLocalServer__Output as _exa_codeium_common_pb_McpLocalServer__Output } from './exa/codeium_common_pb/McpLocalServer';
import type { McpPromptScopeItem as _exa_codeium_common_pb_McpPromptScopeItem, McpPromptScopeItem__Output as _exa_codeium_common_pb_McpPromptScopeItem__Output } from './exa/codeium_common_pb/McpPromptScopeItem';
import type { McpRemoteServer as _exa_codeium_common_pb_McpRemoteServer, McpRemoteServer__Output as _exa_codeium_common_pb_McpRemoteServer__Output } from './exa/codeium_common_pb/McpRemoteServer';
import type { McpResourceItem as _exa_codeium_common_pb_McpResourceItem, McpResourceItem__Output as _exa_codeium_common_pb_McpResourceItem__Output } from './exa/codeium_common_pb/McpResourceItem';
import type { McpServerCommand as _exa_codeium_common_pb_McpServerCommand, McpServerCommand__Output as _exa_codeium_common_pb_McpServerCommand__Output } from './exa/codeium_common_pb/McpServerCommand';
import type { McpServerConfig as _exa_codeium_common_pb_McpServerConfig, McpServerConfig__Output as _exa_codeium_common_pb_McpServerConfig__Output } from './exa/codeium_common_pb/McpServerConfig';
import type { McpServerTemplate as _exa_codeium_common_pb_McpServerTemplate, McpServerTemplate__Output as _exa_codeium_common_pb_McpServerTemplate__Output } from './exa/codeium_common_pb/McpServerTemplate';
import type { Metadata as _exa_codeium_common_pb_Metadata, Metadata__Output as _exa_codeium_common_pb_Metadata__Output } from './exa/codeium_common_pb/Metadata';
import type { MetricsRecord as _exa_codeium_common_pb_MetricsRecord, MetricsRecord__Output as _exa_codeium_common_pb_MetricsRecord__Output } from './exa/codeium_common_pb/MetricsRecord';
import type { MockResponseData as _exa_codeium_common_pb_MockResponseData, MockResponseData__Output as _exa_codeium_common_pb_MockResponseData__Output } from './exa/codeium_common_pb/MockResponseData';
import type { ModelConfig as _exa_codeium_common_pb_ModelConfig, ModelConfig__Output as _exa_codeium_common_pb_ModelConfig__Output } from './exa/codeium_common_pb/ModelConfig';
import type { ModelFeatures as _exa_codeium_common_pb_ModelFeatures, ModelFeatures__Output as _exa_codeium_common_pb_ModelFeatures__Output } from './exa/codeium_common_pb/ModelFeatures';
import type { ModelInfo as _exa_codeium_common_pb_ModelInfo, ModelInfo__Output as _exa_codeium_common_pb_ModelInfo__Output } from './exa/codeium_common_pb/ModelInfo';
import type { ModelNotification as _exa_codeium_common_pb_ModelNotification, ModelNotification__Output as _exa_codeium_common_pb_ModelNotification__Output } from './exa/codeium_common_pb/ModelNotification';
import type { ModelNotificationExperimentPayload as _exa_codeium_common_pb_ModelNotificationExperimentPayload, ModelNotificationExperimentPayload__Output as _exa_codeium_common_pb_ModelNotificationExperimentPayload__Output } from './exa/codeium_common_pb/ModelNotificationExperimentPayload';
import type { ModelOrAlias as _exa_codeium_common_pb_ModelOrAlias, ModelOrAlias__Output as _exa_codeium_common_pb_ModelOrAlias__Output } from './exa/codeium_common_pb/ModelOrAlias';
import type { ModelStatusInfo as _exa_codeium_common_pb_ModelStatusInfo, ModelStatusInfo__Output as _exa_codeium_common_pb_ModelStatusInfo__Output } from './exa/codeium_common_pb/ModelStatusInfo';
import type { ModelUsageStats as _exa_codeium_common_pb_ModelUsageStats, ModelUsageStats__Output as _exa_codeium_common_pb_ModelUsageStats__Output } from './exa/codeium_common_pb/ModelUsageStats';
import type { NodeExecutionRecord as _exa_codeium_common_pb_NodeExecutionRecord, NodeExecutionRecord__Output as _exa_codeium_common_pb_NodeExecutionRecord__Output } from './exa/codeium_common_pb/NodeExecutionRecord';
import type { PackedStreamingCompletionMaps as _exa_codeium_common_pb_PackedStreamingCompletionMaps, PackedStreamingCompletionMaps__Output as _exa_codeium_common_pb_PackedStreamingCompletionMaps__Output } from './exa/codeium_common_pb/PackedStreamingCompletionMaps';
import type { PartialIndexMetadata as _exa_codeium_common_pb_PartialIndexMetadata, PartialIndexMetadata__Output as _exa_codeium_common_pb_PartialIndexMetadata__Output } from './exa/codeium_common_pb/PartialIndexMetadata';
import type { PathScopeItem as _exa_codeium_common_pb_PathScopeItem, PathScopeItem__Output as _exa_codeium_common_pb_PathScopeItem__Output } from './exa/codeium_common_pb/PathScopeItem';
import type { PerforceDepotInfo as _exa_codeium_common_pb_PerforceDepotInfo, PerforceDepotInfo__Output as _exa_codeium_common_pb_PerforceDepotInfo__Output } from './exa/codeium_common_pb/PerforceDepotInfo';
import type { PinnedContext as _exa_codeium_common_pb_PinnedContext, PinnedContext__Output as _exa_codeium_common_pb_PinnedContext__Output } from './exa/codeium_common_pb/PinnedContext';
import type { PinnedContextConfig as _exa_codeium_common_pb_PinnedContextConfig, PinnedContextConfig__Output as _exa_codeium_common_pb_PinnedContextConfig__Output } from './exa/codeium_common_pb/PinnedContextConfig';
import type { PlanFileScopeItem as _exa_codeium_common_pb_PlanFileScopeItem, PlanFileScopeItem__Output as _exa_codeium_common_pb_PlanFileScopeItem__Output } from './exa/codeium_common_pb/PlanFileScopeItem';
import type { PlanInfo as _exa_codeium_common_pb_PlanInfo, PlanInfo__Output as _exa_codeium_common_pb_PlanInfo__Output } from './exa/codeium_common_pb/PlanInfo';
import type { PlanStatus as _exa_codeium_common_pb_PlanStatus, PlanStatus__Output as _exa_codeium_common_pb_PlanStatus__Output } from './exa/codeium_common_pb/PlanStatus';
import type { PostgresDbStats as _exa_codeium_common_pb_PostgresDbStats, PostgresDbStats__Output as _exa_codeium_common_pb_PostgresDbStats__Output } from './exa/codeium_common_pb/PostgresDbStats';
import type { ProductEvent as _exa_codeium_common_pb_ProductEvent, ProductEvent__Output as _exa_codeium_common_pb_ProductEvent__Output } from './exa/codeium_common_pb/ProductEvent';
import type { PromoStatus as _exa_codeium_common_pb_PromoStatus, PromoStatus__Output as _exa_codeium_common_pb_PromoStatus__Output } from './exa/codeium_common_pb/PromoStatus';
import type { PromptAnnotationRange as _exa_codeium_common_pb_PromptAnnotationRange, PromptAnnotationRange__Output as _exa_codeium_common_pb_PromptAnnotationRange__Output } from './exa/codeium_common_pb/PromptAnnotationRange';
import type { PromptComponents as _exa_codeium_common_pb_PromptComponents, PromptComponents__Output as _exa_codeium_common_pb_PromptComponents__Output } from './exa/codeium_common_pb/PromptComponents';
import type { PromptElementInclusionMetadata as _exa_codeium_common_pb_PromptElementInclusionMetadata, PromptElementInclusionMetadata__Output as _exa_codeium_common_pb_PromptElementInclusionMetadata__Output } from './exa/codeium_common_pb/PromptElementInclusionMetadata';
import type { PromptElementKindInfo as _exa_codeium_common_pb_PromptElementKindInfo, PromptElementKindInfo__Output as _exa_codeium_common_pb_PromptElementKindInfo__Output } from './exa/codeium_common_pb/PromptElementKindInfo';
import type { PromptElementRange as _exa_codeium_common_pb_PromptElementRange, PromptElementRange__Output as _exa_codeium_common_pb_PromptElementRange__Output } from './exa/codeium_common_pb/PromptElementRange';
import type { PromptStageLatency as _exa_codeium_common_pb_PromptStageLatency, PromptStageLatency__Output as _exa_codeium_common_pb_PromptStageLatency__Output } from './exa/codeium_common_pb/PromptStageLatency';
import type { Range as _exa_codeium_common_pb_Range, Range__Output as _exa_codeium_common_pb_Range__Output } from './exa/codeium_common_pb/Range';
import type { RecipeScopeItem as _exa_codeium_common_pb_RecipeScopeItem, RecipeScopeItem__Output as _exa_codeium_common_pb_RecipeScopeItem__Output } from './exa/codeium_common_pb/RecipeScopeItem';
import type { Repository as _exa_codeium_common_pb_Repository, Repository__Output as _exa_codeium_common_pb_Repository__Output } from './exa/codeium_common_pb/Repository';
import type { RepositoryPath as _exa_codeium_common_pb_RepositoryPath, RepositoryPath__Output as _exa_codeium_common_pb_RepositoryPath__Output } from './exa/codeium_common_pb/RepositoryPath';
import type { RepositoryPathScopeItem as _exa_codeium_common_pb_RepositoryPathScopeItem, RepositoryPathScopeItem__Output as _exa_codeium_common_pb_RepositoryPathScopeItem__Output } from './exa/codeium_common_pb/RepositoryPathScopeItem';
import type { RepositoryScopeItem as _exa_codeium_common_pb_RepositoryScopeItem, RepositoryScopeItem__Output as _exa_codeium_common_pb_RepositoryScopeItem__Output } from './exa/codeium_common_pb/RepositoryScopeItem';
import type { RewardsRequest as _exa_codeium_common_pb_RewardsRequest, RewardsRequest__Output as _exa_codeium_common_pb_RewardsRequest__Output } from './exa/codeium_common_pb/RewardsRequest';
import type { RewardsResponse as _exa_codeium_common_pb_RewardsResponse, RewardsResponse__Output as _exa_codeium_common_pb_RewardsResponse__Output } from './exa/codeium_common_pb/RewardsResponse';
import type { Rule as _exa_codeium_common_pb_Rule, Rule__Output as _exa_codeium_common_pb_Rule__Output } from './exa/codeium_common_pb/Rule';
import type { RuleScopeItem as _exa_codeium_common_pb_RuleScopeItem, RuleScopeItem__Output as _exa_codeium_common_pb_RuleScopeItem__Output } from './exa/codeium_common_pb/RuleScopeItem';
import type { RuleViolation as _exa_codeium_common_pb_RuleViolation, RuleViolation__Output as _exa_codeium_common_pb_RuleViolation__Output } from './exa/codeium_common_pb/RuleViolation';
import type { ScmWorkspaceInfo as _exa_codeium_common_pb_ScmWorkspaceInfo, ScmWorkspaceInfo__Output as _exa_codeium_common_pb_ScmWorkspaceInfo__Output } from './exa/codeium_common_pb/ScmWorkspaceInfo';
import type { SearchResultRecord as _exa_codeium_common_pb_SearchResultRecord, SearchResultRecord__Output as _exa_codeium_common_pb_SearchResultRecord__Output } from './exa/codeium_common_pb/SearchResultRecord';
import type { ShadowTarget as _exa_codeium_common_pb_ShadowTarget, ShadowTarget__Output as _exa_codeium_common_pb_ShadowTarget__Output } from './exa/codeium_common_pb/ShadowTarget';
import type { ShadowTargetList as _exa_codeium_common_pb_ShadowTargetList, ShadowTargetList__Output as _exa_codeium_common_pb_ShadowTargetList__Output } from './exa/codeium_common_pb/ShadowTargetList';
import type { ShadowTrafficConfig as _exa_codeium_common_pb_ShadowTrafficConfig, ShadowTrafficConfig__Output as _exa_codeium_common_pb_ShadowTrafficConfig__Output } from './exa/codeium_common_pb/ShadowTrafficConfig';
import type { SingleModelCompletionProfile as _exa_codeium_common_pb_SingleModelCompletionProfile, SingleModelCompletionProfile__Output as _exa_codeium_common_pb_SingleModelCompletionProfile__Output } from './exa/codeium_common_pb/SingleModelCompletionProfile';
import type { SkillScopeItem as _exa_codeium_common_pb_SkillScopeItem, SkillScopeItem__Output as _exa_codeium_common_pb_SkillScopeItem__Output } from './exa/codeium_common_pb/SkillScopeItem';
import type { SnippetWithWordCount as _exa_codeium_common_pb_SnippetWithWordCount, SnippetWithWordCount__Output as _exa_codeium_common_pb_SnippetWithWordCount__Output } from './exa/codeium_common_pb/SnippetWithWordCount';
import type { Status as _exa_codeium_common_pb_Status, Status__Output as _exa_codeium_common_pb_Status__Output } from './exa/codeium_common_pb/Status';
import type { StreamingCompletion as _exa_codeium_common_pb_StreamingCompletion, StreamingCompletion__Output as _exa_codeium_common_pb_StreamingCompletion__Output } from './exa/codeium_common_pb/StreamingCompletion';
import type { StreamingCompletionInfo as _exa_codeium_common_pb_StreamingCompletionInfo, StreamingCompletionInfo__Output as _exa_codeium_common_pb_StreamingCompletionInfo__Output } from './exa/codeium_common_pb/StreamingCompletionInfo';
import type { StreamingCompletionMap as _exa_codeium_common_pb_StreamingCompletionMap, StreamingCompletionMap__Output as _exa_codeium_common_pb_StreamingCompletionMap__Output } from './exa/codeium_common_pb/StreamingCompletionMap';
import type { StreamingCompletionResponse as _exa_codeium_common_pb_StreamingCompletionResponse, StreamingCompletionResponse__Output as _exa_codeium_common_pb_StreamingCompletionResponse__Output } from './exa/codeium_common_pb/StreamingCompletionResponse';
import type { StreamingEvalSuffixInfo as _exa_codeium_common_pb_StreamingEvalSuffixInfo, StreamingEvalSuffixInfo__Output as _exa_codeium_common_pb_StreamingEvalSuffixInfo__Output } from './exa/codeium_common_pb/StreamingEvalSuffixInfo';
import type { SuperCompleteFilterReason as _exa_codeium_common_pb_SuperCompleteFilterReason, SuperCompleteFilterReason__Output as _exa_codeium_common_pb_SuperCompleteFilterReason__Output } from './exa/codeium_common_pb/SuperCompleteFilterReason';
import type { TeamConfig as _exa_codeium_common_pb_TeamConfig, TeamConfig__Output as _exa_codeium_common_pb_TeamConfig__Output } from './exa/codeium_common_pb/TeamConfig';
import type { TeamOrganizationalControls as _exa_codeium_common_pb_TeamOrganizationalControls, TeamOrganizationalControls__Output as _exa_codeium_common_pb_TeamOrganizationalControls__Output } from './exa/codeium_common_pb/TeamOrganizationalControls';
import type { TeamsFeaturesMetadata as _exa_codeium_common_pb_TeamsFeaturesMetadata, TeamsFeaturesMetadata__Output as _exa_codeium_common_pb_TeamsFeaturesMetadata__Output } from './exa/codeium_common_pb/TeamsFeaturesMetadata';
import type { TerminalCommandData as _exa_codeium_common_pb_TerminalCommandData, TerminalCommandData__Output as _exa_codeium_common_pb_TerminalCommandData__Output } from './exa/codeium_common_pb/TerminalCommandData';
import type { TerminalScopeItem as _exa_codeium_common_pb_TerminalScopeItem, TerminalScopeItem__Output as _exa_codeium_common_pb_TerminalScopeItem__Output } from './exa/codeium_common_pb/TerminalScopeItem';
import type { TerminalShellCommand as _exa_codeium_common_pb_TerminalShellCommand, TerminalShellCommand__Output as _exa_codeium_common_pb_TerminalShellCommand__Output } from './exa/codeium_common_pb/TerminalShellCommand';
import type { TerminalShellCommandData as _exa_codeium_common_pb_TerminalShellCommandData, TerminalShellCommandData__Output as _exa_codeium_common_pb_TerminalShellCommandData__Output } from './exa/codeium_common_pb/TerminalShellCommandData';
import type { TerminalShellCommandHeader as _exa_codeium_common_pb_TerminalShellCommandHeader, TerminalShellCommandHeader__Output as _exa_codeium_common_pb_TerminalShellCommandHeader__Output } from './exa/codeium_common_pb/TerminalShellCommandHeader';
import type { TerminalShellCommandStreamChunk as _exa_codeium_common_pb_TerminalShellCommandStreamChunk, TerminalShellCommandStreamChunk__Output as _exa_codeium_common_pb_TerminalShellCommandStreamChunk__Output } from './exa/codeium_common_pb/TerminalShellCommandStreamChunk';
import type { TerminalShellCommandTrailer as _exa_codeium_common_pb_TerminalShellCommandTrailer, TerminalShellCommandTrailer__Output as _exa_codeium_common_pb_TerminalShellCommandTrailer__Output } from './exa/codeium_common_pb/TerminalShellCommandTrailer';
import type { TextBlock as _exa_codeium_common_pb_TextBlock, TextBlock__Output as _exa_codeium_common_pb_TextBlock__Output } from './exa/codeium_common_pb/TextBlock';
import type { TextData as _exa_codeium_common_pb_TextData, TextData__Output as _exa_codeium_common_pb_TextData__Output } from './exa/codeium_common_pb/TextData';
import type { TextOrScopeItem as _exa_codeium_common_pb_TextOrScopeItem, TextOrScopeItem__Output as _exa_codeium_common_pb_TextOrScopeItem__Output } from './exa/codeium_common_pb/TextOrScopeItem';
import type { ThirdPartyWebSearchConfig as _exa_codeium_common_pb_ThirdPartyWebSearchConfig, ThirdPartyWebSearchConfig__Output as _exa_codeium_common_pb_ThirdPartyWebSearchConfig__Output } from './exa/codeium_common_pb/ThirdPartyWebSearchConfig';
import type { TopUpStatus as _exa_codeium_common_pb_TopUpStatus, TopUpStatus__Output as _exa_codeium_common_pb_TopUpStatus__Output } from './exa/codeium_common_pb/TopUpStatus';
import type { TrajectoryDescription as _exa_codeium_common_pb_TrajectoryDescription, TrajectoryDescription__Output as _exa_codeium_common_pb_TrajectoryDescription__Output } from './exa/codeium_common_pb/TrajectoryDescription';
import type { UnleashContext as _exa_codeium_common_pb_UnleashContext, UnleashContext__Output as _exa_codeium_common_pb_UnleashContext__Output } from './exa/codeium_common_pb/UnleashContext';
import type { UserActivityScopeItem as _exa_codeium_common_pb_UserActivityScopeItem, UserActivityScopeItem__Output as _exa_codeium_common_pb_UserActivityScopeItem__Output } from './exa/codeium_common_pb/UserActivityScopeItem';
import type { UserNUXState as _exa_codeium_common_pb_UserNUXState, UserNUXState__Output as _exa_codeium_common_pb_UserNUXState__Output } from './exa/codeium_common_pb/UserNUXState';
import type { UserSettings as _exa_codeium_common_pb_UserSettings, UserSettings__Output as _exa_codeium_common_pb_UserSettings__Output } from './exa/codeium_common_pb/UserSettings';
import type { UserStatus as _exa_codeium_common_pb_UserStatus, UserStatus__Output as _exa_codeium_common_pb_UserStatus__Output } from './exa/codeium_common_pb/UserStatus';
import type { UserTableStats as _exa_codeium_common_pb_UserTableStats, UserTableStats__Output as _exa_codeium_common_pb_UserTableStats__Output } from './exa/codeium_common_pb/UserTableStats';
import type { WebAppDeploymentConfig as _exa_codeium_common_pb_WebAppDeploymentConfig, WebAppDeploymentConfig__Output as _exa_codeium_common_pb_WebAppDeploymentConfig__Output } from './exa/codeium_common_pb/WebAppDeploymentConfig';
import type { WebDocsOption as _exa_codeium_common_pb_WebDocsOption, WebDocsOption__Output as _exa_codeium_common_pb_WebDocsOption__Output } from './exa/codeium_common_pb/WebDocsOption';
import type { WindsurfDeployment as _exa_codeium_common_pb_WindsurfDeployment, WindsurfDeployment__Output as _exa_codeium_common_pb_WindsurfDeployment__Output } from './exa/codeium_common_pb/WindsurfDeployment';
import type { WindsurfProject as _exa_codeium_common_pb_WindsurfProject, WindsurfProject__Output as _exa_codeium_common_pb_WindsurfProject__Output } from './exa/codeium_common_pb/WindsurfProject';
import type { WordCount as _exa_codeium_common_pb_WordCount, WordCount__Output as _exa_codeium_common_pb_WordCount__Output } from './exa/codeium_common_pb/WordCount';
import type { WorkspaceIndexData as _exa_codeium_common_pb_WorkspaceIndexData, WorkspaceIndexData__Output as _exa_codeium_common_pb_WorkspaceIndexData__Output } from './exa/codeium_common_pb/WorkspaceIndexData';
import type { WorkspacePath as _exa_codeium_common_pb_WorkspacePath, WorkspacePath__Output as _exa_codeium_common_pb_WorkspacePath__Output } from './exa/codeium_common_pb/WorkspacePath';
import type { WorkspaceStats as _exa_codeium_common_pb_WorkspaceStats, WorkspaceStats__Output as _exa_codeium_common_pb_WorkspaceStats__Output } from './exa/codeium_common_pb/WorkspaceStats';
import type { CciWithSubrangeWithRetrievalMetadata as _exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata, CciWithSubrangeWithRetrievalMetadata__Output as _exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata__Output } from './exa/context_module_pb/CciWithSubrangeWithRetrievalMetadata';
import type { CodeContextItemIndexStats as _exa_context_module_pb_CodeContextItemIndexStats, CodeContextItemIndexStats__Output as _exa_context_module_pb_CodeContextItemIndexStats__Output } from './exa/context_module_pb/CodeContextItemIndexStats';
import type { CodeContextItemWithRetrievalMetadata as _exa_context_module_pb_CodeContextItemWithRetrievalMetadata, CodeContextItemWithRetrievalMetadata__Output as _exa_context_module_pb_CodeContextItemWithRetrievalMetadata__Output } from './exa/context_module_pb/CodeContextItemWithRetrievalMetadata';
import type { CodeContextProviderMetadata as _exa_context_module_pb_CodeContextProviderMetadata, CodeContextProviderMetadata__Output as _exa_context_module_pb_CodeContextProviderMetadata__Output } from './exa/context_module_pb/CodeContextProviderMetadata';
import type { ContextChangeActiveDocument as _exa_context_module_pb_ContextChangeActiveDocument, ContextChangeActiveDocument__Output as _exa_context_module_pb_ContextChangeActiveDocument__Output } from './exa/context_module_pb/ContextChangeActiveDocument';
import type { ContextChangeActiveNode as _exa_context_module_pb_ContextChangeActiveNode, ContextChangeActiveNode__Output as _exa_context_module_pb_ContextChangeActiveNode__Output } from './exa/context_module_pb/ContextChangeActiveNode';
import type { ContextChangeChatMessageReceived as _exa_context_module_pb_ContextChangeChatMessageReceived, ContextChangeChatMessageReceived__Output as _exa_context_module_pb_ContextChangeChatMessageReceived__Output } from './exa/context_module_pb/ContextChangeChatMessageReceived';
import type { ContextChangeCursorPosition as _exa_context_module_pb_ContextChangeCursorPosition, ContextChangeCursorPosition__Output as _exa_context_module_pb_ContextChangeCursorPosition__Output } from './exa/context_module_pb/ContextChangeCursorPosition';
import type { ContextChangeEvent as _exa_context_module_pb_ContextChangeEvent, ContextChangeEvent__Output as _exa_context_module_pb_ContextChangeEvent__Output } from './exa/context_module_pb/ContextChangeEvent';
import type { ContextChangeOpenDocuments as _exa_context_module_pb_ContextChangeOpenDocuments, ContextChangeOpenDocuments__Output as _exa_context_module_pb_ContextChangeOpenDocuments__Output } from './exa/context_module_pb/ContextChangeOpenDocuments';
import type { ContextChangeOracleItems as _exa_context_module_pb_ContextChangeOracleItems, ContextChangeOracleItems__Output as _exa_context_module_pb_ContextChangeOracleItems__Output } from './exa/context_module_pb/ContextChangeOracleItems';
import type { ContextChangePinnedContext as _exa_context_module_pb_ContextChangePinnedContext, ContextChangePinnedContext__Output as _exa_context_module_pb_ContextChangePinnedContext__Output } from './exa/context_module_pb/ContextChangePinnedContext';
import type { ContextChangePinnedGuideline as _exa_context_module_pb_ContextChangePinnedGuideline, ContextChangePinnedGuideline__Output as _exa_context_module_pb_ContextChangePinnedGuideline__Output } from './exa/context_module_pb/ContextChangePinnedGuideline';
import type { ContextModuleResult as _exa_context_module_pb_ContextModuleResult, ContextModuleResult__Output as _exa_context_module_pb_ContextModuleResult__Output } from './exa/context_module_pb/ContextModuleResult';
import type { ContextModuleStateStats as _exa_context_module_pb_ContextModuleStateStats, ContextModuleStateStats__Output as _exa_context_module_pb_ContextModuleStateStats__Output } from './exa/context_module_pb/ContextModuleStateStats';
import type { ContextModuleStats as _exa_context_module_pb_ContextModuleStats, ContextModuleStats__Output as _exa_context_module_pb_ContextModuleStats__Output } from './exa/context_module_pb/ContextModuleStats';
import type { FileNameWithRetrievalMetadata as _exa_context_module_pb_FileNameWithRetrievalMetadata, FileNameWithRetrievalMetadata__Output as _exa_context_module_pb_FileNameWithRetrievalMetadata__Output } from './exa/context_module_pb/FileNameWithRetrievalMetadata';
import type { LocalNodeState as _exa_context_module_pb_LocalNodeState, LocalNodeState__Output as _exa_context_module_pb_LocalNodeState__Output } from './exa/context_module_pb/LocalNodeState';
import type { PersistentContextModuleState as _exa_context_module_pb_PersistentContextModuleState, PersistentContextModuleState__Output as _exa_context_module_pb_PersistentContextModuleState__Output } from './exa/context_module_pb/PersistentContextModuleState';
import type { RetrievedCodeContextItemMetadata as _exa_context_module_pb_RetrievedCodeContextItemMetadata, RetrievedCodeContextItemMetadata__Output as _exa_context_module_pb_RetrievedCodeContextItemMetadata__Output } from './exa/context_module_pb/RetrievedCodeContextItemMetadata';
import type { ActionDebugInfo as _exa_cortex_pb_ActionDebugInfo, ActionDebugInfo__Output as _exa_cortex_pb_ActionDebugInfo__Output } from './exa/cortex_pb/ActionDebugInfo';
import type { ActionResult as _exa_cortex_pb_ActionResult, ActionResult__Output as _exa_cortex_pb_ActionResult__Output } from './exa/cortex_pb/ActionResult';
import type { ActionResultEdit as _exa_cortex_pb_ActionResultEdit, ActionResultEdit__Output as _exa_cortex_pb_ActionResultEdit__Output } from './exa/cortex_pb/ActionResultEdit';
import type { ActionSpec as _exa_cortex_pb_ActionSpec, ActionSpec__Output as _exa_cortex_pb_ActionSpec__Output } from './exa/cortex_pb/ActionSpec';
import type { ActionSpecCommand as _exa_cortex_pb_ActionSpecCommand, ActionSpecCommand__Output as _exa_cortex_pb_ActionSpecCommand__Output } from './exa/cortex_pb/ActionSpecCommand';
import type { ActionSpecCreateFile as _exa_cortex_pb_ActionSpecCreateFile, ActionSpecCreateFile__Output as _exa_cortex_pb_ActionSpecCreateFile__Output } from './exa/cortex_pb/ActionSpecCreateFile';
import type { ActionSpecDeleteFile as _exa_cortex_pb_ActionSpecDeleteFile, ActionSpecDeleteFile__Output as _exa_cortex_pb_ActionSpecDeleteFile__Output } from './exa/cortex_pb/ActionSpecDeleteFile';
import type { ActionState as _exa_cortex_pb_ActionState, ActionState__Output as _exa_cortex_pb_ActionState__Output } from './exa/cortex_pb/ActionState';
import type { ActiveUserState as _exa_cortex_pb_ActiveUserState, ActiveUserState__Output as _exa_cortex_pb_ActiveUserState__Output } from './exa/cortex_pb/ActiveUserState';
import type { AddAnnotationConfig as _exa_cortex_pb_AddAnnotationConfig, AddAnnotationConfig__Output as _exa_cortex_pb_AddAnnotationConfig__Output } from './exa/cortex_pb/AddAnnotationConfig';
import type { ArenaModeInfo as _exa_cortex_pb_ArenaModeInfo, ArenaModeInfo__Output as _exa_cortex_pb_ArenaModeInfo__Output } from './exa/cortex_pb/ArenaModeInfo';
import type { AskUserQuestionOption as _exa_cortex_pb_AskUserQuestionOption, AskUserQuestionOption__Output as _exa_cortex_pb_AskUserQuestionOption__Output } from './exa/cortex_pb/AskUserQuestionOption';
import type { AskUserQuestionToolConfig as _exa_cortex_pb_AskUserQuestionToolConfig, AskUserQuestionToolConfig__Output as _exa_cortex_pb_AskUserQuestionToolConfig__Output } from './exa/cortex_pb/AskUserQuestionToolConfig';
import type { AutoCascadeBroadcastToolConfig as _exa_cortex_pb_AutoCascadeBroadcastToolConfig, AutoCascadeBroadcastToolConfig__Output as _exa_cortex_pb_AutoCascadeBroadcastToolConfig__Output } from './exa/cortex_pb/AutoCascadeBroadcastToolConfig';
import type { AutoCommandConfig as _exa_cortex_pb_AutoCommandConfig, AutoCommandConfig__Output as _exa_cortex_pb_AutoCommandConfig__Output } from './exa/cortex_pb/AutoCommandConfig';
import type { AutoFixLintsConfig as _exa_cortex_pb_AutoFixLintsConfig, AutoFixLintsConfig__Output as _exa_cortex_pb_AutoFixLintsConfig__Output } from './exa/cortex_pb/AutoFixLintsConfig';
import type { AutoWebRequestConfig as _exa_cortex_pb_AutoWebRequestConfig, AutoWebRequestConfig__Output as _exa_cortex_pb_AutoWebRequestConfig__Output } from './exa/cortex_pb/AutoWebRequestConfig';
import type { BaseTrajectoryIdentifier as _exa_cortex_pb_BaseTrajectoryIdentifier, BaseTrajectoryIdentifier__Output as _exa_cortex_pb_BaseTrajectoryIdentifier__Output } from './exa/cortex_pb/BaseTrajectoryIdentifier';
import type { BrainConfig as _exa_cortex_pb_BrainConfig, BrainConfig__Output as _exa_cortex_pb_BrainConfig__Output } from './exa/cortex_pb/BrainConfig';
import type { BrainEntry as _exa_cortex_pb_BrainEntry, BrainEntry__Output as _exa_cortex_pb_BrainEntry__Output } from './exa/cortex_pb/BrainEntry';
import type { BrainEntryDelta as _exa_cortex_pb_BrainEntryDelta, BrainEntryDelta__Output as _exa_cortex_pb_BrainEntryDelta__Output } from './exa/cortex_pb/BrainEntryDelta';
import type { BrainEntryDeltaSummary as _exa_cortex_pb_BrainEntryDeltaSummary, BrainEntryDeltaSummary__Output as _exa_cortex_pb_BrainEntryDeltaSummary__Output } from './exa/cortex_pb/BrainEntryDeltaSummary';
import type { BrainUpdateStepCreationOptions as _exa_cortex_pb_BrainUpdateStepCreationOptions, BrainUpdateStepCreationOptions__Output as _exa_cortex_pb_BrainUpdateStepCreationOptions__Output } from './exa/cortex_pb/BrainUpdateStepCreationOptions';
import type { BrainUpdateStrategy as _exa_cortex_pb_BrainUpdateStrategy, BrainUpdateStrategy__Output as _exa_cortex_pb_BrainUpdateStrategy__Output } from './exa/cortex_pb/BrainUpdateStrategy';
import type { CacheBreakpointMetadata as _exa_cortex_pb_CacheBreakpointMetadata, CacheBreakpointMetadata__Output as _exa_cortex_pb_CacheBreakpointMetadata__Output } from './exa/cortex_pb/CacheBreakpointMetadata';
import type { CacheRequestOptions as _exa_cortex_pb_CacheRequestOptions, CacheRequestOptions__Output as _exa_cortex_pb_CacheRequestOptions__Output } from './exa/cortex_pb/CacheRequestOptions';
import type { CascadeAgentV2PlannerConfig as _exa_cortex_pb_CascadeAgentV2PlannerConfig, CascadeAgentV2PlannerConfig__Output as _exa_cortex_pb_CascadeAgentV2PlannerConfig__Output } from './exa/cortex_pb/CascadeAgentV2PlannerConfig';
import type { CascadeAgenticPlannerApplierConfig as _exa_cortex_pb_CascadeAgenticPlannerApplierConfig, CascadeAgenticPlannerApplierConfig__Output as _exa_cortex_pb_CascadeAgenticPlannerApplierConfig__Output } from './exa/cortex_pb/CascadeAgenticPlannerApplierConfig';
import type { CascadeAgenticPlannerConfig as _exa_cortex_pb_CascadeAgenticPlannerConfig, CascadeAgenticPlannerConfig__Output as _exa_cortex_pb_CascadeAgenticPlannerConfig__Output } from './exa/cortex_pb/CascadeAgenticPlannerConfig';
import type { CascadeAgenticPlannerManagerConfig as _exa_cortex_pb_CascadeAgenticPlannerManagerConfig, CascadeAgenticPlannerManagerConfig__Output as _exa_cortex_pb_CascadeAgenticPlannerManagerConfig__Output } from './exa/cortex_pb/CascadeAgenticPlannerManagerConfig';
import type { CascadeAskUserQuestionInteraction as _exa_cortex_pb_CascadeAskUserQuestionInteraction, CascadeAskUserQuestionInteraction__Output as _exa_cortex_pb_CascadeAskUserQuestionInteraction__Output } from './exa/cortex_pb/CascadeAskUserQuestionInteraction';
import type { CascadeAskUserQuestionInteractionSpec as _exa_cortex_pb_CascadeAskUserQuestionInteractionSpec, CascadeAskUserQuestionInteractionSpec__Output as _exa_cortex_pb_CascadeAskUserQuestionInteractionSpec__Output } from './exa/cortex_pb/CascadeAskUserQuestionInteractionSpec';
import type { CascadeCodemapPlannerConfig as _exa_cortex_pb_CascadeCodemapPlannerConfig, CascadeCodemapPlannerConfig__Output as _exa_cortex_pb_CascadeCodemapPlannerConfig__Output } from './exa/cortex_pb/CascadeCodemapPlannerConfig';
import type { CascadeConfig as _exa_cortex_pb_CascadeConfig, CascadeConfig__Output as _exa_cortex_pb_CascadeConfig__Output } from './exa/cortex_pb/CascadeConfig';
import type { CascadeConversationalPlannerConfig as _exa_cortex_pb_CascadeConversationalPlannerConfig, CascadeConversationalPlannerConfig__Output as _exa_cortex_pb_CascadeConversationalPlannerConfig__Output } from './exa/cortex_pb/CascadeConversationalPlannerConfig';
import type { CascadeConversationalV2PlannerConfig as _exa_cortex_pb_CascadeConversationalV2PlannerConfig, CascadeConversationalV2PlannerConfig__Output as _exa_cortex_pb_CascadeConversationalV2PlannerConfig__Output } from './exa/cortex_pb/CascadeConversationalV2PlannerConfig';
import type { CascadeDeployInteraction as _exa_cortex_pb_CascadeDeployInteraction, CascadeDeployInteraction__Output as _exa_cortex_pb_CascadeDeployInteraction__Output } from './exa/cortex_pb/CascadeDeployInteraction';
import type { CascadeDeployInteractionSpec as _exa_cortex_pb_CascadeDeployInteractionSpec, CascadeDeployInteractionSpec__Output as _exa_cortex_pb_CascadeDeployInteractionSpec__Output } from './exa/cortex_pb/CascadeDeployInteractionSpec';
import type { CascadeExecutorConfig as _exa_cortex_pb_CascadeExecutorConfig, CascadeExecutorConfig__Output as _exa_cortex_pb_CascadeExecutorConfig__Output } from './exa/cortex_pb/CascadeExecutorConfig';
import type { CascadeHook as _exa_cortex_pb_CascadeHook, CascadeHook__Output as _exa_cortex_pb_CascadeHook__Output } from './exa/cortex_pb/CascadeHook';
import type { CascadeHooks as _exa_cortex_pb_CascadeHooks, CascadeHooks__Output as _exa_cortex_pb_CascadeHooks__Output } from './exa/cortex_pb/CascadeHooks';
import type { CascadeLifeguardPlannerConfig as _exa_cortex_pb_CascadeLifeguardPlannerConfig, CascadeLifeguardPlannerConfig__Output as _exa_cortex_pb_CascadeLifeguardPlannerConfig__Output } from './exa/cortex_pb/CascadeLifeguardPlannerConfig';
import type { CascadePanelState as _exa_cortex_pb_CascadePanelState, CascadePanelState__Output as _exa_cortex_pb_CascadePanelState__Output } from './exa/cortex_pb/CascadePanelState';
import type { CascadePassivePlannerConfig as _exa_cortex_pb_CascadePassivePlannerConfig, CascadePassivePlannerConfig__Output as _exa_cortex_pb_CascadePassivePlannerConfig__Output } from './exa/cortex_pb/CascadePassivePlannerConfig';
import type { CascadePlannerConfig as _exa_cortex_pb_CascadePlannerConfig, CascadePlannerConfig__Output as _exa_cortex_pb_CascadePlannerConfig__Output } from './exa/cortex_pb/CascadePlannerConfig';
import type { CascadeReadUrlContentInteraction as _exa_cortex_pb_CascadeReadUrlContentInteraction, CascadeReadUrlContentInteraction__Output as _exa_cortex_pb_CascadeReadUrlContentInteraction__Output } from './exa/cortex_pb/CascadeReadUrlContentInteraction';
import type { CascadeReadUrlContentInteractionSpec as _exa_cortex_pb_CascadeReadUrlContentInteractionSpec, CascadeReadUrlContentInteractionSpec__Output as _exa_cortex_pb_CascadeReadUrlContentInteractionSpec__Output } from './exa/cortex_pb/CascadeReadUrlContentInteractionSpec';
import type { CascadeResearchPlannerConfig as _exa_cortex_pb_CascadeResearchPlannerConfig, CascadeResearchPlannerConfig__Output as _exa_cortex_pb_CascadeResearchPlannerConfig__Output } from './exa/cortex_pb/CascadeResearchPlannerConfig';
import type { CascadeRunCommandInteraction as _exa_cortex_pb_CascadeRunCommandInteraction, CascadeRunCommandInteraction__Output as _exa_cortex_pb_CascadeRunCommandInteraction__Output } from './exa/cortex_pb/CascadeRunCommandInteraction';
import type { CascadeRunCommandInteractionSpec as _exa_cortex_pb_CascadeRunCommandInteractionSpec, CascadeRunCommandInteractionSpec__Output as _exa_cortex_pb_CascadeRunCommandInteractionSpec__Output } from './exa/cortex_pb/CascadeRunCommandInteractionSpec';
import type { CascadeRunExtensionCodeInteraction as _exa_cortex_pb_CascadeRunExtensionCodeInteraction, CascadeRunExtensionCodeInteraction__Output as _exa_cortex_pb_CascadeRunExtensionCodeInteraction__Output } from './exa/cortex_pb/CascadeRunExtensionCodeInteraction';
import type { CascadeRunExtensionCodeInteractionSpec as _exa_cortex_pb_CascadeRunExtensionCodeInteractionSpec, CascadeRunExtensionCodeInteractionSpec__Output as _exa_cortex_pb_CascadeRunExtensionCodeInteractionSpec__Output } from './exa/cortex_pb/CascadeRunExtensionCodeInteractionSpec';
import type { CascadeState as _exa_cortex_pb_CascadeState, CascadeState__Output as _exa_cortex_pb_CascadeState__Output } from './exa/cortex_pb/CascadeState';
import type { CascadeSummarizerConfig as _exa_cortex_pb_CascadeSummarizerConfig, CascadeSummarizerConfig__Output as _exa_cortex_pb_CascadeSummarizerConfig__Output } from './exa/cortex_pb/CascadeSummarizerConfig';
import type { CascadeTaskResolutionInteraction as _exa_cortex_pb_CascadeTaskResolutionInteraction, CascadeTaskResolutionInteraction__Output as _exa_cortex_pb_CascadeTaskResolutionInteraction__Output } from './exa/cortex_pb/CascadeTaskResolutionInteraction';
import type { CascadeTaskResolutionInteractionSpec as _exa_cortex_pb_CascadeTaskResolutionInteractionSpec, CascadeTaskResolutionInteractionSpec__Output as _exa_cortex_pb_CascadeTaskResolutionInteractionSpec__Output } from './exa/cortex_pb/CascadeTaskResolutionInteractionSpec';
import type { CascadeToolConfig as _exa_cortex_pb_CascadeToolConfig, CascadeToolConfig__Output as _exa_cortex_pb_CascadeToolConfig__Output } from './exa/cortex_pb/CascadeToolConfig';
import type { CascadeTrajectorySummaries as _exa_cortex_pb_CascadeTrajectorySummaries, CascadeTrajectorySummaries__Output as _exa_cortex_pb_CascadeTrajectorySummaries__Output } from './exa/cortex_pb/CascadeTrajectorySummaries';
import type { CascadeTrajectorySummary as _exa_cortex_pb_CascadeTrajectorySummary, CascadeTrajectorySummary__Output as _exa_cortex_pb_CascadeTrajectorySummary__Output } from './exa/cortex_pb/CascadeTrajectorySummary';
import type { CascadeUpsertCodemapInteraction as _exa_cortex_pb_CascadeUpsertCodemapInteraction, CascadeUpsertCodemapInteraction__Output as _exa_cortex_pb_CascadeUpsertCodemapInteraction__Output } from './exa/cortex_pb/CascadeUpsertCodemapInteraction';
import type { CascadeUpsertCodemapInteractionSpec as _exa_cortex_pb_CascadeUpsertCodemapInteractionSpec, CascadeUpsertCodemapInteractionSpec__Output as _exa_cortex_pb_CascadeUpsertCodemapInteractionSpec__Output } from './exa/cortex_pb/CascadeUpsertCodemapInteractionSpec';
import type { CascadeUserInteraction as _exa_cortex_pb_CascadeUserInteraction, CascadeUserInteraction__Output as _exa_cortex_pb_CascadeUserInteraction__Output } from './exa/cortex_pb/CascadeUserInteraction';
import type { ChatModelMetadata as _exa_cortex_pb_ChatModelMetadata, ChatModelMetadata__Output as _exa_cortex_pb_ChatModelMetadata__Output } from './exa/cortex_pb/ChatModelMetadata';
import type { ChatStartMetadata as _exa_cortex_pb_ChatStartMetadata, ChatStartMetadata__Output as _exa_cortex_pb_ChatStartMetadata__Output } from './exa/cortex_pb/ChatStartMetadata';
import type { CheckpointConfig as _exa_cortex_pb_CheckpointConfig, CheckpointConfig__Output as _exa_cortex_pb_CheckpointConfig__Output } from './exa/cortex_pb/CheckpointConfig';
import type { ClusterQueryToolConfig as _exa_cortex_pb_ClusterQueryToolConfig, ClusterQueryToolConfig__Output as _exa_cortex_pb_ClusterQueryToolConfig__Output } from './exa/cortex_pb/ClusterQueryToolConfig';
import type { CodeMapSuggestion as _exa_cortex_pb_CodeMapSuggestion, CodeMapSuggestion__Output as _exa_cortex_pb_CodeMapSuggestion__Output } from './exa/cortex_pb/CodeMapSuggestion';
import type { CodeStepCreationOptions as _exa_cortex_pb_CodeStepCreationOptions, CodeStepCreationOptions__Output as _exa_cortex_pb_CodeStepCreationOptions__Output } from './exa/cortex_pb/CodeStepCreationOptions';
import type { CodeToolConfig as _exa_cortex_pb_CodeToolConfig, CodeToolConfig__Output as _exa_cortex_pb_CodeToolConfig__Output } from './exa/cortex_pb/CodeToolConfig';
import type { CodingStepState as _exa_cortex_pb_CodingStepState, CodingStepState__Output as _exa_cortex_pb_CodingStepState__Output } from './exa/cortex_pb/CodingStepState';
import type { CommandContentTarget as _exa_cortex_pb_CommandContentTarget, CommandContentTarget__Output as _exa_cortex_pb_CommandContentTarget__Output } from './exa/cortex_pb/CommandContentTarget';
import type { CommandHookResult as _exa_cortex_pb_CommandHookResult, CommandHookResult__Output as _exa_cortex_pb_CommandHookResult__Output } from './exa/cortex_pb/CommandHookResult';
import type { CommandHookSpec as _exa_cortex_pb_CommandHookSpec, CommandHookSpec__Output as _exa_cortex_pb_CommandHookSpec__Output } from './exa/cortex_pb/CommandHookSpec';
import type { CommandStatusToolConfig as _exa_cortex_pb_CommandStatusToolConfig, CommandStatusToolConfig__Output as _exa_cortex_pb_CommandStatusToolConfig__Output } from './exa/cortex_pb/CommandStatusToolConfig';
import type { CommandTiming as _exa_cortex_pb_CommandTiming, CommandTiming__Output as _exa_cortex_pb_CommandTiming__Output } from './exa/cortex_pb/CommandTiming';
import type { CortexConfig as _exa_cortex_pb_CortexConfig, CortexConfig__Output as _exa_cortex_pb_CortexConfig__Output } from './exa/cortex_pb/CortexConfig';
import type { CortexErrorDetails as _exa_cortex_pb_CortexErrorDetails, CortexErrorDetails__Output as _exa_cortex_pb_CortexErrorDetails__Output } from './exa/cortex_pb/CortexErrorDetails';
import type { CortexMemory as _exa_cortex_pb_CortexMemory, CortexMemory__Output as _exa_cortex_pb_CortexMemory__Output } from './exa/cortex_pb/CortexMemory';
import type { CortexMemoryAllScope as _exa_cortex_pb_CortexMemoryAllScope, CortexMemoryAllScope__Output as _exa_cortex_pb_CortexMemoryAllScope__Output } from './exa/cortex_pb/CortexMemoryAllScope';
import type { CortexMemoryGlobalScope as _exa_cortex_pb_CortexMemoryGlobalScope, CortexMemoryGlobalScope__Output as _exa_cortex_pb_CortexMemoryGlobalScope__Output } from './exa/cortex_pb/CortexMemoryGlobalScope';
import type { CortexMemoryLocalScope as _exa_cortex_pb_CortexMemoryLocalScope, CortexMemoryLocalScope__Output as _exa_cortex_pb_CortexMemoryLocalScope__Output } from './exa/cortex_pb/CortexMemoryLocalScope';
import type { CortexMemoryMetadata as _exa_cortex_pb_CortexMemoryMetadata, CortexMemoryMetadata__Output as _exa_cortex_pb_CortexMemoryMetadata__Output } from './exa/cortex_pb/CortexMemoryMetadata';
import type { CortexMemoryProjectScope as _exa_cortex_pb_CortexMemoryProjectScope, CortexMemoryProjectScope__Output as _exa_cortex_pb_CortexMemoryProjectScope__Output } from './exa/cortex_pb/CortexMemoryProjectScope';
import type { CortexMemoryScope as _exa_cortex_pb_CortexMemoryScope, CortexMemoryScope__Output as _exa_cortex_pb_CortexMemoryScope__Output } from './exa/cortex_pb/CortexMemoryScope';
import type { CortexMemorySystemScope as _exa_cortex_pb_CortexMemorySystemScope, CortexMemorySystemScope__Output as _exa_cortex_pb_CortexMemorySystemScope__Output } from './exa/cortex_pb/CortexMemorySystemScope';
import type { CortexMemoryText as _exa_cortex_pb_CortexMemoryText, CortexMemoryText__Output as _exa_cortex_pb_CortexMemoryText__Output } from './exa/cortex_pb/CortexMemoryText';
import type { CortexPlanConfig as _exa_cortex_pb_CortexPlanConfig, CortexPlanConfig__Output as _exa_cortex_pb_CortexPlanConfig__Output } from './exa/cortex_pb/CortexPlanConfig';
import type { CortexPlanState as _exa_cortex_pb_CortexPlanState, CortexPlanState__Output as _exa_cortex_pb_CortexPlanState__Output } from './exa/cortex_pb/CortexPlanState';
import type { CortexPlanSummary as _exa_cortex_pb_CortexPlanSummary, CortexPlanSummary__Output as _exa_cortex_pb_CortexPlanSummary__Output } from './exa/cortex_pb/CortexPlanSummary';
import type { CortexPlanSummaryComponent as _exa_cortex_pb_CortexPlanSummaryComponent, CortexPlanSummaryComponent__Output as _exa_cortex_pb_CortexPlanSummaryComponent__Output } from './exa/cortex_pb/CortexPlanSummaryComponent';
import type { CortexResearchState as _exa_cortex_pb_CortexResearchState, CortexResearchState__Output as _exa_cortex_pb_CortexResearchState__Output } from './exa/cortex_pb/CortexResearchState';
import type { CortexRunState as _exa_cortex_pb_CortexRunState, CortexRunState__Output as _exa_cortex_pb_CortexRunState__Output } from './exa/cortex_pb/CortexRunState';
import type { CortexSkill as _exa_cortex_pb_CortexSkill, CortexSkill__Output as _exa_cortex_pb_CortexSkill__Output } from './exa/cortex_pb/CortexSkill';
import type { CortexStepAddAnnotation as _exa_cortex_pb_CortexStepAddAnnotation, CortexStepAddAnnotation__Output as _exa_cortex_pb_CortexStepAddAnnotation__Output } from './exa/cortex_pb/CortexStepAddAnnotation';
import type { CortexStepArenaTrajectoryConverge as _exa_cortex_pb_CortexStepArenaTrajectoryConverge, CortexStepArenaTrajectoryConverge__Output as _exa_cortex_pb_CortexStepArenaTrajectoryConverge__Output } from './exa/cortex_pb/CortexStepArenaTrajectoryConverge';
import type { CortexStepArtifactSummary as _exa_cortex_pb_CortexStepArtifactSummary, CortexStepArtifactSummary__Output as _exa_cortex_pb_CortexStepArtifactSummary__Output } from './exa/cortex_pb/CortexStepArtifactSummary';
import type { CortexStepAskUserQuestion as _exa_cortex_pb_CortexStepAskUserQuestion, CortexStepAskUserQuestion__Output as _exa_cortex_pb_CortexStepAskUserQuestion__Output } from './exa/cortex_pb/CortexStepAskUserQuestion';
import type { CortexStepAutoCascadeBroadcast as _exa_cortex_pb_CortexStepAutoCascadeBroadcast, CortexStepAutoCascadeBroadcast__Output as _exa_cortex_pb_CortexStepAutoCascadeBroadcast__Output } from './exa/cortex_pb/CortexStepAutoCascadeBroadcast';
import type { CortexStepBlocking as _exa_cortex_pb_CortexStepBlocking, CortexStepBlocking__Output as _exa_cortex_pb_CortexStepBlocking__Output } from './exa/cortex_pb/CortexStepBlocking';
import type { CortexStepBrainUpdate as _exa_cortex_pb_CortexStepBrainUpdate, CortexStepBrainUpdate__Output as _exa_cortex_pb_CortexStepBrainUpdate__Output } from './exa/cortex_pb/CortexStepBrainUpdate';
import type { CortexStepCheckDeployStatus as _exa_cortex_pb_CortexStepCheckDeployStatus, CortexStepCheckDeployStatus__Output as _exa_cortex_pb_CortexStepCheckDeployStatus__Output } from './exa/cortex_pb/CortexStepCheckDeployStatus';
import type { CortexStepCheckpoint as _exa_cortex_pb_CortexStepCheckpoint, CortexStepCheckpoint__Output as _exa_cortex_pb_CortexStepCheckpoint__Output } from './exa/cortex_pb/CortexStepCheckpoint';
import type { CortexStepClipboard as _exa_cortex_pb_CortexStepClipboard, CortexStepClipboard__Output as _exa_cortex_pb_CortexStepClipboard__Output } from './exa/cortex_pb/CortexStepClipboard';
import type { CortexStepClusterQuery as _exa_cortex_pb_CortexStepClusterQuery, CortexStepClusterQuery__Output as _exa_cortex_pb_CortexStepClusterQuery__Output } from './exa/cortex_pb/CortexStepClusterQuery';
import type { CortexStepCodeAction as _exa_cortex_pb_CortexStepCodeAction, CortexStepCodeAction__Output as _exa_cortex_pb_CortexStepCodeAction__Output } from './exa/cortex_pb/CortexStepCodeAction';
import type { CortexStepCodeMap as _exa_cortex_pb_CortexStepCodeMap, CortexStepCodeMap__Output as _exa_cortex_pb_CortexStepCodeMap__Output } from './exa/cortex_pb/CortexStepCodeMap';
import type { CortexStepCommandStatus as _exa_cortex_pb_CortexStepCommandStatus, CortexStepCommandStatus__Output as _exa_cortex_pb_CortexStepCommandStatus__Output } from './exa/cortex_pb/CortexStepCommandStatus';
import type { CortexStepCompile as _exa_cortex_pb_CortexStepCompile, CortexStepCompile__Output as _exa_cortex_pb_CortexStepCompile__Output } from './exa/cortex_pb/CortexStepCompile';
import type { CortexStepCompileDiagnostic as _exa_cortex_pb_CortexStepCompileDiagnostic, CortexStepCompileDiagnostic__Output as _exa_cortex_pb_CortexStepCompileDiagnostic__Output } from './exa/cortex_pb/CortexStepCompileDiagnostic';
import type { CortexStepCreateRecipe as _exa_cortex_pb_CortexStepCreateRecipe, CortexStepCreateRecipe__Output as _exa_cortex_pb_CortexStepCreateRecipe__Output } from './exa/cortex_pb/CortexStepCreateRecipe';
import type { CortexStepCustomTool as _exa_cortex_pb_CortexStepCustomTool, CortexStepCustomTool__Output as _exa_cortex_pb_CortexStepCustomTool__Output } from './exa/cortex_pb/CortexStepCustomTool';
import type { CortexStepDeepThink as _exa_cortex_pb_CortexStepDeepThink, CortexStepDeepThink__Output as _exa_cortex_pb_CortexStepDeepThink__Output } from './exa/cortex_pb/CortexStepDeepThink';
import type { CortexStepDeployWebApp as _exa_cortex_pb_CortexStepDeployWebApp, CortexStepDeployWebApp__Output as _exa_cortex_pb_CortexStepDeployWebApp__Output } from './exa/cortex_pb/CortexStepDeployWebApp';
import type { CortexStepDummy as _exa_cortex_pb_CortexStepDummy, CortexStepDummy__Output as _exa_cortex_pb_CortexStepDummy__Output } from './exa/cortex_pb/CortexStepDummy';
import type { CortexStepEditCodeMap as _exa_cortex_pb_CortexStepEditCodeMap, CortexStepEditCodeMap__Output as _exa_cortex_pb_CortexStepEditCodeMap__Output } from './exa/cortex_pb/CortexStepEditCodeMap';
import type { CortexStepEditNotebook as _exa_cortex_pb_CortexStepEditNotebook, CortexStepEditNotebook__Output as _exa_cortex_pb_CortexStepEditNotebook__Output } from './exa/cortex_pb/CortexStepEditNotebook';
import type { CortexStepErrorMessage as _exa_cortex_pb_CortexStepErrorMessage, CortexStepErrorMessage__Output as _exa_cortex_pb_CortexStepErrorMessage__Output } from './exa/cortex_pb/CortexStepErrorMessage';
import type { CortexStepExitPlanMode as _exa_cortex_pb_CortexStepExitPlanMode, CortexStepExitPlanMode__Output as _exa_cortex_pb_CortexStepExitPlanMode__Output } from './exa/cortex_pb/CortexStepExitPlanMode';
import type { CortexStepExploreResponse as _exa_cortex_pb_CortexStepExploreResponse, CortexStepExploreResponse__Output as _exa_cortex_pb_CortexStepExploreResponse__Output } from './exa/cortex_pb/CortexStepExploreResponse';
import type { CortexStepFileBreakdown as _exa_cortex_pb_CortexStepFileBreakdown, CortexStepFileBreakdown__Output as _exa_cortex_pb_CortexStepFileBreakdown__Output } from './exa/cortex_pb/CortexStepFileBreakdown';
import type { CortexStepFind as _exa_cortex_pb_CortexStepFind, CortexStepFind__Output as _exa_cortex_pb_CortexStepFind__Output } from './exa/cortex_pb/CortexStepFind';
import type { CortexStepFindAllReferences as _exa_cortex_pb_CortexStepFindAllReferences, CortexStepFindAllReferences__Output as _exa_cortex_pb_CortexStepFindAllReferences__Output } from './exa/cortex_pb/CortexStepFindAllReferences';
import type { CortexStepFindCodeContext as _exa_cortex_pb_CortexStepFindCodeContext, CortexStepFindCodeContext__Output as _exa_cortex_pb_CortexStepFindCodeContext__Output } from './exa/cortex_pb/CortexStepFindCodeContext';
import type { CortexStepFinish as _exa_cortex_pb_CortexStepFinish, CortexStepFinish__Output as _exa_cortex_pb_CortexStepFinish__Output } from './exa/cortex_pb/CortexStepFinish';
import type { CortexStepGeneratorMetadata as _exa_cortex_pb_CortexStepGeneratorMetadata, CortexStepGeneratorMetadata__Output as _exa_cortex_pb_CortexStepGeneratorMetadata__Output } from './exa/cortex_pb/CortexStepGeneratorMetadata';
import type { CortexStepGitCommit as _exa_cortex_pb_CortexStepGitCommit, CortexStepGitCommit__Output as _exa_cortex_pb_CortexStepGitCommit__Output } from './exa/cortex_pb/CortexStepGitCommit';
import type { CortexStepGrepSearch as _exa_cortex_pb_CortexStepGrepSearch, CortexStepGrepSearch__Output as _exa_cortex_pb_CortexStepGrepSearch__Output } from './exa/cortex_pb/CortexStepGrepSearch';
import type { CortexStepGrepSearchV2 as _exa_cortex_pb_CortexStepGrepSearchV2, CortexStepGrepSearchV2__Output as _exa_cortex_pb_CortexStepGrepSearchV2__Output } from './exa/cortex_pb/CortexStepGrepSearchV2';
import type { CortexStepInformPlanner as _exa_cortex_pb_CortexStepInformPlanner, CortexStepInformPlanner__Output as _exa_cortex_pb_CortexStepInformPlanner__Output } from './exa/cortex_pb/CortexStepInformPlanner';
import type { CortexStepInspectCluster as _exa_cortex_pb_CortexStepInspectCluster, CortexStepInspectCluster__Output as _exa_cortex_pb_CortexStepInspectCluster__Output } from './exa/cortex_pb/CortexStepInspectCluster';
import type { CortexStepLintDiff as _exa_cortex_pb_CortexStepLintDiff, CortexStepLintDiff__Output as _exa_cortex_pb_CortexStepLintDiff__Output } from './exa/cortex_pb/CortexStepLintDiff';
import type { CortexStepLintFixMessage as _exa_cortex_pb_CortexStepLintFixMessage, CortexStepLintFixMessage__Output as _exa_cortex_pb_CortexStepLintFixMessage__Output } from './exa/cortex_pb/CortexStepLintFixMessage';
import type { CortexStepListClusters as _exa_cortex_pb_CortexStepListClusters, CortexStepListClusters__Output as _exa_cortex_pb_CortexStepListClusters__Output } from './exa/cortex_pb/CortexStepListClusters';
import type { CortexStepListDirectory as _exa_cortex_pb_CortexStepListDirectory, CortexStepListDirectory__Output as _exa_cortex_pb_CortexStepListDirectory__Output } from './exa/cortex_pb/CortexStepListDirectory';
import type { CortexStepListResources as _exa_cortex_pb_CortexStepListResources, CortexStepListResources__Output as _exa_cortex_pb_CortexStepListResources__Output } from './exa/cortex_pb/CortexStepListResources';
import type { CortexStepLookupKnowledgeBase as _exa_cortex_pb_CortexStepLookupKnowledgeBase, CortexStepLookupKnowledgeBase__Output as _exa_cortex_pb_CortexStepLookupKnowledgeBase__Output } from './exa/cortex_pb/CortexStepLookupKnowledgeBase';
import type { CortexStepManagerFeedback as _exa_cortex_pb_CortexStepManagerFeedback, CortexStepManagerFeedback__Output as _exa_cortex_pb_CortexStepManagerFeedback__Output } from './exa/cortex_pb/CortexStepManagerFeedback';
import type { CortexStepMcpTool as _exa_cortex_pb_CortexStepMcpTool, CortexStepMcpTool__Output as _exa_cortex_pb_CortexStepMcpTool__Output } from './exa/cortex_pb/CortexStepMcpTool';
import type { CortexStepMemory as _exa_cortex_pb_CortexStepMemory, CortexStepMemory__Output as _exa_cortex_pb_CortexStepMemory__Output } from './exa/cortex_pb/CortexStepMemory';
import type { CortexStepMetadata as _exa_cortex_pb_CortexStepMetadata, CortexStepMetadata__Output as _exa_cortex_pb_CortexStepMetadata__Output } from './exa/cortex_pb/CortexStepMetadata';
import type { CortexStepMquery as _exa_cortex_pb_CortexStepMquery, CortexStepMquery__Output as _exa_cortex_pb_CortexStepMquery__Output } from './exa/cortex_pb/CortexStepMquery';
import type { CortexStepOutline as _exa_cortex_pb_CortexStepOutline, CortexStepOutline__Output as _exa_cortex_pb_CortexStepOutline__Output } from './exa/cortex_pb/CortexStepOutline';
import type { CortexStepPlanInput as _exa_cortex_pb_CortexStepPlanInput, CortexStepPlanInput__Output as _exa_cortex_pb_CortexStepPlanInput__Output } from './exa/cortex_pb/CortexStepPlanInput';
import type { CortexStepPlannerResponse as _exa_cortex_pb_CortexStepPlannerResponse, CortexStepPlannerResponse__Output as _exa_cortex_pb_CortexStepPlannerResponse__Output } from './exa/cortex_pb/CortexStepPlannerResponse';
import type { CortexStepPostPrReview as _exa_cortex_pb_CortexStepPostPrReview, CortexStepPostPrReview__Output as _exa_cortex_pb_CortexStepPostPrReview__Output } from './exa/cortex_pb/CortexStepPostPrReview';
import type { CortexStepProposalFeedback as _exa_cortex_pb_CortexStepProposalFeedback, CortexStepProposalFeedback__Output as _exa_cortex_pb_CortexStepProposalFeedback__Output } from './exa/cortex_pb/CortexStepProposalFeedback';
import type { CortexStepProposeCode as _exa_cortex_pb_CortexStepProposeCode, CortexStepProposeCode__Output as _exa_cortex_pb_CortexStepProposeCode__Output } from './exa/cortex_pb/CortexStepProposeCode';
import type { CortexStepProxyWebServer as _exa_cortex_pb_CortexStepProxyWebServer, CortexStepProxyWebServer__Output as _exa_cortex_pb_CortexStepProxyWebServer__Output } from './exa/cortex_pb/CortexStepProxyWebServer';
import type { CortexStepReadDeploymentConfig as _exa_cortex_pb_CortexStepReadDeploymentConfig, CortexStepReadDeploymentConfig__Output as _exa_cortex_pb_CortexStepReadDeploymentConfig__Output } from './exa/cortex_pb/CortexStepReadDeploymentConfig';
import type { CortexStepReadKnowledgeBaseItem as _exa_cortex_pb_CortexStepReadKnowledgeBaseItem, CortexStepReadKnowledgeBaseItem__Output as _exa_cortex_pb_CortexStepReadKnowledgeBaseItem__Output } from './exa/cortex_pb/CortexStepReadKnowledgeBaseItem';
import type { CortexStepReadNotebook as _exa_cortex_pb_CortexStepReadNotebook, CortexStepReadNotebook__Output as _exa_cortex_pb_CortexStepReadNotebook__Output } from './exa/cortex_pb/CortexStepReadNotebook';
import type { CortexStepReadResource as _exa_cortex_pb_CortexStepReadResource, CortexStepReadResource__Output as _exa_cortex_pb_CortexStepReadResource__Output } from './exa/cortex_pb/CortexStepReadResource';
import type { CortexStepReadTerminal as _exa_cortex_pb_CortexStepReadTerminal, CortexStepReadTerminal__Output as _exa_cortex_pb_CortexStepReadTerminal__Output } from './exa/cortex_pb/CortexStepReadTerminal';
import type { CortexStepReadUrlContent as _exa_cortex_pb_CortexStepReadUrlContent, CortexStepReadUrlContent__Output as _exa_cortex_pb_CortexStepReadUrlContent__Output } from './exa/cortex_pb/CortexStepReadUrlContent';
import type { CortexStepRelatedFiles as _exa_cortex_pb_CortexStepRelatedFiles, CortexStepRelatedFiles__Output as _exa_cortex_pb_CortexStepRelatedFiles__Output } from './exa/cortex_pb/CortexStepRelatedFiles';
import type { CortexStepReportBugs as _exa_cortex_pb_CortexStepReportBugs, CortexStepReportBugs__Output as _exa_cortex_pb_CortexStepReportBugs__Output } from './exa/cortex_pb/CortexStepReportBugs';
import type { CortexStepResolveTask as _exa_cortex_pb_CortexStepResolveTask, CortexStepResolveTask__Output as _exa_cortex_pb_CortexStepResolveTask__Output } from './exa/cortex_pb/CortexStepResolveTask';
import type { CortexStepRetrieveMemory as _exa_cortex_pb_CortexStepRetrieveMemory, CortexStepRetrieveMemory__Output as _exa_cortex_pb_CortexStepRetrieveMemory__Output } from './exa/cortex_pb/CortexStepRetrieveMemory';
import type { CortexStepRunCommand as _exa_cortex_pb_CortexStepRunCommand, CortexStepRunCommand__Output as _exa_cortex_pb_CortexStepRunCommand__Output } from './exa/cortex_pb/CortexStepRunCommand';
import type { CortexStepRunExtensionCode as _exa_cortex_pb_CortexStepRunExtensionCode, CortexStepRunExtensionCode__Output as _exa_cortex_pb_CortexStepRunExtensionCode__Output } from './exa/cortex_pb/CortexStepRunExtensionCode';
import type { CortexStepSearchKnowledgeBase as _exa_cortex_pb_CortexStepSearchKnowledgeBase, CortexStepSearchKnowledgeBase__Output as _exa_cortex_pb_CortexStepSearchKnowledgeBase__Output } from './exa/cortex_pb/CortexStepSearchKnowledgeBase';
import type { CortexStepSearchWeb as _exa_cortex_pb_CortexStepSearchWeb, CortexStepSearchWeb__Output as _exa_cortex_pb_CortexStepSearchWeb__Output } from './exa/cortex_pb/CortexStepSearchWeb';
import type { CortexStepSkill as _exa_cortex_pb_CortexStepSkill, CortexStepSkill__Output as _exa_cortex_pb_CortexStepSkill__Output } from './exa/cortex_pb/CortexStepSkill';
import type { CortexStepSmartFriend as _exa_cortex_pb_CortexStepSmartFriend, CortexStepSmartFriend__Output as _exa_cortex_pb_CortexStepSmartFriend__Output } from './exa/cortex_pb/CortexStepSmartFriend';
import type { CortexStepState as _exa_cortex_pb_CortexStepState, CortexStepState__Output as _exa_cortex_pb_CortexStepState__Output } from './exa/cortex_pb/CortexStepState';
import type { CortexStepSuggestCodemap as _exa_cortex_pb_CortexStepSuggestCodemap, CortexStepSuggestCodemap__Output as _exa_cortex_pb_CortexStepSuggestCodemap__Output } from './exa/cortex_pb/CortexStepSuggestCodemap';
import type { CortexStepSuggestedResponses as _exa_cortex_pb_CortexStepSuggestedResponses, CortexStepSuggestedResponses__Output as _exa_cortex_pb_CortexStepSuggestedResponses__Output } from './exa/cortex_pb/CortexStepSuggestedResponses';
import type { CortexStepSupercompleteActiveDoc as _exa_cortex_pb_CortexStepSupercompleteActiveDoc, CortexStepSupercompleteActiveDoc__Output as _exa_cortex_pb_CortexStepSupercompleteActiveDoc__Output } from './exa/cortex_pb/CortexStepSupercompleteActiveDoc';
import type { CortexStepSupercompleteEphemeralFeedback as _exa_cortex_pb_CortexStepSupercompleteEphemeralFeedback, CortexStepSupercompleteEphemeralFeedback__Output as _exa_cortex_pb_CortexStepSupercompleteEphemeralFeedback__Output } from './exa/cortex_pb/CortexStepSupercompleteEphemeralFeedback';
import type { CortexStepSupercompleteFeedback as _exa_cortex_pb_CortexStepSupercompleteFeedback, CortexStepSupercompleteFeedback__Output as _exa_cortex_pb_CortexStepSupercompleteFeedback__Output } from './exa/cortex_pb/CortexStepSupercompleteFeedback';
import type { CortexStepTodoList as _exa_cortex_pb_CortexStepTodoList, CortexStepTodoList__Output as _exa_cortex_pb_CortexStepTodoList__Output } from './exa/cortex_pb/CortexStepTodoList';
import type { CortexStepToolCallChoice as _exa_cortex_pb_CortexStepToolCallChoice, CortexStepToolCallChoice__Output as _exa_cortex_pb_CortexStepToolCallChoice__Output } from './exa/cortex_pb/CortexStepToolCallChoice';
import type { CortexStepToolCallProposal as _exa_cortex_pb_CortexStepToolCallProposal, CortexStepToolCallProposal__Output as _exa_cortex_pb_CortexStepToolCallProposal__Output } from './exa/cortex_pb/CortexStepToolCallProposal';
import type { CortexStepTrajectoryChoice as _exa_cortex_pb_CortexStepTrajectoryChoice, CortexStepTrajectoryChoice__Output as _exa_cortex_pb_CortexStepTrajectoryChoice__Output } from './exa/cortex_pb/CortexStepTrajectoryChoice';
import type { CortexStepTrajectorySearch as _exa_cortex_pb_CortexStepTrajectorySearch, CortexStepTrajectorySearch__Output as _exa_cortex_pb_CortexStepTrajectorySearch__Output } from './exa/cortex_pb/CortexStepTrajectorySearch';
import type { CortexStepUpdate as _exa_cortex_pb_CortexStepUpdate, CortexStepUpdate__Output as _exa_cortex_pb_CortexStepUpdate__Output } from './exa/cortex_pb/CortexStepUpdate';
import type { CortexStepUpsertCodemap as _exa_cortex_pb_CortexStepUpsertCodemap, CortexStepUpsertCodemap__Output as _exa_cortex_pb_CortexStepUpsertCodemap__Output } from './exa/cortex_pb/CortexStepUpsertCodemap';
import type { CortexStepUserInput as _exa_cortex_pb_CortexStepUserInput, CortexStepUserInput__Output as _exa_cortex_pb_CortexStepUserInput__Output } from './exa/cortex_pb/CortexStepUserInput';
import type { CortexStepViewCodeItem as _exa_cortex_pb_CortexStepViewCodeItem, CortexStepViewCodeItem__Output as _exa_cortex_pb_CortexStepViewCodeItem__Output } from './exa/cortex_pb/CortexStepViewCodeItem';
import type { CortexStepViewContentChunk as _exa_cortex_pb_CortexStepViewContentChunk, CortexStepViewContentChunk__Output as _exa_cortex_pb_CortexStepViewContentChunk__Output } from './exa/cortex_pb/CortexStepViewContentChunk';
import type { CortexStepViewFile as _exa_cortex_pb_CortexStepViewFile, CortexStepViewFile__Output as _exa_cortex_pb_CortexStepViewFile__Output } from './exa/cortex_pb/CortexStepViewFile';
import type { CortexStepViewFileOutline as _exa_cortex_pb_CortexStepViewFileOutline, CortexStepViewFileOutline__Output as _exa_cortex_pb_CortexStepViewFileOutline__Output } from './exa/cortex_pb/CortexStepViewFileOutline';
import type { CortexStepWriteToFile as _exa_cortex_pb_CortexStepWriteToFile, CortexStepWriteToFile__Output as _exa_cortex_pb_CortexStepWriteToFile__Output } from './exa/cortex_pb/CortexStepWriteToFile';
import type { CortexTodoListItem as _exa_cortex_pb_CortexTodoListItem, CortexTodoListItem__Output as _exa_cortex_pb_CortexTodoListItem__Output } from './exa/cortex_pb/CortexTodoListItem';
import type { CortexTrajectory as _exa_cortex_pb_CortexTrajectory, CortexTrajectory__Output as _exa_cortex_pb_CortexTrajectory__Output } from './exa/cortex_pb/CortexTrajectory';
import type { CortexTrajectoryMetadata as _exa_cortex_pb_CortexTrajectoryMetadata, CortexTrajectoryMetadata__Output as _exa_cortex_pb_CortexTrajectoryMetadata__Output } from './exa/cortex_pb/CortexTrajectoryMetadata';
import type { CortexTrajectoryReference as _exa_cortex_pb_CortexTrajectoryReference, CortexTrajectoryReference__Output as _exa_cortex_pb_CortexTrajectoryReference__Output } from './exa/cortex_pb/CortexTrajectoryReference';
import type { CortexTrajectoryStep as _exa_cortex_pb_CortexTrajectoryStep, CortexTrajectoryStep__Output as _exa_cortex_pb_CortexTrajectoryStep__Output } from './exa/cortex_pb/CortexTrajectoryStep';
import type { CortexTrajectoryStepWithIndex as _exa_cortex_pb_CortexTrajectoryStepWithIndex, CortexTrajectoryStepWithIndex__Output as _exa_cortex_pb_CortexTrajectoryStepWithIndex__Output } from './exa/cortex_pb/CortexTrajectoryStepWithIndex';
import type { CortexTrajectoryToPromptConfig as _exa_cortex_pb_CortexTrajectoryToPromptConfig, CortexTrajectoryToPromptConfig__Output as _exa_cortex_pb_CortexTrajectoryToPromptConfig__Output } from './exa/cortex_pb/CortexTrajectoryToPromptConfig';
import type { CortexWorkflowState as _exa_cortex_pb_CortexWorkflowState, CortexWorkflowState__Output as _exa_cortex_pb_CortexWorkflowState__Output } from './exa/cortex_pb/CortexWorkflowState';
import type { CortexWorkspaceMetadata as _exa_cortex_pb_CortexWorkspaceMetadata, CortexWorkspaceMetadata__Output as _exa_cortex_pb_CortexWorkspaceMetadata__Output } from './exa/cortex_pb/CortexWorkspaceMetadata';
import type { CustomRecipeConfig as _exa_cortex_pb_CustomRecipeConfig, CustomRecipeConfig__Output as _exa_cortex_pb_CustomRecipeConfig__Output } from './exa/cortex_pb/CustomRecipeConfig';
import type { CustomToolSpec as _exa_cortex_pb_CustomToolSpec, CustomToolSpec__Output as _exa_cortex_pb_CustomToolSpec__Output } from './exa/cortex_pb/CustomToolSpec';
import type { DeployWebAppToolConfig as _exa_cortex_pb_DeployWebAppToolConfig, DeployWebAppToolConfig__Output as _exa_cortex_pb_DeployWebAppToolConfig__Output } from './exa/cortex_pb/DeployWebAppToolConfig';
import type { DeploymentInteractionPayload as _exa_cortex_pb_DeploymentInteractionPayload, DeploymentInteractionPayload__Output as _exa_cortex_pb_DeploymentInteractionPayload__Output } from './exa/cortex_pb/DeploymentInteractionPayload';
import type { DiffBasedCommandEvalConfig as _exa_cortex_pb_DiffBasedCommandEvalConfig, DiffBasedCommandEvalConfig__Output as _exa_cortex_pb_DiffBasedCommandEvalConfig__Output } from './exa/cortex_pb/DiffBasedCommandEvalConfig';
import type { DynamicBrainUpdateConfig as _exa_cortex_pb_DynamicBrainUpdateConfig, DynamicBrainUpdateConfig__Output as _exa_cortex_pb_DynamicBrainUpdateConfig__Output } from './exa/cortex_pb/DynamicBrainUpdateConfig';
import type { EnterpriseToolConfig as _exa_cortex_pb_EnterpriseToolConfig, EnterpriseToolConfig__Output as _exa_cortex_pb_EnterpriseToolConfig__Output } from './exa/cortex_pb/EnterpriseToolConfig';
import type { EphemeralMessagesConfig as _exa_cortex_pb_EphemeralMessagesConfig, EphemeralMessagesConfig__Output as _exa_cortex_pb_EphemeralMessagesConfig__Output } from './exa/cortex_pb/EphemeralMessagesConfig';
import type { ExecutorMetadata as _exa_cortex_pb_ExecutorMetadata, ExecutorMetadata__Output as _exa_cortex_pb_ExecutorMetadata__Output } from './exa/cortex_pb/ExecutorMetadata';
import type { ExitPlanModeToolConfig as _exa_cortex_pb_ExitPlanModeToolConfig, ExitPlanModeToolConfig__Output as _exa_cortex_pb_ExitPlanModeToolConfig__Output } from './exa/cortex_pb/ExitPlanModeToolConfig';
import type { FastApplyFallbackConfig as _exa_cortex_pb_FastApplyFallbackConfig, FastApplyFallbackConfig__Output as _exa_cortex_pb_FastApplyFallbackConfig__Output } from './exa/cortex_pb/FastApplyFallbackConfig';
import type { FastApplyFallbackInfo as _exa_cortex_pb_FastApplyFallbackInfo, FastApplyFallbackInfo__Output as _exa_cortex_pb_FastApplyFallbackInfo__Output } from './exa/cortex_pb/FastApplyFallbackInfo';
import type { FindAllReferencesConfig as _exa_cortex_pb_FindAllReferencesConfig, FindAllReferencesConfig__Output as _exa_cortex_pb_FindAllReferencesConfig__Output } from './exa/cortex_pb/FindAllReferencesConfig';
import type { FindCodeContextToolConfig as _exa_cortex_pb_FindCodeContextToolConfig, FindCodeContextToolConfig__Output as _exa_cortex_pb_FindCodeContextToolConfig__Output } from './exa/cortex_pb/FindCodeContextToolConfig';
import type { FindToolConfig as _exa_cortex_pb_FindToolConfig, FindToolConfig__Output as _exa_cortex_pb_FindToolConfig__Output } from './exa/cortex_pb/FindToolConfig';
import type { ForcedBrainUpdateConfig as _exa_cortex_pb_ForcedBrainUpdateConfig, ForcedBrainUpdateConfig__Output as _exa_cortex_pb_ForcedBrainUpdateConfig__Output } from './exa/cortex_pb/ForcedBrainUpdateConfig';
import type { GlobalBackgroundCommand as _exa_cortex_pb_GlobalBackgroundCommand, GlobalBackgroundCommand__Output as _exa_cortex_pb_GlobalBackgroundCommand__Output } from './exa/cortex_pb/GlobalBackgroundCommand';
import type { GrepSearchResult as _exa_cortex_pb_GrepSearchResult, GrepSearchResult__Output as _exa_cortex_pb_GrepSearchResult__Output } from './exa/cortex_pb/GrepSearchResult';
import type { GrepToolConfig as _exa_cortex_pb_GrepToolConfig, GrepToolConfig__Output as _exa_cortex_pb_GrepToolConfig__Output } from './exa/cortex_pb/GrepToolConfig';
import type { GrepV2ToolConfig as _exa_cortex_pb_GrepV2ToolConfig, GrepV2ToolConfig__Output as _exa_cortex_pb_GrepV2ToolConfig__Output } from './exa/cortex_pb/GrepV2ToolConfig';
import type { HeuristicPrompt as _exa_cortex_pb_HeuristicPrompt, HeuristicPrompt__Output as _exa_cortex_pb_HeuristicPrompt__Output } from './exa/cortex_pb/HeuristicPrompt';
import type { HookCondition as _exa_cortex_pb_HookCondition, HookCondition__Output as _exa_cortex_pb_HookCondition__Output } from './exa/cortex_pb/HookCondition';
import type { HookExecutionDetail as _exa_cortex_pb_HookExecutionDetail, HookExecutionDetail__Output as _exa_cortex_pb_HookExecutionDetail__Output } from './exa/cortex_pb/HookExecutionDetail';
import type { HookExecutionResult as _exa_cortex_pb_HookExecutionResult, HookExecutionResult__Output as _exa_cortex_pb_HookExecutionResult__Output } from './exa/cortex_pb/HookExecutionResult';
import type { HookExecutionSpec as _exa_cortex_pb_HookExecutionSpec, HookExecutionSpec__Output as _exa_cortex_pb_HookExecutionSpec__Output } from './exa/cortex_pb/HookExecutionSpec';
import type { ImplicitTrajectory as _exa_cortex_pb_ImplicitTrajectory, ImplicitTrajectory__Output as _exa_cortex_pb_ImplicitTrajectory__Output } from './exa/cortex_pb/ImplicitTrajectory';
import type { ImplicitTrajectoryDescription as _exa_cortex_pb_ImplicitTrajectoryDescription, ImplicitTrajectoryDescription__Output as _exa_cortex_pb_ImplicitTrajectoryDescription__Output } from './exa/cortex_pb/ImplicitTrajectoryDescription';
import type { InformPlannerConfig as _exa_cortex_pb_InformPlannerConfig, InformPlannerConfig__Output as _exa_cortex_pb_InformPlannerConfig__Output } from './exa/cortex_pb/InformPlannerConfig';
import type { InspectClusterToolConfig as _exa_cortex_pb_InspectClusterToolConfig, InspectClusterToolConfig__Output as _exa_cortex_pb_InspectClusterToolConfig__Output } from './exa/cortex_pb/InspectClusterToolConfig';
import type { InstantContextResponse as _exa_cortex_pb_InstantContextResponse, InstantContextResponse__Output as _exa_cortex_pb_InstantContextResponse__Output } from './exa/cortex_pb/InstantContextResponse';
import type { InstantContextStep as _exa_cortex_pb_InstantContextStep, InstantContextStep__Output as _exa_cortex_pb_InstantContextStep__Output } from './exa/cortex_pb/InstantContextStep';
import type { InstantContextTiming as _exa_cortex_pb_InstantContextTiming, InstantContextTiming__Output as _exa_cortex_pb_InstantContextTiming__Output } from './exa/cortex_pb/InstantContextTiming';
import type { InstantContextToolCall as _exa_cortex_pb_InstantContextToolCall, InstantContextToolCall__Output as _exa_cortex_pb_InstantContextToolCall__Output } from './exa/cortex_pb/InstantContextToolCall';
import type { InstantContextToolUpdate as _exa_cortex_pb_InstantContextToolUpdate, InstantContextToolUpdate__Output as _exa_cortex_pb_InstantContextToolUpdate__Output } from './exa/cortex_pb/InstantContextToolUpdate';
import type { IntentToolConfig as _exa_cortex_pb_IntentToolConfig, IntentToolConfig__Output as _exa_cortex_pb_IntentToolConfig__Output } from './exa/cortex_pb/IntentToolConfig';
import type { KnowledgeBaseSearchToolConfig as _exa_cortex_pb_KnowledgeBaseSearchToolConfig, KnowledgeBaseSearchToolConfig__Output as _exa_cortex_pb_KnowledgeBaseSearchToolConfig__Output } from './exa/cortex_pb/KnowledgeBaseSearchToolConfig';
import type { LastTodoListStepInfo as _exa_cortex_pb_LastTodoListStepInfo, LastTodoListStepInfo__Output as _exa_cortex_pb_LastTodoListStepInfo__Output } from './exa/cortex_pb/LastTodoListStepInfo';
import type { LifeguardBug as _exa_cortex_pb_LifeguardBug, LifeguardBug__Output as _exa_cortex_pb_LifeguardBug__Output } from './exa/cortex_pb/LifeguardBug';
import type { LineRange as _exa_cortex_pb_LineRange, LineRange__Output as _exa_cortex_pb_LineRange__Output } from './exa/cortex_pb/LineRange';
import type { LineRangeList as _exa_cortex_pb_LineRangeList, LineRangeList__Output as _exa_cortex_pb_LineRangeList__Output } from './exa/cortex_pb/LineRangeList';
import type { LineRangeTarget as _exa_cortex_pb_LineRangeTarget, LineRangeTarget__Output as _exa_cortex_pb_LineRangeTarget__Output } from './exa/cortex_pb/LineRangeTarget';
import type { LintDiffStepCreationOptions as _exa_cortex_pb_LintDiffStepCreationOptions, LintDiffStepCreationOptions__Output as _exa_cortex_pb_LintDiffStepCreationOptions__Output } from './exa/cortex_pb/LintDiffStepCreationOptions';
import type { ListDirToolConfig as _exa_cortex_pb_ListDirToolConfig, ListDirToolConfig__Output as _exa_cortex_pb_ListDirToolConfig__Output } from './exa/cortex_pb/ListDirToolConfig';
import type { ListDirectoryResult as _exa_cortex_pb_ListDirectoryResult, ListDirectoryResult__Output as _exa_cortex_pb_ListDirectoryResult__Output } from './exa/cortex_pb/ListDirectoryResult';
import type { McpOAuthConfig as _exa_cortex_pb_McpOAuthConfig, McpOAuthConfig__Output as _exa_cortex_pb_McpOAuthConfig__Output } from './exa/cortex_pb/McpOAuthConfig';
import type { McpPrompt as _exa_cortex_pb_McpPrompt, McpPrompt__Output as _exa_cortex_pb_McpPrompt__Output } from './exa/cortex_pb/McpPrompt';
import type { McpPromptArgument as _exa_cortex_pb_McpPromptArgument, McpPromptArgument__Output as _exa_cortex_pb_McpPromptArgument__Output } from './exa/cortex_pb/McpPromptArgument';
import type { McpResource as _exa_cortex_pb_McpResource, McpResource__Output as _exa_cortex_pb_McpResource__Output } from './exa/cortex_pb/McpResource';
import type { McpResourceContent as _exa_cortex_pb_McpResourceContent, McpResourceContent__Output as _exa_cortex_pb_McpResourceContent__Output } from './exa/cortex_pb/McpResourceContent';
import type { McpServerInfo as _exa_cortex_pb_McpServerInfo, McpServerInfo__Output as _exa_cortex_pb_McpServerInfo__Output } from './exa/cortex_pb/McpServerInfo';
import type { McpServerSpec as _exa_cortex_pb_McpServerSpec, McpServerSpec__Output as _exa_cortex_pb_McpServerSpec__Output } from './exa/cortex_pb/McpServerSpec';
import type { McpServerState as _exa_cortex_pb_McpServerState, McpServerState__Output as _exa_cortex_pb_McpServerState__Output } from './exa/cortex_pb/McpServerState';
import type { McpToolConfig as _exa_cortex_pb_McpToolConfig, McpToolConfig__Output as _exa_cortex_pb_McpToolConfig__Output } from './exa/cortex_pb/McpToolConfig';
import type { MemoryConfig as _exa_cortex_pb_MemoryConfig, MemoryConfig__Output as _exa_cortex_pb_MemoryConfig__Output } from './exa/cortex_pb/MemoryConfig';
import type { MemoryToolConfig as _exa_cortex_pb_MemoryToolConfig, MemoryToolConfig__Output as _exa_cortex_pb_MemoryToolConfig__Output } from './exa/cortex_pb/MemoryToolConfig';
import type { MessagePromptMetadata as _exa_cortex_pb_MessagePromptMetadata, MessagePromptMetadata__Output as _exa_cortex_pb_MessagePromptMetadata__Output } from './exa/cortex_pb/MessagePromptMetadata';
import type { MqueryToolConfig as _exa_cortex_pb_MqueryToolConfig, MqueryToolConfig__Output as _exa_cortex_pb_MqueryToolConfig__Output } from './exa/cortex_pb/MqueryToolConfig';
import type { NotebookToolConfig as _exa_cortex_pb_NotebookToolConfig, NotebookToolConfig__Output as _exa_cortex_pb_NotebookToolConfig__Output } from './exa/cortex_pb/NotebookToolConfig';
import type { ParallelRolloutConfig as _exa_cortex_pb_ParallelRolloutConfig, ParallelRolloutConfig__Output as _exa_cortex_pb_ParallelRolloutConfig__Output } from './exa/cortex_pb/ParallelRolloutConfig';
import type { ParallelRolloutGeneratorMetadata as _exa_cortex_pb_ParallelRolloutGeneratorMetadata, ParallelRolloutGeneratorMetadata__Output as _exa_cortex_pb_ParallelRolloutGeneratorMetadata__Output } from './exa/cortex_pb/ParallelRolloutGeneratorMetadata';
import type { PlanConfig as _exa_cortex_pb_PlanConfig, PlanConfig__Output as _exa_cortex_pb_PlanConfig__Output } from './exa/cortex_pb/PlanConfig';
import type { PlanDebugInfo as _exa_cortex_pb_PlanDebugInfo, PlanDebugInfo__Output as _exa_cortex_pb_PlanDebugInfo__Output } from './exa/cortex_pb/PlanDebugInfo';
import type { PlanEntryDeltaSummary as _exa_cortex_pb_PlanEntryDeltaSummary, PlanEntryDeltaSummary__Output as _exa_cortex_pb_PlanEntryDeltaSummary__Output } from './exa/cortex_pb/PlanEntryDeltaSummary';
import type { PlanInput as _exa_cortex_pb_PlanInput, PlanInput__Output as _exa_cortex_pb_PlanInput__Output } from './exa/cortex_pb/PlanInput';
import type { PlanState as _exa_cortex_pb_PlanState, PlanState__Output as _exa_cortex_pb_PlanState__Output } from './exa/cortex_pb/PlanState';
import type { PromptOverrideConfig as _exa_cortex_pb_PromptOverrideConfig, PromptOverrideConfig__Output as _exa_cortex_pb_PromptOverrideConfig__Output } from './exa/cortex_pb/PromptOverrideConfig';
import type { ProxyWebServerToolConfig as _exa_cortex_pb_ProxyWebServerToolConfig, ProxyWebServerToolConfig__Output as _exa_cortex_pb_ProxyWebServerToolConfig__Output } from './exa/cortex_pb/ProxyWebServerToolConfig';
import type { QueuedMessage as _exa_cortex_pb_QueuedMessage, QueuedMessage__Output as _exa_cortex_pb_QueuedMessage__Output } from './exa/cortex_pb/QueuedMessage';
import type { ReadKnowledgeBaseItemToolConfig as _exa_cortex_pb_ReadKnowledgeBaseItemToolConfig, ReadKnowledgeBaseItemToolConfig__Output as _exa_cortex_pb_ReadKnowledgeBaseItemToolConfig__Output } from './exa/cortex_pb/ReadKnowledgeBaseItemToolConfig';
import type { ReadUrlContentToolConfig as _exa_cortex_pb_ReadUrlContentToolConfig, ReadUrlContentToolConfig__Output as _exa_cortex_pb_ReadUrlContentToolConfig__Output } from './exa/cortex_pb/ReadUrlContentToolConfig';
import type { ReplaceContentToolConfig as _exa_cortex_pb_ReplaceContentToolConfig, ReplaceContentToolConfig__Output as _exa_cortex_pb_ReplaceContentToolConfig__Output } from './exa/cortex_pb/ReplaceContentToolConfig';
import type { ReplacementChunk as _exa_cortex_pb_ReplacementChunk, ReplacementChunk__Output as _exa_cortex_pb_ReplacementChunk__Output } from './exa/cortex_pb/ReplacementChunk';
import type { ReplacementChunkInfo as _exa_cortex_pb_ReplacementChunkInfo, ReplacementChunkInfo__Output as _exa_cortex_pb_ReplacementChunkInfo__Output } from './exa/cortex_pb/ReplacementChunkInfo';
import type { RequestedInteraction as _exa_cortex_pb_RequestedInteraction, RequestedInteraction__Output as _exa_cortex_pb_RequestedInteraction__Output } from './exa/cortex_pb/RequestedInteraction';
import type { ResearchDebugInfo as _exa_cortex_pb_ResearchDebugInfo, ResearchDebugInfo__Output as _exa_cortex_pb_ResearchDebugInfo__Output } from './exa/cortex_pb/ResearchDebugInfo';
import type { RetrievalStatus as _exa_cortex_pb_RetrievalStatus, RetrievalStatus__Output as _exa_cortex_pb_RetrievalStatus__Output } from './exa/cortex_pb/RetrievalStatus';
import type { RevertMetadata as _exa_cortex_pb_RevertMetadata, RevertMetadata__Output as _exa_cortex_pb_RevertMetadata__Output } from './exa/cortex_pb/RevertMetadata';
import type { RunCommandOutput as _exa_cortex_pb_RunCommandOutput, RunCommandOutput__Output as _exa_cortex_pb_RunCommandOutput__Output } from './exa/cortex_pb/RunCommandOutput';
import type { RunCommandStepCreationOptions as _exa_cortex_pb_RunCommandStepCreationOptions, RunCommandStepCreationOptions__Output as _exa_cortex_pb_RunCommandStepCreationOptions__Output } from './exa/cortex_pb/RunCommandStepCreationOptions';
import type { RunCommandToolConfig as _exa_cortex_pb_RunCommandToolConfig, RunCommandToolConfig__Output as _exa_cortex_pb_RunCommandToolConfig__Output } from './exa/cortex_pb/RunCommandToolConfig';
import type { RunExtensionCodeConfig as _exa_cortex_pb_RunExtensionCodeConfig, RunExtensionCodeConfig__Output as _exa_cortex_pb_RunExtensionCodeConfig__Output } from './exa/cortex_pb/RunExtensionCodeConfig';
import type { SearchWebToolConfig as _exa_cortex_pb_SearchWebToolConfig, SearchWebToolConfig__Output as _exa_cortex_pb_SearchWebToolConfig__Output } from './exa/cortex_pb/SearchWebToolConfig';
import type { SectionOverrideConfig as _exa_cortex_pb_SectionOverrideConfig, SectionOverrideConfig__Output as _exa_cortex_pb_SectionOverrideConfig__Output } from './exa/cortex_pb/SectionOverrideConfig';
import type { SimpleCommand as _exa_cortex_pb_SimpleCommand, SimpleCommand__Output as _exa_cortex_pb_SimpleCommand__Output } from './exa/cortex_pb/SimpleCommand';
import type { SmartFriendToolConfig as _exa_cortex_pb_SmartFriendToolConfig, SmartFriendToolConfig__Output as _exa_cortex_pb_SmartFriendToolConfig__Output } from './exa/cortex_pb/SmartFriendToolConfig';
import type { SnapshotToStepsOptions as _exa_cortex_pb_SnapshotToStepsOptions, SnapshotToStepsOptions__Output as _exa_cortex_pb_SnapshotToStepsOptions__Output } from './exa/cortex_pb/SnapshotToStepsOptions';
import type { SourceTrajectoryStepInfo as _exa_cortex_pb_SourceTrajectoryStepInfo, SourceTrajectoryStepInfo__Output as _exa_cortex_pb_SourceTrajectoryStepInfo__Output } from './exa/cortex_pb/SourceTrajectoryStepInfo';
import type { StateInitializationData as _exa_cortex_pb_StateInitializationData, StateInitializationData__Output as _exa_cortex_pb_StateInitializationData__Output } from './exa/cortex_pb/StateInitializationData';
import type { StructuredErrorPart as _exa_cortex_pb_StructuredErrorPart, StructuredErrorPart__Output as _exa_cortex_pb_StructuredErrorPart__Output } from './exa/cortex_pb/StructuredErrorPart';
import type { SuggestedResponseConfig as _exa_cortex_pb_SuggestedResponseConfig, SuggestedResponseConfig__Output as _exa_cortex_pb_SuggestedResponseConfig__Output } from './exa/cortex_pb/SuggestedResponseConfig';
import type { SupercompleteEphemeralFeedbackEntry as _exa_cortex_pb_SupercompleteEphemeralFeedbackEntry, SupercompleteEphemeralFeedbackEntry__Output as _exa_cortex_pb_SupercompleteEphemeralFeedbackEntry__Output } from './exa/cortex_pb/SupercompleteEphemeralFeedbackEntry';
import type { SupercompleteTabJumpInfo as _exa_cortex_pb_SupercompleteTabJumpInfo, SupercompleteTabJumpInfo__Output as _exa_cortex_pb_SupercompleteTabJumpInfo__Output } from './exa/cortex_pb/SupercompleteTabJumpInfo';
import type { TaskDelta as _exa_cortex_pb_TaskDelta, TaskDelta__Output as _exa_cortex_pb_TaskDelta__Output } from './exa/cortex_pb/TaskDelta';
import type { TaskEntryDeltaSummary as _exa_cortex_pb_TaskEntryDeltaSummary, TaskEntryDeltaSummary__Output as _exa_cortex_pb_TaskEntryDeltaSummary__Output } from './exa/cortex_pb/TaskEntryDeltaSummary';
import type { TaskItem as _exa_cortex_pb_TaskItem, TaskItem__Output as _exa_cortex_pb_TaskItem__Output } from './exa/cortex_pb/TaskItem';
import type { TaskResolution as _exa_cortex_pb_TaskResolution, TaskResolution__Output as _exa_cortex_pb_TaskResolution__Output } from './exa/cortex_pb/TaskResolution';
import type { TaskResolutionOpenPr as _exa_cortex_pb_TaskResolutionOpenPr, TaskResolutionOpenPr__Output as _exa_cortex_pb_TaskResolutionOpenPr__Output } from './exa/cortex_pb/TaskResolutionOpenPr';
import type { ToolDescriptionOverrideMap as _exa_cortex_pb_ToolDescriptionOverrideMap, ToolDescriptionOverrideMap__Output as _exa_cortex_pb_ToolDescriptionOverrideMap__Output } from './exa/cortex_pb/ToolDescriptionOverrideMap';
import type { TrajectoryConversionConfig as _exa_cortex_pb_TrajectoryConversionConfig, TrajectoryConversionConfig__Output as _exa_cortex_pb_TrajectoryConversionConfig__Output } from './exa/cortex_pb/TrajectoryConversionConfig';
import type { TrajectoryDescription as _exa_cortex_pb_TrajectoryDescription, TrajectoryDescription__Output as _exa_cortex_pb_TrajectoryDescription__Output } from './exa/cortex_pb/TrajectoryDescription';
import type { TrajectoryJudgeConfig as _exa_cortex_pb_TrajectoryJudgeConfig, TrajectoryJudgeConfig__Output as _exa_cortex_pb_TrajectoryJudgeConfig__Output } from './exa/cortex_pb/TrajectoryJudgeConfig';
import type { TrajectoryPrefixMetadata as _exa_cortex_pb_TrajectoryPrefixMetadata, TrajectoryPrefixMetadata__Output as _exa_cortex_pb_TrajectoryPrefixMetadata__Output } from './exa/cortex_pb/TrajectoryPrefixMetadata';
import type { TrajectoryScope as _exa_cortex_pb_TrajectoryScope, TrajectoryScope__Output as _exa_cortex_pb_TrajectoryScope__Output } from './exa/cortex_pb/TrajectoryScope';
import type { TrajectorySearchToolConfig as _exa_cortex_pb_TrajectorySearchToolConfig, TrajectorySearchToolConfig__Output as _exa_cortex_pb_TrajectorySearchToolConfig__Output } from './exa/cortex_pb/TrajectorySearchToolConfig';
import type { TurnTiming as _exa_cortex_pb_TurnTiming, TurnTiming__Output as _exa_cortex_pb_TurnTiming__Output } from './exa/cortex_pb/TurnTiming';
import type { UpsertCodemapOutput as _exa_cortex_pb_UpsertCodemapOutput, UpsertCodemapOutput__Output as _exa_cortex_pb_UpsertCodemapOutput__Output } from './exa/cortex_pb/UpsertCodemapOutput';
import type { UpsertCodemapRunningStatus as _exa_cortex_pb_UpsertCodemapRunningStatus, UpsertCodemapRunningStatus__Output as _exa_cortex_pb_UpsertCodemapRunningStatus__Output } from './exa/cortex_pb/UpsertCodemapRunningStatus';
import type { UserGrepStepCreationOptions as _exa_cortex_pb_UserGrepStepCreationOptions, UserGrepStepCreationOptions__Output as _exa_cortex_pb_UserGrepStepCreationOptions__Output } from './exa/cortex_pb/UserGrepStepCreationOptions';
import type { UserStepAnnotations as _exa_cortex_pb_UserStepAnnotations, UserStepAnnotations__Output as _exa_cortex_pb_UserStepAnnotations__Output } from './exa/cortex_pb/UserStepAnnotations';
import type { UserStepSnapshot as _exa_cortex_pb_UserStepSnapshot, UserStepSnapshot__Output as _exa_cortex_pb_UserStepSnapshot__Output } from './exa/cortex_pb/UserStepSnapshot';
import type { ViewCodeItemToolConfig as _exa_cortex_pb_ViewCodeItemToolConfig, ViewCodeItemToolConfig__Output as _exa_cortex_pb_ViewCodeItemToolConfig__Output } from './exa/cortex_pb/ViewCodeItemToolConfig';
import type { ViewFileStepCreationOptions as _exa_cortex_pb_ViewFileStepCreationOptions, ViewFileStepCreationOptions__Output as _exa_cortex_pb_ViewFileStepCreationOptions__Output } from './exa/cortex_pb/ViewFileStepCreationOptions';
import type { ViewFileToolConfig as _exa_cortex_pb_ViewFileToolConfig, ViewFileToolConfig__Output as _exa_cortex_pb_ViewFileToolConfig__Output } from './exa/cortex_pb/ViewFileToolConfig';
import type { ViewedFileTrackerConfig as _exa_cortex_pb_ViewedFileTrackerConfig, ViewedFileTrackerConfig__Output as _exa_cortex_pb_ViewedFileTrackerConfig__Output } from './exa/cortex_pb/ViewedFileTrackerConfig';
import type { WindsurfSetting as _exa_cortex_pb_WindsurfSetting, WindsurfSetting__Output as _exa_cortex_pb_WindsurfSetting__Output } from './exa/cortex_pb/WindsurfSetting';
import type { WorkflowSpec as _exa_cortex_pb_WorkflowSpec, WorkflowSpec__Output as _exa_cortex_pb_WorkflowSpec__Output } from './exa/cortex_pb/WorkflowSpec';
import type { WorkspaceInitializationData as _exa_cortex_pb_WorkspaceInitializationData, WorkspaceInitializationData__Output as _exa_cortex_pb_WorkspaceInitializationData__Output } from './exa/cortex_pb/WorkspaceInitializationData';
import type { CharacterDiff as _exa_diff_action_pb_CharacterDiff, CharacterDiff__Output as _exa_diff_action_pb_CharacterDiff__Output } from './exa/diff_action_pb/CharacterDiff';
import type { CharacterDiffChange as _exa_diff_action_pb_CharacterDiffChange, CharacterDiffChange__Output as _exa_diff_action_pb_CharacterDiffChange__Output } from './exa/diff_action_pb/CharacterDiffChange';
import type { ComboDiff as _exa_diff_action_pb_ComboDiff, ComboDiff__Output as _exa_diff_action_pb_ComboDiff__Output } from './exa/diff_action_pb/ComboDiff';
import type { ComboDiffLine as _exa_diff_action_pb_ComboDiffLine, ComboDiffLine__Output as _exa_diff_action_pb_ComboDiffLine__Output } from './exa/diff_action_pb/ComboDiffLine';
import type { DiffBlock as _exa_diff_action_pb_DiffBlock, DiffBlock__Output as _exa_diff_action_pb_DiffBlock__Output } from './exa/diff_action_pb/DiffBlock';
import type { DiffList as _exa_diff_action_pb_DiffList, DiffList__Output as _exa_diff_action_pb_DiffList__Output } from './exa/diff_action_pb/DiffList';
import type { DiffSet as _exa_diff_action_pb_DiffSet, DiffSet__Output as _exa_diff_action_pb_DiffSet__Output } from './exa/diff_action_pb/DiffSet';
import type { UnifiedDiff as _exa_diff_action_pb_UnifiedDiff, UnifiedDiff__Output as _exa_diff_action_pb_UnifiedDiff__Output } from './exa/diff_action_pb/UnifiedDiff';
import type { AddIndexRequest as _exa_index_pb_AddIndexRequest, AddIndexRequest__Output as _exa_index_pb_AddIndexRequest__Output } from './exa/index_pb/AddIndexRequest';
import type { AddIndexResponse as _exa_index_pb_AddIndexResponse, AddIndexResponse__Output as _exa_index_pb_AddIndexResponse__Output } from './exa/index_pb/AddIndexResponse';
import type { AddRepositoryRequest as _exa_index_pb_AddRepositoryRequest, AddRepositoryRequest__Output as _exa_index_pb_AddRepositoryRequest__Output } from './exa/index_pb/AddRepositoryRequest';
import type { AddRepositoryResponse as _exa_index_pb_AddRepositoryResponse, AddRepositoryResponse__Output as _exa_index_pb_AddRepositoryResponse__Output } from './exa/index_pb/AddRepositoryResponse';
import type { CancelIndexingRequest as _exa_index_pb_CancelIndexingRequest, CancelIndexingRequest__Output as _exa_index_pb_CancelIndexingRequest__Output } from './exa/index_pb/CancelIndexingRequest';
import type { CancelIndexingResponse as _exa_index_pb_CancelIndexingResponse, CancelIndexingResponse__Output as _exa_index_pb_CancelIndexingResponse__Output } from './exa/index_pb/CancelIndexingResponse';
import type { DeleteIndexRequest as _exa_index_pb_DeleteIndexRequest, DeleteIndexRequest__Output as _exa_index_pb_DeleteIndexRequest__Output } from './exa/index_pb/DeleteIndexRequest';
import type { DeleteIndexResponse as _exa_index_pb_DeleteIndexResponse, DeleteIndexResponse__Output as _exa_index_pb_DeleteIndexResponse__Output } from './exa/index_pb/DeleteIndexResponse';
import type { DeleteRepositoryRequest as _exa_index_pb_DeleteRepositoryRequest, DeleteRepositoryRequest__Output as _exa_index_pb_DeleteRepositoryRequest__Output } from './exa/index_pb/DeleteRepositoryRequest';
import type { DeleteRepositoryResponse as _exa_index_pb_DeleteRepositoryResponse, DeleteRepositoryResponse__Output as _exa_index_pb_DeleteRepositoryResponse__Output } from './exa/index_pb/DeleteRepositoryResponse';
import type { DisableIndexingRequest as _exa_index_pb_DisableIndexingRequest, DisableIndexingRequest__Output as _exa_index_pb_DisableIndexingRequest__Output } from './exa/index_pb/DisableIndexingRequest';
import type { DisableIndexingResponse as _exa_index_pb_DisableIndexingResponse, DisableIndexingResponse__Output as _exa_index_pb_DisableIndexingResponse__Output } from './exa/index_pb/DisableIndexingResponse';
import type { EditRepositoryRequest as _exa_index_pb_EditRepositoryRequest, EditRepositoryRequest__Output as _exa_index_pb_EditRepositoryRequest__Output } from './exa/index_pb/EditRepositoryRequest';
import type { EditRepositoryResponse as _exa_index_pb_EditRepositoryResponse, EditRepositoryResponse__Output as _exa_index_pb_EditRepositoryResponse__Output } from './exa/index_pb/EditRepositoryResponse';
import type { EnableIndexingRequest as _exa_index_pb_EnableIndexingRequest, EnableIndexingRequest__Output as _exa_index_pb_EnableIndexingRequest__Output } from './exa/index_pb/EnableIndexingRequest';
import type { EnableIndexingResponse as _exa_index_pb_EnableIndexingResponse, EnableIndexingResponse__Output as _exa_index_pb_EnableIndexingResponse__Output } from './exa/index_pb/EnableIndexingResponse';
import type { GetConnectionsDebugInfoRequest as _exa_index_pb_GetConnectionsDebugInfoRequest, GetConnectionsDebugInfoRequest__Output as _exa_index_pb_GetConnectionsDebugInfoRequest__Output } from './exa/index_pb/GetConnectionsDebugInfoRequest';
import type { GetConnectionsDebugInfoResponse as _exa_index_pb_GetConnectionsDebugInfoResponse, GetConnectionsDebugInfoResponse__Output as _exa_index_pb_GetConnectionsDebugInfoResponse__Output } from './exa/index_pb/GetConnectionsDebugInfoResponse';
import type { GetDatabaseStatsRequest as _exa_index_pb_GetDatabaseStatsRequest, GetDatabaseStatsRequest__Output as _exa_index_pb_GetDatabaseStatsRequest__Output } from './exa/index_pb/GetDatabaseStatsRequest';
import type { GetDatabaseStatsResponse as _exa_index_pb_GetDatabaseStatsResponse, GetDatabaseStatsResponse__Output as _exa_index_pb_GetDatabaseStatsResponse__Output } from './exa/index_pb/GetDatabaseStatsResponse';
import type { GetEmbeddingsForCodeContextItemsRequest as _exa_index_pb_GetEmbeddingsForCodeContextItemsRequest, GetEmbeddingsForCodeContextItemsRequest__Output as _exa_index_pb_GetEmbeddingsForCodeContextItemsRequest__Output } from './exa/index_pb/GetEmbeddingsForCodeContextItemsRequest';
import type { GetEmbeddingsForCodeContextItemsResponse as _exa_index_pb_GetEmbeddingsForCodeContextItemsResponse, GetEmbeddingsForCodeContextItemsResponse__Output as _exa_index_pb_GetEmbeddingsForCodeContextItemsResponse__Output } from './exa/index_pb/GetEmbeddingsForCodeContextItemsResponse';
import type { GetIndexConfigRequest as _exa_index_pb_GetIndexConfigRequest, GetIndexConfigRequest__Output as _exa_index_pb_GetIndexConfigRequest__Output } from './exa/index_pb/GetIndexConfigRequest';
import type { GetIndexConfigResponse as _exa_index_pb_GetIndexConfigResponse, GetIndexConfigResponse__Output as _exa_index_pb_GetIndexConfigResponse__Output } from './exa/index_pb/GetIndexConfigResponse';
import type { GetIndexRequest as _exa_index_pb_GetIndexRequest, GetIndexRequest__Output as _exa_index_pb_GetIndexRequest__Output } from './exa/index_pb/GetIndexRequest';
import type { GetIndexResponse as _exa_index_pb_GetIndexResponse, GetIndexResponse__Output as _exa_index_pb_GetIndexResponse__Output } from './exa/index_pb/GetIndexResponse';
import type { GetIndexedRepositoriesRequest as _exa_index_pb_GetIndexedRepositoriesRequest, GetIndexedRepositoriesRequest__Output as _exa_index_pb_GetIndexedRepositoriesRequest__Output } from './exa/index_pb/GetIndexedRepositoriesRequest';
import type { GetIndexedRepositoriesResponse as _exa_index_pb_GetIndexedRepositoriesResponse, GetIndexedRepositoriesResponse__Output as _exa_index_pb_GetIndexedRepositoriesResponse__Output } from './exa/index_pb/GetIndexedRepositoriesResponse';
import type { GetIndexesRequest as _exa_index_pb_GetIndexesRequest, GetIndexesRequest__Output as _exa_index_pb_GetIndexesRequest__Output } from './exa/index_pb/GetIndexesRequest';
import type { GetIndexesResponse as _exa_index_pb_GetIndexesResponse, GetIndexesResponse__Output as _exa_index_pb_GetIndexesResponse__Output } from './exa/index_pb/GetIndexesResponse';
import type { GetMatchingFilePathsRequest as _exa_index_pb_GetMatchingFilePathsRequest, GetMatchingFilePathsRequest__Output as _exa_index_pb_GetMatchingFilePathsRequest__Output } from './exa/index_pb/GetMatchingFilePathsRequest';
import type { GetMatchingFilePathsResponse as _exa_index_pb_GetMatchingFilePathsResponse, GetMatchingFilePathsResponse__Output as _exa_index_pb_GetMatchingFilePathsResponse__Output } from './exa/index_pb/GetMatchingFilePathsResponse';
import type { GetNearestCCIsFromEmbeddingRequest as _exa_index_pb_GetNearestCCIsFromEmbeddingRequest, GetNearestCCIsFromEmbeddingRequest__Output as _exa_index_pb_GetNearestCCIsFromEmbeddingRequest__Output } from './exa/index_pb/GetNearestCCIsFromEmbeddingRequest';
import type { GetNearestCCIsFromEmbeddingResponse as _exa_index_pb_GetNearestCCIsFromEmbeddingResponse, GetNearestCCIsFromEmbeddingResponse__Output as _exa_index_pb_GetNearestCCIsFromEmbeddingResponse__Output } from './exa/index_pb/GetNearestCCIsFromEmbeddingResponse';
import type { GetNumberConnectionsRequest as _exa_index_pb_GetNumberConnectionsRequest, GetNumberConnectionsRequest__Output as _exa_index_pb_GetNumberConnectionsRequest__Output } from './exa/index_pb/GetNumberConnectionsRequest';
import type { GetNumberConnectionsResponse as _exa_index_pb_GetNumberConnectionsResponse, GetNumberConnectionsResponse__Output as _exa_index_pb_GetNumberConnectionsResponse__Output } from './exa/index_pb/GetNumberConnectionsResponse';
import type { GetRemoteIndexStatsRequest as _exa_index_pb_GetRemoteIndexStatsRequest, GetRemoteIndexStatsRequest__Output as _exa_index_pb_GetRemoteIndexStatsRequest__Output } from './exa/index_pb/GetRemoteIndexStatsRequest';
import type { GetRemoteIndexStatsResponse as _exa_index_pb_GetRemoteIndexStatsResponse, GetRemoteIndexStatsResponse__Output as _exa_index_pb_GetRemoteIndexStatsResponse__Output } from './exa/index_pb/GetRemoteIndexStatsResponse';
import type { GetRepositoriesFilter as _exa_index_pb_GetRepositoriesFilter, GetRepositoriesFilter__Output as _exa_index_pb_GetRepositoriesFilter__Output } from './exa/index_pb/GetRepositoriesFilter';
import type { GetRepositoriesRequest as _exa_index_pb_GetRepositoriesRequest, GetRepositoriesRequest__Output as _exa_index_pb_GetRepositoriesRequest__Output } from './exa/index_pb/GetRepositoriesRequest';
import type { GetRepositoriesResponse as _exa_index_pb_GetRepositoriesResponse, GetRepositoriesResponse__Output as _exa_index_pb_GetRepositoriesResponse__Output } from './exa/index_pb/GetRepositoriesResponse';
import type { Index as _exa_index_pb_Index, Index__Output as _exa_index_pb_Index__Output } from './exa/index_pb/Index';
import type { IndexBuildConfig as _exa_index_pb_IndexBuildConfig, IndexBuildConfig__Output as _exa_index_pb_IndexBuildConfig__Output } from './exa/index_pb/IndexBuildConfig';
import type { IndexConfig as _exa_index_pb_IndexConfig, IndexConfig__Output as _exa_index_pb_IndexConfig__Output } from './exa/index_pb/IndexConfig';
import type { IndexDbVersion as _exa_index_pb_IndexDbVersion, IndexDbVersion__Output as _exa_index_pb_IndexDbVersion__Output } from './exa/index_pb/IndexDbVersion';
import type { IndexManagementServiceClient as _exa_index_pb_IndexManagementServiceClient, IndexManagementServiceDefinition as _exa_index_pb_IndexManagementServiceDefinition } from './exa/index_pb/IndexManagementService';
import type { IndexServiceClient as _exa_index_pb_IndexServiceClient, IndexServiceDefinition as _exa_index_pb_IndexServiceDefinition } from './exa/index_pb/IndexService';
import type { IndexStats as _exa_index_pb_IndexStats, IndexStats__Output as _exa_index_pb_IndexStats__Output } from './exa/index_pb/IndexStats';
import type { IndexerEvent as _exa_index_pb_IndexerEvent, IndexerEvent__Output as _exa_index_pb_IndexerEvent__Output } from './exa/index_pb/IndexerEvent';
import type { ManagementMetadata as _exa_index_pb_ManagementMetadata, ManagementMetadata__Output as _exa_index_pb_ManagementMetadata__Output } from './exa/index_pb/ManagementMetadata';
import type { ProgressBar as _exa_index_pb_ProgressBar, ProgressBar__Output as _exa_index_pb_ProgressBar__Output } from './exa/index_pb/ProgressBar';
import type { PruneDatabaseRequest as _exa_index_pb_PruneDatabaseRequest, PruneDatabaseRequest__Output as _exa_index_pb_PruneDatabaseRequest__Output } from './exa/index_pb/PruneDatabaseRequest';
import type { PruneDatabaseResponse as _exa_index_pb_PruneDatabaseResponse, PruneDatabaseResponse__Output as _exa_index_pb_PruneDatabaseResponse__Output } from './exa/index_pb/PruneDatabaseResponse';
import type { RemoteIndexStats as _exa_index_pb_RemoteIndexStats, RemoteIndexStats__Output as _exa_index_pb_RemoteIndexStats__Output } from './exa/index_pb/RemoteIndexStats';
import type { Repository as _exa_index_pb_Repository, Repository__Output as _exa_index_pb_Repository__Output } from './exa/index_pb/Repository';
import type { RepositoryConfig as _exa_index_pb_RepositoryConfig, RepositoryConfig__Output as _exa_index_pb_RepositoryConfig__Output } from './exa/index_pb/RepositoryConfig';
import type { RepositoryFilter as _exa_index_pb_RepositoryFilter, RepositoryFilter__Output as _exa_index_pb_RepositoryFilter__Output } from './exa/index_pb/RepositoryFilter';
import type { RequestIndexVersion as _exa_index_pb_RequestIndexVersion, RequestIndexVersion__Output as _exa_index_pb_RequestIndexVersion__Output } from './exa/index_pb/RequestIndexVersion';
import type { RetryIndexingRequest as _exa_index_pb_RetryIndexingRequest, RetryIndexingRequest__Output as _exa_index_pb_RetryIndexingRequest__Output } from './exa/index_pb/RetryIndexingRequest';
import type { RetryIndexingResponse as _exa_index_pb_RetryIndexingResponse, RetryIndexingResponse__Output as _exa_index_pb_RetryIndexingResponse__Output } from './exa/index_pb/RetryIndexingResponse';
import type { ScoredContextItem as _exa_index_pb_ScoredContextItem, ScoredContextItem__Output as _exa_index_pb_ScoredContextItem__Output } from './exa/index_pb/ScoredContextItem';
import type { SetIndexConfigRequest as _exa_index_pb_SetIndexConfigRequest, SetIndexConfigRequest__Output as _exa_index_pb_SetIndexConfigRequest__Output } from './exa/index_pb/SetIndexConfigRequest';
import type { SetIndexConfigResponse as _exa_index_pb_SetIndexConfigResponse, SetIndexConfigResponse__Output as _exa_index_pb_SetIndexConfigResponse__Output } from './exa/index_pb/SetIndexConfigResponse';
import type { VectorIndexStats as _exa_index_pb_VectorIndexStats, VectorIndexStats__Output as _exa_index_pb_VectorIndexStats__Output } from './exa/index_pb/VectorIndexStats';
import type { CreateConnectionRequest as _exa_knowledge_base_pb_CreateConnectionRequest, CreateConnectionRequest__Output as _exa_knowledge_base_pb_CreateConnectionRequest__Output } from './exa/knowledge_base_pb/CreateConnectionRequest';
import type { CreateConnectionResponse as _exa_knowledge_base_pb_CreateConnectionResponse, CreateConnectionResponse__Output as _exa_knowledge_base_pb_CreateConnectionResponse__Output } from './exa/knowledge_base_pb/CreateConnectionResponse';
import type { CreateKnowledgeBaseItemRequest as _exa_knowledge_base_pb_CreateKnowledgeBaseItemRequest, CreateKnowledgeBaseItemRequest__Output as _exa_knowledge_base_pb_CreateKnowledgeBaseItemRequest__Output } from './exa/knowledge_base_pb/CreateKnowledgeBaseItemRequest';
import type { CreateKnowledgeBaseItemResponse as _exa_knowledge_base_pb_CreateKnowledgeBaseItemResponse, CreateKnowledgeBaseItemResponse__Output as _exa_knowledge_base_pb_CreateKnowledgeBaseItemResponse__Output } from './exa/knowledge_base_pb/CreateKnowledgeBaseItemResponse';
import type { DeleteKnowledgeBaseItemRequest as _exa_knowledge_base_pb_DeleteKnowledgeBaseItemRequest, DeleteKnowledgeBaseItemRequest__Output as _exa_knowledge_base_pb_DeleteKnowledgeBaseItemRequest__Output } from './exa/knowledge_base_pb/DeleteKnowledgeBaseItemRequest';
import type { DeleteKnowledgeBaseItemResponse as _exa_knowledge_base_pb_DeleteKnowledgeBaseItemResponse, DeleteKnowledgeBaseItemResponse__Output as _exa_knowledge_base_pb_DeleteKnowledgeBaseItemResponse__Output } from './exa/knowledge_base_pb/DeleteKnowledgeBaseItemResponse';
import type { EditKnowledgeBaseItemRequest as _exa_knowledge_base_pb_EditKnowledgeBaseItemRequest, EditKnowledgeBaseItemRequest__Output as _exa_knowledge_base_pb_EditKnowledgeBaseItemRequest__Output } from './exa/knowledge_base_pb/EditKnowledgeBaseItemRequest';
import type { EditKnowledgeBaseItemResponse as _exa_knowledge_base_pb_EditKnowledgeBaseItemResponse, EditKnowledgeBaseItemResponse__Output as _exa_knowledge_base_pb_EditKnowledgeBaseItemResponse__Output } from './exa/knowledge_base_pb/EditKnowledgeBaseItemResponse';
import type { GetConnectionRequest as _exa_knowledge_base_pb_GetConnectionRequest, GetConnectionRequest__Output as _exa_knowledge_base_pb_GetConnectionRequest__Output } from './exa/knowledge_base_pb/GetConnectionRequest';
import type { GetConnectionResponse as _exa_knowledge_base_pb_GetConnectionResponse, GetConnectionResponse__Output as _exa_knowledge_base_pb_GetConnectionResponse__Output } from './exa/knowledge_base_pb/GetConnectionResponse';
import type { GetGithubIntegrationStatusRequest as _exa_knowledge_base_pb_GetGithubIntegrationStatusRequest, GetGithubIntegrationStatusRequest__Output as _exa_knowledge_base_pb_GetGithubIntegrationStatusRequest__Output } from './exa/knowledge_base_pb/GetGithubIntegrationStatusRequest';
import type { GetGithubIntegrationStatusResponse as _exa_knowledge_base_pb_GetGithubIntegrationStatusResponse, GetGithubIntegrationStatusResponse__Output as _exa_knowledge_base_pb_GetGithubIntegrationStatusResponse__Output } from './exa/knowledge_base_pb/GetGithubIntegrationStatusResponse';
import type { GetGithubPullRequestSearchInfoRequest as _exa_knowledge_base_pb_GetGithubPullRequestSearchInfoRequest, GetGithubPullRequestSearchInfoRequest__Output as _exa_knowledge_base_pb_GetGithubPullRequestSearchInfoRequest__Output } from './exa/knowledge_base_pb/GetGithubPullRequestSearchInfoRequest';
import type { GetGithubPullRequestSearchInfoResponse as _exa_knowledge_base_pb_GetGithubPullRequestSearchInfoResponse, GetGithubPullRequestSearchInfoResponse__Output as _exa_knowledge_base_pb_GetGithubPullRequestSearchInfoResponse__Output } from './exa/knowledge_base_pb/GetGithubPullRequestSearchInfoResponse';
import type { GetKnowledgeBaseItemsForTeamRequest as _exa_knowledge_base_pb_GetKnowledgeBaseItemsForTeamRequest, GetKnowledgeBaseItemsForTeamRequest__Output as _exa_knowledge_base_pb_GetKnowledgeBaseItemsForTeamRequest__Output } from './exa/knowledge_base_pb/GetKnowledgeBaseItemsForTeamRequest';
import type { GetKnowledgeBaseItemsForTeamResponse as _exa_knowledge_base_pb_GetKnowledgeBaseItemsForTeamResponse, GetKnowledgeBaseItemsForTeamResponse__Output as _exa_knowledge_base_pb_GetKnowledgeBaseItemsForTeamResponse__Output } from './exa/knowledge_base_pb/GetKnowledgeBaseItemsForTeamResponse';
import type { GetKnowledgeBaseItemsRequest as _exa_knowledge_base_pb_GetKnowledgeBaseItemsRequest, GetKnowledgeBaseItemsRequest__Output as _exa_knowledge_base_pb_GetKnowledgeBaseItemsRequest__Output } from './exa/knowledge_base_pb/GetKnowledgeBaseItemsRequest';
import type { GetKnowledgeBaseItemsResponse as _exa_knowledge_base_pb_GetKnowledgeBaseItemsResponse, GetKnowledgeBaseItemsResponse__Output as _exa_knowledge_base_pb_GetKnowledgeBaseItemsResponse__Output } from './exa/knowledge_base_pb/GetKnowledgeBaseItemsResponse';
import type { KnowledgeBaseItem as _exa_knowledge_base_pb_KnowledgeBaseItem, KnowledgeBaseItem__Output as _exa_knowledge_base_pb_KnowledgeBaseItem__Output } from './exa/knowledge_base_pb/KnowledgeBaseItem';
import type { KnowledgeBaseServiceClient as _exa_knowledge_base_pb_KnowledgeBaseServiceClient, KnowledgeBaseServiceDefinition as _exa_knowledge_base_pb_KnowledgeBaseServiceDefinition } from './exa/knowledge_base_pb/KnowledgeBaseService';
import type { ReadKnowledgeBaseItemRequest as _exa_knowledge_base_pb_ReadKnowledgeBaseItemRequest, ReadKnowledgeBaseItemRequest__Output as _exa_knowledge_base_pb_ReadKnowledgeBaseItemRequest__Output } from './exa/knowledge_base_pb/ReadKnowledgeBaseItemRequest';
import type { ReadKnowledgeBaseItemResponse as _exa_knowledge_base_pb_ReadKnowledgeBaseItemResponse, ReadKnowledgeBaseItemResponse__Output as _exa_knowledge_base_pb_ReadKnowledgeBaseItemResponse__Output } from './exa/knowledge_base_pb/ReadKnowledgeBaseItemResponse';
import type { RemoveConnectionRequest as _exa_knowledge_base_pb_RemoveConnectionRequest, RemoveConnectionRequest__Output as _exa_knowledge_base_pb_RemoveConnectionRequest__Output } from './exa/knowledge_base_pb/RemoveConnectionRequest';
import type { RemoveConnectionResponse as _exa_knowledge_base_pb_RemoveConnectionResponse, RemoveConnectionResponse__Output as _exa_knowledge_base_pb_RemoveConnectionResponse__Output } from './exa/knowledge_base_pb/RemoveConnectionResponse';
import type { AcceptCompletionRequest as _exa_language_server_pb_AcceptCompletionRequest, AcceptCompletionRequest__Output as _exa_language_server_pb_AcceptCompletionRequest__Output } from './exa/language_server_pb/AcceptCompletionRequest';
import type { AcceptCompletionResponse as _exa_language_server_pb_AcceptCompletionResponse, AcceptCompletionResponse__Output as _exa_language_server_pb_AcceptCompletionResponse__Output } from './exa/language_server_pb/AcceptCompletionResponse';
import type { AcknowledgeCascadeCodeEditRequest as _exa_language_server_pb_AcknowledgeCascadeCodeEditRequest, AcknowledgeCascadeCodeEditRequest__Output as _exa_language_server_pb_AcknowledgeCascadeCodeEditRequest__Output } from './exa/language_server_pb/AcknowledgeCascadeCodeEditRequest';
import type { AcknowledgeCascadeCodeEditResponse as _exa_language_server_pb_AcknowledgeCascadeCodeEditResponse, AcknowledgeCascadeCodeEditResponse__Output as _exa_language_server_pb_AcknowledgeCascadeCodeEditResponse__Output } from './exa/language_server_pb/AcknowledgeCascadeCodeEditResponse';
import type { AddTrackedWorkspaceRequest as _exa_language_server_pb_AddTrackedWorkspaceRequest, AddTrackedWorkspaceRequest__Output as _exa_language_server_pb_AddTrackedWorkspaceRequest__Output } from './exa/language_server_pb/AddTrackedWorkspaceRequest';
import type { AddTrackedWorkspaceResponse as _exa_language_server_pb_AddTrackedWorkspaceResponse, AddTrackedWorkspaceResponse__Output as _exa_language_server_pb_AddTrackedWorkspaceResponse__Output } from './exa/language_server_pb/AddTrackedWorkspaceResponse';
import type { BrainStatus as _exa_language_server_pb_BrainStatus, BrainStatus__Output as _exa_language_server_pb_BrainStatus__Output } from './exa/language_server_pb/BrainStatus';
import type { BranchCascadeAndGenerateCodeMapRequest as _exa_language_server_pb_BranchCascadeAndGenerateCodeMapRequest, BranchCascadeAndGenerateCodeMapRequest__Output as _exa_language_server_pb_BranchCascadeAndGenerateCodeMapRequest__Output } from './exa/language_server_pb/BranchCascadeAndGenerateCodeMapRequest';
import type { BranchCascadeAndGenerateCodeMapResponse as _exa_language_server_pb_BranchCascadeAndGenerateCodeMapResponse, BranchCascadeAndGenerateCodeMapResponse__Output as _exa_language_server_pb_BranchCascadeAndGenerateCodeMapResponse__Output } from './exa/language_server_pb/BranchCascadeAndGenerateCodeMapResponse';
import type { BranchCascadeRequest as _exa_language_server_pb_BranchCascadeRequest, BranchCascadeRequest__Output as _exa_language_server_pb_BranchCascadeRequest__Output } from './exa/language_server_pb/BranchCascadeRequest';
import type { BranchCascadeResponse as _exa_language_server_pb_BranchCascadeResponse, BranchCascadeResponse__Output as _exa_language_server_pb_BranchCascadeResponse__Output } from './exa/language_server_pb/BranchCascadeResponse';
import type { BranchInfo as _exa_language_server_pb_BranchInfo, BranchInfo__Output as _exa_language_server_pb_BranchInfo__Output } from './exa/language_server_pb/BranchInfo';
import type { CancelCascadeInvocationAndWaitRequest as _exa_language_server_pb_CancelCascadeInvocationAndWaitRequest, CancelCascadeInvocationAndWaitRequest__Output as _exa_language_server_pb_CancelCascadeInvocationAndWaitRequest__Output } from './exa/language_server_pb/CancelCascadeInvocationAndWaitRequest';
import type { CancelCascadeInvocationAndWaitResponse as _exa_language_server_pb_CancelCascadeInvocationAndWaitResponse, CancelCascadeInvocationAndWaitResponse__Output as _exa_language_server_pb_CancelCascadeInvocationAndWaitResponse__Output } from './exa/language_server_pb/CancelCascadeInvocationAndWaitResponse';
import type { CancelCascadeInvocationRequest as _exa_language_server_pb_CancelCascadeInvocationRequest, CancelCascadeInvocationRequest__Output as _exa_language_server_pb_CancelCascadeInvocationRequest__Output } from './exa/language_server_pb/CancelCascadeInvocationRequest';
import type { CancelCascadeInvocationResponse as _exa_language_server_pb_CancelCascadeInvocationResponse, CancelCascadeInvocationResponse__Output as _exa_language_server_pb_CancelCascadeInvocationResponse__Output } from './exa/language_server_pb/CancelCascadeInvocationResponse';
import type { CancelCascadeStepsRequest as _exa_language_server_pb_CancelCascadeStepsRequest, CancelCascadeStepsRequest__Output as _exa_language_server_pb_CancelCascadeStepsRequest__Output } from './exa/language_server_pb/CancelCascadeStepsRequest';
import type { CancelCascadeStepsResponse as _exa_language_server_pb_CancelCascadeStepsResponse, CancelCascadeStepsResponse__Output as _exa_language_server_pb_CancelCascadeStepsResponse__Output } from './exa/language_server_pb/CancelCascadeStepsResponse';
import type { CancelRequestRequest as _exa_language_server_pb_CancelRequestRequest, CancelRequestRequest__Output as _exa_language_server_pb_CancelRequestRequest__Output } from './exa/language_server_pb/CancelRequestRequest';
import type { CancelRequestResponse as _exa_language_server_pb_CancelRequestResponse, CancelRequestResponse__Output as _exa_language_server_pb_CancelRequestResponse__Output } from './exa/language_server_pb/CancelRequestResponse';
import type { CaptureCodeRequest as _exa_language_server_pb_CaptureCodeRequest, CaptureCodeRequest__Output as _exa_language_server_pb_CaptureCodeRequest__Output } from './exa/language_server_pb/CaptureCodeRequest';
import type { CaptureCodeResponse as _exa_language_server_pb_CaptureCodeResponse, CaptureCodeResponse__Output as _exa_language_server_pb_CaptureCodeResponse__Output } from './exa/language_server_pb/CaptureCodeResponse';
import type { CaptureFileRequest as _exa_language_server_pb_CaptureFileRequest, CaptureFileRequest__Output as _exa_language_server_pb_CaptureFileRequest__Output } from './exa/language_server_pb/CaptureFileRequest';
import type { CaptureFileResponse as _exa_language_server_pb_CaptureFileResponse, CaptureFileResponse__Output as _exa_language_server_pb_CaptureFileResponse__Output } from './exa/language_server_pb/CaptureFileResponse';
import type { CheckBugsRequest as _exa_language_server_pb_CheckBugsRequest, CheckBugsRequest__Output as _exa_language_server_pb_CheckBugsRequest__Output } from './exa/language_server_pb/CheckBugsRequest';
import type { CheckBugsResponse as _exa_language_server_pb_CheckBugsResponse, CheckBugsResponse__Output as _exa_language_server_pb_CheckBugsResponse__Output } from './exa/language_server_pb/CheckBugsResponse';
import type { CheckChatCapacityRequest as _exa_language_server_pb_CheckChatCapacityRequest, CheckChatCapacityRequest__Output as _exa_language_server_pb_CheckChatCapacityRequest__Output } from './exa/language_server_pb/CheckChatCapacityRequest';
import type { CheckChatCapacityResponse as _exa_language_server_pb_CheckChatCapacityResponse, CheckChatCapacityResponse__Output as _exa_language_server_pb_CheckChatCapacityResponse__Output } from './exa/language_server_pb/CheckChatCapacityResponse';
import type { CheckUserMessageRateLimitRequest as _exa_language_server_pb_CheckUserMessageRateLimitRequest, CheckUserMessageRateLimitRequest__Output as _exa_language_server_pb_CheckUserMessageRateLimitRequest__Output } from './exa/language_server_pb/CheckUserMessageRateLimitRequest';
import type { CheckUserMessageRateLimitResponse as _exa_language_server_pb_CheckUserMessageRateLimitResponse, CheckUserMessageRateLimitResponse__Output as _exa_language_server_pb_CheckUserMessageRateLimitResponse__Output } from './exa/language_server_pb/CheckUserMessageRateLimitResponse';
import type { CodeEditRevertPreview as _exa_language_server_pb_CodeEditRevertPreview, CodeEditRevertPreview__Output as _exa_language_server_pb_CodeEditRevertPreview__Output } from './exa/language_server_pb/CodeEditRevertPreview';
import type { CodeRange as _exa_language_server_pb_CodeRange, CodeRange__Output as _exa_language_server_pb_CodeRange__Output } from './exa/language_server_pb/CodeRange';
import type { CodeTheme as _exa_language_server_pb_CodeTheme, CodeTheme__Output as _exa_language_server_pb_CodeTheme__Output } from './exa/language_server_pb/CodeTheme';
import type { CodeTrackerState as _exa_language_server_pb_CodeTrackerState, CodeTrackerState__Output as _exa_language_server_pb_CodeTrackerState__Output } from './exa/language_server_pb/CodeTrackerState';
import type { CommitMessageData as _exa_language_server_pb_CommitMessageData, CommitMessageData__Output as _exa_language_server_pb_CommitMessageData__Output } from './exa/language_server_pb/CommitMessageData';
import type { CompletionItem as _exa_language_server_pb_CompletionItem, CompletionItem__Output as _exa_language_server_pb_CompletionItem__Output } from './exa/language_server_pb/CompletionItem';
import type { CompletionPart as _exa_language_server_pb_CompletionPart, CompletionPart__Output as _exa_language_server_pb_CompletionPart__Output } from './exa/language_server_pb/CompletionPart';
import type { ContextInfoRequest as _exa_language_server_pb_ContextInfoRequest, ContextInfoRequest__Output as _exa_language_server_pb_ContextInfoRequest__Output } from './exa/language_server_pb/ContextInfoRequest';
import type { ContextInfoResponse as _exa_language_server_pb_ContextInfoResponse, ContextInfoResponse__Output as _exa_language_server_pb_ContextInfoResponse__Output } from './exa/language_server_pb/ContextInfoResponse';
import type { ContextStatus as _exa_language_server_pb_ContextStatus, ContextStatus__Output as _exa_language_server_pb_ContextStatus__Output } from './exa/language_server_pb/ContextStatus';
import type { ConvergeArenaCascadesRequest as _exa_language_server_pb_ConvergeArenaCascadesRequest, ConvergeArenaCascadesRequest__Output as _exa_language_server_pb_ConvergeArenaCascadesRequest__Output } from './exa/language_server_pb/ConvergeArenaCascadesRequest';
import type { ConvergeArenaCascadesResponse as _exa_language_server_pb_ConvergeArenaCascadesResponse, ConvergeArenaCascadesResponse__Output as _exa_language_server_pb_ConvergeArenaCascadesResponse__Output } from './exa/language_server_pb/ConvergeArenaCascadesResponse';
import type { ConversationTagList as _exa_language_server_pb_ConversationTagList, ConversationTagList__Output as _exa_language_server_pb_ConversationTagList__Output } from './exa/language_server_pb/ConversationTagList';
import type { CopyBuiltinWorkflowToWorkspaceRequest as _exa_language_server_pb_CopyBuiltinWorkflowToWorkspaceRequest, CopyBuiltinWorkflowToWorkspaceRequest__Output as _exa_language_server_pb_CopyBuiltinWorkflowToWorkspaceRequest__Output } from './exa/language_server_pb/CopyBuiltinWorkflowToWorkspaceRequest';
import type { CopyBuiltinWorkflowToWorkspaceResponse as _exa_language_server_pb_CopyBuiltinWorkflowToWorkspaceResponse, CopyBuiltinWorkflowToWorkspaceResponse__Output as _exa_language_server_pb_CopyBuiltinWorkflowToWorkspaceResponse__Output } from './exa/language_server_pb/CopyBuiltinWorkflowToWorkspaceResponse';
import type { CreateCustomizationFileRequest as _exa_language_server_pb_CreateCustomizationFileRequest, CreateCustomizationFileRequest__Output as _exa_language_server_pb_CreateCustomizationFileRequest__Output } from './exa/language_server_pb/CreateCustomizationFileRequest';
import type { CreateCustomizationFileResponse as _exa_language_server_pb_CreateCustomizationFileResponse, CreateCustomizationFileResponse__Output as _exa_language_server_pb_CreateCustomizationFileResponse__Output } from './exa/language_server_pb/CreateCustomizationFileResponse';
import type { CreateTrajectoryShareRequest as _exa_language_server_pb_CreateTrajectoryShareRequest, CreateTrajectoryShareRequest__Output as _exa_language_server_pb_CreateTrajectoryShareRequest__Output } from './exa/language_server_pb/CreateTrajectoryShareRequest';
import type { CreateTrajectoryShareResponse as _exa_language_server_pb_CreateTrajectoryShareResponse, CreateTrajectoryShareResponse__Output as _exa_language_server_pb_CreateTrajectoryShareResponse__Output } from './exa/language_server_pb/CreateTrajectoryShareResponse';
import type { DeleteCascadeMemoryRequest as _exa_language_server_pb_DeleteCascadeMemoryRequest, DeleteCascadeMemoryRequest__Output as _exa_language_server_pb_DeleteCascadeMemoryRequest__Output } from './exa/language_server_pb/DeleteCascadeMemoryRequest';
import type { DeleteCascadeMemoryResponse as _exa_language_server_pb_DeleteCascadeMemoryResponse, DeleteCascadeMemoryResponse__Output as _exa_language_server_pb_DeleteCascadeMemoryResponse__Output } from './exa/language_server_pb/DeleteCascadeMemoryResponse';
import type { DeleteCascadeTrajectoryRequest as _exa_language_server_pb_DeleteCascadeTrajectoryRequest, DeleteCascadeTrajectoryRequest__Output as _exa_language_server_pb_DeleteCascadeTrajectoryRequest__Output } from './exa/language_server_pb/DeleteCascadeTrajectoryRequest';
import type { DeleteCascadeTrajectoryResponse as _exa_language_server_pb_DeleteCascadeTrajectoryResponse, DeleteCascadeTrajectoryResponse__Output as _exa_language_server_pb_DeleteCascadeTrajectoryResponse__Output } from './exa/language_server_pb/DeleteCascadeTrajectoryResponse';
import type { DismissCodeMapSuggestionRequest as _exa_language_server_pb_DismissCodeMapSuggestionRequest, DismissCodeMapSuggestionRequest__Output as _exa_language_server_pb_DismissCodeMapSuggestionRequest__Output } from './exa/language_server_pb/DismissCodeMapSuggestionRequest';
import type { DismissCodeMapSuggestionResponse as _exa_language_server_pb_DismissCodeMapSuggestionResponse, DismissCodeMapSuggestionResponse__Output as _exa_language_server_pb_DismissCodeMapSuggestionResponse__Output } from './exa/language_server_pb/DismissCodeMapSuggestionResponse';
import type { EditConfigurationRequest as _exa_language_server_pb_EditConfigurationRequest, EditConfigurationRequest__Output as _exa_language_server_pb_EditConfigurationRequest__Output } from './exa/language_server_pb/EditConfigurationRequest';
import type { EditConfigurationResponse as _exa_language_server_pb_EditConfigurationResponse, EditConfigurationResponse__Output as _exa_language_server_pb_EditConfigurationResponse__Output } from './exa/language_server_pb/EditConfigurationResponse';
import type { ExactSearchMatchPreview as _exa_language_server_pb_ExactSearchMatchPreview, ExactSearchMatchPreview__Output as _exa_language_server_pb_ExactSearchMatchPreview__Output } from './exa/language_server_pb/ExactSearchMatchPreview';
import type { ExactSearchOptions as _exa_language_server_pb_ExactSearchOptions, ExactSearchOptions__Output as _exa_language_server_pb_ExactSearchOptions__Output } from './exa/language_server_pb/ExactSearchOptions';
import type { ExactSearchPreviewOptions as _exa_language_server_pb_ExactSearchPreviewOptions, ExactSearchPreviewOptions__Output as _exa_language_server_pb_ExactSearchPreviewOptions__Output } from './exa/language_server_pb/ExactSearchPreviewOptions';
import type { ExactSearchQuery as _exa_language_server_pb_ExactSearchQuery, ExactSearchQuery__Output as _exa_language_server_pb_ExactSearchQuery__Output } from './exa/language_server_pb/ExactSearchQuery';
import type { ExactSearchResult as _exa_language_server_pb_ExactSearchResult, ExactSearchResult__Output as _exa_language_server_pb_ExactSearchResult__Output } from './exa/language_server_pb/ExactSearchResult';
import type { ExitRequest as _exa_language_server_pb_ExitRequest, ExitRequest__Output as _exa_language_server_pb_ExitRequest__Output } from './exa/language_server_pb/ExitRequest';
import type { ExitResponse as _exa_language_server_pb_ExitResponse, ExitResponse__Output as _exa_language_server_pb_ExitResponse__Output } from './exa/language_server_pb/ExitResponse';
import type { ForceBackgroundResearchRefreshRequest as _exa_language_server_pb_ForceBackgroundResearchRefreshRequest, ForceBackgroundResearchRefreshRequest__Output as _exa_language_server_pb_ForceBackgroundResearchRefreshRequest__Output } from './exa/language_server_pb/ForceBackgroundResearchRefreshRequest';
import type { ForceBackgroundResearchRefreshResponse as _exa_language_server_pb_ForceBackgroundResearchRefreshResponse, ForceBackgroundResearchRefreshResponse__Output as _exa_language_server_pb_ForceBackgroundResearchRefreshResponse__Output } from './exa/language_server_pb/ForceBackgroundResearchRefreshResponse';
import type { GenerateCodeMapRequest as _exa_language_server_pb_GenerateCodeMapRequest, GenerateCodeMapRequest__Output as _exa_language_server_pb_GenerateCodeMapRequest__Output } from './exa/language_server_pb/GenerateCodeMapRequest';
import type { GenerateCodeMapResponse as _exa_language_server_pb_GenerateCodeMapResponse, GenerateCodeMapResponse__Output as _exa_language_server_pb_GenerateCodeMapResponse__Output } from './exa/language_server_pb/GenerateCodeMapResponse';
import type { GenerateCommitMessageRequest as _exa_language_server_pb_GenerateCommitMessageRequest, GenerateCommitMessageRequest__Output as _exa_language_server_pb_GenerateCommitMessageRequest__Output } from './exa/language_server_pb/GenerateCommitMessageRequest';
import type { GenerateCommitMessageResponse as _exa_language_server_pb_GenerateCommitMessageResponse, GenerateCommitMessageResponse__Output as _exa_language_server_pb_GenerateCommitMessageResponse__Output } from './exa/language_server_pb/GenerateCommitMessageResponse';
import type { GenerateVibeAndReplaceStreamingRequest as _exa_language_server_pb_GenerateVibeAndReplaceStreamingRequest, GenerateVibeAndReplaceStreamingRequest__Output as _exa_language_server_pb_GenerateVibeAndReplaceStreamingRequest__Output } from './exa/language_server_pb/GenerateVibeAndReplaceStreamingRequest';
import type { GenerateVibeAndReplaceStreamingResponse as _exa_language_server_pb_GenerateVibeAndReplaceStreamingResponse, GenerateVibeAndReplaceStreamingResponse__Output as _exa_language_server_pb_GenerateVibeAndReplaceStreamingResponse__Output } from './exa/language_server_pb/GenerateVibeAndReplaceStreamingResponse';
import type { GetActiveAppDeploymentForWorkspaceRequest as _exa_language_server_pb_GetActiveAppDeploymentForWorkspaceRequest, GetActiveAppDeploymentForWorkspaceRequest__Output as _exa_language_server_pb_GetActiveAppDeploymentForWorkspaceRequest__Output } from './exa/language_server_pb/GetActiveAppDeploymentForWorkspaceRequest';
import type { GetActiveAppDeploymentForWorkspaceResponse as _exa_language_server_pb_GetActiveAppDeploymentForWorkspaceResponse, GetActiveAppDeploymentForWorkspaceResponse__Output as _exa_language_server_pb_GetActiveAppDeploymentForWorkspaceResponse__Output } from './exa/language_server_pb/GetActiveAppDeploymentForWorkspaceResponse';
import type { GetAllCascadeTrajectoriesRequest as _exa_language_server_pb_GetAllCascadeTrajectoriesRequest, GetAllCascadeTrajectoriesRequest__Output as _exa_language_server_pb_GetAllCascadeTrajectoriesRequest__Output } from './exa/language_server_pb/GetAllCascadeTrajectoriesRequest';
import type { GetAllCascadeTrajectoriesResponse as _exa_language_server_pb_GetAllCascadeTrajectoriesResponse, GetAllCascadeTrajectoriesResponse__Output as _exa_language_server_pb_GetAllCascadeTrajectoriesResponse__Output } from './exa/language_server_pb/GetAllCascadeTrajectoriesResponse';
import type { GetAllPlansRequest as _exa_language_server_pb_GetAllPlansRequest, GetAllPlansRequest__Output as _exa_language_server_pb_GetAllPlansRequest__Output } from './exa/language_server_pb/GetAllPlansRequest';
import type { GetAllPlansResponse as _exa_language_server_pb_GetAllPlansResponse, GetAllPlansResponse__Output as _exa_language_server_pb_GetAllPlansResponse__Output } from './exa/language_server_pb/GetAllPlansResponse';
import type { GetAllRulesRequest as _exa_language_server_pb_GetAllRulesRequest, GetAllRulesRequest__Output as _exa_language_server_pb_GetAllRulesRequest__Output } from './exa/language_server_pb/GetAllRulesRequest';
import type { GetAllRulesResponse as _exa_language_server_pb_GetAllRulesResponse, GetAllRulesResponse__Output as _exa_language_server_pb_GetAllRulesResponse__Output } from './exa/language_server_pb/GetAllRulesResponse';
import type { GetAllSkillsRequest as _exa_language_server_pb_GetAllSkillsRequest, GetAllSkillsRequest__Output as _exa_language_server_pb_GetAllSkillsRequest__Output } from './exa/language_server_pb/GetAllSkillsRequest';
import type { GetAllSkillsResponse as _exa_language_server_pb_GetAllSkillsResponse, GetAllSkillsResponse__Output as _exa_language_server_pb_GetAllSkillsResponse__Output } from './exa/language_server_pb/GetAllSkillsResponse';
import type { GetAllWorkflowsRequest as _exa_language_server_pb_GetAllWorkflowsRequest, GetAllWorkflowsRequest__Output as _exa_language_server_pb_GetAllWorkflowsRequest__Output } from './exa/language_server_pb/GetAllWorkflowsRequest';
import type { GetAllWorkflowsResponse as _exa_language_server_pb_GetAllWorkflowsResponse, GetAllWorkflowsResponse__Output as _exa_language_server_pb_GetAllWorkflowsResponse__Output } from './exa/language_server_pb/GetAllWorkflowsResponse';
import type { GetAuthTokenRequest as _exa_language_server_pb_GetAuthTokenRequest, GetAuthTokenRequest__Output as _exa_language_server_pb_GetAuthTokenRequest__Output } from './exa/language_server_pb/GetAuthTokenRequest';
import type { GetAuthTokenResponse as _exa_language_server_pb_GetAuthTokenResponse, GetAuthTokenResponse__Output as _exa_language_server_pb_GetAuthTokenResponse__Output } from './exa/language_server_pb/GetAuthTokenResponse';
import type { GetAvailableCascadePluginsRequest as _exa_language_server_pb_GetAvailableCascadePluginsRequest, GetAvailableCascadePluginsRequest__Output as _exa_language_server_pb_GetAvailableCascadePluginsRequest__Output } from './exa/language_server_pb/GetAvailableCascadePluginsRequest';
import type { GetAvailableCascadePluginsResponse as _exa_language_server_pb_GetAvailableCascadePluginsResponse, GetAvailableCascadePluginsResponse__Output as _exa_language_server_pb_GetAvailableCascadePluginsResponse__Output } from './exa/language_server_pb/GetAvailableCascadePluginsResponse';
import type { GetBrainStatusRequest as _exa_language_server_pb_GetBrainStatusRequest, GetBrainStatusRequest__Output as _exa_language_server_pb_GetBrainStatusRequest__Output } from './exa/language_server_pb/GetBrainStatusRequest';
import type { GetBrainStatusResponse as _exa_language_server_pb_GetBrainStatusResponse, GetBrainStatusResponse__Output as _exa_language_server_pb_GetBrainStatusResponse__Output } from './exa/language_server_pb/GetBrainStatusResponse';
import type { GetCascadeMemoriesRequest as _exa_language_server_pb_GetCascadeMemoriesRequest, GetCascadeMemoriesRequest__Output as _exa_language_server_pb_GetCascadeMemoriesRequest__Output } from './exa/language_server_pb/GetCascadeMemoriesRequest';
import type { GetCascadeMemoriesResponse as _exa_language_server_pb_GetCascadeMemoriesResponse, GetCascadeMemoriesResponse__Output as _exa_language_server_pb_GetCascadeMemoriesResponse__Output } from './exa/language_server_pb/GetCascadeMemoriesResponse';
import type { GetCascadeModelConfigsRequest as _exa_language_server_pb_GetCascadeModelConfigsRequest, GetCascadeModelConfigsRequest__Output as _exa_language_server_pb_GetCascadeModelConfigsRequest__Output } from './exa/language_server_pb/GetCascadeModelConfigsRequest';
import type { GetCascadeModelConfigsResponse as _exa_language_server_pb_GetCascadeModelConfigsResponse, GetCascadeModelConfigsResponse__Output as _exa_language_server_pb_GetCascadeModelConfigsResponse__Output } from './exa/language_server_pb/GetCascadeModelConfigsResponse';
import type { GetCascadePluginByIdRequest as _exa_language_server_pb_GetCascadePluginByIdRequest, GetCascadePluginByIdRequest__Output as _exa_language_server_pb_GetCascadePluginByIdRequest__Output } from './exa/language_server_pb/GetCascadePluginByIdRequest';
import type { GetCascadePluginByIdResponse as _exa_language_server_pb_GetCascadePluginByIdResponse, GetCascadePluginByIdResponse__Output as _exa_language_server_pb_GetCascadePluginByIdResponse__Output } from './exa/language_server_pb/GetCascadePluginByIdResponse';
import type { GetCascadeTrajectoryGeneratorMetadataRequest as _exa_language_server_pb_GetCascadeTrajectoryGeneratorMetadataRequest, GetCascadeTrajectoryGeneratorMetadataRequest__Output as _exa_language_server_pb_GetCascadeTrajectoryGeneratorMetadataRequest__Output } from './exa/language_server_pb/GetCascadeTrajectoryGeneratorMetadataRequest';
import type { GetCascadeTrajectoryGeneratorMetadataResponse as _exa_language_server_pb_GetCascadeTrajectoryGeneratorMetadataResponse, GetCascadeTrajectoryGeneratorMetadataResponse__Output as _exa_language_server_pb_GetCascadeTrajectoryGeneratorMetadataResponse__Output } from './exa/language_server_pb/GetCascadeTrajectoryGeneratorMetadataResponse';
import type { GetCascadeTrajectoryRequest as _exa_language_server_pb_GetCascadeTrajectoryRequest, GetCascadeTrajectoryRequest__Output as _exa_language_server_pb_GetCascadeTrajectoryRequest__Output } from './exa/language_server_pb/GetCascadeTrajectoryRequest';
import type { GetCascadeTrajectoryResponse as _exa_language_server_pb_GetCascadeTrajectoryResponse, GetCascadeTrajectoryResponse__Output as _exa_language_server_pb_GetCascadeTrajectoryResponse__Output } from './exa/language_server_pb/GetCascadeTrajectoryResponse';
import type { GetCascadeTrajectoryStepsRequest as _exa_language_server_pb_GetCascadeTrajectoryStepsRequest, GetCascadeTrajectoryStepsRequest__Output as _exa_language_server_pb_GetCascadeTrajectoryStepsRequest__Output } from './exa/language_server_pb/GetCascadeTrajectoryStepsRequest';
import type { GetCascadeTrajectoryStepsResponse as _exa_language_server_pb_GetCascadeTrajectoryStepsResponse, GetCascadeTrajectoryStepsResponse__Output as _exa_language_server_pb_GetCascadeTrajectoryStepsResponse__Output } from './exa/language_server_pb/GetCascadeTrajectoryStepsResponse';
import type { GetChangelogRequest as _exa_language_server_pb_GetChangelogRequest, GetChangelogRequest__Output as _exa_language_server_pb_GetChangelogRequest__Output } from './exa/language_server_pb/GetChangelogRequest';
import type { GetChangelogResponse as _exa_language_server_pb_GetChangelogResponse, GetChangelogResponse__Output as _exa_language_server_pb_GetChangelogResponse__Output } from './exa/language_server_pb/GetChangelogResponse';
import type { GetChatMessageResponse as _exa_language_server_pb_GetChatMessageResponse, GetChatMessageResponse__Output as _exa_language_server_pb_GetChatMessageResponse__Output } from './exa/language_server_pb/GetChatMessageResponse';
import type { GetClassInfosRequest as _exa_language_server_pb_GetClassInfosRequest, GetClassInfosRequest__Output as _exa_language_server_pb_GetClassInfosRequest__Output } from './exa/language_server_pb/GetClassInfosRequest';
import type { GetClassInfosResponse as _exa_language_server_pb_GetClassInfosResponse, GetClassInfosResponse__Output as _exa_language_server_pb_GetClassInfosResponse__Output } from './exa/language_server_pb/GetClassInfosResponse';
import type { GetCodeMapSuggestionsRequest as _exa_language_server_pb_GetCodeMapSuggestionsRequest, GetCodeMapSuggestionsRequest__Output as _exa_language_server_pb_GetCodeMapSuggestionsRequest__Output } from './exa/language_server_pb/GetCodeMapSuggestionsRequest';
import type { GetCodeMapSuggestionsResponse as _exa_language_server_pb_GetCodeMapSuggestionsResponse, GetCodeMapSuggestionsResponse__Output as _exa_language_server_pb_GetCodeMapSuggestionsResponse__Output } from './exa/language_server_pb/GetCodeMapSuggestionsResponse';
import type { GetCodeMapsForFileRequest as _exa_language_server_pb_GetCodeMapsForFileRequest, GetCodeMapsForFileRequest__Output as _exa_language_server_pb_GetCodeMapsForFileRequest__Output } from './exa/language_server_pb/GetCodeMapsForFileRequest';
import type { GetCodeMapsForFileResponse as _exa_language_server_pb_GetCodeMapsForFileResponse, GetCodeMapsForFileResponse__Output as _exa_language_server_pb_GetCodeMapsForFileResponse__Output } from './exa/language_server_pb/GetCodeMapsForFileResponse';
import type { GetCodeMapsForReposRequest as _exa_language_server_pb_GetCodeMapsForReposRequest, GetCodeMapsForReposRequest__Output as _exa_language_server_pb_GetCodeMapsForReposRequest__Output } from './exa/language_server_pb/GetCodeMapsForReposRequest';
import type { GetCodeMapsForReposResponse as _exa_language_server_pb_GetCodeMapsForReposResponse, GetCodeMapsForReposResponse__Output as _exa_language_server_pb_GetCodeMapsForReposResponse__Output } from './exa/language_server_pb/GetCodeMapsForReposResponse';
import type { GetCodeValidationStatesRequest as _exa_language_server_pb_GetCodeValidationStatesRequest, GetCodeValidationStatesRequest__Output as _exa_language_server_pb_GetCodeValidationStatesRequest__Output } from './exa/language_server_pb/GetCodeValidationStatesRequest';
import type { GetCodeValidationStatesResponse as _exa_language_server_pb_GetCodeValidationStatesResponse, GetCodeValidationStatesResponse__Output as _exa_language_server_pb_GetCodeValidationStatesResponse__Output } from './exa/language_server_pb/GetCodeValidationStatesResponse';
import type { GetCommandModelConfigsRequest as _exa_language_server_pb_GetCommandModelConfigsRequest, GetCommandModelConfigsRequest__Output as _exa_language_server_pb_GetCommandModelConfigsRequest__Output } from './exa/language_server_pb/GetCommandModelConfigsRequest';
import type { GetCommandModelConfigsResponse as _exa_language_server_pb_GetCommandModelConfigsResponse, GetCommandModelConfigsResponse__Output as _exa_language_server_pb_GetCommandModelConfigsResponse__Output } from './exa/language_server_pb/GetCommandModelConfigsResponse';
import type { GetCompletionsRequest as _exa_language_server_pb_GetCompletionsRequest, GetCompletionsRequest__Output as _exa_language_server_pb_GetCompletionsRequest__Output } from './exa/language_server_pb/GetCompletionsRequest';
import type { GetCompletionsResponse as _exa_language_server_pb_GetCompletionsResponse, GetCompletionsResponse__Output as _exa_language_server_pb_GetCompletionsResponse__Output } from './exa/language_server_pb/GetCompletionsResponse';
import type { GetConversationTagsRequest as _exa_language_server_pb_GetConversationTagsRequest, GetConversationTagsRequest__Output as _exa_language_server_pb_GetConversationTagsRequest__Output } from './exa/language_server_pb/GetConversationTagsRequest';
import type { GetConversationTagsResponse as _exa_language_server_pb_GetConversationTagsResponse, GetConversationTagsResponse__Output as _exa_language_server_pb_GetConversationTagsResponse__Output } from './exa/language_server_pb/GetConversationTagsResponse';
import type { GetDebugDiagnosticsRequest as _exa_language_server_pb_GetDebugDiagnosticsRequest, GetDebugDiagnosticsRequest__Output as _exa_language_server_pb_GetDebugDiagnosticsRequest__Output } from './exa/language_server_pb/GetDebugDiagnosticsRequest';
import type { GetDebugDiagnosticsResponse as _exa_language_server_pb_GetDebugDiagnosticsResponse, GetDebugDiagnosticsResponse__Output as _exa_language_server_pb_GetDebugDiagnosticsResponse__Output } from './exa/language_server_pb/GetDebugDiagnosticsResponse';
import type { GetDeepWikiResponse as _exa_language_server_pb_GetDeepWikiResponse, GetDeepWikiResponse__Output as _exa_language_server_pb_GetDeepWikiResponse__Output } from './exa/language_server_pb/GetDeepWikiResponse';
import type { GetDefaultWebOriginsRequest as _exa_language_server_pb_GetDefaultWebOriginsRequest, GetDefaultWebOriginsRequest__Output as _exa_language_server_pb_GetDefaultWebOriginsRequest__Output } from './exa/language_server_pb/GetDefaultWebOriginsRequest';
import type { GetDefaultWebOriginsResponse as _exa_language_server_pb_GetDefaultWebOriginsResponse, GetDefaultWebOriginsResponse__Output as _exa_language_server_pb_GetDefaultWebOriginsResponse__Output } from './exa/language_server_pb/GetDefaultWebOriginsResponse';
import type { GetExternalModelRequest as _exa_language_server_pb_GetExternalModelRequest, GetExternalModelRequest__Output as _exa_language_server_pb_GetExternalModelRequest__Output } from './exa/language_server_pb/GetExternalModelRequest';
import type { GetExternalModelResponse as _exa_language_server_pb_GetExternalModelResponse, GetExternalModelResponse__Output as _exa_language_server_pb_GetExternalModelResponse__Output } from './exa/language_server_pb/GetExternalModelResponse';
import type { GetFunctionsRequest as _exa_language_server_pb_GetFunctionsRequest, GetFunctionsRequest__Output as _exa_language_server_pb_GetFunctionsRequest__Output } from './exa/language_server_pb/GetFunctionsRequest';
import type { GetFunctionsResponse as _exa_language_server_pb_GetFunctionsResponse, GetFunctionsResponse__Output as _exa_language_server_pb_GetFunctionsResponse__Output } from './exa/language_server_pb/GetFunctionsResponse';
import type { GetGithubPullRequestSearchInfoRequest as _exa_language_server_pb_GetGithubPullRequestSearchInfoRequest, GetGithubPullRequestSearchInfoRequest__Output as _exa_language_server_pb_GetGithubPullRequestSearchInfoRequest__Output } from './exa/language_server_pb/GetGithubPullRequestSearchInfoRequest';
import type { GetGithubPullRequestSearchInfoResponse as _exa_language_server_pb_GetGithubPullRequestSearchInfoResponse, GetGithubPullRequestSearchInfoResponse__Output as _exa_language_server_pb_GetGithubPullRequestSearchInfoResponse__Output } from './exa/language_server_pb/GetGithubPullRequestSearchInfoResponse';
import type { GetKnowledgeBaseItemsForTeamRequest as _exa_language_server_pb_GetKnowledgeBaseItemsForTeamRequest, GetKnowledgeBaseItemsForTeamRequest__Output as _exa_language_server_pb_GetKnowledgeBaseItemsForTeamRequest__Output } from './exa/language_server_pb/GetKnowledgeBaseItemsForTeamRequest';
import type { GetKnowledgeBaseItemsForTeamResponse as _exa_language_server_pb_GetKnowledgeBaseItemsForTeamResponse, GetKnowledgeBaseItemsForTeamResponse__Output as _exa_language_server_pb_GetKnowledgeBaseItemsForTeamResponse__Output } from './exa/language_server_pb/GetKnowledgeBaseItemsForTeamResponse';
import type { GetLifeguardConfigRequest as _exa_language_server_pb_GetLifeguardConfigRequest, GetLifeguardConfigRequest__Output as _exa_language_server_pb_GetLifeguardConfigRequest__Output } from './exa/language_server_pb/GetLifeguardConfigRequest';
import type { GetLifeguardConfigResponse as _exa_language_server_pb_GetLifeguardConfigResponse, GetLifeguardConfigResponse__Output as _exa_language_server_pb_GetLifeguardConfigResponse__Output } from './exa/language_server_pb/GetLifeguardConfigResponse';
import type { GetMatchingCodeContextRequest as _exa_language_server_pb_GetMatchingCodeContextRequest, GetMatchingCodeContextRequest__Output as _exa_language_server_pb_GetMatchingCodeContextRequest__Output } from './exa/language_server_pb/GetMatchingCodeContextRequest';
import type { GetMatchingCodeContextResponse as _exa_language_server_pb_GetMatchingCodeContextResponse, GetMatchingCodeContextResponse__Output as _exa_language_server_pb_GetMatchingCodeContextResponse__Output } from './exa/language_server_pb/GetMatchingCodeContextResponse';
import type { GetMatchingContextScopeItemsRequest as _exa_language_server_pb_GetMatchingContextScopeItemsRequest, GetMatchingContextScopeItemsRequest__Output as _exa_language_server_pb_GetMatchingContextScopeItemsRequest__Output } from './exa/language_server_pb/GetMatchingContextScopeItemsRequest';
import type { GetMatchingContextScopeItemsResponse as _exa_language_server_pb_GetMatchingContextScopeItemsResponse, GetMatchingContextScopeItemsResponse__Output as _exa_language_server_pb_GetMatchingContextScopeItemsResponse__Output } from './exa/language_server_pb/GetMatchingContextScopeItemsResponse';
import type { GetMatchingIndexedReposRequest as _exa_language_server_pb_GetMatchingIndexedReposRequest, GetMatchingIndexedReposRequest__Output as _exa_language_server_pb_GetMatchingIndexedReposRequest__Output } from './exa/language_server_pb/GetMatchingIndexedReposRequest';
import type { GetMatchingIndexedReposResponse as _exa_language_server_pb_GetMatchingIndexedReposResponse, GetMatchingIndexedReposResponse__Output as _exa_language_server_pb_GetMatchingIndexedReposResponse__Output } from './exa/language_server_pb/GetMatchingIndexedReposResponse';
import type { GetMcpPromptRequest as _exa_language_server_pb_GetMcpPromptRequest, GetMcpPromptRequest__Output as _exa_language_server_pb_GetMcpPromptRequest__Output } from './exa/language_server_pb/GetMcpPromptRequest';
import type { GetMcpPromptResponse as _exa_language_server_pb_GetMcpPromptResponse, GetMcpPromptResponse__Output as _exa_language_server_pb_GetMcpPromptResponse__Output } from './exa/language_server_pb/GetMcpPromptResponse';
import type { GetMcpServerStatesRequest as _exa_language_server_pb_GetMcpServerStatesRequest, GetMcpServerStatesRequest__Output as _exa_language_server_pb_GetMcpServerStatesRequest__Output } from './exa/language_server_pb/GetMcpServerStatesRequest';
import type { GetMcpServerStatesResponse as _exa_language_server_pb_GetMcpServerStatesResponse, GetMcpServerStatesResponse__Output as _exa_language_server_pb_GetMcpServerStatesResponse__Output } from './exa/language_server_pb/GetMcpServerStatesResponse';
import type { GetMessageTokenCountRequest as _exa_language_server_pb_GetMessageTokenCountRequest, GetMessageTokenCountRequest__Output as _exa_language_server_pb_GetMessageTokenCountRequest__Output } from './exa/language_server_pb/GetMessageTokenCountRequest';
import type { GetMessageTokenCountResponse as _exa_language_server_pb_GetMessageTokenCountResponse, GetMessageTokenCountResponse__Output as _exa_language_server_pb_GetMessageTokenCountResponse__Output } from './exa/language_server_pb/GetMessageTokenCountResponse';
import type { GetModelStatusesRequest as _exa_language_server_pb_GetModelStatusesRequest, GetModelStatusesRequest__Output as _exa_language_server_pb_GetModelStatusesRequest__Output } from './exa/language_server_pb/GetModelStatusesRequest';
import type { GetModelStatusesResponse as _exa_language_server_pb_GetModelStatusesResponse, GetModelStatusesResponse__Output as _exa_language_server_pb_GetModelStatusesResponse__Output } from './exa/language_server_pb/GetModelStatusesResponse';
import type { GetPatchAndCodeChangeRequest as _exa_language_server_pb_GetPatchAndCodeChangeRequest, GetPatchAndCodeChangeRequest__Output as _exa_language_server_pb_GetPatchAndCodeChangeRequest__Output } from './exa/language_server_pb/GetPatchAndCodeChangeRequest';
import type { GetPatchAndCodeChangeResponse as _exa_language_server_pb_GetPatchAndCodeChangeResponse, GetPatchAndCodeChangeResponse__Output as _exa_language_server_pb_GetPatchAndCodeChangeResponse__Output } from './exa/language_server_pb/GetPatchAndCodeChangeResponse';
import type { GetPrimaryApiKeyForDevsOnlyRequest as _exa_language_server_pb_GetPrimaryApiKeyForDevsOnlyRequest, GetPrimaryApiKeyForDevsOnlyRequest__Output as _exa_language_server_pb_GetPrimaryApiKeyForDevsOnlyRequest__Output } from './exa/language_server_pb/GetPrimaryApiKeyForDevsOnlyRequest';
import type { GetPrimaryApiKeyForDevsOnlyResponse as _exa_language_server_pb_GetPrimaryApiKeyForDevsOnlyResponse, GetPrimaryApiKeyForDevsOnlyResponse__Output as _exa_language_server_pb_GetPrimaryApiKeyForDevsOnlyResponse__Output } from './exa/language_server_pb/GetPrimaryApiKeyForDevsOnlyResponse';
import type { GetProcessesRequest as _exa_language_server_pb_GetProcessesRequest, GetProcessesRequest__Output as _exa_language_server_pb_GetProcessesRequest__Output } from './exa/language_server_pb/GetProcessesRequest';
import type { GetProcessesResponse as _exa_language_server_pb_GetProcessesResponse, GetProcessesResponse__Output as _exa_language_server_pb_GetProcessesResponse__Output } from './exa/language_server_pb/GetProcessesResponse';
import type { GetProfileDataRequest as _exa_language_server_pb_GetProfileDataRequest, GetProfileDataRequest__Output as _exa_language_server_pb_GetProfileDataRequest__Output } from './exa/language_server_pb/GetProfileDataRequest';
import type { GetProfileDataResponse as _exa_language_server_pb_GetProfileDataResponse, GetProfileDataResponse__Output as _exa_language_server_pb_GetProfileDataResponse__Output } from './exa/language_server_pb/GetProfileDataResponse';
import type { GetRepoInfosRequest as _exa_language_server_pb_GetRepoInfosRequest, GetRepoInfosRequest__Output as _exa_language_server_pb_GetRepoInfosRequest__Output } from './exa/language_server_pb/GetRepoInfosRequest';
import type { GetRepoInfosResponse as _exa_language_server_pb_GetRepoInfosResponse, GetRepoInfosResponse__Output as _exa_language_server_pb_GetRepoInfosResponse__Output } from './exa/language_server_pb/GetRepoInfosResponse';
import type { GetRevertPreviewRequest as _exa_language_server_pb_GetRevertPreviewRequest, GetRevertPreviewRequest__Output as _exa_language_server_pb_GetRevertPreviewRequest__Output } from './exa/language_server_pb/GetRevertPreviewRequest';
import type { GetRevertPreviewResponse as _exa_language_server_pb_GetRevertPreviewResponse, GetRevertPreviewResponse__Output as _exa_language_server_pb_GetRevertPreviewResponse__Output } from './exa/language_server_pb/GetRevertPreviewResponse';
import type { GetSharedCodeMapRequest as _exa_language_server_pb_GetSharedCodeMapRequest, GetSharedCodeMapRequest__Output as _exa_language_server_pb_GetSharedCodeMapRequest__Output } from './exa/language_server_pb/GetSharedCodeMapRequest';
import type { GetSharedCodeMapResponse as _exa_language_server_pb_GetSharedCodeMapResponse, GetSharedCodeMapResponse__Output as _exa_language_server_pb_GetSharedCodeMapResponse__Output } from './exa/language_server_pb/GetSharedCodeMapResponse';
import type { GetStatusRequest as _exa_language_server_pb_GetStatusRequest, GetStatusRequest__Output as _exa_language_server_pb_GetStatusRequest__Output } from './exa/language_server_pb/GetStatusRequest';
import type { GetStatusResponse as _exa_language_server_pb_GetStatusResponse, GetStatusResponse__Output as _exa_language_server_pb_GetStatusResponse__Output } from './exa/language_server_pb/GetStatusResponse';
import type { GetSuggestedContextScopeItemsRequest as _exa_language_server_pb_GetSuggestedContextScopeItemsRequest, GetSuggestedContextScopeItemsRequest__Output as _exa_language_server_pb_GetSuggestedContextScopeItemsRequest__Output } from './exa/language_server_pb/GetSuggestedContextScopeItemsRequest';
import type { GetSuggestedContextScopeItemsResponse as _exa_language_server_pb_GetSuggestedContextScopeItemsResponse, GetSuggestedContextScopeItemsResponse__Output as _exa_language_server_pb_GetSuggestedContextScopeItemsResponse__Output } from './exa/language_server_pb/GetSuggestedContextScopeItemsResponse';
import type { GetSystemPromptAndToolsRequest as _exa_language_server_pb_GetSystemPromptAndToolsRequest, GetSystemPromptAndToolsRequest__Output as _exa_language_server_pb_GetSystemPromptAndToolsRequest__Output } from './exa/language_server_pb/GetSystemPromptAndToolsRequest';
import type { GetSystemPromptAndToolsResponse as _exa_language_server_pb_GetSystemPromptAndToolsResponse, GetSystemPromptAndToolsResponse__Output as _exa_language_server_pb_GetSystemPromptAndToolsResponse__Output } from './exa/language_server_pb/GetSystemPromptAndToolsResponse';
import type { GetTeamOrganizationalControlsRequest as _exa_language_server_pb_GetTeamOrganizationalControlsRequest, GetTeamOrganizationalControlsRequest__Output as _exa_language_server_pb_GetTeamOrganizationalControlsRequest__Output } from './exa/language_server_pb/GetTeamOrganizationalControlsRequest';
import type { GetTeamOrganizationalControlsResponse as _exa_language_server_pb_GetTeamOrganizationalControlsResponse, GetTeamOrganizationalControlsResponse__Output as _exa_language_server_pb_GetTeamOrganizationalControlsResponse__Output } from './exa/language_server_pb/GetTeamOrganizationalControlsResponse';
import type { GetTranscriptionRequest as _exa_language_server_pb_GetTranscriptionRequest, GetTranscriptionRequest__Output as _exa_language_server_pb_GetTranscriptionRequest__Output } from './exa/language_server_pb/GetTranscriptionRequest';
import type { GetTranscriptionResponse as _exa_language_server_pb_GetTranscriptionResponse, GetTranscriptionResponse__Output as _exa_language_server_pb_GetTranscriptionResponse__Output } from './exa/language_server_pb/GetTranscriptionResponse';
import type { GetUnleashDataRequest as _exa_language_server_pb_GetUnleashDataRequest, GetUnleashDataRequest__Output as _exa_language_server_pb_GetUnleashDataRequest__Output } from './exa/language_server_pb/GetUnleashDataRequest';
import type { GetUnleashDataResponse as _exa_language_server_pb_GetUnleashDataResponse, GetUnleashDataResponse__Output as _exa_language_server_pb_GetUnleashDataResponse__Output } from './exa/language_server_pb/GetUnleashDataResponse';
import type { GetUserAnalyticsSummaryRequest as _exa_language_server_pb_GetUserAnalyticsSummaryRequest, GetUserAnalyticsSummaryRequest__Output as _exa_language_server_pb_GetUserAnalyticsSummaryRequest__Output } from './exa/language_server_pb/GetUserAnalyticsSummaryRequest';
import type { GetUserAnalyticsSummaryResponse as _exa_language_server_pb_GetUserAnalyticsSummaryResponse, GetUserAnalyticsSummaryResponse__Output as _exa_language_server_pb_GetUserAnalyticsSummaryResponse__Output } from './exa/language_server_pb/GetUserAnalyticsSummaryResponse';
import type { GetUserMemoriesRequest as _exa_language_server_pb_GetUserMemoriesRequest, GetUserMemoriesRequest__Output as _exa_language_server_pb_GetUserMemoriesRequest__Output } from './exa/language_server_pb/GetUserMemoriesRequest';
import type { GetUserMemoriesResponse as _exa_language_server_pb_GetUserMemoriesResponse, GetUserMemoriesResponse__Output as _exa_language_server_pb_GetUserMemoriesResponse__Output } from './exa/language_server_pb/GetUserMemoriesResponse';
import type { GetUserSettingsRequest as _exa_language_server_pb_GetUserSettingsRequest, GetUserSettingsRequest__Output as _exa_language_server_pb_GetUserSettingsRequest__Output } from './exa/language_server_pb/GetUserSettingsRequest';
import type { GetUserSettingsResponse as _exa_language_server_pb_GetUserSettingsResponse, GetUserSettingsResponse__Output as _exa_language_server_pb_GetUserSettingsResponse__Output } from './exa/language_server_pb/GetUserSettingsResponse';
import type { GetUserStatusRequest as _exa_language_server_pb_GetUserStatusRequest, GetUserStatusRequest__Output as _exa_language_server_pb_GetUserStatusRequest__Output } from './exa/language_server_pb/GetUserStatusRequest';
import type { GetUserStatusResponse as _exa_language_server_pb_GetUserStatusResponse, GetUserStatusResponse__Output as _exa_language_server_pb_GetUserStatusResponse__Output } from './exa/language_server_pb/GetUserStatusResponse';
import type { GetUserTrajectoryDebugRequest as _exa_language_server_pb_GetUserTrajectoryDebugRequest, GetUserTrajectoryDebugRequest__Output as _exa_language_server_pb_GetUserTrajectoryDebugRequest__Output } from './exa/language_server_pb/GetUserTrajectoryDebugRequest';
import type { GetUserTrajectoryDebugResponse as _exa_language_server_pb_GetUserTrajectoryDebugResponse, GetUserTrajectoryDebugResponse__Output as _exa_language_server_pb_GetUserTrajectoryDebugResponse__Output } from './exa/language_server_pb/GetUserTrajectoryDebugResponse';
import type { GetUserTrajectoryDescriptionsRequest as _exa_language_server_pb_GetUserTrajectoryDescriptionsRequest, GetUserTrajectoryDescriptionsRequest__Output as _exa_language_server_pb_GetUserTrajectoryDescriptionsRequest__Output } from './exa/language_server_pb/GetUserTrajectoryDescriptionsRequest';
import type { GetUserTrajectoryDescriptionsResponse as _exa_language_server_pb_GetUserTrajectoryDescriptionsResponse, GetUserTrajectoryDescriptionsResponse__Output as _exa_language_server_pb_GetUserTrajectoryDescriptionsResponse__Output } from './exa/language_server_pb/GetUserTrajectoryDescriptionsResponse';
import type { GetUserTrajectoryRequest as _exa_language_server_pb_GetUserTrajectoryRequest, GetUserTrajectoryRequest__Output as _exa_language_server_pb_GetUserTrajectoryRequest__Output } from './exa/language_server_pb/GetUserTrajectoryRequest';
import type { GetUserTrajectoryResponse as _exa_language_server_pb_GetUserTrajectoryResponse, GetUserTrajectoryResponse__Output as _exa_language_server_pb_GetUserTrajectoryResponse__Output } from './exa/language_server_pb/GetUserTrajectoryResponse';
import type { GetWebDocsOptionsRequest as _exa_language_server_pb_GetWebDocsOptionsRequest, GetWebDocsOptionsRequest__Output as _exa_language_server_pb_GetWebDocsOptionsRequest__Output } from './exa/language_server_pb/GetWebDocsOptionsRequest';
import type { GetWebDocsOptionsResponse as _exa_language_server_pb_GetWebDocsOptionsResponse, GetWebDocsOptionsResponse__Output as _exa_language_server_pb_GetWebDocsOptionsResponse__Output } from './exa/language_server_pb/GetWebDocsOptionsResponse';
import type { GetWindsurfJSAppDeploymentRequest as _exa_language_server_pb_GetWindsurfJSAppDeploymentRequest, GetWindsurfJSAppDeploymentRequest__Output as _exa_language_server_pb_GetWindsurfJSAppDeploymentRequest__Output } from './exa/language_server_pb/GetWindsurfJSAppDeploymentRequest';
import type { GetWindsurfJSAppDeploymentResponse as _exa_language_server_pb_GetWindsurfJSAppDeploymentResponse, GetWindsurfJSAppDeploymentResponse__Output as _exa_language_server_pb_GetWindsurfJSAppDeploymentResponse__Output } from './exa/language_server_pb/GetWindsurfJSAppDeploymentResponse';
import type { GetWorkspaceEditStateRequest as _exa_language_server_pb_GetWorkspaceEditStateRequest, GetWorkspaceEditStateRequest__Output as _exa_language_server_pb_GetWorkspaceEditStateRequest__Output } from './exa/language_server_pb/GetWorkspaceEditStateRequest';
import type { GetWorkspaceEditStateResponse as _exa_language_server_pb_GetWorkspaceEditStateResponse, GetWorkspaceEditStateResponse__Output as _exa_language_server_pb_GetWorkspaceEditStateResponse__Output } from './exa/language_server_pb/GetWorkspaceEditStateResponse';
import type { GetWorkspaceInfosRequest as _exa_language_server_pb_GetWorkspaceInfosRequest, GetWorkspaceInfosRequest__Output as _exa_language_server_pb_GetWorkspaceInfosRequest__Output } from './exa/language_server_pb/GetWorkspaceInfosRequest';
import type { GetWorkspaceInfosResponse as _exa_language_server_pb_GetWorkspaceInfosResponse, GetWorkspaceInfosResponse__Output as _exa_language_server_pb_GetWorkspaceInfosResponse__Output } from './exa/language_server_pb/GetWorkspaceInfosResponse';
import type { HandleCascadeUserInteractionRequest as _exa_language_server_pb_HandleCascadeUserInteractionRequest, HandleCascadeUserInteractionRequest__Output as _exa_language_server_pb_HandleCascadeUserInteractionRequest__Output } from './exa/language_server_pb/HandleCascadeUserInteractionRequest';
import type { HandleCascadeUserInteractionResponse as _exa_language_server_pb_HandleCascadeUserInteractionResponse, HandleCascadeUserInteractionResponse__Output as _exa_language_server_pb_HandleCascadeUserInteractionResponse__Output } from './exa/language_server_pb/HandleCascadeUserInteractionResponse';
import type { HandleStreamingCommandRequest as _exa_language_server_pb_HandleStreamingCommandRequest, HandleStreamingCommandRequest__Output as _exa_language_server_pb_HandleStreamingCommandRequest__Output } from './exa/language_server_pb/HandleStreamingCommandRequest';
import type { HandleStreamingCommandResponse as _exa_language_server_pb_HandleStreamingCommandResponse, HandleStreamingCommandResponse__Output as _exa_language_server_pb_HandleStreamingCommandResponse__Output } from './exa/language_server_pb/HandleStreamingCommandResponse';
import type { HandleStreamingTabRequest as _exa_language_server_pb_HandleStreamingTabRequest, HandleStreamingTabRequest__Output as _exa_language_server_pb_HandleStreamingTabRequest__Output } from './exa/language_server_pb/HandleStreamingTabRequest';
import type { HandleStreamingTabResponse as _exa_language_server_pb_HandleStreamingTabResponse, HandleStreamingTabResponse__Output as _exa_language_server_pb_HandleStreamingTabResponse__Output } from './exa/language_server_pb/HandleStreamingTabResponse';
import type { HandleStreamingTabV2Request as _exa_language_server_pb_HandleStreamingTabV2Request, HandleStreamingTabV2Request__Output as _exa_language_server_pb_HandleStreamingTabV2Request__Output } from './exa/language_server_pb/HandleStreamingTabV2Request';
import type { HandleStreamingTabV2Response as _exa_language_server_pb_HandleStreamingTabV2Response, HandleStreamingTabV2Response__Output as _exa_language_server_pb_HandleStreamingTabV2Response__Output } from './exa/language_server_pb/HandleStreamingTabV2Response';
import type { HandleStreamingTerminalCommandRequest as _exa_language_server_pb_HandleStreamingTerminalCommandRequest, HandleStreamingTerminalCommandRequest__Output as _exa_language_server_pb_HandleStreamingTerminalCommandRequest__Output } from './exa/language_server_pb/HandleStreamingTerminalCommandRequest';
import type { HandleStreamingTerminalCommandResponse as _exa_language_server_pb_HandleStreamingTerminalCommandResponse, HandleStreamingTerminalCommandResponse__Output as _exa_language_server_pb_HandleStreamingTerminalCommandResponse__Output } from './exa/language_server_pb/HandleStreamingTerminalCommandResponse';
import type { HeartbeatRequest as _exa_language_server_pb_HeartbeatRequest, HeartbeatRequest__Output as _exa_language_server_pb_HeartbeatRequest__Output } from './exa/language_server_pb/HeartbeatRequest';
import type { HeartbeatResponse as _exa_language_server_pb_HeartbeatResponse, HeartbeatResponse__Output as _exa_language_server_pb_HeartbeatResponse__Output } from './exa/language_server_pb/HeartbeatResponse';
import type { ImportFromCursorRequest as _exa_language_server_pb_ImportFromCursorRequest, ImportFromCursorRequest__Output as _exa_language_server_pb_ImportFromCursorRequest__Output } from './exa/language_server_pb/ImportFromCursorRequest';
import type { ImportFromCursorResponse as _exa_language_server_pb_ImportFromCursorResponse, ImportFromCursorResponse__Output as _exa_language_server_pb_ImportFromCursorResponse__Output } from './exa/language_server_pb/ImportFromCursorResponse';
import type { IndexStatus as _exa_language_server_pb_IndexStatus, IndexStatus__Output as _exa_language_server_pb_IndexStatus__Output } from './exa/language_server_pb/IndexStatus';
import type { InitializeCascadePanelStateRequest as _exa_language_server_pb_InitializeCascadePanelStateRequest, InitializeCascadePanelStateRequest__Output as _exa_language_server_pb_InitializeCascadePanelStateRequest__Output } from './exa/language_server_pb/InitializeCascadePanelStateRequest';
import type { InitializeCascadePanelStateResponse as _exa_language_server_pb_InitializeCascadePanelStateResponse, InitializeCascadePanelStateResponse__Output as _exa_language_server_pb_InitializeCascadePanelStateResponse__Output } from './exa/language_server_pb/InitializeCascadePanelStateResponse';
import type { InstallCascadePluginRequest as _exa_language_server_pb_InstallCascadePluginRequest, InstallCascadePluginRequest__Output as _exa_language_server_pb_InstallCascadePluginRequest__Output } from './exa/language_server_pb/InstallCascadePluginRequest';
import type { InstallCascadePluginResponse as _exa_language_server_pb_InstallCascadePluginResponse, InstallCascadePluginResponse__Output as _exa_language_server_pb_InstallCascadePluginResponse__Output } from './exa/language_server_pb/InstallCascadePluginResponse';
import type { InterruptWithQueuedMessageRequest as _exa_language_server_pb_InterruptWithQueuedMessageRequest, InterruptWithQueuedMessageRequest__Output as _exa_language_server_pb_InterruptWithQueuedMessageRequest__Output } from './exa/language_server_pb/InterruptWithQueuedMessageRequest';
import type { InterruptWithQueuedMessageResponse as _exa_language_server_pb_InterruptWithQueuedMessageResponse, InterruptWithQueuedMessageResponse__Output as _exa_language_server_pb_InterruptWithQueuedMessageResponse__Output } from './exa/language_server_pb/InterruptWithQueuedMessageResponse';
import type { LanguageServerServiceClient as _exa_language_server_pb_LanguageServerServiceClient, LanguageServerServiceDefinition as _exa_language_server_pb_LanguageServerServiceDefinition } from './exa/language_server_pb/LanguageServerService';
import type { LatencyInfo as _exa_language_server_pb_LatencyInfo, LatencyInfo__Output as _exa_language_server_pb_LatencyInfo__Output } from './exa/language_server_pb/LatencyInfo';
import type { LocalIndexStatus as _exa_language_server_pb_LocalIndexStatus, LocalIndexStatus__Output as _exa_language_server_pb_LocalIndexStatus__Output } from './exa/language_server_pb/LocalIndexStatus';
import type { LogCascadeSessionRequest as _exa_language_server_pb_LogCascadeSessionRequest, LogCascadeSessionRequest__Output as _exa_language_server_pb_LogCascadeSessionRequest__Output } from './exa/language_server_pb/LogCascadeSessionRequest';
import type { LogCascadeSessionResponse as _exa_language_server_pb_LogCascadeSessionResponse, LogCascadeSessionResponse__Output as _exa_language_server_pb_LogCascadeSessionResponse__Output } from './exa/language_server_pb/LogCascadeSessionResponse';
import type { McpPromptMessage as _exa_language_server_pb_McpPromptMessage, McpPromptMessage__Output as _exa_language_server_pb_McpPromptMessage__Output } from './exa/language_server_pb/McpPromptMessage';
import type { McpPromptMessageContent as _exa_language_server_pb_McpPromptMessageContent, McpPromptMessageContent__Output as _exa_language_server_pb_McpPromptMessageContent__Output } from './exa/language_server_pb/McpPromptMessageContent';
import type { MigrateApiKeyRequest as _exa_language_server_pb_MigrateApiKeyRequest, MigrateApiKeyRequest__Output as _exa_language_server_pb_MigrateApiKeyRequest__Output } from './exa/language_server_pb/MigrateApiKeyRequest';
import type { MigrateApiKeyResponse as _exa_language_server_pb_MigrateApiKeyResponse, MigrateApiKeyResponse__Output as _exa_language_server_pb_MigrateApiKeyResponse__Output } from './exa/language_server_pb/MigrateApiKeyResponse';
import type { MountCascadeFilesystemRequest as _exa_language_server_pb_MountCascadeFilesystemRequest, MountCascadeFilesystemRequest__Output as _exa_language_server_pb_MountCascadeFilesystemRequest__Output } from './exa/language_server_pb/MountCascadeFilesystemRequest';
import type { MountCascadeFilesystemResponse as _exa_language_server_pb_MountCascadeFilesystemResponse, MountCascadeFilesystemResponse__Output as _exa_language_server_pb_MountCascadeFilesystemResponse__Output } from './exa/language_server_pb/MountCascadeFilesystemResponse';
import type { MoveQueuedMessageRequest as _exa_language_server_pb_MoveQueuedMessageRequest, MoveQueuedMessageRequest__Output as _exa_language_server_pb_MoveQueuedMessageRequest__Output } from './exa/language_server_pb/MoveQueuedMessageRequest';
import type { MoveQueuedMessageResponse as _exa_language_server_pb_MoveQueuedMessageResponse, MoveQueuedMessageResponse__Output as _exa_language_server_pb_MoveQueuedMessageResponse__Output } from './exa/language_server_pb/MoveQueuedMessageResponse';
import type { MultilineConfig as _exa_language_server_pb_MultilineConfig, MultilineConfig__Output as _exa_language_server_pb_MultilineConfig__Output } from './exa/language_server_pb/MultilineConfig';
import type { OnEditRequest as _exa_language_server_pb_OnEditRequest, OnEditRequest__Output as _exa_language_server_pb_OnEditRequest__Output } from './exa/language_server_pb/OnEditRequest';
import type { OnEditResponse as _exa_language_server_pb_OnEditResponse, OnEditResponse__Output as _exa_language_server_pb_OnEditResponse__Output } from './exa/language_server_pb/OnEditResponse';
import type { OnboardingItemState as _exa_language_server_pb_OnboardingItemState, OnboardingItemState__Output as _exa_language_server_pb_OnboardingItemState__Output } from './exa/language_server_pb/OnboardingItemState';
import type { OnboardingState as _exa_language_server_pb_OnboardingState, OnboardingState__Output as _exa_language_server_pb_OnboardingState__Output } from './exa/language_server_pb/OnboardingState';
import type { PlanFileInfo as _exa_language_server_pb_PlanFileInfo, PlanFileInfo__Output as _exa_language_server_pb_PlanFileInfo__Output } from './exa/language_server_pb/PlanFileInfo';
import type { ProgressBar as _exa_language_server_pb_ProgressBar, ProgressBar__Output as _exa_language_server_pb_ProgressBar__Output } from './exa/language_server_pb/ProgressBar';
import type { ProgressBarsRequest as _exa_language_server_pb_ProgressBarsRequest, ProgressBarsRequest__Output as _exa_language_server_pb_ProgressBarsRequest__Output } from './exa/language_server_pb/ProgressBarsRequest';
import type { ProgressBarsResponse as _exa_language_server_pb_ProgressBarsResponse, ProgressBarsResponse__Output as _exa_language_server_pb_ProgressBarsResponse__Output } from './exa/language_server_pb/ProgressBarsResponse';
import type { ProvideCompletionFeedbackRequest as _exa_language_server_pb_ProvideCompletionFeedbackRequest, ProvideCompletionFeedbackRequest__Output as _exa_language_server_pb_ProvideCompletionFeedbackRequest__Output } from './exa/language_server_pb/ProvideCompletionFeedbackRequest';
import type { ProvideCompletionFeedbackResponse as _exa_language_server_pb_ProvideCompletionFeedbackResponse, ProvideCompletionFeedbackResponse__Output as _exa_language_server_pb_ProvideCompletionFeedbackResponse__Output } from './exa/language_server_pb/ProvideCompletionFeedbackResponse';
import type { QueueCascadeMessageRequest as _exa_language_server_pb_QueueCascadeMessageRequest, QueueCascadeMessageRequest__Output as _exa_language_server_pb_QueueCascadeMessageRequest__Output } from './exa/language_server_pb/QueueCascadeMessageRequest';
import type { QueueCascadeMessageResponse as _exa_language_server_pb_QueueCascadeMessageResponse, QueueCascadeMessageResponse__Output as _exa_language_server_pb_QueueCascadeMessageResponse__Output } from './exa/language_server_pb/QueueCascadeMessageResponse';
import type { RawGetChatMessageResponse as _exa_language_server_pb_RawGetChatMessageResponse, RawGetChatMessageResponse__Output as _exa_language_server_pb_RawGetChatMessageResponse__Output } from './exa/language_server_pb/RawGetChatMessageResponse';
import type { RecordChatFeedbackRequest as _exa_language_server_pb_RecordChatFeedbackRequest, RecordChatFeedbackRequest__Output as _exa_language_server_pb_RecordChatFeedbackRequest__Output } from './exa/language_server_pb/RecordChatFeedbackRequest';
import type { RecordChatFeedbackResponse as _exa_language_server_pb_RecordChatFeedbackResponse, RecordChatFeedbackResponse__Output as _exa_language_server_pb_RecordChatFeedbackResponse__Output } from './exa/language_server_pb/RecordChatFeedbackResponse';
import type { RecordChatPanelSessionRequest as _exa_language_server_pb_RecordChatPanelSessionRequest, RecordChatPanelSessionRequest__Output as _exa_language_server_pb_RecordChatPanelSessionRequest__Output } from './exa/language_server_pb/RecordChatPanelSessionRequest';
import type { RecordChatPanelSessionResponse as _exa_language_server_pb_RecordChatPanelSessionResponse, RecordChatPanelSessionResponse__Output as _exa_language_server_pb_RecordChatPanelSessionResponse__Output } from './exa/language_server_pb/RecordChatPanelSessionResponse';
import type { RecordCommitMessageSaveRequest as _exa_language_server_pb_RecordCommitMessageSaveRequest, RecordCommitMessageSaveRequest__Output as _exa_language_server_pb_RecordCommitMessageSaveRequest__Output } from './exa/language_server_pb/RecordCommitMessageSaveRequest';
import type { RecordCommitMessageSaveResponse as _exa_language_server_pb_RecordCommitMessageSaveResponse, RecordCommitMessageSaveResponse__Output as _exa_language_server_pb_RecordCommitMessageSaveResponse__Output } from './exa/language_server_pb/RecordCommitMessageSaveResponse';
import type { RecordEventRequest as _exa_language_server_pb_RecordEventRequest, RecordEventRequest__Output as _exa_language_server_pb_RecordEventRequest__Output } from './exa/language_server_pb/RecordEventRequest';
import type { RecordEventResponse as _exa_language_server_pb_RecordEventResponse, RecordEventResponse__Output as _exa_language_server_pb_RecordEventResponse__Output } from './exa/language_server_pb/RecordEventResponse';
import type { RecordLintsRequest as _exa_language_server_pb_RecordLintsRequest, RecordLintsRequest__Output as _exa_language_server_pb_RecordLintsRequest__Output } from './exa/language_server_pb/RecordLintsRequest';
import type { RecordLintsResponse as _exa_language_server_pb_RecordLintsResponse, RecordLintsResponse__Output as _exa_language_server_pb_RecordLintsResponse__Output } from './exa/language_server_pb/RecordLintsResponse';
import type { RecordSearchDocOpenRequest as _exa_language_server_pb_RecordSearchDocOpenRequest, RecordSearchDocOpenRequest__Output as _exa_language_server_pb_RecordSearchDocOpenRequest__Output } from './exa/language_server_pb/RecordSearchDocOpenRequest';
import type { RecordSearchDocOpenResponse as _exa_language_server_pb_RecordSearchDocOpenResponse, RecordSearchDocOpenResponse__Output as _exa_language_server_pb_RecordSearchDocOpenResponse__Output } from './exa/language_server_pb/RecordSearchDocOpenResponse';
import type { RecordSearchResultsViewRequest as _exa_language_server_pb_RecordSearchResultsViewRequest, RecordSearchResultsViewRequest__Output as _exa_language_server_pb_RecordSearchResultsViewRequest__Output } from './exa/language_server_pb/RecordSearchResultsViewRequest';
import type { RecordSearchResultsViewResponse as _exa_language_server_pb_RecordSearchResultsViewResponse, RecordSearchResultsViewResponse__Output as _exa_language_server_pb_RecordSearchResultsViewResponse__Output } from './exa/language_server_pb/RecordSearchResultsViewResponse';
import type { RecordSystemMetricsRequest as _exa_language_server_pb_RecordSystemMetricsRequest, RecordSystemMetricsRequest__Output as _exa_language_server_pb_RecordSystemMetricsRequest__Output } from './exa/language_server_pb/RecordSystemMetricsRequest';
import type { RecordSystemMetricsResponse as _exa_language_server_pb_RecordSystemMetricsResponse, RecordSystemMetricsResponse__Output as _exa_language_server_pb_RecordSystemMetricsResponse__Output } from './exa/language_server_pb/RecordSystemMetricsResponse';
import type { RecordUserGrepRequest as _exa_language_server_pb_RecordUserGrepRequest, RecordUserGrepRequest__Output as _exa_language_server_pb_RecordUserGrepRequest__Output } from './exa/language_server_pb/RecordUserGrepRequest';
import type { RecordUserGrepResponse as _exa_language_server_pb_RecordUserGrepResponse, RecordUserGrepResponse__Output as _exa_language_server_pb_RecordUserGrepResponse__Output } from './exa/language_server_pb/RecordUserGrepResponse';
import type { RecordUserStepSnapshotRequest as _exa_language_server_pb_RecordUserStepSnapshotRequest, RecordUserStepSnapshotRequest__Output as _exa_language_server_pb_RecordUserStepSnapshotRequest__Output } from './exa/language_server_pb/RecordUserStepSnapshotRequest';
import type { RecordUserStepSnapshotResponse as _exa_language_server_pb_RecordUserStepSnapshotResponse, RecordUserStepSnapshotResponse__Output as _exa_language_server_pb_RecordUserStepSnapshotResponse__Output } from './exa/language_server_pb/RecordUserStepSnapshotResponse';
import type { RefreshContextForIdeActionRequest as _exa_language_server_pb_RefreshContextForIdeActionRequest, RefreshContextForIdeActionRequest__Output as _exa_language_server_pb_RefreshContextForIdeActionRequest__Output } from './exa/language_server_pb/RefreshContextForIdeActionRequest';
import type { RefreshContextForIdeActionResponse as _exa_language_server_pb_RefreshContextForIdeActionResponse, RefreshContextForIdeActionResponse__Output as _exa_language_server_pb_RefreshContextForIdeActionResponse__Output } from './exa/language_server_pb/RefreshContextForIdeActionResponse';
import type { RefreshCustomizationRequest as _exa_language_server_pb_RefreshCustomizationRequest, RefreshCustomizationRequest__Output as _exa_language_server_pb_RefreshCustomizationRequest__Output } from './exa/language_server_pb/RefreshCustomizationRequest';
import type { RefreshCustomizationResponse as _exa_language_server_pb_RefreshCustomizationResponse, RefreshCustomizationResponse__Output as _exa_language_server_pb_RefreshCustomizationResponse__Output } from './exa/language_server_pb/RefreshCustomizationResponse';
import type { RefreshMcpServersRequest as _exa_language_server_pb_RefreshMcpServersRequest, RefreshMcpServersRequest__Output as _exa_language_server_pb_RefreshMcpServersRequest__Output } from './exa/language_server_pb/RefreshMcpServersRequest';
import type { RefreshMcpServersResponse as _exa_language_server_pb_RefreshMcpServersResponse, RefreshMcpServersResponse__Output as _exa_language_server_pb_RefreshMcpServersResponse__Output } from './exa/language_server_pb/RefreshMcpServersResponse';
import type { RegisterUserRequest as _exa_language_server_pb_RegisterUserRequest, RegisterUserRequest__Output as _exa_language_server_pb_RegisterUserRequest__Output } from './exa/language_server_pb/RegisterUserRequest';
import type { RegisterUserResponse as _exa_language_server_pb_RegisterUserResponse, RegisterUserResponse__Output as _exa_language_server_pb_RegisterUserResponse__Output } from './exa/language_server_pb/RegisterUserResponse';
import type { RemoveFromQueueRequest as _exa_language_server_pb_RemoveFromQueueRequest, RemoveFromQueueRequest__Output as _exa_language_server_pb_RemoveFromQueueRequest__Output } from './exa/language_server_pb/RemoveFromQueueRequest';
import type { RemoveFromQueueResponse as _exa_language_server_pb_RemoveFromQueueResponse, RemoveFromQueueResponse__Output as _exa_language_server_pb_RemoveFromQueueResponse__Output } from './exa/language_server_pb/RemoveFromQueueResponse';
import type { RemoveTrackedWorkspaceRequest as _exa_language_server_pb_RemoveTrackedWorkspaceRequest, RemoveTrackedWorkspaceRequest__Output as _exa_language_server_pb_RemoveTrackedWorkspaceRequest__Output } from './exa/language_server_pb/RemoveTrackedWorkspaceRequest';
import type { RemoveTrackedWorkspaceResponse as _exa_language_server_pb_RemoveTrackedWorkspaceResponse, RemoveTrackedWorkspaceResponse__Output as _exa_language_server_pb_RemoveTrackedWorkspaceResponse__Output } from './exa/language_server_pb/RemoveTrackedWorkspaceResponse';
import type { RenameCascadeTrajectoryRequest as _exa_language_server_pb_RenameCascadeTrajectoryRequest, RenameCascadeTrajectoryRequest__Output as _exa_language_server_pb_RenameCascadeTrajectoryRequest__Output } from './exa/language_server_pb/RenameCascadeTrajectoryRequest';
import type { RenameCascadeTrajectoryResponse as _exa_language_server_pb_RenameCascadeTrajectoryResponse, RenameCascadeTrajectoryResponse__Output as _exa_language_server_pb_RenameCascadeTrajectoryResponse__Output } from './exa/language_server_pb/RenameCascadeTrajectoryResponse';
import type { ReplayGroundTruthTrajectoryRequest as _exa_language_server_pb_ReplayGroundTruthTrajectoryRequest, ReplayGroundTruthTrajectoryRequest__Output as _exa_language_server_pb_ReplayGroundTruthTrajectoryRequest__Output } from './exa/language_server_pb/ReplayGroundTruthTrajectoryRequest';
import type { ReplayGroundTruthTrajectoryResponse as _exa_language_server_pb_ReplayGroundTruthTrajectoryResponse, ReplayGroundTruthTrajectoryResponse__Output as _exa_language_server_pb_ReplayGroundTruthTrajectoryResponse__Output } from './exa/language_server_pb/ReplayGroundTruthTrajectoryResponse';
import type { RepoInfo as _exa_language_server_pb_RepoInfo, RepoInfo__Output as _exa_language_server_pb_RepoInfo__Output } from './exa/language_server_pb/RepoInfo';
import type { RequestInfo as _exa_language_server_pb_RequestInfo, RequestInfo__Output as _exa_language_server_pb_RequestInfo__Output } from './exa/language_server_pb/RequestInfo';
import type { ResetOnboardingRequest as _exa_language_server_pb_ResetOnboardingRequest, ResetOnboardingRequest__Output as _exa_language_server_pb_ResetOnboardingRequest__Output } from './exa/language_server_pb/ResetOnboardingRequest';
import type { ResetOnboardingResponse as _exa_language_server_pb_ResetOnboardingResponse, ResetOnboardingResponse__Output as _exa_language_server_pb_ResetOnboardingResponse__Output } from './exa/language_server_pb/ResetOnboardingResponse';
import type { ResolveOutstandingStepsRequest as _exa_language_server_pb_ResolveOutstandingStepsRequest, ResolveOutstandingStepsRequest__Output as _exa_language_server_pb_ResolveOutstandingStepsRequest__Output } from './exa/language_server_pb/ResolveOutstandingStepsRequest';
import type { ResolveOutstandingStepsResponse as _exa_language_server_pb_ResolveOutstandingStepsResponse, ResolveOutstandingStepsResponse__Output as _exa_language_server_pb_ResolveOutstandingStepsResponse__Output } from './exa/language_server_pb/ResolveOutstandingStepsResponse';
import type { ResolveWorktreeChangesRequest as _exa_language_server_pb_ResolveWorktreeChangesRequest, ResolveWorktreeChangesRequest__Output as _exa_language_server_pb_ResolveWorktreeChangesRequest__Output } from './exa/language_server_pb/ResolveWorktreeChangesRequest';
import type { ResolveWorktreeChangesResponse as _exa_language_server_pb_ResolveWorktreeChangesResponse, ResolveWorktreeChangesResponse__Output as _exa_language_server_pb_ResolveWorktreeChangesResponse__Output } from './exa/language_server_pb/ResolveWorktreeChangesResponse';
import type { RevertToCascadeStepRequest as _exa_language_server_pb_RevertToCascadeStepRequest, RevertToCascadeStepRequest__Output as _exa_language_server_pb_RevertToCascadeStepRequest__Output } from './exa/language_server_pb/RevertToCascadeStepRequest';
import type { RevertToCascadeStepResponse as _exa_language_server_pb_RevertToCascadeStepResponse, RevertToCascadeStepResponse__Output as _exa_language_server_pb_RevertToCascadeStepResponse__Output } from './exa/language_server_pb/RevertToCascadeStepResponse';
import type { SaveCodeMapFromJsonRequest as _exa_language_server_pb_SaveCodeMapFromJsonRequest, SaveCodeMapFromJsonRequest__Output as _exa_language_server_pb_SaveCodeMapFromJsonRequest__Output } from './exa/language_server_pb/SaveCodeMapFromJsonRequest';
import type { SaveCodeMapFromJsonResponse as _exa_language_server_pb_SaveCodeMapFromJsonResponse, SaveCodeMapFromJsonResponse__Output as _exa_language_server_pb_SaveCodeMapFromJsonResponse__Output } from './exa/language_server_pb/SaveCodeMapFromJsonResponse';
import type { SaveMcpServerToConfigFileRequest as _exa_language_server_pb_SaveMcpServerToConfigFileRequest, SaveMcpServerToConfigFileRequest__Output as _exa_language_server_pb_SaveMcpServerToConfigFileRequest__Output } from './exa/language_server_pb/SaveMcpServerToConfigFileRequest';
import type { SaveMcpServerToConfigFileResponse as _exa_language_server_pb_SaveMcpServerToConfigFileResponse, SaveMcpServerToConfigFileResponse__Output as _exa_language_server_pb_SaveMcpServerToConfigFileResponse__Output } from './exa/language_server_pb/SaveMcpServerToConfigFileResponse';
import type { SaveWindsurfJSAppProjectNameRequest as _exa_language_server_pb_SaveWindsurfJSAppProjectNameRequest, SaveWindsurfJSAppProjectNameRequest__Output as _exa_language_server_pb_SaveWindsurfJSAppProjectNameRequest__Output } from './exa/language_server_pb/SaveWindsurfJSAppProjectNameRequest';
import type { SaveWindsurfJSAppProjectNameResponse as _exa_language_server_pb_SaveWindsurfJSAppProjectNameResponse, SaveWindsurfJSAppProjectNameResponse__Output as _exa_language_server_pb_SaveWindsurfJSAppProjectNameResponse__Output } from './exa/language_server_pb/SaveWindsurfJSAppProjectNameResponse';
import type { SearchResult as _exa_language_server_pb_SearchResult, SearchResult__Output as _exa_language_server_pb_SearchResult__Output } from './exa/language_server_pb/SearchResult';
import type { SearchResultCluster as _exa_language_server_pb_SearchResultCluster, SearchResultCluster__Output as _exa_language_server_pb_SearchResultCluster__Output } from './exa/language_server_pb/SearchResultCluster';
import type { SendActionToChatPanelRequest as _exa_language_server_pb_SendActionToChatPanelRequest, SendActionToChatPanelRequest__Output as _exa_language_server_pb_SendActionToChatPanelRequest__Output } from './exa/language_server_pb/SendActionToChatPanelRequest';
import type { SendActionToChatPanelResponse as _exa_language_server_pb_SendActionToChatPanelResponse, SendActionToChatPanelResponse__Output as _exa_language_server_pb_SendActionToChatPanelResponse__Output } from './exa/language_server_pb/SendActionToChatPanelResponse';
import type { SendUserCascadeMessageRequest as _exa_language_server_pb_SendUserCascadeMessageRequest, SendUserCascadeMessageRequest__Output as _exa_language_server_pb_SendUserCascadeMessageRequest__Output } from './exa/language_server_pb/SendUserCascadeMessageRequest';
import type { SendUserCascadeMessageResponse as _exa_language_server_pb_SendUserCascadeMessageResponse, SendUserCascadeMessageResponse__Output as _exa_language_server_pb_SendUserCascadeMessageResponse__Output } from './exa/language_server_pb/SendUserCascadeMessageResponse';
import type { SetBaseExperimentsRequest as _exa_language_server_pb_SetBaseExperimentsRequest, SetBaseExperimentsRequest__Output as _exa_language_server_pb_SetBaseExperimentsRequest__Output } from './exa/language_server_pb/SetBaseExperimentsRequest';
import type { SetBaseExperimentsResponse as _exa_language_server_pb_SetBaseExperimentsResponse, SetBaseExperimentsResponse__Output as _exa_language_server_pb_SetBaseExperimentsResponse__Output } from './exa/language_server_pb/SetBaseExperimentsResponse';
import type { SetPinnedContextRequest as _exa_language_server_pb_SetPinnedContextRequest, SetPinnedContextRequest__Output as _exa_language_server_pb_SetPinnedContextRequest__Output } from './exa/language_server_pb/SetPinnedContextRequest';
import type { SetPinnedContextResponse as _exa_language_server_pb_SetPinnedContextResponse, SetPinnedContextResponse__Output as _exa_language_server_pb_SetPinnedContextResponse__Output } from './exa/language_server_pb/SetPinnedContextResponse';
import type { SetPinnedGuidelineRequest as _exa_language_server_pb_SetPinnedGuidelineRequest, SetPinnedGuidelineRequest__Output as _exa_language_server_pb_SetPinnedGuidelineRequest__Output } from './exa/language_server_pb/SetPinnedGuidelineRequest';
import type { SetPinnedGuidelineResponse as _exa_language_server_pb_SetPinnedGuidelineResponse, SetPinnedGuidelineResponse__Output as _exa_language_server_pb_SetPinnedGuidelineResponse__Output } from './exa/language_server_pb/SetPinnedGuidelineResponse';
import type { SetUserSettingsRequest as _exa_language_server_pb_SetUserSettingsRequest, SetUserSettingsRequest__Output as _exa_language_server_pb_SetUserSettingsRequest__Output } from './exa/language_server_pb/SetUserSettingsRequest';
import type { SetUserSettingsResponse as _exa_language_server_pb_SetUserSettingsResponse, SetUserSettingsResponse__Output as _exa_language_server_pb_SetUserSettingsResponse__Output } from './exa/language_server_pb/SetUserSettingsResponse';
import type { SetupUniversitySandboxRequest as _exa_language_server_pb_SetupUniversitySandboxRequest, SetupUniversitySandboxRequest__Output as _exa_language_server_pb_SetupUniversitySandboxRequest__Output } from './exa/language_server_pb/SetupUniversitySandboxRequest';
import type { SetupUniversitySandboxResponse as _exa_language_server_pb_SetupUniversitySandboxResponse, SetupUniversitySandboxResponse__Output as _exa_language_server_pb_SetupUniversitySandboxResponse__Output } from './exa/language_server_pb/SetupUniversitySandboxResponse';
import type { ShareCodeMapRequest as _exa_language_server_pb_ShareCodeMapRequest, ShareCodeMapRequest__Output as _exa_language_server_pb_ShareCodeMapRequest__Output } from './exa/language_server_pb/ShareCodeMapRequest';
import type { ShareCodeMapResponse as _exa_language_server_pb_ShareCodeMapResponse, ShareCodeMapResponse__Output as _exa_language_server_pb_ShareCodeMapResponse__Output } from './exa/language_server_pb/ShareCodeMapResponse';
import type { ShouldEnableUnleashRequest as _exa_language_server_pb_ShouldEnableUnleashRequest, ShouldEnableUnleashRequest__Output as _exa_language_server_pb_ShouldEnableUnleashRequest__Output } from './exa/language_server_pb/ShouldEnableUnleashRequest';
import type { ShouldEnableUnleashResponse as _exa_language_server_pb_ShouldEnableUnleashResponse, ShouldEnableUnleashResponse__Output as _exa_language_server_pb_ShouldEnableUnleashResponse__Output } from './exa/language_server_pb/ShouldEnableUnleashResponse';
import type { SkipOnboardingRequest as _exa_language_server_pb_SkipOnboardingRequest, SkipOnboardingRequest__Output as _exa_language_server_pb_SkipOnboardingRequest__Output } from './exa/language_server_pb/SkipOnboardingRequest';
import type { SkipOnboardingResponse as _exa_language_server_pb_SkipOnboardingResponse, SkipOnboardingResponse__Output as _exa_language_server_pb_SkipOnboardingResponse__Output } from './exa/language_server_pb/SkipOnboardingResponse';
import type { SpawnArenaModeMidConversationRequest as _exa_language_server_pb_SpawnArenaModeMidConversationRequest, SpawnArenaModeMidConversationRequest__Output as _exa_language_server_pb_SpawnArenaModeMidConversationRequest__Output } from './exa/language_server_pb/SpawnArenaModeMidConversationRequest';
import type { SpawnArenaModeMidConversationResponse as _exa_language_server_pb_SpawnArenaModeMidConversationResponse, SpawnArenaModeMidConversationResponse__Output as _exa_language_server_pb_SpawnArenaModeMidConversationResponse__Output } from './exa/language_server_pb/SpawnArenaModeMidConversationResponse';
import type { StartCascadeRequest as _exa_language_server_pb_StartCascadeRequest, StartCascadeRequest__Output as _exa_language_server_pb_StartCascadeRequest__Output } from './exa/language_server_pb/StartCascadeRequest';
import type { StartCascadeResponse as _exa_language_server_pb_StartCascadeResponse, StartCascadeResponse__Output as _exa_language_server_pb_StartCascadeResponse__Output } from './exa/language_server_pb/StartCascadeResponse';
import type { StatUriRequest as _exa_language_server_pb_StatUriRequest, StatUriRequest__Output as _exa_language_server_pb_StatUriRequest__Output } from './exa/language_server_pb/StatUriRequest';
import type { StatUriResponse as _exa_language_server_pb_StatUriResponse, StatUriResponse__Output as _exa_language_server_pb_StatUriResponse__Output } from './exa/language_server_pb/StatUriResponse';
import type { State as _exa_language_server_pb_State, State__Output as _exa_language_server_pb_State__Output } from './exa/language_server_pb/State';
import type { StreamTerminalShellCommandResponse as _exa_language_server_pb_StreamTerminalShellCommandResponse, StreamTerminalShellCommandResponse__Output as _exa_language_server_pb_StreamTerminalShellCommandResponse__Output } from './exa/language_server_pb/StreamTerminalShellCommandResponse';
import type { SubmitBugReportRequest as _exa_language_server_pb_SubmitBugReportRequest, SubmitBugReportRequest__Output as _exa_language_server_pb_SubmitBugReportRequest__Output } from './exa/language_server_pb/SubmitBugReportRequest';
import type { SubmitBugReportResponse as _exa_language_server_pb_SubmitBugReportResponse, SubmitBugReportResponse__Output as _exa_language_server_pb_SubmitBugReportResponse__Output } from './exa/language_server_pb/SubmitBugReportResponse';
import type { Suffix as _exa_language_server_pb_Suffix, Suffix__Output as _exa_language_server_pb_Suffix__Output } from './exa/language_server_pb/Suffix';
import type { SyncExploreAgentRunRequest as _exa_language_server_pb_SyncExploreAgentRunRequest, SyncExploreAgentRunRequest__Output as _exa_language_server_pb_SyncExploreAgentRunRequest__Output } from './exa/language_server_pb/SyncExploreAgentRunRequest';
import type { SyncExploreAgentRunResponse as _exa_language_server_pb_SyncExploreAgentRunResponse, SyncExploreAgentRunResponse__Output as _exa_language_server_pb_SyncExploreAgentRunResponse__Output } from './exa/language_server_pb/SyncExploreAgentRunResponse';
import type { TabRequestInfo as _exa_language_server_pb_TabRequestInfo, TabRequestInfo__Output as _exa_language_server_pb_TabRequestInfo__Output } from './exa/language_server_pb/TabRequestInfo';
import type { TeamOrganizationalControls as _exa_language_server_pb_TeamOrganizationalControls, TeamOrganizationalControls__Output as _exa_language_server_pb_TeamOrganizationalControls__Output } from './exa/language_server_pb/TeamOrganizationalControls';
import type { TerminalCommandConversationEntry as _exa_language_server_pb_TerminalCommandConversationEntry, TerminalCommandConversationEntry__Output as _exa_language_server_pb_TerminalCommandConversationEntry__Output } from './exa/language_server_pb/TerminalCommandConversationEntry';
import type { ToggleMcpToolRequest as _exa_language_server_pb_ToggleMcpToolRequest, ToggleMcpToolRequest__Output as _exa_language_server_pb_ToggleMcpToolRequest__Output } from './exa/language_server_pb/ToggleMcpToolRequest';
import type { ToggleMcpToolResponse as _exa_language_server_pb_ToggleMcpToolResponse, ToggleMcpToolResponse__Output as _exa_language_server_pb_ToggleMcpToolResponse__Output } from './exa/language_server_pb/ToggleMcpToolResponse';
import type { UnifiedDiff as _exa_language_server_pb_UnifiedDiff, UnifiedDiff__Output as _exa_language_server_pb_UnifiedDiff__Output } from './exa/language_server_pb/UnifiedDiff';
import type { UnifiedDiffChange as _exa_language_server_pb_UnifiedDiffChange, UnifiedDiffChange__Output as _exa_language_server_pb_UnifiedDiffChange__Output } from './exa/language_server_pb/UnifiedDiffChange';
import type { UnmountCascadeFilesystemRequest as _exa_language_server_pb_UnmountCascadeFilesystemRequest, UnmountCascadeFilesystemRequest__Output as _exa_language_server_pb_UnmountCascadeFilesystemRequest__Output } from './exa/language_server_pb/UnmountCascadeFilesystemRequest';
import type { UnmountCascadeFilesystemResponse as _exa_language_server_pb_UnmountCascadeFilesystemResponse, UnmountCascadeFilesystemResponse__Output as _exa_language_server_pb_UnmountCascadeFilesystemResponse__Output } from './exa/language_server_pb/UnmountCascadeFilesystemResponse';
import type { UpdateAutoCascadeGithubCredentialsRequest as _exa_language_server_pb_UpdateAutoCascadeGithubCredentialsRequest, UpdateAutoCascadeGithubCredentialsRequest__Output as _exa_language_server_pb_UpdateAutoCascadeGithubCredentialsRequest__Output } from './exa/language_server_pb/UpdateAutoCascadeGithubCredentialsRequest';
import type { UpdateAutoCascadeGithubCredentialsResponse as _exa_language_server_pb_UpdateAutoCascadeGithubCredentialsResponse, UpdateAutoCascadeGithubCredentialsResponse__Output as _exa_language_server_pb_UpdateAutoCascadeGithubCredentialsResponse__Output } from './exa/language_server_pb/UpdateAutoCascadeGithubCredentialsResponse';
import type { UpdateCascadeMemoryRequest as _exa_language_server_pb_UpdateCascadeMemoryRequest, UpdateCascadeMemoryRequest__Output as _exa_language_server_pb_UpdateCascadeMemoryRequest__Output } from './exa/language_server_pb/UpdateCascadeMemoryRequest';
import type { UpdateCascadeMemoryResponse as _exa_language_server_pb_UpdateCascadeMemoryResponse, UpdateCascadeMemoryResponse__Output as _exa_language_server_pb_UpdateCascadeMemoryResponse__Output } from './exa/language_server_pb/UpdateCascadeMemoryResponse';
import type { UpdateCodeMapMetadataRequest as _exa_language_server_pb_UpdateCodeMapMetadataRequest, UpdateCodeMapMetadataRequest__Output as _exa_language_server_pb_UpdateCodeMapMetadataRequest__Output } from './exa/language_server_pb/UpdateCodeMapMetadataRequest';
import type { UpdateCodeMapMetadataResponse as _exa_language_server_pb_UpdateCodeMapMetadataResponse, UpdateCodeMapMetadataResponse__Output as _exa_language_server_pb_UpdateCodeMapMetadataResponse__Output } from './exa/language_server_pb/UpdateCodeMapMetadataResponse';
import type { UpdateConversationTagsRequest as _exa_language_server_pb_UpdateConversationTagsRequest, UpdateConversationTagsRequest__Output as _exa_language_server_pb_UpdateConversationTagsRequest__Output } from './exa/language_server_pb/UpdateConversationTagsRequest';
import type { UpdateConversationTagsResponse as _exa_language_server_pb_UpdateConversationTagsResponse, UpdateConversationTagsResponse__Output as _exa_language_server_pb_UpdateConversationTagsResponse__Output } from './exa/language_server_pb/UpdateConversationTagsResponse';
import type { UpdateDevExperimentsRequest as _exa_language_server_pb_UpdateDevExperimentsRequest, UpdateDevExperimentsRequest__Output as _exa_language_server_pb_UpdateDevExperimentsRequest__Output } from './exa/language_server_pb/UpdateDevExperimentsRequest';
import type { UpdateDevExperimentsResponse as _exa_language_server_pb_UpdateDevExperimentsResponse, UpdateDevExperimentsResponse__Output as _exa_language_server_pb_UpdateDevExperimentsResponse__Output } from './exa/language_server_pb/UpdateDevExperimentsResponse';
import type { UpdateEnterpriseExperimentsFromUrlRequest as _exa_language_server_pb_UpdateEnterpriseExperimentsFromUrlRequest, UpdateEnterpriseExperimentsFromUrlRequest__Output as _exa_language_server_pb_UpdateEnterpriseExperimentsFromUrlRequest__Output } from './exa/language_server_pb/UpdateEnterpriseExperimentsFromUrlRequest';
import type { UpdateEnterpriseExperimentsFromUrlResponse as _exa_language_server_pb_UpdateEnterpriseExperimentsFromUrlResponse, UpdateEnterpriseExperimentsFromUrlResponse__Output as _exa_language_server_pb_UpdateEnterpriseExperimentsFromUrlResponse__Output } from './exa/language_server_pb/UpdateEnterpriseExperimentsFromUrlResponse';
import type { UpdateMcpServerInConfigFileRequest as _exa_language_server_pb_UpdateMcpServerInConfigFileRequest, UpdateMcpServerInConfigFileRequest__Output as _exa_language_server_pb_UpdateMcpServerInConfigFileRequest__Output } from './exa/language_server_pb/UpdateMcpServerInConfigFileRequest';
import type { UpdateMcpServerInConfigFileResponse as _exa_language_server_pb_UpdateMcpServerInConfigFileResponse, UpdateMcpServerInConfigFileResponse__Output as _exa_language_server_pb_UpdateMcpServerInConfigFileResponse__Output } from './exa/language_server_pb/UpdateMcpServerInConfigFileResponse';
import type { UpdatePanelStateWithUserStatusRequest as _exa_language_server_pb_UpdatePanelStateWithUserStatusRequest, UpdatePanelStateWithUserStatusRequest__Output as _exa_language_server_pb_UpdatePanelStateWithUserStatusRequest__Output } from './exa/language_server_pb/UpdatePanelStateWithUserStatusRequest';
import type { UpdatePanelStateWithUserStatusResponse as _exa_language_server_pb_UpdatePanelStateWithUserStatusResponse, UpdatePanelStateWithUserStatusResponse__Output as _exa_language_server_pb_UpdatePanelStateWithUserStatusResponse__Output } from './exa/language_server_pb/UpdatePanelStateWithUserStatusResponse';
import type { UpdateWorkspaceTrustRequest as _exa_language_server_pb_UpdateWorkspaceTrustRequest, UpdateWorkspaceTrustRequest__Output as _exa_language_server_pb_UpdateWorkspaceTrustRequest__Output } from './exa/language_server_pb/UpdateWorkspaceTrustRequest';
import type { UpdateWorkspaceTrustResponse as _exa_language_server_pb_UpdateWorkspaceTrustResponse, UpdateWorkspaceTrustResponse__Output as _exa_language_server_pb_UpdateWorkspaceTrustResponse__Output } from './exa/language_server_pb/UpdateWorkspaceTrustResponse';
import type { UploadRecentCommandsRequest as _exa_language_server_pb_UploadRecentCommandsRequest, UploadRecentCommandsRequest__Output as _exa_language_server_pb_UploadRecentCommandsRequest__Output } from './exa/language_server_pb/UploadRecentCommandsRequest';
import type { UploadRecentCommandsResponse as _exa_language_server_pb_UploadRecentCommandsResponse, UploadRecentCommandsResponse__Output as _exa_language_server_pb_UploadRecentCommandsResponse__Output } from './exa/language_server_pb/UploadRecentCommandsResponse';
import type { UserInputWithMetadata as _exa_language_server_pb_UserInputWithMetadata, UserInputWithMetadata__Output as _exa_language_server_pb_UserInputWithMetadata__Output } from './exa/language_server_pb/UserInputWithMetadata';
import type { ValidateWindsurfJSAppProjectNameRequest as _exa_language_server_pb_ValidateWindsurfJSAppProjectNameRequest, ValidateWindsurfJSAppProjectNameRequest__Output as _exa_language_server_pb_ValidateWindsurfJSAppProjectNameRequest__Output } from './exa/language_server_pb/ValidateWindsurfJSAppProjectNameRequest';
import type { ValidateWindsurfJSAppProjectNameResponse as _exa_language_server_pb_ValidateWindsurfJSAppProjectNameResponse, ValidateWindsurfJSAppProjectNameResponse__Output as _exa_language_server_pb_ValidateWindsurfJSAppProjectNameResponse__Output } from './exa/language_server_pb/ValidateWindsurfJSAppProjectNameResponse';
import type { ValidationState as _exa_language_server_pb_ValidationState, ValidationState__Output as _exa_language_server_pb_ValidationState__Output } from './exa/language_server_pb/ValidationState';
import type { VibeAndReplaceData as _exa_language_server_pb_VibeAndReplaceData, VibeAndReplaceData__Output as _exa_language_server_pb_VibeAndReplaceData__Output } from './exa/language_server_pb/VibeAndReplaceData';
import type { VibeAndReplaceFile as _exa_language_server_pb_VibeAndReplaceFile, VibeAndReplaceFile__Output as _exa_language_server_pb_VibeAndReplaceFile__Output } from './exa/language_server_pb/VibeAndReplaceFile';
import type { WellSupportedLanguagesRequest as _exa_language_server_pb_WellSupportedLanguagesRequest, WellSupportedLanguagesRequest__Output as _exa_language_server_pb_WellSupportedLanguagesRequest__Output } from './exa/language_server_pb/WellSupportedLanguagesRequest';
import type { WellSupportedLanguagesResponse as _exa_language_server_pb_WellSupportedLanguagesResponse, WellSupportedLanguagesResponse__Output as _exa_language_server_pb_WellSupportedLanguagesResponse__Output } from './exa/language_server_pb/WellSupportedLanguagesResponse';
import type { WorkspaceEditState as _exa_language_server_pb_WorkspaceEditState, WorkspaceEditState__Output as _exa_language_server_pb_WorkspaceEditState__Output } from './exa/language_server_pb/WorkspaceEditState';
import type { WorkspaceInfo as _exa_language_server_pb_WorkspaceInfo, WorkspaceInfo__Output as _exa_language_server_pb_WorkspaceInfo__Output } from './exa/language_server_pb/WorkspaceInfo';
import type { AddGithubUsersRequest as _exa_opensearch_clients_pb_AddGithubUsersRequest, AddGithubUsersRequest__Output as _exa_opensearch_clients_pb_AddGithubUsersRequest__Output } from './exa/opensearch_clients_pb/AddGithubUsersRequest';
import type { AddGithubUsersResponse as _exa_opensearch_clients_pb_AddGithubUsersResponse, AddGithubUsersResponse__Output as _exa_opensearch_clients_pb_AddGithubUsersResponse__Output } from './exa/opensearch_clients_pb/AddGithubUsersResponse';
import type { AddUsersRequest as _exa_opensearch_clients_pb_AddUsersRequest, AddUsersRequest__Output as _exa_opensearch_clients_pb_AddUsersRequest__Output } from './exa/opensearch_clients_pb/AddUsersRequest';
import type { AddUsersResponse as _exa_opensearch_clients_pb_AddUsersResponse, AddUsersResponse__Output as _exa_opensearch_clients_pb_AddUsersResponse__Output } from './exa/opensearch_clients_pb/AddUsersResponse';
import type { CancelKnowledgeBaseJobsRequest as _exa_opensearch_clients_pb_CancelKnowledgeBaseJobsRequest, CancelKnowledgeBaseJobsRequest__Output as _exa_opensearch_clients_pb_CancelKnowledgeBaseJobsRequest__Output } from './exa/opensearch_clients_pb/CancelKnowledgeBaseJobsRequest';
import type { CancelKnowledgeBaseJobsResponse as _exa_opensearch_clients_pb_CancelKnowledgeBaseJobsResponse, CancelKnowledgeBaseJobsResponse__Output as _exa_opensearch_clients_pb_CancelKnowledgeBaseJobsResponse__Output } from './exa/opensearch_clients_pb/CancelKnowledgeBaseJobsResponse';
import type { CodeIndexServiceClient as _exa_opensearch_clients_pb_CodeIndexServiceClient, CodeIndexServiceDefinition as _exa_opensearch_clients_pb_CodeIndexServiceDefinition } from './exa/opensearch_clients_pb/CodeIndexService';
import type { CommonDocument as _exa_opensearch_clients_pb_CommonDocument, CommonDocument__Output as _exa_opensearch_clients_pb_CommonDocument__Output } from './exa/opensearch_clients_pb/CommonDocument';
import type { CommonDocumentWithScore as _exa_opensearch_clients_pb_CommonDocumentWithScore, CommonDocumentWithScore__Output as _exa_opensearch_clients_pb_CommonDocumentWithScore__Output } from './exa/opensearch_clients_pb/CommonDocumentWithScore';
import type { ConnectKnowledgeBaseAccountRequest as _exa_opensearch_clients_pb_ConnectKnowledgeBaseAccountRequest, ConnectKnowledgeBaseAccountRequest__Output as _exa_opensearch_clients_pb_ConnectKnowledgeBaseAccountRequest__Output } from './exa/opensearch_clients_pb/ConnectKnowledgeBaseAccountRequest';
import type { ConnectKnowledgeBaseAccountResponse as _exa_opensearch_clients_pb_ConnectKnowledgeBaseAccountResponse, ConnectKnowledgeBaseAccountResponse__Output as _exa_opensearch_clients_pb_ConnectKnowledgeBaseAccountResponse__Output } from './exa/opensearch_clients_pb/ConnectKnowledgeBaseAccountResponse';
import type { ConnectorAdditionalParams as _exa_opensearch_clients_pb_ConnectorAdditionalParams, ConnectorAdditionalParams__Output as _exa_opensearch_clients_pb_ConnectorAdditionalParams__Output } from './exa/opensearch_clients_pb/ConnectorAdditionalParams';
import type { ConnectorAdditionalParamsGithub as _exa_opensearch_clients_pb_ConnectorAdditionalParamsGithub, ConnectorAdditionalParamsGithub__Output as _exa_opensearch_clients_pb_ConnectorAdditionalParamsGithub__Output } from './exa/opensearch_clients_pb/ConnectorAdditionalParamsGithub';
import type { ConnectorAdditionalParamsSlack as _exa_opensearch_clients_pb_ConnectorAdditionalParamsSlack, ConnectorAdditionalParamsSlack__Output as _exa_opensearch_clients_pb_ConnectorAdditionalParamsSlack__Output } from './exa/opensearch_clients_pb/ConnectorAdditionalParamsSlack';
import type { ConnectorConfig as _exa_opensearch_clients_pb_ConnectorConfig, ConnectorConfig__Output as _exa_opensearch_clients_pb_ConnectorConfig__Output } from './exa/opensearch_clients_pb/ConnectorConfig';
import type { ConnectorConfigGithub as _exa_opensearch_clients_pb_ConnectorConfigGithub, ConnectorConfigGithub__Output as _exa_opensearch_clients_pb_ConnectorConfigGithub__Output } from './exa/opensearch_clients_pb/ConnectorConfigGithub';
import type { ConnectorConfigGoogleDrive as _exa_opensearch_clients_pb_ConnectorConfigGoogleDrive, ConnectorConfigGoogleDrive__Output as _exa_opensearch_clients_pb_ConnectorConfigGoogleDrive__Output } from './exa/opensearch_clients_pb/ConnectorConfigGoogleDrive';
import type { ConnectorConfigJira as _exa_opensearch_clients_pb_ConnectorConfigJira, ConnectorConfigJira__Output as _exa_opensearch_clients_pb_ConnectorConfigJira__Output } from './exa/opensearch_clients_pb/ConnectorConfigJira';
import type { ConnectorConfigSlack as _exa_opensearch_clients_pb_ConnectorConfigSlack, ConnectorConfigSlack__Output as _exa_opensearch_clients_pb_ConnectorConfigSlack__Output } from './exa/opensearch_clients_pb/ConnectorConfigSlack';
import type { ConnectorInternalConfig as _exa_opensearch_clients_pb_ConnectorInternalConfig, ConnectorInternalConfig__Output as _exa_opensearch_clients_pb_ConnectorInternalConfig__Output } from './exa/opensearch_clients_pb/ConnectorInternalConfig';
import type { ConnectorInternalConfigGithub as _exa_opensearch_clients_pb_ConnectorInternalConfigGithub, ConnectorInternalConfigGithub__Output as _exa_opensearch_clients_pb_ConnectorInternalConfigGithub__Output } from './exa/opensearch_clients_pb/ConnectorInternalConfigGithub';
import type { ConnectorInternalConfigGoogleDrive as _exa_opensearch_clients_pb_ConnectorInternalConfigGoogleDrive, ConnectorInternalConfigGoogleDrive__Output as _exa_opensearch_clients_pb_ConnectorInternalConfigGoogleDrive__Output } from './exa/opensearch_clients_pb/ConnectorInternalConfigGoogleDrive';
import type { ConnectorInternalConfigJira as _exa_opensearch_clients_pb_ConnectorInternalConfigJira, ConnectorInternalConfigJira__Output as _exa_opensearch_clients_pb_ConnectorInternalConfigJira__Output } from './exa/opensearch_clients_pb/ConnectorInternalConfigJira';
import type { ConnectorInternalConfigSlack as _exa_opensearch_clients_pb_ConnectorInternalConfigSlack, ConnectorInternalConfigSlack__Output as _exa_opensearch_clients_pb_ConnectorInternalConfigSlack__Output } from './exa/opensearch_clients_pb/ConnectorInternalConfigSlack';
import type { ConnectorState as _exa_opensearch_clients_pb_ConnectorState, ConnectorState__Output as _exa_opensearch_clients_pb_ConnectorState__Output } from './exa/opensearch_clients_pb/ConnectorState';
import type { DeleteKnowledgeBaseConnectionRequest as _exa_opensearch_clients_pb_DeleteKnowledgeBaseConnectionRequest, DeleteKnowledgeBaseConnectionRequest__Output as _exa_opensearch_clients_pb_DeleteKnowledgeBaseConnectionRequest__Output } from './exa/opensearch_clients_pb/DeleteKnowledgeBaseConnectionRequest';
import type { DeleteKnowledgeBaseConnectionResponse as _exa_opensearch_clients_pb_DeleteKnowledgeBaseConnectionResponse, DeleteKnowledgeBaseConnectionResponse__Output as _exa_opensearch_clients_pb_DeleteKnowledgeBaseConnectionResponse__Output } from './exa/opensearch_clients_pb/DeleteKnowledgeBaseConnectionResponse';
import type { DocumentTypeCount as _exa_opensearch_clients_pb_DocumentTypeCount, DocumentTypeCount__Output as _exa_opensearch_clients_pb_DocumentTypeCount__Output } from './exa/opensearch_clients_pb/DocumentTypeCount';
import type { ForwardResult as _exa_opensearch_clients_pb_ForwardResult, ForwardResult__Output as _exa_opensearch_clients_pb_ForwardResult__Output } from './exa/opensearch_clients_pb/ForwardResult';
import type { ForwardSlackPayloadRequest as _exa_opensearch_clients_pb_ForwardSlackPayloadRequest, ForwardSlackPayloadRequest__Output as _exa_opensearch_clients_pb_ForwardSlackPayloadRequest__Output } from './exa/opensearch_clients_pb/ForwardSlackPayloadRequest';
import type { ForwardSlackPayloadResponse as _exa_opensearch_clients_pb_ForwardSlackPayloadResponse, ForwardSlackPayloadResponse__Output as _exa_opensearch_clients_pb_ForwardSlackPayloadResponse__Output } from './exa/opensearch_clients_pb/ForwardSlackPayloadResponse';
import type { GetConnectorInternalConfigRequest as _exa_opensearch_clients_pb_GetConnectorInternalConfigRequest, GetConnectorInternalConfigRequest__Output as _exa_opensearch_clients_pb_GetConnectorInternalConfigRequest__Output } from './exa/opensearch_clients_pb/GetConnectorInternalConfigRequest';
import type { GetConnectorInternalConfigResponse as _exa_opensearch_clients_pb_GetConnectorInternalConfigResponse, GetConnectorInternalConfigResponse__Output as _exa_opensearch_clients_pb_GetConnectorInternalConfigResponse__Output } from './exa/opensearch_clients_pb/GetConnectorInternalConfigResponse';
import type { GetKnowledgeBaseConnectorStateRequest as _exa_opensearch_clients_pb_GetKnowledgeBaseConnectorStateRequest, GetKnowledgeBaseConnectorStateRequest__Output as _exa_opensearch_clients_pb_GetKnowledgeBaseConnectorStateRequest__Output } from './exa/opensearch_clients_pb/GetKnowledgeBaseConnectorStateRequest';
import type { GetKnowledgeBaseConnectorStateResponse as _exa_opensearch_clients_pb_GetKnowledgeBaseConnectorStateResponse, GetKnowledgeBaseConnectorStateResponse__Output as _exa_opensearch_clients_pb_GetKnowledgeBaseConnectorStateResponse__Output } from './exa/opensearch_clients_pb/GetKnowledgeBaseConnectorStateResponse';
import type { GetKnowledgeBaseItemsFromScopeItemsRequest as _exa_opensearch_clients_pb_GetKnowledgeBaseItemsFromScopeItemsRequest, GetKnowledgeBaseItemsFromScopeItemsRequest__Output as _exa_opensearch_clients_pb_GetKnowledgeBaseItemsFromScopeItemsRequest__Output } from './exa/opensearch_clients_pb/GetKnowledgeBaseItemsFromScopeItemsRequest';
import type { GetKnowledgeBaseItemsFromScopeItemsResponse as _exa_opensearch_clients_pb_GetKnowledgeBaseItemsFromScopeItemsResponse, GetKnowledgeBaseItemsFromScopeItemsResponse__Output as _exa_opensearch_clients_pb_GetKnowledgeBaseItemsFromScopeItemsResponse__Output } from './exa/opensearch_clients_pb/GetKnowledgeBaseItemsFromScopeItemsResponse';
import type { GetKnowledgeBaseJobStatesRequest as _exa_opensearch_clients_pb_GetKnowledgeBaseJobStatesRequest, GetKnowledgeBaseJobStatesRequest__Output as _exa_opensearch_clients_pb_GetKnowledgeBaseJobStatesRequest__Output } from './exa/opensearch_clients_pb/GetKnowledgeBaseJobStatesRequest';
import type { GetKnowledgeBaseJobStatesResponse as _exa_opensearch_clients_pb_GetKnowledgeBaseJobStatesResponse, GetKnowledgeBaseJobStatesResponse__Output as _exa_opensearch_clients_pb_GetKnowledgeBaseJobStatesResponse__Output } from './exa/opensearch_clients_pb/GetKnowledgeBaseJobStatesResponse';
import type { GetKnowledgeBaseScopeItemsRequest as _exa_opensearch_clients_pb_GetKnowledgeBaseScopeItemsRequest, GetKnowledgeBaseScopeItemsRequest__Output as _exa_opensearch_clients_pb_GetKnowledgeBaseScopeItemsRequest__Output } from './exa/opensearch_clients_pb/GetKnowledgeBaseScopeItemsRequest';
import type { GetKnowledgeBaseScopeItemsResponse as _exa_opensearch_clients_pb_GetKnowledgeBaseScopeItemsResponse, GetKnowledgeBaseScopeItemsResponse__Output as _exa_opensearch_clients_pb_GetKnowledgeBaseScopeItemsResponse__Output } from './exa/opensearch_clients_pb/GetKnowledgeBaseScopeItemsResponse';
import type { GetKnowledgeBaseWebhookUrlRequest as _exa_opensearch_clients_pb_GetKnowledgeBaseWebhookUrlRequest, GetKnowledgeBaseWebhookUrlRequest__Output as _exa_opensearch_clients_pb_GetKnowledgeBaseWebhookUrlRequest__Output } from './exa/opensearch_clients_pb/GetKnowledgeBaseWebhookUrlRequest';
import type { GetKnowledgeBaseWebhookUrlResponse as _exa_opensearch_clients_pb_GetKnowledgeBaseWebhookUrlResponse, GetKnowledgeBaseWebhookUrlResponse__Output as _exa_opensearch_clients_pb_GetKnowledgeBaseWebhookUrlResponse__Output } from './exa/opensearch_clients_pb/GetKnowledgeBaseWebhookUrlResponse';
import type { GithubRepoConfig as _exa_opensearch_clients_pb_GithubRepoConfig, GithubRepoConfig__Output as _exa_opensearch_clients_pb_GithubRepoConfig__Output } from './exa/opensearch_clients_pb/GithubRepoConfig';
import type { GithubUser as _exa_opensearch_clients_pb_GithubUser, GithubUser__Output as _exa_opensearch_clients_pb_GithubUser__Output } from './exa/opensearch_clients_pb/GithubUser';
import type { GraphSearchRequest as _exa_opensearch_clients_pb_GraphSearchRequest, GraphSearchRequest__Output as _exa_opensearch_clients_pb_GraphSearchRequest__Output } from './exa/opensearch_clients_pb/GraphSearchRequest';
import type { GraphSearchResponse as _exa_opensearch_clients_pb_GraphSearchResponse, GraphSearchResponse__Output as _exa_opensearch_clients_pb_GraphSearchResponse__Output } from './exa/opensearch_clients_pb/GraphSearchResponse';
import type { HybridSearchRequest as _exa_opensearch_clients_pb_HybridSearchRequest, HybridSearchRequest__Output as _exa_opensearch_clients_pb_HybridSearchRequest__Output } from './exa/opensearch_clients_pb/HybridSearchRequest';
import type { HybridSearchResponse as _exa_opensearch_clients_pb_HybridSearchResponse, HybridSearchResponse__Output as _exa_opensearch_clients_pb_HybridSearchResponse__Output } from './exa/opensearch_clients_pb/HybridSearchResponse';
import type { IngestGithubDataRequest as _exa_opensearch_clients_pb_IngestGithubDataRequest, IngestGithubDataRequest__Output as _exa_opensearch_clients_pb_IngestGithubDataRequest__Output } from './exa/opensearch_clients_pb/IngestGithubDataRequest';
import type { IngestGithubDataResponse as _exa_opensearch_clients_pb_IngestGithubDataResponse, IngestGithubDataResponse__Output as _exa_opensearch_clients_pb_IngestGithubDataResponse__Output } from './exa/opensearch_clients_pb/IngestGithubDataResponse';
import type { IngestGoogleDriveDataRequest as _exa_opensearch_clients_pb_IngestGoogleDriveDataRequest, IngestGoogleDriveDataRequest__Output as _exa_opensearch_clients_pb_IngestGoogleDriveDataRequest__Output } from './exa/opensearch_clients_pb/IngestGoogleDriveDataRequest';
import type { IngestGoogleDriveDataResponse as _exa_opensearch_clients_pb_IngestGoogleDriveDataResponse, IngestGoogleDriveDataResponse__Output as _exa_opensearch_clients_pb_IngestGoogleDriveDataResponse__Output } from './exa/opensearch_clients_pb/IngestGoogleDriveDataResponse';
import type { IngestJiraDataRequest as _exa_opensearch_clients_pb_IngestJiraDataRequest, IngestJiraDataRequest__Output as _exa_opensearch_clients_pb_IngestJiraDataRequest__Output } from './exa/opensearch_clients_pb/IngestJiraDataRequest';
import type { IngestJiraDataResponse as _exa_opensearch_clients_pb_IngestJiraDataResponse, IngestJiraDataResponse__Output as _exa_opensearch_clients_pb_IngestJiraDataResponse__Output } from './exa/opensearch_clients_pb/IngestJiraDataResponse';
import type { IngestJiraPayloadRequest as _exa_opensearch_clients_pb_IngestJiraPayloadRequest, IngestJiraPayloadRequest__Output as _exa_opensearch_clients_pb_IngestJiraPayloadRequest__Output } from './exa/opensearch_clients_pb/IngestJiraPayloadRequest';
import type { IngestJiraPayloadResponse as _exa_opensearch_clients_pb_IngestJiraPayloadResponse, IngestJiraPayloadResponse__Output as _exa_opensearch_clients_pb_IngestJiraPayloadResponse__Output } from './exa/opensearch_clients_pb/IngestJiraPayloadResponse';
import type { IngestSlackDataRequest as _exa_opensearch_clients_pb_IngestSlackDataRequest, IngestSlackDataRequest__Output as _exa_opensearch_clients_pb_IngestSlackDataRequest__Output } from './exa/opensearch_clients_pb/IngestSlackDataRequest';
import type { IngestSlackDataResponse as _exa_opensearch_clients_pb_IngestSlackDataResponse, IngestSlackDataResponse__Output as _exa_opensearch_clients_pb_IngestSlackDataResponse__Output } from './exa/opensearch_clients_pb/IngestSlackDataResponse';
import type { IngestSlackPayloadRequest as _exa_opensearch_clients_pb_IngestSlackPayloadRequest, IngestSlackPayloadRequest__Output as _exa_opensearch_clients_pb_IngestSlackPayloadRequest__Output } from './exa/opensearch_clients_pb/IngestSlackPayloadRequest';
import type { IngestSlackPayloadResponse as _exa_opensearch_clients_pb_IngestSlackPayloadResponse, IngestSlackPayloadResponse__Output as _exa_opensearch_clients_pb_IngestSlackPayloadResponse__Output } from './exa/opensearch_clients_pb/IngestSlackPayloadResponse';
import type { JobState as _exa_opensearch_clients_pb_JobState, JobState__Output as _exa_opensearch_clients_pb_JobState__Output } from './exa/opensearch_clients_pb/JobState';
import type { KnowledgeBaseSearchRequest as _exa_opensearch_clients_pb_KnowledgeBaseSearchRequest, KnowledgeBaseSearchRequest__Output as _exa_opensearch_clients_pb_KnowledgeBaseSearchRequest__Output } from './exa/opensearch_clients_pb/KnowledgeBaseSearchRequest';
import type { KnowledgeBaseSearchResponse as _exa_opensearch_clients_pb_KnowledgeBaseSearchResponse, KnowledgeBaseSearchResponse__Output as _exa_opensearch_clients_pb_KnowledgeBaseSearchResponse__Output } from './exa/opensearch_clients_pb/KnowledgeBaseSearchResponse';
import type { KnowledgeBaseServiceClient as _exa_opensearch_clients_pb_KnowledgeBaseServiceClient, KnowledgeBaseServiceDefinition as _exa_opensearch_clients_pb_KnowledgeBaseServiceDefinition } from './exa/opensearch_clients_pb/KnowledgeBaseService';
import type { OpenSearchAddRepositoryRequest as _exa_opensearch_clients_pb_OpenSearchAddRepositoryRequest, OpenSearchAddRepositoryRequest__Output as _exa_opensearch_clients_pb_OpenSearchAddRepositoryRequest__Output } from './exa/opensearch_clients_pb/OpenSearchAddRepositoryRequest';
import type { OpenSearchAddRepositoryResponse as _exa_opensearch_clients_pb_OpenSearchAddRepositoryResponse, OpenSearchAddRepositoryResponse__Output as _exa_opensearch_clients_pb_OpenSearchAddRepositoryResponse__Output } from './exa/opensearch_clients_pb/OpenSearchAddRepositoryResponse';
import type { OpenSearchGetIndexRequest as _exa_opensearch_clients_pb_OpenSearchGetIndexRequest, OpenSearchGetIndexRequest__Output as _exa_opensearch_clients_pb_OpenSearchGetIndexRequest__Output } from './exa/opensearch_clients_pb/OpenSearchGetIndexRequest';
import type { OpenSearchGetIndexResponse as _exa_opensearch_clients_pb_OpenSearchGetIndexResponse, OpenSearchGetIndexResponse__Output as _exa_opensearch_clients_pb_OpenSearchGetIndexResponse__Output } from './exa/opensearch_clients_pb/OpenSearchGetIndexResponse';
import type { QuerySearchResponse as _exa_opensearch_clients_pb_QuerySearchResponse, QuerySearchResponse__Output as _exa_opensearch_clients_pb_QuerySearchResponse__Output } from './exa/opensearch_clients_pb/QuerySearchResponse';
import type { SearchResult as _exa_opensearch_clients_pb_SearchResult, SearchResult__Output as _exa_opensearch_clients_pb_SearchResult__Output } from './exa/opensearch_clients_pb/SearchResult';
import type { SlackChannelPayload as _exa_opensearch_clients_pb_SlackChannelPayload, SlackChannelPayload__Output as _exa_opensearch_clients_pb_SlackChannelPayload__Output } from './exa/opensearch_clients_pb/SlackChannelPayload';
import type { SlackMessagePayload as _exa_opensearch_clients_pb_SlackMessagePayload, SlackMessagePayload__Output as _exa_opensearch_clients_pb_SlackMessagePayload__Output } from './exa/opensearch_clients_pb/SlackMessagePayload';
import type { SlackPayload as _exa_opensearch_clients_pb_SlackPayload, SlackPayload__Output as _exa_opensearch_clients_pb_SlackPayload__Output } from './exa/opensearch_clients_pb/SlackPayload';
import type { TimeRange as _exa_opensearch_clients_pb_TimeRange, TimeRange__Output as _exa_opensearch_clients_pb_TimeRange__Output } from './exa/opensearch_clients_pb/TimeRange';
import type { UpdateConnectorConfigRequest as _exa_opensearch_clients_pb_UpdateConnectorConfigRequest, UpdateConnectorConfigRequest__Output as _exa_opensearch_clients_pb_UpdateConnectorConfigRequest__Output } from './exa/opensearch_clients_pb/UpdateConnectorConfigRequest';
import type { UpdateConnectorConfigResponse as _exa_opensearch_clients_pb_UpdateConnectorConfigResponse, UpdateConnectorConfigResponse__Output as _exa_opensearch_clients_pb_UpdateConnectorConfigResponse__Output } from './exa/opensearch_clients_pb/UpdateConnectorConfigResponse';
import type { UserInfo as _exa_opensearch_clients_pb_UserInfo, UserInfo__Output as _exa_opensearch_clients_pb_UserInfo__Output } from './exa/opensearch_clients_pb/UserInfo';
import type { FieldDiff as _exa_reactive_component_pb_FieldDiff, FieldDiff__Output as _exa_reactive_component_pb_FieldDiff__Output } from './exa/reactive_component_pb/FieldDiff';
import type { MapDiff as _exa_reactive_component_pb_MapDiff, MapDiff__Output as _exa_reactive_component_pb_MapDiff__Output } from './exa/reactive_component_pb/MapDiff';
import type { MapKeyDiff as _exa_reactive_component_pb_MapKeyDiff, MapKeyDiff__Output as _exa_reactive_component_pb_MapKeyDiff__Output } from './exa/reactive_component_pb/MapKeyDiff';
import type { MessageDiff as _exa_reactive_component_pb_MessageDiff, MessageDiff__Output as _exa_reactive_component_pb_MessageDiff__Output } from './exa/reactive_component_pb/MessageDiff';
import type { RepeatedDiff as _exa_reactive_component_pb_RepeatedDiff, RepeatedDiff__Output as _exa_reactive_component_pb_RepeatedDiff__Output } from './exa/reactive_component_pb/RepeatedDiff';
import type { SingularValue as _exa_reactive_component_pb_SingularValue, SingularValue__Output as _exa_reactive_component_pb_SingularValue__Output } from './exa/reactive_component_pb/SingularValue';
import type { StreamReactiveUpdatesRequest as _exa_reactive_component_pb_StreamReactiveUpdatesRequest, StreamReactiveUpdatesRequest__Output as _exa_reactive_component_pb_StreamReactiveUpdatesRequest__Output } from './exa/reactive_component_pb/StreamReactiveUpdatesRequest';
import type { StreamReactiveUpdatesResponse as _exa_reactive_component_pb_StreamReactiveUpdatesResponse, StreamReactiveUpdatesResponse__Output as _exa_reactive_component_pb_StreamReactiveUpdatesResponse__Output } from './exa/reactive_component_pb/StreamReactiveUpdatesResponse';
import type { TestDiffProto as _exa_reactive_component_pb_TestDiffProto, TestDiffProto__Output as _exa_reactive_component_pb_TestDiffProto__Output } from './exa/reactive_component_pb/TestDiffProto';
import type { TestProto as _exa_reactive_component_pb_TestProto, TestProto__Output as _exa_reactive_component_pb_TestProto__Output } from './exa/reactive_component_pb/TestProto';
import type { DescriptorProto as _google_protobuf_DescriptorProto, DescriptorProto__Output as _google_protobuf_DescriptorProto__Output } from './google/protobuf/DescriptorProto';
import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from './google/protobuf/Duration';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from './google/protobuf/Empty';
import type { EnumDescriptorProto as _google_protobuf_EnumDescriptorProto, EnumDescriptorProto__Output as _google_protobuf_EnumDescriptorProto__Output } from './google/protobuf/EnumDescriptorProto';
import type { EnumOptions as _google_protobuf_EnumOptions, EnumOptions__Output as _google_protobuf_EnumOptions__Output } from './google/protobuf/EnumOptions';
import type { EnumValueDescriptorProto as _google_protobuf_EnumValueDescriptorProto, EnumValueDescriptorProto__Output as _google_protobuf_EnumValueDescriptorProto__Output } from './google/protobuf/EnumValueDescriptorProto';
import type { EnumValueOptions as _google_protobuf_EnumValueOptions, EnumValueOptions__Output as _google_protobuf_EnumValueOptions__Output } from './google/protobuf/EnumValueOptions';
import type { ExtensionRangeOptions as _google_protobuf_ExtensionRangeOptions, ExtensionRangeOptions__Output as _google_protobuf_ExtensionRangeOptions__Output } from './google/protobuf/ExtensionRangeOptions';
import type { FeatureSet as _google_protobuf_FeatureSet, FeatureSet__Output as _google_protobuf_FeatureSet__Output } from './google/protobuf/FeatureSet';
import type { FeatureSetDefaults as _google_protobuf_FeatureSetDefaults, FeatureSetDefaults__Output as _google_protobuf_FeatureSetDefaults__Output } from './google/protobuf/FeatureSetDefaults';
import type { FieldDescriptorProto as _google_protobuf_FieldDescriptorProto, FieldDescriptorProto__Output as _google_protobuf_FieldDescriptorProto__Output } from './google/protobuf/FieldDescriptorProto';
import type { FieldOptions as _google_protobuf_FieldOptions, FieldOptions__Output as _google_protobuf_FieldOptions__Output } from './google/protobuf/FieldOptions';
import type { FileDescriptorProto as _google_protobuf_FileDescriptorProto, FileDescriptorProto__Output as _google_protobuf_FileDescriptorProto__Output } from './google/protobuf/FileDescriptorProto';
import type { FileDescriptorSet as _google_protobuf_FileDescriptorSet, FileDescriptorSet__Output as _google_protobuf_FileDescriptorSet__Output } from './google/protobuf/FileDescriptorSet';
import type { FileOptions as _google_protobuf_FileOptions, FileOptions__Output as _google_protobuf_FileOptions__Output } from './google/protobuf/FileOptions';
import type { GeneratedCodeInfo as _google_protobuf_GeneratedCodeInfo, GeneratedCodeInfo__Output as _google_protobuf_GeneratedCodeInfo__Output } from './google/protobuf/GeneratedCodeInfo';
import type { MessageOptions as _google_protobuf_MessageOptions, MessageOptions__Output as _google_protobuf_MessageOptions__Output } from './google/protobuf/MessageOptions';
import type { MethodDescriptorProto as _google_protobuf_MethodDescriptorProto, MethodDescriptorProto__Output as _google_protobuf_MethodDescriptorProto__Output } from './google/protobuf/MethodDescriptorProto';
import type { MethodOptions as _google_protobuf_MethodOptions, MethodOptions__Output as _google_protobuf_MethodOptions__Output } from './google/protobuf/MethodOptions';
import type { OneofDescriptorProto as _google_protobuf_OneofDescriptorProto, OneofDescriptorProto__Output as _google_protobuf_OneofDescriptorProto__Output } from './google/protobuf/OneofDescriptorProto';
import type { OneofOptions as _google_protobuf_OneofOptions, OneofOptions__Output as _google_protobuf_OneofOptions__Output } from './google/protobuf/OneofOptions';
import type { ServiceDescriptorProto as _google_protobuf_ServiceDescriptorProto, ServiceDescriptorProto__Output as _google_protobuf_ServiceDescriptorProto__Output } from './google/protobuf/ServiceDescriptorProto';
import type { ServiceOptions as _google_protobuf_ServiceOptions, ServiceOptions__Output as _google_protobuf_ServiceOptions__Output } from './google/protobuf/ServiceOptions';
import type { SourceCodeInfo as _google_protobuf_SourceCodeInfo, SourceCodeInfo__Output as _google_protobuf_SourceCodeInfo__Output } from './google/protobuf/SourceCodeInfo';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from './google/protobuf/Timestamp';
import type { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from './google/protobuf/UninterpretedOption';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  buf: {
    validate: {
      AnyRules: MessageTypeDefinition<_buf_validate_AnyRules, _buf_validate_AnyRules__Output>
      BoolRules: MessageTypeDefinition<_buf_validate_BoolRules, _buf_validate_BoolRules__Output>
      BytesRules: MessageTypeDefinition<_buf_validate_BytesRules, _buf_validate_BytesRules__Output>
      DoubleRules: MessageTypeDefinition<_buf_validate_DoubleRules, _buf_validate_DoubleRules__Output>
      DurationRules: MessageTypeDefinition<_buf_validate_DurationRules, _buf_validate_DurationRules__Output>
      EnumRules: MessageTypeDefinition<_buf_validate_EnumRules, _buf_validate_EnumRules__Output>
      FieldPath: MessageTypeDefinition<_buf_validate_FieldPath, _buf_validate_FieldPath__Output>
      FieldPathElement: MessageTypeDefinition<_buf_validate_FieldPathElement, _buf_validate_FieldPathElement__Output>
      FieldRules: MessageTypeDefinition<_buf_validate_FieldRules, _buf_validate_FieldRules__Output>
      Fixed32Rules: MessageTypeDefinition<_buf_validate_Fixed32Rules, _buf_validate_Fixed32Rules__Output>
      Fixed64Rules: MessageTypeDefinition<_buf_validate_Fixed64Rules, _buf_validate_Fixed64Rules__Output>
      FloatRules: MessageTypeDefinition<_buf_validate_FloatRules, _buf_validate_FloatRules__Output>
      Ignore: EnumTypeDefinition
      Int32Rules: MessageTypeDefinition<_buf_validate_Int32Rules, _buf_validate_Int32Rules__Output>
      Int64Rules: MessageTypeDefinition<_buf_validate_Int64Rules, _buf_validate_Int64Rules__Output>
      KnownRegex: EnumTypeDefinition
      MapRules: MessageTypeDefinition<_buf_validate_MapRules, _buf_validate_MapRules__Output>
      MessageRules: MessageTypeDefinition<_buf_validate_MessageRules, _buf_validate_MessageRules__Output>
      OneofRules: MessageTypeDefinition<_buf_validate_OneofRules, _buf_validate_OneofRules__Output>
      PredefinedRules: MessageTypeDefinition<_buf_validate_PredefinedRules, _buf_validate_PredefinedRules__Output>
      RepeatedRules: MessageTypeDefinition<_buf_validate_RepeatedRules, _buf_validate_RepeatedRules__Output>
      Rule: MessageTypeDefinition<_buf_validate_Rule, _buf_validate_Rule__Output>
      SFixed32Rules: MessageTypeDefinition<_buf_validate_SFixed32Rules, _buf_validate_SFixed32Rules__Output>
      SFixed64Rules: MessageTypeDefinition<_buf_validate_SFixed64Rules, _buf_validate_SFixed64Rules__Output>
      SInt32Rules: MessageTypeDefinition<_buf_validate_SInt32Rules, _buf_validate_SInt32Rules__Output>
      SInt64Rules: MessageTypeDefinition<_buf_validate_SInt64Rules, _buf_validate_SInt64Rules__Output>
      StringRules: MessageTypeDefinition<_buf_validate_StringRules, _buf_validate_StringRules__Output>
      TimestampRules: MessageTypeDefinition<_buf_validate_TimestampRules, _buf_validate_TimestampRules__Output>
      UInt32Rules: MessageTypeDefinition<_buf_validate_UInt32Rules, _buf_validate_UInt32Rules__Output>
      UInt64Rules: MessageTypeDefinition<_buf_validate_UInt64Rules, _buf_validate_UInt64Rules__Output>
      Violation: MessageTypeDefinition<_buf_validate_Violation, _buf_validate_Violation__Output>
      Violations: MessageTypeDefinition<_buf_validate_Violations, _buf_validate_Violations__Output>
    }
  }
  exa: {
    auto_cascade_common_pb: {
      BranchStatus: EnumTypeDefinition
      CommentType: EnumTypeDefinition
      GitRepoInfo: MessageTypeDefinition<_exa_auto_cascade_common_pb_GitRepoInfo, _exa_auto_cascade_common_pb_GitRepoInfo__Output>
      GithubCICheckStatus: EnumTypeDefinition
      GithubInstallationInfo: MessageTypeDefinition<_exa_auto_cascade_common_pb_GithubInstallationInfo, _exa_auto_cascade_common_pb_GithubInstallationInfo__Output>
      GithubPullRequestBranchStatus: EnumTypeDefinition
      GithubPullRequestInfo: MessageTypeDefinition<_exa_auto_cascade_common_pb_GithubPullRequestInfo, _exa_auto_cascade_common_pb_GithubPullRequestInfo__Output>
      SessionInfo: MessageTypeDefinition<_exa_auto_cascade_common_pb_SessionInfo, _exa_auto_cascade_common_pb_SessionInfo__Output>
      SessionInfos: MessageTypeDefinition<_exa_auto_cascade_common_pb_SessionInfos, _exa_auto_cascade_common_pb_SessionInfos__Output>
    }
    bug_checker_pb: {
      Bug: MessageTypeDefinition<_exa_bug_checker_pb_Bug, _exa_bug_checker_pb_Bug__Output>
      Fix: MessageTypeDefinition<_exa_bug_checker_pb_Fix, _exa_bug_checker_pb_Fix__Output>
    }
    cascade_plugins_pb: {
      CascadePluginCommand: MessageTypeDefinition<_exa_cascade_plugins_pb_CascadePluginCommand, _exa_cascade_plugins_pb_CascadePluginCommand__Output>
      CascadePluginCommandTemplate: MessageTypeDefinition<_exa_cascade_plugins_pb_CascadePluginCommandTemplate, _exa_cascade_plugins_pb_CascadePluginCommandTemplate__Output>
      CascadePluginCommandVariable: MessageTypeDefinition<_exa_cascade_plugins_pb_CascadePluginCommandVariable, _exa_cascade_plugins_pb_CascadePluginCommandVariable__Output>
      CascadePluginLocalConfig: MessageTypeDefinition<_exa_cascade_plugins_pb_CascadePluginLocalConfig, _exa_cascade_plugins_pb_CascadePluginLocalConfig__Output>
      CascadePluginRemoteConfig: MessageTypeDefinition<_exa_cascade_plugins_pb_CascadePluginRemoteConfig, _exa_cascade_plugins_pb_CascadePluginRemoteConfig__Output>
      CascadePluginRemoteConfigTemplate: MessageTypeDefinition<_exa_cascade_plugins_pb_CascadePluginRemoteConfigTemplate, _exa_cascade_plugins_pb_CascadePluginRemoteConfigTemplate__Output>
      CascadePluginTemplate: MessageTypeDefinition<_exa_cascade_plugins_pb_CascadePluginTemplate, _exa_cascade_plugins_pb_CascadePluginTemplate__Output>
      CascadePluginsService: SubtypeConstructor<typeof grpc.Client, _exa_cascade_plugins_pb_CascadePluginsServiceClient> & { service: _exa_cascade_plugins_pb_CascadePluginsServiceDefinition }
      GetAvailableCascadePluginsRequest: MessageTypeDefinition<_exa_cascade_plugins_pb_GetAvailableCascadePluginsRequest, _exa_cascade_plugins_pb_GetAvailableCascadePluginsRequest__Output>
      GetAvailableCascadePluginsResponse: MessageTypeDefinition<_exa_cascade_plugins_pb_GetAvailableCascadePluginsResponse, _exa_cascade_plugins_pb_GetAvailableCascadePluginsResponse__Output>
      GetCascadePluginByIdRequest: MessageTypeDefinition<_exa_cascade_plugins_pb_GetCascadePluginByIdRequest, _exa_cascade_plugins_pb_GetCascadePluginByIdRequest__Output>
      GetCascadePluginByIdResponse: MessageTypeDefinition<_exa_cascade_plugins_pb_GetCascadePluginByIdResponse, _exa_cascade_plugins_pb_GetCascadePluginByIdResponse__Output>
      GetMcpClientInfosRequest: MessageTypeDefinition<_exa_cascade_plugins_pb_GetMcpClientInfosRequest, _exa_cascade_plugins_pb_GetMcpClientInfosRequest__Output>
      GetMcpClientInfosResponse: MessageTypeDefinition<_exa_cascade_plugins_pb_GetMcpClientInfosResponse, _exa_cascade_plugins_pb_GetMcpClientInfosResponse__Output>
      InstallCascadePluginRequest: MessageTypeDefinition<_exa_cascade_plugins_pb_InstallCascadePluginRequest, _exa_cascade_plugins_pb_InstallCascadePluginRequest__Output>
      InstallCascadePluginResponse: MessageTypeDefinition<_exa_cascade_plugins_pb_InstallCascadePluginResponse, _exa_cascade_plugins_pb_InstallCascadePluginResponse__Output>
      McpClientInfo: MessageTypeDefinition<_exa_cascade_plugins_pb_McpClientInfo, _exa_cascade_plugins_pb_McpClientInfo__Output>
    }
    chat_pb: {
      CacheControlType: EnumTypeDefinition
      ChatExperimentStatus: MessageTypeDefinition<_exa_chat_pb_ChatExperimentStatus, _exa_chat_pb_ChatExperimentStatus__Output>
      ChatFeedbackType: EnumTypeDefinition
      ChatIntentType: EnumTypeDefinition
      ChatMentionsSearchRequest: MessageTypeDefinition<_exa_chat_pb_ChatMentionsSearchRequest, _exa_chat_pb_ChatMentionsSearchRequest__Output>
      ChatMentionsSearchResponse: MessageTypeDefinition<_exa_chat_pb_ChatMentionsSearchResponse, _exa_chat_pb_ChatMentionsSearchResponse__Output>
      ChatMessage: MessageTypeDefinition<_exa_chat_pb_ChatMessage, _exa_chat_pb_ChatMessage__Output>
      ChatMessageAction: MessageTypeDefinition<_exa_chat_pb_ChatMessageAction, _exa_chat_pb_ChatMessageAction__Output>
      ChatMessageActionEdit: MessageTypeDefinition<_exa_chat_pb_ChatMessageActionEdit, _exa_chat_pb_ChatMessageActionEdit__Output>
      ChatMessageActionGeneric: MessageTypeDefinition<_exa_chat_pb_ChatMessageActionGeneric, _exa_chat_pb_ChatMessageActionGeneric__Output>
      ChatMessageActionSearch: MessageTypeDefinition<_exa_chat_pb_ChatMessageActionSearch, _exa_chat_pb_ChatMessageActionSearch__Output>
      ChatMessageError: MessageTypeDefinition<_exa_chat_pb_ChatMessageError, _exa_chat_pb_ChatMessageError__Output>
      ChatMessageIntent: MessageTypeDefinition<_exa_chat_pb_ChatMessageIntent, _exa_chat_pb_ChatMessageIntent__Output>
      ChatMessagePrompt: MessageTypeDefinition<_exa_chat_pb_ChatMessagePrompt, _exa_chat_pb_ChatMessagePrompt__Output>
      ChatMessageStatus: MessageTypeDefinition<_exa_chat_pb_ChatMessageStatus, _exa_chat_pb_ChatMessageStatus__Output>
      ChatMessageStatusContextRelevancy: MessageTypeDefinition<_exa_chat_pb_ChatMessageStatusContextRelevancy, _exa_chat_pb_ChatMessageStatusContextRelevancy__Output>
      ChatMetrics: MessageTypeDefinition<_exa_chat_pb_ChatMetrics, _exa_chat_pb_ChatMetrics__Output>
      ChatToolChoice: MessageTypeDefinition<_exa_chat_pb_ChatToolChoice, _exa_chat_pb_ChatToolChoice__Output>
      ChatToolDefinition: MessageTypeDefinition<_exa_chat_pb_ChatToolDefinition, _exa_chat_pb_ChatToolDefinition__Output>
      CodeBlockInfo: MessageTypeDefinition<_exa_chat_pb_CodeBlockInfo, _exa_chat_pb_CodeBlockInfo__Output>
      ComputerUseToolConfig: MessageTypeDefinition<_exa_chat_pb_ComputerUseToolConfig, _exa_chat_pb_ComputerUseToolConfig__Output>
      Conversation: MessageTypeDefinition<_exa_chat_pb_Conversation, _exa_chat_pb_Conversation__Output>
      DeepWikiContext: MessageTypeDefinition<_exa_chat_pb_DeepWikiContext, _exa_chat_pb_DeepWikiContext__Output>
      DeepWikiHoverContext: MessageTypeDefinition<_exa_chat_pb_DeepWikiHoverContext, _exa_chat_pb_DeepWikiHoverContext__Output>
      DeepWikiRequestType: EnumTypeDefinition
      DeepWikiSymbolContext: MessageTypeDefinition<_exa_chat_pb_DeepWikiSymbolContext, _exa_chat_pb_DeepWikiSymbolContext__Output>
      DeepWikiSymbolRange: MessageTypeDefinition<_exa_chat_pb_DeepWikiSymbolRange, _exa_chat_pb_DeepWikiSymbolRange__Output>
      DeepWikiSymbolType: EnumTypeDefinition
      FormattedChatMessage: MessageTypeDefinition<_exa_chat_pb_FormattedChatMessage, _exa_chat_pb_FormattedChatMessage__Output>
      FunctionCallInfo: MessageTypeDefinition<_exa_chat_pb_FunctionCallInfo, _exa_chat_pb_FunctionCallInfo__Output>
      GetChatMessageRequest: MessageTypeDefinition<_exa_chat_pb_GetChatMessageRequest, _exa_chat_pb_GetChatMessageRequest__Output>
      GetDeepWikiRequest: MessageTypeDefinition<_exa_chat_pb_GetDeepWikiRequest, _exa_chat_pb_GetDeepWikiRequest__Output>
      IntentClassExplain: MessageTypeDefinition<_exa_chat_pb_IntentClassExplain, _exa_chat_pb_IntentClassExplain__Output>
      IntentCodeBlockExplain: MessageTypeDefinition<_exa_chat_pb_IntentCodeBlockExplain, _exa_chat_pb_IntentCodeBlockExplain__Output>
      IntentCodeBlockRefactor: MessageTypeDefinition<_exa_chat_pb_IntentCodeBlockRefactor, _exa_chat_pb_IntentCodeBlockRefactor__Output>
      IntentFastApply: MessageTypeDefinition<_exa_chat_pb_IntentFastApply, _exa_chat_pb_IntentFastApply__Output>
      IntentFunctionDocstring: MessageTypeDefinition<_exa_chat_pb_IntentFunctionDocstring, _exa_chat_pb_IntentFunctionDocstring__Output>
      IntentFunctionExplain: MessageTypeDefinition<_exa_chat_pb_IntentFunctionExplain, _exa_chat_pb_IntentFunctionExplain__Output>
      IntentFunctionRefactor: MessageTypeDefinition<_exa_chat_pb_IntentFunctionRefactor, _exa_chat_pb_IntentFunctionRefactor__Output>
      IntentFunctionUnitTests: MessageTypeDefinition<_exa_chat_pb_IntentFunctionUnitTests, _exa_chat_pb_IntentFunctionUnitTests__Output>
      IntentGenerateCode: MessageTypeDefinition<_exa_chat_pb_IntentGenerateCode, _exa_chat_pb_IntentGenerateCode__Output>
      IntentGeneric: MessageTypeDefinition<_exa_chat_pb_IntentGeneric, _exa_chat_pb_IntentGeneric__Output>
      IntentProblemExplain: MessageTypeDefinition<_exa_chat_pb_IntentProblemExplain, _exa_chat_pb_IntentProblemExplain__Output>
      IntentSearch: MessageTypeDefinition<_exa_chat_pb_IntentSearch, _exa_chat_pb_IntentSearch__Output>
      ParameterInfo: MessageTypeDefinition<_exa_chat_pb_ParameterInfo, _exa_chat_pb_ParameterInfo__Output>
      PromptCacheOptions: MessageTypeDefinition<_exa_chat_pb_PromptCacheOptions, _exa_chat_pb_PromptCacheOptions__Output>
      RawChatMessage: MessageTypeDefinition<_exa_chat_pb_RawChatMessage, _exa_chat_pb_RawChatMessage__Output>
      RawGetChatMessageRequest: MessageTypeDefinition<_exa_chat_pb_RawGetChatMessageRequest, _exa_chat_pb_RawGetChatMessageRequest__Output>
    }
    code_edit: {
      code_edit_pb: {
        CodeChangeWithContext: MessageTypeDefinition<_exa_code_edit_code_edit_pb_CodeChangeWithContext, _exa_code_edit_code_edit_pb_CodeChangeWithContext__Output>
        CodeContextItemChange: MessageTypeDefinition<_exa_code_edit_code_edit_pb_CodeContextItemChange, _exa_code_edit_code_edit_pb_CodeContextItemChange__Output>
        CodeContextItemWithClassification: MessageTypeDefinition<_exa_code_edit_code_edit_pb_CodeContextItemWithClassification, _exa_code_edit_code_edit_pb_CodeContextItemWithClassification__Output>
        CodeRetrievalEvalResult: MessageTypeDefinition<_exa_code_edit_code_edit_pb_CodeRetrievalEvalResult, _exa_code_edit_code_edit_pb_CodeRetrievalEvalResult__Output>
        CodeRetrievalEvalTask: MessageTypeDefinition<_exa_code_edit_code_edit_pb_CodeRetrievalEvalTask, _exa_code_edit_code_edit_pb_CodeRetrievalEvalTask__Output>
        CodeRetrievalResult: MessageTypeDefinition<_exa_code_edit_code_edit_pb_CodeRetrievalResult, _exa_code_edit_code_edit_pb_CodeRetrievalResult__Output>
        CommitToFileChangeRequest: MessageTypeDefinition<_exa_code_edit_code_edit_pb_CommitToFileChangeRequest, _exa_code_edit_code_edit_pb_CommitToFileChangeRequest__Output>
        CommitToFileChangeResponse: MessageTypeDefinition<_exa_code_edit_code_edit_pb_CommitToFileChangeResponse, _exa_code_edit_code_edit_pb_CommitToFileChangeResponse__Output>
        DescriptionType: EnumTypeDefinition
        FileChange: MessageTypeDefinition<_exa_code_edit_code_edit_pb_FileChange, _exa_code_edit_code_edit_pb_FileChange__Output>
        GitCommit: MessageTypeDefinition<_exa_code_edit_code_edit_pb_GitCommit, _exa_code_edit_code_edit_pb_GitCommit__Output>
        GitFilePatch: MessageTypeDefinition<_exa_code_edit_code_edit_pb_GitFilePatch, _exa_code_edit_code_edit_pb_GitFilePatch__Output>
        InstructionWithId: MessageTypeDefinition<_exa_code_edit_code_edit_pb_InstructionWithId, _exa_code_edit_code_edit_pb_InstructionWithId__Output>
        InstructionWithIdList: MessageTypeDefinition<_exa_code_edit_code_edit_pb_InstructionWithIdList, _exa_code_edit_code_edit_pb_InstructionWithIdList__Output>
        Intent: MessageTypeDefinition<_exa_code_edit_code_edit_pb_Intent, _exa_code_edit_code_edit_pb_Intent__Output>
        IntentRelevance: MessageTypeDefinition<_exa_code_edit_code_edit_pb_IntentRelevance, _exa_code_edit_code_edit_pb_IntentRelevance__Output>
        IntentType: EnumTypeDefinition
        RelevanceReason: EnumTypeDefinition
        RelevantCodeContext: MessageTypeDefinition<_exa_code_edit_code_edit_pb_RelevantCodeContext, _exa_code_edit_code_edit_pb_RelevantCodeContext__Output>
        RetrievalMetrics: MessageTypeDefinition<_exa_code_edit_code_edit_pb_RetrievalMetrics, _exa_code_edit_code_edit_pb_RetrievalMetrics__Output>
        RetrieverClassification: MessageTypeDefinition<_exa_code_edit_code_edit_pb_RetrieverClassification, _exa_code_edit_code_edit_pb_RetrieverClassification__Output>
        RetrieverInfo: MessageTypeDefinition<_exa_code_edit_code_edit_pb_RetrieverInfo, _exa_code_edit_code_edit_pb_RetrieverInfo__Output>
        RetrieverType: EnumTypeDefinition
      }
    }
    codeium_common_pb: {
      APIProvider: EnumTypeDefinition
      ActionPointer: MessageTypeDefinition<_exa_codeium_common_pb_ActionPointer, _exa_codeium_common_pb_ActionPointer__Output>
      AllowedModelConfig: MessageTypeDefinition<_exa_codeium_common_pb_AllowedModelConfig, _exa_codeium_common_pb_AllowedModelConfig__Output>
      AnnotationsConfig: EnumTypeDefinition
      ApiProviderConfig: MessageTypeDefinition<_exa_codeium_common_pb_ApiProviderConfig, _exa_codeium_common_pb_ApiProviderConfig__Output>
      ApiProviderConfigMap: MessageTypeDefinition<_exa_codeium_common_pb_ApiProviderConfigMap, _exa_codeium_common_pb_ApiProviderConfigMap__Output>
      ApiProviderRoutingConfig: MessageTypeDefinition<_exa_codeium_common_pb_ApiProviderRoutingConfig, _exa_codeium_common_pb_ApiProviderRoutingConfig__Output>
      ArenaTier: EnumTypeDefinition
      AttributionStatus: EnumTypeDefinition
      AuthSource: EnumTypeDefinition
      AutoContinueOnMaxGeneratorInvocations: EnumTypeDefinition
      AutocompleteSpeed: EnumTypeDefinition
      BrowserClickInteraction: MessageTypeDefinition<_exa_codeium_common_pb_BrowserClickInteraction, _exa_codeium_common_pb_BrowserClickInteraction__Output>
      BrowserCodeBlockScopeItem: MessageTypeDefinition<_exa_codeium_common_pb_BrowserCodeBlockScopeItem, _exa_codeium_common_pb_BrowserCodeBlockScopeItem__Output>
      BrowserExperimentalFeaturesConfig: EnumTypeDefinition
      BrowserInstallationStatus: EnumTypeDefinition
      BrowserInteraction: MessageTypeDefinition<_exa_codeium_common_pb_BrowserInteraction, _exa_codeium_common_pb_BrowserInteraction__Output>
      BrowserPageMetadata: MessageTypeDefinition<_exa_codeium_common_pb_BrowserPageMetadata, _exa_codeium_common_pb_BrowserPageMetadata__Output>
      BrowserPageScopeItem: MessageTypeDefinition<_exa_codeium_common_pb_BrowserPageScopeItem, _exa_codeium_common_pb_BrowserPageScopeItem__Output>
      BrowserScrollInteraction: MessageTypeDefinition<_exa_codeium_common_pb_BrowserScrollInteraction, _exa_codeium_common_pb_BrowserScrollInteraction__Output>
      BrowserTextScopeItem: MessageTypeDefinition<_exa_codeium_common_pb_BrowserTextScopeItem, _exa_codeium_common_pb_BrowserTextScopeItem__Output>
      CaptureFileRequestData: MessageTypeDefinition<_exa_codeium_common_pb_CaptureFileRequestData, _exa_codeium_common_pb_CaptureFileRequestData__Output>
      CascadeCommandsAutoExecution: EnumTypeDefinition
      CascadeDataMetadata: MessageTypeDefinition<_exa_codeium_common_pb_CascadeDataMetadata, _exa_codeium_common_pb_CascadeDataMetadata__Output>
      CascadeModelConfigData: MessageTypeDefinition<_exa_codeium_common_pb_CascadeModelConfigData, _exa_codeium_common_pb_CascadeModelConfigData__Output>
      CascadeModelHeaderWarningExperimentPayload: MessageTypeDefinition<_exa_codeium_common_pb_CascadeModelHeaderWarningExperimentPayload, _exa_codeium_common_pb_CascadeModelHeaderWarningExperimentPayload__Output>
      CascadeNUXConfig: MessageTypeDefinition<_exa_codeium_common_pb_CascadeNUXConfig, _exa_codeium_common_pb_CascadeNUXConfig__Output>
      CascadeNUXEvent: EnumTypeDefinition
      CascadeNUXIcon: EnumTypeDefinition
      CascadeNUXLocation: EnumTypeDefinition
      CascadeNUXState: MessageTypeDefinition<_exa_codeium_common_pb_CascadeNUXState, _exa_codeium_common_pb_CascadeNUXState__Output>
      CascadeNUXTrigger: EnumTypeDefinition
      CascadeWebRequestsAutoExecution: EnumTypeDefinition
      CascadeWebSearchTool: EnumTypeDefinition
      CciWithSubrange: MessageTypeDefinition<_exa_codeium_common_pb_CciWithSubrange, _exa_codeium_common_pb_CciWithSubrange__Output>
      ChatCompletionInfo: MessageTypeDefinition<_exa_codeium_common_pb_ChatCompletionInfo, _exa_codeium_common_pb_ChatCompletionInfo__Output>
      ChatMessageSource: EnumTypeDefinition
      ChatNodeConfig: MessageTypeDefinition<_exa_codeium_common_pb_ChatNodeConfig, _exa_codeium_common_pb_ChatNodeConfig__Output>
      ChatStats: MessageTypeDefinition<_exa_codeium_common_pb_ChatStats, _exa_codeium_common_pb_ChatStats__Output>
      ChatStatsByDateEntry: MessageTypeDefinition<_exa_codeium_common_pb_ChatStatsByDateEntry, _exa_codeium_common_pb_ChatStatsByDateEntry__Output>
      ChatStatsByModelEntry: MessageTypeDefinition<_exa_codeium_common_pb_ChatStatsByModelEntry, _exa_codeium_common_pb_ChatStatsByModelEntry__Output>
      ChatToolCall: MessageTypeDefinition<_exa_codeium_common_pb_ChatToolCall, _exa_codeium_common_pb_ChatToolCall__Output>
      ClassInfo: MessageTypeDefinition<_exa_codeium_common_pb_ClassInfo, _exa_codeium_common_pb_ClassInfo__Output>
      ClientModelConfig: MessageTypeDefinition<_exa_codeium_common_pb_ClientModelConfig, _exa_codeium_common_pb_ClientModelConfig__Output>
      ClientModelGroup: MessageTypeDefinition<_exa_codeium_common_pb_ClientModelGroup, _exa_codeium_common_pb_ClientModelGroup__Output>
      ClientModelSort: MessageTypeDefinition<_exa_codeium_common_pb_ClientModelSort, _exa_codeium_common_pb_ClientModelSort__Output>
      CodeAnnotation: MessageTypeDefinition<_exa_codeium_common_pb_CodeAnnotation, _exa_codeium_common_pb_CodeAnnotation__Output>
      CodeAnnotationsState: MessageTypeDefinition<_exa_codeium_common_pb_CodeAnnotationsState, _exa_codeium_common_pb_CodeAnnotationsState__Output>
      CodeContextItem: MessageTypeDefinition<_exa_codeium_common_pb_CodeContextItem, _exa_codeium_common_pb_CodeContextItem__Output>
      CodeContextSource: EnumTypeDefinition
      CodeContextType: EnumTypeDefinition
      CodeDiagnostic: MessageTypeDefinition<_exa_codeium_common_pb_CodeDiagnostic, _exa_codeium_common_pb_CodeDiagnostic__Output>
      CodeMapScopeItem: MessageTypeDefinition<_exa_codeium_common_pb_CodeMapScopeItem, _exa_codeium_common_pb_CodeMapScopeItem__Output>
      CodeSource: EnumTypeDefinition
      CodebaseCluster: MessageTypeDefinition<_exa_codeium_common_pb_CodebaseCluster, _exa_codeium_common_pb_CodebaseCluster__Output>
      CodebaseClusterList: MessageTypeDefinition<_exa_codeium_common_pb_CodebaseClusterList, _exa_codeium_common_pb_CodebaseClusterList__Output>
      CommandPopupAutocomplete: EnumTypeDefinition
      CommandRequestSource: EnumTypeDefinition
      CommandStats: MessageTypeDefinition<_exa_codeium_common_pb_CommandStats, _exa_codeium_common_pb_CommandStats__Output>
      CommandStatsByDateEntry: MessageTypeDefinition<_exa_codeium_common_pb_CommandStatsByDateEntry, _exa_codeium_common_pb_CommandStatsByDateEntry__Output>
      CommitIntentType: EnumTypeDefinition
      Completion: MessageTypeDefinition<_exa_codeium_common_pb_Completion, _exa_codeium_common_pb_Completion__Output>
      CompletionByDateEntry: MessageTypeDefinition<_exa_codeium_common_pb_CompletionByDateEntry, _exa_codeium_common_pb_CompletionByDateEntry__Output>
      CompletionByLanguageEntry: MessageTypeDefinition<_exa_codeium_common_pb_CompletionByLanguageEntry, _exa_codeium_common_pb_CompletionByLanguageEntry__Output>
      CompletionConfiguration: MessageTypeDefinition<_exa_codeium_common_pb_CompletionConfiguration, _exa_codeium_common_pb_CompletionConfiguration__Output>
      CompletionDelta: MessageTypeDefinition<_exa_codeium_common_pb_CompletionDelta, _exa_codeium_common_pb_CompletionDelta__Output>
      CompletionDeltaMap: MessageTypeDefinition<_exa_codeium_common_pb_CompletionDeltaMap, _exa_codeium_common_pb_CompletionDeltaMap__Output>
      CompletionExample: MessageTypeDefinition<_exa_codeium_common_pb_CompletionExample, _exa_codeium_common_pb_CompletionExample__Output>
      CompletionExampleWithMetadata: MessageTypeDefinition<_exa_codeium_common_pb_CompletionExampleWithMetadata, _exa_codeium_common_pb_CompletionExampleWithMetadata__Output>
      CompletionLatencyInfo: MessageTypeDefinition<_exa_codeium_common_pb_CompletionLatencyInfo, _exa_codeium_common_pb_CompletionLatencyInfo__Output>
      CompletionMode: EnumTypeDefinition
      CompletionProfile: MessageTypeDefinition<_exa_codeium_common_pb_CompletionProfile, _exa_codeium_common_pb_CompletionProfile__Output>
      CompletionResponse: MessageTypeDefinition<_exa_codeium_common_pb_CompletionResponse, _exa_codeium_common_pb_CompletionResponse__Output>
      CompletionSource: EnumTypeDefinition
      CompletionStatistics: MessageTypeDefinition<_exa_codeium_common_pb_CompletionStatistics, _exa_codeium_common_pb_CompletionStatistics__Output>
      CompletionType: EnumTypeDefinition
      CompletionWithLatencyInfo: MessageTypeDefinition<_exa_codeium_common_pb_CompletionWithLatencyInfo, _exa_codeium_common_pb_CompletionWithLatencyInfo__Output>
      CompletionsRequest: MessageTypeDefinition<_exa_codeium_common_pb_CompletionsRequest, _exa_codeium_common_pb_CompletionsRequest__Output>
      ConsoleLogLine: MessageTypeDefinition<_exa_codeium_common_pb_ConsoleLogLine, _exa_codeium_common_pb_ConsoleLogLine__Output>
      ConsoleLogScopeItem: MessageTypeDefinition<_exa_codeium_common_pb_ConsoleLogScopeItem, _exa_codeium_common_pb_ConsoleLogScopeItem__Output>
      ContextInclusionType: EnumTypeDefinition
      ContextScope: MessageTypeDefinition<_exa_codeium_common_pb_ContextScope, _exa_codeium_common_pb_ContextScope__Output>
      ContextScopeItem: MessageTypeDefinition<_exa_codeium_common_pb_ContextScopeItem, _exa_codeium_common_pb_ContextScopeItem__Output>
      ContextScopeType: EnumTypeDefinition
      ContextSnippetType: EnumTypeDefinition
      ContextSubrange: MessageTypeDefinition<_exa_codeium_common_pb_ContextSubrange, _exa_codeium_common_pb_ContextSubrange__Output>
      ConversationBrainConfig: MessageTypeDefinition<_exa_codeium_common_pb_ConversationBrainConfig, _exa_codeium_common_pb_ConversationBrainConfig__Output>
      ConversationScopeItem: MessageTypeDefinition<_exa_codeium_common_pb_ConversationScopeItem, _exa_codeium_common_pb_ConversationScopeItem__Output>
      ConversationalPlannerMode: EnumTypeDefinition
      CortexErrorCategory: EnumTypeDefinition
      CustomProviderSettings: MessageTypeDefinition<_exa_codeium_common_pb_CustomProviderSettings, _exa_codeium_common_pb_CustomProviderSettings__Output>
      DOMElementScopeItem: MessageTypeDefinition<_exa_codeium_common_pb_DOMElementScopeItem, _exa_codeium_common_pb_DOMElementScopeItem__Output>
      DOMTree: MessageTypeDefinition<_exa_codeium_common_pb_DOMTree, _exa_codeium_common_pb_DOMTree__Output>
      DeepWikiModelType: EnumTypeDefinition
      DefaultOverrideModelConfig: MessageTypeDefinition<_exa_codeium_common_pb_DefaultOverrideModelConfig, _exa_codeium_common_pb_DefaultOverrideModelConfig__Output>
      DefaultPinnedContextConfig: MessageTypeDefinition<_exa_codeium_common_pb_DefaultPinnedContextConfig, _exa_codeium_common_pb_DefaultPinnedContextConfig__Output>
      DeployTarget: MessageTypeDefinition<_exa_codeium_common_pb_DeployTarget, _exa_codeium_common_pb_DeployTarget__Output>
      DeploymentBuildStatus: EnumTypeDefinition
      DeploymentProvider: EnumTypeDefinition
      DiagnosticFix: MessageTypeDefinition<_exa_codeium_common_pb_DiagnosticFix, _exa_codeium_common_pb_DiagnosticFix__Output>
      Document: MessageTypeDefinition<_exa_codeium_common_pb_Document, _exa_codeium_common_pb_Document__Output>
      DocumentLinesElement: MessageTypeDefinition<_exa_codeium_common_pb_DocumentLinesElement, _exa_codeium_common_pb_DocumentLinesElement__Output>
      DocumentOutline: MessageTypeDefinition<_exa_codeium_common_pb_DocumentOutline, _exa_codeium_common_pb_DocumentOutline__Output>
      DocumentOutlineElement: MessageTypeDefinition<_exa_codeium_common_pb_DocumentOutlineElement, _exa_codeium_common_pb_DocumentOutlineElement__Output>
      DocumentPosition: MessageTypeDefinition<_exa_codeium_common_pb_DocumentPosition, _exa_codeium_common_pb_DocumentPosition__Output>
      DocumentQuery: MessageTypeDefinition<_exa_codeium_common_pb_DocumentQuery, _exa_codeium_common_pb_DocumentQuery__Output>
      DocumentType: EnumTypeDefinition
      EditorOptions: MessageTypeDefinition<_exa_codeium_common_pb_EditorOptions, _exa_codeium_common_pb_EditorOptions__Output>
      EmbedType: EnumTypeDefinition
      Embedding: MessageTypeDefinition<_exa_codeium_common_pb_Embedding, _exa_codeium_common_pb_Embedding__Output>
      EmbeddingMetadata: MessageTypeDefinition<_exa_codeium_common_pb_EmbeddingMetadata, _exa_codeium_common_pb_EmbeddingMetadata__Output>
      EmbeddingPrefix: EnumTypeDefinition
      EmbeddingPriority: EnumTypeDefinition
      EmbeddingResponse: MessageTypeDefinition<_exa_codeium_common_pb_EmbeddingResponse, _exa_codeium_common_pb_EmbeddingResponse__Output>
      EmbeddingSource: EnumTypeDefinition
      EmbeddingsRequest: MessageTypeDefinition<_exa_codeium_common_pb_EmbeddingsRequest, _exa_codeium_common_pb_EmbeddingsRequest__Output>
      ErrorTrace: MessageTypeDefinition<_exa_codeium_common_pb_ErrorTrace, _exa_codeium_common_pb_ErrorTrace__Output>
      Event: MessageTypeDefinition<_exa_codeium_common_pb_Event, _exa_codeium_common_pb_Event__Output>
      EventType: EnumTypeDefinition
      ExperimentConfig: MessageTypeDefinition<_exa_codeium_common_pb_ExperimentConfig, _exa_codeium_common_pb_ExperimentConfig__Output>
      ExperimentKey: EnumTypeDefinition
      ExperimentLanguageServerVersionPayload: MessageTypeDefinition<_exa_codeium_common_pb_ExperimentLanguageServerVersionPayload, _exa_codeium_common_pb_ExperimentLanguageServerVersionPayload__Output>
      ExperimentMiddleModeTokenPayload: MessageTypeDefinition<_exa_codeium_common_pb_ExperimentMiddleModeTokenPayload, _exa_codeium_common_pb_ExperimentMiddleModeTokenPayload__Output>
      ExperimentModelConfigPayload: MessageTypeDefinition<_exa_codeium_common_pb_ExperimentModelConfigPayload, _exa_codeium_common_pb_ExperimentModelConfigPayload__Output>
      ExperimentMultilineModelThresholdPayload: MessageTypeDefinition<_exa_codeium_common_pb_ExperimentMultilineModelThresholdPayload, _exa_codeium_common_pb_ExperimentMultilineModelThresholdPayload__Output>
      ExperimentProfilingTelemetrySampleRatePayload: MessageTypeDefinition<_exa_codeium_common_pb_ExperimentProfilingTelemetrySampleRatePayload, _exa_codeium_common_pb_ExperimentProfilingTelemetrySampleRatePayload__Output>
      ExperimentSentryPayload: MessageTypeDefinition<_exa_codeium_common_pb_ExperimentSentryPayload, _exa_codeium_common_pb_ExperimentSentryPayload__Output>
      ExperimentSource: EnumTypeDefinition
      ExperimentWithVariant: MessageTypeDefinition<_exa_codeium_common_pb_ExperimentWithVariant, _exa_codeium_common_pb_ExperimentWithVariant__Output>
      ExtensionPanelTab: EnumTypeDefinition
      ExternalModel: MessageTypeDefinition<_exa_codeium_common_pb_ExternalModel, _exa_codeium_common_pb_ExternalModel__Output>
      FaissStateStats: MessageTypeDefinition<_exa_codeium_common_pb_FaissStateStats, _exa_codeium_common_pb_FaissStateStats__Output>
      FastStatus: MessageTypeDefinition<_exa_codeium_common_pb_FastStatus, _exa_codeium_common_pb_FastStatus__Output>
      FeatureUsageData: MessageTypeDefinition<_exa_codeium_common_pb_FeatureUsageData, _exa_codeium_common_pb_FeatureUsageData__Output>
      FeatureUsageType: EnumTypeDefinition
      FileLineRange: MessageTypeDefinition<_exa_codeium_common_pb_FileLineRange, _exa_codeium_common_pb_FileLineRange__Output>
      FileRangeContent: MessageTypeDefinition<_exa_codeium_common_pb_FileRangeContent, _exa_codeium_common_pb_FileRangeContent__Output>
      FilterReason: EnumTypeDefinition
      FontSize: EnumTypeDefinition
      FunctionInfo: MessageTypeDefinition<_exa_codeium_common_pb_FunctionInfo, _exa_codeium_common_pb_FunctionInfo__Output>
      GRPCStatus: MessageTypeDefinition<_exa_codeium_common_pb_GRPCStatus, _exa_codeium_common_pb_GRPCStatus__Output>
      GitCommitData: MessageTypeDefinition<_exa_codeium_common_pb_GitCommitData, _exa_codeium_common_pb_GitCommitData__Output>
      GitDiffData: MessageTypeDefinition<_exa_codeium_common_pb_GitDiffData, _exa_codeium_common_pb_GitDiffData__Output>
      GitRepoInfo: MessageTypeDefinition<_exa_codeium_common_pb_GitRepoInfo, _exa_codeium_common_pb_GitRepoInfo__Output>
      GitScopeItem: MessageTypeDefinition<_exa_codeium_common_pb_GitScopeItem, _exa_codeium_common_pb_GitScopeItem__Output>
      GitWorkingChangesData: MessageTypeDefinition<_exa_codeium_common_pb_GitWorkingChangesData, _exa_codeium_common_pb_GitWorkingChangesData__Output>
      GithubPullRequestItem: MessageTypeDefinition<_exa_codeium_common_pb_GithubPullRequestItem, _exa_codeium_common_pb_GithubPullRequestItem__Output>
      GpuType: EnumTypeDefinition
      GraphExecutionState: MessageTypeDefinition<_exa_codeium_common_pb_GraphExecutionState, _exa_codeium_common_pb_GraphExecutionState__Output>
      Guideline: MessageTypeDefinition<_exa_codeium_common_pb_Guideline, _exa_codeium_common_pb_Guideline__Output>
      GuidelineItem: MessageTypeDefinition<_exa_codeium_common_pb_GuidelineItem, _exa_codeium_common_pb_GuidelineItem__Output>
      ImageData: MessageTypeDefinition<_exa_codeium_common_pb_ImageData, _exa_codeium_common_pb_ImageData__Output>
      IndexChoice: EnumTypeDefinition
      IndexerDbStats: MessageTypeDefinition<_exa_codeium_common_pb_IndexerDbStats, _exa_codeium_common_pb_IndexerDbStats__Output>
      IndexerStats: MessageTypeDefinition<_exa_codeium_common_pb_IndexerStats, _exa_codeium_common_pb_IndexerStats__Output>
      IntellisenseSuggestion: MessageTypeDefinition<_exa_codeium_common_pb_IntellisenseSuggestion, _exa_codeium_common_pb_IntellisenseSuggestion__Output>
      KnowledgeBaseChunk: MessageTypeDefinition<_exa_codeium_common_pb_KnowledgeBaseChunk, _exa_codeium_common_pb_KnowledgeBaseChunk__Output>
      KnowledgeBaseGroup: MessageTypeDefinition<_exa_codeium_common_pb_KnowledgeBaseGroup, _exa_codeium_common_pb_KnowledgeBaseGroup__Output>
      KnowledgeBaseItem: MessageTypeDefinition<_exa_codeium_common_pb_KnowledgeBaseItem, _exa_codeium_common_pb_KnowledgeBaseItem__Output>
      KnowledgeBaseItemWithMetadata: MessageTypeDefinition<_exa_codeium_common_pb_KnowledgeBaseItemWithMetadata, _exa_codeium_common_pb_KnowledgeBaseItemWithMetadata__Output>
      KnowledgeBaseScopeItem: MessageTypeDefinition<_exa_codeium_common_pb_KnowledgeBaseScopeItem, _exa_codeium_common_pb_KnowledgeBaseScopeItem__Output>
      Language: EnumTypeDefinition
      LanguageServerDiagnostics: MessageTypeDefinition<_exa_codeium_common_pb_LanguageServerDiagnostics, _exa_codeium_common_pb_LanguageServerDiagnostics__Output>
      LastUpdateRecord: MessageTypeDefinition<_exa_codeium_common_pb_LastUpdateRecord, _exa_codeium_common_pb_LastUpdateRecord__Output>
      LastUpdateType: EnumTypeDefinition
      LifeguardConfig: MessageTypeDefinition<_exa_codeium_common_pb_LifeguardConfig, _exa_codeium_common_pb_LifeguardConfig__Output>
      LifeguardModeConfig: MessageTypeDefinition<_exa_codeium_common_pb_LifeguardModeConfig, _exa_codeium_common_pb_LifeguardModeConfig__Output>
      LocalSqliteFaissDbStats: MessageTypeDefinition<_exa_codeium_common_pb_LocalSqliteFaissDbStats, _exa_codeium_common_pb_LocalSqliteFaissDbStats__Output>
      LspReference: MessageTypeDefinition<_exa_codeium_common_pb_LspReference, _exa_codeium_common_pb_LspReference__Output>
      MQueryConfig: MessageTypeDefinition<_exa_codeium_common_pb_MQueryConfig, _exa_codeium_common_pb_MQueryConfig__Output>
      MarkdownChunk: MessageTypeDefinition<_exa_codeium_common_pb_MarkdownChunk, _exa_codeium_common_pb_MarkdownChunk__Output>
      MarkdownNodeType: EnumTypeDefinition
      McpCommandTemplate: MessageTypeDefinition<_exa_codeium_common_pb_McpCommandTemplate, _exa_codeium_common_pb_McpCommandTemplate__Output>
      McpCommandVariable: MessageTypeDefinition<_exa_codeium_common_pb_McpCommandVariable, _exa_codeium_common_pb_McpCommandVariable__Output>
      McpLocalServer: MessageTypeDefinition<_exa_codeium_common_pb_McpLocalServer, _exa_codeium_common_pb_McpLocalServer__Output>
      McpPromptScopeItem: MessageTypeDefinition<_exa_codeium_common_pb_McpPromptScopeItem, _exa_codeium_common_pb_McpPromptScopeItem__Output>
      McpRemoteServer: MessageTypeDefinition<_exa_codeium_common_pb_McpRemoteServer, _exa_codeium_common_pb_McpRemoteServer__Output>
      McpResourceItem: MessageTypeDefinition<_exa_codeium_common_pb_McpResourceItem, _exa_codeium_common_pb_McpResourceItem__Output>
      McpServerCommand: MessageTypeDefinition<_exa_codeium_common_pb_McpServerCommand, _exa_codeium_common_pb_McpServerCommand__Output>
      McpServerConfig: MessageTypeDefinition<_exa_codeium_common_pb_McpServerConfig, _exa_codeium_common_pb_McpServerConfig__Output>
      McpServerTemplate: MessageTypeDefinition<_exa_codeium_common_pb_McpServerTemplate, _exa_codeium_common_pb_McpServerTemplate__Output>
      Metadata: MessageTypeDefinition<_exa_codeium_common_pb_Metadata, _exa_codeium_common_pb_Metadata__Output>
      MetricsRecord: MessageTypeDefinition<_exa_codeium_common_pb_MetricsRecord, _exa_codeium_common_pb_MetricsRecord__Output>
      MockResponseData: MessageTypeDefinition<_exa_codeium_common_pb_MockResponseData, _exa_codeium_common_pb_MockResponseData__Output>
      Model: EnumTypeDefinition
      ModelAlias: EnumTypeDefinition
      ModelConfig: MessageTypeDefinition<_exa_codeium_common_pb_ModelConfig, _exa_codeium_common_pb_ModelConfig__Output>
      ModelCostTier: EnumTypeDefinition
      ModelFeatures: MessageTypeDefinition<_exa_codeium_common_pb_ModelFeatures, _exa_codeium_common_pb_ModelFeatures__Output>
      ModelInfo: MessageTypeDefinition<_exa_codeium_common_pb_ModelInfo, _exa_codeium_common_pb_ModelInfo__Output>
      ModelNotification: MessageTypeDefinition<_exa_codeium_common_pb_ModelNotification, _exa_codeium_common_pb_ModelNotification__Output>
      ModelNotificationExperimentPayload: MessageTypeDefinition<_exa_codeium_common_pb_ModelNotificationExperimentPayload, _exa_codeium_common_pb_ModelNotificationExperimentPayload__Output>
      ModelOrAlias: MessageTypeDefinition<_exa_codeium_common_pb_ModelOrAlias, _exa_codeium_common_pb_ModelOrAlias__Output>
      ModelPricingType: EnumTypeDefinition
      ModelProvider: EnumTypeDefinition
      ModelStatus: EnumTypeDefinition
      ModelStatusInfo: MessageTypeDefinition<_exa_codeium_common_pb_ModelStatusInfo, _exa_codeium_common_pb_ModelStatusInfo__Output>
      ModelType: EnumTypeDefinition
      ModelUsageStats: MessageTypeDefinition<_exa_codeium_common_pb_ModelUsageStats, _exa_codeium_common_pb_ModelUsageStats__Output>
      NodeExecutionRecord: MessageTypeDefinition<_exa_codeium_common_pb_NodeExecutionRecord, _exa_codeium_common_pb_NodeExecutionRecord__Output>
      OnboardingActionType: EnumTypeDefinition
      PackedStreamingCompletionMaps: MessageTypeDefinition<_exa_codeium_common_pb_PackedStreamingCompletionMaps, _exa_codeium_common_pb_PackedStreamingCompletionMaps__Output>
      PartialIndexMetadata: MessageTypeDefinition<_exa_codeium_common_pb_PartialIndexMetadata, _exa_codeium_common_pb_PartialIndexMetadata__Output>
      PathScopeItem: MessageTypeDefinition<_exa_codeium_common_pb_PathScopeItem, _exa_codeium_common_pb_PathScopeItem__Output>
      PerforceDepotInfo: MessageTypeDefinition<_exa_codeium_common_pb_PerforceDepotInfo, _exa_codeium_common_pb_PerforceDepotInfo__Output>
      Permission: EnumTypeDefinition
      PinnedContext: MessageTypeDefinition<_exa_codeium_common_pb_PinnedContext, _exa_codeium_common_pb_PinnedContext__Output>
      PinnedContextConfig: MessageTypeDefinition<_exa_codeium_common_pb_PinnedContextConfig, _exa_codeium_common_pb_PinnedContextConfig__Output>
      PlanFileScopeItem: MessageTypeDefinition<_exa_codeium_common_pb_PlanFileScopeItem, _exa_codeium_common_pb_PlanFileScopeItem__Output>
      PlanInfo: MessageTypeDefinition<_exa_codeium_common_pb_PlanInfo, _exa_codeium_common_pb_PlanInfo__Output>
      PlanMode: EnumTypeDefinition
      PlanStatus: MessageTypeDefinition<_exa_codeium_common_pb_PlanStatus, _exa_codeium_common_pb_PlanStatus__Output>
      PostgresDbStats: MessageTypeDefinition<_exa_codeium_common_pb_PostgresDbStats, _exa_codeium_common_pb_PostgresDbStats__Output>
      ProductEvent: MessageTypeDefinition<_exa_codeium_common_pb_ProductEvent, _exa_codeium_common_pb_ProductEvent__Output>
      ProductEventType: EnumTypeDefinition
      PromoStatus: MessageTypeDefinition<_exa_codeium_common_pb_PromoStatus, _exa_codeium_common_pb_PromoStatus__Output>
      PromptAnnotationKind: EnumTypeDefinition
      PromptAnnotationRange: MessageTypeDefinition<_exa_codeium_common_pb_PromptAnnotationRange, _exa_codeium_common_pb_PromptAnnotationRange__Output>
      PromptComponents: MessageTypeDefinition<_exa_codeium_common_pb_PromptComponents, _exa_codeium_common_pb_PromptComponents__Output>
      PromptElementExclusionReason: EnumTypeDefinition
      PromptElementInclusionMetadata: MessageTypeDefinition<_exa_codeium_common_pb_PromptElementInclusionMetadata, _exa_codeium_common_pb_PromptElementInclusionMetadata__Output>
      PromptElementKind: EnumTypeDefinition
      PromptElementKindInfo: MessageTypeDefinition<_exa_codeium_common_pb_PromptElementKindInfo, _exa_codeium_common_pb_PromptElementKindInfo__Output>
      PromptElementRange: MessageTypeDefinition<_exa_codeium_common_pb_PromptElementRange, _exa_codeium_common_pb_PromptElementRange__Output>
      PromptStageLatency: MessageTypeDefinition<_exa_codeium_common_pb_PromptStageLatency, _exa_codeium_common_pb_PromptStageLatency__Output>
      PromptTemplaterType: EnumTypeDefinition
      ProviderSource: EnumTypeDefinition
      Range: MessageTypeDefinition<_exa_codeium_common_pb_Range, _exa_codeium_common_pb_Range__Output>
      RecipeScopeItem: MessageTypeDefinition<_exa_codeium_common_pb_RecipeScopeItem, _exa_codeium_common_pb_RecipeScopeItem__Output>
      RefreshCustomizationType: EnumTypeDefinition
      RememberLastModelSelection: EnumTypeDefinition
      Repository: MessageTypeDefinition<_exa_codeium_common_pb_Repository, _exa_codeium_common_pb_Repository__Output>
      RepositoryPath: MessageTypeDefinition<_exa_codeium_common_pb_RepositoryPath, _exa_codeium_common_pb_RepositoryPath__Output>
      RepositoryPathScopeItem: MessageTypeDefinition<_exa_codeium_common_pb_RepositoryPathScopeItem, _exa_codeium_common_pb_RepositoryPathScopeItem__Output>
      RepositoryScopeItem: MessageTypeDefinition<_exa_codeium_common_pb_RepositoryScopeItem, _exa_codeium_common_pb_RepositoryScopeItem__Output>
      RewardsRequest: MessageTypeDefinition<_exa_codeium_common_pb_RewardsRequest, _exa_codeium_common_pb_RewardsRequest__Output>
      RewardsResponse: MessageTypeDefinition<_exa_codeium_common_pb_RewardsResponse, _exa_codeium_common_pb_RewardsResponse__Output>
      Rule: MessageTypeDefinition<_exa_codeium_common_pb_Rule, _exa_codeium_common_pb_Rule__Output>
      RuleScopeItem: MessageTypeDefinition<_exa_codeium_common_pb_RuleScopeItem, _exa_codeium_common_pb_RuleScopeItem__Output>
      RuleViolation: MessageTypeDefinition<_exa_codeium_common_pb_RuleViolation, _exa_codeium_common_pb_RuleViolation__Output>
      ScmProvider: EnumTypeDefinition
      ScmType: EnumTypeDefinition
      ScmWorkspaceInfo: MessageTypeDefinition<_exa_codeium_common_pb_ScmWorkspaceInfo, _exa_codeium_common_pb_ScmWorkspaceInfo__Output>
      SearchResultRecord: MessageTypeDefinition<_exa_codeium_common_pb_SearchResultRecord, _exa_codeium_common_pb_SearchResultRecord__Output>
      SearchResultType: EnumTypeDefinition
      ShadowTarget: MessageTypeDefinition<_exa_codeium_common_pb_ShadowTarget, _exa_codeium_common_pb_ShadowTarget__Output>
      ShadowTargetList: MessageTypeDefinition<_exa_codeium_common_pb_ShadowTargetList, _exa_codeium_common_pb_ShadowTargetList__Output>
      ShadowTrafficConfig: MessageTypeDefinition<_exa_codeium_common_pb_ShadowTrafficConfig, _exa_codeium_common_pb_ShadowTrafficConfig__Output>
      SingleModelCompletionProfile: MessageTypeDefinition<_exa_codeium_common_pb_SingleModelCompletionProfile, _exa_codeium_common_pb_SingleModelCompletionProfile__Output>
      SkillScopeItem: MessageTypeDefinition<_exa_codeium_common_pb_SkillScopeItem, _exa_codeium_common_pb_SkillScopeItem__Output>
      SnippetWithWordCount: MessageTypeDefinition<_exa_codeium_common_pb_SnippetWithWordCount, _exa_codeium_common_pb_SnippetWithWordCount__Output>
      Status: MessageTypeDefinition<_exa_codeium_common_pb_Status, _exa_codeium_common_pb_Status__Output>
      StatusLevel: EnumTypeDefinition
      StopReason: EnumTypeDefinition
      StreamingCompletion: MessageTypeDefinition<_exa_codeium_common_pb_StreamingCompletion, _exa_codeium_common_pb_StreamingCompletion__Output>
      StreamingCompletionInfo: MessageTypeDefinition<_exa_codeium_common_pb_StreamingCompletionInfo, _exa_codeium_common_pb_StreamingCompletionInfo__Output>
      StreamingCompletionMap: MessageTypeDefinition<_exa_codeium_common_pb_StreamingCompletionMap, _exa_codeium_common_pb_StreamingCompletionMap__Output>
      StreamingCompletionResponse: MessageTypeDefinition<_exa_codeium_common_pb_StreamingCompletionResponse, _exa_codeium_common_pb_StreamingCompletionResponse__Output>
      StreamingEvalSuffixInfo: MessageTypeDefinition<_exa_codeium_common_pb_StreamingEvalSuffixInfo, _exa_codeium_common_pb_StreamingEvalSuffixInfo__Output>
      SuperCompleteFilterReason: MessageTypeDefinition<_exa_codeium_common_pb_SuperCompleteFilterReason, _exa_codeium_common_pb_SuperCompleteFilterReason__Output>
      SupercompleteTriggerCondition: EnumTypeDefinition
      TabToJump: EnumTypeDefinition
      TeamConfig: MessageTypeDefinition<_exa_codeium_common_pb_TeamConfig, _exa_codeium_common_pb_TeamConfig__Output>
      TeamOrganizationalControls: MessageTypeDefinition<_exa_codeium_common_pb_TeamOrganizationalControls, _exa_codeium_common_pb_TeamOrganizationalControls__Output>
      TeamsFeatures: EnumTypeDefinition
      TeamsFeaturesMetadata: MessageTypeDefinition<_exa_codeium_common_pb_TeamsFeaturesMetadata, _exa_codeium_common_pb_TeamsFeaturesMetadata__Output>
      TeamsTier: EnumTypeDefinition
      TerminalCommandData: MessageTypeDefinition<_exa_codeium_common_pb_TerminalCommandData, _exa_codeium_common_pb_TerminalCommandData__Output>
      TerminalScopeItem: MessageTypeDefinition<_exa_codeium_common_pb_TerminalScopeItem, _exa_codeium_common_pb_TerminalScopeItem__Output>
      TerminalShellCommand: MessageTypeDefinition<_exa_codeium_common_pb_TerminalShellCommand, _exa_codeium_common_pb_TerminalShellCommand__Output>
      TerminalShellCommandData: MessageTypeDefinition<_exa_codeium_common_pb_TerminalShellCommandData, _exa_codeium_common_pb_TerminalShellCommandData__Output>
      TerminalShellCommandHeader: MessageTypeDefinition<_exa_codeium_common_pb_TerminalShellCommandHeader, _exa_codeium_common_pb_TerminalShellCommandHeader__Output>
      TerminalShellCommandSource: EnumTypeDefinition
      TerminalShellCommandStatus: EnumTypeDefinition
      TerminalShellCommandStreamChunk: MessageTypeDefinition<_exa_codeium_common_pb_TerminalShellCommandStreamChunk, _exa_codeium_common_pb_TerminalShellCommandStreamChunk__Output>
      TerminalShellCommandTrailer: MessageTypeDefinition<_exa_codeium_common_pb_TerminalShellCommandTrailer, _exa_codeium_common_pb_TerminalShellCommandTrailer__Output>
      TextBlock: MessageTypeDefinition<_exa_codeium_common_pb_TextBlock, _exa_codeium_common_pb_TextBlock__Output>
      TextData: MessageTypeDefinition<_exa_codeium_common_pb_TextData, _exa_codeium_common_pb_TextData__Output>
      TextOrScopeItem: MessageTypeDefinition<_exa_codeium_common_pb_TextOrScopeItem, _exa_codeium_common_pb_TextOrScopeItem__Output>
      ThemePreference: EnumTypeDefinition
      ThirdPartyWebSearchConfig: MessageTypeDefinition<_exa_codeium_common_pb_ThirdPartyWebSearchConfig, _exa_codeium_common_pb_ThirdPartyWebSearchConfig__Output>
      ThirdPartyWebSearchModel: EnumTypeDefinition
      ThirdPartyWebSearchProvider: EnumTypeDefinition
      ToolFormatterType: EnumTypeDefinition
      TopUpStatus: MessageTypeDefinition<_exa_codeium_common_pb_TopUpStatus, _exa_codeium_common_pb_TopUpStatus__Output>
      TrajectoryDescription: MessageTypeDefinition<_exa_codeium_common_pb_TrajectoryDescription, _exa_codeium_common_pb_TrajectoryDescription__Output>
      TrajectoryType: EnumTypeDefinition
      TransactionStatus: EnumTypeDefinition
      UnleashContext: MessageTypeDefinition<_exa_codeium_common_pb_UnleashContext, _exa_codeium_common_pb_UnleashContext__Output>
      UserActivityScopeItem: MessageTypeDefinition<_exa_codeium_common_pb_UserActivityScopeItem, _exa_codeium_common_pb_UserActivityScopeItem__Output>
      UserFeatures: EnumTypeDefinition
      UserNUXEvent: EnumTypeDefinition
      UserNUXState: MessageTypeDefinition<_exa_codeium_common_pb_UserNUXState, _exa_codeium_common_pb_UserNUXState__Output>
      UserSettings: MessageTypeDefinition<_exa_codeium_common_pb_UserSettings, _exa_codeium_common_pb_UserSettings__Output>
      UserStatus: MessageTypeDefinition<_exa_codeium_common_pb_UserStatus, _exa_codeium_common_pb_UserStatus__Output>
      UserTableStats: MessageTypeDefinition<_exa_codeium_common_pb_UserTableStats, _exa_codeium_common_pb_UserTableStats__Output>
      UserTeamStatus: EnumTypeDefinition
      ValidationStatus: EnumTypeDefinition
      WebAppDeploymentConfig: MessageTypeDefinition<_exa_codeium_common_pb_WebAppDeploymentConfig, _exa_codeium_common_pb_WebAppDeploymentConfig__Output>
      WebDocsOption: MessageTypeDefinition<_exa_codeium_common_pb_WebDocsOption, _exa_codeium_common_pb_WebDocsOption__Output>
      WindsurfDeployment: MessageTypeDefinition<_exa_codeium_common_pb_WindsurfDeployment, _exa_codeium_common_pb_WindsurfDeployment__Output>
      WindsurfProject: MessageTypeDefinition<_exa_codeium_common_pb_WindsurfProject, _exa_codeium_common_pb_WindsurfProject__Output>
      WordCount: MessageTypeDefinition<_exa_codeium_common_pb_WordCount, _exa_codeium_common_pb_WordCount__Output>
      WorkspaceIndexData: MessageTypeDefinition<_exa_codeium_common_pb_WorkspaceIndexData, _exa_codeium_common_pb_WorkspaceIndexData__Output>
      WorkspacePath: MessageTypeDefinition<_exa_codeium_common_pb_WorkspacePath, _exa_codeium_common_pb_WorkspacePath__Output>
      WorkspaceStats: MessageTypeDefinition<_exa_codeium_common_pb_WorkspaceStats, _exa_codeium_common_pb_WorkspaceStats__Output>
    }
    context_module_pb: {
      CciWithSubrangeWithRetrievalMetadata: MessageTypeDefinition<_exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata, _exa_context_module_pb_CciWithSubrangeWithRetrievalMetadata__Output>
      CodeContextItemIndexStats: MessageTypeDefinition<_exa_context_module_pb_CodeContextItemIndexStats, _exa_context_module_pb_CodeContextItemIndexStats__Output>
      CodeContextItemWithRetrievalMetadata: MessageTypeDefinition<_exa_context_module_pb_CodeContextItemWithRetrievalMetadata, _exa_context_module_pb_CodeContextItemWithRetrievalMetadata__Output>
      CodeContextProviderMetadata: MessageTypeDefinition<_exa_context_module_pb_CodeContextProviderMetadata, _exa_context_module_pb_CodeContextProviderMetadata__Output>
      ContextChangeActiveDocument: MessageTypeDefinition<_exa_context_module_pb_ContextChangeActiveDocument, _exa_context_module_pb_ContextChangeActiveDocument__Output>
      ContextChangeActiveNode: MessageTypeDefinition<_exa_context_module_pb_ContextChangeActiveNode, _exa_context_module_pb_ContextChangeActiveNode__Output>
      ContextChangeChatMessageReceived: MessageTypeDefinition<_exa_context_module_pb_ContextChangeChatMessageReceived, _exa_context_module_pb_ContextChangeChatMessageReceived__Output>
      ContextChangeCursorPosition: MessageTypeDefinition<_exa_context_module_pb_ContextChangeCursorPosition, _exa_context_module_pb_ContextChangeCursorPosition__Output>
      ContextChangeEvent: MessageTypeDefinition<_exa_context_module_pb_ContextChangeEvent, _exa_context_module_pb_ContextChangeEvent__Output>
      ContextChangeOpenDocuments: MessageTypeDefinition<_exa_context_module_pb_ContextChangeOpenDocuments, _exa_context_module_pb_ContextChangeOpenDocuments__Output>
      ContextChangeOracleItems: MessageTypeDefinition<_exa_context_module_pb_ContextChangeOracleItems, _exa_context_module_pb_ContextChangeOracleItems__Output>
      ContextChangePinnedContext: MessageTypeDefinition<_exa_context_module_pb_ContextChangePinnedContext, _exa_context_module_pb_ContextChangePinnedContext__Output>
      ContextChangePinnedGuideline: MessageTypeDefinition<_exa_context_module_pb_ContextChangePinnedGuideline, _exa_context_module_pb_ContextChangePinnedGuideline__Output>
      ContextChangeType: EnumTypeDefinition
      ContextModuleResult: MessageTypeDefinition<_exa_context_module_pb_ContextModuleResult, _exa_context_module_pb_ContextModuleResult__Output>
      ContextModuleStateStats: MessageTypeDefinition<_exa_context_module_pb_ContextModuleStateStats, _exa_context_module_pb_ContextModuleStateStats__Output>
      ContextModuleStats: MessageTypeDefinition<_exa_context_module_pb_ContextModuleStats, _exa_context_module_pb_ContextModuleStats__Output>
      ContextRefreshReason: EnumTypeDefinition
      ContextUseCase: EnumTypeDefinition
      FileNameWithRetrievalMetadata: MessageTypeDefinition<_exa_context_module_pb_FileNameWithRetrievalMetadata, _exa_context_module_pb_FileNameWithRetrievalMetadata__Output>
      LocalNodeState: MessageTypeDefinition<_exa_context_module_pb_LocalNodeState, _exa_context_module_pb_LocalNodeState__Output>
      PersistentContextModuleState: MessageTypeDefinition<_exa_context_module_pb_PersistentContextModuleState, _exa_context_module_pb_PersistentContextModuleState__Output>
      RetrievedCodeContextItemMetadata: MessageTypeDefinition<_exa_context_module_pb_RetrievedCodeContextItemMetadata, _exa_context_module_pb_RetrievedCodeContextItemMetadata__Output>
    }
    cortex_pb: {
      AcknowledgementType: EnumTypeDefinition
      ActionDebugInfo: MessageTypeDefinition<_exa_cortex_pb_ActionDebugInfo, _exa_cortex_pb_ActionDebugInfo__Output>
      ActionResult: MessageTypeDefinition<_exa_cortex_pb_ActionResult, _exa_cortex_pb_ActionResult__Output>
      ActionResultEdit: MessageTypeDefinition<_exa_cortex_pb_ActionResultEdit, _exa_cortex_pb_ActionResultEdit__Output>
      ActionSpec: MessageTypeDefinition<_exa_cortex_pb_ActionSpec, _exa_cortex_pb_ActionSpec__Output>
      ActionSpecCommand: MessageTypeDefinition<_exa_cortex_pb_ActionSpecCommand, _exa_cortex_pb_ActionSpecCommand__Output>
      ActionSpecCreateFile: MessageTypeDefinition<_exa_cortex_pb_ActionSpecCreateFile, _exa_cortex_pb_ActionSpecCreateFile__Output>
      ActionSpecDeleteFile: MessageTypeDefinition<_exa_cortex_pb_ActionSpecDeleteFile, _exa_cortex_pb_ActionSpecDeleteFile__Output>
      ActionState: MessageTypeDefinition<_exa_cortex_pb_ActionState, _exa_cortex_pb_ActionState__Output>
      ActionStatus: EnumTypeDefinition
      ActiveUserState: MessageTypeDefinition<_exa_cortex_pb_ActiveUserState, _exa_cortex_pb_ActiveUserState__Output>
      AddAnnotationConfig: MessageTypeDefinition<_exa_cortex_pb_AddAnnotationConfig, _exa_cortex_pb_AddAnnotationConfig__Output>
      AgenticMixin: EnumTypeDefinition
      ArenaModeInfo: MessageTypeDefinition<_exa_cortex_pb_ArenaModeInfo, _exa_cortex_pb_ArenaModeInfo__Output>
      AskUserQuestionOption: MessageTypeDefinition<_exa_cortex_pb_AskUserQuestionOption, _exa_cortex_pb_AskUserQuestionOption__Output>
      AskUserQuestionToolConfig: MessageTypeDefinition<_exa_cortex_pb_AskUserQuestionToolConfig, _exa_cortex_pb_AskUserQuestionToolConfig__Output>
      AutoCascadeBroadcastToolConfig: MessageTypeDefinition<_exa_cortex_pb_AutoCascadeBroadcastToolConfig, _exa_cortex_pb_AutoCascadeBroadcastToolConfig__Output>
      AutoCommandConfig: MessageTypeDefinition<_exa_cortex_pb_AutoCommandConfig, _exa_cortex_pb_AutoCommandConfig__Output>
      AutoFixLintsConfig: MessageTypeDefinition<_exa_cortex_pb_AutoFixLintsConfig, _exa_cortex_pb_AutoFixLintsConfig__Output>
      AutoRunDecision: EnumTypeDefinition
      AutoWebRequestConfig: MessageTypeDefinition<_exa_cortex_pb_AutoWebRequestConfig, _exa_cortex_pb_AutoWebRequestConfig__Output>
      BaseTrajectoryIdentifier: MessageTypeDefinition<_exa_cortex_pb_BaseTrajectoryIdentifier, _exa_cortex_pb_BaseTrajectoryIdentifier__Output>
      BrainConfig: MessageTypeDefinition<_exa_cortex_pb_BrainConfig, _exa_cortex_pb_BrainConfig__Output>
      BrainEntry: MessageTypeDefinition<_exa_cortex_pb_BrainEntry, _exa_cortex_pb_BrainEntry__Output>
      BrainEntryDelta: MessageTypeDefinition<_exa_cortex_pb_BrainEntryDelta, _exa_cortex_pb_BrainEntryDelta__Output>
      BrainEntryDeltaSummary: MessageTypeDefinition<_exa_cortex_pb_BrainEntryDeltaSummary, _exa_cortex_pb_BrainEntryDeltaSummary__Output>
      BrainEntryType: EnumTypeDefinition
      BrainFilterStrategy: EnumTypeDefinition
      BrainUpdateStepCreationOptions: MessageTypeDefinition<_exa_cortex_pb_BrainUpdateStepCreationOptions, _exa_cortex_pb_BrainUpdateStepCreationOptions__Output>
      BrainUpdateStrategy: MessageTypeDefinition<_exa_cortex_pb_BrainUpdateStrategy, _exa_cortex_pb_BrainUpdateStrategy__Output>
      BrainUpdateTrigger: EnumTypeDefinition
      CacheBreakpointMetadata: MessageTypeDefinition<_exa_cortex_pb_CacheBreakpointMetadata, _exa_cortex_pb_CacheBreakpointMetadata__Output>
      CacheRequestOptions: MessageTypeDefinition<_exa_cortex_pb_CacheRequestOptions, _exa_cortex_pb_CacheRequestOptions__Output>
      CascadeAgentToolSet: EnumTypeDefinition
      CascadeAgentV2PlannerConfig: MessageTypeDefinition<_exa_cortex_pb_CascadeAgentV2PlannerConfig, _exa_cortex_pb_CascadeAgentV2PlannerConfig__Output>
      CascadeAgenticPlannerApplierConfig: MessageTypeDefinition<_exa_cortex_pb_CascadeAgenticPlannerApplierConfig, _exa_cortex_pb_CascadeAgenticPlannerApplierConfig__Output>
      CascadeAgenticPlannerConfig: MessageTypeDefinition<_exa_cortex_pb_CascadeAgenticPlannerConfig, _exa_cortex_pb_CascadeAgenticPlannerConfig__Output>
      CascadeAgenticPlannerManagerConfig: MessageTypeDefinition<_exa_cortex_pb_CascadeAgenticPlannerManagerConfig, _exa_cortex_pb_CascadeAgenticPlannerManagerConfig__Output>
      CascadeAskUserQuestionInteraction: MessageTypeDefinition<_exa_cortex_pb_CascadeAskUserQuestionInteraction, _exa_cortex_pb_CascadeAskUserQuestionInteraction__Output>
      CascadeAskUserQuestionInteractionSpec: MessageTypeDefinition<_exa_cortex_pb_CascadeAskUserQuestionInteractionSpec, _exa_cortex_pb_CascadeAskUserQuestionInteractionSpec__Output>
      CascadeCodemapPlannerConfig: MessageTypeDefinition<_exa_cortex_pb_CascadeCodemapPlannerConfig, _exa_cortex_pb_CascadeCodemapPlannerConfig__Output>
      CascadeConfig: MessageTypeDefinition<_exa_cortex_pb_CascadeConfig, _exa_cortex_pb_CascadeConfig__Output>
      CascadeConversationalPlannerConfig: MessageTypeDefinition<_exa_cortex_pb_CascadeConversationalPlannerConfig, _exa_cortex_pb_CascadeConversationalPlannerConfig__Output>
      CascadeConversationalV2PlannerConfig: MessageTypeDefinition<_exa_cortex_pb_CascadeConversationalV2PlannerConfig, _exa_cortex_pb_CascadeConversationalV2PlannerConfig__Output>
      CascadeDeployInteraction: MessageTypeDefinition<_exa_cortex_pb_CascadeDeployInteraction, _exa_cortex_pb_CascadeDeployInteraction__Output>
      CascadeDeployInteractionSpec: MessageTypeDefinition<_exa_cortex_pb_CascadeDeployInteractionSpec, _exa_cortex_pb_CascadeDeployInteractionSpec__Output>
      CascadeExecutorConfig: MessageTypeDefinition<_exa_cortex_pb_CascadeExecutorConfig, _exa_cortex_pb_CascadeExecutorConfig__Output>
      CascadeHook: MessageTypeDefinition<_exa_cortex_pb_CascadeHook, _exa_cortex_pb_CascadeHook__Output>
      CascadeHooks: MessageTypeDefinition<_exa_cortex_pb_CascadeHooks, _exa_cortex_pb_CascadeHooks__Output>
      CascadeLifeguardPlannerConfig: MessageTypeDefinition<_exa_cortex_pb_CascadeLifeguardPlannerConfig, _exa_cortex_pb_CascadeLifeguardPlannerConfig__Output>
      CascadePanelState: MessageTypeDefinition<_exa_cortex_pb_CascadePanelState, _exa_cortex_pb_CascadePanelState__Output>
      CascadePassivePlannerConfig: MessageTypeDefinition<_exa_cortex_pb_CascadePassivePlannerConfig, _exa_cortex_pb_CascadePassivePlannerConfig__Output>
      CascadePlannerConfig: MessageTypeDefinition<_exa_cortex_pb_CascadePlannerConfig, _exa_cortex_pb_CascadePlannerConfig__Output>
      CascadeReadUrlContentInteraction: MessageTypeDefinition<_exa_cortex_pb_CascadeReadUrlContentInteraction, _exa_cortex_pb_CascadeReadUrlContentInteraction__Output>
      CascadeReadUrlContentInteractionSpec: MessageTypeDefinition<_exa_cortex_pb_CascadeReadUrlContentInteractionSpec, _exa_cortex_pb_CascadeReadUrlContentInteractionSpec__Output>
      CascadeResearchPlannerConfig: MessageTypeDefinition<_exa_cortex_pb_CascadeResearchPlannerConfig, _exa_cortex_pb_CascadeResearchPlannerConfig__Output>
      CascadeRunCommandInteraction: MessageTypeDefinition<_exa_cortex_pb_CascadeRunCommandInteraction, _exa_cortex_pb_CascadeRunCommandInteraction__Output>
      CascadeRunCommandInteractionSpec: MessageTypeDefinition<_exa_cortex_pb_CascadeRunCommandInteractionSpec, _exa_cortex_pb_CascadeRunCommandInteractionSpec__Output>
      CascadeRunExtensionCodeInteraction: MessageTypeDefinition<_exa_cortex_pb_CascadeRunExtensionCodeInteraction, _exa_cortex_pb_CascadeRunExtensionCodeInteraction__Output>
      CascadeRunExtensionCodeInteractionSpec: MessageTypeDefinition<_exa_cortex_pb_CascadeRunExtensionCodeInteractionSpec, _exa_cortex_pb_CascadeRunExtensionCodeInteractionSpec__Output>
      CascadeRunStatus: EnumTypeDefinition
      CascadeState: MessageTypeDefinition<_exa_cortex_pb_CascadeState, _exa_cortex_pb_CascadeState__Output>
      CascadeSummarizerConfig: MessageTypeDefinition<_exa_cortex_pb_CascadeSummarizerConfig, _exa_cortex_pb_CascadeSummarizerConfig__Output>
      CascadeTaskResolutionInteraction: MessageTypeDefinition<_exa_cortex_pb_CascadeTaskResolutionInteraction, _exa_cortex_pb_CascadeTaskResolutionInteraction__Output>
      CascadeTaskResolutionInteractionSpec: MessageTypeDefinition<_exa_cortex_pb_CascadeTaskResolutionInteractionSpec, _exa_cortex_pb_CascadeTaskResolutionInteractionSpec__Output>
      CascadeToolConfig: MessageTypeDefinition<_exa_cortex_pb_CascadeToolConfig, _exa_cortex_pb_CascadeToolConfig__Output>
      CascadeTrajectorySummaries: MessageTypeDefinition<_exa_cortex_pb_CascadeTrajectorySummaries, _exa_cortex_pb_CascadeTrajectorySummaries__Output>
      CascadeTrajectorySummary: MessageTypeDefinition<_exa_cortex_pb_CascadeTrajectorySummary, _exa_cortex_pb_CascadeTrajectorySummary__Output>
      CascadeUpsertCodemapInteraction: MessageTypeDefinition<_exa_cortex_pb_CascadeUpsertCodemapInteraction, _exa_cortex_pb_CascadeUpsertCodemapInteraction__Output>
      CascadeUpsertCodemapInteractionSpec: MessageTypeDefinition<_exa_cortex_pb_CascadeUpsertCodemapInteractionSpec, _exa_cortex_pb_CascadeUpsertCodemapInteractionSpec__Output>
      CascadeUserInteraction: MessageTypeDefinition<_exa_cortex_pb_CascadeUserInteraction, _exa_cortex_pb_CascadeUserInteraction__Output>
      ChatModelMetadata: MessageTypeDefinition<_exa_cortex_pb_ChatModelMetadata, _exa_cortex_pb_ChatModelMetadata__Output>
      ChatStartMetadata: MessageTypeDefinition<_exa_cortex_pb_ChatStartMetadata, _exa_cortex_pb_ChatStartMetadata__Output>
      CheckpointConfig: MessageTypeDefinition<_exa_cortex_pb_CheckpointConfig, _exa_cortex_pb_CheckpointConfig__Output>
      ClusterQueryToolConfig: MessageTypeDefinition<_exa_cortex_pb_ClusterQueryToolConfig, _exa_cortex_pb_ClusterQueryToolConfig__Output>
      CodeHeuristicFailure: EnumTypeDefinition
      CodeMapSuggestion: MessageTypeDefinition<_exa_cortex_pb_CodeMapSuggestion, _exa_cortex_pb_CodeMapSuggestion__Output>
      CodeStepCreationOptions: MessageTypeDefinition<_exa_cortex_pb_CodeStepCreationOptions, _exa_cortex_pb_CodeStepCreationOptions__Output>
      CodeToolConfig: MessageTypeDefinition<_exa_cortex_pb_CodeToolConfig, _exa_cortex_pb_CodeToolConfig__Output>
      CodingStepState: MessageTypeDefinition<_exa_cortex_pb_CodingStepState, _exa_cortex_pb_CodingStepState__Output>
      CommandContentTarget: MessageTypeDefinition<_exa_cortex_pb_CommandContentTarget, _exa_cortex_pb_CommandContentTarget__Output>
      CommandHookResult: MessageTypeDefinition<_exa_cortex_pb_CommandHookResult, _exa_cortex_pb_CommandHookResult__Output>
      CommandHookSpec: MessageTypeDefinition<_exa_cortex_pb_CommandHookSpec, _exa_cortex_pb_CommandHookSpec__Output>
      CommandOutputPriority: EnumTypeDefinition
      CommandStatusToolConfig: MessageTypeDefinition<_exa_cortex_pb_CommandStatusToolConfig, _exa_cortex_pb_CommandStatusToolConfig__Output>
      CommandTiming: MessageTypeDefinition<_exa_cortex_pb_CommandTiming, _exa_cortex_pb_CommandTiming__Output>
      CortexConfig: MessageTypeDefinition<_exa_cortex_pb_CortexConfig, _exa_cortex_pb_CortexConfig__Output>
      CortexErrorDetails: MessageTypeDefinition<_exa_cortex_pb_CortexErrorDetails, _exa_cortex_pb_CortexErrorDetails__Output>
      CortexMemory: MessageTypeDefinition<_exa_cortex_pb_CortexMemory, _exa_cortex_pb_CortexMemory__Output>
      CortexMemoryAllScope: MessageTypeDefinition<_exa_cortex_pb_CortexMemoryAllScope, _exa_cortex_pb_CortexMemoryAllScope__Output>
      CortexMemoryGlobalScope: MessageTypeDefinition<_exa_cortex_pb_CortexMemoryGlobalScope, _exa_cortex_pb_CortexMemoryGlobalScope__Output>
      CortexMemoryLocalScope: MessageTypeDefinition<_exa_cortex_pb_CortexMemoryLocalScope, _exa_cortex_pb_CortexMemoryLocalScope__Output>
      CortexMemoryMetadata: MessageTypeDefinition<_exa_cortex_pb_CortexMemoryMetadata, _exa_cortex_pb_CortexMemoryMetadata__Output>
      CortexMemoryProjectScope: MessageTypeDefinition<_exa_cortex_pb_CortexMemoryProjectScope, _exa_cortex_pb_CortexMemoryProjectScope__Output>
      CortexMemoryScope: MessageTypeDefinition<_exa_cortex_pb_CortexMemoryScope, _exa_cortex_pb_CortexMemoryScope__Output>
      CortexMemorySource: EnumTypeDefinition
      CortexMemorySystemScope: MessageTypeDefinition<_exa_cortex_pb_CortexMemorySystemScope, _exa_cortex_pb_CortexMemorySystemScope__Output>
      CortexMemoryText: MessageTypeDefinition<_exa_cortex_pb_CortexMemoryText, _exa_cortex_pb_CortexMemoryText__Output>
      CortexMemoryTrigger: EnumTypeDefinition
      CortexPlanConfig: MessageTypeDefinition<_exa_cortex_pb_CortexPlanConfig, _exa_cortex_pb_CortexPlanConfig__Output>
      CortexPlanState: MessageTypeDefinition<_exa_cortex_pb_CortexPlanState, _exa_cortex_pb_CortexPlanState__Output>
      CortexPlanSummary: MessageTypeDefinition<_exa_cortex_pb_CortexPlanSummary, _exa_cortex_pb_CortexPlanSummary__Output>
      CortexPlanSummaryComponent: MessageTypeDefinition<_exa_cortex_pb_CortexPlanSummaryComponent, _exa_cortex_pb_CortexPlanSummaryComponent__Output>
      CortexRequestSource: EnumTypeDefinition
      CortexResearchState: MessageTypeDefinition<_exa_cortex_pb_CortexResearchState, _exa_cortex_pb_CortexResearchState__Output>
      CortexRunState: MessageTypeDefinition<_exa_cortex_pb_CortexRunState, _exa_cortex_pb_CortexRunState__Output>
      CortexSkill: MessageTypeDefinition<_exa_cortex_pb_CortexSkill, _exa_cortex_pb_CortexSkill__Output>
      CortexStepAddAnnotation: MessageTypeDefinition<_exa_cortex_pb_CortexStepAddAnnotation, _exa_cortex_pb_CortexStepAddAnnotation__Output>
      CortexStepArenaTrajectoryConverge: MessageTypeDefinition<_exa_cortex_pb_CortexStepArenaTrajectoryConverge, _exa_cortex_pb_CortexStepArenaTrajectoryConverge__Output>
      CortexStepArtifactSummary: MessageTypeDefinition<_exa_cortex_pb_CortexStepArtifactSummary, _exa_cortex_pb_CortexStepArtifactSummary__Output>
      CortexStepAskUserQuestion: MessageTypeDefinition<_exa_cortex_pb_CortexStepAskUserQuestion, _exa_cortex_pb_CortexStepAskUserQuestion__Output>
      CortexStepAutoCascadeBroadcast: MessageTypeDefinition<_exa_cortex_pb_CortexStepAutoCascadeBroadcast, _exa_cortex_pb_CortexStepAutoCascadeBroadcast__Output>
      CortexStepBlocking: MessageTypeDefinition<_exa_cortex_pb_CortexStepBlocking, _exa_cortex_pb_CortexStepBlocking__Output>
      CortexStepBrainUpdate: MessageTypeDefinition<_exa_cortex_pb_CortexStepBrainUpdate, _exa_cortex_pb_CortexStepBrainUpdate__Output>
      CortexStepCheckDeployStatus: MessageTypeDefinition<_exa_cortex_pb_CortexStepCheckDeployStatus, _exa_cortex_pb_CortexStepCheckDeployStatus__Output>
      CortexStepCheckpoint: MessageTypeDefinition<_exa_cortex_pb_CortexStepCheckpoint, _exa_cortex_pb_CortexStepCheckpoint__Output>
      CortexStepClipboard: MessageTypeDefinition<_exa_cortex_pb_CortexStepClipboard, _exa_cortex_pb_CortexStepClipboard__Output>
      CortexStepClusterQuery: MessageTypeDefinition<_exa_cortex_pb_CortexStepClusterQuery, _exa_cortex_pb_CortexStepClusterQuery__Output>
      CortexStepCodeAction: MessageTypeDefinition<_exa_cortex_pb_CortexStepCodeAction, _exa_cortex_pb_CortexStepCodeAction__Output>
      CortexStepCodeMap: MessageTypeDefinition<_exa_cortex_pb_CortexStepCodeMap, _exa_cortex_pb_CortexStepCodeMap__Output>
      CortexStepCommandStatus: MessageTypeDefinition<_exa_cortex_pb_CortexStepCommandStatus, _exa_cortex_pb_CortexStepCommandStatus__Output>
      CortexStepCompile: MessageTypeDefinition<_exa_cortex_pb_CortexStepCompile, _exa_cortex_pb_CortexStepCompile__Output>
      CortexStepCompileDiagnostic: MessageTypeDefinition<_exa_cortex_pb_CortexStepCompileDiagnostic, _exa_cortex_pb_CortexStepCompileDiagnostic__Output>
      CortexStepCompileTool: EnumTypeDefinition
      CortexStepCreateRecipe: MessageTypeDefinition<_exa_cortex_pb_CortexStepCreateRecipe, _exa_cortex_pb_CortexStepCreateRecipe__Output>
      CortexStepCreditReason: EnumTypeDefinition
      CortexStepCustomTool: MessageTypeDefinition<_exa_cortex_pb_CortexStepCustomTool, _exa_cortex_pb_CortexStepCustomTool__Output>
      CortexStepDeepThink: MessageTypeDefinition<_exa_cortex_pb_CortexStepDeepThink, _exa_cortex_pb_CortexStepDeepThink__Output>
      CortexStepDeployWebApp: MessageTypeDefinition<_exa_cortex_pb_CortexStepDeployWebApp, _exa_cortex_pb_CortexStepDeployWebApp__Output>
      CortexStepDummy: MessageTypeDefinition<_exa_cortex_pb_CortexStepDummy, _exa_cortex_pb_CortexStepDummy__Output>
      CortexStepEditCodeMap: MessageTypeDefinition<_exa_cortex_pb_CortexStepEditCodeMap, _exa_cortex_pb_CortexStepEditCodeMap__Output>
      CortexStepEditNotebook: MessageTypeDefinition<_exa_cortex_pb_CortexStepEditNotebook, _exa_cortex_pb_CortexStepEditNotebook__Output>
      CortexStepErrorMessage: MessageTypeDefinition<_exa_cortex_pb_CortexStepErrorMessage, _exa_cortex_pb_CortexStepErrorMessage__Output>
      CortexStepExitPlanMode: MessageTypeDefinition<_exa_cortex_pb_CortexStepExitPlanMode, _exa_cortex_pb_CortexStepExitPlanMode__Output>
      CortexStepExploreResponse: MessageTypeDefinition<_exa_cortex_pb_CortexStepExploreResponse, _exa_cortex_pb_CortexStepExploreResponse__Output>
      CortexStepFileBreakdown: MessageTypeDefinition<_exa_cortex_pb_CortexStepFileBreakdown, _exa_cortex_pb_CortexStepFileBreakdown__Output>
      CortexStepFind: MessageTypeDefinition<_exa_cortex_pb_CortexStepFind, _exa_cortex_pb_CortexStepFind__Output>
      CortexStepFindAllReferences: MessageTypeDefinition<_exa_cortex_pb_CortexStepFindAllReferences, _exa_cortex_pb_CortexStepFindAllReferences__Output>
      CortexStepFindCodeContext: MessageTypeDefinition<_exa_cortex_pb_CortexStepFindCodeContext, _exa_cortex_pb_CortexStepFindCodeContext__Output>
      CortexStepFinish: MessageTypeDefinition<_exa_cortex_pb_CortexStepFinish, _exa_cortex_pb_CortexStepFinish__Output>
      CortexStepGeneratorMetadata: MessageTypeDefinition<_exa_cortex_pb_CortexStepGeneratorMetadata, _exa_cortex_pb_CortexStepGeneratorMetadata__Output>
      CortexStepGitCommit: MessageTypeDefinition<_exa_cortex_pb_CortexStepGitCommit, _exa_cortex_pb_CortexStepGitCommit__Output>
      CortexStepGrepSearch: MessageTypeDefinition<_exa_cortex_pb_CortexStepGrepSearch, _exa_cortex_pb_CortexStepGrepSearch__Output>
      CortexStepGrepSearchV2: MessageTypeDefinition<_exa_cortex_pb_CortexStepGrepSearchV2, _exa_cortex_pb_CortexStepGrepSearchV2__Output>
      CortexStepInformPlanner: MessageTypeDefinition<_exa_cortex_pb_CortexStepInformPlanner, _exa_cortex_pb_CortexStepInformPlanner__Output>
      CortexStepInspectCluster: MessageTypeDefinition<_exa_cortex_pb_CortexStepInspectCluster, _exa_cortex_pb_CortexStepInspectCluster__Output>
      CortexStepLintDiff: MessageTypeDefinition<_exa_cortex_pb_CortexStepLintDiff, _exa_cortex_pb_CortexStepLintDiff__Output>
      CortexStepLintFixMessage: MessageTypeDefinition<_exa_cortex_pb_CortexStepLintFixMessage, _exa_cortex_pb_CortexStepLintFixMessage__Output>
      CortexStepListClusters: MessageTypeDefinition<_exa_cortex_pb_CortexStepListClusters, _exa_cortex_pb_CortexStepListClusters__Output>
      CortexStepListDirectory: MessageTypeDefinition<_exa_cortex_pb_CortexStepListDirectory, _exa_cortex_pb_CortexStepListDirectory__Output>
      CortexStepListResources: MessageTypeDefinition<_exa_cortex_pb_CortexStepListResources, _exa_cortex_pb_CortexStepListResources__Output>
      CortexStepLookupKnowledgeBase: MessageTypeDefinition<_exa_cortex_pb_CortexStepLookupKnowledgeBase, _exa_cortex_pb_CortexStepLookupKnowledgeBase__Output>
      CortexStepManagerFeedback: MessageTypeDefinition<_exa_cortex_pb_CortexStepManagerFeedback, _exa_cortex_pb_CortexStepManagerFeedback__Output>
      CortexStepManagerFeedbackStatus: EnumTypeDefinition
      CortexStepMcpTool: MessageTypeDefinition<_exa_cortex_pb_CortexStepMcpTool, _exa_cortex_pb_CortexStepMcpTool__Output>
      CortexStepMemory: MessageTypeDefinition<_exa_cortex_pb_CortexStepMemory, _exa_cortex_pb_CortexStepMemory__Output>
      CortexStepMetadata: MessageTypeDefinition<_exa_cortex_pb_CortexStepMetadata, _exa_cortex_pb_CortexStepMetadata__Output>
      CortexStepMquery: MessageTypeDefinition<_exa_cortex_pb_CortexStepMquery, _exa_cortex_pb_CortexStepMquery__Output>
      CortexStepOutline: MessageTypeDefinition<_exa_cortex_pb_CortexStepOutline, _exa_cortex_pb_CortexStepOutline__Output>
      CortexStepPlanInput: MessageTypeDefinition<_exa_cortex_pb_CortexStepPlanInput, _exa_cortex_pb_CortexStepPlanInput__Output>
      CortexStepPlannerResponse: MessageTypeDefinition<_exa_cortex_pb_CortexStepPlannerResponse, _exa_cortex_pb_CortexStepPlannerResponse__Output>
      CortexStepPostPrReview: MessageTypeDefinition<_exa_cortex_pb_CortexStepPostPrReview, _exa_cortex_pb_CortexStepPostPrReview__Output>
      CortexStepProposalFeedback: MessageTypeDefinition<_exa_cortex_pb_CortexStepProposalFeedback, _exa_cortex_pb_CortexStepProposalFeedback__Output>
      CortexStepProposeCode: MessageTypeDefinition<_exa_cortex_pb_CortexStepProposeCode, _exa_cortex_pb_CortexStepProposeCode__Output>
      CortexStepProxyWebServer: MessageTypeDefinition<_exa_cortex_pb_CortexStepProxyWebServer, _exa_cortex_pb_CortexStepProxyWebServer__Output>
      CortexStepReadDeploymentConfig: MessageTypeDefinition<_exa_cortex_pb_CortexStepReadDeploymentConfig, _exa_cortex_pb_CortexStepReadDeploymentConfig__Output>
      CortexStepReadKnowledgeBaseItem: MessageTypeDefinition<_exa_cortex_pb_CortexStepReadKnowledgeBaseItem, _exa_cortex_pb_CortexStepReadKnowledgeBaseItem__Output>
      CortexStepReadNotebook: MessageTypeDefinition<_exa_cortex_pb_CortexStepReadNotebook, _exa_cortex_pb_CortexStepReadNotebook__Output>
      CortexStepReadResource: MessageTypeDefinition<_exa_cortex_pb_CortexStepReadResource, _exa_cortex_pb_CortexStepReadResource__Output>
      CortexStepReadTerminal: MessageTypeDefinition<_exa_cortex_pb_CortexStepReadTerminal, _exa_cortex_pb_CortexStepReadTerminal__Output>
      CortexStepReadUrlContent: MessageTypeDefinition<_exa_cortex_pb_CortexStepReadUrlContent, _exa_cortex_pb_CortexStepReadUrlContent__Output>
      CortexStepRelatedFiles: MessageTypeDefinition<_exa_cortex_pb_CortexStepRelatedFiles, _exa_cortex_pb_CortexStepRelatedFiles__Output>
      CortexStepReportBugs: MessageTypeDefinition<_exa_cortex_pb_CortexStepReportBugs, _exa_cortex_pb_CortexStepReportBugs__Output>
      CortexStepResolveTask: MessageTypeDefinition<_exa_cortex_pb_CortexStepResolveTask, _exa_cortex_pb_CortexStepResolveTask__Output>
      CortexStepRetrieveMemory: MessageTypeDefinition<_exa_cortex_pb_CortexStepRetrieveMemory, _exa_cortex_pb_CortexStepRetrieveMemory__Output>
      CortexStepRunCommand: MessageTypeDefinition<_exa_cortex_pb_CortexStepRunCommand, _exa_cortex_pb_CortexStepRunCommand__Output>
      CortexStepRunExtensionCode: MessageTypeDefinition<_exa_cortex_pb_CortexStepRunExtensionCode, _exa_cortex_pb_CortexStepRunExtensionCode__Output>
      CortexStepSearchKnowledgeBase: MessageTypeDefinition<_exa_cortex_pb_CortexStepSearchKnowledgeBase, _exa_cortex_pb_CortexStepSearchKnowledgeBase__Output>
      CortexStepSearchWeb: MessageTypeDefinition<_exa_cortex_pb_CortexStepSearchWeb, _exa_cortex_pb_CortexStepSearchWeb__Output>
      CortexStepSkill: MessageTypeDefinition<_exa_cortex_pb_CortexStepSkill, _exa_cortex_pb_CortexStepSkill__Output>
      CortexStepSmartFriend: MessageTypeDefinition<_exa_cortex_pb_CortexStepSmartFriend, _exa_cortex_pb_CortexStepSmartFriend__Output>
      CortexStepSource: EnumTypeDefinition
      CortexStepState: MessageTypeDefinition<_exa_cortex_pb_CortexStepState, _exa_cortex_pb_CortexStepState__Output>
      CortexStepStatus: EnumTypeDefinition
      CortexStepSuggestCodemap: MessageTypeDefinition<_exa_cortex_pb_CortexStepSuggestCodemap, _exa_cortex_pb_CortexStepSuggestCodemap__Output>
      CortexStepSuggestedResponses: MessageTypeDefinition<_exa_cortex_pb_CortexStepSuggestedResponses, _exa_cortex_pb_CortexStepSuggestedResponses__Output>
      CortexStepSupercompleteActiveDoc: MessageTypeDefinition<_exa_cortex_pb_CortexStepSupercompleteActiveDoc, _exa_cortex_pb_CortexStepSupercompleteActiveDoc__Output>
      CortexStepSupercompleteEphemeralFeedback: MessageTypeDefinition<_exa_cortex_pb_CortexStepSupercompleteEphemeralFeedback, _exa_cortex_pb_CortexStepSupercompleteEphemeralFeedback__Output>
      CortexStepSupercompleteFeedback: MessageTypeDefinition<_exa_cortex_pb_CortexStepSupercompleteFeedback, _exa_cortex_pb_CortexStepSupercompleteFeedback__Output>
      CortexStepTodoList: MessageTypeDefinition<_exa_cortex_pb_CortexStepTodoList, _exa_cortex_pb_CortexStepTodoList__Output>
      CortexStepToolCallChoice: MessageTypeDefinition<_exa_cortex_pb_CortexStepToolCallChoice, _exa_cortex_pb_CortexStepToolCallChoice__Output>
      CortexStepToolCallProposal: MessageTypeDefinition<_exa_cortex_pb_CortexStepToolCallProposal, _exa_cortex_pb_CortexStepToolCallProposal__Output>
      CortexStepTrajectoryChoice: MessageTypeDefinition<_exa_cortex_pb_CortexStepTrajectoryChoice, _exa_cortex_pb_CortexStepTrajectoryChoice__Output>
      CortexStepTrajectorySearch: MessageTypeDefinition<_exa_cortex_pb_CortexStepTrajectorySearch, _exa_cortex_pb_CortexStepTrajectorySearch__Output>
      CortexStepType: EnumTypeDefinition
      CortexStepUpdate: MessageTypeDefinition<_exa_cortex_pb_CortexStepUpdate, _exa_cortex_pb_CortexStepUpdate__Output>
      CortexStepUpsertCodemap: MessageTypeDefinition<_exa_cortex_pb_CortexStepUpsertCodemap, _exa_cortex_pb_CortexStepUpsertCodemap__Output>
      CortexStepUserInput: MessageTypeDefinition<_exa_cortex_pb_CortexStepUserInput, _exa_cortex_pb_CortexStepUserInput__Output>
      CortexStepViewCodeItem: MessageTypeDefinition<_exa_cortex_pb_CortexStepViewCodeItem, _exa_cortex_pb_CortexStepViewCodeItem__Output>
      CortexStepViewContentChunk: MessageTypeDefinition<_exa_cortex_pb_CortexStepViewContentChunk, _exa_cortex_pb_CortexStepViewContentChunk__Output>
      CortexStepViewFile: MessageTypeDefinition<_exa_cortex_pb_CortexStepViewFile, _exa_cortex_pb_CortexStepViewFile__Output>
      CortexStepViewFileOutline: MessageTypeDefinition<_exa_cortex_pb_CortexStepViewFileOutline, _exa_cortex_pb_CortexStepViewFileOutline__Output>
      CortexStepWriteToFile: MessageTypeDefinition<_exa_cortex_pb_CortexStepWriteToFile, _exa_cortex_pb_CortexStepWriteToFile__Output>
      CortexTodoListItem: MessageTypeDefinition<_exa_cortex_pb_CortexTodoListItem, _exa_cortex_pb_CortexTodoListItem__Output>
      CortexTodoListItemPriority: EnumTypeDefinition
      CortexTodoListItemStatus: EnumTypeDefinition
      CortexTrajectory: MessageTypeDefinition<_exa_cortex_pb_CortexTrajectory, _exa_cortex_pb_CortexTrajectory__Output>
      CortexTrajectoryMetadata: MessageTypeDefinition<_exa_cortex_pb_CortexTrajectoryMetadata, _exa_cortex_pb_CortexTrajectoryMetadata__Output>
      CortexTrajectoryReference: MessageTypeDefinition<_exa_cortex_pb_CortexTrajectoryReference, _exa_cortex_pb_CortexTrajectoryReference__Output>
      CortexTrajectorySource: EnumTypeDefinition
      CortexTrajectoryStep: MessageTypeDefinition<_exa_cortex_pb_CortexTrajectoryStep, _exa_cortex_pb_CortexTrajectoryStep__Output>
      CortexTrajectoryStepWithIndex: MessageTypeDefinition<_exa_cortex_pb_CortexTrajectoryStepWithIndex, _exa_cortex_pb_CortexTrajectoryStepWithIndex__Output>
      CortexTrajectoryToPromptConfig: MessageTypeDefinition<_exa_cortex_pb_CortexTrajectoryToPromptConfig, _exa_cortex_pb_CortexTrajectoryToPromptConfig__Output>
      CortexTrajectoryType: EnumTypeDefinition
      CortexWorkflowState: MessageTypeDefinition<_exa_cortex_pb_CortexWorkflowState, _exa_cortex_pb_CortexWorkflowState__Output>
      CortexWorkspaceMetadata: MessageTypeDefinition<_exa_cortex_pb_CortexWorkspaceMetadata, _exa_cortex_pb_CortexWorkspaceMetadata__Output>
      CustomRecipeConfig: MessageTypeDefinition<_exa_cortex_pb_CustomRecipeConfig, _exa_cortex_pb_CustomRecipeConfig__Output>
      CustomToolSpec: MessageTypeDefinition<_exa_cortex_pb_CustomToolSpec, _exa_cortex_pb_CustomToolSpec__Output>
      DeployWebAppFileUploadStatus: EnumTypeDefinition
      DeployWebAppToolConfig: MessageTypeDefinition<_exa_cortex_pb_DeployWebAppToolConfig, _exa_cortex_pb_DeployWebAppToolConfig__Output>
      DeploymentInteractionPayload: MessageTypeDefinition<_exa_cortex_pb_DeploymentInteractionPayload, _exa_cortex_pb_DeploymentInteractionPayload__Output>
      DiffBasedCommandEvalConfig: MessageTypeDefinition<_exa_cortex_pb_DiffBasedCommandEvalConfig, _exa_cortex_pb_DiffBasedCommandEvalConfig__Output>
      DynamicBrainUpdateConfig: MessageTypeDefinition<_exa_cortex_pb_DynamicBrainUpdateConfig, _exa_cortex_pb_DynamicBrainUpdateConfig__Output>
      EnterpriseToolConfig: MessageTypeDefinition<_exa_cortex_pb_EnterpriseToolConfig, _exa_cortex_pb_EnterpriseToolConfig__Output>
      EphemeralMessagesConfig: MessageTypeDefinition<_exa_cortex_pb_EphemeralMessagesConfig, _exa_cortex_pb_EphemeralMessagesConfig__Output>
      ExecutionAsyncLevel: EnumTypeDefinition
      ExecutorMetadata: MessageTypeDefinition<_exa_cortex_pb_ExecutorMetadata, _exa_cortex_pb_ExecutorMetadata__Output>
      ExecutorTerminationReason: EnumTypeDefinition
      ExitPlanModeToolConfig: MessageTypeDefinition<_exa_cortex_pb_ExitPlanModeToolConfig, _exa_cortex_pb_ExitPlanModeToolConfig__Output>
      FastApplyFallbackConfig: MessageTypeDefinition<_exa_cortex_pb_FastApplyFallbackConfig, _exa_cortex_pb_FastApplyFallbackConfig__Output>
      FastApplyFallbackInfo: MessageTypeDefinition<_exa_cortex_pb_FastApplyFallbackInfo, _exa_cortex_pb_FastApplyFallbackInfo__Output>
      FindAllReferencesConfig: MessageTypeDefinition<_exa_cortex_pb_FindAllReferencesConfig, _exa_cortex_pb_FindAllReferencesConfig__Output>
      FindCodeContextToolConfig: MessageTypeDefinition<_exa_cortex_pb_FindCodeContextToolConfig, _exa_cortex_pb_FindCodeContextToolConfig__Output>
      FindResultType: EnumTypeDefinition
      FindToolConfig: MessageTypeDefinition<_exa_cortex_pb_FindToolConfig, _exa_cortex_pb_FindToolConfig__Output>
      ForcedBrainUpdateConfig: MessageTypeDefinition<_exa_cortex_pb_ForcedBrainUpdateConfig, _exa_cortex_pb_ForcedBrainUpdateConfig__Output>
      GlobalBackgroundCommand: MessageTypeDefinition<_exa_cortex_pb_GlobalBackgroundCommand, _exa_cortex_pb_GlobalBackgroundCommand__Output>
      GrepSearchResult: MessageTypeDefinition<_exa_cortex_pb_GrepSearchResult, _exa_cortex_pb_GrepSearchResult__Output>
      GrepToolConfig: MessageTypeDefinition<_exa_cortex_pb_GrepToolConfig, _exa_cortex_pb_GrepToolConfig__Output>
      GrepV2ToolConfig: MessageTypeDefinition<_exa_cortex_pb_GrepV2ToolConfig, _exa_cortex_pb_GrepV2ToolConfig__Output>
      HeuristicPrompt: MessageTypeDefinition<_exa_cortex_pb_HeuristicPrompt, _exa_cortex_pb_HeuristicPrompt__Output>
      HookAgentAction: EnumTypeDefinition
      HookCondition: MessageTypeDefinition<_exa_cortex_pb_HookCondition, _exa_cortex_pb_HookCondition__Output>
      HookExecutionDetail: MessageTypeDefinition<_exa_cortex_pb_HookExecutionDetail, _exa_cortex_pb_HookExecutionDetail__Output>
      HookExecutionResult: MessageTypeDefinition<_exa_cortex_pb_HookExecutionResult, _exa_cortex_pb_HookExecutionResult__Output>
      HookExecutionSpec: MessageTypeDefinition<_exa_cortex_pb_HookExecutionSpec, _exa_cortex_pb_HookExecutionSpec__Output>
      ImplicitTrajectory: MessageTypeDefinition<_exa_cortex_pb_ImplicitTrajectory, _exa_cortex_pb_ImplicitTrajectory__Output>
      ImplicitTrajectoryDescription: MessageTypeDefinition<_exa_cortex_pb_ImplicitTrajectoryDescription, _exa_cortex_pb_ImplicitTrajectoryDescription__Output>
      InformPlannerConfig: MessageTypeDefinition<_exa_cortex_pb_InformPlannerConfig, _exa_cortex_pb_InformPlannerConfig__Output>
      InformPlannerMode: EnumTypeDefinition
      InspectClusterToolConfig: MessageTypeDefinition<_exa_cortex_pb_InspectClusterToolConfig, _exa_cortex_pb_InspectClusterToolConfig__Output>
      InstantContextResponse: MessageTypeDefinition<_exa_cortex_pb_InstantContextResponse, _exa_cortex_pb_InstantContextResponse__Output>
      InstantContextStep: MessageTypeDefinition<_exa_cortex_pb_InstantContextStep, _exa_cortex_pb_InstantContextStep__Output>
      InstantContextTiming: MessageTypeDefinition<_exa_cortex_pb_InstantContextTiming, _exa_cortex_pb_InstantContextTiming__Output>
      InstantContextToolCall: MessageTypeDefinition<_exa_cortex_pb_InstantContextToolCall, _exa_cortex_pb_InstantContextToolCall__Output>
      InstantContextToolUpdate: MessageTypeDefinition<_exa_cortex_pb_InstantContextToolUpdate, _exa_cortex_pb_InstantContextToolUpdate__Output>
      IntentToolConfig: MessageTypeDefinition<_exa_cortex_pb_IntentToolConfig, _exa_cortex_pb_IntentToolConfig__Output>
      KnowledgeBaseSearchToolConfig: MessageTypeDefinition<_exa_cortex_pb_KnowledgeBaseSearchToolConfig, _exa_cortex_pb_KnowledgeBaseSearchToolConfig__Output>
      LastTodoListStepInfo: MessageTypeDefinition<_exa_cortex_pb_LastTodoListStepInfo, _exa_cortex_pb_LastTodoListStepInfo__Output>
      LifeguardBug: MessageTypeDefinition<_exa_cortex_pb_LifeguardBug, _exa_cortex_pb_LifeguardBug__Output>
      LineRange: MessageTypeDefinition<_exa_cortex_pb_LineRange, _exa_cortex_pb_LineRange__Output>
      LineRangeList: MessageTypeDefinition<_exa_cortex_pb_LineRangeList, _exa_cortex_pb_LineRangeList__Output>
      LineRangeTarget: MessageTypeDefinition<_exa_cortex_pb_LineRangeTarget, _exa_cortex_pb_LineRangeTarget__Output>
      LintDiffStepCreationOptions: MessageTypeDefinition<_exa_cortex_pb_LintDiffStepCreationOptions, _exa_cortex_pb_LintDiffStepCreationOptions__Output>
      LintDiffType: EnumTypeDefinition
      ListDirToolConfig: MessageTypeDefinition<_exa_cortex_pb_ListDirToolConfig, _exa_cortex_pb_ListDirToolConfig__Output>
      ListDirectoryResult: MessageTypeDefinition<_exa_cortex_pb_ListDirectoryResult, _exa_cortex_pb_ListDirectoryResult__Output>
      McpOAuthConfig: MessageTypeDefinition<_exa_cortex_pb_McpOAuthConfig, _exa_cortex_pb_McpOAuthConfig__Output>
      McpPrompt: MessageTypeDefinition<_exa_cortex_pb_McpPrompt, _exa_cortex_pb_McpPrompt__Output>
      McpPromptArgument: MessageTypeDefinition<_exa_cortex_pb_McpPromptArgument, _exa_cortex_pb_McpPromptArgument__Output>
      McpResource: MessageTypeDefinition<_exa_cortex_pb_McpResource, _exa_cortex_pb_McpResource__Output>
      McpResourceContent: MessageTypeDefinition<_exa_cortex_pb_McpResourceContent, _exa_cortex_pb_McpResourceContent__Output>
      McpServerInfo: MessageTypeDefinition<_exa_cortex_pb_McpServerInfo, _exa_cortex_pb_McpServerInfo__Output>
      McpServerSpec: MessageTypeDefinition<_exa_cortex_pb_McpServerSpec, _exa_cortex_pb_McpServerSpec__Output>
      McpServerState: MessageTypeDefinition<_exa_cortex_pb_McpServerState, _exa_cortex_pb_McpServerState__Output>
      McpServerStatus: EnumTypeDefinition
      McpToolConfig: MessageTypeDefinition<_exa_cortex_pb_McpToolConfig, _exa_cortex_pb_McpToolConfig__Output>
      MemoryActionType: EnumTypeDefinition
      MemoryConfig: MessageTypeDefinition<_exa_cortex_pb_MemoryConfig, _exa_cortex_pb_MemoryConfig__Output>
      MemoryToolConfig: MessageTypeDefinition<_exa_cortex_pb_MemoryToolConfig, _exa_cortex_pb_MemoryToolConfig__Output>
      MessagePromptMetadata: MessageTypeDefinition<_exa_cortex_pb_MessagePromptMetadata, _exa_cortex_pb_MessagePromptMetadata__Output>
      MqueryToolConfig: MessageTypeDefinition<_exa_cortex_pb_MqueryToolConfig, _exa_cortex_pb_MqueryToolConfig__Output>
      NotebookToolConfig: MessageTypeDefinition<_exa_cortex_pb_NotebookToolConfig, _exa_cortex_pb_NotebookToolConfig__Output>
      ParallelRolloutConfig: MessageTypeDefinition<_exa_cortex_pb_ParallelRolloutConfig, _exa_cortex_pb_ParallelRolloutConfig__Output>
      ParallelRolloutGeneratorMetadata: MessageTypeDefinition<_exa_cortex_pb_ParallelRolloutGeneratorMetadata, _exa_cortex_pb_ParallelRolloutGeneratorMetadata__Output>
      PassiveCoderRequestSource: EnumTypeDefinition
      PlanConfig: MessageTypeDefinition<_exa_cortex_pb_PlanConfig, _exa_cortex_pb_PlanConfig__Output>
      PlanDebugInfo: MessageTypeDefinition<_exa_cortex_pb_PlanDebugInfo, _exa_cortex_pb_PlanDebugInfo__Output>
      PlanEntryDeltaSummary: MessageTypeDefinition<_exa_cortex_pb_PlanEntryDeltaSummary, _exa_cortex_pb_PlanEntryDeltaSummary__Output>
      PlanInput: MessageTypeDefinition<_exa_cortex_pb_PlanInput, _exa_cortex_pb_PlanInput__Output>
      PlanState: MessageTypeDefinition<_exa_cortex_pb_PlanState, _exa_cortex_pb_PlanState__Output>
      PlanStatus: EnumTypeDefinition
      PromptOverrideConfig: MessageTypeDefinition<_exa_cortex_pb_PromptOverrideConfig, _exa_cortex_pb_PromptOverrideConfig__Output>
      ProxyWebServerToolConfig: MessageTypeDefinition<_exa_cortex_pb_ProxyWebServerToolConfig, _exa_cortex_pb_ProxyWebServerToolConfig__Output>
      QueuedMessage: MessageTypeDefinition<_exa_cortex_pb_QueuedMessage, _exa_cortex_pb_QueuedMessage__Output>
      ReadKnowledgeBaseItemToolConfig: MessageTypeDefinition<_exa_cortex_pb_ReadKnowledgeBaseItemToolConfig, _exa_cortex_pb_ReadKnowledgeBaseItemToolConfig__Output>
      ReadUrlContentAction: EnumTypeDefinition
      ReadUrlContentToolConfig: MessageTypeDefinition<_exa_cortex_pb_ReadUrlContentToolConfig, _exa_cortex_pb_ReadUrlContentToolConfig__Output>
      ReplaceContentToolConfig: MessageTypeDefinition<_exa_cortex_pb_ReplaceContentToolConfig, _exa_cortex_pb_ReplaceContentToolConfig__Output>
      ReplaceToolVariant: EnumTypeDefinition
      ReplacementChunk: MessageTypeDefinition<_exa_cortex_pb_ReplacementChunk, _exa_cortex_pb_ReplacementChunk__Output>
      ReplacementChunkInfo: MessageTypeDefinition<_exa_cortex_pb_ReplacementChunkInfo, _exa_cortex_pb_ReplacementChunkInfo__Output>
      RequestedInteraction: MessageTypeDefinition<_exa_cortex_pb_RequestedInteraction, _exa_cortex_pb_RequestedInteraction__Output>
      ResearchDebugInfo: MessageTypeDefinition<_exa_cortex_pb_ResearchDebugInfo, _exa_cortex_pb_ResearchDebugInfo__Output>
      RetrievalStatus: MessageTypeDefinition<_exa_cortex_pb_RetrievalStatus, _exa_cortex_pb_RetrievalStatus__Output>
      RevertMetadata: MessageTypeDefinition<_exa_cortex_pb_RevertMetadata, _exa_cortex_pb_RevertMetadata__Output>
      RuleSource: EnumTypeDefinition
      RunCommandAction: EnumTypeDefinition
      RunCommandOutput: MessageTypeDefinition<_exa_cortex_pb_RunCommandOutput, _exa_cortex_pb_RunCommandOutput__Output>
      RunCommandStepCreationOptions: MessageTypeDefinition<_exa_cortex_pb_RunCommandStepCreationOptions, _exa_cortex_pb_RunCommandStepCreationOptions__Output>
      RunCommandToolConfig: MessageTypeDefinition<_exa_cortex_pb_RunCommandToolConfig, _exa_cortex_pb_RunCommandToolConfig__Output>
      RunExtensionCodeAutoRunDecision: EnumTypeDefinition
      RunExtensionCodeConfig: MessageTypeDefinition<_exa_cortex_pb_RunExtensionCodeConfig, _exa_cortex_pb_RunExtensionCodeConfig__Output>
      SearchWebToolConfig: MessageTypeDefinition<_exa_cortex_pb_SearchWebToolConfig, _exa_cortex_pb_SearchWebToolConfig__Output>
      SectionOverrideConfig: MessageTypeDefinition<_exa_cortex_pb_SectionOverrideConfig, _exa_cortex_pb_SectionOverrideConfig__Output>
      SectionOverrideMode: EnumTypeDefinition
      SemanticCodebaseSearchType: EnumTypeDefinition
      SimpleCommand: MessageTypeDefinition<_exa_cortex_pb_SimpleCommand, _exa_cortex_pb_SimpleCommand__Output>
      SmartFriendToolConfig: MessageTypeDefinition<_exa_cortex_pb_SmartFriendToolConfig, _exa_cortex_pb_SmartFriendToolConfig__Output>
      SnapshotToStepsOptions: MessageTypeDefinition<_exa_cortex_pb_SnapshotToStepsOptions, _exa_cortex_pb_SnapshotToStepsOptions__Output>
      SourceTrajectoryStepInfo: MessageTypeDefinition<_exa_cortex_pb_SourceTrajectoryStepInfo, _exa_cortex_pb_SourceTrajectoryStepInfo__Output>
      StateInitializationData: MessageTypeDefinition<_exa_cortex_pb_StateInitializationData, _exa_cortex_pb_StateInitializationData__Output>
      StructuredErrorPart: MessageTypeDefinition<_exa_cortex_pb_StructuredErrorPart, _exa_cortex_pb_StructuredErrorPart__Output>
      SuggestedResponseConfig: MessageTypeDefinition<_exa_cortex_pb_SuggestedResponseConfig, _exa_cortex_pb_SuggestedResponseConfig__Output>
      SupercompleteEphemeralFeedbackEntry: MessageTypeDefinition<_exa_cortex_pb_SupercompleteEphemeralFeedbackEntry, _exa_cortex_pb_SupercompleteEphemeralFeedbackEntry__Output>
      SupercompleteTabJumpInfo: MessageTypeDefinition<_exa_cortex_pb_SupercompleteTabJumpInfo, _exa_cortex_pb_SupercompleteTabJumpInfo__Output>
      TaskDelta: MessageTypeDefinition<_exa_cortex_pb_TaskDelta, _exa_cortex_pb_TaskDelta__Output>
      TaskDeltaType: EnumTypeDefinition
      TaskEntryDeltaSummary: MessageTypeDefinition<_exa_cortex_pb_TaskEntryDeltaSummary, _exa_cortex_pb_TaskEntryDeltaSummary__Output>
      TaskItem: MessageTypeDefinition<_exa_cortex_pb_TaskItem, _exa_cortex_pb_TaskItem__Output>
      TaskResolution: MessageTypeDefinition<_exa_cortex_pb_TaskResolution, _exa_cortex_pb_TaskResolution__Output>
      TaskResolutionOpenPr: MessageTypeDefinition<_exa_cortex_pb_TaskResolutionOpenPr, _exa_cortex_pb_TaskResolutionOpenPr__Output>
      TaskStatus: EnumTypeDefinition
      ToolDescriptionOverrideMap: MessageTypeDefinition<_exa_cortex_pb_ToolDescriptionOverrideMap, _exa_cortex_pb_ToolDescriptionOverrideMap__Output>
      TrajectoryConversionConfig: MessageTypeDefinition<_exa_cortex_pb_TrajectoryConversionConfig, _exa_cortex_pb_TrajectoryConversionConfig__Output>
      TrajectoryDescription: MessageTypeDefinition<_exa_cortex_pb_TrajectoryDescription, _exa_cortex_pb_TrajectoryDescription__Output>
      TrajectoryJudgeConfig: MessageTypeDefinition<_exa_cortex_pb_TrajectoryJudgeConfig, _exa_cortex_pb_TrajectoryJudgeConfig__Output>
      TrajectoryPrefixMetadata: MessageTypeDefinition<_exa_cortex_pb_TrajectoryPrefixMetadata, _exa_cortex_pb_TrajectoryPrefixMetadata__Output>
      TrajectoryScope: MessageTypeDefinition<_exa_cortex_pb_TrajectoryScope, _exa_cortex_pb_TrajectoryScope__Output>
      TrajectorySearchIdType: EnumTypeDefinition
      TrajectorySearchToolConfig: MessageTypeDefinition<_exa_cortex_pb_TrajectorySearchToolConfig, _exa_cortex_pb_TrajectorySearchToolConfig__Output>
      TrajectoryShareStatus: EnumTypeDefinition
      TurnTiming: MessageTypeDefinition<_exa_cortex_pb_TurnTiming, _exa_cortex_pb_TurnTiming__Output>
      UpsertCodemapOutput: MessageTypeDefinition<_exa_cortex_pb_UpsertCodemapOutput, _exa_cortex_pb_UpsertCodemapOutput__Output>
      UpsertCodemapRunningStatus: MessageTypeDefinition<_exa_cortex_pb_UpsertCodemapRunningStatus, _exa_cortex_pb_UpsertCodemapRunningStatus__Output>
      UserGrepStepCreationOptions: MessageTypeDefinition<_exa_cortex_pb_UserGrepStepCreationOptions, _exa_cortex_pb_UserGrepStepCreationOptions__Output>
      UserStepAnnotations: MessageTypeDefinition<_exa_cortex_pb_UserStepAnnotations, _exa_cortex_pb_UserStepAnnotations__Output>
      UserStepSnapshot: MessageTypeDefinition<_exa_cortex_pb_UserStepSnapshot, _exa_cortex_pb_UserStepSnapshot__Output>
      ViewCodeItemToolConfig: MessageTypeDefinition<_exa_cortex_pb_ViewCodeItemToolConfig, _exa_cortex_pb_ViewCodeItemToolConfig__Output>
      ViewFileStepCreationOptions: MessageTypeDefinition<_exa_cortex_pb_ViewFileStepCreationOptions, _exa_cortex_pb_ViewFileStepCreationOptions__Output>
      ViewFileToolConfig: MessageTypeDefinition<_exa_cortex_pb_ViewFileToolConfig, _exa_cortex_pb_ViewFileToolConfig__Output>
      ViewedFileTrackerConfig: MessageTypeDefinition<_exa_cortex_pb_ViewedFileTrackerConfig, _exa_cortex_pb_ViewedFileTrackerConfig__Output>
      WindsurfSetting: MessageTypeDefinition<_exa_cortex_pb_WindsurfSetting, _exa_cortex_pb_WindsurfSetting__Output>
      WorkflowSpec: MessageTypeDefinition<_exa_cortex_pb_WorkflowSpec, _exa_cortex_pb_WorkflowSpec__Output>
      WorkspaceInitializationData: MessageTypeDefinition<_exa_cortex_pb_WorkspaceInitializationData, _exa_cortex_pb_WorkspaceInitializationData__Output>
    }
    diff_action_pb: {
      CharacterDiff: MessageTypeDefinition<_exa_diff_action_pb_CharacterDiff, _exa_diff_action_pb_CharacterDiff__Output>
      CharacterDiffChange: MessageTypeDefinition<_exa_diff_action_pb_CharacterDiffChange, _exa_diff_action_pb_CharacterDiffChange__Output>
      ComboDiff: MessageTypeDefinition<_exa_diff_action_pb_ComboDiff, _exa_diff_action_pb_ComboDiff__Output>
      ComboDiffLine: MessageTypeDefinition<_exa_diff_action_pb_ComboDiffLine, _exa_diff_action_pb_ComboDiffLine__Output>
      DiffBlock: MessageTypeDefinition<_exa_diff_action_pb_DiffBlock, _exa_diff_action_pb_DiffBlock__Output>
      DiffChangeType: EnumTypeDefinition
      DiffList: MessageTypeDefinition<_exa_diff_action_pb_DiffList, _exa_diff_action_pb_DiffList__Output>
      DiffSet: MessageTypeDefinition<_exa_diff_action_pb_DiffSet, _exa_diff_action_pb_DiffSet__Output>
      DiffType: EnumTypeDefinition
      UnifiedDiff: MessageTypeDefinition<_exa_diff_action_pb_UnifiedDiff, _exa_diff_action_pb_UnifiedDiff__Output>
      UnifiedDiffLineType: EnumTypeDefinition
    }
    index_pb: {
      AddIndexRequest: MessageTypeDefinition<_exa_index_pb_AddIndexRequest, _exa_index_pb_AddIndexRequest__Output>
      AddIndexResponse: MessageTypeDefinition<_exa_index_pb_AddIndexResponse, _exa_index_pb_AddIndexResponse__Output>
      AddRepositoryRequest: MessageTypeDefinition<_exa_index_pb_AddRepositoryRequest, _exa_index_pb_AddRepositoryRequest__Output>
      AddRepositoryResponse: MessageTypeDefinition<_exa_index_pb_AddRepositoryResponse, _exa_index_pb_AddRepositoryResponse__Output>
      CancelIndexingRequest: MessageTypeDefinition<_exa_index_pb_CancelIndexingRequest, _exa_index_pb_CancelIndexingRequest__Output>
      CancelIndexingResponse: MessageTypeDefinition<_exa_index_pb_CancelIndexingResponse, _exa_index_pb_CancelIndexingResponse__Output>
      DeleteIndexRequest: MessageTypeDefinition<_exa_index_pb_DeleteIndexRequest, _exa_index_pb_DeleteIndexRequest__Output>
      DeleteIndexResponse: MessageTypeDefinition<_exa_index_pb_DeleteIndexResponse, _exa_index_pb_DeleteIndexResponse__Output>
      DeleteRepositoryRequest: MessageTypeDefinition<_exa_index_pb_DeleteRepositoryRequest, _exa_index_pb_DeleteRepositoryRequest__Output>
      DeleteRepositoryResponse: MessageTypeDefinition<_exa_index_pb_DeleteRepositoryResponse, _exa_index_pb_DeleteRepositoryResponse__Output>
      DisableIndexingRequest: MessageTypeDefinition<_exa_index_pb_DisableIndexingRequest, _exa_index_pb_DisableIndexingRequest__Output>
      DisableIndexingResponse: MessageTypeDefinition<_exa_index_pb_DisableIndexingResponse, _exa_index_pb_DisableIndexingResponse__Output>
      EditRepositoryRequest: MessageTypeDefinition<_exa_index_pb_EditRepositoryRequest, _exa_index_pb_EditRepositoryRequest__Output>
      EditRepositoryResponse: MessageTypeDefinition<_exa_index_pb_EditRepositoryResponse, _exa_index_pb_EditRepositoryResponse__Output>
      EnableIndexingRequest: MessageTypeDefinition<_exa_index_pb_EnableIndexingRequest, _exa_index_pb_EnableIndexingRequest__Output>
      EnableIndexingResponse: MessageTypeDefinition<_exa_index_pb_EnableIndexingResponse, _exa_index_pb_EnableIndexingResponse__Output>
      GetConnectionsDebugInfoRequest: MessageTypeDefinition<_exa_index_pb_GetConnectionsDebugInfoRequest, _exa_index_pb_GetConnectionsDebugInfoRequest__Output>
      GetConnectionsDebugInfoResponse: MessageTypeDefinition<_exa_index_pb_GetConnectionsDebugInfoResponse, _exa_index_pb_GetConnectionsDebugInfoResponse__Output>
      GetDatabaseStatsRequest: MessageTypeDefinition<_exa_index_pb_GetDatabaseStatsRequest, _exa_index_pb_GetDatabaseStatsRequest__Output>
      GetDatabaseStatsResponse: MessageTypeDefinition<_exa_index_pb_GetDatabaseStatsResponse, _exa_index_pb_GetDatabaseStatsResponse__Output>
      GetEmbeddingsForCodeContextItemsRequest: MessageTypeDefinition<_exa_index_pb_GetEmbeddingsForCodeContextItemsRequest, _exa_index_pb_GetEmbeddingsForCodeContextItemsRequest__Output>
      GetEmbeddingsForCodeContextItemsResponse: MessageTypeDefinition<_exa_index_pb_GetEmbeddingsForCodeContextItemsResponse, _exa_index_pb_GetEmbeddingsForCodeContextItemsResponse__Output>
      GetIndexConfigRequest: MessageTypeDefinition<_exa_index_pb_GetIndexConfigRequest, _exa_index_pb_GetIndexConfigRequest__Output>
      GetIndexConfigResponse: MessageTypeDefinition<_exa_index_pb_GetIndexConfigResponse, _exa_index_pb_GetIndexConfigResponse__Output>
      GetIndexRequest: MessageTypeDefinition<_exa_index_pb_GetIndexRequest, _exa_index_pb_GetIndexRequest__Output>
      GetIndexResponse: MessageTypeDefinition<_exa_index_pb_GetIndexResponse, _exa_index_pb_GetIndexResponse__Output>
      GetIndexedRepositoriesRequest: MessageTypeDefinition<_exa_index_pb_GetIndexedRepositoriesRequest, _exa_index_pb_GetIndexedRepositoriesRequest__Output>
      GetIndexedRepositoriesResponse: MessageTypeDefinition<_exa_index_pb_GetIndexedRepositoriesResponse, _exa_index_pb_GetIndexedRepositoriesResponse__Output>
      GetIndexesRequest: MessageTypeDefinition<_exa_index_pb_GetIndexesRequest, _exa_index_pb_GetIndexesRequest__Output>
      GetIndexesResponse: MessageTypeDefinition<_exa_index_pb_GetIndexesResponse, _exa_index_pb_GetIndexesResponse__Output>
      GetMatchingFilePathsRequest: MessageTypeDefinition<_exa_index_pb_GetMatchingFilePathsRequest, _exa_index_pb_GetMatchingFilePathsRequest__Output>
      GetMatchingFilePathsResponse: MessageTypeDefinition<_exa_index_pb_GetMatchingFilePathsResponse, _exa_index_pb_GetMatchingFilePathsResponse__Output>
      GetNearestCCIsFromEmbeddingRequest: MessageTypeDefinition<_exa_index_pb_GetNearestCCIsFromEmbeddingRequest, _exa_index_pb_GetNearestCCIsFromEmbeddingRequest__Output>
      GetNearestCCIsFromEmbeddingResponse: MessageTypeDefinition<_exa_index_pb_GetNearestCCIsFromEmbeddingResponse, _exa_index_pb_GetNearestCCIsFromEmbeddingResponse__Output>
      GetNumberConnectionsRequest: MessageTypeDefinition<_exa_index_pb_GetNumberConnectionsRequest, _exa_index_pb_GetNumberConnectionsRequest__Output>
      GetNumberConnectionsResponse: MessageTypeDefinition<_exa_index_pb_GetNumberConnectionsResponse, _exa_index_pb_GetNumberConnectionsResponse__Output>
      GetRemoteIndexStatsRequest: MessageTypeDefinition<_exa_index_pb_GetRemoteIndexStatsRequest, _exa_index_pb_GetRemoteIndexStatsRequest__Output>
      GetRemoteIndexStatsResponse: MessageTypeDefinition<_exa_index_pb_GetRemoteIndexStatsResponse, _exa_index_pb_GetRemoteIndexStatsResponse__Output>
      GetRepositoriesFilter: MessageTypeDefinition<_exa_index_pb_GetRepositoriesFilter, _exa_index_pb_GetRepositoriesFilter__Output>
      GetRepositoriesRequest: MessageTypeDefinition<_exa_index_pb_GetRepositoriesRequest, _exa_index_pb_GetRepositoriesRequest__Output>
      GetRepositoriesResponse: MessageTypeDefinition<_exa_index_pb_GetRepositoriesResponse, _exa_index_pb_GetRepositoriesResponse__Output>
      Index: MessageTypeDefinition<_exa_index_pb_Index, _exa_index_pb_Index__Output>
      IndexBuildConfig: MessageTypeDefinition<_exa_index_pb_IndexBuildConfig, _exa_index_pb_IndexBuildConfig__Output>
      IndexConfig: MessageTypeDefinition<_exa_index_pb_IndexConfig, _exa_index_pb_IndexConfig__Output>
      IndexDbVersion: MessageTypeDefinition<_exa_index_pb_IndexDbVersion, _exa_index_pb_IndexDbVersion__Output>
      IndexManagementService: SubtypeConstructor<typeof grpc.Client, _exa_index_pb_IndexManagementServiceClient> & { service: _exa_index_pb_IndexManagementServiceDefinition }
      IndexMode: EnumTypeDefinition
      IndexService: SubtypeConstructor<typeof grpc.Client, _exa_index_pb_IndexServiceClient> & { service: _exa_index_pb_IndexServiceDefinition }
      IndexStats: MessageTypeDefinition<_exa_index_pb_IndexStats, _exa_index_pb_IndexStats__Output>
      IndexerEvent: MessageTypeDefinition<_exa_index_pb_IndexerEvent, _exa_index_pb_IndexerEvent__Output>
      IndexingStatus: EnumTypeDefinition
      ManagementMetadata: MessageTypeDefinition<_exa_index_pb_ManagementMetadata, _exa_index_pb_ManagementMetadata__Output>
      ProgressBar: MessageTypeDefinition<_exa_index_pb_ProgressBar, _exa_index_pb_ProgressBar__Output>
      PruneDatabaseRequest: MessageTypeDefinition<_exa_index_pb_PruneDatabaseRequest, _exa_index_pb_PruneDatabaseRequest__Output>
      PruneDatabaseResponse: MessageTypeDefinition<_exa_index_pb_PruneDatabaseResponse, _exa_index_pb_PruneDatabaseResponse__Output>
      RemoteIndexStats: MessageTypeDefinition<_exa_index_pb_RemoteIndexStats, _exa_index_pb_RemoteIndexStats__Output>
      Repository: MessageTypeDefinition<_exa_index_pb_Repository, _exa_index_pb_Repository__Output>
      RepositoryConfig: MessageTypeDefinition<_exa_index_pb_RepositoryConfig, _exa_index_pb_RepositoryConfig__Output>
      RepositoryFilter: MessageTypeDefinition<_exa_index_pb_RepositoryFilter, _exa_index_pb_RepositoryFilter__Output>
      RequestIndexVersion: MessageTypeDefinition<_exa_index_pb_RequestIndexVersion, _exa_index_pb_RequestIndexVersion__Output>
      RetryIndexingRequest: MessageTypeDefinition<_exa_index_pb_RetryIndexingRequest, _exa_index_pb_RetryIndexingRequest__Output>
      RetryIndexingResponse: MessageTypeDefinition<_exa_index_pb_RetryIndexingResponse, _exa_index_pb_RetryIndexingResponse__Output>
      ScoredContextItem: MessageTypeDefinition<_exa_index_pb_ScoredContextItem, _exa_index_pb_ScoredContextItem__Output>
      SetIndexConfigRequest: MessageTypeDefinition<_exa_index_pb_SetIndexConfigRequest, _exa_index_pb_SetIndexConfigRequest__Output>
      SetIndexConfigResponse: MessageTypeDefinition<_exa_index_pb_SetIndexConfigResponse, _exa_index_pb_SetIndexConfigResponse__Output>
      VectorIndexStats: MessageTypeDefinition<_exa_index_pb_VectorIndexStats, _exa_index_pb_VectorIndexStats__Output>
    }
    knowledge_base_pb: {
      CreateConnectionRequest: MessageTypeDefinition<_exa_knowledge_base_pb_CreateConnectionRequest, _exa_knowledge_base_pb_CreateConnectionRequest__Output>
      CreateConnectionResponse: MessageTypeDefinition<_exa_knowledge_base_pb_CreateConnectionResponse, _exa_knowledge_base_pb_CreateConnectionResponse__Output>
      CreateKnowledgeBaseItemRequest: MessageTypeDefinition<_exa_knowledge_base_pb_CreateKnowledgeBaseItemRequest, _exa_knowledge_base_pb_CreateKnowledgeBaseItemRequest__Output>
      CreateKnowledgeBaseItemResponse: MessageTypeDefinition<_exa_knowledge_base_pb_CreateKnowledgeBaseItemResponse, _exa_knowledge_base_pb_CreateKnowledgeBaseItemResponse__Output>
      DeleteKnowledgeBaseItemRequest: MessageTypeDefinition<_exa_knowledge_base_pb_DeleteKnowledgeBaseItemRequest, _exa_knowledge_base_pb_DeleteKnowledgeBaseItemRequest__Output>
      DeleteKnowledgeBaseItemResponse: MessageTypeDefinition<_exa_knowledge_base_pb_DeleteKnowledgeBaseItemResponse, _exa_knowledge_base_pb_DeleteKnowledgeBaseItemResponse__Output>
      EditKnowledgeBaseItemRequest: MessageTypeDefinition<_exa_knowledge_base_pb_EditKnowledgeBaseItemRequest, _exa_knowledge_base_pb_EditKnowledgeBaseItemRequest__Output>
      EditKnowledgeBaseItemResponse: MessageTypeDefinition<_exa_knowledge_base_pb_EditKnowledgeBaseItemResponse, _exa_knowledge_base_pb_EditKnowledgeBaseItemResponse__Output>
      GetConnectionRequest: MessageTypeDefinition<_exa_knowledge_base_pb_GetConnectionRequest, _exa_knowledge_base_pb_GetConnectionRequest__Output>
      GetConnectionResponse: MessageTypeDefinition<_exa_knowledge_base_pb_GetConnectionResponse, _exa_knowledge_base_pb_GetConnectionResponse__Output>
      GetGithubIntegrationStatusRequest: MessageTypeDefinition<_exa_knowledge_base_pb_GetGithubIntegrationStatusRequest, _exa_knowledge_base_pb_GetGithubIntegrationStatusRequest__Output>
      GetGithubIntegrationStatusResponse: MessageTypeDefinition<_exa_knowledge_base_pb_GetGithubIntegrationStatusResponse, _exa_knowledge_base_pb_GetGithubIntegrationStatusResponse__Output>
      GetGithubPullRequestSearchInfoRequest: MessageTypeDefinition<_exa_knowledge_base_pb_GetGithubPullRequestSearchInfoRequest, _exa_knowledge_base_pb_GetGithubPullRequestSearchInfoRequest__Output>
      GetGithubPullRequestSearchInfoResponse: MessageTypeDefinition<_exa_knowledge_base_pb_GetGithubPullRequestSearchInfoResponse, _exa_knowledge_base_pb_GetGithubPullRequestSearchInfoResponse__Output>
      GetKnowledgeBaseItemsForTeamRequest: MessageTypeDefinition<_exa_knowledge_base_pb_GetKnowledgeBaseItemsForTeamRequest, _exa_knowledge_base_pb_GetKnowledgeBaseItemsForTeamRequest__Output>
      GetKnowledgeBaseItemsForTeamResponse: MessageTypeDefinition<_exa_knowledge_base_pb_GetKnowledgeBaseItemsForTeamResponse, _exa_knowledge_base_pb_GetKnowledgeBaseItemsForTeamResponse__Output>
      GetKnowledgeBaseItemsRequest: MessageTypeDefinition<_exa_knowledge_base_pb_GetKnowledgeBaseItemsRequest, _exa_knowledge_base_pb_GetKnowledgeBaseItemsRequest__Output>
      GetKnowledgeBaseItemsResponse: MessageTypeDefinition<_exa_knowledge_base_pb_GetKnowledgeBaseItemsResponse, _exa_knowledge_base_pb_GetKnowledgeBaseItemsResponse__Output>
      KnowledgeBaseItem: MessageTypeDefinition<_exa_knowledge_base_pb_KnowledgeBaseItem, _exa_knowledge_base_pb_KnowledgeBaseItem__Output>
      KnowledgeBaseService: SubtypeConstructor<typeof grpc.Client, _exa_knowledge_base_pb_KnowledgeBaseServiceClient> & { service: _exa_knowledge_base_pb_KnowledgeBaseServiceDefinition }
      ReadKnowledgeBaseItemRequest: MessageTypeDefinition<_exa_knowledge_base_pb_ReadKnowledgeBaseItemRequest, _exa_knowledge_base_pb_ReadKnowledgeBaseItemRequest__Output>
      ReadKnowledgeBaseItemResponse: MessageTypeDefinition<_exa_knowledge_base_pb_ReadKnowledgeBaseItemResponse, _exa_knowledge_base_pb_ReadKnowledgeBaseItemResponse__Output>
      RemoveConnectionRequest: MessageTypeDefinition<_exa_knowledge_base_pb_RemoveConnectionRequest, _exa_knowledge_base_pb_RemoveConnectionRequest__Output>
      RemoveConnectionResponse: MessageTypeDefinition<_exa_knowledge_base_pb_RemoveConnectionResponse, _exa_knowledge_base_pb_RemoveConnectionResponse__Output>
    }
    language_server_pb: {
      AcceptCompletionRequest: MessageTypeDefinition<_exa_language_server_pb_AcceptCompletionRequest, _exa_language_server_pb_AcceptCompletionRequest__Output>
      AcceptCompletionResponse: MessageTypeDefinition<_exa_language_server_pb_AcceptCompletionResponse, _exa_language_server_pb_AcceptCompletionResponse__Output>
      AcknowledgeCascadeCodeEditRequest: MessageTypeDefinition<_exa_language_server_pb_AcknowledgeCascadeCodeEditRequest, _exa_language_server_pb_AcknowledgeCascadeCodeEditRequest__Output>
      AcknowledgeCascadeCodeEditResponse: MessageTypeDefinition<_exa_language_server_pb_AcknowledgeCascadeCodeEditResponse, _exa_language_server_pb_AcknowledgeCascadeCodeEditResponse__Output>
      AddTrackedWorkspaceRequest: MessageTypeDefinition<_exa_language_server_pb_AddTrackedWorkspaceRequest, _exa_language_server_pb_AddTrackedWorkspaceRequest__Output>
      AddTrackedWorkspaceResponse: MessageTypeDefinition<_exa_language_server_pb_AddTrackedWorkspaceResponse, _exa_language_server_pb_AddTrackedWorkspaceResponse__Output>
      BrainStatus: MessageTypeDefinition<_exa_language_server_pb_BrainStatus, _exa_language_server_pb_BrainStatus__Output>
      BranchCascadeAndGenerateCodeMapRequest: MessageTypeDefinition<_exa_language_server_pb_BranchCascadeAndGenerateCodeMapRequest, _exa_language_server_pb_BranchCascadeAndGenerateCodeMapRequest__Output>
      BranchCascadeAndGenerateCodeMapResponse: MessageTypeDefinition<_exa_language_server_pb_BranchCascadeAndGenerateCodeMapResponse, _exa_language_server_pb_BranchCascadeAndGenerateCodeMapResponse__Output>
      BranchCascadeRequest: MessageTypeDefinition<_exa_language_server_pb_BranchCascadeRequest, _exa_language_server_pb_BranchCascadeRequest__Output>
      BranchCascadeResponse: MessageTypeDefinition<_exa_language_server_pb_BranchCascadeResponse, _exa_language_server_pb_BranchCascadeResponse__Output>
      BranchInfo: MessageTypeDefinition<_exa_language_server_pb_BranchInfo, _exa_language_server_pb_BranchInfo__Output>
      CancelCascadeInvocationAndWaitRequest: MessageTypeDefinition<_exa_language_server_pb_CancelCascadeInvocationAndWaitRequest, _exa_language_server_pb_CancelCascadeInvocationAndWaitRequest__Output>
      CancelCascadeInvocationAndWaitResponse: MessageTypeDefinition<_exa_language_server_pb_CancelCascadeInvocationAndWaitResponse, _exa_language_server_pb_CancelCascadeInvocationAndWaitResponse__Output>
      CancelCascadeInvocationRequest: MessageTypeDefinition<_exa_language_server_pb_CancelCascadeInvocationRequest, _exa_language_server_pb_CancelCascadeInvocationRequest__Output>
      CancelCascadeInvocationResponse: MessageTypeDefinition<_exa_language_server_pb_CancelCascadeInvocationResponse, _exa_language_server_pb_CancelCascadeInvocationResponse__Output>
      CancelCascadeStepsRequest: MessageTypeDefinition<_exa_language_server_pb_CancelCascadeStepsRequest, _exa_language_server_pb_CancelCascadeStepsRequest__Output>
      CancelCascadeStepsResponse: MessageTypeDefinition<_exa_language_server_pb_CancelCascadeStepsResponse, _exa_language_server_pb_CancelCascadeStepsResponse__Output>
      CancelRequestRequest: MessageTypeDefinition<_exa_language_server_pb_CancelRequestRequest, _exa_language_server_pb_CancelRequestRequest__Output>
      CancelRequestResponse: MessageTypeDefinition<_exa_language_server_pb_CancelRequestResponse, _exa_language_server_pb_CancelRequestResponse__Output>
      CaptureCodeRequest: MessageTypeDefinition<_exa_language_server_pb_CaptureCodeRequest, _exa_language_server_pb_CaptureCodeRequest__Output>
      CaptureCodeResponse: MessageTypeDefinition<_exa_language_server_pb_CaptureCodeResponse, _exa_language_server_pb_CaptureCodeResponse__Output>
      CaptureFileRequest: MessageTypeDefinition<_exa_language_server_pb_CaptureFileRequest, _exa_language_server_pb_CaptureFileRequest__Output>
      CaptureFileResponse: MessageTypeDefinition<_exa_language_server_pb_CaptureFileResponse, _exa_language_server_pb_CaptureFileResponse__Output>
      CheckBugsRequest: MessageTypeDefinition<_exa_language_server_pb_CheckBugsRequest, _exa_language_server_pb_CheckBugsRequest__Output>
      CheckBugsResponse: MessageTypeDefinition<_exa_language_server_pb_CheckBugsResponse, _exa_language_server_pb_CheckBugsResponse__Output>
      CheckChatCapacityRequest: MessageTypeDefinition<_exa_language_server_pb_CheckChatCapacityRequest, _exa_language_server_pb_CheckChatCapacityRequest__Output>
      CheckChatCapacityResponse: MessageTypeDefinition<_exa_language_server_pb_CheckChatCapacityResponse, _exa_language_server_pb_CheckChatCapacityResponse__Output>
      CheckUserMessageRateLimitRequest: MessageTypeDefinition<_exa_language_server_pb_CheckUserMessageRateLimitRequest, _exa_language_server_pb_CheckUserMessageRateLimitRequest__Output>
      CheckUserMessageRateLimitResponse: MessageTypeDefinition<_exa_language_server_pb_CheckUserMessageRateLimitResponse, _exa_language_server_pb_CheckUserMessageRateLimitResponse__Output>
      CodeEditRevertPreview: MessageTypeDefinition<_exa_language_server_pb_CodeEditRevertPreview, _exa_language_server_pb_CodeEditRevertPreview__Output>
      CodeRange: MessageTypeDefinition<_exa_language_server_pb_CodeRange, _exa_language_server_pb_CodeRange__Output>
      CodeRevertActionType: EnumTypeDefinition
      CodeTheme: MessageTypeDefinition<_exa_language_server_pb_CodeTheme, _exa_language_server_pb_CodeTheme__Output>
      CodeTrackerState: MessageTypeDefinition<_exa_language_server_pb_CodeTrackerState, _exa_language_server_pb_CodeTrackerState__Output>
      CodeiumState: EnumTypeDefinition
      CommitMessageData: MessageTypeDefinition<_exa_language_server_pb_CommitMessageData, _exa_language_server_pb_CommitMessageData__Output>
      CompletionItem: MessageTypeDefinition<_exa_language_server_pb_CompletionItem, _exa_language_server_pb_CompletionItem__Output>
      CompletionPart: MessageTypeDefinition<_exa_language_server_pb_CompletionPart, _exa_language_server_pb_CompletionPart__Output>
      CompletionPartType: EnumTypeDefinition
      ContextInfoRequest: MessageTypeDefinition<_exa_language_server_pb_ContextInfoRequest, _exa_language_server_pb_ContextInfoRequest__Output>
      ContextInfoResponse: MessageTypeDefinition<_exa_language_server_pb_ContextInfoResponse, _exa_language_server_pb_ContextInfoResponse__Output>
      ContextStatus: MessageTypeDefinition<_exa_language_server_pb_ContextStatus, _exa_language_server_pb_ContextStatus__Output>
      ContextSuggestionSource: EnumTypeDefinition
      ConvergeArenaCascadesRequest: MessageTypeDefinition<_exa_language_server_pb_ConvergeArenaCascadesRequest, _exa_language_server_pb_ConvergeArenaCascadesRequest__Output>
      ConvergeArenaCascadesResponse: MessageTypeDefinition<_exa_language_server_pb_ConvergeArenaCascadesResponse, _exa_language_server_pb_ConvergeArenaCascadesResponse__Output>
      ConversationTagList: MessageTypeDefinition<_exa_language_server_pb_ConversationTagList, _exa_language_server_pb_ConversationTagList__Output>
      CopyBuiltinWorkflowToWorkspaceRequest: MessageTypeDefinition<_exa_language_server_pb_CopyBuiltinWorkflowToWorkspaceRequest, _exa_language_server_pb_CopyBuiltinWorkflowToWorkspaceRequest__Output>
      CopyBuiltinWorkflowToWorkspaceResponse: MessageTypeDefinition<_exa_language_server_pb_CopyBuiltinWorkflowToWorkspaceResponse, _exa_language_server_pb_CopyBuiltinWorkflowToWorkspaceResponse__Output>
      CreateCustomizationFileRequest: MessageTypeDefinition<_exa_language_server_pb_CreateCustomizationFileRequest, _exa_language_server_pb_CreateCustomizationFileRequest__Output>
      CreateCustomizationFileResponse: MessageTypeDefinition<_exa_language_server_pb_CreateCustomizationFileResponse, _exa_language_server_pb_CreateCustomizationFileResponse__Output>
      CreateTrajectoryShareRequest: MessageTypeDefinition<_exa_language_server_pb_CreateTrajectoryShareRequest, _exa_language_server_pb_CreateTrajectoryShareRequest__Output>
      CreateTrajectoryShareResponse: MessageTypeDefinition<_exa_language_server_pb_CreateTrajectoryShareResponse, _exa_language_server_pb_CreateTrajectoryShareResponse__Output>
      CustomizationFileType: EnumTypeDefinition
      DeleteCascadeMemoryRequest: MessageTypeDefinition<_exa_language_server_pb_DeleteCascadeMemoryRequest, _exa_language_server_pb_DeleteCascadeMemoryRequest__Output>
      DeleteCascadeMemoryResponse: MessageTypeDefinition<_exa_language_server_pb_DeleteCascadeMemoryResponse, _exa_language_server_pb_DeleteCascadeMemoryResponse__Output>
      DeleteCascadeTrajectoryRequest: MessageTypeDefinition<_exa_language_server_pb_DeleteCascadeTrajectoryRequest, _exa_language_server_pb_DeleteCascadeTrajectoryRequest__Output>
      DeleteCascadeTrajectoryResponse: MessageTypeDefinition<_exa_language_server_pb_DeleteCascadeTrajectoryResponse, _exa_language_server_pb_DeleteCascadeTrajectoryResponse__Output>
      DismissCodeMapSuggestionRequest: MessageTypeDefinition<_exa_language_server_pb_DismissCodeMapSuggestionRequest, _exa_language_server_pb_DismissCodeMapSuggestionRequest__Output>
      DismissCodeMapSuggestionResponse: MessageTypeDefinition<_exa_language_server_pb_DismissCodeMapSuggestionResponse, _exa_language_server_pb_DismissCodeMapSuggestionResponse__Output>
      EditConfigurationRequest: MessageTypeDefinition<_exa_language_server_pb_EditConfigurationRequest, _exa_language_server_pb_EditConfigurationRequest__Output>
      EditConfigurationResponse: MessageTypeDefinition<_exa_language_server_pb_EditConfigurationResponse, _exa_language_server_pb_EditConfigurationResponse__Output>
      EditSource: EnumTypeDefinition
      ExactSearchMatchPreview: MessageTypeDefinition<_exa_language_server_pb_ExactSearchMatchPreview, _exa_language_server_pb_ExactSearchMatchPreview__Output>
      ExactSearchOptions: MessageTypeDefinition<_exa_language_server_pb_ExactSearchOptions, _exa_language_server_pb_ExactSearchOptions__Output>
      ExactSearchPreviewOptions: MessageTypeDefinition<_exa_language_server_pb_ExactSearchPreviewOptions, _exa_language_server_pb_ExactSearchPreviewOptions__Output>
      ExactSearchQuery: MessageTypeDefinition<_exa_language_server_pb_ExactSearchQuery, _exa_language_server_pb_ExactSearchQuery__Output>
      ExactSearchResult: MessageTypeDefinition<_exa_language_server_pb_ExactSearchResult, _exa_language_server_pb_ExactSearchResult__Output>
      ExitRequest: MessageTypeDefinition<_exa_language_server_pb_ExitRequest, _exa_language_server_pb_ExitRequest__Output>
      ExitResponse: MessageTypeDefinition<_exa_language_server_pb_ExitResponse, _exa_language_server_pb_ExitResponse__Output>
      FileType: EnumTypeDefinition
      ForceBackgroundResearchRefreshRequest: MessageTypeDefinition<_exa_language_server_pb_ForceBackgroundResearchRefreshRequest, _exa_language_server_pb_ForceBackgroundResearchRefreshRequest__Output>
      ForceBackgroundResearchRefreshResponse: MessageTypeDefinition<_exa_language_server_pb_ForceBackgroundResearchRefreshResponse, _exa_language_server_pb_ForceBackgroundResearchRefreshResponse__Output>
      GenerateCodeMapRequest: MessageTypeDefinition<_exa_language_server_pb_GenerateCodeMapRequest, _exa_language_server_pb_GenerateCodeMapRequest__Output>
      GenerateCodeMapResponse: MessageTypeDefinition<_exa_language_server_pb_GenerateCodeMapResponse, _exa_language_server_pb_GenerateCodeMapResponse__Output>
      GenerateCommitMessageRequest: MessageTypeDefinition<_exa_language_server_pb_GenerateCommitMessageRequest, _exa_language_server_pb_GenerateCommitMessageRequest__Output>
      GenerateCommitMessageResponse: MessageTypeDefinition<_exa_language_server_pb_GenerateCommitMessageResponse, _exa_language_server_pb_GenerateCommitMessageResponse__Output>
      GenerateVibeAndReplaceStreamingRequest: MessageTypeDefinition<_exa_language_server_pb_GenerateVibeAndReplaceStreamingRequest, _exa_language_server_pb_GenerateVibeAndReplaceStreamingRequest__Output>
      GenerateVibeAndReplaceStreamingResponse: MessageTypeDefinition<_exa_language_server_pb_GenerateVibeAndReplaceStreamingResponse, _exa_language_server_pb_GenerateVibeAndReplaceStreamingResponse__Output>
      GetActiveAppDeploymentForWorkspaceRequest: MessageTypeDefinition<_exa_language_server_pb_GetActiveAppDeploymentForWorkspaceRequest, _exa_language_server_pb_GetActiveAppDeploymentForWorkspaceRequest__Output>
      GetActiveAppDeploymentForWorkspaceResponse: MessageTypeDefinition<_exa_language_server_pb_GetActiveAppDeploymentForWorkspaceResponse, _exa_language_server_pb_GetActiveAppDeploymentForWorkspaceResponse__Output>
      GetAllCascadeTrajectoriesRequest: MessageTypeDefinition<_exa_language_server_pb_GetAllCascadeTrajectoriesRequest, _exa_language_server_pb_GetAllCascadeTrajectoriesRequest__Output>
      GetAllCascadeTrajectoriesResponse: MessageTypeDefinition<_exa_language_server_pb_GetAllCascadeTrajectoriesResponse, _exa_language_server_pb_GetAllCascadeTrajectoriesResponse__Output>
      GetAllPlansRequest: MessageTypeDefinition<_exa_language_server_pb_GetAllPlansRequest, _exa_language_server_pb_GetAllPlansRequest__Output>
      GetAllPlansResponse: MessageTypeDefinition<_exa_language_server_pb_GetAllPlansResponse, _exa_language_server_pb_GetAllPlansResponse__Output>
      GetAllRulesRequest: MessageTypeDefinition<_exa_language_server_pb_GetAllRulesRequest, _exa_language_server_pb_GetAllRulesRequest__Output>
      GetAllRulesResponse: MessageTypeDefinition<_exa_language_server_pb_GetAllRulesResponse, _exa_language_server_pb_GetAllRulesResponse__Output>
      GetAllSkillsRequest: MessageTypeDefinition<_exa_language_server_pb_GetAllSkillsRequest, _exa_language_server_pb_GetAllSkillsRequest__Output>
      GetAllSkillsResponse: MessageTypeDefinition<_exa_language_server_pb_GetAllSkillsResponse, _exa_language_server_pb_GetAllSkillsResponse__Output>
      GetAllWorkflowsRequest: MessageTypeDefinition<_exa_language_server_pb_GetAllWorkflowsRequest, _exa_language_server_pb_GetAllWorkflowsRequest__Output>
      GetAllWorkflowsResponse: MessageTypeDefinition<_exa_language_server_pb_GetAllWorkflowsResponse, _exa_language_server_pb_GetAllWorkflowsResponse__Output>
      GetAuthTokenRequest: MessageTypeDefinition<_exa_language_server_pb_GetAuthTokenRequest, _exa_language_server_pb_GetAuthTokenRequest__Output>
      GetAuthTokenResponse: MessageTypeDefinition<_exa_language_server_pb_GetAuthTokenResponse, _exa_language_server_pb_GetAuthTokenResponse__Output>
      GetAvailableCascadePluginsRequest: MessageTypeDefinition<_exa_language_server_pb_GetAvailableCascadePluginsRequest, _exa_language_server_pb_GetAvailableCascadePluginsRequest__Output>
      GetAvailableCascadePluginsResponse: MessageTypeDefinition<_exa_language_server_pb_GetAvailableCascadePluginsResponse, _exa_language_server_pb_GetAvailableCascadePluginsResponse__Output>
      GetBrainStatusRequest: MessageTypeDefinition<_exa_language_server_pb_GetBrainStatusRequest, _exa_language_server_pb_GetBrainStatusRequest__Output>
      GetBrainStatusResponse: MessageTypeDefinition<_exa_language_server_pb_GetBrainStatusResponse, _exa_language_server_pb_GetBrainStatusResponse__Output>
      GetCascadeMemoriesRequest: MessageTypeDefinition<_exa_language_server_pb_GetCascadeMemoriesRequest, _exa_language_server_pb_GetCascadeMemoriesRequest__Output>
      GetCascadeMemoriesResponse: MessageTypeDefinition<_exa_language_server_pb_GetCascadeMemoriesResponse, _exa_language_server_pb_GetCascadeMemoriesResponse__Output>
      GetCascadeModelConfigsRequest: MessageTypeDefinition<_exa_language_server_pb_GetCascadeModelConfigsRequest, _exa_language_server_pb_GetCascadeModelConfigsRequest__Output>
      GetCascadeModelConfigsResponse: MessageTypeDefinition<_exa_language_server_pb_GetCascadeModelConfigsResponse, _exa_language_server_pb_GetCascadeModelConfigsResponse__Output>
      GetCascadePluginByIdRequest: MessageTypeDefinition<_exa_language_server_pb_GetCascadePluginByIdRequest, _exa_language_server_pb_GetCascadePluginByIdRequest__Output>
      GetCascadePluginByIdResponse: MessageTypeDefinition<_exa_language_server_pb_GetCascadePluginByIdResponse, _exa_language_server_pb_GetCascadePluginByIdResponse__Output>
      GetCascadeTrajectoryGeneratorMetadataRequest: MessageTypeDefinition<_exa_language_server_pb_GetCascadeTrajectoryGeneratorMetadataRequest, _exa_language_server_pb_GetCascadeTrajectoryGeneratorMetadataRequest__Output>
      GetCascadeTrajectoryGeneratorMetadataResponse: MessageTypeDefinition<_exa_language_server_pb_GetCascadeTrajectoryGeneratorMetadataResponse, _exa_language_server_pb_GetCascadeTrajectoryGeneratorMetadataResponse__Output>
      GetCascadeTrajectoryRequest: MessageTypeDefinition<_exa_language_server_pb_GetCascadeTrajectoryRequest, _exa_language_server_pb_GetCascadeTrajectoryRequest__Output>
      GetCascadeTrajectoryResponse: MessageTypeDefinition<_exa_language_server_pb_GetCascadeTrajectoryResponse, _exa_language_server_pb_GetCascadeTrajectoryResponse__Output>
      GetCascadeTrajectoryStepsRequest: MessageTypeDefinition<_exa_language_server_pb_GetCascadeTrajectoryStepsRequest, _exa_language_server_pb_GetCascadeTrajectoryStepsRequest__Output>
      GetCascadeTrajectoryStepsResponse: MessageTypeDefinition<_exa_language_server_pb_GetCascadeTrajectoryStepsResponse, _exa_language_server_pb_GetCascadeTrajectoryStepsResponse__Output>
      GetChangelogRequest: MessageTypeDefinition<_exa_language_server_pb_GetChangelogRequest, _exa_language_server_pb_GetChangelogRequest__Output>
      GetChangelogResponse: MessageTypeDefinition<_exa_language_server_pb_GetChangelogResponse, _exa_language_server_pb_GetChangelogResponse__Output>
      GetChatMessageResponse: MessageTypeDefinition<_exa_language_server_pb_GetChatMessageResponse, _exa_language_server_pb_GetChatMessageResponse__Output>
      GetClassInfosRequest: MessageTypeDefinition<_exa_language_server_pb_GetClassInfosRequest, _exa_language_server_pb_GetClassInfosRequest__Output>
      GetClassInfosResponse: MessageTypeDefinition<_exa_language_server_pb_GetClassInfosResponse, _exa_language_server_pb_GetClassInfosResponse__Output>
      GetCodeMapSuggestionsRequest: MessageTypeDefinition<_exa_language_server_pb_GetCodeMapSuggestionsRequest, _exa_language_server_pb_GetCodeMapSuggestionsRequest__Output>
      GetCodeMapSuggestionsResponse: MessageTypeDefinition<_exa_language_server_pb_GetCodeMapSuggestionsResponse, _exa_language_server_pb_GetCodeMapSuggestionsResponse__Output>
      GetCodeMapsForFileRequest: MessageTypeDefinition<_exa_language_server_pb_GetCodeMapsForFileRequest, _exa_language_server_pb_GetCodeMapsForFileRequest__Output>
      GetCodeMapsForFileResponse: MessageTypeDefinition<_exa_language_server_pb_GetCodeMapsForFileResponse, _exa_language_server_pb_GetCodeMapsForFileResponse__Output>
      GetCodeMapsForReposRequest: MessageTypeDefinition<_exa_language_server_pb_GetCodeMapsForReposRequest, _exa_language_server_pb_GetCodeMapsForReposRequest__Output>
      GetCodeMapsForReposResponse: MessageTypeDefinition<_exa_language_server_pb_GetCodeMapsForReposResponse, _exa_language_server_pb_GetCodeMapsForReposResponse__Output>
      GetCodeValidationStatesRequest: MessageTypeDefinition<_exa_language_server_pb_GetCodeValidationStatesRequest, _exa_language_server_pb_GetCodeValidationStatesRequest__Output>
      GetCodeValidationStatesResponse: MessageTypeDefinition<_exa_language_server_pb_GetCodeValidationStatesResponse, _exa_language_server_pb_GetCodeValidationStatesResponse__Output>
      GetCommandModelConfigsRequest: MessageTypeDefinition<_exa_language_server_pb_GetCommandModelConfigsRequest, _exa_language_server_pb_GetCommandModelConfigsRequest__Output>
      GetCommandModelConfigsResponse: MessageTypeDefinition<_exa_language_server_pb_GetCommandModelConfigsResponse, _exa_language_server_pb_GetCommandModelConfigsResponse__Output>
      GetCompletionsRequest: MessageTypeDefinition<_exa_language_server_pb_GetCompletionsRequest, _exa_language_server_pb_GetCompletionsRequest__Output>
      GetCompletionsResponse: MessageTypeDefinition<_exa_language_server_pb_GetCompletionsResponse, _exa_language_server_pb_GetCompletionsResponse__Output>
      GetConversationTagsRequest: MessageTypeDefinition<_exa_language_server_pb_GetConversationTagsRequest, _exa_language_server_pb_GetConversationTagsRequest__Output>
      GetConversationTagsResponse: MessageTypeDefinition<_exa_language_server_pb_GetConversationTagsResponse, _exa_language_server_pb_GetConversationTagsResponse__Output>
      GetDebugDiagnosticsRequest: MessageTypeDefinition<_exa_language_server_pb_GetDebugDiagnosticsRequest, _exa_language_server_pb_GetDebugDiagnosticsRequest__Output>
      GetDebugDiagnosticsResponse: MessageTypeDefinition<_exa_language_server_pb_GetDebugDiagnosticsResponse, _exa_language_server_pb_GetDebugDiagnosticsResponse__Output>
      GetDeepWikiResponse: MessageTypeDefinition<_exa_language_server_pb_GetDeepWikiResponse, _exa_language_server_pb_GetDeepWikiResponse__Output>
      GetDefaultWebOriginsRequest: MessageTypeDefinition<_exa_language_server_pb_GetDefaultWebOriginsRequest, _exa_language_server_pb_GetDefaultWebOriginsRequest__Output>
      GetDefaultWebOriginsResponse: MessageTypeDefinition<_exa_language_server_pb_GetDefaultWebOriginsResponse, _exa_language_server_pb_GetDefaultWebOriginsResponse__Output>
      GetExternalModelRequest: MessageTypeDefinition<_exa_language_server_pb_GetExternalModelRequest, _exa_language_server_pb_GetExternalModelRequest__Output>
      GetExternalModelResponse: MessageTypeDefinition<_exa_language_server_pb_GetExternalModelResponse, _exa_language_server_pb_GetExternalModelResponse__Output>
      GetFunctionsRequest: MessageTypeDefinition<_exa_language_server_pb_GetFunctionsRequest, _exa_language_server_pb_GetFunctionsRequest__Output>
      GetFunctionsResponse: MessageTypeDefinition<_exa_language_server_pb_GetFunctionsResponse, _exa_language_server_pb_GetFunctionsResponse__Output>
      GetGithubPullRequestSearchInfoRequest: MessageTypeDefinition<_exa_language_server_pb_GetGithubPullRequestSearchInfoRequest, _exa_language_server_pb_GetGithubPullRequestSearchInfoRequest__Output>
      GetGithubPullRequestSearchInfoResponse: MessageTypeDefinition<_exa_language_server_pb_GetGithubPullRequestSearchInfoResponse, _exa_language_server_pb_GetGithubPullRequestSearchInfoResponse__Output>
      GetKnowledgeBaseItemsForTeamRequest: MessageTypeDefinition<_exa_language_server_pb_GetKnowledgeBaseItemsForTeamRequest, _exa_language_server_pb_GetKnowledgeBaseItemsForTeamRequest__Output>
      GetKnowledgeBaseItemsForTeamResponse: MessageTypeDefinition<_exa_language_server_pb_GetKnowledgeBaseItemsForTeamResponse, _exa_language_server_pb_GetKnowledgeBaseItemsForTeamResponse__Output>
      GetLifeguardConfigRequest: MessageTypeDefinition<_exa_language_server_pb_GetLifeguardConfigRequest, _exa_language_server_pb_GetLifeguardConfigRequest__Output>
      GetLifeguardConfigResponse: MessageTypeDefinition<_exa_language_server_pb_GetLifeguardConfigResponse, _exa_language_server_pb_GetLifeguardConfigResponse__Output>
      GetMatchingCodeContextRequest: MessageTypeDefinition<_exa_language_server_pb_GetMatchingCodeContextRequest, _exa_language_server_pb_GetMatchingCodeContextRequest__Output>
      GetMatchingCodeContextResponse: MessageTypeDefinition<_exa_language_server_pb_GetMatchingCodeContextResponse, _exa_language_server_pb_GetMatchingCodeContextResponse__Output>
      GetMatchingContextScopeItemsRequest: MessageTypeDefinition<_exa_language_server_pb_GetMatchingContextScopeItemsRequest, _exa_language_server_pb_GetMatchingContextScopeItemsRequest__Output>
      GetMatchingContextScopeItemsResponse: MessageTypeDefinition<_exa_language_server_pb_GetMatchingContextScopeItemsResponse, _exa_language_server_pb_GetMatchingContextScopeItemsResponse__Output>
      GetMatchingIndexedReposRequest: MessageTypeDefinition<_exa_language_server_pb_GetMatchingIndexedReposRequest, _exa_language_server_pb_GetMatchingIndexedReposRequest__Output>
      GetMatchingIndexedReposResponse: MessageTypeDefinition<_exa_language_server_pb_GetMatchingIndexedReposResponse, _exa_language_server_pb_GetMatchingIndexedReposResponse__Output>
      GetMcpPromptRequest: MessageTypeDefinition<_exa_language_server_pb_GetMcpPromptRequest, _exa_language_server_pb_GetMcpPromptRequest__Output>
      GetMcpPromptResponse: MessageTypeDefinition<_exa_language_server_pb_GetMcpPromptResponse, _exa_language_server_pb_GetMcpPromptResponse__Output>
      GetMcpServerStatesRequest: MessageTypeDefinition<_exa_language_server_pb_GetMcpServerStatesRequest, _exa_language_server_pb_GetMcpServerStatesRequest__Output>
      GetMcpServerStatesResponse: MessageTypeDefinition<_exa_language_server_pb_GetMcpServerStatesResponse, _exa_language_server_pb_GetMcpServerStatesResponse__Output>
      GetMessageTokenCountRequest: MessageTypeDefinition<_exa_language_server_pb_GetMessageTokenCountRequest, _exa_language_server_pb_GetMessageTokenCountRequest__Output>
      GetMessageTokenCountResponse: MessageTypeDefinition<_exa_language_server_pb_GetMessageTokenCountResponse, _exa_language_server_pb_GetMessageTokenCountResponse__Output>
      GetModelStatusesRequest: MessageTypeDefinition<_exa_language_server_pb_GetModelStatusesRequest, _exa_language_server_pb_GetModelStatusesRequest__Output>
      GetModelStatusesResponse: MessageTypeDefinition<_exa_language_server_pb_GetModelStatusesResponse, _exa_language_server_pb_GetModelStatusesResponse__Output>
      GetPatchAndCodeChangeRequest: MessageTypeDefinition<_exa_language_server_pb_GetPatchAndCodeChangeRequest, _exa_language_server_pb_GetPatchAndCodeChangeRequest__Output>
      GetPatchAndCodeChangeResponse: MessageTypeDefinition<_exa_language_server_pb_GetPatchAndCodeChangeResponse, _exa_language_server_pb_GetPatchAndCodeChangeResponse__Output>
      GetPrimaryApiKeyForDevsOnlyRequest: MessageTypeDefinition<_exa_language_server_pb_GetPrimaryApiKeyForDevsOnlyRequest, _exa_language_server_pb_GetPrimaryApiKeyForDevsOnlyRequest__Output>
      GetPrimaryApiKeyForDevsOnlyResponse: MessageTypeDefinition<_exa_language_server_pb_GetPrimaryApiKeyForDevsOnlyResponse, _exa_language_server_pb_GetPrimaryApiKeyForDevsOnlyResponse__Output>
      GetProcessesRequest: MessageTypeDefinition<_exa_language_server_pb_GetProcessesRequest, _exa_language_server_pb_GetProcessesRequest__Output>
      GetProcessesResponse: MessageTypeDefinition<_exa_language_server_pb_GetProcessesResponse, _exa_language_server_pb_GetProcessesResponse__Output>
      GetProfileDataRequest: MessageTypeDefinition<_exa_language_server_pb_GetProfileDataRequest, _exa_language_server_pb_GetProfileDataRequest__Output>
      GetProfileDataResponse: MessageTypeDefinition<_exa_language_server_pb_GetProfileDataResponse, _exa_language_server_pb_GetProfileDataResponse__Output>
      GetRepoInfosRequest: MessageTypeDefinition<_exa_language_server_pb_GetRepoInfosRequest, _exa_language_server_pb_GetRepoInfosRequest__Output>
      GetRepoInfosResponse: MessageTypeDefinition<_exa_language_server_pb_GetRepoInfosResponse, _exa_language_server_pb_GetRepoInfosResponse__Output>
      GetRevertPreviewRequest: MessageTypeDefinition<_exa_language_server_pb_GetRevertPreviewRequest, _exa_language_server_pb_GetRevertPreviewRequest__Output>
      GetRevertPreviewResponse: MessageTypeDefinition<_exa_language_server_pb_GetRevertPreviewResponse, _exa_language_server_pb_GetRevertPreviewResponse__Output>
      GetSharedCodeMapRequest: MessageTypeDefinition<_exa_language_server_pb_GetSharedCodeMapRequest, _exa_language_server_pb_GetSharedCodeMapRequest__Output>
      GetSharedCodeMapResponse: MessageTypeDefinition<_exa_language_server_pb_GetSharedCodeMapResponse, _exa_language_server_pb_GetSharedCodeMapResponse__Output>
      GetStatusRequest: MessageTypeDefinition<_exa_language_server_pb_GetStatusRequest, _exa_language_server_pb_GetStatusRequest__Output>
      GetStatusResponse: MessageTypeDefinition<_exa_language_server_pb_GetStatusResponse, _exa_language_server_pb_GetStatusResponse__Output>
      GetSuggestedContextScopeItemsRequest: MessageTypeDefinition<_exa_language_server_pb_GetSuggestedContextScopeItemsRequest, _exa_language_server_pb_GetSuggestedContextScopeItemsRequest__Output>
      GetSuggestedContextScopeItemsResponse: MessageTypeDefinition<_exa_language_server_pb_GetSuggestedContextScopeItemsResponse, _exa_language_server_pb_GetSuggestedContextScopeItemsResponse__Output>
      GetSystemPromptAndToolsRequest: MessageTypeDefinition<_exa_language_server_pb_GetSystemPromptAndToolsRequest, _exa_language_server_pb_GetSystemPromptAndToolsRequest__Output>
      GetSystemPromptAndToolsResponse: MessageTypeDefinition<_exa_language_server_pb_GetSystemPromptAndToolsResponse, _exa_language_server_pb_GetSystemPromptAndToolsResponse__Output>
      GetTeamOrganizationalControlsRequest: MessageTypeDefinition<_exa_language_server_pb_GetTeamOrganizationalControlsRequest, _exa_language_server_pb_GetTeamOrganizationalControlsRequest__Output>
      GetTeamOrganizationalControlsResponse: MessageTypeDefinition<_exa_language_server_pb_GetTeamOrganizationalControlsResponse, _exa_language_server_pb_GetTeamOrganizationalControlsResponse__Output>
      GetTranscriptionRequest: MessageTypeDefinition<_exa_language_server_pb_GetTranscriptionRequest, _exa_language_server_pb_GetTranscriptionRequest__Output>
      GetTranscriptionResponse: MessageTypeDefinition<_exa_language_server_pb_GetTranscriptionResponse, _exa_language_server_pb_GetTranscriptionResponse__Output>
      GetUnleashDataRequest: MessageTypeDefinition<_exa_language_server_pb_GetUnleashDataRequest, _exa_language_server_pb_GetUnleashDataRequest__Output>
      GetUnleashDataResponse: MessageTypeDefinition<_exa_language_server_pb_GetUnleashDataResponse, _exa_language_server_pb_GetUnleashDataResponse__Output>
      GetUserAnalyticsSummaryRequest: MessageTypeDefinition<_exa_language_server_pb_GetUserAnalyticsSummaryRequest, _exa_language_server_pb_GetUserAnalyticsSummaryRequest__Output>
      GetUserAnalyticsSummaryResponse: MessageTypeDefinition<_exa_language_server_pb_GetUserAnalyticsSummaryResponse, _exa_language_server_pb_GetUserAnalyticsSummaryResponse__Output>
      GetUserMemoriesRequest: MessageTypeDefinition<_exa_language_server_pb_GetUserMemoriesRequest, _exa_language_server_pb_GetUserMemoriesRequest__Output>
      GetUserMemoriesResponse: MessageTypeDefinition<_exa_language_server_pb_GetUserMemoriesResponse, _exa_language_server_pb_GetUserMemoriesResponse__Output>
      GetUserSettingsRequest: MessageTypeDefinition<_exa_language_server_pb_GetUserSettingsRequest, _exa_language_server_pb_GetUserSettingsRequest__Output>
      GetUserSettingsResponse: MessageTypeDefinition<_exa_language_server_pb_GetUserSettingsResponse, _exa_language_server_pb_GetUserSettingsResponse__Output>
      GetUserStatusRequest: MessageTypeDefinition<_exa_language_server_pb_GetUserStatusRequest, _exa_language_server_pb_GetUserStatusRequest__Output>
      GetUserStatusResponse: MessageTypeDefinition<_exa_language_server_pb_GetUserStatusResponse, _exa_language_server_pb_GetUserStatusResponse__Output>
      GetUserTrajectoryDebugRequest: MessageTypeDefinition<_exa_language_server_pb_GetUserTrajectoryDebugRequest, _exa_language_server_pb_GetUserTrajectoryDebugRequest__Output>
      GetUserTrajectoryDebugResponse: MessageTypeDefinition<_exa_language_server_pb_GetUserTrajectoryDebugResponse, _exa_language_server_pb_GetUserTrajectoryDebugResponse__Output>
      GetUserTrajectoryDescriptionsRequest: MessageTypeDefinition<_exa_language_server_pb_GetUserTrajectoryDescriptionsRequest, _exa_language_server_pb_GetUserTrajectoryDescriptionsRequest__Output>
      GetUserTrajectoryDescriptionsResponse: MessageTypeDefinition<_exa_language_server_pb_GetUserTrajectoryDescriptionsResponse, _exa_language_server_pb_GetUserTrajectoryDescriptionsResponse__Output>
      GetUserTrajectoryRequest: MessageTypeDefinition<_exa_language_server_pb_GetUserTrajectoryRequest, _exa_language_server_pb_GetUserTrajectoryRequest__Output>
      GetUserTrajectoryResponse: MessageTypeDefinition<_exa_language_server_pb_GetUserTrajectoryResponse, _exa_language_server_pb_GetUserTrajectoryResponse__Output>
      GetWebDocsOptionsRequest: MessageTypeDefinition<_exa_language_server_pb_GetWebDocsOptionsRequest, _exa_language_server_pb_GetWebDocsOptionsRequest__Output>
      GetWebDocsOptionsResponse: MessageTypeDefinition<_exa_language_server_pb_GetWebDocsOptionsResponse, _exa_language_server_pb_GetWebDocsOptionsResponse__Output>
      GetWindsurfJSAppDeploymentRequest: MessageTypeDefinition<_exa_language_server_pb_GetWindsurfJSAppDeploymentRequest, _exa_language_server_pb_GetWindsurfJSAppDeploymentRequest__Output>
      GetWindsurfJSAppDeploymentResponse: MessageTypeDefinition<_exa_language_server_pb_GetWindsurfJSAppDeploymentResponse, _exa_language_server_pb_GetWindsurfJSAppDeploymentResponse__Output>
      GetWorkspaceEditStateRequest: MessageTypeDefinition<_exa_language_server_pb_GetWorkspaceEditStateRequest, _exa_language_server_pb_GetWorkspaceEditStateRequest__Output>
      GetWorkspaceEditStateResponse: MessageTypeDefinition<_exa_language_server_pb_GetWorkspaceEditStateResponse, _exa_language_server_pb_GetWorkspaceEditStateResponse__Output>
      GetWorkspaceInfosRequest: MessageTypeDefinition<_exa_language_server_pb_GetWorkspaceInfosRequest, _exa_language_server_pb_GetWorkspaceInfosRequest__Output>
      GetWorkspaceInfosResponse: MessageTypeDefinition<_exa_language_server_pb_GetWorkspaceInfosResponse, _exa_language_server_pb_GetWorkspaceInfosResponse__Output>
      HandleCascadeUserInteractionRequest: MessageTypeDefinition<_exa_language_server_pb_HandleCascadeUserInteractionRequest, _exa_language_server_pb_HandleCascadeUserInteractionRequest__Output>
      HandleCascadeUserInteractionResponse: MessageTypeDefinition<_exa_language_server_pb_HandleCascadeUserInteractionResponse, _exa_language_server_pb_HandleCascadeUserInteractionResponse__Output>
      HandleStreamingCommandRequest: MessageTypeDefinition<_exa_language_server_pb_HandleStreamingCommandRequest, _exa_language_server_pb_HandleStreamingCommandRequest__Output>
      HandleStreamingCommandResponse: MessageTypeDefinition<_exa_language_server_pb_HandleStreamingCommandResponse, _exa_language_server_pb_HandleStreamingCommandResponse__Output>
      HandleStreamingTabRequest: MessageTypeDefinition<_exa_language_server_pb_HandleStreamingTabRequest, _exa_language_server_pb_HandleStreamingTabRequest__Output>
      HandleStreamingTabResponse: MessageTypeDefinition<_exa_language_server_pb_HandleStreamingTabResponse, _exa_language_server_pb_HandleStreamingTabResponse__Output>
      HandleStreamingTabV2Request: MessageTypeDefinition<_exa_language_server_pb_HandleStreamingTabV2Request, _exa_language_server_pb_HandleStreamingTabV2Request__Output>
      HandleStreamingTabV2Response: MessageTypeDefinition<_exa_language_server_pb_HandleStreamingTabV2Response, _exa_language_server_pb_HandleStreamingTabV2Response__Output>
      HandleStreamingTerminalCommandRequest: MessageTypeDefinition<_exa_language_server_pb_HandleStreamingTerminalCommandRequest, _exa_language_server_pb_HandleStreamingTerminalCommandRequest__Output>
      HandleStreamingTerminalCommandResponse: MessageTypeDefinition<_exa_language_server_pb_HandleStreamingTerminalCommandResponse, _exa_language_server_pb_HandleStreamingTerminalCommandResponse__Output>
      HeartbeatRequest: MessageTypeDefinition<_exa_language_server_pb_HeartbeatRequest, _exa_language_server_pb_HeartbeatRequest__Output>
      HeartbeatResponse: MessageTypeDefinition<_exa_language_server_pb_HeartbeatResponse, _exa_language_server_pb_HeartbeatResponse__Output>
      IdeAction: EnumTypeDefinition
      ImportFromCursorRequest: MessageTypeDefinition<_exa_language_server_pb_ImportFromCursorRequest, _exa_language_server_pb_ImportFromCursorRequest__Output>
      ImportFromCursorResponse: MessageTypeDefinition<_exa_language_server_pb_ImportFromCursorResponse, _exa_language_server_pb_ImportFromCursorResponse__Output>
      IndexStatus: MessageTypeDefinition<_exa_language_server_pb_IndexStatus, _exa_language_server_pb_IndexStatus__Output>
      InitializeCascadePanelStateRequest: MessageTypeDefinition<_exa_language_server_pb_InitializeCascadePanelStateRequest, _exa_language_server_pb_InitializeCascadePanelStateRequest__Output>
      InitializeCascadePanelStateResponse: MessageTypeDefinition<_exa_language_server_pb_InitializeCascadePanelStateResponse, _exa_language_server_pb_InitializeCascadePanelStateResponse__Output>
      InstallCascadePluginRequest: MessageTypeDefinition<_exa_language_server_pb_InstallCascadePluginRequest, _exa_language_server_pb_InstallCascadePluginRequest__Output>
      InstallCascadePluginResponse: MessageTypeDefinition<_exa_language_server_pb_InstallCascadePluginResponse, _exa_language_server_pb_InstallCascadePluginResponse__Output>
      InterruptWithQueuedMessageRequest: MessageTypeDefinition<_exa_language_server_pb_InterruptWithQueuedMessageRequest, _exa_language_server_pb_InterruptWithQueuedMessageRequest__Output>
      InterruptWithQueuedMessageResponse: MessageTypeDefinition<_exa_language_server_pb_InterruptWithQueuedMessageResponse, _exa_language_server_pb_InterruptWithQueuedMessageResponse__Output>
      LanguageServerService: SubtypeConstructor<typeof grpc.Client, _exa_language_server_pb_LanguageServerServiceClient> & { service: _exa_language_server_pb_LanguageServerServiceDefinition }
      LatencyInfo: MessageTypeDefinition<_exa_language_server_pb_LatencyInfo, _exa_language_server_pb_LatencyInfo__Output>
      LocalIndexStatus: MessageTypeDefinition<_exa_language_server_pb_LocalIndexStatus, _exa_language_server_pb_LocalIndexStatus__Output>
      LogCascadeSessionRequest: MessageTypeDefinition<_exa_language_server_pb_LogCascadeSessionRequest, _exa_language_server_pb_LogCascadeSessionRequest__Output>
      LogCascadeSessionResponse: MessageTypeDefinition<_exa_language_server_pb_LogCascadeSessionResponse, _exa_language_server_pb_LogCascadeSessionResponse__Output>
      McpPromptMessage: MessageTypeDefinition<_exa_language_server_pb_McpPromptMessage, _exa_language_server_pb_McpPromptMessage__Output>
      McpPromptMessageContent: MessageTypeDefinition<_exa_language_server_pb_McpPromptMessageContent, _exa_language_server_pb_McpPromptMessageContent__Output>
      MigrateApiKeyRequest: MessageTypeDefinition<_exa_language_server_pb_MigrateApiKeyRequest, _exa_language_server_pb_MigrateApiKeyRequest__Output>
      MigrateApiKeyResponse: MessageTypeDefinition<_exa_language_server_pb_MigrateApiKeyResponse, _exa_language_server_pb_MigrateApiKeyResponse__Output>
      MountCascadeFilesystemRequest: MessageTypeDefinition<_exa_language_server_pb_MountCascadeFilesystemRequest, _exa_language_server_pb_MountCascadeFilesystemRequest__Output>
      MountCascadeFilesystemResponse: MessageTypeDefinition<_exa_language_server_pb_MountCascadeFilesystemResponse, _exa_language_server_pb_MountCascadeFilesystemResponse__Output>
      MoveQueuedMessageRequest: MessageTypeDefinition<_exa_language_server_pb_MoveQueuedMessageRequest, _exa_language_server_pb_MoveQueuedMessageRequest__Output>
      MoveQueuedMessageResponse: MessageTypeDefinition<_exa_language_server_pb_MoveQueuedMessageResponse, _exa_language_server_pb_MoveQueuedMessageResponse__Output>
      MultilineConfig: MessageTypeDefinition<_exa_language_server_pb_MultilineConfig, _exa_language_server_pb_MultilineConfig__Output>
      OnEditRequest: MessageTypeDefinition<_exa_language_server_pb_OnEditRequest, _exa_language_server_pb_OnEditRequest__Output>
      OnEditResponse: MessageTypeDefinition<_exa_language_server_pb_OnEditResponse, _exa_language_server_pb_OnEditResponse__Output>
      OnboardingItemState: MessageTypeDefinition<_exa_language_server_pb_OnboardingItemState, _exa_language_server_pb_OnboardingItemState__Output>
      OnboardingState: MessageTypeDefinition<_exa_language_server_pb_OnboardingState, _exa_language_server_pb_OnboardingState__Output>
      PlanFileInfo: MessageTypeDefinition<_exa_language_server_pb_PlanFileInfo, _exa_language_server_pb_PlanFileInfo__Output>
      ProgressBar: MessageTypeDefinition<_exa_language_server_pb_ProgressBar, _exa_language_server_pb_ProgressBar__Output>
      ProgressBarsRequest: MessageTypeDefinition<_exa_language_server_pb_ProgressBarsRequest, _exa_language_server_pb_ProgressBarsRequest__Output>
      ProgressBarsResponse: MessageTypeDefinition<_exa_language_server_pb_ProgressBarsResponse, _exa_language_server_pb_ProgressBarsResponse__Output>
      ProvideCompletionFeedbackRequest: MessageTypeDefinition<_exa_language_server_pb_ProvideCompletionFeedbackRequest, _exa_language_server_pb_ProvideCompletionFeedbackRequest__Output>
      ProvideCompletionFeedbackResponse: MessageTypeDefinition<_exa_language_server_pb_ProvideCompletionFeedbackResponse, _exa_language_server_pb_ProvideCompletionFeedbackResponse__Output>
      QueueCascadeMessageRequest: MessageTypeDefinition<_exa_language_server_pb_QueueCascadeMessageRequest, _exa_language_server_pb_QueueCascadeMessageRequest__Output>
      QueueCascadeMessageResponse: MessageTypeDefinition<_exa_language_server_pb_QueueCascadeMessageResponse, _exa_language_server_pb_QueueCascadeMessageResponse__Output>
      RawGetChatMessageResponse: MessageTypeDefinition<_exa_language_server_pb_RawGetChatMessageResponse, _exa_language_server_pb_RawGetChatMessageResponse__Output>
      RecordChatFeedbackRequest: MessageTypeDefinition<_exa_language_server_pb_RecordChatFeedbackRequest, _exa_language_server_pb_RecordChatFeedbackRequest__Output>
      RecordChatFeedbackResponse: MessageTypeDefinition<_exa_language_server_pb_RecordChatFeedbackResponse, _exa_language_server_pb_RecordChatFeedbackResponse__Output>
      RecordChatPanelSessionRequest: MessageTypeDefinition<_exa_language_server_pb_RecordChatPanelSessionRequest, _exa_language_server_pb_RecordChatPanelSessionRequest__Output>
      RecordChatPanelSessionResponse: MessageTypeDefinition<_exa_language_server_pb_RecordChatPanelSessionResponse, _exa_language_server_pb_RecordChatPanelSessionResponse__Output>
      RecordCommitMessageSaveRequest: MessageTypeDefinition<_exa_language_server_pb_RecordCommitMessageSaveRequest, _exa_language_server_pb_RecordCommitMessageSaveRequest__Output>
      RecordCommitMessageSaveResponse: MessageTypeDefinition<_exa_language_server_pb_RecordCommitMessageSaveResponse, _exa_language_server_pb_RecordCommitMessageSaveResponse__Output>
      RecordEventRequest: MessageTypeDefinition<_exa_language_server_pb_RecordEventRequest, _exa_language_server_pb_RecordEventRequest__Output>
      RecordEventResponse: MessageTypeDefinition<_exa_language_server_pb_RecordEventResponse, _exa_language_server_pb_RecordEventResponse__Output>
      RecordLintsRequest: MessageTypeDefinition<_exa_language_server_pb_RecordLintsRequest, _exa_language_server_pb_RecordLintsRequest__Output>
      RecordLintsResponse: MessageTypeDefinition<_exa_language_server_pb_RecordLintsResponse, _exa_language_server_pb_RecordLintsResponse__Output>
      RecordSearchDocOpenRequest: MessageTypeDefinition<_exa_language_server_pb_RecordSearchDocOpenRequest, _exa_language_server_pb_RecordSearchDocOpenRequest__Output>
      RecordSearchDocOpenResponse: MessageTypeDefinition<_exa_language_server_pb_RecordSearchDocOpenResponse, _exa_language_server_pb_RecordSearchDocOpenResponse__Output>
      RecordSearchResultsViewRequest: MessageTypeDefinition<_exa_language_server_pb_RecordSearchResultsViewRequest, _exa_language_server_pb_RecordSearchResultsViewRequest__Output>
      RecordSearchResultsViewResponse: MessageTypeDefinition<_exa_language_server_pb_RecordSearchResultsViewResponse, _exa_language_server_pb_RecordSearchResultsViewResponse__Output>
      RecordSystemMetricsRequest: MessageTypeDefinition<_exa_language_server_pb_RecordSystemMetricsRequest, _exa_language_server_pb_RecordSystemMetricsRequest__Output>
      RecordSystemMetricsResponse: MessageTypeDefinition<_exa_language_server_pb_RecordSystemMetricsResponse, _exa_language_server_pb_RecordSystemMetricsResponse__Output>
      RecordUserGrepRequest: MessageTypeDefinition<_exa_language_server_pb_RecordUserGrepRequest, _exa_language_server_pb_RecordUserGrepRequest__Output>
      RecordUserGrepResponse: MessageTypeDefinition<_exa_language_server_pb_RecordUserGrepResponse, _exa_language_server_pb_RecordUserGrepResponse__Output>
      RecordUserStepSnapshotRequest: MessageTypeDefinition<_exa_language_server_pb_RecordUserStepSnapshotRequest, _exa_language_server_pb_RecordUserStepSnapshotRequest__Output>
      RecordUserStepSnapshotResponse: MessageTypeDefinition<_exa_language_server_pb_RecordUserStepSnapshotResponse, _exa_language_server_pb_RecordUserStepSnapshotResponse__Output>
      RefreshContextForIdeActionRequest: MessageTypeDefinition<_exa_language_server_pb_RefreshContextForIdeActionRequest, _exa_language_server_pb_RefreshContextForIdeActionRequest__Output>
      RefreshContextForIdeActionResponse: MessageTypeDefinition<_exa_language_server_pb_RefreshContextForIdeActionResponse, _exa_language_server_pb_RefreshContextForIdeActionResponse__Output>
      RefreshCustomizationRequest: MessageTypeDefinition<_exa_language_server_pb_RefreshCustomizationRequest, _exa_language_server_pb_RefreshCustomizationRequest__Output>
      RefreshCustomizationResponse: MessageTypeDefinition<_exa_language_server_pb_RefreshCustomizationResponse, _exa_language_server_pb_RefreshCustomizationResponse__Output>
      RefreshMcpServersRequest: MessageTypeDefinition<_exa_language_server_pb_RefreshMcpServersRequest, _exa_language_server_pb_RefreshMcpServersRequest__Output>
      RefreshMcpServersResponse: MessageTypeDefinition<_exa_language_server_pb_RefreshMcpServersResponse, _exa_language_server_pb_RefreshMcpServersResponse__Output>
      RegisterUserRequest: MessageTypeDefinition<_exa_language_server_pb_RegisterUserRequest, _exa_language_server_pb_RegisterUserRequest__Output>
      RegisterUserResponse: MessageTypeDefinition<_exa_language_server_pb_RegisterUserResponse, _exa_language_server_pb_RegisterUserResponse__Output>
      RemoveFromQueueRequest: MessageTypeDefinition<_exa_language_server_pb_RemoveFromQueueRequest, _exa_language_server_pb_RemoveFromQueueRequest__Output>
      RemoveFromQueueResponse: MessageTypeDefinition<_exa_language_server_pb_RemoveFromQueueResponse, _exa_language_server_pb_RemoveFromQueueResponse__Output>
      RemoveTrackedWorkspaceRequest: MessageTypeDefinition<_exa_language_server_pb_RemoveTrackedWorkspaceRequest, _exa_language_server_pb_RemoveTrackedWorkspaceRequest__Output>
      RemoveTrackedWorkspaceResponse: MessageTypeDefinition<_exa_language_server_pb_RemoveTrackedWorkspaceResponse, _exa_language_server_pb_RemoveTrackedWorkspaceResponse__Output>
      RenameCascadeTrajectoryRequest: MessageTypeDefinition<_exa_language_server_pb_RenameCascadeTrajectoryRequest, _exa_language_server_pb_RenameCascadeTrajectoryRequest__Output>
      RenameCascadeTrajectoryResponse: MessageTypeDefinition<_exa_language_server_pb_RenameCascadeTrajectoryResponse, _exa_language_server_pb_RenameCascadeTrajectoryResponse__Output>
      ReplayGroundTruthTrajectoryRequest: MessageTypeDefinition<_exa_language_server_pb_ReplayGroundTruthTrajectoryRequest, _exa_language_server_pb_ReplayGroundTruthTrajectoryRequest__Output>
      ReplayGroundTruthTrajectoryResponse: MessageTypeDefinition<_exa_language_server_pb_ReplayGroundTruthTrajectoryResponse, _exa_language_server_pb_ReplayGroundTruthTrajectoryResponse__Output>
      RepoInfo: MessageTypeDefinition<_exa_language_server_pb_RepoInfo, _exa_language_server_pb_RepoInfo__Output>
      RequestInfo: MessageTypeDefinition<_exa_language_server_pb_RequestInfo, _exa_language_server_pb_RequestInfo__Output>
      ResetOnboardingRequest: MessageTypeDefinition<_exa_language_server_pb_ResetOnboardingRequest, _exa_language_server_pb_ResetOnboardingRequest__Output>
      ResetOnboardingResponse: MessageTypeDefinition<_exa_language_server_pb_ResetOnboardingResponse, _exa_language_server_pb_ResetOnboardingResponse__Output>
      ResolveOutstandingStepsRequest: MessageTypeDefinition<_exa_language_server_pb_ResolveOutstandingStepsRequest, _exa_language_server_pb_ResolveOutstandingStepsRequest__Output>
      ResolveOutstandingStepsResponse: MessageTypeDefinition<_exa_language_server_pb_ResolveOutstandingStepsResponse, _exa_language_server_pb_ResolveOutstandingStepsResponse__Output>
      ResolveWorktreeChangesMode: EnumTypeDefinition
      ResolveWorktreeChangesRequest: MessageTypeDefinition<_exa_language_server_pb_ResolveWorktreeChangesRequest, _exa_language_server_pb_ResolveWorktreeChangesRequest__Output>
      ResolveWorktreeChangesResponse: MessageTypeDefinition<_exa_language_server_pb_ResolveWorktreeChangesResponse, _exa_language_server_pb_ResolveWorktreeChangesResponse__Output>
      RevertToCascadeStepRequest: MessageTypeDefinition<_exa_language_server_pb_RevertToCascadeStepRequest, _exa_language_server_pb_RevertToCascadeStepRequest__Output>
      RevertToCascadeStepResponse: MessageTypeDefinition<_exa_language_server_pb_RevertToCascadeStepResponse, _exa_language_server_pb_RevertToCascadeStepResponse__Output>
      SaveCodeMapFromJsonRequest: MessageTypeDefinition<_exa_language_server_pb_SaveCodeMapFromJsonRequest, _exa_language_server_pb_SaveCodeMapFromJsonRequest__Output>
      SaveCodeMapFromJsonResponse: MessageTypeDefinition<_exa_language_server_pb_SaveCodeMapFromJsonResponse, _exa_language_server_pb_SaveCodeMapFromJsonResponse__Output>
      SaveMcpServerToConfigFileRequest: MessageTypeDefinition<_exa_language_server_pb_SaveMcpServerToConfigFileRequest, _exa_language_server_pb_SaveMcpServerToConfigFileRequest__Output>
      SaveMcpServerToConfigFileResponse: MessageTypeDefinition<_exa_language_server_pb_SaveMcpServerToConfigFileResponse, _exa_language_server_pb_SaveMcpServerToConfigFileResponse__Output>
      SaveWindsurfJSAppProjectNameRequest: MessageTypeDefinition<_exa_language_server_pb_SaveWindsurfJSAppProjectNameRequest, _exa_language_server_pb_SaveWindsurfJSAppProjectNameRequest__Output>
      SaveWindsurfJSAppProjectNameResponse: MessageTypeDefinition<_exa_language_server_pb_SaveWindsurfJSAppProjectNameResponse, _exa_language_server_pb_SaveWindsurfJSAppProjectNameResponse__Output>
      SearchResult: MessageTypeDefinition<_exa_language_server_pb_SearchResult, _exa_language_server_pb_SearchResult__Output>
      SearchResultCluster: MessageTypeDefinition<_exa_language_server_pb_SearchResultCluster, _exa_language_server_pb_SearchResultCluster__Output>
      SendActionToChatPanelRequest: MessageTypeDefinition<_exa_language_server_pb_SendActionToChatPanelRequest, _exa_language_server_pb_SendActionToChatPanelRequest__Output>
      SendActionToChatPanelResponse: MessageTypeDefinition<_exa_language_server_pb_SendActionToChatPanelResponse, _exa_language_server_pb_SendActionToChatPanelResponse__Output>
      SendUserCascadeMessageRequest: MessageTypeDefinition<_exa_language_server_pb_SendUserCascadeMessageRequest, _exa_language_server_pb_SendUserCascadeMessageRequest__Output>
      SendUserCascadeMessageResponse: MessageTypeDefinition<_exa_language_server_pb_SendUserCascadeMessageResponse, _exa_language_server_pb_SendUserCascadeMessageResponse__Output>
      SetBaseExperimentsRequest: MessageTypeDefinition<_exa_language_server_pb_SetBaseExperimentsRequest, _exa_language_server_pb_SetBaseExperimentsRequest__Output>
      SetBaseExperimentsResponse: MessageTypeDefinition<_exa_language_server_pb_SetBaseExperimentsResponse, _exa_language_server_pb_SetBaseExperimentsResponse__Output>
      SetPinnedContextRequest: MessageTypeDefinition<_exa_language_server_pb_SetPinnedContextRequest, _exa_language_server_pb_SetPinnedContextRequest__Output>
      SetPinnedContextResponse: MessageTypeDefinition<_exa_language_server_pb_SetPinnedContextResponse, _exa_language_server_pb_SetPinnedContextResponse__Output>
      SetPinnedGuidelineRequest: MessageTypeDefinition<_exa_language_server_pb_SetPinnedGuidelineRequest, _exa_language_server_pb_SetPinnedGuidelineRequest__Output>
      SetPinnedGuidelineResponse: MessageTypeDefinition<_exa_language_server_pb_SetPinnedGuidelineResponse, _exa_language_server_pb_SetPinnedGuidelineResponse__Output>
      SetUserSettingsRequest: MessageTypeDefinition<_exa_language_server_pb_SetUserSettingsRequest, _exa_language_server_pb_SetUserSettingsRequest__Output>
      SetUserSettingsResponse: MessageTypeDefinition<_exa_language_server_pb_SetUserSettingsResponse, _exa_language_server_pb_SetUserSettingsResponse__Output>
      SetupUniversitySandboxRequest: MessageTypeDefinition<_exa_language_server_pb_SetupUniversitySandboxRequest, _exa_language_server_pb_SetupUniversitySandboxRequest__Output>
      SetupUniversitySandboxResponse: MessageTypeDefinition<_exa_language_server_pb_SetupUniversitySandboxResponse, _exa_language_server_pb_SetupUniversitySandboxResponse__Output>
      ShareCodeMapRequest: MessageTypeDefinition<_exa_language_server_pb_ShareCodeMapRequest, _exa_language_server_pb_ShareCodeMapRequest__Output>
      ShareCodeMapResponse: MessageTypeDefinition<_exa_language_server_pb_ShareCodeMapResponse, _exa_language_server_pb_ShareCodeMapResponse__Output>
      ShouldEnableUnleashRequest: MessageTypeDefinition<_exa_language_server_pb_ShouldEnableUnleashRequest, _exa_language_server_pb_ShouldEnableUnleashRequest__Output>
      ShouldEnableUnleashResponse: MessageTypeDefinition<_exa_language_server_pb_ShouldEnableUnleashResponse, _exa_language_server_pb_ShouldEnableUnleashResponse__Output>
      SkipOnboardingRequest: MessageTypeDefinition<_exa_language_server_pb_SkipOnboardingRequest, _exa_language_server_pb_SkipOnboardingRequest__Output>
      SkipOnboardingResponse: MessageTypeDefinition<_exa_language_server_pb_SkipOnboardingResponse, _exa_language_server_pb_SkipOnboardingResponse__Output>
      SpawnArenaModeMidConversationRequest: MessageTypeDefinition<_exa_language_server_pb_SpawnArenaModeMidConversationRequest, _exa_language_server_pb_SpawnArenaModeMidConversationRequest__Output>
      SpawnArenaModeMidConversationResponse: MessageTypeDefinition<_exa_language_server_pb_SpawnArenaModeMidConversationResponse, _exa_language_server_pb_SpawnArenaModeMidConversationResponse__Output>
      StartCascadeRequest: MessageTypeDefinition<_exa_language_server_pb_StartCascadeRequest, _exa_language_server_pb_StartCascadeRequest__Output>
      StartCascadeResponse: MessageTypeDefinition<_exa_language_server_pb_StartCascadeResponse, _exa_language_server_pb_StartCascadeResponse__Output>
      StatUriRequest: MessageTypeDefinition<_exa_language_server_pb_StatUriRequest, _exa_language_server_pb_StatUriRequest__Output>
      StatUriResponse: MessageTypeDefinition<_exa_language_server_pb_StatUriResponse, _exa_language_server_pb_StatUriResponse__Output>
      State: MessageTypeDefinition<_exa_language_server_pb_State, _exa_language_server_pb_State__Output>
      StreamTerminalShellCommandResponse: MessageTypeDefinition<_exa_language_server_pb_StreamTerminalShellCommandResponse, _exa_language_server_pb_StreamTerminalShellCommandResponse__Output>
      SubmitBugReportRequest: MessageTypeDefinition<_exa_language_server_pb_SubmitBugReportRequest, _exa_language_server_pb_SubmitBugReportRequest__Output>
      SubmitBugReportResponse: MessageTypeDefinition<_exa_language_server_pb_SubmitBugReportResponse, _exa_language_server_pb_SubmitBugReportResponse__Output>
      Suffix: MessageTypeDefinition<_exa_language_server_pb_Suffix, _exa_language_server_pb_Suffix__Output>
      SyncExploreAgentRunRequest: MessageTypeDefinition<_exa_language_server_pb_SyncExploreAgentRunRequest, _exa_language_server_pb_SyncExploreAgentRunRequest__Output>
      SyncExploreAgentRunResponse: MessageTypeDefinition<_exa_language_server_pb_SyncExploreAgentRunResponse, _exa_language_server_pb_SyncExploreAgentRunResponse__Output>
      TabRequestInfo: MessageTypeDefinition<_exa_language_server_pb_TabRequestInfo, _exa_language_server_pb_TabRequestInfo__Output>
      TabRequestSource: EnumTypeDefinition
      TeamOrganizationalControls: MessageTypeDefinition<_exa_language_server_pb_TeamOrganizationalControls, _exa_language_server_pb_TeamOrganizationalControls__Output>
      TerminalCommandConversationEntry: MessageTypeDefinition<_exa_language_server_pb_TerminalCommandConversationEntry, _exa_language_server_pb_TerminalCommandConversationEntry__Output>
      ToggleMcpToolRequest: MessageTypeDefinition<_exa_language_server_pb_ToggleMcpToolRequest, _exa_language_server_pb_ToggleMcpToolRequest__Output>
      ToggleMcpToolResponse: MessageTypeDefinition<_exa_language_server_pb_ToggleMcpToolResponse, _exa_language_server_pb_ToggleMcpToolResponse__Output>
      UnifiedDiff: MessageTypeDefinition<_exa_language_server_pb_UnifiedDiff, _exa_language_server_pb_UnifiedDiff__Output>
      UnifiedDiffChange: MessageTypeDefinition<_exa_language_server_pb_UnifiedDiffChange, _exa_language_server_pb_UnifiedDiffChange__Output>
      UnifiedDiffChangeType: EnumTypeDefinition
      UnmountCascadeFilesystemRequest: MessageTypeDefinition<_exa_language_server_pb_UnmountCascadeFilesystemRequest, _exa_language_server_pb_UnmountCascadeFilesystemRequest__Output>
      UnmountCascadeFilesystemResponse: MessageTypeDefinition<_exa_language_server_pb_UnmountCascadeFilesystemResponse, _exa_language_server_pb_UnmountCascadeFilesystemResponse__Output>
      UpdateAutoCascadeGithubCredentialsRequest: MessageTypeDefinition<_exa_language_server_pb_UpdateAutoCascadeGithubCredentialsRequest, _exa_language_server_pb_UpdateAutoCascadeGithubCredentialsRequest__Output>
      UpdateAutoCascadeGithubCredentialsResponse: MessageTypeDefinition<_exa_language_server_pb_UpdateAutoCascadeGithubCredentialsResponse, _exa_language_server_pb_UpdateAutoCascadeGithubCredentialsResponse__Output>
      UpdateCascadeMemoryRequest: MessageTypeDefinition<_exa_language_server_pb_UpdateCascadeMemoryRequest, _exa_language_server_pb_UpdateCascadeMemoryRequest__Output>
      UpdateCascadeMemoryResponse: MessageTypeDefinition<_exa_language_server_pb_UpdateCascadeMemoryResponse, _exa_language_server_pb_UpdateCascadeMemoryResponse__Output>
      UpdateCodeMapMetadataRequest: MessageTypeDefinition<_exa_language_server_pb_UpdateCodeMapMetadataRequest, _exa_language_server_pb_UpdateCodeMapMetadataRequest__Output>
      UpdateCodeMapMetadataResponse: MessageTypeDefinition<_exa_language_server_pb_UpdateCodeMapMetadataResponse, _exa_language_server_pb_UpdateCodeMapMetadataResponse__Output>
      UpdateConversationTagsRequest: MessageTypeDefinition<_exa_language_server_pb_UpdateConversationTagsRequest, _exa_language_server_pb_UpdateConversationTagsRequest__Output>
      UpdateConversationTagsResponse: MessageTypeDefinition<_exa_language_server_pb_UpdateConversationTagsResponse, _exa_language_server_pb_UpdateConversationTagsResponse__Output>
      UpdateDevExperimentsRequest: MessageTypeDefinition<_exa_language_server_pb_UpdateDevExperimentsRequest, _exa_language_server_pb_UpdateDevExperimentsRequest__Output>
      UpdateDevExperimentsResponse: MessageTypeDefinition<_exa_language_server_pb_UpdateDevExperimentsResponse, _exa_language_server_pb_UpdateDevExperimentsResponse__Output>
      UpdateEnterpriseExperimentsFromUrlRequest: MessageTypeDefinition<_exa_language_server_pb_UpdateEnterpriseExperimentsFromUrlRequest, _exa_language_server_pb_UpdateEnterpriseExperimentsFromUrlRequest__Output>
      UpdateEnterpriseExperimentsFromUrlResponse: MessageTypeDefinition<_exa_language_server_pb_UpdateEnterpriseExperimentsFromUrlResponse, _exa_language_server_pb_UpdateEnterpriseExperimentsFromUrlResponse__Output>
      UpdateMcpServerInConfigFileRequest: MessageTypeDefinition<_exa_language_server_pb_UpdateMcpServerInConfigFileRequest, _exa_language_server_pb_UpdateMcpServerInConfigFileRequest__Output>
      UpdateMcpServerInConfigFileResponse: MessageTypeDefinition<_exa_language_server_pb_UpdateMcpServerInConfigFileResponse, _exa_language_server_pb_UpdateMcpServerInConfigFileResponse__Output>
      UpdatePanelStateWithUserStatusRequest: MessageTypeDefinition<_exa_language_server_pb_UpdatePanelStateWithUserStatusRequest, _exa_language_server_pb_UpdatePanelStateWithUserStatusRequest__Output>
      UpdatePanelStateWithUserStatusResponse: MessageTypeDefinition<_exa_language_server_pb_UpdatePanelStateWithUserStatusResponse, _exa_language_server_pb_UpdatePanelStateWithUserStatusResponse__Output>
      UpdateWorkspaceTrustRequest: MessageTypeDefinition<_exa_language_server_pb_UpdateWorkspaceTrustRequest, _exa_language_server_pb_UpdateWorkspaceTrustRequest__Output>
      UpdateWorkspaceTrustResponse: MessageTypeDefinition<_exa_language_server_pb_UpdateWorkspaceTrustResponse, _exa_language_server_pb_UpdateWorkspaceTrustResponse__Output>
      UploadRecentCommandsRequest: MessageTypeDefinition<_exa_language_server_pb_UploadRecentCommandsRequest, _exa_language_server_pb_UploadRecentCommandsRequest__Output>
      UploadRecentCommandsResponse: MessageTypeDefinition<_exa_language_server_pb_UploadRecentCommandsResponse, _exa_language_server_pb_UploadRecentCommandsResponse__Output>
      UserInputWithMetadata: MessageTypeDefinition<_exa_language_server_pb_UserInputWithMetadata, _exa_language_server_pb_UserInputWithMetadata__Output>
      ValidateWindsurfJSAppProjectNameRequest: MessageTypeDefinition<_exa_language_server_pb_ValidateWindsurfJSAppProjectNameRequest, _exa_language_server_pb_ValidateWindsurfJSAppProjectNameRequest__Output>
      ValidateWindsurfJSAppProjectNameResponse: MessageTypeDefinition<_exa_language_server_pb_ValidateWindsurfJSAppProjectNameResponse, _exa_language_server_pb_ValidateWindsurfJSAppProjectNameResponse__Output>
      ValidationState: MessageTypeDefinition<_exa_language_server_pb_ValidationState, _exa_language_server_pb_ValidationState__Output>
      VibeAndReplaceData: MessageTypeDefinition<_exa_language_server_pb_VibeAndReplaceData, _exa_language_server_pb_VibeAndReplaceData__Output>
      VibeAndReplaceFile: MessageTypeDefinition<_exa_language_server_pb_VibeAndReplaceFile, _exa_language_server_pb_VibeAndReplaceFile__Output>
      WellSupportedLanguagesRequest: MessageTypeDefinition<_exa_language_server_pb_WellSupportedLanguagesRequest, _exa_language_server_pb_WellSupportedLanguagesRequest__Output>
      WellSupportedLanguagesResponse: MessageTypeDefinition<_exa_language_server_pb_WellSupportedLanguagesResponse, _exa_language_server_pb_WellSupportedLanguagesResponse__Output>
      WorkspaceEditState: MessageTypeDefinition<_exa_language_server_pb_WorkspaceEditState, _exa_language_server_pb_WorkspaceEditState__Output>
      WorkspaceInfo: MessageTypeDefinition<_exa_language_server_pb_WorkspaceInfo, _exa_language_server_pb_WorkspaceInfo__Output>
    }
    opensearch_clients_pb: {
      AddGithubUsersRequest: MessageTypeDefinition<_exa_opensearch_clients_pb_AddGithubUsersRequest, _exa_opensearch_clients_pb_AddGithubUsersRequest__Output>
      AddGithubUsersResponse: MessageTypeDefinition<_exa_opensearch_clients_pb_AddGithubUsersResponse, _exa_opensearch_clients_pb_AddGithubUsersResponse__Output>
      AddUsersRequest: MessageTypeDefinition<_exa_opensearch_clients_pb_AddUsersRequest, _exa_opensearch_clients_pb_AddUsersRequest__Output>
      AddUsersResponse: MessageTypeDefinition<_exa_opensearch_clients_pb_AddUsersResponse, _exa_opensearch_clients_pb_AddUsersResponse__Output>
      CancelKnowledgeBaseJobsRequest: MessageTypeDefinition<_exa_opensearch_clients_pb_CancelKnowledgeBaseJobsRequest, _exa_opensearch_clients_pb_CancelKnowledgeBaseJobsRequest__Output>
      CancelKnowledgeBaseJobsResponse: MessageTypeDefinition<_exa_opensearch_clients_pb_CancelKnowledgeBaseJobsResponse, _exa_opensearch_clients_pb_CancelKnowledgeBaseJobsResponse__Output>
      CodeIndexService: SubtypeConstructor<typeof grpc.Client, _exa_opensearch_clients_pb_CodeIndexServiceClient> & { service: _exa_opensearch_clients_pb_CodeIndexServiceDefinition }
      CommonDocument: MessageTypeDefinition<_exa_opensearch_clients_pb_CommonDocument, _exa_opensearch_clients_pb_CommonDocument__Output>
      CommonDocumentWithScore: MessageTypeDefinition<_exa_opensearch_clients_pb_CommonDocumentWithScore, _exa_opensearch_clients_pb_CommonDocumentWithScore__Output>
      ConnectKnowledgeBaseAccountRequest: MessageTypeDefinition<_exa_opensearch_clients_pb_ConnectKnowledgeBaseAccountRequest, _exa_opensearch_clients_pb_ConnectKnowledgeBaseAccountRequest__Output>
      ConnectKnowledgeBaseAccountResponse: MessageTypeDefinition<_exa_opensearch_clients_pb_ConnectKnowledgeBaseAccountResponse, _exa_opensearch_clients_pb_ConnectKnowledgeBaseAccountResponse__Output>
      ConnectorAdditionalParams: MessageTypeDefinition<_exa_opensearch_clients_pb_ConnectorAdditionalParams, _exa_opensearch_clients_pb_ConnectorAdditionalParams__Output>
      ConnectorAdditionalParamsGithub: MessageTypeDefinition<_exa_opensearch_clients_pb_ConnectorAdditionalParamsGithub, _exa_opensearch_clients_pb_ConnectorAdditionalParamsGithub__Output>
      ConnectorAdditionalParamsSlack: MessageTypeDefinition<_exa_opensearch_clients_pb_ConnectorAdditionalParamsSlack, _exa_opensearch_clients_pb_ConnectorAdditionalParamsSlack__Output>
      ConnectorConfig: MessageTypeDefinition<_exa_opensearch_clients_pb_ConnectorConfig, _exa_opensearch_clients_pb_ConnectorConfig__Output>
      ConnectorConfigGithub: MessageTypeDefinition<_exa_opensearch_clients_pb_ConnectorConfigGithub, _exa_opensearch_clients_pb_ConnectorConfigGithub__Output>
      ConnectorConfigGoogleDrive: MessageTypeDefinition<_exa_opensearch_clients_pb_ConnectorConfigGoogleDrive, _exa_opensearch_clients_pb_ConnectorConfigGoogleDrive__Output>
      ConnectorConfigJira: MessageTypeDefinition<_exa_opensearch_clients_pb_ConnectorConfigJira, _exa_opensearch_clients_pb_ConnectorConfigJira__Output>
      ConnectorConfigSlack: MessageTypeDefinition<_exa_opensearch_clients_pb_ConnectorConfigSlack, _exa_opensearch_clients_pb_ConnectorConfigSlack__Output>
      ConnectorInternalConfig: MessageTypeDefinition<_exa_opensearch_clients_pb_ConnectorInternalConfig, _exa_opensearch_clients_pb_ConnectorInternalConfig__Output>
      ConnectorInternalConfigGithub: MessageTypeDefinition<_exa_opensearch_clients_pb_ConnectorInternalConfigGithub, _exa_opensearch_clients_pb_ConnectorInternalConfigGithub__Output>
      ConnectorInternalConfigGoogleDrive: MessageTypeDefinition<_exa_opensearch_clients_pb_ConnectorInternalConfigGoogleDrive, _exa_opensearch_clients_pb_ConnectorInternalConfigGoogleDrive__Output>
      ConnectorInternalConfigJira: MessageTypeDefinition<_exa_opensearch_clients_pb_ConnectorInternalConfigJira, _exa_opensearch_clients_pb_ConnectorInternalConfigJira__Output>
      ConnectorInternalConfigSlack: MessageTypeDefinition<_exa_opensearch_clients_pb_ConnectorInternalConfigSlack, _exa_opensearch_clients_pb_ConnectorInternalConfigSlack__Output>
      ConnectorState: MessageTypeDefinition<_exa_opensearch_clients_pb_ConnectorState, _exa_opensearch_clients_pb_ConnectorState__Output>
      ConnectorType: EnumTypeDefinition
      DeleteKnowledgeBaseConnectionRequest: MessageTypeDefinition<_exa_opensearch_clients_pb_DeleteKnowledgeBaseConnectionRequest, _exa_opensearch_clients_pb_DeleteKnowledgeBaseConnectionRequest__Output>
      DeleteKnowledgeBaseConnectionResponse: MessageTypeDefinition<_exa_opensearch_clients_pb_DeleteKnowledgeBaseConnectionResponse, _exa_opensearch_clients_pb_DeleteKnowledgeBaseConnectionResponse__Output>
      DocumentTypeCount: MessageTypeDefinition<_exa_opensearch_clients_pb_DocumentTypeCount, _exa_opensearch_clients_pb_DocumentTypeCount__Output>
      ForwardResult: MessageTypeDefinition<_exa_opensearch_clients_pb_ForwardResult, _exa_opensearch_clients_pb_ForwardResult__Output>
      ForwardSlackPayloadRequest: MessageTypeDefinition<_exa_opensearch_clients_pb_ForwardSlackPayloadRequest, _exa_opensearch_clients_pb_ForwardSlackPayloadRequest__Output>
      ForwardSlackPayloadResponse: MessageTypeDefinition<_exa_opensearch_clients_pb_ForwardSlackPayloadResponse, _exa_opensearch_clients_pb_ForwardSlackPayloadResponse__Output>
      ForwardStatus: EnumTypeDefinition
      GetConnectorInternalConfigRequest: MessageTypeDefinition<_exa_opensearch_clients_pb_GetConnectorInternalConfigRequest, _exa_opensearch_clients_pb_GetConnectorInternalConfigRequest__Output>
      GetConnectorInternalConfigResponse: MessageTypeDefinition<_exa_opensearch_clients_pb_GetConnectorInternalConfigResponse, _exa_opensearch_clients_pb_GetConnectorInternalConfigResponse__Output>
      GetKnowledgeBaseConnectorStateRequest: MessageTypeDefinition<_exa_opensearch_clients_pb_GetKnowledgeBaseConnectorStateRequest, _exa_opensearch_clients_pb_GetKnowledgeBaseConnectorStateRequest__Output>
      GetKnowledgeBaseConnectorStateResponse: MessageTypeDefinition<_exa_opensearch_clients_pb_GetKnowledgeBaseConnectorStateResponse, _exa_opensearch_clients_pb_GetKnowledgeBaseConnectorStateResponse__Output>
      GetKnowledgeBaseItemsFromScopeItemsRequest: MessageTypeDefinition<_exa_opensearch_clients_pb_GetKnowledgeBaseItemsFromScopeItemsRequest, _exa_opensearch_clients_pb_GetKnowledgeBaseItemsFromScopeItemsRequest__Output>
      GetKnowledgeBaseItemsFromScopeItemsResponse: MessageTypeDefinition<_exa_opensearch_clients_pb_GetKnowledgeBaseItemsFromScopeItemsResponse, _exa_opensearch_clients_pb_GetKnowledgeBaseItemsFromScopeItemsResponse__Output>
      GetKnowledgeBaseJobStatesRequest: MessageTypeDefinition<_exa_opensearch_clients_pb_GetKnowledgeBaseJobStatesRequest, _exa_opensearch_clients_pb_GetKnowledgeBaseJobStatesRequest__Output>
      GetKnowledgeBaseJobStatesResponse: MessageTypeDefinition<_exa_opensearch_clients_pb_GetKnowledgeBaseJobStatesResponse, _exa_opensearch_clients_pb_GetKnowledgeBaseJobStatesResponse__Output>
      GetKnowledgeBaseScopeItemsRequest: MessageTypeDefinition<_exa_opensearch_clients_pb_GetKnowledgeBaseScopeItemsRequest, _exa_opensearch_clients_pb_GetKnowledgeBaseScopeItemsRequest__Output>
      GetKnowledgeBaseScopeItemsResponse: MessageTypeDefinition<_exa_opensearch_clients_pb_GetKnowledgeBaseScopeItemsResponse, _exa_opensearch_clients_pb_GetKnowledgeBaseScopeItemsResponse__Output>
      GetKnowledgeBaseWebhookUrlRequest: MessageTypeDefinition<_exa_opensearch_clients_pb_GetKnowledgeBaseWebhookUrlRequest, _exa_opensearch_clients_pb_GetKnowledgeBaseWebhookUrlRequest__Output>
      GetKnowledgeBaseWebhookUrlResponse: MessageTypeDefinition<_exa_opensearch_clients_pb_GetKnowledgeBaseWebhookUrlResponse, _exa_opensearch_clients_pb_GetKnowledgeBaseWebhookUrlResponse__Output>
      GithubRepoConfig: MessageTypeDefinition<_exa_opensearch_clients_pb_GithubRepoConfig, _exa_opensearch_clients_pb_GithubRepoConfig__Output>
      GithubUser: MessageTypeDefinition<_exa_opensearch_clients_pb_GithubUser, _exa_opensearch_clients_pb_GithubUser__Output>
      GraphSearchRequest: MessageTypeDefinition<_exa_opensearch_clients_pb_GraphSearchRequest, _exa_opensearch_clients_pb_GraphSearchRequest__Output>
      GraphSearchResponse: MessageTypeDefinition<_exa_opensearch_clients_pb_GraphSearchResponse, _exa_opensearch_clients_pb_GraphSearchResponse__Output>
      HybridSearchRequest: MessageTypeDefinition<_exa_opensearch_clients_pb_HybridSearchRequest, _exa_opensearch_clients_pb_HybridSearchRequest__Output>
      HybridSearchResponse: MessageTypeDefinition<_exa_opensearch_clients_pb_HybridSearchResponse, _exa_opensearch_clients_pb_HybridSearchResponse__Output>
      IngestGithubDataRequest: MessageTypeDefinition<_exa_opensearch_clients_pb_IngestGithubDataRequest, _exa_opensearch_clients_pb_IngestGithubDataRequest__Output>
      IngestGithubDataResponse: MessageTypeDefinition<_exa_opensearch_clients_pb_IngestGithubDataResponse, _exa_opensearch_clients_pb_IngestGithubDataResponse__Output>
      IngestGoogleDriveDataRequest: MessageTypeDefinition<_exa_opensearch_clients_pb_IngestGoogleDriveDataRequest, _exa_opensearch_clients_pb_IngestGoogleDriveDataRequest__Output>
      IngestGoogleDriveDataResponse: MessageTypeDefinition<_exa_opensearch_clients_pb_IngestGoogleDriveDataResponse, _exa_opensearch_clients_pb_IngestGoogleDriveDataResponse__Output>
      IngestJiraDataRequest: MessageTypeDefinition<_exa_opensearch_clients_pb_IngestJiraDataRequest, _exa_opensearch_clients_pb_IngestJiraDataRequest__Output>
      IngestJiraDataResponse: MessageTypeDefinition<_exa_opensearch_clients_pb_IngestJiraDataResponse, _exa_opensearch_clients_pb_IngestJiraDataResponse__Output>
      IngestJiraPayloadRequest: MessageTypeDefinition<_exa_opensearch_clients_pb_IngestJiraPayloadRequest, _exa_opensearch_clients_pb_IngestJiraPayloadRequest__Output>
      IngestJiraPayloadResponse: MessageTypeDefinition<_exa_opensearch_clients_pb_IngestJiraPayloadResponse, _exa_opensearch_clients_pb_IngestJiraPayloadResponse__Output>
      IngestSlackDataRequest: MessageTypeDefinition<_exa_opensearch_clients_pb_IngestSlackDataRequest, _exa_opensearch_clients_pb_IngestSlackDataRequest__Output>
      IngestSlackDataResponse: MessageTypeDefinition<_exa_opensearch_clients_pb_IngestSlackDataResponse, _exa_opensearch_clients_pb_IngestSlackDataResponse__Output>
      IngestSlackPayloadRequest: MessageTypeDefinition<_exa_opensearch_clients_pb_IngestSlackPayloadRequest, _exa_opensearch_clients_pb_IngestSlackPayloadRequest__Output>
      IngestSlackPayloadResponse: MessageTypeDefinition<_exa_opensearch_clients_pb_IngestSlackPayloadResponse, _exa_opensearch_clients_pb_IngestSlackPayloadResponse__Output>
      JobState: MessageTypeDefinition<_exa_opensearch_clients_pb_JobState, _exa_opensearch_clients_pb_JobState__Output>
      JobStatus: EnumTypeDefinition
      KnowledgeBaseSearchRequest: MessageTypeDefinition<_exa_opensearch_clients_pb_KnowledgeBaseSearchRequest, _exa_opensearch_clients_pb_KnowledgeBaseSearchRequest__Output>
      KnowledgeBaseSearchResponse: MessageTypeDefinition<_exa_opensearch_clients_pb_KnowledgeBaseSearchResponse, _exa_opensearch_clients_pb_KnowledgeBaseSearchResponse__Output>
      KnowledgeBaseService: SubtypeConstructor<typeof grpc.Client, _exa_opensearch_clients_pb_KnowledgeBaseServiceClient> & { service: _exa_opensearch_clients_pb_KnowledgeBaseServiceDefinition }
      OpenSearchAddRepositoryRequest: MessageTypeDefinition<_exa_opensearch_clients_pb_OpenSearchAddRepositoryRequest, _exa_opensearch_clients_pb_OpenSearchAddRepositoryRequest__Output>
      OpenSearchAddRepositoryResponse: MessageTypeDefinition<_exa_opensearch_clients_pb_OpenSearchAddRepositoryResponse, _exa_opensearch_clients_pb_OpenSearchAddRepositoryResponse__Output>
      OpenSearchGetIndexRequest: MessageTypeDefinition<_exa_opensearch_clients_pb_OpenSearchGetIndexRequest, _exa_opensearch_clients_pb_OpenSearchGetIndexRequest__Output>
      OpenSearchGetIndexResponse: MessageTypeDefinition<_exa_opensearch_clients_pb_OpenSearchGetIndexResponse, _exa_opensearch_clients_pb_OpenSearchGetIndexResponse__Output>
      QuerySearchResponse: MessageTypeDefinition<_exa_opensearch_clients_pb_QuerySearchResponse, _exa_opensearch_clients_pb_QuerySearchResponse__Output>
      SearchMode: EnumTypeDefinition
      SearchResult: MessageTypeDefinition<_exa_opensearch_clients_pb_SearchResult, _exa_opensearch_clients_pb_SearchResult__Output>
      SlackChannelPayload: MessageTypeDefinition<_exa_opensearch_clients_pb_SlackChannelPayload, _exa_opensearch_clients_pb_SlackChannelPayload__Output>
      SlackMessagePayload: MessageTypeDefinition<_exa_opensearch_clients_pb_SlackMessagePayload, _exa_opensearch_clients_pb_SlackMessagePayload__Output>
      SlackPayload: MessageTypeDefinition<_exa_opensearch_clients_pb_SlackPayload, _exa_opensearch_clients_pb_SlackPayload__Output>
      TimeRange: MessageTypeDefinition<_exa_opensearch_clients_pb_TimeRange, _exa_opensearch_clients_pb_TimeRange__Output>
      UpdateConnectorConfigRequest: MessageTypeDefinition<_exa_opensearch_clients_pb_UpdateConnectorConfigRequest, _exa_opensearch_clients_pb_UpdateConnectorConfigRequest__Output>
      UpdateConnectorConfigResponse: MessageTypeDefinition<_exa_opensearch_clients_pb_UpdateConnectorConfigResponse, _exa_opensearch_clients_pb_UpdateConnectorConfigResponse__Output>
      UserInfo: MessageTypeDefinition<_exa_opensearch_clients_pb_UserInfo, _exa_opensearch_clients_pb_UserInfo__Output>
    }
    reactive_component_pb: {
      FieldDiff: MessageTypeDefinition<_exa_reactive_component_pb_FieldDiff, _exa_reactive_component_pb_FieldDiff__Output>
      MapDiff: MessageTypeDefinition<_exa_reactive_component_pb_MapDiff, _exa_reactive_component_pb_MapDiff__Output>
      MapKeyDiff: MessageTypeDefinition<_exa_reactive_component_pb_MapKeyDiff, _exa_reactive_component_pb_MapKeyDiff__Output>
      MessageDiff: MessageTypeDefinition<_exa_reactive_component_pb_MessageDiff, _exa_reactive_component_pb_MessageDiff__Output>
      RepeatedDiff: MessageTypeDefinition<_exa_reactive_component_pb_RepeatedDiff, _exa_reactive_component_pb_RepeatedDiff__Output>
      SingularValue: MessageTypeDefinition<_exa_reactive_component_pb_SingularValue, _exa_reactive_component_pb_SingularValue__Output>
      StreamReactiveUpdatesRequest: MessageTypeDefinition<_exa_reactive_component_pb_StreamReactiveUpdatesRequest, _exa_reactive_component_pb_StreamReactiveUpdatesRequest__Output>
      StreamReactiveUpdatesResponse: MessageTypeDefinition<_exa_reactive_component_pb_StreamReactiveUpdatesResponse, _exa_reactive_component_pb_StreamReactiveUpdatesResponse__Output>
      TestDiffProto: MessageTypeDefinition<_exa_reactive_component_pb_TestDiffProto, _exa_reactive_component_pb_TestDiffProto__Output>
      TestEnum: EnumTypeDefinition
      TestProto: MessageTypeDefinition<_exa_reactive_component_pb_TestProto, _exa_reactive_component_pb_TestProto__Output>
    }
  }
  google: {
    protobuf: {
      DescriptorProto: MessageTypeDefinition<_google_protobuf_DescriptorProto, _google_protobuf_DescriptorProto__Output>
      Duration: MessageTypeDefinition<_google_protobuf_Duration, _google_protobuf_Duration__Output>
      Edition: EnumTypeDefinition
      Empty: MessageTypeDefinition<_google_protobuf_Empty, _google_protobuf_Empty__Output>
      EnumDescriptorProto: MessageTypeDefinition<_google_protobuf_EnumDescriptorProto, _google_protobuf_EnumDescriptorProto__Output>
      EnumOptions: MessageTypeDefinition<_google_protobuf_EnumOptions, _google_protobuf_EnumOptions__Output>
      EnumValueDescriptorProto: MessageTypeDefinition<_google_protobuf_EnumValueDescriptorProto, _google_protobuf_EnumValueDescriptorProto__Output>
      EnumValueOptions: MessageTypeDefinition<_google_protobuf_EnumValueOptions, _google_protobuf_EnumValueOptions__Output>
      ExtensionRangeOptions: MessageTypeDefinition<_google_protobuf_ExtensionRangeOptions, _google_protobuf_ExtensionRangeOptions__Output>
      FeatureSet: MessageTypeDefinition<_google_protobuf_FeatureSet, _google_protobuf_FeatureSet__Output>
      FeatureSetDefaults: MessageTypeDefinition<_google_protobuf_FeatureSetDefaults, _google_protobuf_FeatureSetDefaults__Output>
      FieldDescriptorProto: MessageTypeDefinition<_google_protobuf_FieldDescriptorProto, _google_protobuf_FieldDescriptorProto__Output>
      FieldOptions: MessageTypeDefinition<_google_protobuf_FieldOptions, _google_protobuf_FieldOptions__Output>
      FileDescriptorProto: MessageTypeDefinition<_google_protobuf_FileDescriptorProto, _google_protobuf_FileDescriptorProto__Output>
      FileDescriptorSet: MessageTypeDefinition<_google_protobuf_FileDescriptorSet, _google_protobuf_FileDescriptorSet__Output>
      FileOptions: MessageTypeDefinition<_google_protobuf_FileOptions, _google_protobuf_FileOptions__Output>
      GeneratedCodeInfo: MessageTypeDefinition<_google_protobuf_GeneratedCodeInfo, _google_protobuf_GeneratedCodeInfo__Output>
      MessageOptions: MessageTypeDefinition<_google_protobuf_MessageOptions, _google_protobuf_MessageOptions__Output>
      MethodDescriptorProto: MessageTypeDefinition<_google_protobuf_MethodDescriptorProto, _google_protobuf_MethodDescriptorProto__Output>
      MethodOptions: MessageTypeDefinition<_google_protobuf_MethodOptions, _google_protobuf_MethodOptions__Output>
      OneofDescriptorProto: MessageTypeDefinition<_google_protobuf_OneofDescriptorProto, _google_protobuf_OneofDescriptorProto__Output>
      OneofOptions: MessageTypeDefinition<_google_protobuf_OneofOptions, _google_protobuf_OneofOptions__Output>
      ServiceDescriptorProto: MessageTypeDefinition<_google_protobuf_ServiceDescriptorProto, _google_protobuf_ServiceDescriptorProto__Output>
      ServiceOptions: MessageTypeDefinition<_google_protobuf_ServiceOptions, _google_protobuf_ServiceOptions__Output>
      SourceCodeInfo: MessageTypeDefinition<_google_protobuf_SourceCodeInfo, _google_protobuf_SourceCodeInfo__Output>
      SymbolVisibility: EnumTypeDefinition
      Timestamp: MessageTypeDefinition<_google_protobuf_Timestamp, _google_protobuf_Timestamp__Output>
      UninterpretedOption: MessageTypeDefinition<_google_protobuf_UninterpretedOption, _google_protobuf_UninterpretedOption__Output>
    }
  }
}
