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
    const browseLink = document.querySelector('.browse-link');

    let currentFile = null;

    // Add neomorphic hover effects to buttons
    const addHoverEffects = () => {
        const buttons = document.querySelectorAll('.process-btn, .reupload-btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
            
            button.addEventListener('mousedown', () => {
                button.style.transform = 'translateY(1px)';
            });
            
            button.addEventListener('mouseup', () => {
                button.style.transform = 'translateY(-2px)';
            });
        });
    };

    // Call the function to add hover effects
    addHoverEffects();

    // Event Listeners
    if (browseLink) {
        browseLink.addEventListener('click', () => pdfFileInput.click());
    }
    
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
        resultContent.innerHTML = '<p class="placeholder-text">Your invoice analysis results will appear here after processing.</p>';
        currentFile = null;
    });

    processBtn.addEventListener('click', processPdf);

    // Add custom transition when switching between containers
    function fadeIn(element) {
        element.style.opacity = 0;
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.5s ease';
            element.style.opacity = 1;
        }, 10);
    }
    
    function fadeOut(element, callback) {
        element.style.transition = 'opacity 0.5s ease';
        element.style.opacity = 0;
        
        setTimeout(() => {
            element.style.display = 'none';
            if (callback) callback();
        }, 500);
    }

    // Functions
    function handleFileUpload() {
        const file = pdfFileInput.files[0];

        if (file && file.type === 'application/pdf') {
            // Show loading state
            uploadArea.classList.add('uploading');
            uploadArea.innerHTML = `
                <div class="upload-loading">
                    <div class="spinner"></div>
                    <p>Uploading PDF...</p>
                </div>
            `;

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
                        
                        // Use fade transition
                        fadeOut(uploadContainer, () => {
                            fadeIn(previewContainer);
                        });
                        
                        processBtn.disabled = false;
                    } else {
                        resetUploadArea();
                        showNotification('Error: ' + data.error, 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    resetUploadArea();
                    showNotification('An error occurred while uploading the file.', 'error');
                });
        } else {
            showNotification('Please select a valid PDF file.', 'error');
        }
    }

    function resetUploadArea() {
        uploadArea.classList.remove('uploading');
        uploadArea.innerHTML = `
            <input type="file" id="pdfFile" accept=".pdf" hidden>
            <div class="upload-prompt">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="upload-icon">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <p class="upload-text">Drag & drop your PDF here or <span class="browse-link">browse</span></p>
            </div>
        `;
        
        // Reconnect the event listeners
        const newBrowseLink = document.querySelector('.browse-link');
        if (newBrowseLink) {
            newBrowseLink.addEventListener('click', () => document.getElementById('pdfFile').click());
        }
        
        document.getElementById('pdfFile').addEventListener('change', handleFileUpload);
    }

    // Show notification function
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animation to slide in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto-dismiss after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 4000);
    }

    function processPdf() {
        if (!currentFile) return;

        processBtn.disabled = true;
        processBtn.classList.add('processing');
        resultContent.innerHTML = `
            <div class="processing-container">
                <div class="processing-spinner"></div>
                <p class="processing-text">Analyzing your invoice with ${modelSelect.options[modelSelect.selectedIndex].text}...</p>
            </div>
        `;

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
                    // Add animation for results appearing
                    resultContent.style.opacity = '0';
                    setTimeout(() => {
                        // Set the HTML content directly (our response is already formatted HTML)
                        resultContent.innerHTML = data.result;
                        resultContent.style.transition = 'opacity 0.5s ease';
                        resultContent.style.opacity = '1';
                        showNotification('Invoice processed successfully!', 'success');
                    }, 300);
                } else {
                    resultContent.innerHTML = `<div class="error">Error: ${data.error}</div>`;
                    showNotification('Error processing invoice', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                resultContent.innerHTML = '<div class="error">An error occurred during processing.</div>';
                showNotification('Processing failed', 'error');
            })
            .finally(() => {
                processBtn.disabled = false;
                processBtn.classList.remove('processing');
            });
    }
});