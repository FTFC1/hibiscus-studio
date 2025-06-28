# Dashboard Design Decisions

This document outlines the design decisions and evolution of the vehicle inventory dashboard.

## Dashboard Cards

### 1. Total Vehicles Card
- **Purpose**: Provide an overview of all vehicles in inventory with their status distribution
- **Key Metrics**:
  - Total vehicle count
  - Distribution across statuses (Available, In Transit, Reserved, Display)
  - Recently added models
- **Design Evolution**:
  - Started with simple numeric display
  - Added percentage context
  - Added visual distribution bar
  - Added detailed breakdown by status
  - Added recently added models section

### 2. Vehicle Type Breakdown Card
- **Purpose**: Show the distribution of vehicles by type
- **Key Metrics**:
  - Vehicle counts by type (Sedan, SUV, Truck, Van)
  - Percentage of total for each type
- **Design Evolution**:
  - Started with simple text breakdown
  - Added basic chart visualization
  - Improved with complete donut chart
  - Added clear legend with counts and percentages

### 3. Inventory Highlights Card
- **Purpose**: Highlight recent activity and top models in inventory
- **Key Metrics**:
  - New arrivals in the last 7 days
  - Top 3 models by count in inventory
- **Design Evolution**:
  - Replaced earlier "Change Metrics" card
  - Focused on actionable insights
  - Simplified to just two key metrics for clarity

## Design Principles

1. **Clarity**: Each card has a clear purpose and focused metrics
2. **Context**: Metrics are presented with relevant context (e.g., percentages, trends)
3. **Visual Hierarchy**: Important information is visually emphasized
4. **Consistency**: Similar visual language across all cards
5. **Actionability**: Focus on metrics that drive decisions

## Future Enhancements

As more data becomes available, consider adding:

1. **Inventory Age Metrics**: Track how long vehicles remain in inventory
2. **Sales Velocity**: How quickly different models sell
3. **Seasonal Trends**: Historical patterns in inventory movement
4. **Branch Comparisons**: Compare metrics across different locations
5. **Reservation Pipeline**: Track the reservation process from request to confirmation

## Data Requirements

Current dashboard relies on:
- Current inventory counts by status
- Vehicle type information
- Recent additions to inventory
- Model counts

Future enhancements would require:
- Historical inventory data
- Timestamp data for status changes
- Sales completion data
- Branch-specific inventory data
