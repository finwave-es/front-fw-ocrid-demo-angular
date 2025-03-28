# OCR ID Integration Angular

This project demonstrates how to integrate the `fw-ocrid` library into an Angular application to perform real-time OCR document scanning using a camera.

## 📌 Objectives

- Integrate `fw-ocrid` with Angular.
- Create a modern and functional user interface.
- Capture, process, and display OCR scan results.

## 🚀 Technologies Used

- Angular Standalone Components
- TypeScript
- fw-ocrid SDK
- HTML5 / CSS3

## ✅ Component Flow

1. Credentials Input

The user must enter their API Key and Regula License:
- These values are validated and OcrId is correctly instantiated.

2. OCR Activation

Once the credentials are applied:
- The user can start the OCR scan.
- The camera feed is displayed in real-time within a `<div #container>`.

3. Result Processing

Events are captured and displayed:
- `USER_FEEDBACK:` provides visual guidance to the user
- `RESULT:` successful scan
- `ERROR:` errors during the process


## 🧪 How to Run

1. Clone the project 

2. Install dependencies:

```bash
npm install
```

3. Run the project:

```bash
ng serve
```

4. Open in your browser:

`http://localhost:4200`

## Author

Feel free to contact us with any questions at: `soporte.onboarding@finwave.es`