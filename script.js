document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.getElementById('toggle-sidebar');
    const pdfList = document.getElementById('pdf-list');
    const pdfViewer = document.getElementById('pdf-viewer');
    const noSelection = document.getElementById('no-selection');
    const searchInput = document.getElementById('search');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    
    // Toggle sidebar visibility
    toggleButton.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
    });

    // Fetch the list of PDFs
    fetchPDFList();

    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const items = pdfList.getElementsByTagName('li');
        
        for (let item of items) {
            const fileName = item.textContent.toLowerCase();
            item.style.display = fileName.includes(searchTerm) ? '' : 'none';
        }
    });

    // Fullscreen functionality for PDF viewer
    fullscreenBtn.addEventListener('click', () => {
        if (pdfViewer.requestFullscreen) {
            pdfViewer.requestFullscreen();
        } else if (pdfViewer.webkitRequestFullscreen) { // Safari
            pdfViewer.webkitRequestFullscreen();
        } else if (pdfViewer.msRequestFullscreen) { // IE/Edge
            pdfViewer.msRequestFullscreen();
        }
    });

    // Function to fetch PDF list from the JSON file
    function fetchPDFList() {
        fetch('pdf-list.json')
            .then(response => response.json())
            .then(data => {
                renderPDFList(data);
            })
            .catch(error => {
                console.error('Error loading PDF list:', error);
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

        pdfFiles.forEach(file => {
            const listItem = document.createElement('li');
            listItem.textContent = file.replace('.pdf', ''); // Display name without extension

            listItem.addEventListener('click', function() {
                // Update active state
                const activeItems = pdfList.getElementsByClassName('active');
                for (let item of activeItems) {
                    item.classList.remove('active');
                }
                this.classList.add('active');

                // Load PDF into the viewer
                noSelection.style.display = 'none';
                pdfViewer.style.display = 'block';
                pdfViewer.src = `pdfs/${file}`;
            });

            pdfList.appendChild(listItem);
        });
    }
});
