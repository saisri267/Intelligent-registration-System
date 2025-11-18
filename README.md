Here is your updated **GitHub-style README** with clean installation commands added.
Short, simple, and readable.

---

# Intelligent Registration System

A clean, responsive registration form built using HTML, CSS, and JavaScript. The system includes real-time validation, dynamic dropdown logic, password strength checking, auto-save drafts, dark mode, voice input, and a confirmation modal. It behaves like a production-level form with smart UI features and automation support.

## **Features**

Real-time validation, dynamic country–state–city dropdowns, password strength and crack-time estimation, auto-save drafts, phone auto-formatting, email reputation checks, dark mode toggle, voice input support, summary modal, progress bar, confetti animation, Selenium-based automation testing.

## **Tech Stack**

* HTML
* CSS
* JavaScript
* Selenium (Python)

## **Installation**

Clone the repository:

```
git clone https://github.com/saisri267/Intelligent-registration-System.git
```

Navigate into the project directory:

```
cd Intelligent-registration-System
```

## **Running the Project**

Open the form in any browser:

```
index.html
```

## **Automation Setup**

Install required Python packages:

```
pip install selenium
```

If you use a virtual environment:

```
python -m venv venv
venv\Scripts\activate
pip install selenium
```

Make sure ChromeDriver is installed and added to PATH:

```
chromedriver --version
```

To run any test script:

```
cd automation
python test_positive.py
python test_negative.py
python test_logic.py
```

## **Automation Scripts**

Includes automated positive, negative, and logical flow test cases. Screenshots are generated automatically during execution.
