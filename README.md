# 🎂 Smart Recipe — Cake Image to Recipe Matcher

**Smart Recipe** is an AI-powered web application that recommends a matching cake recipe based on a photo uploaded by the user. The system analyzes the visible features of the cake — such as layers, frosting, fruits, chocolate, and other toppings — and matches them against an existing recipe database.

> **Note:** The system identifies only *visually visible* ingredients. Hidden components (e.g., fillings not visible from the outside) are not detected.

---

## 🚀 How It Works

1. The user uploads a photo of a cake.
2. The system identifies the visible ingredients and decorations in the image using computer vision.
3. The system cross-references the extracted features with a recipe dataset and suggests the most suitable recipe.

---

## 🧠 AI & Machine Learning

The system uses **TensorFlow** for image analysis. Several deep learning architectures were considered:

| Model | Approach |
|---|---|
| **DeepLabV3** | Semantic segmentation — identifies distinct regions (cream, layers, fruits) |
| **U-Net** | Pixel-level segmentation with skip connections for blended ingredients |
| **Mask R-CNN** | Object detection + precise boundary masks per ingredient |
| **Faster R-CNN** | Two-stage object detection with region proposals |
| **YOLO** | Fast single-pass object detection |
| **Transfer Learning** | Pre-trained models (VGG16, ResNet50, InceptionV3) fine-tuned on cake data |

---

## 🛠️ Tech Stack

- **Frontend:** Angular 19
- **AI / ML:** Python + TensorFlow
- **Communication:** HTTP / REST API
- **Dataset:** Custom cake image dataset (no traditional database)

---

## 🔮 Future Development

- 📱 Mobile app for on-the-go photo uploads
- 💬 Natural language interface: describe a cake in words and get a recipe
- 🧊 "What's in my fridge?" feature — get recipe suggestions from ingredient descriptions

---

## 🏃 Running the Project

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.9.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
