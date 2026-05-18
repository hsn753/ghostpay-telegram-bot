import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import axios from "axios";
import { IncomingWebhook } from "@slack/webhook";

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:3000";
const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK_URL;

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
const sessions = new Map<string, any>();

let slackWebhook: IncomingWebhook | null = null;
if (SLACK_WEBHOOK) {
  slackWebhook = new IncomingWebhook(SLACK_WEBHOOK);
}

bot.on("polling_error", (error: Error) => {
  console.error("Telegram polling error:", error);
});

// Start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  sessions.set(chatId.toString(), { step: "WALLET_INPUT" });

  await bot.sendMessage(
    chatId,
    "👻 *Welcome to Ghostware Support!*\n\nHey there! We're here to help you track your transactions and get support.\n\n🌐 *Visit our app:* https://app.ghostwareos.com/\n\n📱 *Let's get started!*\nPlease enter your wallet address:",
    { parse_mode: "Markdown" }
  );
});

// Help command
bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
  
  await bot.sendMessage(
    chatId,
    "🆘 *Ghostware Support Help*\n\n*Available Commands:*\n• `/start` - Start a new support session\n• `/help` - Show this help menu\n\n*How to use:*\n1️⃣ Enter your wallet address\n2️⃣ Select if you're sender or receiver\n3️⃣ Choose your product (Pay/Swap/Send)\n4️⃣ Either enter Ghost ID or fetch recent transactions\n\n*Need Help?*\nCreate a support ticket anytime during the flow!\n\n🌐 *Visit:* https://app.ghostwareos.com/",
    { 
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🚀 Start New Session", callback_data: "start_new" }],
          [{ text: "📋 View My Tickets", callback_data: "my_tickets" }]
        ]
      }
    }
  );
});

