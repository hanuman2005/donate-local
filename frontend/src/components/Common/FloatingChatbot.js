import React, { useState, useRef, useEffect } from "react";

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm your DonateLocal assistant. I can help you donate or find items like electronics, furniture, clothing, food, and more! 🎁",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    "How does AI analysis work?",
    "What can I donate?",
    "How does QR verification work?",
    "Find items near me",
  ];

  const getFallbackResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    if (
      msg.includes("ai") ||
      msg.includes("analyze") ||
      msg.includes("analysis")
    ) {
      return "🤖 Our AI Analysis feature is amazing!\n\n1. Upload a photo of your unwanted item\n2. AI detects what it is (phone, chair, clothes, etc.)\n3. Get 3 smart suggestions:\n   ✅ REUSE - Repair guides & tips\n   ♻️ RECYCLE - Nearby centers\n   🎁 DONATE - High demand items\n\n4. Choose your option and create a listing if you want to donate!\n\nThis helps you make the most sustainable choice! 🌍";
    }

    if (
      msg.includes("what") &&
      (msg.includes("donate") || msg.includes("list"))
    ) {
      return "You can donate almost anything! 📦\n\nPopular categories:\n📱 Electronics (phones, laptops, appliances)\n🪑 Furniture (chairs, tables, sofas)\n👕 Clothing (clothes, shoes, accessories)\n📚 Books & Media\n🍎 Food (packaged & fresh)\n🧸 Toys & Baby Items\n🏠 Household Items\n🌱 Plants & Garden\n🎨 Hobby & Sports gear\n🔧 Tools\n\nIf it's in good condition, someone probably needs it!";
    }

    if (
      msg.includes("donate") ||
      msg.includes("create listing") ||
      msg.includes("how to")
    ) {
      return "To donate an item:\n\n1. 🤖 Use AI Analysis (optional but recommended!)\n   - Upload photo → Get suggestions\n\n2. 📝 Click 'Create Listing'\n   - Choose category\n   - Add title & description\n   - Upload photos\n   - Set pickup location\n\n3. 📍 Your listing goes live!\n\n4. 🔔 Get notified when someone's interested\n\n5. 💬 Chat to coordinate pickup\n\n6. 📱 Exchange using QR verification\n\nIt's that simple!";
    }

    if (
      msg.includes("find") ||
      msg.includes("nearby") ||
      msg.includes("search") ||
      msg.includes("browse")
    ) {
      return "To find items near you:\n\n1. 🗺️ Use the interactive map view\n   - See all nearby donations\n   - Filter by category\n   - Set distance radius (1-100km)\n\n2. 📋 Browse listings page\n   - Sort by distance, date, category\n   - Use search bar for specific items\n\n3. 🔔 Enable notifications\n   - Get alerts for new items nearby\n\n4. Click any listing to view full details!";
    }

    if (
      msg.includes("qr") ||
      msg.includes("verify") ||
      msg.includes("verification") ||
      msg.includes("scan")
    ) {
      return "🔒 QR Code Verification keeps exchanges safe!\n\nHow it works:\n1. After scheduling pickup, both users get QR codes\n\n2. At pickup location:\n   - Recipient scans donor's QR code\n   - Confirms item matches listing\n   - Both verify identity\n\n3. Exchange completes automatically\n\n4. Listing marked as completed\n\nThis prevents fraud and ensures safety! No personal info shared until verified. 📱✅";
    }

    if (
      msg.includes("schedule") ||
      msg.includes("pickup") ||
      msg.includes("time") ||
      msg.includes("when")
    ) {
      return "📅 Pickup Scheduling:\n\n1. After someone shows interest, open the chat\n\n2. Click 'Propose Pickup Time'\n\n3. Select date & time from calendar\n\n4. Recipient accepts or suggests alternative\n\n5. Both get confirmation with:\n   - Pickup time\n   - Location details\n   - QR codes for verification\n\n6. Automatic reminders sent!\n\nCoordinate details in chat before meeting.";
    }

    if (
      msg.includes("rating") ||
      msg.includes("review") ||
      msg.includes("reputation")
    ) {
      return "⭐ Rating System builds trust!\n\nAfter completing exchange:\n1. Both users rate each other (1-5 stars)\n2. Optional written review\n3. Ratings appear on profiles\n\nHigh ratings = trusted community member!\n\nBenefits:\n- Better matches from AI\n- More responses to your listings\n- Priority notifications\n- Community recognition\n\nBe respectful and reliable to build your reputation!";
    }

    if (
      msg.includes("chat") ||
      msg.includes("message") ||
      msg.includes("contact")
    ) {
      return "💬 Real-time Chat:\n\n1. Click 'I Want This' on any listing\n\n2. Chat opens automatically\n   - Ask questions about the item\n   - Discuss condition\n   - Coordinate pickup\n\n3. Features:\n   - Instant messaging\n   - Typing indicators\n   - Message history saved\n   - Notifications when they reply\n\n4. Stay anonymous until pickup is scheduled!\n\nBe polite and responsive for best results.";
    }

    if (
      msg.includes("category") ||
      msg.includes("categories") ||
      msg.includes("type")
    ) {
      return "📂 Item Categories:\n\n📱 Electronics\n🪑 Furniture\n👕 Clothing & Accessories\n📚 Books & Media\n🍎 Food Items\n🧸 Toys & Baby Items\n🏠 Household & Kitchen\n🌱 Plants & Garden\n🎨 Hobbies & Sports\n🔧 Tools & Equipment\n\nEach category has specific fields to help describe your item accurately!";
    }

    if (
      msg.includes("safe") ||
      msg.includes("safety") ||
      msg.includes("secure")
    ) {
      return "🔒 Your Safety Matters!\n\nSafety features:\n✅ No personal info until scheduled\n✅ QR code verification\n✅ Rating system filters bad actors\n✅ Report/block functionality\n✅ Public meeting spots recommended\n\nTips:\n- Meet in public places\n- Bring a friend if uncomfortable\n- Check user ratings first\n- Trust your instincts\n- Use QR verification always\n\nStay safe while helping others! 🛡️";
    }

    if (
      msg.includes("profile") ||
      msg.includes("account") ||
      msg.includes("settings")
    ) {
      return "👤 Manage Your Profile:\n\n1. Click avatar (top right)\n2. Go to 'Profile'\n\nYou can update:\n- Name & bio\n- Profile picture\n- Location\n- Contact preferences\n- Notification settings\n\nGood profiles get more responses!\n\nTips:\n✨ Add a clear photo\n✨ Write a friendly bio\n✨ Keep info updated\n✨ Build your rating";
    }

    if (
      msg.includes("impact") ||
      msg.includes("stats") ||
      msg.includes("analytics") ||
      msg.includes("environment")
    ) {
      return "🌍 Your Impact Matters!\n\nView your dashboard to see:\n📦 Items donated/received\n💚 CO2 emissions prevented\n💰 Money saved by community\n🤝 Successful exchanges\n\nEach donation:\n- Keeps items from landfills\n- Reduces carbon footprint\n- Helps people save money\n- Builds community connections\n\nTogether we're making a difference! ♻️";
    }

    if (
      msg.includes("help") ||
      msg.includes("support") ||
      msg.includes("how")
    ) {
      return "I can help you with:\n\n🤖 AI item analysis\n📝 Creating donations\n🔍 Finding items nearby\n💬 Chat & messaging\n📅 Pickup scheduling\n📱 QR verification\n⭐ Rating system\n🔒 Safety tips\n👤 Profile management\n\nJust ask me anything! What would you like to know?";
    }

    return "I'm here to help! You can ask me about:\n\n🤖 How AI analysis works\n📦 What you can donate\n🔍 Finding items near you\n📱 QR code verification\n💬 Chat & coordination\n⭐ Rating system\n🔒 Safety features\n\nWhat would you like to know?";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:5000/api/chatbot/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentInput,
          conversationHistory: messages.slice(-6),
        }),
      });

      if (!response.ok) throw new Error("API unavailable");

      const data = await response.json();

      const botResponse = {
        text: data.reply || getFallbackResponse(currentInput),
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Chat error:", error);

      const botResponse = {
        text: getFallbackResponse(currentInput),
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (reply) => {
    setInput(reply);
    setTimeout(() => handleSend(), 100);
  };

  // Get computed styles from CSS variables
  const getCSSVar = (varName) => {
    if (typeof window === "undefined") return "";
    return getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
        fontFamily: "Inter, sans-serif",
      }}
      role="complementary"
      aria-label="Chat assistant"
    >
      {isOpen && (
        <div
          style={{
            width: "380px",
            height: "600px",
            background: "var(--bg-card)",
            borderRadius: "var(--radius-2xl)",
            boxShadow: "var(--shadow-xl)",
            display: "flex",
            flexDirection: "column",
            marginBottom: "10px",
            overflow: "hidden",
            animation: "slideUp 0.3s ease-out",
            border: "1px solid var(--border-color)",
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Chat with DonateLocal Assistant"
        >
          {/* Header */}
          <div
            style={{
              background: "var(--gradient-primary)",
              color: "var(--text-inverse)",
              padding: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                }}
                aria-hidden="true"
              >
                🤖
              </div>
              <div>
                <div style={{ fontWeight: "600", fontSize: "16px" }}>
                  DonateLocal Assistant
                </div>
                <div style={{ fontSize: "12px", opacity: 0.9 }}>
                  AI-powered help 24/7
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-inverse)",
                fontSize: "24px",
                cursor: "pointer",
                padding: "0",
                width: "30px",
                height: "30px",
              }}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "20px",
              background: "var(--bg-secondary)",
            }}
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    background:
                      msg.sender === "user"
                        ? "var(--gradient-primary)"
                        : "var(--bg-card)",
                    color:
                      msg.sender === "user"
                        ? "var(--text-inverse)"
                        : "var(--text-primary)",
                    padding: "12px 16px",
                    borderRadius: "var(--radius-lg)",
                    borderBottomLeftRadius:
                      msg.sender === "bot" ? "4px" : "var(--radius-lg)",
                    borderBottomRightRadius:
                      msg.sender === "user" ? "4px" : "var(--radius-lg)",
                    boxShadow: "var(--shadow-sm)",
                    whiteSpace: "pre-line",
                    fontSize: "14px",
                    lineHeight: "1.5",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginBottom: "16px",
                }}
                role="status"
                aria-label="Assistant is typing"
              >
                <div
                  style={{
                    background: "var(--bg-card)",
                    padding: "12px 16px",
                    borderRadius: "var(--radius-lg)",
                    borderBottomLeftRadius: "4px",
                    boxShadow: "var(--shadow-sm)",
                    display: "flex",
                    gap: "4px",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "var(--text-muted)",
                      animation: "bounce 1.4s infinite ease-in-out both",
                      animationDelay: "0s",
                    }}
                  ></span>
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "var(--text-muted)",
                      animation: "bounce 1.4s infinite ease-in-out both",
                      animationDelay: "0.16s",
                    }}
                  ></span>
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "var(--text-muted)",
                      animation: "bounce 1.4s infinite ease-in-out both",
                      animationDelay: "0.32s",
                    }}
                  ></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div
              style={{
                padding: "12px 20px",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                background: "var(--bg-card)",
                borderTop: "1px solid var(--border-color)",
              }}
              role="group"
              aria-label="Suggested questions"
            >
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-full)",
                    padding: "8px 14px",
                    fontSize: "13px",
                    cursor: "pointer",
                    color: "var(--text-secondary)",
                    transition: "all var(--transition-fast)",
                    fontWeight: "500",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "var(--primary)";
                    e.target.style.color = "var(--text-inverse)";
                    e.target.style.borderColor = "var(--primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "var(--bg-secondary)";
                    e.target.style.color = "var(--text-secondary)";
                    e.target.style.borderColor = "var(--border-color)";
                  }}
                  aria-label={`Ask: ${reply}`}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div
            style={{
              padding: "16px 20px",
              background: "var(--bg-card)",
              borderTop: "1px solid var(--border-color)",
              display: "flex",
              gap: "8px",
            }}
            role="form"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask me anything..."
              aria-label="Type your message"
              style={{
                flex: 1,
                padding: "12px 16px",
                border: "2px solid var(--border-color)",
                borderRadius: "var(--radius-full)",
                fontSize: "14px",
                outline: "none",
                transition: "border-color var(--transition-base)",
                background: "var(--bg-secondary)",
                color: "var(--text-primary)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--border-color)")
              }
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              style={{
                background: input.trim()
                  ? "var(--gradient-primary)"
                  : "var(--bg-secondary)",
                color: "var(--text-inverse)",
                border: "none",
                borderRadius: "50%",
                width: "48px",
                height: "48px",
                cursor: input.trim() ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                transition: "all var(--transition-base)",
                flexShrink: 0,
                boxShadow: "var(--shadow-sm)",
              }}
              onMouseEnter={(e) => {
                if (input.trim()) {
                  e.target.style.transform = "scale(1.05)";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
              aria-label="Send message"
              aria-disabled={!input.trim()}
            >
              <span aria-hidden="true">📤</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "var(--gradient-primary)",
          color: "var(--text-inverse)",
          border: "none",
          cursor: "pointer",
          boxShadow: "var(--shadow-xl)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          transition: "all var(--transition-base)",
          position: "relative",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "scale(1)";
        }}
        aria-label={isOpen ? "Close chat assistant" : "Open chat assistant"}
        aria-expanded={isOpen}
      >
        <span aria-hidden="true">{isOpen ? "✕" : "💬"}</span>
        {!isOpen && (
          <span
            style={{
              position: "absolute",
              top: "-4px",
              right: "-4px",
              width: "20px",
              height: "20px",
              background: "var(--error)",
              borderRadius: "50%",
              border: "3px solid var(--bg-card)",
              animation: "pulse 2s infinite",
            }}
            aria-hidden="true"
          ></span>
        )}
      </button>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingChatbot;
