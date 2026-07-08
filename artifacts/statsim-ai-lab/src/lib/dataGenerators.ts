export function generateData(modelType: string, params: any) {
  const { n, noise, slope, intercept, threshold, mean, std, alpha, meanDiff, testType, confidence, cltSource, cltSampleSize, cltSamplesCount, qqDistribution } = params;
  const data: any[] = [];
  
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
    data.sort((a, b) => a.x - b.x);
    return data;
  } 
  
  if (modelType === 'linear') {
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
    return data;
  } 
  
  if (modelType === 'normal') {
    // 1. Histogram data for normal distribution
    const histogramData = [];
    for (let i = 0; i < n; i++) {
      let u = 0, v = 0;
      while(u === 0) u = Math.random();
      while(v === 0) v = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
      const val = z * std + mean;
      histogramData.push({ id: i, value: Number(val.toFixed(2)) });
    }

    // 2. Simulated confidence intervals (CI) M samples
    const M = 25; // 25 horizontal intervals to plot
    const zAlpha = getZValue(confidence);
    const intervals = [];
    let coveredCount = 0;
    
    for (let j = 0; j < M; j++) {
      let sampleSum = 0;
      for (let i = 0; i < n; i++) {
        let u = 0, v = 0;
        while(u === 0) u = Math.random();
        while(v === 0) v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        sampleSum += z * std + mean;
      }
      const sampleMean = sampleSum / n;
      const marginOfError = zAlpha * (std / Math.sqrt(n));
      const lower = sampleMean - marginOfError;
      const upper = sampleMean + marginOfError;
      const covers = lower <= mean && mean <= upper;
      if (covers) coveredCount++;
      intervals.push({
        id: j + 1,
        mean: Number(sampleMean.toFixed(3)),
        lower: Number(lower.toFixed(3)),
        upper: Number(upper.toFixed(3)),
        range: [Number(lower.toFixed(3)), Number(upper.toFixed(3))],
        covers
      });
    }

    return { histogramData, intervals, coveredCount, M, zAlpha };
  } 
  
  if (modelType === 'hypothesis') {
    for (let i = 0; i < n; i++) {
      let u1 = Math.random(), v1 = Math.random();
      const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * v1);
      const val1 = z1 * 1 + 0;
      
      let u2 = Math.random(), v2 = Math.random();
      const z2 = Math.sqrt(-2.0 * Math.log(u2)) * Math.cos(2.0 * Math.PI * v2);
      const val2 = z2 * 1 + meanDiff;
      
      data.push({ id: i, groupA: Number(val1.toFixed(2)), groupB: Number(val2.toFixed(2)) });
    }
    return data;
  }

  if (modelType === 'error_propagation') {
    const shooters = [];
    const configs = [
      { name: 'Shooter 1', biasX: 1.2, biasY: 1.2, std: 0.3, label: 'Düşük Belirsizlik, Yüksek Sapma' },
      { name: 'Shooter 2', biasX: 0.0, biasY: 0.0, std: 1.2, label: 'Yüksek Belirsizlik, Sıfır Sapma' },
      { name: 'Shooter 3', biasX: 0.0, biasY: 0.0, std: 0.3, label: 'Düşük Belirsizlik, Sıfır Sapma' },
    ];
    for (const conf of configs) {
      const shots = [];
      let sumSqError = 0;
      let sumX = 0, sumY = 0;
      for (let i = 0; i < 40; i++) {
        let u1 = Math.random(), v1 = Math.random();
        const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * v1);
        let u2 = Math.random(), v2 = Math.random();
        const z2 = Math.sqrt(-2.0 * Math.log(u2)) * Math.cos(2.0 * Math.PI * v2);

        const x = z1 * conf.std + conf.biasX;
        const y = z2 * conf.std + conf.biasY;
        const distSq = x * x + y * y;
        sumSqError += distSq;
        sumX += x;
        sumY += y;
        shots.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) });
      }
      const meanX = sumX / 40;
      const meanY = sumY / 40;
      const sampleBias = Math.sqrt(meanX * meanX + meanY * meanY);
      const sampleMSE = sumSqError / 40;
      const sampleVar = sampleMSE - sampleBias * sampleBias;
      shooters.push({
        name: conf.name,
        label: conf.label,
        shots,
        bias: Number(sampleBias.toFixed(3)),
        variance: Number(Math.max(0, sampleVar).toFixed(3)),
        mse: Number(sampleMSE.toFixed(3))
      });
    }
    return shooters;
  }

  if (modelType === 'clt') {
    const sampleSize = cltSampleSize || 30;
    const samplesCount = cltSamplesCount || 200;

    let sourceMean = 40;
    let sourceStd = 17.3205;

    const sampleMeans = [];

    const drawValue = () => {
      if (cltSource === 'uniform') {
        return 10 + Math.random() * 60; // Uniform(10, 70)
      }
      if (cltSource === 'binomial') {
        let successes = 0;
        for (let i = 0; i < 100; i++) {
          if (Math.random() < 0.5) successes++; // Binomial(100, 0.5)
        }
        return successes;
      }
      if (cltSource === 'poisson') {
        const lambda = 27; // Poisson(27)
        const L = Math.exp(-lambda);
        let k = 0;
        let p = 1;
        do {
          k++;
          p *= Math.random();
        } while (p > L && k < 100);
        return k - 1;
      }
      return Math.random();
    };

    if (cltSource === 'uniform') {
      sourceMean = 40;
      sourceStd = 17.3205;
    } else if (cltSource === 'binomial') {
      sourceMean = 50;
      sourceStd = 5;
    } else if (cltSource === 'poisson') {
      sourceMean = 27;
      sourceStd = Math.sqrt(27);
    }

    const expectedMean = sourceMean;
    const expectedSE = sourceStd / Math.sqrt(sampleSize);

    for (let s = 0; s < samplesCount; s++) {
      let sum = 0;
      for (let i = 0; i < sampleSize; i++) {
        sum += drawValue();
      }
      sampleMeans.push(sum / sampleSize);
    }

    const minVal = Math.min(...sampleMeans);
    const maxVal = Math.max(...sampleMeans);
    const binsCount = 12;
    const binWidth = (maxVal - minVal) / binsCount || 1;
    const bins = Array.from({ length: binsCount }, (_, i) => {
      const start = minVal + i * binWidth;
      const end = start + binWidth;
      return {
        binStart: start,
        binEnd: end,
        binCenter: Number(((start + end) / 2).toFixed(2)),
        count: 0,
      };
    });

    for (const val of sampleMeans) {
      let placed = false;
      for (const bin of bins) {
        if (val >= bin.binStart && val < bin.binEnd) {
          bin.count++;
          placed = true;
          break;
        }
      }
      if (!placed && val >= bins[binsCount-1].binStart) {
        bins[binsCount-1].count++;
      }
    }

    const formattedBins = bins.map(bin => {
      const z = (bin.binCenter - expectedMean) / expectedSE;
      const density = (1 / (expectedSE * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
      const theoreticalCount = density * samplesCount * binWidth;
      return {
        ...bin,
        'Simüle Ortalamalar': bin.count,
        'Teorik Limit (Normal)': Number(theoreticalCount.toFixed(2))
      };
    });

    return {
      cltSource,
      sampleSize,
      samplesCount,
      expectedMean,
      expectedSE,
      bins: formattedBins,
      sampleMeans
    };
  }

  if (modelType === 'qq_plot') {
    const distType = qqDistribution || 'normal';
    const sample = [];

    for (let i = 0; i < n; i++) {
      let u = 0, v = 0;
      while(u === 0) u = Math.random();
      while(v === 0) v = Math.random();
      const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

      let val = 0;
      if (distType === 'normal') {
        val = z * std + mean;
      } else if (distType === 'skewed') {
        val = Math.exp(z * 0.5) * 2;
      } else if (distType === 'heavy') {
        let u2 = Math.random();
        const chiSq = -2.0 * Math.log(u2);
        val = z / Math.sqrt(chiSq / 2);
      }
      sample.push(val);
    }

    sample.sort((a, b) => a - b);

    const qqPoints = [];
    for (let j = 0; j < n; j++) {
      const pj = (j + 1 - 0.5) / n;
      const zTheoretical = getZValue(pj);
      qqPoints.push({
        id: j,
        z: Number(zTheoretical.toFixed(3)),
        value: Number(sample[j].toFixed(3))
      });
    }

    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    for (const pt of qqPoints) {
      sumX += pt.z;
      sumY += pt.value;
      sumXY += pt.z * pt.value;
      sumXX += pt.z * pt.z;
    }
    const regSlope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX) || 1;
    const regIntercept = (sumY - regSlope * sumX) / n || 0;

    const qqData = qqPoints.map(pt => ({
      ...pt,
      'Teorik Çizgi': Number((regSlope * pt.z + regIntercept).toFixed(3))
    }));

    return {
      distType,
      qqData,
      regSlope: Number(regSlope.toFixed(3)),
      regIntercept: Number(regIntercept.toFixed(3))
    };
  }
  
  return data;
}

