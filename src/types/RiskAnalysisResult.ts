/**
 * Risk level enumeration
 */
export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

/**
 * Detailed risk analysis findings
 */
export interface RiskFindings {
  description: string;
  severity: RiskLevel;
  recommendations?: string[];
}

/**
 * Complete risk analysis result
 */
export interface RiskAnalysisResult {
  overallRisk: RiskLevel;
  findings: RiskFindings[];
  timestamp: Date;
  modelId: string;
  analysisId: string;
} 