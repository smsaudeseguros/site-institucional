from playwright.sync_api import sync_playwright, expect
import time

def verify_whatsapp_bounce():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        print("Navigating to home page...")
        page.goto("http://localhost:3001")

        # Wait for the FloatingWhatsApp button to be visible
        whatsapp_btn = page.locator("button[aria-label='Fale conosco no WhatsApp']")
        whatsapp_btn.wait_for(state="visible", timeout=10000)
        print("WhatsApp button found.")

        # Check initial state (should have animate-bounce)
        class_attr_initial = whatsapp_btn.get_attribute("class")
        print(f"Initial class: {class_attr_initial}")
        has_bounce_initial = "animate-bounce" in class_attr_initial
        print(f"Has animate-bounce initially: {has_bounce_initial}")

        # Take screenshot of initial state
        page.screenshot(path="verification/whatsapp_closed.png")

        # Click the button using JS evaluation to bypass stability checks because of the bounce animation
        print("Clicking WhatsApp button via JS...")
        whatsapp_btn.evaluate("el => el.click()")

        # Wait a moment for state update and animation removal
        time.sleep(1)

        # Check state after click (should NOT have animate-bounce)
        class_attr_open = whatsapp_btn.get_attribute("class")
        print(f"Class after click: {class_attr_open}")
        has_bounce_open = "animate-bounce" in class_attr_open
        print(f"Has animate-bounce when open: {has_bounce_open}")

        # Take screenshot of open state
        page.screenshot(path="verification/whatsapp_open.png")

        # Close popover by clicking outside via JS or page action
        print("Clicking outside to close...")
        page.mouse.click(0, 0)

        # Wait a moment for state update
        time.sleep(1)

        # Check state after close (should have animate-bounce again)
        class_attr_closed_again = whatsapp_btn.get_attribute("class")
        print(f"Class after close: {class_attr_closed_again}")
        has_bounce_closed_again = "animate-bounce" in class_attr_closed_again
        print(f"Has animate-bounce after close: {has_bounce_closed_again}")

        browser.close()

        if has_bounce_initial and not has_bounce_open and has_bounce_closed_again:
            print("SUCCESS: animate-bounce behaves correctly based on isOpen state.")
        else:
            print("FAILED: animate-bounce does not behave correctly.")

if __name__ == "__main__":
    verify_whatsapp_bounce()
