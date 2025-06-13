# 🔹 Gmail Search Strategy for Financial Data

## Investigation Results Summary


### January 2025
- **Total emails searched:** 385
- **Potential transactions found:** 10

**Search effectiveness:**
- `invoice OR billing OR receipt OR payment OR charged`: 50 emails
- `subscription OR recurring OR monthly`: 50 emails
- `from:apple OR from:netflix OR from:spotify OR from:openai`: 33 emails
- `from:paypal OR from:stripe OR from:lemonsqueezy`: 17 emails
- `from:opay OR from:providus OR from:zenith OR from:hsbc`: 11 emails
- `transfer OR bank OR statement`: 50 emails
- `app store OR play store`: 50 emails
- `claude OR replit OR github`: 50 emails
- `tinder OR dating`: 24 emails
- `uber OR bolt OR transport`: 50 emails


**Sample transactions found:**
- "OpenAI o1 and o3-mini API access" from "Nikunj Handa, OpenAI" <noreply@email.op
- "Subscription Confirmation" from Apple <no_reply@email.apple.com>
- "Your Subscription is Expiring" from Apple <no_reply@email.apple.com>



### February 2025
- **Total emails searched:** 268
- **Potential transactions found:** 11

**Search effectiveness:**
- `invoice OR billing OR receipt OR payment OR charged`: 50 emails
- `subscription OR recurring OR monthly`: 50 emails
- `from:apple OR from:netflix OR from:spotify OR from:openai`: 24 emails
- `from:paypal OR from:stripe OR from:lemonsqueezy`: 31 emails
- `from:opay OR from:providus OR from:zenith OR from:hsbc`: 13 emails
- `transfer OR bank OR statement`: 50 emails
- `app store OR play store`: 50 emails


**Sample transactions found:**
- "US$15.00 payment to Exafunction, Inc. was unsuccessful again" from "Exafunction, Inc." <failed-payments+acc
- "GPT-4.5 research preview" from "Nikunj Handa, OpenAI" <noreply@email.op
- "Your invoice from Apple." from Apple <no_reply@email.apple.com>



### March 2025
- **Total emails searched:** 249
- **Potential transactions found:** 13

**Search effectiveness:**
- `invoice OR billing OR receipt OR payment OR charged`: 50 emails
- `subscription OR recurring OR monthly`: 50 emails
- `from:apple OR from:netflix OR from:spotify OR from:openai`: 29 emails
- `from:paypal OR from:stripe OR from:lemonsqueezy`: 20 emails
- `from:opay OR from:providus OR from:zenith OR from:hsbc`: 50 emails
- `transfer OR bank OR statement`: 50 emails


**Sample transactions found:**
- "Your receipt from Vercel Inc. #2724-3058" from "Vercel Inc." <invoice+statements@vercel
- "🌟You deserve an easy life!" from OPay <no-reply@opay-nigeria.com>
- "Billing Problem" from Apple <no_reply@email.apple.com>



### April 2025 (deeper)
- **Total emails searched:** 444
- **Potential transactions found:** 14

**Search effectiveness:**
- `invoice OR billing OR receipt OR payment OR charged`: 50 emails
- `subscription OR recurring OR monthly`: 50 emails
- `from:apple OR from:netflix OR from:spotify OR from:openai`: 49 emails
- `from:paypal OR from:stripe OR from:lemonsqueezy`: 45 emails
- `from:opay OR from:providus OR from:zenith OR from:hsbc`: 50 emails
- `transfer OR bank OR statement`: 50 emails
- `app store OR play store`: 50 emails
- `claude OR replit OR github OR supabase`: 50 emails
- `wispr OR ai OR tool`: 50 emails


**Sample transactions found:**
- "Transfer Successful" from OPay <no-reply@opay-nigeria.com>
- "[Task Update] Time to load AI workout advice" from OpenAI <noreply@tm.openai.com>
- "Your invoice from Apple." from Apple <no_reply@email.apple.com>



## Recommended Search Queries

Based on investigation results, use these queries for comprehensive financial email discovery:

### Core Financial Terms
```
invoice OR billing OR receipt OR payment OR charged
subscription OR recurring OR monthly
transfer OR bank OR statement
```

### Service Providers (use from: syntax)
```
from:apple OR from:netflix OR from:spotify OR from:openai
from:paypal OR from:stripe OR from:lemonsqueezy
from:opay OR from:providus OR from:zenith OR from:hsbc
from:claude OR from:replit OR from:github OR from:supabase
```

### App Stores & Digital Services
```
app store OR play store
wispr OR ai OR tool
```

### Date Range Usage
For monthly analysis, always include date ranges:
```
{search_term} after:2025/01/01 before:2025/02/01
```

## Implementation Notes

1. **Use from: syntax** for service providers to avoid false matches
2. **Combine multiple search terms** with OR for broader coverage  
3. **Include date ranges** for monthly analysis
4. **Rate limit** API calls (300ms between requests)
5. **Sample multiple emails** from each search to verify relevance

## Next Steps

1. Update LocalFinancialAnalyser with improved search queries
2. Add date range filtering for historical analysis
3. Implement better transaction detection patterns
4. Add support for Nigerian financial services
