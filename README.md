# Mapping_Heterotopia

Hosting works out of the box.
Running on local pc requires a http server to be able to fetch .glb files

Some models could be too big to load on browsers on phone

Add objects by editing heatLayer.js or modelLayer.js# Mapping_Heterotopia

**Mapping_Heterotopia** is a project created for the elective *Creative Makers* at KU Leuven. It is designed for hosting immersive models and experiences with ease.

---

## Features

- **Hosting**: Functions immediately upon deployment to a web server, no additional setup required.
- **Local Deployment**: Easily run on a local machine by setting up an HTTP server to fetch `.glb` files.
- **Cross-Device Compatibility**: Optimized for browsers, though some larger models may not load efficiently on mobile devices.

---

## Usage Guide

### Hosting Online
- Deploy the project on any web server to immediately host your models and layers.

### Running Locally
- Ensure you have an HTTP server set up to fetch `.glb` files. You can easily set this up using Node.js and npm.

---

## Setting Up an HTTP Server Locally

1. **Prerequisites**:
   - Ensure Node.js and npm are installed on your system. Verify using:
     ```bash
     node -v
     npm -v
     ```
   - If not installed, download and install Node.js from [Node.js official website](https://nodejs.org).

2. **Install Dependencies**:
   - Navigate to the project directory:
     ```bash
     cd /path/to/project
     ```
   - Install the necessary dependencies using:
     ```bash
     npm install
     ```

3. **Run the HTTP Server**:
   - Start the HTTP server by running:
     ```bash
     npm start
     ```
     
---

## Adding Objects

To add new objects to the project, edit the following files:
- **`heatLayer.js`**: For heatmap-related objects or effects.
- **`modelLayer.js`**: For 3D models or other visual elements.

---

## Notes

- **Model Size**: Be cautious of model sizes when targeting mobile devices. Large `.glb` files may exceed the performance limits of mobile browsers.