// Handle all callbacks
bot.on("callback_query", async (query) => {
  const chatId = query.message!.chat.id;
  const userId = chatId.toString();
  const data = query.data!;

  await bot.answerCallbackQuery(query.id);

  // Start new session
  if (data === "start_new") {
    sessions.set(userId, { step: "WALLET_INPUT" });
    await bot.sendMessage(
      chatId,
      "� *Welcome to GhostWare Support!*\\n\\n🔍 Please send me your *Solana wallet address* to get started.",
      { parse_mode: "Markdown" }
    );
  }
  
  // Back to role menu
  else if (data === "back_to_role_menu") {
    const session = sessions.get(userId);
    if (session?.pending_wallet) {
      await showRoleSelection(chatId, session.pending_wallet);
    } else {
      await bot.sendMessage(chatId, "Please /start again to enter your wallet address.");
    }
  }

  // Go back handler
  if (data === "go_back") {
    const session = sessions.get(userId);
    if (session) {
      if (session.step === "PRODUCT") {
        session.step = "WALLET_ROLE";
        sessions.set(userId, session);
        await showRoleSelection(chatId, session.pending_wallet);
      } else if (session.step === "LOOKUP_METHOD") {
        session.step = "PRODUCT";
        delete session.product_type;
        sessions.set(userId, session);
        await showProductSelection(chatId);
      } else {
        sessions.delete(userId);
        await bot.sendMessage(chatId, "Let's start over. Please /start");
      }
    }
    return;
  }

  // Wallet role selection
  if (data.startsWith("wallet_role_")) {
    const role = data.replace("wallet_role_", "");
    const session = sessions.get(userId);
    
    if (!session || !session.pending_wallet) {
      await bot.sendMessage(chatId, "Session expired. Please /start again.");
      return;
    }
    
    session.identifier_type = role === "sender" ? "WALLET_SENDER" : "WALLET_RECEIVER";
    session.identifier_value = session.pending_wallet;
    session.step = "PRODUCT";
    sessions.set(userId, session);
    
    await showProductSelection(chatId);
  }

  // Product selection
  else if (data.startsWith("product_")) {
    const product = data.replace("product_", "");
    const session = sessions.get(userId);
    
    if (!session) {
      await bot.sendMessage(chatId, "Session expired. Please /start again.");
      return;
    }
    
    session.product_type = product;
    session.step = "LOOKUP_METHOD";
    sessions.set(userId, session);
    
    await showLookupMethodMenu(chatId);
  }

  // Lookup method - Ghost ID
  else if (data === "method_ghost_id") {
    const session = sessions.get(userId);
    
    if (!session) {
      await bot.sendMessage(chatId, "Session expired. Please /start again.");
      return;
    }
    
    session.step = "GHOST_ID_INPUT";
    sessions.set(userId, session);
    
    await bot.sendMessage(
      chatId,
      "🔑 *Enter your Ghost ID*\n\nExample: `04aaf9584dba`",
      { 
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [[{ text: "⬅️ Go Back", callback_data: "go_back" }]]
        }
      }
    );
  }

  // Lookup method - Recent transactions
  else if (data === "method_recent") {
    const session = sessions.get(userId);
    
    if (!session) {
      await bot.sendMessage(chatId, "Session expired. Please /start again.");
      return;
    }
    
    await fetchRecentTransactions(chatId, session, 0);
  }

  // Transaction selection
  else if (data.startsWith("select_tx_")) {
    const session = sessions.get(userId);
    if (!session || !session.all_transactions) {
      await bot.sendMessage(chatId, "Session expired. Please /start again.");
      return;
    }

    const txIndex = parseInt(data.replace("select_tx_", ""));
    const tx = session.all_transactions[txIndex];

    if (!tx) {
      await bot.sendMessage(chatId, "Transaction not found.");
      return;
    }

    // Store selected transaction in session
    session.selected_transaction = tx;
    sessions.set(userId, session);

    await displayTransactionDetails(chatId, tx);
  }

  // Show more pagination
  else if (data.startsWith("show_more_")) {
    const offset = parseInt(data.replace("show_more_", ""));
    const session = sessions.get(userId);
    
    if (!session) {
      await bot.sendMessage(chatId, "Session expired. Please /start again.");
      return;
    }
    
    await fetchRecentTransactions(chatId, session, offset);
  }

  // My tickets
  else if (data === "my_tickets") {
    await handleMyTickets(chatId, userId);
  }
  
  // View specific ticket conversation
  else if (data.startsWith("view_ticket_")) {
    const ticketId = data.replace("view_ticket_", "");
    await handleViewTicketConversation(chatId, userId, ticketId);
  }
  
  // Send reply to ticket
  else if (data.startsWith("reply_ticket_")) {
    const ticketId = data.replace("reply_ticket_", "");
    const session = sessions.get(userId);
    sessions.set(userId, { ...session, step: "TICKET_REPLY", active_ticket_id: ticketId });
    await bot.sendMessage(chatId, "✍️ *Type your reply*\n\nSend your message and I'll forward it to the support team.", {
      parse_mode: "Markdown"
    });
  }
  
  // Back to ticket list
  else if (data === "back_to_tickets") {
    await handleMyTickets(chatId, userId);
  }

  // Create ticket
  else if (data === "create_ticket") {
    const session = sessions.get(userId);
    if (!session) {
      await bot.sendMessage(chatId, "Session expired. Please /start again.");
      return;
    }
    session.step = "QUERY";
    sessions.set(userId, session);
    await bot.sendMessage(chatId, "📝 *Describe your issue*\n\nPlease tell me what's wrong and I'll create a support ticket for you.", { parse_mode: "Markdown" });
  }
});

// Handle text messages
bot.on("message", async (msg) => {
  if (!msg.text || msg.text.startsWith("/")) return;

  const chatId = msg.chat.id;
  const userId = chatId.toString();
  const session = sessions.get(userId);

  if (!session) {
    await bot.sendMessage(chatId, "Please start with /start");
    return;
  }

  // Handle ticket reply
  if (session.step === "TICKET_REPLY" && session.active_ticket_id) {
    await handleSendTicketReply(chatId, userId, session.active_ticket_id, msg.text);
    return;
  }

  if (session.step === "WALLET_INPUT") {
    await handleWalletInput(chatId, userId, msg.text, session);
  } else if (session.step === "GHOST_ID_INPUT") {
    await handleGhostIdInput(chatId, userId, msg.text, session);
  } else if (session.step === "QUERY") {
    await handleQuery(chatId, userId, msg.text, msg.from!, session);
  }
});

// Helper Functions

async function showRoleSelection(chatId: number, wallet: string) {
  await bot.sendMessage(
    chatId,
    "📱 *Got your wallet!*\n\n" + wallet + "\n\nAre you the sender or receiver?",
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "👤 I'm the Sender", callback_data: "wallet_role_sender" },
            { text: "👥 I'm the Receiver", callback_data: "wallet_role_receiver" },
          ],
          [{ text: "📋 View My Tickets", callback_data: "my_tickets" }],
          [{ text: "⬅️ Go Back", callback_data: "go_back" }]
        ],
      },
    }
  );
}

