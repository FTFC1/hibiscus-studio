# HB Studio Booking System — Structured Data

## flow definitions

### event-type-first funnel

```yaml
flow_name: event-type-first-funnel
file: event-type-funnel.html
status: live

steps:
  - id: 1
    title: "What are you celebrating?"
    type: selection
    options:
      - bridal-shower
      - baby-shower
      - birthday-milestone
      - birthday-casual
      - corporate
      - other
    tracking: funnel-event-type

  - id: 2
    title: "How many guests are you expecting?"
    type: number_input
    validation:
      min: 1
      max: 50
      warning_range: [40, 50]
      warning_message: "For 40-50 guests, we have flexible options."
    tracking: funnel-step

  - id: 3
    title: "When is your event?"
    type: date_picker
    validation:
      min_date: today
    optional_fields:
      - flexible_date: checkbox
    tracking: funnel-date-selected

  - id: 4
    title: "Package Recommendation"
    type: display
    logic: recommendation_engine
    tracking: funnel-recommendation-shown
    cta:
      primary: "Book This Package"
      tracking: funnel-book-clicked
      action: open_acuity_modal
```

### category-based booking

```yaml
flow_name: category-based-booking
file: index.html
status: live

steps:
  - id: 1
    title: "Category Selection"
    type: progressive_disclosure
    categories:
      - studio-viewing
      - event-hire
      - workshops-content
      - proposal-packages
    tracking: selected-category

  - id: 2
    title: "Package Selection"
    type: card_grid
    packages: dynamic_by_category

  - id: 3
    title: "Booking Modal"
    type: iframe_modal
    sources:
      - acuity_scheduling
      - tally_forms
    tracking: clicked-book-now
```

## recommendation engine

```yaml
recommendation_engine:

  bridal-shower:
    - guest_range: [1, 35]
      recommend: half-day-6hrs
      price: 465
      reasoning: "8 of 12 bridal showers chose this"
      social_proof: true

    - guest_range: [36, 50]
      recommend: 8hrs-flexi
      price: 645
      reasoning: "Larger events need more setup time"

  baby-shower:
    - guest_range: [1, 30]
      recommend: half-day-6hrs
      price: 465
      reasoning: "Pattern from booking data"

    - guest_range: [31, 50]
      recommend: 8hrs-flexi
      price: 645
      reasoning: "More guests = more time needed"

  birthday-milestone:
    - guest_range: [1, 50]
      recommend: half-day-6hrs
      price: 465
      reasoning: "Standard for milestone birthdays"

  birthday-casual:
    - guest_range: [1, 50]
      recommend: 4hrs-flexi
      price: 345
      reasoning: "Casual celebrations need less time"

  workshop:
    - guest_range: [1, 20]
      recommend: half-day-6hrs
      price: 465
      reasoning: "Workshop standard duration"

    - guest_range: [21, 50]
      recommend: full-day
      price: 885
      reasoning: "Larger groups need breaks and setup"

  content:
    - guest_range: [1, 5]
      recommend: half-day-6hrs
      price: 465
      reasoning: "Content shoot standard"

  corporate:
    - guest_range: [1, 50]
      recommend: full-day
      price: 885
      reasoning: "Corporate events expect full-day access"

  default:
    - guest_range: [1, 50]
      recommend: half-day-6hrs
      price: 465
      reasoning: "Most popular option"

alternatives_shown:
  - package: 4hrs-flexi
    price: 345
    warning: "Often not enough for events with 20+ guests"

  - package: 8hrs-flexi
    price: 645
    note: "Flexible timing option"

  - package: full-day
    price: 885
    note: "Great if you need morning setup time"
```

## packages catalog

```yaml
packages:

  event-hire:
    - id: 4hrs-flexi
      name: "4hrs Flexi"
      duration_hours: 4
      price_gbp: 345
      acuity_appointment_id: 80372609

    - id: half-day-6hrs
      name: "Half-Day Package"
      duration_hours: 6
      price_gbp: 465
      acuity_appointment_type: 79362536
      popular: true

    - id: 8hrs-flexi
      name: "8hrs Flexi"
      duration_hours: 8
      price_gbp: 645
      acuity_appointment_type: 80372722

    - id: full-day
      name: "Full-Day"
      duration_hours: 12
      time_range: "10am-10pm"
      price_gbp: 885
      acuity_appointment_id: 79453733

  workshops-content:
    - id: studio-viewing
      name: "Studio Viewing"
      duration_minutes: 20
      price_gbp: 0
      booking_method: acuity_direct

    - id: hourly-content
      name: "Hourly Content (1hr)"
      duration_hours: 1
      price_gbp: 90

    - id: half-day-workshop
      name: "Half-Day Workshop"
      duration_hours: 6
      price_gbp: 465

    - id: full-day-workshop
      name: "Full-Day Workshop"
      duration_hours: 12
      price_gbp: 645

  proposal-packages:
    - id: heart-package
      name: "Heart Package"
      price_gbp: 1700
      original_price_gbp: 2100
      savings_gbp: 400
      booking_method: tally_form

    - id: white-whimsical
      name: "White Whimsical Package"
      price_gbp: 770
      original_price_gbp: 950
      savings_gbp: 180
      booking_method: tally_form
```

