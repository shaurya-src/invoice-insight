from flask import Flask, render_template, request, jsonify
import os
from werkzeug.utils import secure_filename
from app.invproc import process_invoice_gemini, process_invoice_openai
import pathlib
import pymupdf
from dotenv import load_dotenv

app = Flask(__name__, 
            template_folder='app/template',
            static_folder='app/static')
app.config['UPLOAD_FOLDER'] = 'app/static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max upload size
app.config['ALLOWED_EXTENSIONS'] = {'pdf'}

# Create upload folder if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'pdfFile' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['pdfFile']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        return jsonify({
            'success': True,
            'filename': filename,
            'file_url': f'/static/uploads/{filename}'
        })
    
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/process', methods=['POST'])
def process_pdf():
    data = request.get_json()
    if not data or 'filename' not in data:
        return jsonify({'error': 'No filename provided'}), 400
    
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], data['filename'])
    filepath = pathlib.Path(filepath)
    
    # Get the selected model (default to gemini if not specified)
    model = data.get('model', 'gemini')
    
    if model == 'openai':
        # Load the document with PyMuPDF to get text
        doc = pymupdf.open(filepath)
        invoice_txt = ""
        for page in doc:
            invoice_txt += page.get_text()
        # Process with OpenAI
        result = process_invoice_openai(invoice_txt)
    else:  # default to gemini
        # Process with Gemini
        result = process_invoice_gemini(filepath)
    
    print(result)
    return jsonify({
        'success': True,
        'result': result
    })

if __name__ == '__main__':
    load_dotenv(override=True)
    app.run(debug=True, port=5500) 