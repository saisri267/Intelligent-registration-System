# utils.py - helper utilities for Selenium automation

import os
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


# ---------------- Driver Setup ---------------- #
def new_driver(headless=False):
    """Create a Chrome WebDriver with optional headless mode."""
    opts = webdriver.ChromeOptions()
    opts.add_argument("--start-maximized")

    if headless:
        opts.add_argument("--headless=new")
        opts.add_argument("--no-sandbox")
        opts.add_argument("--disable-gpu")

    return webdriver.Chrome(options=opts)


# ---------------- Open Local HTML ---------------- #
def open_local(driver, path="index.html"):
    """Open a local HTML file inside the browser."""
    abs_path = os.path.abspath(path)
    url = "file://" + abs_path
    driver.get(url)
    time.sleep(0.8)  # small delay to let page load
    return url


# ---------------- Screenshot Helper ---------------- #
def screenshot(driver, name):
    """Save screenshot to a path. Creates folders if missing."""
    folder = os.path.dirname(name)
    if folder:
        os.makedirs(folder, exist_ok=True)
    driver.save_screenshot(name)
    print(f"[+] Screenshot saved: {name}")


# ---------------- Highlight Element ---------------- #
def highlight(driver, element, duration=0.3):
    """Highlight an element for debugging visual clarity."""
    driver.execute_script("arguments[0].style.border='3px solid red'", element)
    time.sleep(duration)
    driver.execute_script("arguments[0].style.border=''", element)


# ---------------- Wait for Element ---------------- #
def wait_for(driver, by, value, timeout=8):
    """Wait until an element becomes visible."""
    return WebDriverWait(driver, timeout).until(
        EC.visibility_of_element_located((by, value))
    )


# ---------------- Safe Click Helper ---------------- #
def safe_click(driver, element):
    """Scroll element into view and click it safely."""
    driver.execute_script("arguments[0].scrollIntoView(true);", element)
    time.sleep(0.2)
    element.click()
