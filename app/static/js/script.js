document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const uploadArea = document.getElementById('uploadArea');
    const pdfFileInput = document.getElementById('pdfFile');
    const uploadContainer = document.getElementById('uploadContainer');
    const previewContainer = document.getElementById('previewContainer');
    const pdfPreview = document.getElementById('pdfPreview');
    const reuploadBtn = document.getElementById('reuploadBtn');
    const processBtn = document.getElementById('processBtn');
    const resultContent = document.getElementById('resultContent');
    const modelSelect = document.getElementById('modelSelect');

    let currentFile = null;

    // Event Listeners
    uploadArea.addEventListener('click', () => pdfFileInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');

        if (e.dataTransfer.files.length) {
            pdfFileInput.files = e.dataTransfer.files;
            handleFileUpload();
        }
    });

    pdfFileInput.addEventListener('change', handleFileUpload);

    reuploadBtn.addEventListener('click', () => {
        uploadContainer.style.display = 'block';
        previewContainer.style.display = 'none';
        processBtn.disabled = true;
        resultContent.innerHTML = '<p class="placeholder-text">Results will appear here after processing.</p>';
        currentFile = null;
    });

    processBtn.addEventListener('click', processPdf);

    // Functions
    function handleFileUpload() {
        const file = pdfFileInput.files[0];

        if (file && file.type === 'application/pdf') {
            const formData = new FormData();
            formData.append('pdfFile', file);

            fetch('/upload', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        currentFile = data.filename;
                        pdfPreview.src = data.file_url;
                        uploadContainer.style.display = 'none';
                        previewContainer.style.display = 'block';
                        processBtn.disabled = false;
                    } else {
                        alert('Error: ' + data.error);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while uploading the file.');
                });
        } else {
            alert('Please select a valid PDF file.');
        }
    }

    function processPdf() {
        if (!currentFile) return;

        processBtn.disabled = true;
        resultContent.innerHTML = '<p class="placeholder-text">Processing...</p>';

        // Get the selected model
        const selectedModel = modelSelect.value;

        fetch('/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    filename: currentFile,
                    model: selectedModel
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Set the HTML content directly (our response is already formatted HTML)
                    resultContent.innerHTML = data.result;
                } else {
                    resultContent.innerHTML = `<div class="error">Error: ${data.error}</div>`;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                resultContent.innerHTML = '<div class="error">An error occurred during processing.</div>';
            })
            .finally(() => {
                processBtn.disabled = false;
            });
    }
});