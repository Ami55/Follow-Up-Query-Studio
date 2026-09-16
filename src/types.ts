export type ConversationStage = 
  | 'clarification' 
  | 'constraints' 
  | 'comparison' 
  | 'validation' 
  | 'action';

export type ContentFormat = 
  | 'prose' 
  | 'table' 
  | 'bullet_specs' 
  | 'quote_proof' 
  | 'step_by_step';

export interface FollowUpQueryNode {
  id: string;
  stage: ConversationStage;
  query: string;
  intent: string;
  subQueries: string[]; // Query Fan-Out background triggers
  recommendedFormat: ContentFormat;
  contentTip: string;
  citationLikelihood: 'High' | 'Medium' | 'Critical';
  difficulty: 'Low' | 'Medium' | 'High';
}

export interface FanOutAnalysisResult {
  seedQuery: string;
  brandName?: string;
  marketContext: string;
  totalFollowUps: number;
  stages: {
    clarification: FollowUpQueryNode[];
    constraints: FollowUpQueryNode[];
    comparison: FollowUpQueryNode[];
    validation: FollowUpQueryNode[];
    action: FollowUpQueryNode[];
  };
  keyEntities: string[];
  aiOverviewTriggerScore: number; // 0-100%
  executiveSummary: string;
}

export interface ScorecardMetric {
  name: string;
  score: number; // 0-100
  status: 'excellent' | 'good' | 'needs_work' | 'critical';
  critique: string;
  recommendation: string;
}

export interface AuditResult {
  overallScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  summary: string;
  metrics: {
    fanOutCoverage: ScorecardMetric;
    extractiveQuotability: ScorecardMetric;
    formatDiversity: ScorecardMetric;
    objectionHandling: ScorecardMetric;
    nextActionClarity: ScorecardMetric;
  };
  identifiedGaps: string[];
  recommendedSnippets: {
    type: 'Direct Answer Block' | 'Comparison Table' | 'Constraint Checklist' | 'FAQ Schema';
    title: string;
    markdownContent: string;
    rationale: string;
  }[];
}

export interface SimulationTurn {
  id: string;
  role: 'user' | 'assistant';
  query: string;
  content?: string;
  fanOutSearchesTriggered?: string[];
  citedSources?: { title: string; domain: string; excerpt: string }[];
  suggestedNextQueries?: string[];
  timestamp: string;
}
