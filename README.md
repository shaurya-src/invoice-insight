# Invoice Insight

Invoice Insight is a web application designed to process and analyze PDF invoices using machine learning models. The application allows users to upload PDF files and choose between different models to extract and process invoice data.

## Features

- **Upload PDF Invoices**: Users can upload PDF files through a web interface.
- **Model Selection**: Choose between different models (e.g., Gemini, OpenAI) for processing invoices.
- **Data Extraction**: Extracts text from PDF invoices and processes it to provide structured data.
- **Rich Text Output**: Converts JSON results into a rich text format for better readability.

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd invoice-insight
   ```

2. **Create a virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   - Create a `.env` file in the root directory.
   - Add necessary environment variables as required by the application.

## Usage

1. **Run the application**:
   ```bash
   python run.py
   ```

2. **Access the web interface**:
   - Open a web browser and go to `http://localhost:5500`.

3. **Upload and process invoices**:
   - Use the web interface to upload PDF invoices.
   - Select the desired model for processing.
   - View the processed results in rich text format.

## Project Structure

- `app/`: Contains application-specific modules and templates.
- `run.py`: Main application file that sets up the Flask server and routes.
- `requirements.txt`: Lists all Python dependencies.
- `.env`: Environment variables configuration file.
- `LICENSE`: License information for the project.

## Dependencies

The project relies on several Python packages, including but not limited to:

- Flask
- PyMuPDF
- OpenAI
- BeautifulSoup4

For a complete list, see `requirements.txt`.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
