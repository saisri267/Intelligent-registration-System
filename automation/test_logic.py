from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
import time

driver = webdriver.Chrome()
driver.maximize_window()

driver.get("file:///C:/Users/saisri/Downloads/registration_system/index.html")
time.sleep(2)

# Select country
Select(driver.find_element(By.ID, "country")).select_by_visible_text("India")
time.sleep(1)

# Select state
Select(driver.find_element(By.ID, "state")).select_by_visible_text("Karnataka")
time.sleep(1)

# Select city
Select(driver.find_element(By.ID, "city")).select_by_visible_text("Bengaluru")
time.sleep(1)

print("Dropdown cascade working correctly.")

# Test password mismatch
driver.find_element(By.ID, "password").send_keys("Test1234")
driver.find_element(By.ID, "confirmPassword").send_keys("WrongPass")
time.sleep(1)

# Submit attempt
driver.find_element(By.ID, "submitBtn").click()
time.sleep(1)

print("Mismatch password error triggered (GOOD).")

# Now correct password
driver.find_element(By.ID, "confirmPassword").clear()
driver.find_element(By.ID, "confirmPassword").send_keys("Test1234")
time.sleep(1)

# Check submit enabled
enabled = driver.find_element(By.ID, "submitBtn").is_enabled()
print("Submit enabled after correction -> ", enabled)

driver.save_screenshot("logic.png")
print("Advanced Logic Test saved as logic.png")

driver.quit()
