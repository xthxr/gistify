# Gistify

Gistify is a web application that summarizes content from a given URL  using the Gemini API and displays the summary along with relevant statistics.

## Project Structure

The project is divided into two main 
parts:

- `backend/`: Contains the Python 
Flask application that handles fetching 
content, calling the Gemini API for 
summarization, and serving the API 
endpoints.
- `frontend/`: Contains the React 
application built with Vite that 
provides the user interface for 
inputting URLs and displaying the 
summarization results.

### Prerequisites

Before you begin, ensure you have the 
following installed:

-   Python 3.7+
-   Node.js (LTS version recommended)
-   npm or yarn
-   Git

## Setup and Running

Follow these steps to set up and run the Gistify application locally.

### 1. Clone the Repository

If you haven't already, clone the 
project repository:

```bash
git clone https://github.com/xthxr/gistify.git
cd gistify
```


### 2. Backend Setup
Navigate to the backend directory:

```
cd backend
```
Create a Virtual Environment

It's recommended to use a virtual environment to manage dependencies:

```
python -m venv venv
``` 
Activate the Virtual Environment
- On Windows:
  
  ```
  .\venv\Scripts\activate
  ```
- On macOS and Linux:
  
  ```
  source venv/bin/activate
  ``` 
## Install Dependencies

Install the required Python packages:

```
pip install -r requirements.txt
```
Set up Environment Variables

Create a .env file in the backend/ directory with your Gemini API key:

```
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```
Replace YOUR_GEMINI_API_KEY with your actual API key obtained from the Google AI Studio or Google Cloud.

### 3. Running the Backend
Make sure your virtual environment is activated and you are in the backend/ directory. Then run the Flask application:

```
python app.py
```
The backend server should start and run on http://192.168.something.something:5000/ or a similar address.

### 4. Frontend Setup
Open a new terminal window or tab and navigate to the frontend directory:

```
cd ..
cd frontend
```
### Install Dependencies

Install the required Node.js packages using npm or yarn:

```
npm install
# or
yarn install
```
### Set up Environment Variables

Create a .env file in the frontend/ directory to specify the backend API URL:

```
VITE_BACKEND_API_URL=http://
localhost:5000
```
### 5. Running the Frontend
Make sure you are in the frontend/ directory. Then start the development server:

```
npm run dev
# or
yarn dev
```
The frontend application should open in your browser, usually at http://localhost:5173/ or a similar address.

## Usage
1. Ensure both the backend and frontend servers are running.
2. Open the frontend application in your web browser.
3. Enter the URL of the content you want to summarize in the input field.
4. Click the "Summarize" button.
5. The summarization result, including the summary text, original length, summary length, and reduction percentage, will be displayed.
## Contributing
If you'd like to contribute, please fork the repository and create a pull request.

### CONTRIBUTORS:
- rajeet-04 (https://github.com/rajeet-04)
- xthxr (https://github.com/xthxr)
