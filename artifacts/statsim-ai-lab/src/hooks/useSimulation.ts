import { useState, useMemo, useCallback, useEffect } from 'react';
import { generateData, calculateMetrics } from '../lib/dataGenerators';
import { codeSnippets } from '../lib/codeSnippets';

export type ModelType = 'logistic' | 'linear' | 'normal' | 'hypothesis' | 'error_propagation' | 'clt' | 'qq_plot';

export function useSimulation() {
  const [selectedModel, setSelectedModel] = useState<ModelType>('normal');
  const [params, setParams] = useState({
    n: 100,
    noise: 1,
    slope: -0.25,
    intercept: 0,
    threshold: 0.5,
    mean: 0,
    std: 1.5,
    alpha: 0.05,
    meanDiff: 1,
    testType: 'Z',
    
    // New parameters
    confidence: 0.95,
    ciWidth: 0.8,
    cltSource: 'uniform',
    cltSampleSize: 30,
    cltSamplesCount: 200,
    qqDistribution: 'normal',
    
    _seed: 0
  });

  // Maintain editable simulation data state
  const [customData, setCustomData] = useState<{ model: ModelType; data: any } | null>(null);

  // Initialize/regenerate data whenever selected model or parameters change
  useEffect(() => {
    setCustomData({ model: selectedModel, data: generateData(selectedModel, params) });
  }, [selectedModel, params]);
  
  const simData = useMemo(() => {
    if (customData && customData.model === selectedModel) {
      return customData.data;
    }
    return generateData(selectedModel, params);
  }, [customData, selectedModel, params]);

  const metrics = useMemo(() => {
    return calculateMetrics(selectedModel, simData);
  }, [selectedModel, simData]);
  
  const getCode = useCallback((lang: 'python' | 'r' | 'sql' | 'javascript') => {
    return (codeSnippets as any)[selectedModel]?.[lang] || '';
  }, [selectedModel]);

  const randomizeData = useCallback(() => {
    setParams(p => ({ ...p, _seed: Math.random() }));
  }, []);

  const resetParams = useCallback(() => {
    setParams({
      n: 100, noise: 1, slope: -0.25, intercept: 0, threshold: 0.5,
      mean: 0, std: 1.5, alpha: 0.05, meanDiff: 1, testType: 'Z',
      confidence: 0.95, ciWidth: 0.8, cltSource: 'uniform', cltSampleSize: 30,
      cltSamplesCount: 200, qqDistribution: 'normal', _seed: 0
    });
  }, []);

  // Update a single cell inside the simulated data
  const updateDataCell = useCallback((id: number, key: string, val: number) => {
    setCustomData((prev: any) => {
      if (!prev || prev.model !== selectedModel) return prev;
      const innerData = prev.data;
      let newInnerData;
      if (Array.isArray(innerData)) {
        newInnerData = innerData.map(row => row.id === id ? { ...row, [key]: val } : row);
      } else {
        if (innerData.intervals) {
          const updatedIntervals = innerData.intervals.map((row: any) =>
            row.id === id ? { ...row, [key]: val, covers: (key === 'lower' ? val : row.lower) <= params.mean && params.mean <= (key === 'upper' ? val : row.upper) } : row
          );
          newInnerData = { ...innerData, intervals: updatedIntervals };
        } else if (innerData.qqData) {
          newInnerData = { ...innerData, qqData: innerData.qqData.map((row: any) => row.id === id ? { ...row, [key]: val } : row) };
        } else if (innerData.sampleMeans) {
          newInnerData = { ...innerData, sampleMeans: innerData.sampleMeans.map((v: any, idx: number) => idx === id ? val : v) };
        } else {
          newInnerData = innerData;
        }
      }
      return { model: selectedModel, data: newInnerData };
    });
  }, [selectedModel, params.mean]);

  const loadCustomData = useCallback((newData: any[]) => {
    if (selectedModel === 'normal') {
      const values = newData.map(d => ({ value: d.value ?? d.x }));
      const intervals = newData.filter(d => typeof d.lower !== 'undefined').map((d, i) => ({
        id: d.id || i + 1,
        mean: d.mean || d.value || d.x,
        lower: d.lower,
        upper: d.upper,
        range: [d.lower, d.upper],
        covers: d.covers ?? true
      }));
      const coveredCount = intervals.filter(d => d.covers).length;
      
      setCustomData({
        model: selectedModel,
        data: {
          histogramData: values,
          intervals: intervals.length > 0 ? intervals : Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            mean: params.mean,
            lower: params.mean - 0.4,
            upper: params.mean + 0.4,
            range: [params.mean - 0.4, params.mean + 0.4],
            covers: true
          })),
          coveredCount: intervals.length > 0 ? coveredCount : 25,
          M: intervals.length > 0 ? intervals.length : 25,
          zAlpha: 1.960
        }
      });
    } else if (selectedModel === 'clt') {
      const means = newData.map(d => d.value ?? d.x);
      setCustomData({
        model: selectedModel,
        data: {
          sampleMeans: means,
          bins: [],
          expectedMean: params.mean || 40,
          expectedSE: 1.5
        }
      });
    } else if (selectedModel === 'qq_plot') {
      setCustomData({
        model: selectedModel,
        data: {
          qqData: newData.map((d, idx) => ({ id: idx + 1, z: d.x, value: d.value ?? d.y, 'Teorik Çizgi': d.x * 1.5 + params.mean })),
          distType: 'YÜKLENEN VERİ',
          regSlope: 1.0,
          regIntercept: 0.0
        }
      });
    } else {
      setCustomData({ model: selectedModel, data: newData });
    }
  }, [selectedModel, params.mean]);

  return { 
    selectedModel, setSelectedModel, 
    params, setParams, 
    simData, metrics, 
    getCode, randomizeData, resetParams,
    updateDataCell,
    loadCustomData
  };
}