// ── The Approach — scenario data ──────────────────
// Source: public/approach-game.html (approved prototype)

export const approachScenarios = [
  {
    type: 'MATERIAL-CURIOUS',
    context: 'Customer is looking at suede shoes',
    quote: 'How do I clean these?',
    options: [
      { script: 'We have a Suede Protector Spray for \u20A63,500. It prevents stains before they happen.', correct: true, explanation: "They asked about care — give them the solution with the price." },
      { script: 'Try our White Sneaker Cleaner — \u20A64,500. Works on most materials.', correct: false, explanation: "Wrong product. They have SUEDE, not white leather." },
      { script: 'Should I show you something else instead?', correct: false, explanation: "They're interested! Don't redirect — solve their concern." },
      { script: "Just use a damp cloth, that's all.", correct: false, explanation: "Generic advice that doesn't help them AND misses the sale." },
    ],
  },
  {
    type: 'MATERIAL-CURIOUS',
    context: 'Customer examining white sneakers',
    quote: 'White shoes get dirty so fast...',
    options: [
      { script: "That's why we have a White Sneaker Cleaner — \u20A64,500. Keeps them fresh.", correct: true, explanation: "You acknowledged their concern and offered the solution." },
      { script: 'True sha. White is hard to maintain.', correct: false, explanation: "You agreed but offered nothing. That's not helpful." },
      { script: 'The Suede Protector Spray — \u20A63,500 — helps with stains.', correct: false, explanation: "Wrong product. These are WHITE shoes, not suede." },
      { script: "It's not that bad sha.", correct: false, explanation: "Dismissing their valid concern doesn't build trust." },
    ],
  },
  {
    type: 'GUIDED BUYER',
    context: 'Customer just walked in, looking around',
    quote: "I don't know what I'm looking for...",
    options: [
      { script: "No wahala! What's the occasion? Casual, gym, or something specific?", correct: true, explanation: "Lead with a question to understand their needs. They WANT guidance." },
      { script: 'Take your time, let me know if you need anything o.', correct: false, explanation: "They just told you they need help! Don't abandon them." },
      { script: 'Our best sellers are this side.', correct: false, explanation: "You're guessing. Ask first, then recommend." },
      { script: 'What size are you?', correct: false, explanation: "Too early for size. First understand what they need." },
    ],
  },
  {
    type: 'GUIDED BUYER',
    context: 'Customer trying on a t-shirt',
    quote: 'What do you think? Does this fit me?',
    options: [
      { script: "That fits great! Want me to grab the matching shorts? They'd complete the look.", correct: true, explanation: "Affirm their choice AND suggest the add-on. They want your opinion." },
      { script: 'Yeah, it looks fine.', correct: false, explanation: "Missed the opportunity to build the outfit. They asked for your input!" },
      { script: 'It depends on what you like.', correct: false, explanation: "They're asking YOU. Be confident and guide them." },
      { script: 'We have other colors too.', correct: false, explanation: "They're happy with this one. Don't confuse them — build on it." },
    ],
  },
  {
    type: 'ACTIVITY BUYER',
    context: 'Customer looking at running shoes',
    quote: 'I want to start running',
    options: [
      { script: "Great choice! For running, you'll want good socks too — the Performance 3-pack is \u20A66,000.", correct: true, explanation: "Match the add-on to their ACTIVITY, not just the product." },
      { script: "Nice! We have a Gym Bag for \u20A635,000 if you need to carry gear.", correct: false, explanation: "Wrong activity. They said RUNNING, not gym. Stay focused." },
      { script: 'Have you run before?', correct: false, explanation: "Unnecessary question. They said they want to start — help them." },
      { script: 'Should I show you our casual shoes too?', correct: false, explanation: "Wrong category. They said RUNNING. Stay focused." },
    ],
  },
  {
    type: 'ACTIVITY BUYER',
    context: 'Customer mentioned they go to the gym',
    quote: 'I need shoes for weights and cardio',
    options: [
      { script: "The Training line is perfect for both. Do you have a gym bag? This one's \u20A635,000.", correct: true, explanation: "Match their activity (gym) with relevant add-on (bag)." },
      { script: "Great! The Running Cap is \u20A611,000 — keeps sweat out of your eyes.", correct: false, explanation: "Wrong activity. Running cap for gym? Listen to what THEY said." },
      { script: 'How often do you go to the gym?', correct: false, explanation: "Doesn't matter. They're here, they're buying. Make the suggestion." },
      { script: 'Training shoes are this side.', correct: false, explanation: "Too passive. Lead them AND suggest the add-on." },
    ],
  },
  {
    type: 'GIFT BUYER',
    context: 'Customer shopping for someone else',
    quote: "It's for my son's birthday",
    options: [
      { script: "Nice! Want me to add a Premium Shoe Bag? Makes it look like proper gift — \u20A610,000.", correct: true, explanation: "Gifts need presentation. The bag adds perceived value." },
      { script: "We have the Care Kit for \u20A68,000 — keeps shoes looking new.", correct: false, explanation: "Practical, but a gift buyer wants PRESENTATION first." },
      { script: 'Does he like these colors?', correct: false, explanation: "They're the parent — they know. Focus on making it special." },
      { script: 'These ones sell well with young guys.', correct: false, explanation: "Generic. Make it personal — it's a birthday gift!" },
    ],
  },
  {
    type: 'EXPERT BUYER',
    context: 'Customer who knows the product line',
    quote: "I buy the Nitro every year. Just here for the new one.",
    options: [
      { script: "Welcome back o! The new Nitro is here. How's your sock situation — need a fresh 3-pack?", correct: true, explanation: "Acknowledge their expertise, then casually suggest the add-on." },
      { script: 'Let me tell you about the new features...', correct: false, explanation: "They know more than you. Don't lecture an expert." },
      { script: "It's right over here.", correct: false, explanation: "Helpful but passive. You can still cross-sell to experts." },
      { script: 'Have you considered the Deviate instead?', correct: false, explanation: "They told you what they want. Respect that. Just add to it." },
    ],
  },
]

