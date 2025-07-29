import type { ValueSet, Parameters } from './index';

export type OperationResultMap = {
  'ValueSet/$expand': ValueSet;
  'ValueSet/$validate-code': Parameters;
  'CodeSystem/$lookup': Parameters;
};

export type OperationName = keyof OperationResultMap;