async function showProductSelection(chatId: number) {
  await bot.sendMessage(
    chatId,
    "✅ *Great!*\n\nWhich product are you using?",
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [
            { text: "💸 GhostPay", callback_data: "product_GHOSTPAY" },
            { text: "🔄 GhostSwap", callback_data: "product_GHOSTSWAP" },
          ],
          [
            { text: "📤 GhostSend", callback_data: "product_GHOSTSEND" },
          ],
          [{ text: "⬅️ Go Back", callback_data: "go_back" }]
        ],
      },
    }
  );
}

async function showLookupMethodMenu(chatId: number) {
  await bot.sendMessage(
    chatId,
    "🔍 *How would you like to find your transaction?*",
    {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "🔑 I have my Ghost ID", callback_data: "method_ghost_id" }],
          [{ text: "📋 Fetch my recent transactions", callback_data: "method_recent" }],
          [{ text: "⬅️ Go Back", callback_data: "go_back" }]
        ],
      },
    }
  );
}

async function handleWalletInput(chatId: number, userId: string, text: string, session: any) {
  const trimmedText = text.trim();
  
  // Validate Solana wallet address
  if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(trimmedText)) {
    await bot.sendMessage(
      chatId,
      "❌ That doesn't look like a valid Solana wallet address. Please try again or /start over.",
      { parse_mode: "Markdown" }
    );
    return;
  }
  
  session.pending_wallet = trimmedText;
  session.step = "WALLET_ROLE";
  sessions.set(userId, session);
  
  await showRoleSelection(chatId, trimmedText);
}

async function handleGhostIdInput(chatId: number, userId: string, text: string, session: any) {
  const trimmedText = text.trim();
  
  // Extract just the ID part if full format given
  let ghostId = trimmedText;
  if (trimmedText.includes(":")) {
    const parts = trimmedText.split(":");
    ghostId = parts[parts.length - 1];
  }
  
  try {
    await bot.sendMessage(chatId, "🔍 Looking up your transaction...");

    const url = BACKEND_URL + "/api/support/status/" + ghostId + "?type=GHOST_ID";
    const response = await axios.get(url);

    const result = response.data;
    if (!result.found) {
      await bot.sendMessage(
        chatId,
        "❌ *Transaction Not Found*\n\nCouldn't find a transaction with that Ghost ID. Please double-check or try fetching recent transactions.",
        { 
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "📋 Fetch Recent Transactions", callback_data: "method_recent" }],
              [{ text: "🎫 Create Support Ticket", callback_data: "create_ticket" }],
              [{ text: "⬅️ Go Back", callback_data: "go_back" }]
            ]
          }
        }
      );
      return;
    }
    await displayTransactionDetails(chatId, result);
  } catch (error) {
    console.error("Error looking up Ghost ID:", error);
    await bot.sendMessage(
      chatId,
      "❌ *Error*\n\nSomething went wrong. Please try again or create a support ticket.",
      { 
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🎫 Create Support Ticket", callback_data: "create_ticket" }],
            [{ text: "⬅️ Go Back", callback_data: "go_back" }]
          ]
        }
      }
    );
  }
}

