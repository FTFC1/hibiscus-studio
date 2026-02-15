export const missionList = [
  { id: 'mission-1', number: 1, title: 'The 5-30-60 Rule', description: 'Acknowledge in 5 seconds, approach in 30, engage by 60. No customer browses alone.', readTime: '5 min', status: 'completed' },
  { id: 'mission-2', number: 2, title: 'Kill "Can I Help You?"', description: '5 warm openings that invite conversation instead of getting shut down.', readTime: '6 min', status: 'completed' },
  { id: 'mission-3', number: 3, title: 'The 70/30 Rule', description: 'Let the customer talk 70%, you talk 30%. Master the art of listening.', readTime: '2 min', status: 'completed' },
  { id: 'mission-4', number: 4, title: '"I\'ll Think About It"', description: 'Handle the most common objection without being pushy — and know when to let go.', readTime: '7 min', status: 'current' },
  { id: 'mission-5', number: 5, title: '"It\'s Too Expensive"', description: 'Handle price objections without discounting. Premium pricing is a sales tool.', readTime: '8 min', status: 'locked' },
  { id: 'mission-6', number: 6, title: 'Exit Protocol', description: 'Capture info from non-buyers so today\'s browser becomes tomorrow\'s buyer.', readTime: '6 min', status: 'locked' },
]