export const approachInsights = {
  'MATERIAL-CURIOUS': "When customers ask about care or materials, they're ASKING for the cross-sell. Don't miss it!",
  'GUIDED BUYER': "Guided buyers want you to lead. Build them a full outfit — they'll say yes.",
  'ACTIVITY BUYER': "Match the add-on to their ACTIVITY, not just the product. Running → running gear.",
  'GIFT BUYER': "Gifts are about presentation. Bags, boxes, and kits add perceived value.",
  'EXPERT BUYER': "Respect their knowledge, but still ask about basics: socks, care products.",
}

// ── Build the Basket — data ──────────────────────
// Source: public/basket-game-v2.html (approved prototype)
// Real PUMA Lekki inventory

export const basketCustomerTypes = {
  ACTIVITY_RUNNING: {
    name: 'ACTIVITY BUYER',
    quotes: ['I want to start running', 'Training for Lagos Marathon', 'Need shoes for my morning jogs', 'Looking for running gear'],
    validAddons: ['addon_socks', 'addon_socks_performance', 'addon_belt', 'addon_bag'],
    invalidAddons: ['addon_headwear'],
    mainCategories: ['main_running', 'main_running_apparel'],
  },
  ACTIVITY_TRAINING: {
    name: 'ACTIVITY BUYER',
    quotes: ['I go to the gym, weights and cardio', 'Need gear for CrossFit', 'Looking for training shoes', 'I do HIIT classes'],
    validAddons: ['addon_socks', 'addon_bag', 'addon_bodywear'],
    invalidAddons: ['addon_belt'],
    mainCategories: ['main_training', 'main_training_apparel'],
  },
  GUIDED: {
    name: 'GUIDED BUYER',
    quotes: ['I just want clothes, give me things that fit', 'What do you recommend?', "I don't know what I'm looking for", 'Help me pick something nice'],
    validAddons: ['addon_socks', 'addon_headwear', 'addon_accessory'],
    invalidAddons: [],
    mainCategories: ['main_apparel', 'main_lifestyle', 'main_footwear'],
  },
  GIFT: {
    name: 'GIFT BUYER',
    quotes: ["It's for my son's birthday", 'Looking for a gift for my colleague', "Shopping for my wife's anniversary", 'Need something nice to give'],
    validAddons: ['addon_bag', 'addon_accessory'],
    invalidAddons: ['addon_bodywear'],
    mainCategories: ['main_lifestyle', 'main_footwear', 'main_apparel'],
  },
  CASUAL: {
    name: 'CASUAL BUYER',
    quotes: ['Just something comfortable for weekends', 'Something to wear to the mall', 'Just everyday wear, nothing serious', 'Looking for something relaxed'],
    validAddons: ['addon_socks', 'addon_headwear'],
    invalidAddons: ['addon_belt', 'addon_socks_performance'],
    mainCategories: ['main_lifestyle', 'main_apparel', 'main_footwear'],
  },
}

