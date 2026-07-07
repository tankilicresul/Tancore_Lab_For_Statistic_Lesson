export function generateData(modelType: string, params: any) {
  const { n, noise, slope, intercept, threshold, mean, std, alpha, meanDiff, testType } = params;
  const data = [];
  
  if (modelType === 'logistic') {
    for (let i = 0; i < n; i++) {
      const x = (Math.random() - 0.5) * 40; // -20 to 20
      const logit = slope * x + intercept;
      const p = 1 / (1 + Math.exp(-logit));
      const y = Math.random() < p ? 1 : 0;
      const prediction = p >= threshold ? 1 : 0;
      data.push({
        id: i, x: Number(x.toFixed(2)), y, p: Number(p.toFixed(4)), prediction,
        error: Math.abs(y - prediction),
        classLabel: y === 1 ? '1\'s' : '0\'s'
      });
    }
    // sorting for curve
    data.sort((a, b) => a.x - b.x);
  } else if (modelType === 'linear') {
    for (let i = 0; i < n; i++) {
      const x = (Math.random() - 0.5) * 20; // -10 to 10
      const cleanY = slope * x + intercept;
      const noisyY = cleanY + (Math.random() - 0.5) * 10 * noise;
      data.push({
        id: i, x: Number(x.toFixed(2)), y: Number(noisyY.toFixed(2)), 
        cleanY: Number(cleanY.toFixed(2)), prediction: Number(cleanY.toFixed(2)),
        error: Number(Math.abs(noisyY - cleanY).toFixed(2))
      });
    }
    data.sort((a, b) => a.x - b.x);
  } else if (modelType === 'normal') {
    for (let i = 0; i < n; i++) {
      let u = 0, v = 0;
      while(u === 0) u = Math.random();
      while(v === 0) v = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      const val = z * std + mean;
      data.push({ id: i, value: Number(val.toFixed(2)) });
    }
  } else if (modelType === 'hypothesis') {
    for (let i = 0; i < n; i++) {
      let u1 = Math.random(), v1 = Math.random();
      const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * v1);
      const val1 = z1 * 1 + 0;
      
      let u2 = Math.random(), v2 = Math.random();
      const z2 = Math.sqrt(-2.0 * Math.log(u2)) * Math.cos(2.0 * Math.PI * v2);
      const val2 = z2 * 1 + meanDiff;
      
      data.push({ id: i, groupA: Number(val1.toFixed(2)), groupB: Number(val2.toFixed(2)) });
    }
  }
  
  return data;
}

// Approximate standard normal CDF using a rational approximation (Abramowitz & Stegun)
function normalCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const poly = t * (0.3193815 + t * (-0.3565638 + t * (1.7814779 + t * (-1.8212560 + t * 1.3302744))));
  const p = 1 - d * poly;
  return z >= 0 ? p : 1 - p;
}

// Trapezoid-rule AUC from sorted (prob, label) pairs
function computeROCAUC(data: { p: number; y: number }[]): number {
  const sorted = [...data].sort((a, b) => b.p - a.p);
  const pos = sorted.filter(d => d.y === 1).length;
  const neg = sorted.filter(d => d.y === 0).length;
  if (pos === 0 || neg === 0) return 0.5;
  let tpAcc = 0, fpAcc = 0, auc = 0;
  for (const d of sorted) {
    if (d.y === 1) tpAcc++;
    else { fpAcc++; auc += tpAcc; }
  }
  return auc / (pos * neg);
}

export function calculateMetrics(modelType: string, data: any[]) {
  if (modelType === 'logistic') {
    const tp = data.filter(d => d.y === 1 && d.prediction === 1).length;
    const tn = data.filter(d => d.y === 0 && d.prediction === 0).length;
    const fp = data.filter(d => d.y === 0 && d.prediction === 1).length;
    const fn = data.filter(d => d.y === 1 && d.prediction === 0).length;
    const accuracy = (tp + tn) / data.length;
    const precision = tp / (tp + fp) || 0;
    const recall = tp / (tp + fn) || 0;
    const auc = computeROCAUC(data);
    return {
      Accuracy: (accuracy * 100).toFixed(1) + '%',
      Precision: precision.toFixed(2),
      Recall: recall.toFixed(2),
      'ROC AUC': auc.toFixed(3)
    };
  } else if (modelType === 'linear') {
    const meanY = data.reduce((sum, d) => sum + d.y, 0) / data.length;
    const ssTot = data.reduce((sum, d) => sum + Math.pow(d.y - meanY, 2), 0);
    const ssRes = data.reduce((sum, d) => sum + Math.pow(d.y - d.prediction, 2), 0);
    const r2 = 1 - (ssRes / (ssTot || 1));
    const mse = data.reduce((sum, d) => sum + Math.pow(d.error, 2), 0) / data.length;
    const mae = data.reduce((sum, d) => sum + d.error, 0) / data.length;
    return {
      'R²': r2.toFixed(3),
      MSE: mse.toFixed(2),
      MAE: mae.toFixed(2)
    };
  } else if (modelType === 'normal') {
    if (data.length === 0) return {};
    const mean = data.reduce((sum, d) => sum + d.value, 0) / data.length;
    const sorted = [...data].sort((a,b) => a.value - b.value);
    const median = sorted[Math.floor(sorted.length/2)].value;
    const variance = data.reduce((sum, d) => sum + Math.pow(d.value - mean, 2), 0) / data.length;
    return {
      Ortalama: mean.toFixed(2),
      Medyan: median.toFixed(2),
      Varyans: variance.toFixed(2),
      'Std. Sapma': Math.sqrt(variance).toFixed(2)
    };
  } else if (modelType === 'hypothesis') {
    if (data.length === 0) return {};
    const groupA = data.map(d => d.groupA);
    const groupB = data.map(d => d.groupB);
    const n = groupA.length;
    const meanA = groupA.reduce((s, v) => s + v, 0) / n;
    const meanB = groupB.reduce((s, v) => s + v, 0) / n;
    const varA = groupA.reduce((s, v) => s + Math.pow(v - meanA, 2), 0) / n;
    const varB = groupB.reduce((s, v) => s + Math.pow(v - meanB, 2), 0) / n;
    const se = Math.sqrt(varA / n + varB / n);
    const zStat = se > 0 ? (meanA - meanB) / se : 0;
    // two-tailed p-value
    const pValue = 2 * (1 - normalCDF(Math.abs(zStat)));
    const alpha = 0.05;
    return {
      'p-değer': Math.max(0, pValue).toFixed(4),
      'Test İstatistiği': zStat.toFixed(3),
      'Karar': pValue < alpha ? 'H₀ Reddet' : 'H₀ Koru',
      'Alfa': alpha.toFixed(2)
    };
  }
  return {};
}