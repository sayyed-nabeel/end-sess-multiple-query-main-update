from flask import Flask, request, jsonify, render_template
import requests

app = Flask(__name__)

EYQ_INCUBATOR_ENDPOINT = ""  # Add your endpoint URL here
EYQ_INCUBATOR_API_KEY = ""  # Add your API key here

def upload_document(file):
    url = f"{EYQ_INCUBATOR_ENDPOINT}/data/upload"
    headers = {"api-key": EYQ_INCUBATOR_API_KEY}
    files = {"file": file}
    response = requests.post(url, headers=headers, files=files)
    return response

def get_documents():
    url = f"{EYQ_INCUBATOR_ENDPOINT}/data/files"
    headers = {"api-key": EYQ_INCUBATOR_API_KEY}
    response = requests.get(url, headers=headers)
    return response

def chat_completions(model, prompt):
    url = f"{EYQ_INCUBATOR_ENDPOINT}/data/openai/deployments/{model}/chat/completions"
    headers = {"api-key": EYQ_INCUBATOR_API_KEY}
    body = {"messages": [{"role": "user", "content": prompt}]}
    response = requests.post(url, headers=headers, json=body)
    return response

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    response = upload_document(file)
    return jsonify(response.json()), response.status_code

@app.route('/documents', methods=['GET'])
def documents():
    response = get_documents()
    return jsonify(response.json()), response.status_code

@app.route('/query', methods=['POST'])
def query():
    data = request.json
    model = data.get('model')
    prompt = data.get('prompt')
    response = chat_completions(model, prompt)
    return jsonify(response.json()), response.status_code

if __name__ == '__main__':
    app.run(debug=True)
