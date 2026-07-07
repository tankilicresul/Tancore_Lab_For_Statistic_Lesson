export const codeSnippets = {
  logistic: {
    python: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix

np.random.seed(42)

X = np.linspace(-20, 20, 500).reshape(-1, 1)
probability = 1 / (1 + np.exp(-0.25 * X))

y = np.random.binomial(1, probability.ravel())

model = LogisticRegression()
model.fit(X, y)

predictions = model.predict(X)
accuracy = accuracy_score(y, predictions)

print("Accuracy:", accuracy)
print(confusion_matrix(y, predictions))`,
    r: `set.seed(42)
x <- seq(-20, 20, length.out = 500)
p <- 1 / (1 + exp(-0.25 * x))
y <- rbinom(500, 1, p)
df <- data.frame(x, y)
model <- glm(y ~ x, family = binomial, data = df)
summary(model)
predictions <- predict(model, type = "response")`,
    sql: `SELECT
  x,
  y,
  prediction,
  ABS(y - prediction) AS error,
  probability
FROM simulation_data
WHERE model_type = 'logistic_regression'
ORDER BY x ASC;`,
    javascript: `const sigmoid = x => 1 / (1 + Math.exp(-0.25 * x));
const X = Array.from({length: 500}, (_, i) => -20 + i * 0.08);
const probs = X.map(sigmoid);
const y = probs.map(p => Math.random() < p ? 1 : 0);
const accuracy = y.filter((v, i) => v === Math.round(probs[i])).length / y.length;
console.log('Accuracy:', accuracy.toFixed(4));`
  },
  linear: {
    python: `import numpy as np
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt

np.random.seed(42)
X = np.linspace(-10, 10, 200).reshape(-1, 1)
y = 0.5 * X.ravel() + 2 + np.random.normal(0, 1.5, 200)

model = LinearRegression()
model.fit(X, y)

predictions = model.predict(X)
print("R^2 Score:", model.score(X, y))`,
    r: `set.seed(42)
x <- seq(-10, 10, length.out=200)
y <- 0.5 * x + 2 + rnorm(200, 0, 1.5)
model <- lm(y ~ x)
summary(model)
plot(x, y)
abline(model, col="red")`,
    sql: `SELECT
  x, y,
  (0.5 * x + 2) AS prediction,
  POWER(y - (0.5 * x + 2), 2) AS squared_error
FROM simulation_data
WHERE model_type = 'linear_regression';`,
    javascript: `const X = Array.from({length: 200}, (_, i) => -10 + i * 0.1);
const noise = () => (Math.random() - 0.5) * 3;
const y = X.map(x => 0.5 * x + 2 + noise());
// OLS implementation omitted for brevity
console.log('Data generated. Ready for OLS.');`
  },
  normal: {
    python: `import numpy as np
import matplotlib.pyplot as plt
import scipy.stats as stats

data = np.random.normal(loc=0, scale=1.0, size=500)
mean = np.mean(data)
std = np.std(data)

print(f"Mean: {mean:.2f}, Std: {std:.2f}")`,
    r: `data <- rnorm(500, mean=0, sd=1)
mean_val <- mean(data)
std_val <- sd(data)
print(paste("Mean:", round(mean_val, 2), "Std:", round(std_val, 2)))`,
    sql: `SELECT
  AVG(value) as mean_val,
  STDDEV(value) as std_val,
  VARIANCE(value) as variance_val
FROM normal_distribution_data;`,
    javascript: `const generateNormal = (mean = 0, std = 1) => {
  let u = 0, v = 0;
  while(u === 0) u = Math.random();
  while(v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * std + mean;
};
const data = Array.from({length: 500}, () => generateNormal(0, 1));`
  },
  hypothesis: {
    python: `import numpy as np
from scipy import stats

np.random.seed(42)
group_a = np.random.normal(0, 1, 100)
group_b = np.random.normal(0.5, 1, 100)

t_stat, p_val = stats.ttest_ind(group_a, group_b)
print(f"T-statistic: {t_stat:.3f}, P-value: {p_val:.4f}")`,
    r: `set.seed(42)
group_a <- rnorm(100, mean=0, sd=1)
group_b <- rnorm(100, mean=0.5, sd=1)

result <- t.test(group_a, group_b)
print(result)`,
    sql: `-- Hypothesis testing directly in SQL is complex
-- Often relies on specific analytical extensions
SELECT
  group_name,
  AVG(value) as group_mean,
  COUNT(value) as n
FROM test_data
GROUP BY group_name;`,
    javascript: `// A simple t-test implementation would go here
// In JS we typically use libraries like jStat
const pValue = 0.034; // mock
console.log('P-Value:', pValue);`
  }
};