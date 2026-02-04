from playwright.sync_api import sync_playwright, expect
import time
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        try:
            # 1. Verify Public Site
            print("Navigating to home...")
            page.goto("http://localhost:3000")
            # Wait a bit for potential hydration
            time.sleep(5)
            page.screenshot(path="verification/home.png")
            print("Home screenshot taken.")

            # 2. Verify Admin Login
            print("Navigating to admin login...")
            page.goto("http://localhost:3000/admin/login")
            page.wait_for_selector("text=Acesso Administrativo")
            page.screenshot(path="verification/login.png")
            print("Login screenshot taken.")

            # 3. Attempt Login
            print("Attempting login...")
            page.fill("input[id=email]", "ygorchaves7@gmail.com")
            page.fill("input[id=password]", "mudar123")
            page.click("button[type=submit]")

            # Wait for navigation
            try:
                # Expect dashboard
                page.wait_for_url("**/admin", timeout=10000)
                print("Login successful! Taking dashboard screenshot...")
                # Wait for sidebar
                page.wait_for_selector("text=Dashboard")
                time.sleep(2)
                page.screenshot(path="verification/dashboard.png")
            except Exception as e:
                print(f"Login failed or timed out: {e}")
                page.screenshot(path="verification/login_attempt_fail.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    if not os.path.exists("verification"):
        os.makedirs("verification")
    run()