async function fetchRecentTransactions(chatId: number, session: any, offset: number) {
  try {
    await bot.sendMessage(chatId, "🔍 Fetching your recent transactions...");

    const url = BACKEND_URL + "/api/support/payments/" + session.identifier_value + "?type=" + session.identifier_type + "&filter=all";
    const response = await axios.get(url);
    const transactions = response.data.transactions || [];

    if (transactions.length === 0) {
      await bot.sendMessage(
        chatId,
        "📭 *No transactions found*\n\nCouldn't find any transactions for this wallet.",
        { 
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "🎫 Create Support Ticket", callback_data: "create_ticket" }],
              [{ text: "⬅️ Go Back", callback_data: "go_back" }]
            ]
          }
        }
      );
      return;
    }

    // Filter out expired transactions and filter by product type
    let filteredTxs = transactions.filter((tx: any) => tx.status_label !== "EXPIRED");
    
    if (session.product_type) {
      // Map support ticket product types to payments table tx_types
      const txTypeMap: Record<string, string> = {
        "GHOSTPAY": "PAYMENT",
        "GHOSTSWAP": "SWAP",
        "GHOSTSEND": "SEND"
      };
      const txType = txTypeMap[session.product_type] || session.product_type;
      
      filteredTxs = filteredTxs.filter((tx: any) => tx.tx_type === txType);
      
      if (filteredTxs.length === 0) {
        await bot.sendMessage(
          chatId,
          "📭 *No " + session.product_type + " transactions found*\n\nCouldn't find any " + session.product_type + " transactions for this wallet.",
          { 
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [{ text: "🎫 Create Support Ticket", callback_data: "create_ticket" }],
                [{ text: "⬅️ Go Back", callback_data: "go_back" }]
              ]
            }
          }
        );
        return;
      }
    }

    // Store all transactions
    session.all_transactions = filteredTxs;
    sessions.set(chatId.toString(), session);

    // Show 5 at a time
    const pageSize = 5;
    const startIdx = offset;
    const endIdx = Math.min(startIdx + pageSize, filteredTxs.length);
    const pageTxs = filteredTxs.slice(startIdx, endIdx);

    const statusEmojis: Record<string, string> = {
      "NEW": "🆕", "WAITING": "⏳", "CONFIRMING": "🔄",
      "EXCHANGING": "🔄", "ANONYMIZING": "🔐", "FINISHED": "✅",
      "EXPIRED": "⏰", "FAILED": "❌", "REFUNDED": "💸"
    };

    const txWord = filteredTxs.length > 1 ? 'transactions' : 'transaction';
    let message = "📋 *Found " + filteredTxs.length + " " + txWord + "*\n\nShowing " + (startIdx + 1) + "-" + endIdx + " of " + filteredTxs.length + "\n\n";

    const buttons: any[] = [];
    pageTxs.forEach((tx: any, index: number) => {
      const globalIndex = startIdx + index;
      const emoji = statusEmojis[tx.status_label] || "📌";
      const timeAgo = getTimeAgo(new Date(tx.created_at));
      const amount = tx.amount_in || tx.amount_out || "N/A";
      const asset = tx.asset_in || tx.asset_out || "";
      
      const shortId = tx.houdini_id.substring(0, 12);
      message += (globalIndex + 1) + ". *" + shortId + "...* " + emoji + "\n";
      message += "   " + amount + " " + asset + " - " + timeAgo + " - " + tx.status_label + "\n\n";
      
      buttons.push([{ text: (globalIndex + 1) + ". View Details", callback_data: "select_tx_" + globalIndex }]);
    });

    // Navigation buttons
    const navButtons = [];
    if (endIdx < filteredTxs.length) {
      navButtons.push({ text: "➡️ Show More", callback_data: "show_more_" + endIdx });
    }
    navButtons.push({ text: "⬅️ Go Back", callback_data: "go_back" });
    buttons.push(navButtons);

    await bot.sendMessage(chatId, message, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: buttons
      }
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    await bot.sendMessage(
      chatId,
      "❌ *Error*\n\nSomething went wrong fetching your transactions. Please try again.",
      { 
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "🎫 Create Support Ticket", callback_data: "create_ticket" }],
            [{ text: "⬅️ Go Back", callback_data: "go_back" }]
          ]
        }
      }
    );
  }
}

async function displayTransactionDetails(chatId: number, tx: any) {
  const statusEmojis: Record<string, string> = {
    "NEW": "🆕", "WAITING": "⏳", "CONFIRMING": "🔄",
    "EXCHANGING": "🔄", "ANONYMIZING": "🔐", "FINISHED": "✅",
    "EXPIRED": "⏰", "FAILED": "❌", "REFUNDED": "💸"
  };

  let message = "📊 *Transaction Details*\n\n";
  message += "🔑 *Ghost ID:* `" + tx.houdini_id + "`\n";
  const statusEmoji = statusEmojis[tx.status_label] || "📍";
  message += statusEmoji + " *Status:* " + tx.status_label + "\n";
  message += "🔖 *Type:* " + tx.tx_type + "\n\n";

  if (tx.asset_in) {
    message += "📥 *Asset In:* " + tx.asset_in + "\n";
    message += "💰 *Amount In:* " + tx.amount_in + "\n";
  }
  if (tx.asset_out) {
    message += "📤 *Asset Out:* " + tx.asset_out + "\n";
    message += "💵 *Amount Out:* " + tx.amount_out + "\n\n";
  }

  if (tx.payer_address) {
    message += "👤 *Sender:* `" + tx.payer_address + "`\n";
  }
  if (tx.receiver_address) {
    message += "👥 *Receiver:* `" + tx.receiver_address + "`\n\n";
  }

  const timeAgo = getTimeAgo(new Date(tx.created_at));
  message += "🕐 *Created:* " + timeAgo;

  await bot.sendMessage(chatId, message, { 
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "🎫 Create Support Ticket", callback_data: "create_ticket" }],
        [{ text: "⬅️ Go Back", callback_data: "go_back" }],
      ],
    }
  });
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return diffMins + "m ago";
  if (diffHours < 24) return diffHours + "h ago";
  if (diffDays === 1) return "Yesterday";
  return diffDays + "d ago";
}

