// Original file: exa/codeium_common_pb/codeium_common.proto

import type { TransactionStatus as _exa_codeium_common_pb_TransactionStatus, TransactionStatus__Output as _exa_codeium_common_pb_TransactionStatus__Output } from '../../exa/codeium_common_pb/TransactionStatus';

export interface TopUpStatus {
  'topUpTransactionStatus'?: (_exa_codeium_common_pb_TransactionStatus);
  'topUpEnabled'?: (boolean);
  'monthlyTopUpAmount'?: (number);
  'topUpSpent'?: (number);
  'topUpIncrement'?: (number);
  'topUpCriteriaMet'?: (boolean);
}

export interface TopUpStatus__Output {
  'topUpTransactionStatus': (_exa_codeium_common_pb_TransactionStatus__Output);
  'topUpEnabled': (boolean);
  'monthlyTopUpAmount': (number);
  'topUpSpent': (number);
  'topUpIncrement': (number);
  'topUpCriteriaMet': (boolean);
}
