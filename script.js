document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const toggleButton = document.getElementById('toggle-sidebar');
    const pdfList = document.getElementById('pdf-list');
    const pdfViewer = document.getElementById('pdf-viewer');
    const noSelection = document.getElementById('no-selection');
    const searchInput = document.getElementById('search');
    const fullscreenBtn = document.getElementById('fullscreen-pdf');
    
    // Random placeholder messages
    const noSelectionMessages = [
        "Ah, a new melody awaits—will it charm, or will it curse?",
        "Pick thy parchment, minstrel. Thy lord grows impatient.",
        "Choose wisely, for even notes may deceive.",
        "Scroll through the scrolls, and let fate pluck the strings.",
        "Another bard, another burden. What song shall you shoulder?",
        "The music sleeps for now. Wake it with thy will.",
        "The stave is set, the quill long stilled—what tale shall you resurrect?",
        "Let us see what tune stirs beneath the dust of ages.",
        "The hour is ripe for song. Choose thy weapon... in C major, perhaps.",
        "A melody lies waiting, curled like smoke in a goblet—will you uncork it?",
        "These sheets are old, but not dead. They remember how to sing.",
        "A new page, a new reckoning. What shall echo through thine chamber?",
        "One tune to rouse them, one to lull. What mood dost thou summon?",
        "The parchment hums faintly. It knows you are here."
    ];

    // Set a random message on load
    const noSelectionText = document.getElementById('no-selection-text');
    if (noSelectionText) {
        const idx = Math.floor(Math.random() * noSelectionMessages.length);
        noSelectionText.textContent = noSelectionMessages[idx];
    }

    // Toggle sidebar visibility
    toggleButton.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        // Change icon based on sidebar state
        if (sidebar.classList.contains('collapsed')) {
            toggleButton.textContent = "›"; // Indicate expand (single right angle)
            toggleButton.title = "Expand sidebar";
        } else {
            toggleButton.textContent = "‹"; // Indicate collapse (single left angle)
            toggleButton.title = "Collapse sidebar";
        }
    });

    // Set initial icon on load
    if (sidebar.classList.contains('collapsed')) {
        toggleButton.textContent = "›";
        toggleButton.title = "Expand sidebar";
    } else {
        toggleButton.textContent = "‹";
        toggleButton.title = "Collapse sidebar";
    }

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
        } else if (pdfViewer.webkitRequestFullscreen) {
            pdfViewer.webkitRequestFullscreen();
        } else if (pdfViewer.msRequestFullscreen) {
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
