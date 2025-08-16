import React from 'react';
import { Trans } from '@lingui/macro';
import { AlertTriangle, CheckCircle, XCircle, ArrowRight } from 'react-feather';
import './ZapErrorRecovery.scss';

export enum ZapStep {
  APPROVE_COLLATERAL = 'APPROVE_COLLATERAL',
  SPLIT_POSITION = 'SPLIT_POSITION',
  APPROVE_TOKENS = 'APPROVE_TOKENS',
  ADD_LIQUIDITY = 'ADD_LIQUIDITY',
  APPROVE_NFTS = 'APPROVE_NFTS',
  STAKE_NFTS = 'STAKE_NFTS'
}

export interface ZapProgress {
  currentStep: ZapStep;
  completedSteps: ZapStep[];
  failedStep?: ZapStep;
  errorMessage?: string;
  splitAmount?: string;
  outcomeTokensReceived?: boolean;
  nftIds?: string[];
  poolsWithLiquidity?: string[];
}

interface ZapErrorRecoveryProps {
  progress: ZapProgress;
  onRetry: (fromStep: ZapStep) => void;
  onManualComplete: () => void;
  onDismiss: () => void;
}

const STEP_DESCRIPTIONS: Record<ZapStep, { title: string; description: string }> = {
  [ZapStep.APPROVE_COLLATERAL]: {
    title: 'Approve Collateral',
    description: 'Allow the router to use your collateral tokens'
  },
  [ZapStep.SPLIT_POSITION]: {
    title: 'Split Position',
    description: 'Convert collateral into outcome tokens'
  },
  [ZapStep.APPROVE_TOKENS]: {
    title: 'Approve Tokens',
    description: 'Allow the position manager to use your tokens'
  },
  [ZapStep.ADD_LIQUIDITY]: {
    title: 'Add Liquidity',
    description: 'Create liquidity positions for each outcome'
  },
  [ZapStep.APPROVE_NFTS]: {
    title: 'Approve NFTs',
    description: 'Allow the farming center to stake your positions'
  },
  [ZapStep.STAKE_NFTS]: {
    title: 'Stake Positions',
    description: 'Stake your liquidity positions in farms'
  }
};

export const ZapErrorRecovery: React.FC<ZapErrorRecoveryProps> = ({
  progress,
  onRetry,
  onManualComplete,
  onDismiss
}) => {
  const getStepStatus = (step: ZapStep) => {
    if (progress.completedSteps.includes(step)) {
      return 'completed';
    }
    if (progress.failedStep === step) {
      return 'failed';
    }
    if (progress.currentStep === step) {
      return 'current';
    }
    return 'pending';
  };

  const allSteps = Object.values(ZapStep);

  return (
    <div className="zap-error-recovery">
      <div className="zap-error-recovery__header">
        <AlertTriangle size={24} />
        <h3><Trans>Zap Process Interrupted</Trans></h3>
      </div>

      <div className="zap-error-recovery__content">
        <p className="zap-error-recovery__message">
          {progress.errorMessage || <Trans>The zap process was interrupted. You can retry from where it stopped or complete manually.</Trans>}
        </p>

        <div className="zap-error-recovery__steps">
          {allSteps.map((step, index) => {
            const status = getStepStatus(step);
            const stepInfo = STEP_DESCRIPTIONS[step];
            
            return (
              <div key={step} className={`zap-step zap-step--${status}`}>
                <div className="zap-step__indicator">
                  {status === 'completed' && <CheckCircle size={20} />}
                  {status === 'failed' && <XCircle size={20} />}
                  {status === 'current' && <div className="spinner" />}
                  {status === 'pending' && <div className="pending-circle">{index + 1}</div>}
                </div>
                
                <div className="zap-step__content">
                  <div className="zap-step__title">{stepInfo.title}</div>
                  <div className="zap-step__description">{stepInfo.description}</div>
                  
                  {status === 'failed' && (
                    <button 
                      className="zap-step__retry"
                      onClick={() => onRetry(step)}
                    >
                      <Trans>Retry from here</Trans>
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional context information */}
        {progress.outcomeTokensReceived && (
          <div className="zap-error-recovery__info">
            <CheckCircle size={16} />
            <span><Trans>Outcome tokens received successfully</Trans></span>
          </div>
        )}
        
        {progress.nftIds && progress.nftIds.length > 0 && (
          <div className="zap-error-recovery__info">
            <CheckCircle size={16} />
            <span>
              <Trans>NFT positions created:</Trans> {progress.nftIds.join(', ')}
            </span>
          </div>
        )}

        {progress.poolsWithLiquidity && progress.poolsWithLiquidity.length > 0 && (
          <div className="zap-error-recovery__info">
            <CheckCircle size={16} />
            <span>
              <Trans>Liquidity added to {progress.poolsWithLiquidity.length} pools</Trans>
            </span>
          </div>
        )}
      </div>

      <div className="zap-error-recovery__actions">
        <button 
          className="zap-error-recovery__action zap-error-recovery__action--secondary"
          onClick={onDismiss}
        >
          <Trans>Cancel</Trans>
        </button>
        
        <button 
          className="zap-error-recovery__action zap-error-recovery__action--secondary"
          onClick={onManualComplete}
        >
          <Trans>Complete Manually</Trans>
        </button>
        
        {progress.failedStep && (
          <button 
            className="zap-error-recovery__action zap-error-recovery__action--primary"
            onClick={() => onRetry(progress.failedStep!)}
          >
            <Trans>Retry Failed Step</Trans>
          </button>
        )}
      </div>
    </div>
  );
};