async function handleQuery(chatId: number, userId: string, text: string, user: any, session: any) {
  try {
    await bot.sendMessage(chatId, "📝 Creating your ticket...");

    const ticketData = {
      telegram_user_id: userId,
      telegram_username: user.username || "unknown",
      product_type: session.product_type || "OTHER",
      identifier_type: session.identifier_type || "UNKNOWN",
      identifier_value: session.identifier_value || "N/A",
      user_query: text,
      transaction_data: session.selected_transaction || null,
    };

    console.log("Creating ticket with data:", ticketData);

    const response = await axios.post(BACKEND_URL + "/api/support/tickets", ticketData);

    const ticket = response.data.ticket;

    await bot.sendMessage(
      chatId,
      "✅ *Ticket Created!*\n\n🎫 *Ticket #" + ticket.id + "*\n\nThanks for reaching out! Our team will review your issue and get back to you soon. You'll receive a notification right here when we respond.\n\nHang tight! 👻",
      { parse_mode: "Markdown" }
    );

    if (slackWebhook) {
      await slackWebhook.send({
        text: "🎫 New Support Ticket #" + ticket.id,
        blocks: [
          {
            type: "header",
            text: { type: "plain_text", text: "🎫 New Support Ticket #" + ticket.id, emoji: true },
          },
          {
            type: "section",
            fields: [
              { type: "mrkdwn", text: "*Product:*\n" + ticket.product_type },
              { type: "mrkdwn", text: "*Status:*\nOPEN" },
              { type: "mrkdwn", text: "*User:*\n@" + (user.username || userId) },
              { type: "mrkdwn", text: "*Identifier:*\n" + ticket.identifier_value },
            ],
          },
          {
            type: "section",
            text: { type: "mrkdwn", text: "*User Query:*\n" + ticket.user_query },
          },
          {
            type: "context",
            elements: [
              { type: "mrkdwn", text: "Created: " + new Date().toLocaleString() }
            ]
          }
        ],
      });
    }

    session.step = "COMPLETE";
    sessions.set(userId, session);
    
    await bot.sendMessage(chatId, "What would you like to do next?", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📋 View My Tickets", callback_data: "my_tickets" }],
        ],
      },
    });
  } catch (error: any) {
    console.error("Error creating ticket:", error);
    console.error("Error details:", error.response?.data || error.message);
    
    const errorMsg = error.response?.data?.error || "Something went wrong";
    
    await bot.sendMessage(
      chatId, 
      "❌ *Error*\n\nSorry, " + errorMsg + ". Please try again or contact support.",
      { parse_mode: "Markdown" }
    );
  }
}

async function handleMyTickets(chatId: number, userId: string) {
  try {
    console.log("Fetching tickets for user:", userId);
    const response = await axios.get(BACKEND_URL + "/api/support/tickets/user/" + userId);
    const tickets = response.data.tickets;

    console.log("Tickets response:", tickets);

    if (!tickets || tickets.length === 0) {
      await bot.sendMessage(chatId, "� *Your Support Tickets*\n\nYou don't have any support tickets yet.", {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "⬅️ Go Back", callback_data: "back_to_role_menu" }]
          ]
        }
      });
      return;
    }

    const statusEmojis: Record<string, string> = {
      OPEN: "🔴",
      IN_PROGRESS: "�",
      WAITING_USER: "🟡",
      RESOLVED: "�",
    };

    let message = "📋 *Your Support Tickets*\n\nSelect a ticket to view the conversation:\n\n";

    // Create buttons for each ticket
    const ticketButtons = tickets.slice(0, 10).map((ticket: any) => {
      const emoji = statusEmojis[ticket.status] || "📌";
      const status = ticket.status.replace(/_/g, ' ');
      return [{ 
        text: `${emoji} Ticket #${ticket.id} - ${status}`, 
        callback_data: `view_ticket_${ticket.id}` 
      }];
    });

    ticketButtons.push([{ text: "⬅️ Go Back", callback_data: "back_to_role_menu" }]);

    console.log("Sending tickets message:", message);
    await bot.sendMessage(chatId, message, { 
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: ticketButtons
      }
    });
  } catch (error: any) {
    console.error("Error fetching tickets:", error);
    console.error("Error response:", error.response?.data);
    await bot.sendMessage(
      chatId, 
      "❌ *Error*\n\nCouldn't fetch your tickets right now. Please try again in a moment.",
      { parse_mode: "Markdown" }
    );
  }
}