export const basketProducts = {
  main: [
    { name: 'RUN ULTRASPUN CROP T Sun Stream', price: 45000, category: 'main_running' },
    { name: 'Velocity Nitro 3', price: 85000, category: 'main_running' },
    { name: 'Deviate Nitro Elite 2', price: 145000, category: 'main_running' },
    { name: 'Suede No Filter Wns Putty', price: 88200, category: 'main_lifestyle' },
    { name: 'Suede Classic XXI', price: 65000, category: 'main_lifestyle' },
    { name: 'Court Classy PUMA White', price: 53400, category: 'main_lifestyle' },
    { name: 'Carina 2.0 PUMA White', price: 57900, category: 'main_lifestyle' },
    { name: 'CA Pro Classic', price: 72000, category: 'main_lifestyle' },
    { name: 'RS-X Efekt', price: 95000, category: 'main_lifestyle' },
    { name: 'FUSE 7 4-way Stretch', price: 41600, category: 'main_training' },
    { name: 'PWR Nitro Training', price: 78000, category: 'main_training' },
    { name: 'PUMA SQUAD Tee Pink Lilac', price: 15100, category: 'main_apparel' },
    { name: 'ESS ELEVATED Shorts', price: 79050, category: 'main_apparel' },
    { name: 'DOWNTOWN Relaxed Graphic Tee', price: 30400, category: 'main_apparel' },
    { name: 'PUMA POWER Colorblock Hoodie', price: 62400, category: 'main_apparel' },
    { name: 'Ferrari CA Pro Rosso Corsa', price: 107100, category: 'main_lifestyle' },
    { name: 'BMW MMS Shorts', price: 156960, category: 'main_apparel' },
  ],
  addons: [
    { name: 'PUMA CREW SOCK LIGHT 3P', price: 8200, category: 'addon_socks' },
    { name: 'PUMA KIDS INVISIBLE 3P', price: 6300, category: 'addon_socks' },
    { name: 'PUMA UNISEX SNEAKER PLAIN 3P', price: 18000, category: 'addon_socks' },
    { name: 'Performance Running Socks', price: 12000, category: 'addon_socks_performance' },
    { name: 'Ess Cap III Puma White', price: 10100, category: 'addon_headwear' },
    { name: 'Ess Running Cap Midnight Plum', price: 11100, category: 'addon_headwear' },
    { name: 'ESS METAL PUMA CAT BB Cap', price: 27600, category: 'addon_headwear' },
    { name: 'BMW MMS BB Cap PUMA White', price: 32600, category: 'addon_headwear' },
    { name: 'Gym2k Bucket Hat Galactic Gray', price: 23500, category: 'addon_headwear' },
    { name: 'Core Up Mini Grip Bag PUMA Black', price: 10100, category: 'addon_bag' },
    { name: 'PUMA Buzz Backpack Olive Green', price: 39500, category: 'addon_bag' },
    { name: 'Basketball Backpack PUMA Black', price: 14600, category: 'addon_bag' },
    { name: 'Puma Fit wristbands Olive Green', price: 9100, category: 'addon_accessory' },
    { name: 'Cat Wristband', price: 48600, category: 'addon_accessory' },
    { name: 'PUMA BASIC 2P CREW TEE', price: 13200, category: 'addon_bodywear' },
    { name: 'PUMA BASIC 2P V-NECK', price: 22000, category: 'addon_bodywear' },
  ],
}
