let fileUploaded = false;

document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const formData = new FormData();

    if (!file) {
        document.getElementById('uploadStatus').textContent = "Please select a file.";
        return;
    }

    formData.append('file', file);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById('uploadStatus').textContent = data.error;
            document.getElementById('uploadStatus').className = "alert";
        } else {
            document.getElementById('fileName').textContent = `Uploaded File: ${data.fileName}`;
            document.getElementById('uploadStatus').textContent = "File uploaded successfully!";
            document.getElementById('uploadStatus').className = "";
            fileUploaded = true;
        }
    })
    .catch(() => {
        document.getElementById('uploadStatus').textContent = "An error occurred during the upload.";
        document.getElementById('uploadStatus').className = "alert";
    });
});

document.getElementById('chatSubmit').addEventListener('click', function(event) {
    event.preventDefault();

    if (!fileUploaded) {
        document.getElementById('queryStatus').textContent = "Please upload a file before sending a query.";
        return;
    }

    const chatInput = document.getElementById('chatInput');
    const query = chatInput.value.trim();

    if (!query) {
        document.getElementById('queryStatus').textContent = "Query cannot be empty.";
        return;
    }

    // Display the user query in chat
    const chatMessages = document.getElementById('chatMessages');
    const userMessage = document.createElement('p');
    userMessage.textContent = `User: ${query}`;
    chatMessages.appendChild(userMessage);

    fetch('/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: query })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById('queryStatus').textContent = data.error;
        } else {
            const apiMessage = document.createElement('p');
            apiMessage.textContent = `API: ${data.choices[0].message.content}`;
            chatMessages.appendChild(apiMessage);

            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;  // Scroll to bottom
            document.getElementById('queryStatus').textContent = '';
        }
    })
    .catch(() => {
        document.getElementById('queryStatus').textContent = "An error occurred while processing your query.";
    });
});

document.getElementById('endSessionForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Clear file input
    document.getElementById('fileInput').value = '';

    // Clear chat history
    document.getElementById('chatMessages').innerHTML = '';

    // Clear prompt input and upload status
    document.getElementById('chatInput').value = '';
    document.getElementById('fileName').textContent = '';
    document.getElementById('uploadStatus').textContent = '';
    document.getElementById('queryStatus').textContent = '';

    // Reset file upload flag
    fileUploaded = false;
});