async function handleSendTicketReply(chatId: number, userId: string, ticketId: string, replyText: string) {
  try {
    // Send reply to backend
    await axios.post(`${BACKEND_URL}/api/support/tickets/${ticketId}/messages`, {
      sender_type: "USER",
      sender_id: userId,
      message: replyText
    });
    
    await bot.sendMessage(chatId, "✅ *Reply Sent!*\n\nYour message has been sent to the support team.", {
      parse_mode: "Markdown"
    });
    
    // Clear the reply state and show the updated conversation
    const session = sessions.get(userId);
    if (session) {
      delete session.step;
      delete session.active_ticket_id;
      sessions.set(userId, session);
    }
    
    // Show updated conversation
    await handleViewTicketConversation(chatId, userId, ticketId);
  } catch (error: any) {
    console.error("Error sending ticket reply:", error);
    await bot.sendMessage(chatId, "❌ *Error*\n\nCouldn't send your reply. Please try again.", {
      parse_mode: "Markdown"
    });
  }
}

async function handleViewTicketConversation(chatId: number, userId: string, ticketId: string) {
  try {
    // Fetch ticket info and messages
    const [ticketResponse, messagesResponse] = await Promise.all([
      axios.get(`${BACKEND_URL}/api/support/tickets/user/${userId}`),
      axios.get(`${BACKEND_URL}/api/support/tickets/${ticketId}/messages`)
    ]);
    
    const ticket = ticketResponse.data.tickets.find((t: any) => t.id === parseInt(ticketId));
    const messages = messagesResponse.data.messages;
    
    if (!ticket) {
      await bot.sendMessage(chatId, "❌ Ticket not found.", {
        reply_markup: {
          inline_keyboard: [
            [{ text: "⬅️ Back to Tickets", callback_data: "back_to_tickets" }]
          ]
        }
      });
      return;
    }
    
    // Check if ticket is resolved or closed
    const isTicketClosed = ticket.status === 'RESOLVED' || ticket.status === 'CLOSED';
    
    // Build conversation message
    let conversationText = `💬 *Ticket #${ticketId} - Conversation*\n`;
    conversationText += `Status: ${ticket.status.replace(/_/g, ' ')}\n\n`;
    
    if (!messages || messages.length === 0) {
      conversationText += "_No messages yet._\n\n";
    } else {
      for (const msg of messages) {
        const timestamp = new Date(msg.created_at).toLocaleString();
        const sender = msg.sender_type === 'USER' ? '👤 You' : '👨‍💼 Support Rep';
        // Escape special markdown characters
        const escapedMessage = msg.message.replace(/([_*\[\]()~`>#+=|{}.!-])/g, '\\$1');
        conversationText += `${sender} - ${timestamp}\n${escapedMessage}\n\n`;
      }
    }
    
    if (isTicketClosed) {
      conversationText += "_This ticket has been closed. Replies are disabled._";
    }
    
    // Build buttons based on ticket status
    const buttons = [];
    if (!isTicketClosed) {
      buttons.push([{ text: "📤 Send Reply", callback_data: `reply_ticket_${ticketId}` }]);
    }
    buttons.push([{ text: "⬅️ Back to Tickets", callback_data: "back_to_tickets" }]);
    
    await bot.sendMessage(chatId, conversationText, {
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: buttons
      }
    });
  } catch (error: any) {
    console.error("Error fetching ticket conversation:", error);
    await bot.sendMessage(chatId, "❌ Couldn't load the conversation. Please try again.", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "⬅️ Back to Tickets", callback_data: "back_to_tickets" }]
        ]
      }
    });
  }
}

export async function sendMessageToUser(telegramUserId: string, ticketId: number, message: string) {
  try {
    await bot.sendMessage(
      parseInt(telegramUserId),
      "Ghostware Team (Ticket #" + ticketId + "):\n\n" + message
    );
  } catch (error) {
    console.error("Error sending message to user:", error);
    throw error;
  }
}

console.log("Telegram bot started");