## forms schema

```yaml
forms:

  tally_proposal_form:
    platform: tally
    trigger: user_clicks_contact_button

    fields:
      - id: package_selection
        type: dropdown
        label: "Which package are you interested in? ❤️🤍"
        options:
          - "❤️ Heart Package – £1,700 (Was: £2,100 ✅ Save £400)"
          - "🤍 White Whimsical Package – £770 (Was: £950 ✅ Save £180)"
        required: true

      - id: full_name
        type: text
        label: "Full Name"
        placeholder: "e.g., John Smith"
        required: true

      - id: email
        type: email
        label: "Email Address"
        placeholder: "e.g., john.smith@email.com"
        required: true
        validation: email_format

      - id: phone
        type: tel
        label: "Phone Number"
        placeholder: "e.g., 07123 456789"
        required: true

      - id: preferred_date
        type: date
        label: "Preferred Date (optional)"
        format: "DD/MM/YYYY"
        validation:
          no_past_dates: true
        required: false

      - id: additional_details
        type: textarea
        label: "Any additional details? (optional)"
        placeholder: "Tell us about your special moment, colour preferences, or any specific requests..."
        required: false

    success_message:
      title: "✨ Thank you for your enquiry!"
      body: |
        We've received your Proposal Package enquiry and we're excited to help make your moment special! ❤️

        📧 You'll receive a response within 48 hours
        📞 We'll contact you at the number you provided

        Feel free to email us at hibiscusstudiouk@gmail.com if you have any questions.

        💍 Can't wait to create magic with you!

    notifications:
      - type: email
        recipient: hibiscusstudiouk@gmail.com
        subject: "💍 New Proposal Package Enquiry - {{Full Name}}"
        trigger: form_submission
        timing: immediate

  event_type_funnel_form:
    platform: custom_javascript

    state_management:
      - event_type: string
      - event_type_label: string
      - guest_count: integer
      - event_date: date
      - flexible: boolean

    validation:
      guest_count:
        min: 1
        max: 50
        warning_threshold: [40, 50]
      event_date:
        min_date: today
```

## email triggers

```yaml
email_system:

  booking_confirmation:
    trigger: acuity_booking_complete
    sender: acuity_scheduling
    recipient: customer
    timing: immediate
    contains:
      - booking_date
      - booking_time
      - package_details
      - studio_address
      - next_steps

  invoice_deposit:
    trigger: manual
    sender: studio_owner
    recipient: customer
    timing: within_48_hours_of_booking
    amount: 50_percent_deposit
    validity: 48_hours
    consequences: auto_cancel_if_unpaid

  proposal_inquiry_notification:
    trigger: tally_form_submission
    sender: tally_platform
    recipient: hibiscusstudiouk@gmail.com
    timing: immediate
    subject_template: "💍 New Proposal Package Enquiry - {{Full Name}}"
    body_template: |
      Package: {{package_selection}}
      Name: {{full_name}}
      Email: {{email}}
      Phone: {{phone}}
      Preferred Date: {{preferred_date}}
      Details: {{additional_details}}

      Respond within 48 hours! ⏰

  proposal_auto_reply:
    trigger: tally_form_submission
    sender: tally_platform
    recipient: customer
    timing: immediate
    message: "We'll respond within 48 hours"

  deposit_refund_confirmation:
    trigger: manual
    sender: studio_owner
    recipient: customer
    timing: 1_to_3_days_post_event
    amount: damages_deposit_200_gbp
```

## analytics events

```yaml
analytics:
  platform: umami

  event_type_funnel:
    - event: funnel-page-loaded
      data: null

    - event: funnel-event-type
      data:
        event_type: string

    - event: funnel-step
      data:
        step_number: integer

    - event: funnel-back
      data:
        from_step: integer

    - event: funnel-date-selected
      data:
        event_type: string
        guest_count: integer

    - event: funnel-recommendation-shown
      data:
        event_type: string
        guest_count: integer
        recommended_package: string

    - event: funnel-book-clicked
      data:
        event_type: string
        guest_count: integer
        was_recommended: boolean
        acuity_url: string

  main_site:
    - event: selected-category
      data:
        category: string

    - event: scrolled-to-booking
      data: null

    - event: clicked-book-now
      data:
        acuity_url: string
```

