from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
import time

driver = webdriver.Chrome()
driver.maximize_window()

driver.get("file:///C:/Users/saisri/Downloads/registration_system/index.html")
time.sleep(2)

# 1. Try submitting with everything empty
driver.find_element(By.ID, "submitBtn").click()
time.sleep(1)

# 2. Enter invalid email
driver.find_element(By.ID, "email").send_keys("wrongemail@@")
time.sleep(1)

# 3. Enter invalid phone number
driver.find_element(By.ID, "phone").send_keys("12345")
time.sleep(1)

# 4. Short password
driver.find_element(By.ID, "password").send_keys("123")
driver.find_element(By.ID, "confirmPassword").send_keys("999")
time.sleep(1)

# 5. Try selecting state without country
try:
    Select(driver.find_element(By.ID, "state")).select_by_index(1)
except:
    print("State cannot be selected without choosing Country (GOOD).")

# 6. Try submitting again
driver.find_element(By.ID, "submitBtn").click()
time.sleep(2)

# 7. Capture screenshot
driver.save_screenshot("error-advanced.png")
print("Advanced Negative Test: error-state.png saved")

driver.quit()
