# IPP ROI Calculator

## Client Input Parameters

| Parameter | Value | Units | Notes |
|-----------|-------|-------|-------|
| **Current Power Consumption** | | kWh/month | Average monthly consumption |
| **Peak Load** | | kW | Maximum demand |
| **Current Power Sources** | | | Grid, diesel, etc. |
| **Grid Power Cost** | | NGN/kWh | If applicable |
| **Grid Availability** | | % | Average uptime |
| **Diesel Generator Capacity** | | kW | If applicable |
| **Diesel Consumption Rate** | | L/hr | At average load |
| **Diesel Price** | | NGN/L | Current price |
| **Generator Maintenance Cost** | | NGN/month | Average monthly |
| **Generator Replacement Timeline** | | Years | Expected lifespan |
| **Production Losses Due to Power** | | NGN/month | Estimated value |

## IPP Solution Parameters

| Parameter | Value | Units | Notes |
|-----------|-------|-------|-------|
| **Proposed IPP Capacity** | | MW | Total installed |
| **IPP Tariff** | | NGN/kWh | Fixed for contract term |
| **Gas Consumption Rate** | | m³/kWh | At average load |
| **Gas Price** | | NGN/m³ | Current price |
| **Take or Pay Quantity** | | % | Minimum billing amount |
| **Contract Duration** | | Years | Term length |
| **Guaranteed Availability** | | % | Contractual uptime |

## Cost Comparison (Monthly)

### Current Power Solution

| Cost Component | Calculation | Monthly Cost (NGN) |
|----------------|-------------|-------------------|
| Grid Power | Consumption × Grid Cost × (Grid Availability/100) | |
| Diesel Fuel | (Consumption × (1-Grid Availability/100) × Diesel Rate × Diesel Price) / Generator Efficiency | |
| Generator Maintenance | Fixed input | |
| Generator Depreciation | Generator Cost / (Lifespan × 12) | |
| Production Losses | Fixed input | |
| **Total Current Monthly Cost** | Sum of above | |
| **Current Effective Cost per kWh** | Total Cost / Consumption | |

### IPP Solution

| Cost Component | Calculation | Monthly Cost (NGN) |
|----------------|-------------|-------------------|
| IPP Power Charges | Max(Consumption, Take or Pay % × Capacity × 720) × IPP Tariff | |
| Gas Cost (if client supplied) | Consumption × Gas Consumption Rate × Gas Price | |
| Production Losses | Estimated based on 98% availability | |
| **Total IPP Monthly Cost** | Sum of above | |
| **IPP Effective Cost per kWh** | Total Cost / Consumption | |

## Savings Analysis

| Metric | Calculation | Result |
|--------|-------------|--------|
| **Monthly Cost Savings** | Current Cost - IPP Cost | NGN |
| **Annual Cost Savings** | Monthly Savings × 12 | NGN |
| **Percentage Savings** | (Monthly Savings / Current Cost) × 100 | % |
| **5-Year Savings** | Annual Savings × 5 | NGN |
| **Cost per kWh Reduction** | Current per kWh - IPP per kWh | NGN/kWh |

## Reliability Improvement

| Metric | Current | With IPP | Improvement |
|--------|---------|---------|-------------|
| **Power Availability** | Grid % | ≥98% | +X% |
| **Outage Hours per Month** | 720 × (1-Grid%) | 720 × (1-98%) | -X hours |
| **Voltage Stability** | Poor/Fair/Good | Excellent | |
| **Frequency Stability** | Poor/Fair/Good | Excellent | |

## Environmental Impact

| Metric | Calculation | Result |
|--------|-------------|--------|
| **Current CO₂ Emissions** | Diesel consumption × 2.68 kg CO₂/L | kg CO₂/month |
| **IPP CO₂ Emissions** | Gas consumption × 0.18 kg CO₂/kWh | kg CO₂/month |
| **CO₂ Reduction** | Current - IPP | kg CO₂/month |
| **Equivalent Trees Planted** | CO₂ Reduction / 21 | Trees/month |

## Non-Financial Benefits

- Elimination of generator management
- Reduced noise pollution
- Improved power quality for sensitive equipment
- Predictable energy costs
- No capital expenditure
- Focus on core business operations

## Notes & Assumptions

1. All calculations are estimates based on provided information
2. Actual savings may vary based on consumption patterns
3. Gas prices subject to market fluctuations
4. Production loss estimates are conservative
5. Environmental calculations use standard conversion factors

## Recommendation

Based on the analysis above, implementing the proposed IPP solution would result in:

- **Financial Benefit:** NGN [X] million in savings over 5 years
- **Reliability Improvement:** Increase from [X]% to ≥98% power availability
- **Environmental Impact:** Reduction of [X] tonnes of CO₂ emissions annually
- **Operational Advantage:** Elimination of power management burden

The recommended next step is to proceed with a detailed site assessment to validate these projections and develop a customized proposal. 