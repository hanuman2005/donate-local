import React, { useState, useRef, useEffect } from 'react';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hi! I'm your FoodShare assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    "How do I donate food?",
    "How do I find nearby listings?",
    "How does the rating system work?",
    "How to contact a donor?"
  ];

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('donate') || msg.includes('create listing')) {
      return "To donate food:\n1. Click 'Create Listing' button\n2. Fill in details about your food item\n3. Add photos (optional)\n4. Set pickup location\n5. Submit!\n\nYour listing will be visible to people in your area.";
    }
    
    if (msg.includes('find') || msg.includes('nearby') || msg.includes('search')) {
      return "To find nearby donations:\n1. Go to Home or Listings page\n2. Use the map view to see nearby items\n3. Use filters to narrow down by category\n4. Click on any listing to view details\n\nYou can also search by keywords!";
    }
    
    if (msg.includes('rating') || msg.includes('review')) {
      return "After completing a donation:\n1. Both donor and recipient can rate each other\n2. Ratings range from 1-5 stars\n3. You can add optional comments\n4. Your average rating is displayed on your profile\n\nGood ratings build trust in the community!";
    }
    
    if (msg.includes('contact') || msg.includes('message') || msg.includes('chat')) {
      return "To contact a donor:\n1. Open any listing\n2. Click 'Contact' button\n3. A chat will open automatically\n4. Send your message\n\nYou'll get notifications when they reply!";
    }
    
    if (msg.includes('account') || msg.includes('profile')) {
      return "To manage your account:\n1. Click your avatar in top right\n2. Go to 'Profile'\n3. You can update:\n   - Name & contact info\n   - Profile picture\n   - Bio\n   - Address\n\nKeep your profile updated for better connections!";
    }
    
    if (msg.includes('help') || msg.includes('support')) {
      return "I can help you with:\n- Creating and managing donations\n- Finding nearby food items\n- Using the chat system\n- Understanding ratings\n- Profile management\n\nJust ask me anything!";
    }
    
    return "I'm here to help! You can ask me about:\n- How to donate food\n- Finding nearby listings\n- Using the chat system\n- Rating and reviews\n- Profile settings\n\nWhat would you like to know?";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = {
        text: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickReply = (reply) => {
    setInput(reply);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Chat Window */}
      {isOpen && (
        <div style={{
          width: '380px',
          height: '600px',
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          marginBottom: '10px',
          overflow: 'hidden',
          animation: 'slideUp 0.3s ease-out'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🤖
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '16px' }}>FoodShare Assistant</div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>Always here to help</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '0',
                width: '30px',
                height: '30px'
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            background: '#f8fafc'
          }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '16px'
                }}
              >
                <div style={{
                  maxWidth: '70%',
                  background: msg.sender === 'user' 
                    ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                    : 'white',
                  color: msg.sender === 'user' ? 'white' : '#2d3748',
                  padding: '12px 16px',
                  borderRadius: '18px',
                  borderBottomLeftRadius: msg.sender === 'bot' ? '4px' : '18px',
                  borderBottomRightRadius: msg.sender === 'user' ? '4px' : '18px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  whiteSpace: 'pre-line',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '16px'
              }}>
                <div style={{
                  background: 'white',
                  padding: '12px 16px',
                  borderRadius: '18px',
                  borderBottomLeftRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  gap: '4px'
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#cbd5e0',
                    animation: 'bounce 1.4s infinite ease-in-out both',
                    animationDelay: '0s'
                  }}></span>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#cbd5e0',
                    animation: 'bounce 1.4s infinite ease-in-out both',
                    animationDelay: '0.16s'
                  }}></span>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#cbd5e0',
                    animation: 'bounce 1.4s infinite ease-in-out both',
                    animationDelay: '0.32s'
                  }}></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div style={{
              padding: '12px 20px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              background: 'white',
              borderTop: '1px solid #e2e8f0'
            }}>
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '20px',
                    padding: '8px 14px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    color: '#4a5568',
                    transition: 'all 0.2s',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#667eea';
                    e.target.style.color = 'white';
                    e.target.style.borderColor = '#667eea';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#f8fafc';
                    e.target.style.color = '#4a5568';
                    e.target.style.borderColor = '#e2e8f0';
                  }}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '16px 20px',
            background: 'white',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: '8px'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '2px solid #e2e8f0',
                borderRadius: '25px',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              style={{
                background: input.trim() 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : '#e2e8f0',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '48px',
                height: '48px',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                transition: 'all 0.3s',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                if (input.trim()) {
                  e.target.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              📤
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          transition: 'all 0.3s',
          position: 'relative'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 12px 35px rgba(102, 126, 234, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
        }}
      >
        {isOpen ? '✕' : '💬'}
        {!isOpen && (
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            width: '20px',
            height: '20px',
            background: '#ff6b6b',
            borderRadius: '50%',
            border: '3px solid white',
            animation: 'pulse 2s infinite'
          }}></span>
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