export const missions = {
  'mission-1': {
    number: 1,
    totalMissions: 6,
    title: 'The 5-30-60 Rule',
    readTime: '5 min',
    slides: [
      {
        type: 'text',
        icon: 'ri-alarm-warning-line',
        title: 'The Problem',
        scenario: [
          { icon: 'ri-walk-line', label: 'Customer enters', tone: 'scenario-neutral' },
          { icon: 'ri-smartphone-line', label: 'Staff on phone', tone: 'scenario-warn' },
          { icon: 'ri-time-line', label: '3 minutes pass', tone: 'scenario-warn' },
          { icon: 'ri-door-open-line', label: 'They leave', tone: 'scenario-bad' }
        ],
        body: "They picked up a shoe, looked at the price, put it back. You didn't even get a chance to help.",
        highlight: "That's \u20A615.6 million/year walking out the door."
      },
      {
        type: 'rule',
        icon: 'ri-timer-flash-line',
        title: 'The 5-30-60 Rule',
        stats: [
          { value: '5s', label: 'Acknowledge' },
          { value: '30s', label: 'Approach' },
          { value: '60s', label: 'Engage' }
        ],
        body: "Every customer gets acknowledged in 5, approached in 30, engaged by 60. No exceptions."
      },
      {
        type: 'toolkit',
        icon: 'ri-chat-smile-3-line',
        title: '4 Warm Openers',
        items: [
          '"Hey! Welcome. I\'m [Name]. What brings you in today?"',
          '"I love those shoes\u2014looking for something similar or different?"',
          '"Are you shopping for yourself or a gift?"',
          '"That\'s one of our most popular\u2014want to try it on?"'
        ],
        footnote: 'Open questions invite conversation. Not "Can I help you?"'
      },
      {
        type: 'comparison',
        icon: 'ri-arrow-left-right-line',
        title: 'Spot the Difference',
        dont: 'Customer walks in. Staff on phone. 3 minutes pass. Customer leaves. Zero interaction.',
        do: 'Eye contact in 5 seconds. "What brings you in?" at 30 seconds. Now you\'re helping them find what they need.'
      },
      {
        type: 'practice',
        icon: 'ri-focus-3-line',
        title: 'Try This Today',
        items: [
          'Count to 5 every time a customer walks in \u2014 eye contact before you hit 5',
          'Set a 60-second mental timer \u2014 approach if you haven\'t yet',
          'Kill "Can I help you?" \u2014 try "What brings you in today?"',
          'End of shift: count how many you greeted within 30 seconds'
        ],
        encouragement: "You're building a new habit. Day 1 is the hardest."
      }
    ],
    quickRef: [
      { num: 1, label: '5 SECONDS', question: 'Acknowledge', examples: ['Eye contact', 'Smile', 'Nod', '"I\'ll be right with you!"'] },
      { num: 2, label: '30 SECONDS', question: 'Approach (if browsing)', examples: ['Looking around', 'Touching products', 'Clearly browsing'] },
      { num: 3, label: '60 SECONDS', question: 'Engage (no matter what)', examples: ['Warm opener', 'Open question', 'Never "Can I help you?"'] },
      { num: 4, label: '"JUST LOOKING"', question: '"No problem, I\'m right here"', examples: ['Stay visible', 'Check back in 3 min', 'Don\'t disappear'] }
    ]
  },

  'mission-2': {
    number: 2,
    totalMissions: 6,
    title: 'Kill "Can I Help You?"',
    readTime: '6 min',
    slides: [
      {
        type: 'text',
        icon: 'ri-close-circle-line',
        title: 'The Worst Question in Retail',
        scenario: [
          { icon: 'ri-user-smile-line', label: 'You approach', tone: 'scenario-neutral' },
          { icon: 'ri-question-line', label: '"Can I help you?"', tone: 'scenario-warn' },
          { icon: 'ri-hand-line', label: '"No, just looking"', tone: 'scenario-bad' },
          { icon: 'ri-walk-line', label: 'They browse alone', tone: 'scenario-bad' }
        ],
        body: "It's a closed question \u2014 they shut it down with one word. It asks them to commit before they know you.",
        highlight: "That's \u20A66.5 million/year lost."
      },
      {
        type: 'rule',
        icon: 'ri-chat-check-line',
        title: 'Open Beats Closed',
        stats: [
          { value: '90%', label: 'Say "just looking" to closed questions' },
          { value: '60%+', label: 'Engage with warm openings' }
        ],
        body: "Open questions invite conversation. Closed questions invite rejection."
      },
      {
        type: 'toolkit',
        icon: 'ri-chat-smile-3-line',
        title: '5 Warm Openings',
        items: [
          '"What brings you in today?"',
          '"Looking for something specific, or just seeing what\'s new?"',
          '"That [item] is one of our most popular \u2014 want to try it?"',
          '"Shopping for yourself or a gift?"',
          '"I love those [shoes] \u2014 looking for something similar or different?"'
        ],
        footnote: 'Pick ONE to practice all day. Master it before trying others.'
      },
      {
        type: 'comparison',
        icon: 'ri-arrow-left-right-line',
        title: 'Spot the Difference',
        dont: '"Can I help you?" \u2192 "No, just looking." \u2192 Silence. They leave.',
        do: '"What brings you in today?" \u2192 "Running shoes." \u2192 "Nice \u2014 what kind of running?" \u2192 Now you\'re in.'
      },
      {
        type: 'practice',
        icon: 'ri-focus-3-line',
        title: 'Try This Today',
        items: [
          'Pick ONE warm opening to use all day',
          'If short answer, follow up: "What kind of [X] are you looking for?"',
          'Count how many engage vs say "just looking"',
          'End of day: write down your engagement percentage'
        ],
        encouragement: "Start with 'What brings you in today?' \u2014 it's the easiest one."
      }
    ],
    quickRef: [
      { num: 1, label: 'OCCASION', question: '"What brings you in today?"', examples: ['Open-ended', 'Conversational', 'Best all-rounder'] },
      { num: 2, label: 'CHOICE', question: '"Specific or just browsing?"', examples: ['Two paths', 'No "no" option', 'Both = engagement'] },
      { num: 3, label: 'PRODUCT', question: '"That one\'s popular \u2014 try it?"', examples: ['When holding item', 'Give info first', 'Invite action'] },
      { num: 4, label: 'SELF/GIFT', question: '"For yourself or a gift?"', examples: ['Forces engagement', 'Reveals need', 'Unlocks follow-ups'] },
      { num: 5, label: 'COMPLIMENT', question: '"Love those \u2014 similar or different?"', examples: ['Builds rapport', 'Two-path choice', 'Personal touch'] }
    ]
  },

  'mission-3': {
    number: 3,
    totalMissions: 6,
    title: 'The 70/30 Rule',
    readTime: '2 min',
    bar: true,
    slides: [
      {
        type: 'text',
        icon: 'ri-alarm-warning-line',
        title: 'The Problem',
        scenario: [
          { icon: 'ri-user-smile-line', label: 'Customer asks', tone: 'scenario-neutral' },
          { icon: 'ri-chat-4-line', label: 'You talk...', tone: 'scenario-neutral' },
          { icon: 'ri-chat-4-line', label: '...and talk', tone: 'scenario-warn' },
          { icon: 'ri-door-open-line', label: 'They leave', tone: 'scenario-bad' }
        ],
        body: "Their eyes glaze over. You listed every feature instead of solving their problem.",
        highlight: "That's feature-dumping."
      },
      {
        type: 'rule',
        icon: 'ri-scales-3-line',
        title: 'The 70/30 Rule',
        bar: true,
        stats: [
          { value: '70%', label: 'Customer talks' },
          { value: '30%', label: 'You talk' }
        ],
        body: "If you're doing most of the talking, you're doing it wrong.",
        highlighted: true
      },
      {
        type: 'toolkit',
        icon: 'ri-questionnaire-line',
        title: 'Ask These 4 Questions',
        items: [
          'What are you buying for?',
          "What's not working now?",
          'What matters most?',
          'Buying today or browsing?'
        ],
        footnote: 'Only show products after all 4.'
      },
      {
        type: 'comparison',
        icon: 'ri-chat-smile-3-line',
        title: 'Spot the Difference',
        dont: 'You show 5 shoes and list features. They leave.',
        do: 'You ask 4 questions, show 2 options that match. They buy.'
      },
      {
        type: 'practice',
        icon: 'ri-focus-3-line',
        title: 'Try This Today',
        items: [
          'Pick 3 customers \u2014 use all 4 questions',
          'Count: are they talking more than you?',
          'Write down what you learned at end of shift'
        ],
        encouragement: "You've got this."
      }
    ],
    quickRef: [
      { num: 1, label: 'OCCASION', question: '"What are you buying for?"', examples: ['Running', 'Gym', 'Casual wear', 'Gift', 'School'] },
      { num: 2, label: 'PROBLEM', question: '"What\'s not working now?"', examples: ['Hurts my feet', 'Wore out fast', 'Too heavy', 'No grip', 'Looks old'] },
      { num: 3, label: 'PRIORITY', question: '"What matters most?"', examples: ['Comfort', 'Durability', 'Style', 'Price', 'Lightweight'] },
      { num: 4, label: 'DECISION', question: '"Buying today or browsing?"', examples: ['Ready now', 'Comparing', 'Waiting for payday', 'Just looking'] }
    ]
  },

  'mission-4': {
    number: 4,
    totalMissions: 6,
    title: '"I\'ll Think About It"',
    readTime: '7 min',
    slides: [
      {
        type: 'text',
        icon: 'ri-emotion-unhappy-line',
        title: 'The Polite Escape',
        scenario: [
          { icon: 'ri-check-double-line', label: 'You did everything right', tone: 'scenario-neutral' },
          { icon: 'ri-emotion-normal-line', label: 'They seem interested', tone: 'scenario-neutral' },
          { icon: 'ri-time-line', label: '"I\'ll think about it"', tone: 'scenario-warn' },
          { icon: 'ri-door-open-line', label: 'Gone forever', tone: 'scenario-bad' }
        ],
        body: "\"I'll think about it\" is almost never about thinking. It's about escaping.",
        highlight: "9 out of 10 who say this never come back."
      },
      {
        type: 'rule',
        icon: 'ri-translate-2',
        title: 'What They Actually Mean',
        stats: [
          { value: '9/10', label: 'Never come back' },
          { value: '5', label: 'Hidden meanings' }
        ],
        body: "\"Not sure it's worth the price\" \u00B7 \"Need to ask someone\" \u00B7 \"Something's not right\" \u00B7 \"Checking elsewhere\" \u00B7 \"You pressured me\""
      },
      {
        type: 'toolkit',
        icon: 'ri-tools-line',
        title: 'The 3-Step Framework',
        items: [
          'ACKNOWLEDGE: "That\'s totally fair. Can I ask \u2014 what\'s making you think it over?"',
          'PROBE: Listen. If vague: "Is it the price, or not sure it\'s right?"',
          'BRIDGE: Don\'t push. Show alternative, hold item, or offer your card.'
        ],
        footnote: "You're not convincing them. You're uncovering what they need to convince themselves."
      },
      {
        type: 'comparison',
        icon: 'ri-arrow-left-right-line',
        title: 'Spot the Difference',
        dont: '"I\'ll think about it." \u2192 "Okay, let me know!" \u2192 They leave forever.',
        do: '"I\'ll think about it." \u2192 "Totally fair \u2014 is it the price or the fit?" \u2192 "The price." \u2192 Now you can help.'
      },
      {
        type: 'practice',
        icon: 'ri-focus-3-line',
        title: 'Try This Today',
        items: [
          'Pick 3 customers who say "I\'ll think about it"',
          'Use: "That\'s fair \u2014 what\'s making you think it over?"',
          'Listen for the REAL objection behind the words',
          'End of day: how many stayed in the conversation?'
        ],
        encouragement: "The real sale starts when they hesitate."
      }
    ],
    quickRef: [
      { num: 1, label: 'ACKNOWLEDGE', question: '"That\'s totally fair. Can I ask..."', examples: ['Don\'t surrender', 'Don\'t push', 'Show respect'] },
      { num: 2, label: 'PROBE', question: '"Is it the price, or...?"', examples: ['Price concern', 'Need approval', 'Comparing options', 'Something off'] },
      { num: 3, label: 'BRIDGE', question: 'Offer a smaller action', examples: ['Show alternative', 'Hold item 24h', 'Take a photo', 'Give your card'] }
    ]
  },

  'mission-5': {
    number: 5,
    totalMissions: 6,
    title: '"It\'s Too Expensive"',
    readTime: '8 min',
    slides: [
      {
        type: 'text',
        icon: 'ri-price-tag-3-line',
        title: 'The Price Panic',
        scenario: [
          { icon: 'ri-heart-line', label: 'They love it', tone: 'scenario-neutral' },
          { icon: 'ri-price-tag-3-line', label: 'See the price', tone: 'scenario-warn' },
          { icon: 'ri-emotion-sad-line', label: '"Too expensive"', tone: 'scenario-bad' },
          { icon: 'ri-percent-line', label: 'You panic: "10% off!"', tone: 'scenario-bad' }
        ],
        body: "You trained them that prices are negotiable. You made the product seem less valuable.",
        highlight: "Price objections aren't about the number. They're about perceived value."
      },
      {
        type: 'rule',
        icon: 'ri-scales-3-line',
        title: 'Price \u2260 Value',
        stats: [
          { value: '\u20A62.8M', label: 'Margin lost/year from needless discounts' },
          { value: '0', label: 'Discounts needed if you anchor value' }
        ],
        body: "\"If a customer complains about price, they're actually interested. Price objections are buying signals in disguise.\""
      },
      {
        type: 'toolkit',
        icon: 'ri-tools-line',
        title: 'The 4-Step Framework',
        items: [
          'ASK BUDGET: "What were you thinking price-wise?"',
          'ANCHOR VALUE: "The reason this is [price] is [benefit tied to their need]"',
          'SHOW DOWN: "Want to see the cheaper version side-by-side?"',
          'PAYMENT FLEX: "We have installments \u2014 \u20A615K/month for 3 months"'
        ],
        footnote: "Don't discount until you've tried all 4 steps."
      },
      {
        type: 'comparison',
        icon: 'ri-arrow-left-right-line',
        title: 'Spot the Difference',
        dont: '"Too expensive." \u2192 "I can give you 10% off!" \u2192 Margin gone. They still hesitate.',
        do: '"Too expensive." \u2192 "What were you thinking?" \u2192 "\u20A625K." \u2192 "Here\'s why \u20A645K is worth it..." \u2192 They buy.'
      },
      {
        type: 'practice',
        icon: 'ri-focus-3-line',
        title: 'Try This Today',
        items: [
          'When 3 customers say "too expensive" \u2014 ask about their budget first',
          'Anchor value to THEIR specific need, not generic brand talk',
          'Show cheaper option side-by-side (often sells the premium)',
          'End of day: how many held full price?'
        ],
        encouragement: "Premium pricing is a sales tool, not a barrier."
      }
    ],
    quickRef: [
      { num: 1, label: 'ASK', question: '"What were you thinking price-wise?"', examples: ['Reveals budget', 'Opens dialogue', 'No judgment'] },
      { num: 2, label: 'ANCHOR', question: '"The reason this costs more..."', examples: ['Their specific need', 'Not generic brand', 'Cost per use'] },
      { num: 3, label: 'SHOW', question: '"See the difference side-by-side"', examples: ['Physical comparison', 'Let them feel', 'Often sells premium'] },
      { num: 4, label: 'FLEX', question: '"Installments or cost-per-wear"', examples: ['\u20A615K \u00D7 3 months', '\u20A6300/wear', 'Remove lump-sum barrier'] }
    ]
  },

  'mission-6': {
    number: 6,
    totalMissions: 6,
    title: 'Exit Protocol',
    readTime: '6 min',
    slides: [
      {
        type: 'text',
        icon: 'ri-logout-box-line',
        title: 'The Disappearing Customer',
        scenario: [
          { icon: 'ri-time-line', label: '20 mins together', tone: 'scenario-neutral' },
          { icon: 'ri-check-double-line', label: 'You did great', tone: 'scenario-neutral' },
          { icon: 'ri-walk-line', label: 'They leave', tone: 'scenario-warn' },
          { icon: 'ri-ghost-line', label: 'Gone forever', tone: 'scenario-bad' }
        ],
        body: "\"Okay, thanks for coming in!\" \u2014 and they're gone. 60-70% of browsers don't buy on the first visit.",
        highlight: "That's \u20A631.2 million/year in recoverable sales."
      },
      {
        type: 'rule',
        icon: 'ri-contacts-book-line',
        title: 'The 40% Rule',
        stats: [
          { value: '40%', label: 'Would buy later (if you follow up)' },
          { value: '0%', label: 'Come back (if you don\'t capture info)' }
        ],
        body: "The sale doesn't always happen today. But it can happen later \u2014 if you capture their info before they leave."
      },
      {
        type: 'toolkit',
        icon: 'ri-clipboard-line',
        title: 'Capture Checklist',
        items: [
          'NAME: "Can I grab your name?" (first name is enough)',
          'NUMBER: "I\'ll text you if this goes on sale" (WhatsApp best)',
          'NEED: What were they looking for? (shoes, hoodie, size)',
          'TRIGGER: "I\'ll text you if [specific thing happens]"'
        ],
        footnote: "Don't interrogate. Name + number + need = enough."
      },
      {
        type: 'comparison',
        icon: 'ri-arrow-left-right-line',
        title: 'Spot the Difference',
        dont: '"Thanks for coming!" \u2192 Customer disappears. Zero follow-up. Zero recovery.',
        do: '"Before you go \u2014 can I grab your number? I\'ll text you if these go on sale." \u2192 5 days later \u2192 they buy.'
      },
      {
        type: 'practice',
        icon: 'ri-focus-3-line',
        title: 'Try This Today',
        items: [
          'Capture info from 3 customers who leave without buying',
          'Use: "Before you go \u2014 can I grab your name and number?"',
          'Set a specific trigger: "I\'ll text you if [sale/restock]"',
          'End with: "I\'m [your name], nice meeting you!"'
        ],
        encouragement: "Module 1 complete. You've got the foundations. Now practice."
      }
    ],
    quickRef: [
      { num: 1, label: 'ACKNOWLEDGE', question: '"No problem! Before you go..."', examples: ['No pressure', 'Warm tone', 'Natural transition'] },
      { num: 2, label: 'CAPTURE', question: 'Name + Number + Need', examples: ['First name only', 'WhatsApp number', 'What they wanted'] },
      { num: 3, label: 'TRIGGER', question: '"I\'ll text you if..."', examples: ['Goes on sale', 'Size restocked', 'New arrival', 'Similar item'] },
      { num: 4, label: 'EXIT', question: '"I\'m [name], nice meeting you!"', examples: ['Personal touch', 'They know you', 'Follow up in 3-7 days'] }
    ]
  }
}
