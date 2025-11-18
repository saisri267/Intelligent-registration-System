# test_positive.py - FINAL cleaned & corrected version
from utils import new_driver, open_local, screenshot
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
import time

# Launch browser
driver = new_driver()
open_local(driver, "../index.html")

print("Title:", driver.title)

# ---------------- FILL FORM ---------------- #
driver.find_element(By.ID, "firstName").send_keys("Sai")
driver.find_element(By.ID, "lastName").send_keys("Sri")
driver.find_element(By.ID, "email").send_keys("sai.sri@example.com")
driver.find_element(By.ID, "phone").send_keys("+911234567890")
driver.find_element(By.CSS_SELECTOR, "input[name='gender'][value='Male']").click()

# Select Country → State → City
Select(driver.find_element(By.ID, "country")).select_by_visible_text("India")
time.sleep(0.5)

Select(driver.find_element(By.ID, "state")).select_by_visible_text("Telangana")
time.sleep(0.5)

Select(driver.find_element(By.ID, "city")).select_by_visible_text("Hyderabad")
time.sleep(0.5)

# Passwords
driver.find_element(By.ID, "password").send_keys("StrongPass@123")
driver.find_element(By.ID, "confirmPassword").send_keys("StrongPass@123")

# Terms checkbox
driver.find_element(By.ID, "terms").click()
time.sleep(0.4)

# Check if submit button enabled
submit_state = driver.find_element(By.ID, "submitBtn").is_enabled()
print("Submit enabled? ->", submit_state)

# Submit the form
driver.find_element(By.ID, "submitBtn").click()
time.sleep(1.2)

# ---------------- VALIDATION ---------------- #
success_text = driver.find_element(By.ID, "formMessage").text
print("Success Message:", success_text)

# Save screenshot
screenshot(driver, "screenshots/success-positive.png")
print("Saved screenshot: success-positive.png")

# Close browser LAST
driver.quit()
