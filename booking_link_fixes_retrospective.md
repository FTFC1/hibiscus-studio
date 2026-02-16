# Hibiscus Studio Booking Link Fixes - a retrospective

This document summarizes the challenges and solutions related to correcting the booking links on the Hibiscus Studio website. It is intended to guide future developers and prevent similar issues.

## 1. The Problem: Mismatched Booking Links

The primary issue was a critical mismatch between the service displayed on the website and the destination booking page. Several "Book Now" buttons under the "Workshops & Content" section were configured with incorrect `onclick` attributes.

This led to a confusing user experience where a customer would click to book a specific service (e.g., "Workshop Half-Day" for £345) but would be taken to a booking page for a completely different service (e.g., "Workshop Full-Day" for £645).

The specific mismatches were:
*   **Workshop Half-Day Button:** Incorrectly linked to the **Full-Day** booking page.
*   **Content Half-Day Button:** Incorrectly linked to an unrelated **2-hour Weekend** booking page.
*   **Content Full-Day Button:** Also linked incorrectly to the **2-hour Weekend** booking page.

This created a significant risk of incorrect bookings, customer frustration, and lost revenue.

## 2. The Solution: Iterative Correction and Verification

The fix involved a careful, iterative process to identify and correct each faulty link. The workflow was as follows:

1.  **Link-by-Link Audit:** Each booking button's `onclick` attribute in `index.html` was manually checked against the service description (price, duration, and name) displayed on the button.
2.  **Cross-Referencing with Acuity:** A definitive list of correct Acuity Scheduling URLs for each appointment type was used as the source of truth.
3.  **Targeted HTML Updates:** The `onclick` attributes for the three incorrect buttons were updated with the correct Acuity appointment URLs.
4.  **Verification:** After deployment, each button was tested to ensure it opened the corresponding Acuity scheduling page with the correct service details, price, and duration.

## 3. Key Takeaway & Recommendation for Future Developers

The root cause was a lack of careful mapping between the frontend button and the backend booking service URL.

**Recommendation:** Whenever updating or adding booking options, **always double-check the mapping between the service name on the button and the destination Acuity URL.** Do not assume that similarly named services have similar URLs. Manually verify each link's destination to ensure the price, duration, and service title on the booking page match what the user clicked on the website.