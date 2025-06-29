# Vehicle Dispatch Report API - V4

**Clean Flask backend API for processing vehicle dispatch/delivery logs**

## Overview
Processes Excel files containing car dispatch/delivery data, splits Engine-VIN pairs by brand, and generates multi-tab reports. Designed for frontend integration (v0.dev) with clean API endpoints.

## Current Status - V4 Clean Build
- ✅ **Core API**: `api_only.py` with robust auto-detection
- ✅ **Processing Logic**: `simpler_processor.py` handles 11 brands  
- ✅ **Dependencies**: Listed in `requirements.txt`
- ✅ **Test Data**: Available in `Files/` directory
- ✅ **Legacy Archived**: Previous iterations moved to `archive/`

## Supported Features
- **File Types**: .xls, .xlsx, .csv
- **Brands**: CHANGAN, MAXUS, GEELY, GWM, ZNA, DFAC, KMC, HYUNDAI, LOVOL, FOTON, DINGZHOU
- **Auto-Detection**: Intelligent column mapping for Engine-VIN and brand data
- **Memory-Only Processing**: No disk persistence for privacy compliance
- **CORS Enabled**: Ready for frontend integration

## API Endpoints

### `POST /api/process`
Upload Excel file, returns processed multi-brand report
- **Input**: FormData with 'file' field
- **Output**: Excel file with Summary + Brand sheets
- **Max Size**: 16MB

### `GET /health`
Health check endpoint
- **Output**: Status + supported brands list

### `GET /api/info`
API information and capabilities
- **Output**: Service details, formats, endpoints

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Start server
python api_only.py
```

Server runs on `http://127.0.0.1:8000`

## Frontend Integration (v0.dev)
The API is designed for drag-and-drop frontends:

```javascript
// Example upload to /api/process
const formData = new FormData();
formData.append('file', file);

fetch('YOUR_API_URL/api/process', {
    method: 'POST', 
    body: formData
})
.then(response => response.blob())
.then(blob => {
    // Handle returned Excel file
});
```

## Deployment Ready
- Environment variables for sensitive data
- CORS configured for cross-origin requests
- Error handling for production use
- Memory-efficient processing

## Architecture Notes
- **Separation of Concerns**: API (`api_only.py`) + Logic (`simpler_processor.py`)
- **Auto-Detection**: Handles various Excel formats and column layouts
- **Brand Processing**: Intelligent splitting of Engine-VIN pairs
- **Privacy First**: No data persistence, memory-only operations

---

*Previous iterations (Streamlit UI, legacy Flask apps) archived in `archive/` directory* 