// Abramowitz & Stegun normal CDF
function normalCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const poly = t * (0.3193815 + t * (-0.3565638 + t * (1.7814779 + t * (-1.8212560 + t * 1.3302744))));
  const p = 1 - d * poly;
  return z >= 0 ? p : 1 - p;
}

// Rational approximation for Standard Normal quantiles (Inverse CDF)
function getZValue(p: number): number {
  const adjustedP = Math.min(Math.max(p, 0.0001), 0.9999);
  
  // Lookup common values first
  if (Math.abs(adjustedP - 0.975) < 0.001) return 1.960; // 95% two-tailed
  if (Math.abs(adjustedP - 0.995) < 0.001) return 2.576; // 99% two-tailed
  if (Math.abs(adjustedP - 0.95) < 0.001) return 1.645;  // 90% two-tailed / 95% one-tailed
  
  const alpha = adjustedP < 0.5 ? adjustedP : 1 - adjustedP;
  const t = Math.sqrt(-2 * Math.log(alpha));
  const z = t - (2.515517 + 0.802853 * t + 0.010328 * t * t) / (1 + 1.432788 * t + 0.189269 * t * t + 0.001308 * t * t * t);
  return adjustedP < 0.5 ? -z : z;
}

export function calculateMetrics(modelType: string, data: any) {
  if (modelType === 'logistic') {
    if (!data || !Array.isArray(data) || data.length === 0 || !data[0] || typeof data[0].y === 'undefined') {
      return { Accuracy: '0.0%', Precision: '0.00', Recall: '0.00', 'ROC AUC': '0.500' };
    }
    const tp = data.filter((d:any) => d.y === 1 && d.prediction === 1).length;
    const tn = data.filter((d:any) => d.y === 0 && d.prediction === 0).length;
    const fp = data.filter((d:any) => d.y === 0 && d.prediction === 1).length;
    const fn = data.filter((d:any) => d.y === 1 && d.prediction === 0).length;
    const accuracy = (tp + tn) / data.length;
    const precision = tp / (tp + fp) || 0;
    const recall = tp / (tp + fn) || 0;
    
    // Sort and calculate ROC AUC
    const sorted = [...data].sort((a, b) => b.p - a.p);
    const pos = sorted.filter(d => d.y === 1).length;
    const neg = sorted.filter(d => d.y === 0).length;
    let tpAcc = 0, fpAcc = 0, auc = 0;
    for (const d of sorted) {
      if (d.y === 1) tpAcc++;
      else { fpAcc++; auc += tpAcc; }
    }
    const roc = auc / ((pos * neg) || 1);

    return {
      Accuracy: (accuracy * 100).toFixed(1) + '%',
      Precision: precision.toFixed(2),
      Recall: recall.toFixed(2),
      'ROC AUC': roc.toFixed(3)
    };
  } 
  
  if (modelType === 'linear') {
    if (!data || !Array.isArray(data) || data.length === 0 || !data[0] || typeof data[0].y === 'undefined') {
      return { 'R²': '0.000', MSE: '0.00', MAE: '0.00' };
    }
    const meanY = data.reduce((sum:number, d:any) => sum + d.y, 0) / data.length;
    const ssTot = data.reduce((sum:number, d:any) => sum + Math.pow(d.y - meanY, 2), 0);
    const ssRes = data.reduce((sum:number, d:any) => sum + Math.pow(d.y - d.prediction, 2), 0);
    const r2 = 1 - (ssRes / (ssTot || 1));
    const mse = data.reduce((sum:number, d:any) => sum + Math.pow(d.error, 2), 0) / data.length;
    const mae = data.reduce((sum:number, d:any) => sum + d.error, 0) / data.length;
    return {
      'R²': r2.toFixed(3),
      MSE: mse.toFixed(2),
      MAE: mae.toFixed(2)
    };
  } 
  
  if (modelType === 'normal') {
    if (!data || !data.intervals || !Array.isArray(data.intervals) || data.intervals.length === 0) {
      return {
        'Kapsama Oranı': '0%',
        'Kritik Z Değeri': '1.960',
        'İdeal Genişlik (w)': '0.000'
      };
    }
    const successRate = (data.coveredCount / data.M) * 100;
    return {
      'Kapsama Oranı': successRate.toFixed(0) + '% (' + data.coveredCount + '/' + data.M + ')',
      'Kritik Z Değeri': data.zAlpha.toFixed(3),
      'İdeal Genişlik (w)': (2 * data.zAlpha * (1.5 / Math.sqrt(data.intervals[0] ? 100 : 10))).toFixed(3)
    };
  } 
  
  if (modelType === 'hypothesis') {
    if (!data || !Array.isArray(data) || data.length === 0 || !data[0] || typeof data[0].groupA === 'undefined') {
      return {
        'p-değer': '1.0000',
        'Test İstatistiği': '0.000',
        'Karar': 'H₀ Koru (Anlamsız)',
        'Alfa Derecesi': '0.05'
      };
    }
    const groupA = data.map((d:any) => d.groupA);
    const groupB = data.map((d:any) => d.groupB);
    const n = groupA.length;
    const meanA = groupA.reduce((s:number, v:number) => s + v, 0) / n;
    const meanB = groupB.reduce((s:number, v:number) => s + v, 0) / n;
    const varA = groupA.reduce((s:number, v:number) => s + Math.pow(v - meanA, 2), 0) / n;
    const varB = groupB.reduce((s:number, v:number) => s + Math.pow(v - meanB, 2), 0) / n;
    const se = Math.sqrt(varA / n + varB / n);
    const zStat = se > 0 ? (meanA - meanB) / se : 0;
    const pValue = 2 * (1 - normalCDF(Math.abs(zStat)));
    const alpha = 0.05;
    return {
      'p-değer': Math.max(0, pValue).toFixed(4),
      'Test İstatistiği': zStat.toFixed(3),
      'Karar': pValue < alpha ? 'H₀ Reddet (Anlamlı)' : 'H₀ Koru (Anlamsız)',
      'Alfa Derecesi': alpha.toFixed(2)
    };
  }

  if (modelType === 'error_propagation') {
    if (!data || !Array.isArray(data) || data.length < 3 || !data[0] || typeof data[0].mse === 'undefined') {
      return {
        'Shooter 1 MSE': '0.000 (Bias² + Var)',
        'Shooter 2 MSE': '0.000 (Varyans Ağırlıklı)',
        'Shooter 3 MSE': '0.000 (En İyi Tahminci)'
      };
    }
    return {
      'Shooter 1 MSE': data[0].mse.toFixed(3) + ' (Bias² + Var)',
      'Shooter 2 MSE': data[1].mse.toFixed(3) + ' (Varyans Ağırlıklı)',
      'Shooter 3 MSE': data[2].mse.toFixed(3) + ' (En İyi Tahminci)'
    };
  }

  if (modelType === 'clt') {
    if (!data || !data.sampleMeans || !Array.isArray(data.sampleMeans)) {
      return {
        'E[X̄] Teorik': '0.00',
        'X̄ Simüle Ortalama': '0.00',
        'Teorik Hata (SE)': '0.000',
        'Simüle Hata (SE)': '0.000'
      };
    }
    const actualMean = data.sampleMeans.reduce((a:number, b:number) => a + b, 0) / data.sampleMeans.length;
    const actualVar = data.sampleMeans.reduce((a:number, b:number) => a + Math.pow(b - actualMean, 2), 0) / data.sampleMeans.length;
    return {
      'E[X̄] Teorik': data.expectedMean.toFixed(2),
      'X̄ Simüle Ortalama': actualMean.toFixed(2),
      'Teorik Hata (SE)': data.expectedSE.toFixed(3),
      'Simüle Hata (SE)': Math.sqrt(actualVar).toFixed(3)
    };
  }

  if (modelType === 'qq_plot') {
    if (!data || !data.qqData || !Array.isArray(data.qqData)) {
      return {
        'Dağılım': 'NORMAL',
        'Eğim (reg)': '1.000',
        'Kesişim (reg)': '0.000'
      };
    }
    return {
      'Dağılım': data.distType.toUpperCase(),
      'Eğim (reg)': data.regSlope.toFixed(3),
      'Kesişim (reg)': data.regIntercept.toFixed(3)
    };
  }
  
  return {};
}