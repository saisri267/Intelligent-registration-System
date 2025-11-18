# Intelligent Registration System (Optimized)

This project is a client-only registration form with smart client-side validation and Selenium automation scripts.

## What is included
- index.html — registration form
- styles.css — responsive, clean styling
- app.js — validation, dropdown cascading, password strength
- automation/
  - utils.py (helper)
  - test_negative.py
  - test_positive.py
  - test_logic.py

## How to open (no backend required)
1. Extract the ZIP.
2. Open `index.html` in your browser (double-click) or run a simple server:
   - `python -m http.server 8000` then visit `http://localhost:8000`

## Automation
1. Install Python 3 and pip.
2. `pip install selenium`
3. Download ChromeDriver matching your Chrome version and put it in PATH.
4. From `automation/` folder, run:
   - `python test_negative.py`
   - `python test_positive.py`
   - `python test_logic.py`
5. Screenshots will be created in the `automation` folder's working directory.

## Notes
- Automation uses file:// URL. If your browser blocks file access, run a local server.
- If ChromeDriver errors occur, either add its path or use `webdriver.Firefox()` with geckodriver and update utils.py.