## terms and conditions

```yaml
terms:

  payment:
    deposit_percentage: 50
    invoice_timing: within_48_hours_of_booking
    payment_window: 48_hours_from_invoice
    consequences_unpaid: auto_release_booking
    damages_deposit: 200_gbp
    damages_deposit_refund_timing: 1_to_3_days_post_event

  cancellation_policy:
    - timeframe: 30_plus_days
      refund_percentage: 100
      reschedule: free

    - timeframe: 15_to_30_days
      refund_percentage: 50
      reschedule: one_free

    - timeframe: 7_to_14_days
      refund_percentage: 0
      reschedule: 25_gbp_fee

    - timeframe: less_than_7_days
      refund_percentage: 0
      reschedule: not_permitted
      deposit_status: forfeited

    - timeframe: no_show_same_day
      charge: full_booking_amount

  studio_rules:
    included:
      - "40 limewash Chiavari chairs"
      - "10 trestle tables (6ft x 2ft)"
      - "Full kitchen (fridge, oven, 5-hob stove, microwave, dishwasher)"
      - "High-speed Wi-Fi"

    restrictions:
      - "No moving furniture without permission"
      - "No smoking or illegal substances"
      - "Space must be left as found"
      - "Music allowed until 10:00 PM"

    fees:
      rubbish_left_behind: 50_gbp
      late_fee_per_30_min: 50_gbp
      grace_period_minutes: 30

  capacity:
    maximum_guests: 50
    seated_comfortably: 25
```

## technical architecture

```yaml
technical_stack:

  frontend:
    framework: vanilla_javascript
    styling: tailwind_css
    deployment: github_pages
    domain: hibiscusstudio.co.uk

  external_services:
    scheduling:
      platform: acuity_scheduling
      integration: iframe_embed
      payment_handling: external

    forms:
      platform: tally
      integration: iframe_embed_or_popup
      use_case: proposal_packages

    analytics:
      platform: umami
      deployment: self_hosted
      tracking_method: javascript_events

    social:
      link_aggregator: linktree

  booking_modal:
    technology: vanilla_javascript
    features:
      - loading_spinner
      - iframe_lazy_load
      - escape_key_close
      - click_outside_close

  state_management:
    method: javascript_objects
    storage: none_persistent
    reset_on: page_reload
```

## file structure

```yaml
file_map:
  live_deployment: /2_Areas/01-Hibiscus-Studio/hibiscus-studio-deploy/

  files:
    - path: index.html
      purpose: main_landing_page
      flow: category_based_booking
      status: live

    - path: event-type-funnel.html
      purpose: recommendation_engine
      flow: event_type_first
      status: live

    - path: booking-demo.html
      purpose: prototype_wizard
      flow: multi_step_demo
      status: demo_only

    - path: TALLY_FORM_SETUP.md
      purpose: proposal_package_form_setup_guide
      status: documentation

  directories:
    - path: assets/
      contains: images_icons_media

    - path: backend/
      contains: chatbot_on_render
      status: optional
```

## pain points & opportunities

```yaml
identified_issues:
  - issue: manual_invoice_generation
    impact: high
    effort_to_fix: medium
    solution: integrate_automated_payment_gateway

  - issue: no_acuity_abandonment_tracking
    impact: medium
    effort_to_fix: high
    solution: replace_acuity_with_custom_booking

  - issue: dm_inquiry_black_hole
    impact: medium
    effort_to_fix: none
    solution: educate_users_to_click_link

  - issue: underbooked_4hr_packages
    impact: medium
    effort_to_fix: low
    solution: already_solved_with_recommendation_engine

  - issue: no_terms_standalone_page
    impact: low
    effort_to_fix: low
    solution: create_terms_page

opportunities:
  - opportunity: automate_50_percent_deposit
    priority: high
    tools: whop_or_stripe

  - opportunity: abandoned_booking_recovery
    priority: medium
    tools: email_automation

  - opportunity: ab_test_recommendation_messaging
    priority: medium
    tools: umami_ab_testing

  - opportunity: mobile_sticky_cta
    priority: low
    tools: css_javascript
```

---

**data source:** live code extraction from hibiscus-studio-deploy/
**extraction date:** 2026-01-28
**format:** yaml-structured for machine parsing
