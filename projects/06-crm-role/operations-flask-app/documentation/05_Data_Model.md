# 5. Data Model

This document outlines the expected data formats for input and output files. The tool is designed to handle variations in column names from different input files and standardize them.

## Input Data

*   **Location**: `operations-flask-app/Files/`
*   **Format**: Microsoft Excel files (`.xls`, `.xlsx`).

Below are examples of the expected column names from different types of input files.

#### Changan/Maxus Sales Report

| Original Column   | Description              |
| ----------------- | ------------------------ |
| `Retail Date`     | The date of the sale.    |
| `Car Model`       | The model of the vehicle.|
| `Customer Name`   | The name of the customer.|

#### Geely Sales Report

| Original Column   | Description              |
| ----------------- | ------------------------ |
| `SALES DATE`      | The date of the sale.    |
| `MODEL`           | The model of the vehicle.|
| `CUSTOMER NAME`   | The name of the customer.|

#### Dispatch Report

| Original Column   | Description                  |
| ----------------- | ---------------------------- |
| `DISPATCH DATE`   | The date the vehicle was dispatched. |
| `MODEL`           | The model of the vehicle.    |
| `DEALER`          | The dealership receiving the vehicle. |


## Standardized Output Data

*   **Location**: `operations-flask-app/Files/output/`
*   **Format**: Microsoft Excel files (`.xlsx`).
*   **Content**: The output files contain the cleaned and standardized data with the following common structure:

| Standardized Column | Description                           |
| ------------------- | ------------------------------------- |
| `Date`              | The date of the event (Sale or Dispatch). |
| `Model`             | The model of the vehicle.             |
| `Customer`          | The name of the end customer.         |
| `Dealer`            | The name of the dealership.           |
