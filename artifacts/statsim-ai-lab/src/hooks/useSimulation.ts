import { useState, useMemo, useCallback } from 'react';
import { generateData, calculateMetrics } from '../lib/dataGenerators';
import { codeSnippets } from '../lib/codeSnippets';

export type ModelType = 'logistic' | 'linear' | 'normal' | 'hypothesis';

export function useSimulation() {
  const [selectedModel, setSelectedModel] = useState<ModelType>('logistic');
  const [params, setParams] = useState({
    n: 200,
    noise: 1,
    slope: -0.25,
    intercept: 0,
    threshold: 0.5,
    mean: 0,
    std: 1,
    alpha: 0.05,
    meanDiff: 1,
    testType: 'Z',
    _seed: 0
  });
  
  const simData = useMemo(() => generateData(selectedModel, params), [selectedModel, params]);
  const metrics = useMemo(() => calculateMetrics(selectedModel, simData), [selectedModel, simData]);
  
  const getCode = useCallback((lang: 'python' | 'r' | 'sql' | 'javascript') => {
    return (codeSnippets as any)[selectedModel]?.[lang] || '';
  }, [selectedModel]);

  const randomizeData = useCallback(() => {
    setParams(p => ({ ...p, _seed: Math.random() }));
  }, []);

  const resetParams = useCallback(() => {
    setParams({
      n: 200, noise: 1, slope: -0.25, intercept: 0, threshold: 0.5,
      mean: 0, std: 1, alpha: 0.05, meanDiff: 1, testType: 'Z', _seed: 0
    });
  }, []);

  return { 
    selectedModel, setSelectedModel, 
    params, setParams, 
    simData, metrics, 
    getCode, randomizeData, resetParams
  };
}