"""
PRL Quiz Bot v2 — Interactive retail training on Telegram.

Rich quiz experience: context messages, extended explanations,
lesson links, transition messages, streak tracking, celebrations.

Usage:
  1. Set TELEGRAM_BOT_TOKEN env var (from @BotFather)
  2. python bot.py
  3. Users /start the bot, then /quiz to begin
"""

import os
import json
import asyncio
import csv
import io
import random
from datetime import datetime
from pathlib import Path

from telegram import (
    Update,
    Poll,
    BotCommand,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
)
from telegram.ext import (
    Application,
    CommandHandler,
    PollAnswerHandler,
    CallbackQueryHandler,
    MessageHandler,
    ContextTypes,
    filters,
)

# --- Config ---
TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
QUESTIONS_FILE = Path(__file__).parent / "questions.json"
SCORES_FILE = Path(__file__).parent / "scores.json"
QUIZ_TIMER = 30  # seconds per question
DEMO_SITE = "https://ftfc1.github.io/puma-training-demo"
GROUP_FILE = Path(__file__).parent / "group_id.txt"

# --- Load questions ---
with open(QUESTIONS_FILE) as f:
    ALL_QUESTIONS = json.load(f)

# --- Persistent scores ---
def load_scores():
    if SCORES_FILE.exists():
        with open(SCORES_FILE) as f:
            return json.load(f)
    return {}

def save_scores(scores):
    with open(SCORES_FILE, "w") as f:
        json.dump(scores, f, indent=2)

# --- In-memory state ---
active_quizzes = {}  # user_id -> quiz state
poll_map = {}        # poll_id -> {"user_id", "q_index", "correct"}
all_scores = load_scores()

# --- Transition messages ---
CORRECT_REACTIONS = [
    "Nailed it.",
    "That's how it's done.",
    "Exactly right.",
    "You've been paying attention.",
    "Spot on.",
    "Clean answer.",
    "That's the one.",
]

WRONG_TRANSITIONS = [
    "Not quite. Here's why:",
    "Common mistake. Let's break it down:",
    "Good guess, but here's the thing:",
    "This one trips people up. Here's the key:",
    "Almost. Here's what to remember:",
]

MISSION_INTROS = {
    1: "Mission 1: The 5-30-60 Rule\n\nEvery customer interaction has 3 critical windows. Miss one and you lose the sale before it starts.",
    2: "Mission 2: Kill 'Can I Help You?'\n\nThe most common phrase in retail is also the most dangerous. Time to replace it.",
    3: "Mission 3: The 70/30 Rule\n\nThe best sales staff talk LESS than the customer. Here's the framework.",
}

PROGRESS_BARS = {
    0: "▪️▪️▪️▪️▪️",
    1: "✅▪️▪️▪️▪️",
    2: "✅✅▪️▪️▪️",
    3: "✅✅✅▪️▪️",
    4: "✅✅✅✅▪️",
    5: "✅✅✅✅✅",
}


