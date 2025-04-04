document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.getElementById('toggle-sidebar');

    toggleButton.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        toggleButton.textContent = '🎼'; // Always show the emoji
    });

    const pdfList = document.getElementById('pdf-list');
    const pdfViewer = document.getElementById('pdf-viewer');
    const noSelection = document.getElementById('no-selection');
    const searchInput = document.getElementById('search');
    
    // Configuration - path to your PDFs folder
    const pdfFolderPath = 'pdfs/';
    
    // Fetch the list of PDFs
    fetchPDFList();
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const items = pdfList.getElementsByTagName('li');
        
        for (let item of items) {
            const fileName = item.textContent.toLowerCase();
            if (fileName.includes(searchTerm)) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        }
    });
    
    // Function to fetch PDF list from the pdfs directory
    function fetchPDFList() {
        // This function won't directly work with GitHub Pages due to its static nature.
        // The solution is to maintain a JSON file listing all PDFs or generate the list at build time.
        
        // GitHub Pages implementation: Load the PDF list from a pre-generated JSON file
        fetch('pdf-list.json')
            .then(response => response.json())
            .then(data => {
                renderPDFList(data);
            })
            .catch(error => {
                console.error('Error loading PDF list:', error);
                // If there's an error loading the JSON, show a fallback message
                pdfList.innerHTML = `<li class="error">Error loading PDF list. Please check the console for details.</li>`;
            });
    }
    
    // Function to render the PDF list
    function renderPDFList(pdfFiles) {
        pdfList.innerHTML = '';
        
        if (pdfFiles.length === 0) {
            pdfList.innerHTML = '<li class="empty">No PDF files found</li>';
            return;
        }
        
        // Sort PDF files alphabetically
        pdfFiles.sort();
        
        pdfFiles.forEach(file => {
            // Create list item
            const listItem = document.createElement('li');
            
            // Get file name without extension for display
            const displayName = file.replace('.pdf', '');
            
            // Set content and attributes
            listItem.textContent = displayName;
            listItem.dataset.filename = file;
            
            // Add click event
            listItem.addEventListener('click', function() {
                // Update active state
                const activeItems = pdfList.getElementsByClassName('active');
                for (let item of activeItems) {
                    item.classList.remove('active');
                }
                this.classList.add('active');
                
                // Load PDF
                loadPDF(this.dataset.filename);
            });
            
            // Add to list
            pdfList.appendChild(listItem);
        });
    }
    
    // Function to load a PDF into the viewer
    function loadPDF(filename) {
        // Hide the no selection message
        noSelection.style.display = 'none';
        
        // Show the PDF viewer
        pdfViewer.style.display = 'block';
        
        // Set the PDF source
        const pdfUrl = pdfFolderPath + filename;
        pdfViewer.src = pdfUrl;
    }
});
