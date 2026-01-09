# ML Model Documentation

## Overview

The B2B Pricing Estimator uses an ensemble machine learning approach to predict optimal pricing for quotations. The model combines multiple algorithms to leverage their individual strengths and provide robust, accurate predictions with confidence intervals.

## Model Architecture

### Ensemble Approach

The pricing model uses a weighted ensemble of three base models:

1. **Random Forest Regressor**
   - Captures non-linear relationships between features
   - Handles feature interactions well
   - Provides feature importance insights
   - Robust to outliers

2. **XGBoost Regressor**
   - Handles complex feature interactions
   - Excellent performance on tabular data
   - Built-in regularization to prevent overfitting
   - Handles missing values

3. **Linear Regression**
   - Provides baseline predictions
   - Offers interpretability
   - Captures linear relationships
   - Fast inference time

### Final Prediction

The final price estimate is calculated as a weighted average of the ensemble models:

```
final_price = w1 * RF_prediction + w2 * XGB_prediction + w3 * LR_prediction
```

Where weights are determined through cross-validation and performance metrics.

### Confidence Intervals

Confidence intervals are calculated using:
- Prediction variance from ensemble models
- Historical prediction accuracy
- Feature uncertainty
- Model agreement/disagreement

## Key Features

### Customer Features

- **Relationship Strength Score** (0-1)
  - Calculated from historical interactions
  - Considers purchase frequency, support tickets, contract length
  - Higher scores may justify premium pricing

- **Customer Lifetime Value (CLV)**
  - Estimated total value of customer relationship
  - Influences pricing strategy (higher CLV may get better rates)

- **Historical Win/Loss Rate**
  - Success rate with this customer
  - Indicates price sensitivity

- **Customer Value Alignment Score**
  - Semantic similarity between customer values and product features
  - Calculated using vector embeddings
  - Higher alignment may support premium pricing

### Competitor Features

- **Competitor Price Differentials**
  - Difference between competitor prices and our base price
  - Normalized by product category

- **Market Share Impact**
  - Competitor market share in relevant segment
  - Influences competitive positioning

- **Win Rate Against Competitors**
  - Historical success rate when competing
  - Indicates competitive strength

### Market Condition Features

- **Economic Indicator Index**
  - Composite index of economic conditions
  - Affects pricing elasticity

- **Industry Trend Direction**
  - Up, Down, or Stable trend
  - Encoded as numerical features

- **Seasonal Factor**
  - Seasonal adjustment multiplier
  - Accounts for cyclical patterns

- **Regional Pricing Variation**
  - Geographic pricing multiplier
  - Adjusts for regional market conditions

### Product Features

- **Base Cost**
  - Manufacturing/service delivery cost
  - Foundation for pricing

- **Service Tier**
  - Basic, Standard, Premium, Enterprise
  - Encoded as ordinal features

- **Feature Complexity**
  - Number and complexity of requested features
  - Affects pricing

### Time-Based Features

- **Day of Week**
  - Cyclical encoding (sine/cosine)
  - Captures weekly patterns

- **Month/Quarter**
  - Seasonal patterns
  - Business cycle effects

- **Time Since Last Purchase**
  - Recency of customer relationship
  - May indicate relationship strength

## Model Training

### Training Pipeline

1. **Data Collection**
   - Historical quotations with outcomes
   - Customer data
   - Competitor intelligence
   - Market conditions

2. **Feature Engineering**
   - Extract and transform features
   - Handle missing values
   - Encode categorical variables
   - Generate derived metrics

3. **Data Splitting**
   - Training set (70%)
   - Validation set (15%)
   - Test set (15%)
   - Time-based splitting to prevent data leakage

4. **Model Training**
   - Train each base model independently
   - Hyperparameter tuning via grid search or Bayesian optimization
   - Cross-validation for robust evaluation

5. **Ensemble Weight Optimization**
   - Determine optimal weights for ensemble
   - Validate on holdout set
   - Ensure weights sum to 1

6. **Model Evaluation**
   - Calculate metrics (MAE, RMSE, R², MAPE)
   - Analyze prediction errors
   - Check for bias in predictions

7. **Model Versioning**
   - Save model artifacts
   - Store metadata (features, performance, training date)
   - Register in model registry

### Evaluation Metrics

- **Mean Absolute Error (MAE)**: Average prediction error
- **Root Mean Squared Error (RMSE)**: Penalizes larger errors
- **R² Score**: Proportion of variance explained
- **Mean Absolute Percentage Error (MAPE)**: Percentage-based error
- **Prediction Interval Coverage**: How often true price falls within confidence interval

### Hyperparameter Tuning

**Random Forest**:
- `n_estimators`: Number of trees
- `max_depth`: Maximum tree depth
- `min_samples_split`: Minimum samples to split
- `min_samples_leaf`: Minimum samples in leaf

**XGBoost**:
- `learning_rate`: Step size shrinkage
- `max_depth`: Maximum tree depth
- `n_estimators`: Number of boosting rounds
- `subsample`: Row sampling ratio
- `colsample_bytree`: Column sampling ratio

**Linear Regression**:
- Regularization (Ridge/Lasso) if needed
- Feature selection

## Model Inference

### Inference Process

1. **Feature Extraction**
   - Extract features from request data
   - Query database for additional context
   - Generate derived features

2. **Feature Transformation**
   - Apply same transformations as training
   - Handle missing values
   - Encode categorical variables

3. **Model Prediction**
   - Run inference through each base model
   - Calculate weighted ensemble prediction
   - Compute confidence intervals

4. **Post-Processing**
   - Apply business rules (minimum/maximum prices)
   - Round to appropriate precision
   - Format for API response

### Performance Considerations

- **Caching**: Cache model artifacts in memory
- **Batch Processing**: Support batch inference for efficiency
- **Async Processing**: Long-running predictions can be async
- **Model Versioning**: Support A/B testing with multiple versions

## Model Versioning

### Version Management

- Each model version is uniquely identified
- Versions include:
  - Version number/identifier
  - Training date and time
  - Performance metrics
  - Feature list
  - Model artifacts

### A/B Testing

- Support multiple active model versions
- Route requests to different versions
- Track performance metrics per version
- Automatic rollback on performance degradation

### Model Rollback

- Maintain previous model versions
- Quick rollback capability
- Performance monitoring triggers alerts
- Manual or automatic rollback based on metrics

## Model Monitoring

### Key Metrics to Monitor

- **Prediction Accuracy**: Compare predictions to actual outcomes
- **Prediction Drift**: Monitor for distribution shifts
- **Feature Drift**: Detect changes in input feature distributions
- **Model Performance**: Track evaluation metrics over time
- **Inference Latency**: Monitor prediction response times

### Alerting

- Performance degradation thresholds
- Prediction error spikes
- Feature distribution changes
- Model inference failures

## Future Enhancements

- **Deep Learning Models**: Explore neural networks for complex patterns
- **Time Series Models**: Better capture temporal dependencies
- **Reinforcement Learning**: Optimize pricing strategy over time
- **Explainability**: Add SHAP values or LIME for interpretability
- **Online Learning**: Incremental model updates from new data
- **Multi-Objective Optimization**: Balance price, win rate, and profit


