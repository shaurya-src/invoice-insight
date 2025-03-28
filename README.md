# Invoice Insight

<div align="center">
  <img src="app/static/img/logo.png" alt="Invoice Insight Logo" width="200" height="auto">
  <p><em>AI-powered invoice processing and analysis</em></p>
</div>

## 📋 Overview

Invoice Insight is an advanced web application that leverages AI to automatically extract, analyze, and structure data from PDF invoices. The application provides a seamless interface for businesses to efficiently process invoice documents using state-of-the-art machine learning models from OpenAI and Google.

### 🎯 Problem Statement

Businesses receive numerous invoices in PDF format that require manual data extraction, verification, and entry into accounting systems. This process is:
- Time-consuming and prone to human error
- Difficult to scale during high-volume periods
- Costly in terms of labor and processing time

Invoice Insight addresses these challenges by automating the entire invoice processing workflow.

## ✨ Features

- **Multi-Model AI Processing**: Choose between OpenAI's GPT-4o or Google's Gemini 2.0 Flash models for invoice analysis
- **Seamless PDF Uploads**: Simple drag-and-drop interface for uploading invoice documents
- **Intelligent Data Extraction**: Automatically identify and extract key invoice fields including:
  - Company information
  - Product details and SKUs
  - License quantities
  - Billing periods
  - Pricing information
  - Total amounts
- **Structured Data Output**: Converts unstructured invoice data into clean, structured JSON
- **Rich Visual Presentation**: Displays processed invoice data in an organized, easy-to-read format
- **Invoice Validation**: Automatically verifies if uploaded documents are valid invoices

## 🚀 Use Cases

### 1. Finance & Accounting Departments
- **Accounts Payable Automation**: Streamline invoice processing and reduce manual data entry
- **Audit Preparation**: Quickly digitize and organize invoice data for audit purposes
- **Budget Tracking**: Easily monitor software license expenses across departments

### 2. Software License Management
- **License Inventory**: Track Microsoft 365 and Google Workspace license quantities and costs
- **Subscription Monitoring**: Keep track of billing periods and renewal dates
- **Cost Analysis**: Analyze per-license pricing to identify cost-saving opportunities

### 3. Procurement Teams
- **Vendor Management**: Maintain accurate records of software vendors and their pricing
- **Purchase Verification**: Validate that invoiced items match ordered quantities
- **Expense Categorization**: Automatically categorize expenses by product type and SKU

### 4. Small Business Owners
- **Simplified Bookkeeping**: Reduce the complexity of managing business expenses
- **Time Savings**: Focus on core business activities instead of administrative tasks
- **Error Reduction**: Minimize data entry errors in financial records

## 🛠️ Technology Stack

- **Backend**: Flask (Python)
- **PDF Processing**: PyMuPDF
- **AI Models**: 
  - OpenAI GPT-4o API
  - Google Gemini 2.0 Flash API
- **Data Validation**: Pydantic
- **Frontend**: HTML, CSS, JavaScript

## 🔧 Installation

1. **Clone the repository**:
   ```bash
   git clone [https://github.com/yourusername/invoice-insight.git](https://github.com/shaurya-src/invoice-insight.git)
   cd invoice-insight
   ```

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On Unix or MacOS
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   Create a `.env` file in the root directory with the following variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

## 📈 Usage

1. **Start the application**:
   ```bash
   python run.py
   ```

2. **Access the web interface**:
   Open your browser and navigate to `http://localhost:5500`

3. **Upload an invoice**:
   - Drag and drop a PDF invoice into the upload area
   - Or click to browse and select a file

4. **Process the invoice**:
   - Select your preferred AI model (OpenAI or Gemini)
   - Click "Process Invoice"
   - View the structured results in the results panel

## 🏗️ Project Structure

```
invoice-insight/
├── app/                    # Application modules
│   ├── invproc.py          # Invoice processing logic
│   ├── static/             # Static assets (CSS, JS, images)
│   │   └── uploads/        # Temporary storage for uploaded invoices
│   └── template/           # HTML templates
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── LICENSE                 # MIT License
├── README.md               # Project documentation
├── requirements.txt        # Python dependencies
└── run.py                  # Application entry point
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.




