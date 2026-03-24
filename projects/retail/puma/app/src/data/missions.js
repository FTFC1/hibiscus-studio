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
    objectives: [
      'Spot the 3 time windows for customer engagement (5s, 30s, 60s)',
      'Use 4 warm openers instead of "Can I help you?"',
      'Apply the 5-30-60 Rule during your next shift'
    ],
    slides: [
      {
        type: 'text',
        icon: 'ri-alarm-warning-line',
        title: '\u20A615.6 Million Lost Every Year',
        scenario: [
          { icon: 'ri-walk-line', label: 'Customer enters', tone: 'scenario-neutral' },
          { icon: 'ri-smartphone-line', label: 'Staff on phone', tone: 'scenario-warn' },
          { icon: 'ri-time-line', label: '3 minutes pass', tone: 'scenario-warn' },
          { icon: 'ri-door-open-line', label: 'They leave', tone: 'scenario-bad' }
        ],
        body: "That's how much walks out the door when staff don't engage. A customer picks up a shoe, checks the price, puts it back.",
        highlight: "No one said a word."
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
    ],
    quiz: [
      { id: 'q1', question: 'A customer walked in 45 seconds ago. Which time windows have already passed?', options: ['None yet', 'Acknowledge only (5s)', 'Acknowledge AND approach (5s + 30s)', 'All three windows'], correct: 2, explanation: 'At 45 seconds, the 5-second acknowledge AND 30-second approach windows have both passed. The 60-second engage window is still open — but you\'re running out of time.' },
      { id: 'q2', question: 'Which opener follows the rule when approaching a browser?', options: ['"Can I help you?"', '"Are you finding everything okay?"', '"What brings you in today?"', '"Just shout if you need help!"'], correct: 2, explanation: '"What brings you in today?" is an open question — it invites a conversation. The others are closed questions that get shut down with one word.' },
      { id: 'q3', question: 'Customer says "Just looking." What does the rule say?', options: ['Respect it and give them space', '"No problem, I\'m right here" — stay visible', 'Ask a follow-up question immediately', 'Hand off to a colleague'], correct: 1, explanation: 'Stay visible and available. "Just looking" is normal — not a rejection. Give them 2-3 minutes, then try again with a different opener.' },
      { id: 'q4', question: 'A customer picks up a shoe and checks the price tag. No staff has spoken to them. What window are you in?', options: ['Still within the 5-second acknowledge window', 'Past acknowledge, in the 30-second approach window', 'Already in the 60-second engage window', 'It depends on how long they\'ve been in the store'], correct: 3, explanation: 'It depends on timing. But if they\'re already handling products and checking prices with no staff interaction — you\'ve likely missed the earlier windows.' },
      { id: 'q5', question: 'You acknowledged a customer at 5 seconds. At 25 seconds they\'re still browsing. What do you do?', options: ['Wait until 60 seconds to engage', 'Approach now — you\'re inside the 30-second window', 'Ask "Can I help you?" from across the store', 'Wait for them to make eye contact again'], correct: 1, explanation: 'You\'re at 25 seconds — still inside the 30-second approach window. Walk over with a warm opener. Don\'t wait for 60 seconds, and never shout across the floor.' }
    ]
  },

  'mission-2': {
    number: 2,
    totalMissions: 6,
    title: 'Kill "Can I Help You?"',
    readTime: '6 min',
    objectives: [
      'Explain why closed questions kill conversations',
      'Use 5 warm openings that invite engagement',
      'Track your engagement rate vs "just looking" rate'
    ],
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
    ],
    quiz: [
      { id: 'q1', question: 'Why does "Can I help you?" fail 90% of the time?', options: ['It sounds too casual', 'It\'s a closed question — shut down with one word', 'It comes too early in the conversation', 'It sounds scripted'], correct: 1, explanation: 'Closed questions get one-word answers. "Can I help you?" → "No thanks." Conversation over. Open questions invite them to talk.' },
      { id: 'q2', question: 'Which of these is an open question?', options: ['"Can I help you?"', '"Are you finding everything?"', '"What brings you in today?"', '"Do you need anything?"'], correct: 2, explanation: '"What brings you in today?" can\'t be answered with yes or no — it opens a conversation. The others all invite a one-word shutdown.' },
      { id: 'q3', question: 'Customer says "Running shoes." What\'s the best follow-up?', options: ['"Great, follow me!"', '"We have lots of options"', '"What kind of running?"', '"Let me show you our best ones"'], correct: 2, explanation: '"What kind of running?" digs deeper — trail, gym, marathon all need different shoes. Jumping to products before understanding the need loses trust.' },
      { id: 'q4', question: 'You approach a customer browsing hoodies. Which opener keeps the conversation going?', options: ['"Need any help?"', '"Those are on sale"', '"Shopping for yourself or a gift?"', '"The changing rooms are over there"'], correct: 2, explanation: '"Shopping for yourself or a gift?" is open-ended and gives you context for what to recommend next. Sale info and directions end the conversation.' },
      { id: 'q5', question: 'A customer responds "Just browsing" to your warm opening. What happened?', options: ['Your opening was wrong — try a different one next time', 'Normal response — stay visible and try again in 2-3 minutes', 'They don\'t want to buy — move on to someone else', 'You approached too early'], correct: 1, explanation: '"Just browsing" is the most common response — it\'s not rejection. Stay visible, give them space, and re-approach in 2-3 minutes with a different angle.' }
    ]
  },

  'mission-3': {
    number: 3,
    totalMissions: 6,
    title: 'The 70/30 Rule',
    readTime: '2 min',
    bar: true,
    objectives: [
      'Recognise when you\'re feature-dumping (talking > 30%)',
      'Ask 4 qualifying questions before showing products',
      'Let the customer do 70% of the talking'
    ],
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
    ],
    quiz: [
      { id: 'q1', question: 'Under the 70/30 rule, who should be talking more?', options: ['Staff — you know the products best', 'Customer — you\'re learning their need', '50/50 is ideal', 'Depends on the customer'], correct: 1, explanation: 'The customer should do 70% of the talking. Your job is to listen and learn their need — not pitch products. The more they talk, the better you can match.' },
      { id: 'q2', question: 'When should you show products to a customer?', options: ['When they seem interested', 'After the first qualifying question', 'After asking all 4 questions', 'When they pick something up'], correct: 2, explanation: 'Ask all 4 qualifying questions first. Showing products too early means you\'re guessing — and guessing leads to "I\'ll think about it."' },
      { id: 'q3', question: 'You talk for 3 minutes listing shoe features. Customer\'s eyes glaze over. What went wrong?', options: ['Too many options shown', 'Feature-dumping — you talked more than you listened', 'Wrong products for the customer', 'Bad timing'], correct: 1, explanation: 'Feature-dumping is the #1 mistake. You talked 100%, customer talked 0%. Flip it — ask what matters to them, then match features to their answer.' },
      { id: 'q4', question: 'Customer says "I need running shoes." You ask all 4 questions and learn: trail running, current shoes hurt their knees, comfort is #1, buying today. How many shoes do you show?', options: ['1 — the best match', '2 — targeted options based on their answers', '5 — give them variety', 'All your running shoes — let them decide'], correct: 1, explanation: '2 targeted options. One is your top recommendation, the other gives them a real choice. More than 2 creates decision paralysis.' },
      { id: 'q5', question: 'You catch yourself talking for 2 minutes straight about a shoe\'s technology. What should you do RIGHT NOW?', options: ['Finish your point — they need to hear this', 'Stop and ask "What matters most to you?"', 'Show them the price to change the subject', 'Ask if they want to try it on'], correct: 1, explanation: 'Stop and redirect. "What matters most to you?" hands the conversation back to the customer. You just broke the 70/30 rule — fix it now, not later.' }
    ]
  },

  'mission-4': {
    number: 4,
    totalMissions: 6,
    title: '"I\'ll Think About It"',
    readTime: '7 min',
    objectives: [
      'Decode the 5 hidden meanings behind "I\'ll think about it"',
      'Use the 3-step Acknowledge-Probe-Bridge framework',
      'Keep hesitant customers in the conversation without being pushy'
    ],
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
    ],
    quiz: [
      { id: 'q1', question: '"I\'ll think about it" usually means:', options: ['They genuinely need time to decide', 'Something is stopping them — price, doubt, or comparison', 'They will come back tomorrow', 'They can\'t afford it'], correct: 1, explanation: '"I\'ll think about it" is almost never literal. Something specific is holding them back — your job is to find out what, not accept the polite exit.' },
      { id: 'q2', question: 'Customer says "I\'ll think about it." What\'s your first move?', options: ['"Okay, no problem!"', '"We have a sale tomorrow, so..."', '"That\'s totally fair — what\'s making you think it over?"', '"Let me give you a discount"'], correct: 2, explanation: 'Probe gently first. "What\'s making you think it over?" uncovers the real objection. Discounting before you know the problem wastes margin on something that might not be about price.' },
      { id: 'q3', question: 'You ask "Is it the price, or not sure it\'s right?" What are you doing?', options: ['Convincing them to buy', 'Uncovering the real objection behind the polite exit', 'Closing the sale', 'Ending the conversation politely'], correct: 1, explanation: 'You\'re diagnosing, not closing. This either/or question narrows down the real blocker so you can address it directly instead of guessing.' },
      { id: 'q4', question: 'Customer says "I\'ll think about it" and starts walking to the door. You\'ve already probed and they said "I need to ask my wife." What\'s the best bridge?', options: ['"No problem, come back anytime"', '"I can hold it for 24 hours — want me to put your name on it?"', '"Your wife would love it, trust me"', '"We have a sale ending today"'], correct: 1, explanation: 'Holding the item creates a reason to return without pressure. It respects their decision while keeping the sale alive. "Come back anytime" = no reason to come back.' },
      { id: 'q5', question: 'A customer tried on 3 pairs of shoes, loved the second pair, then said "Let me think about it." What\'s the MOST LIKELY hidden meaning?', options: ['They genuinely need time', 'They\'re not sure about the price', 'They want to check other stores first', 'Could be any of these — that\'s why you probe'], correct: 3, explanation: 'You can\'t know without asking. That\'s exactly why probing exists — the same words can hide completely different objections. Always probe before you prescribe.' }
    ]
  },

  'mission-5': {
    number: 5,
    totalMissions: 6,
    title: '"It\'s Too Expensive"',
    readTime: '8 min',
    objectives: [
      'Recognise price objections as buying signals, not rejections',
      'Use the 4-step framework: Ask Budget → Anchor Value → Show Down → Payment Flex',
      'Hold full price by building value before offering alternatives'
    ],
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
    ],
    quiz: [
      { id: 'q1', question: '"It\'s too expensive" is actually:', options: ['A clear no — move on', 'A buying signal — they\'re interested but need value justified', 'A request for a discount', 'A product quality concern'], correct: 1, explanation: 'If they didn\'t care, they\'d just leave. "Too expensive" means they want it but need help justifying the price. That\'s a buying signal.' },
      { id: 'q2', question: 'What\'s the FIRST step when a customer says "too expensive"?', options: ['Offer 10% off immediately', 'Ask: "What were you thinking price-wise?"', 'Show a cheaper option', 'Justify the price immediately'], correct: 1, explanation: 'Find their anchor point first. "What were you thinking?" tells you the gap. A ₦5K gap needs a different response than a ₦20K gap.' },
      { id: 'q3', question: 'Why does showing the cheaper option side-by-side often sell the premium?', options: ['It makes the premium look more affordable', 'Customer feels and sees the quality difference directly', 'It confuses them into buying', 'It looks like more value for money'], correct: 1, explanation: 'When they hold both, they feel the difference. The premium suddenly has a reason behind the price. You\'re not telling them it\'s better — they\'re discovering it.' },
      { id: 'q4', question: 'Customer says a pair of trainers at ₦45,000 is "too expensive." You ask their budget — they say ₦30,000. What\'s your next move?', options: ['"Let me find something in your budget"', '"The reason these are ₦45K is [benefit tied to their need]" — then show the ₦28K pair side-by-side', '"We have installments — ₦15K for 3 months"', '"I can give you 15% off"'], correct: 1, explanation: 'Anchor the value to their specific need first, THEN show the cheaper option next to it. The side-by-side lets them feel the difference. Never lead with discounts.' },
      { id: 'q5', question: 'You anchored value, showed a cheaper option side-by-side, and the customer STILL hesitates. What\'s left in the framework?', options: ['Offer a discount — you\'ve tried everything', 'Payment flexibility — break it into installments or cost-per-wear', 'Let them go — they can\'t afford it', 'Call your manager for approval'], correct: 1, explanation: 'Payment flexibility is the last tool. "That\'s ₦150 per day for a year" or "3 payments of ₦15K" reframes the price without cutting it. Never discount first.' }
    ]
  },

  'mission-6': {
    number: 6,
    totalMissions: 6,
    title: 'Exit Protocol',
    readTime: '6 min',
    objectives: [
      'Capture Name + Number + Need from non-buying customers',
      'Set a specific follow-up trigger (sale, restock, new arrival)',
      'Turn today\'s browser into tomorrow\'s buyer with a 3-7 day follow-up'
    ],
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
    ],
    quiz: [
      { id: 'q1', question: 'What percentage of non-buying browsers would buy later if you follow up?', options: ['10%', '25%', '40%', '70%'], correct: 2, explanation: '40% of browsers who leave without buying would come back — but only if you captured their info and followed up. Without that, recovery rate is 0%.' },
      { id: 'q2', question: 'The exit capture needs three things. Which combo is right?', options: ['Name + email + address', 'Name + number + need', 'Name + social media + size', 'Number + purchase history + budget'], correct: 1, explanation: 'Name + Number + Need. First name is enough, WhatsApp number for follow-up, and what they were looking for so your message is specific, not generic.' },
      { id: 'q3', question: 'When do you use the exit capture line?', options: ['Only if they seemed very interested', 'As soon as they enter the store', 'When a customer leaves without buying', 'After they\'ve made a purchase'], correct: 2, explanation: 'Use it when they\'re leaving without buying. "Before you go..." is the natural transition. Don\'t wait for high interest — every non-buyer is a follow-up opportunity.' },
      { id: 'q4', question: 'You spent 15 minutes helping a customer. They loved the shoes but said "Not today." You captured their name and WhatsApp. When do you follow up?', options: ['Same day — while it\'s fresh', '3-7 days later with a specific trigger', '2 weeks later', 'Only when the item goes on sale'], correct: 1, explanation: '3-7 days with a trigger: "Hi [name], those trainers you liked — we just got new sizes in." Same day feels pushy. Two weeks is too late — they\'ve forgotten you.' },
      { id: 'q5', question: 'A customer is leaving. You say "Before you go — can I grab your number? I\'ll text you if these go on sale." They say "I don\'t give out my number." What do you do?', options: ['"No problem at all! I\'m [name], nice meeting you" — let them go gracefully', 'Ask for their email instead', 'Give them YOUR number and say "Save my contact"', 'Try once more — "It\'s just for stock alerts"'], correct: 0, explanation: 'Respect it immediately. "No problem at all" keeps the door open. Pushing after a no turns a warm goodbye into an uncomfortable exit — they won\'t come back.' }
    ]
  }
}
