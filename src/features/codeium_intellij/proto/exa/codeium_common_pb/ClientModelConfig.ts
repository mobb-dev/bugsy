// Original file: exa/codeium_common_pb/codeium_common.proto

import type { ModelOrAlias as _exa_codeium_common_pb_ModelOrAlias, ModelOrAlias__Output as _exa_codeium_common_pb_ModelOrAlias__Output } from '../../exa/codeium_common_pb/ModelOrAlias';
import type { ModelProvider as _exa_codeium_common_pb_ModelProvider, ModelProvider__Output as _exa_codeium_common_pb_ModelProvider__Output } from '../../exa/codeium_common_pb/ModelProvider';
import type { TeamsTier as _exa_codeium_common_pb_TeamsTier, TeamsTier__Output as _exa_codeium_common_pb_TeamsTier__Output } from '../../exa/codeium_common_pb/TeamsTier';
import type { ModelPricingType as _exa_codeium_common_pb_ModelPricingType, ModelPricingType__Output as _exa_codeium_common_pb_ModelPricingType__Output } from '../../exa/codeium_common_pb/ModelPricingType';
import type { APIProvider as _exa_codeium_common_pb_APIProvider, APIProvider__Output as _exa_codeium_common_pb_APIProvider__Output } from '../../exa/codeium_common_pb/APIProvider';
import type { PromoStatus as _exa_codeium_common_pb_PromoStatus, PromoStatus__Output as _exa_codeium_common_pb_PromoStatus__Output } from '../../exa/codeium_common_pb/PromoStatus';
import type { FastStatus as _exa_codeium_common_pb_FastStatus, FastStatus__Output as _exa_codeium_common_pb_FastStatus__Output } from '../../exa/codeium_common_pb/FastStatus';
import type { ModelInfo as _exa_codeium_common_pb_ModelInfo, ModelInfo__Output as _exa_codeium_common_pb_ModelInfo__Output } from '../../exa/codeium_common_pb/ModelInfo';
import type { ModelCostTier as _exa_codeium_common_pb_ModelCostTier, ModelCostTier__Output as _exa_codeium_common_pb_ModelCostTier__Output } from '../../exa/codeium_common_pb/ModelCostTier';
import type { ArenaTier as _exa_codeium_common_pb_ArenaTier, ArenaTier__Output as _exa_codeium_common_pb_ArenaTier__Output } from '../../exa/codeium_common_pb/ArenaTier';

export interface ClientModelConfig {
  'label'?: (string);
  'modelOrAlias'?: (_exa_codeium_common_pb_ModelOrAlias | null);
  'creditMultiplier'?: (number | string);
  'disabled'?: (boolean);
  'supportsImages'?: (boolean);
  'supportsLegacy'?: (boolean);
  'isPremium'?: (boolean);
  'betaWarningMessage'?: (string);
  'isBeta'?: (boolean);
  'provider'?: (_exa_codeium_common_pb_ModelProvider);
  'isRecommended'?: (boolean);
  'allowedTiers'?: (_exa_codeium_common_pb_TeamsTier)[];
  'pricingType'?: (_exa_codeium_common_pb_ModelPricingType);
  'apiProvider'?: (_exa_codeium_common_pb_APIProvider);
  'isNew'?: (boolean);
  'partialRollout'?: (boolean);
  'rolloutFraction'?: (number | string);
  'maxTokens'?: (number);
  'promoStatus'?: (_exa_codeium_common_pb_PromoStatus | null);
  'isCapacityLimited'?: (boolean);
  'fastStatus'?: (_exa_codeium_common_pb_FastStatus | null);
  'modelUid'?: (string);
  'modelInfo'?: (_exa_codeium_common_pb_ModelInfo | null);
  'modelCostTier'?: (_exa_codeium_common_pb_ModelCostTier);
  'arenaTier'?: (_exa_codeium_common_pb_ArenaTier);
}

export interface ClientModelConfig__Output {
  'label': (string);
  'modelOrAlias': (_exa_codeium_common_pb_ModelOrAlias__Output | null);
  'creditMultiplier': (number);
  'disabled': (boolean);
  'supportsImages': (boolean);
  'supportsLegacy': (boolean);
  'isPremium': (boolean);
  'betaWarningMessage': (string);
  'isBeta': (boolean);
  'provider': (_exa_codeium_common_pb_ModelProvider__Output);
  'isRecommended': (boolean);
  'allowedTiers': (_exa_codeium_common_pb_TeamsTier__Output)[];
  'pricingType': (_exa_codeium_common_pb_ModelPricingType__Output);
  'apiProvider': (_exa_codeium_common_pb_APIProvider__Output);
  'isNew': (boolean);
  'partialRollout': (boolean);
  'rolloutFraction': (number);
  'maxTokens': (number);
  'promoStatus': (_exa_codeium_common_pb_PromoStatus__Output | null);
  'isCapacityLimited': (boolean);
  'fastStatus': (_exa_codeium_common_pb_FastStatus__Output | null);
  'modelUid': (string);
  'modelInfo': (_exa_codeium_common_pb_ModelInfo__Output | null);
  'modelCostTier': (_exa_codeium_common_pb_ModelCostTier__Output);
  'arenaTier': (_exa_codeium_common_pb_ArenaTier__Output);
}