async def start(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    # Log group chat ID if in a group
    chat = update.effective_chat
    if chat.type in ("group", "supergroup"):
        GROUP_FILE.write_text(str(chat.id))
        print(f"Group detected: {chat.id} ({chat.title})")

    # In groups: tell people to DM the bot
    if chat.type in ("group", "supergroup"):
        bot_me = await ctx.bot.get_me()
        keyboard = [[InlineKeyboardButton("Open bot", url=f"https://t.me/{bot_me.username}")]]
        await update.message.reply_text(
            "PRL Sales Training\n"
            "━━━━━━━━━━━━━━━\n\n"
            "Quizzes and games — tap below to start.",
            reply_markup=InlineKeyboardMarkup(keyboard),
        )
        return

    # In DM: show full menu — each mission has Lesson (URL) + Quiz (callback)
    keyboard = [
        # Mission 1
        [
            InlineKeyboardButton("📖 M1 Lesson", url=f"{DEMO_SITE}/mission-01.html"),
            InlineKeyboardButton("📝 M1 Quiz", callback_data="start_1"),
        ],
        # Mission 2
        [
            InlineKeyboardButton("📖 M2 Lesson", url=f"{DEMO_SITE}/mission-02.html"),
            InlineKeyboardButton("📝 M2 Quiz", callback_data="start_2"),
        ],
        # Mission 3
        [
            InlineKeyboardButton("📖 M3 Lesson", url=f"{DEMO_SITE}/mission-03.html"),
            InlineKeyboardButton("📝 M3 Quiz", callback_data="start_3"),
        ],
        # Games
        [InlineKeyboardButton("🎮 Customer Says", url=f"{DEMO_SITE}/puma-customer-game.html")],
        [InlineKeyboardButton("🎮 Build the Basket", url=f"{DEMO_SITE}/puma-basket-game-v2.html")],
        [InlineKeyboardButton("🎮 The Approach", url=f"{DEMO_SITE}/puma-approach-game.html")],
    ]

    await update.message.reply_text(
        "🏪 PRL Sales Training\n\n"
        "📝 MISSIONS\n"
        "  1 · The 5-30-60 Rule\n"
        "  2 · Kill 'Can I Help?'\n"
        "  3 · The 70/30 Rule\n\n"
        "🎯 GAMES — practise daily\n\n"
        "💡 Read lesson → Take quiz → Play games → Apply on floor",
        reply_markup=InlineKeyboardMarkup(keyboard),
    )


async def quiz_cmd(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    chat = update.effective_chat

    args = ctx.args
    if args and args[0] == "all":
        questions = ALL_QUESTIONS
        mission_num = "all"
    elif args and args[0].isdigit():
        mission_num = int(args[0])
        questions = [q for q in ALL_QUESTIONS if q["mission"] == mission_num]
        if not questions:
            await update.message.reply_text(f"No questions for mission {mission_num}.")
            return
    else:
        mission_num = 1
        questions = [q for q in ALL_QUESTIONS if q["mission"] == 1]

    if user.id in active_quizzes:
        await update.message.reply_text("You already have a quiz running. Finish it first.")
        return

    active_quizzes[user.id] = {
        "name": user.first_name,
        "current_q": 0,
        "score": 0,
        "streak": 0,
        "best_streak": 0,
        "answers": [],
        "chat_id": chat.id,
        "questions": questions,
        "mission": mission_num,
        "started": datetime.now().isoformat(),
    }

    # Send mission intro
    if mission_num != "all" and mission_num in MISSION_INTROS:
        await update.message.reply_text(MISSION_INTROS[mission_num])
    elif mission_num == "all":
        await update.message.reply_text(
            "Full Assessment — All 3 Missions\n"
            "━━━━━━━━━━━━━━━\n\n"
            "15 questions. Covers everything.\n"
            f"{QUIZ_TIMER}s per question. 80% to pass.\n\n"
            "Let's go."
        )

    await asyncio.sleep(2)
    await send_next_question(user.id, ctx)


async def send_next_question(user_id, ctx):
    state = active_quizzes.get(user_id)
    if not state:
        return

    q_index = state["current_q"]
    questions = state["questions"]

    if q_index >= len(questions):
        await finish_quiz(user_id, ctx)
        return

    q = questions[q_index]
    total = len(questions)

    # Check if we're crossing into a new mission (for "all" mode)
    if q_index > 0:
        prev_mission = questions[q_index - 1]["mission"]
        if q["mission"] != prev_mission and q["mission"] in MISSION_INTROS:
            await ctx.bot.send_message(
                chat_id=state["chat_id"],
                text=f"━━━━━━━━━━━━━━━\n\n{MISSION_INTROS[q['mission']]}"
            )
            await asyncio.sleep(2)

    # Send context message before the poll (with exit option)
    context_msg = q.get("context", "")
    if context_msg:
        progress = PROGRESS_BARS.get(q_index % 5, "")
        score_so_far = f"  ({state['score']}/{q_index} so far)" if q_index > 0 else ""
        exit_kb = [[InlineKeyboardButton("✕ Exit quiz", callback_data="exit_quiz")]]
        await ctx.bot.send_message(
            chat_id=state["chat_id"],
            text=f"Q{q_index + 1}/{total} {progress}{score_so_far}\n\n{context_msg}",
            reply_markup=InlineKeyboardMarkup(exit_kb),
        )
        await asyncio.sleep(3)

    # Send the quiz poll
    try:
        msg = await ctx.bot.send_poll(
            chat_id=state["chat_id"],
            question=f"{q['question']}"[:300],
            options=q["options"],
            type=Poll.QUIZ,
            correct_option_id=q["correct"],
            explanation=q.get("explanation", "")[:200],
            is_anonymous=False,
            open_period=QUIZ_TIMER,
        )

        poll_map[msg.poll.id] = {
            "user_id": user_id,
            "q_index": q_index,
            "correct": q["correct"],
        }
    except Exception as e:
        print(f"Error sending poll Q{q_index + 1}: {e}")
        active_quizzes.pop(user_id, None)
        try:
            await ctx.bot.send_message(
                chat_id=state["chat_id"],
                text=f"Error sending question. Type /quiz to restart."
            )
        except Exception:
            pass


async def handle_answer(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    answer = update.poll_answer
    poll_data = poll_map.get(answer.poll_id)
    if not poll_data:
        return

    user_id = answer.user.id
    state = active_quizzes.get(user_id)

    # Group member answering someone else's quiz — track but don't advance
    if not state:
        for uid, s in active_quizzes.items():
            if s.get("current_q") == poll_data["q_index"]:
                key = str(user_id)
                if key not in all_scores:
                    all_scores[key] = {
                        "name": answer.user.first_name,
                        "scores": [],
                    }
                break
        return

    got_correct = (
        answer.option_ids and answer.option_ids[0] == poll_data["correct"]
    )

    if got_correct:
        state["score"] += 1
        state["streak"] += 1
        if state["streak"] > state["best_streak"]:
            state["best_streak"] = state["streak"]
    else:
        state["streak"] = 0

    state["answers"].append({
        "question": poll_data["q_index"],
        "chosen": answer.option_ids[0] if answer.option_ids else -1,
        "correct": poll_data["correct"],
        "got_it": got_correct,
    })

    q_index = poll_data["q_index"]
    q = state["questions"][q_index]

    # --- Post-answer response (wrapped to prevent stuck quiz) ---
    try:
        await asyncio.sleep(2)

        if got_correct:
            reaction = random.choice(CORRECT_REACTIONS)
            streak_msg = ""
            if state["streak"] >= 3:
                streak_msg = f"\n\n🔥 {state['streak']} in a row!"
            await ctx.bot.send_message(
                chat_id=state["chat_id"],
                text=f"✅ {reaction}{streak_msg}"
            )
        else:
            transition = random.choice(WRONG_TRANSITIONS)
            extended = q.get("extended", q.get("explanation", ""))
            lesson_url = q.get("lesson_url", "")

            text = f"❌ {transition}\n\n{extended}"

            if lesson_url:
                keyboard = [[
                    InlineKeyboardButton(
                        "📖 Review this lesson",
                        url=lesson_url
                    )
                ]]
                await ctx.bot.send_message(
                    chat_id=state["chat_id"],
                    text=text,
                    reply_markup=InlineKeyboardMarkup(keyboard),
                )
            else:
                await ctx.bot.send_message(
                    chat_id=state["chat_id"],
                    text=text,
                )
    except Exception as e:
        print(f"Error sending post-answer response: {e}")

    state["current_q"] += 1

    # Pause before next question (longer so user can read response)
    try:
        await asyncio.sleep(4)
        await send_next_question(user_id, ctx)
    except Exception as e:
        print(f"Error advancing to next question: {e}")
        # Clear stuck state so user can restart
        active_quizzes.pop(user_id, None)
        try:
            await ctx.bot.send_message(
                chat_id=state["chat_id"],
                text="Something went wrong. Type /quiz to restart."
            )
        except Exception:
            pass


def build_leaderboard_text():
    if not all_scores:
        return "No quiz results yet."

    board = []
    for uid, data in all_scores.items():
        if not data["scores"]:
            continue
        best = max(data["scores"], key=lambda s: s["pct"])
        board.append({
            "name": data["name"],
            "pct": best["pct"],
            "score": best["score"],
            "total": best["total"],
            "attempts": len(data["scores"]),
        })

    board.sort(key=lambda x: (-x["pct"], x["attempts"]))

    text = "🏆 LEADERBOARD\n━━━━━━━━━━━━━━━\n"
    for i, entry in enumerate(board, 1):
        medal = "🥇" if i == 1 else "🥈" if i == 2 else "🥉" if i == 3 else f"{i}."
        text += (
            f"{medal} {entry['name']}: {entry['pct']}% "
            f"({entry['score']}/{entry['total']}) "
            f"[{entry['attempts']} attempt{'s' if entry['attempts'] > 1 else ''}]\n"
        )

    return text


async def finish_quiz(user_id, ctx):
    state = active_quizzes.pop(user_id, None)
    if not state:
        return

    score = state["score"]
    total = len(state["questions"])
    pct = round(score / total * 100) if total else 0
    passed = pct >= 80
    mission = state["mission"]

    # Store in persistent scores
    key = str(user_id)
    if key not in all_scores:
        all_scores[key] = {"name": state["name"], "scores": []}

    all_scores[key]["scores"].append({
        "date": datetime.now().isoformat(),
        "score": score,
        "total": total,
        "pct": pct,
        "passed": passed,
        "mission": mission,
        "best_streak": state["best_streak"],
        "answers": state["answers"],
    })
    save_scores(all_scores)

    # Build detailed result
    wrong_qs = [a for a in state["answers"] if not a["got_it"]]

    if passed:
        # Celebration
        await ctx.bot.send_dice(chat_id=state["chat_id"], emoji="🎳")
        await asyncio.sleep(2)

        text = (
            f"🟢 {state['name']} — PASSED\n"
            f"━━━━━━━━━━━━━━━\n\n"
            f"Score: {score}/{total} ({pct}%)\n"
            f"Mission: {state['questions'][0]['mission_name']}\n"
        )
        if state["best_streak"] >= 3:
            text += f"Best streak: 🔥 {state['best_streak']} in a row\n"
        text += "\nWell done. You know your stuff."
    else:
        text = (
            f"🔴 {state['name']} — {score}/{total} ({pct}%)\n"
            f"━━━━━━━━━━━━━━━\n\n"
            f"Mission: {state['questions'][0]['mission_name']}\n"
            f"Need 80% to pass ({int(total * 0.8)}/{total} correct).\n\n"
        )
        # Tell them which questions they got wrong
        if wrong_qs:
            text += "Review these:\n"
            for wq in wrong_qs:
                q_num = wq["question"] + 1
                q_text = state["questions"][wq["question"]]["question"].split("\n")[0][:60]
                text += f"  ❌ Q{q_num}: {q_text}...\n"

    await ctx.bot.send_message(chat_id=state["chat_id"], text=text)

    # Auto-show leaderboard
    await asyncio.sleep(1)
    lb_text = build_leaderboard_text()
    await ctx.bot.send_message(chat_id=state["chat_id"], text=lb_text)

    # If failed: retry button + lesson links for WRONG questions specifically
    if not passed:
        mission_key = "all" if mission == "all" else str(mission)

        # Collect unique missions from wrong answers only
        wrong_missions = {}
        for a in state["answers"]:
            if not a["got_it"]:
                q = state["questions"][a["question"]]
                m = q["mission"]
                if m not in wrong_missions:
                    wrong_missions[m] = q.get("mission_name", f"Mission {m}")

        keyboard = [
            [InlineKeyboardButton("🔄 Retry Quiz", callback_data=f"retry_{mission_key}")],
        ]
        for m_num, m_name in wrong_missions.items():
            lesson_url = f"{DEMO_SITE}/mission-{m_num:02d}.html"
            keyboard.append([InlineKeyboardButton(f"📖 {m_name}", url=lesson_url)])

        await ctx.bot.send_message(
            chat_id=state["chat_id"],
            text="Review the lessons you missed, then retry.",
            reply_markup=InlineKeyboardMarkup(keyboard),
        )


async def retry_callback(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    user = query.from_user
    mission_str = query.data.split("_", 1)[1]

    if user.id in active_quizzes:
        await query.edit_message_text("You already have a quiz running. Finish it first.")
        return

    if mission_str == "all":
        questions = ALL_QUESTIONS
        mission = "all"
    else:
        mission_num = int(mission_str)
        mission = mission_num
        questions = [q for q in ALL_QUESTIONS if q["mission"] == mission_num]

    if not questions:
        await query.edit_message_text("No questions found.")
        return

    active_quizzes[user.id] = {
        "name": user.first_name,
        "current_q": 0,
        "score": 0,
        "streak": 0,
        "best_streak": 0,
        "answers": [],
        "chat_id": query.message.chat_id,
        "questions": questions,
        "mission": mission,
        "started": datetime.now().isoformat(),
    }

    total = len(questions)
    mission_name = questions[0]["mission_name"]
    await query.edit_message_text(
        f"Round 2. Let's go.\n\n"
        f"{mission_name}\n"
        f"{total} questions, {QUIZ_TIMER}s each."
    )

    await asyncio.sleep(2)
    await send_next_question(user.id, ctx)


async def start_mission_callback(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    """Handle mission selection from inline buttons."""
    query = update.callback_query
    await query.answer()

    user = query.from_user
    mission_str = query.data.split("_", 1)[1]  # "1", "2", "3", or "all"

    if user.id in active_quizzes:
        await query.edit_message_text("You already have a quiz running. Finish it first, or /reset to clear.")
        return

    if mission_str == "all":
        questions = ALL_QUESTIONS
        mission = "all"
    else:
        mission_num = int(mission_str)
        mission = mission_num
        questions = [q for q in ALL_QUESTIONS if q["mission"] == mission_num]

    if not questions:
        await query.edit_message_text("No questions found for that mission.")
        return

    active_quizzes[user.id] = {
        "name": user.first_name,
        "current_q": 0,
        "score": 0,
        "streak": 0,
        "best_streak": 0,
        "answers": [],
        "chat_id": query.message.chat_id,
        "questions": questions,
        "mission": mission,
        "started": datetime.now().isoformat(),
    }

    # Replace buttons with mission intro
    if mission != "all" and mission in MISSION_INTROS:
        await query.edit_message_text(MISSION_INTROS[mission])
    elif mission == "all":
        await query.edit_message_text(
            "Full Assessment — All 3 Missions\n"
            "━━━━━━━━━━━━━━━\n\n"
            "15 questions. Covers everything.\n"
            f"{QUIZ_TIMER}s per question. 80% to pass.\n\n"
            "Let's go."
        )

    await asyncio.sleep(2)
    await send_next_question(user.id, ctx)


async def group_logger(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    """Log group chat ID when bot receives any message in a group."""
    chat = update.effective_chat
    if chat and chat.type in ("group", "supergroup"):
        GROUP_FILE.write_text(str(chat.id))
        print(f"Group detected: {chat.id} ({chat.title})")


async def exit_quiz_callback(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    """Exit mid-quiz via inline button."""
    query = update.callback_query
    await query.answer()

    user_id = query.from_user.id
    state = active_quizzes.pop(user_id, None)

    if state:
        score = state["score"]
        answered = state["current_q"]
        try:
            await query.edit_message_text(
                f"Quiz stopped. {score}/{answered} correct so far."
            )
        except Exception:
            pass
        # Send fresh start prompt as new message (not edit)
        await ctx.bot.send_message(
            chat_id=query.message.chat_id,
            text="Type /start to pick a new quiz or game."
        )
    else:
        try:
            await query.edit_message_text("Already exited.")
        except Exception:
            pass


async def reset_cmd(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    """Unstick a frozen quiz. Clears active state for this user."""
    user_id = update.effective_user.id
    if user_id in active_quizzes:
        active_quizzes.pop(user_id)
        await update.message.reply_text("Quiz reset. Type /start to pick a new quiz or game.")
    else:
        await update.message.reply_text("No active quiz to reset.")


async def leaderboard(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    text = build_leaderboard_text()
    await update.message.reply_text(text)


async def export_cmd(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    """Admin-only: not shown in menu or /start help."""
    if not all_scores:
        await update.message.reply_text("No data to export.")
        return

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Name", "Date", "Mission", "Score", "Total",
        "Percentage", "Passed", "Best Streak", "Attempt #"
    ])

    for uid, data in all_scores.items():
        for i, s in enumerate(data["scores"], 1):
            writer.writerow([
                data["name"],
                s["date"][:10],
                s.get("mission", ""),
                s["score"],
                s["total"],
                s["pct"],
                "Yes" if s["passed"] else "No",
                s.get("best_streak", ""),
                i,
            ])

    output.seek(0)
    await update.message.reply_document(
        document=io.BytesIO(output.getvalue().encode()),
        filename=f"quiz-results-{datetime.now().strftime('%Y-%m-%d')}.csv",
        caption="Quiz results export",
    )


async def stats_cmd(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    """Admin-only: question-level analytics."""
    if not all_scores:
        await update.message.reply_text("No data yet.")
        return

    # Build per-question stats
    q_stats = {}
    for uid, data in all_scores.items():
        for s in data["scores"]:
            for a in s.get("answers", []):
                qi = a["question"]
                if qi not in q_stats:
                    q_stats[qi] = {"correct": 0, "total": 0}
                q_stats[qi]["total"] += 1
                if a["got_it"]:
                    q_stats[qi]["correct"] += 1

    if not q_stats:
        await update.message.reply_text("No answer data yet.")
        return

    text = "📊 QUESTION ANALYTICS\n━━━━━━━━━━━━━━━\n\n"

    for qi in sorted(q_stats.keys()):
        stat = q_stats[qi]
        rate = round(stat["correct"] / stat["total"] * 100) if stat["total"] else 0
        bar = "🟢" if rate >= 80 else "🟡" if rate >= 50 else "🔴"

        q_text = ALL_QUESTIONS[qi]["question"].split("\n")[0][:45] if qi < len(ALL_QUESTIONS) else "?"
        text += f"{bar} Q{qi+1}: {rate}% correct ({stat['correct']}/{stat['total']})\n"
        text += f"   {q_text}...\n\n"

    await update.message.reply_text(text)


async def post_init(app: Application):
    await app.bot.set_my_commands([
        BotCommand("start", "Choose a mission"),
        BotCommand("quiz", "Quick start Mission 1"),
        BotCommand("leaderboard", "See top scores"),
        BotCommand("reset", "Unstick a frozen quiz"),
    ])


def main():
    if not TOKEN:
        print("Set TELEGRAM_BOT_TOKEN environment variable.")
        print("Get one from @BotFather on Telegram.")
        return

    app = Application.builder().token(TOKEN).post_init(post_init).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("quiz", quiz_cmd))
    app.add_handler(CommandHandler("leaderboard", leaderboard))
    app.add_handler(CommandHandler("reset", reset_cmd))
    app.add_handler(CommandHandler("export", export_cmd))
    app.add_handler(CommandHandler("stats", stats_cmd))
    app.add_handler(PollAnswerHandler(handle_answer))
    app.add_handler(CallbackQueryHandler(start_mission_callback, pattern="^start_"))
    app.add_handler(CallbackQueryHandler(exit_quiz_callback, pattern="^exit_quiz"))
    app.add_handler(CallbackQueryHandler(retry_callback, pattern="^retry_"))
    # Log group chat IDs (low priority, runs on any group message)
    app.add_handler(MessageHandler(filters.ChatType.GROUPS, group_logger), group=-1)

    print("PRL Quiz Bot v2 running. Press Ctrl+C to stop.")
    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
