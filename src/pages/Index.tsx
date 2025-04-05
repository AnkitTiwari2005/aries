
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, Sparkles, MessageCircle, Loader, ArrowDown, Moon, Sun, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import ParticleBackground from "@/components/ParticleBackground";

const API_URL = "https://ankit-chatbot.up.railway.app";

interface Message {
  sender: string;
  text: string;
  isTyping?: boolean;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Monitor scroll position to show/hide scroll button
  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const bottomThreshold = 100;
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > bottomThreshold);
  };

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
      return () => chatContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current && !showScrollButton) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, showScrollButton]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const appendMessage = (sender: string, text: string, isTyping: boolean = false) => {
    setMessages(prev => [...prev, { sender, text, isTyping }]);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const sendMessage = async () => {
    const message = inputValue.trim();
    if (!message) return;

    // Display user message
    appendMessage("You", message);
    setInputValue("");
    setIsLoading(true);

    // Show typing indicator
    appendMessage("Bot", "", true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error(`Server Error: ${response.status}`);
      const data = await response.json();

      // Remove typing indicator and add bot response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isTyping);
        return [...filtered, { sender: "Bot", text: data.response }];
      });
    } catch (error) {
      console.error("Error fetching response:", error);
      // Remove typing indicator and show error
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isTyping);
        return [
          ...filtered,
          { sender: "Bot", text: "Error: Failed to connect to the server." },
        ];
      });
      
      toast({
        title: "Connection Error",
        description: "Failed to reach the AI assistant. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen items-center justify-center p-4 relative overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 to-indigo-900' : 'bg-mesh'}`}>
      <ParticleBackground />
      
      {/* Theme Toggle */}
      <button 
        onClick={toggleTheme} 
        className="absolute top-4 right-4 p-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg hover:bg-white/20 transition-all z-10"
      >
        {theme === 'light' ? <Moon className="text-indigo-600" size={20} /> : <Sun className="text-yellow-300" size={20} />}
      </button>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/6 w-48 h-48 bg-purple-500/30 rounded-full filter blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/6 w-72 h-72 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="star-field"></div>
      </div>
      
      <Card 
        className={`w-full max-w-md shadow-2xl overflow-hidden animate-bounce-in relative ${
          theme === 'dark' ? 'bg-gray-900/70 border-gray-700' : 'bg-white/90 border-gray-200'
        } backdrop-blur-lg`}
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-shift"></div>

        <CardHeader className={`relative z-10 ${
          theme === 'dark' ? 'bg-gradient-to-r from-indigo-800 to-purple-900' : 'bg-gradient-to-r from-violet-600 to-indigo-600'
        }`}>
          <CardTitle className="text-white flex items-center justify-center gap-3 text-2xl font-bold">
            <Bot size={28} className="animate-float" />
            <span className="text-gradient-primary relative">
              AI ChatBot
              <span className="absolute -top-1 -right-6">
                <Sparkles size={16} className="animate-pulse-glow text-yellow-300" />
              </span>
            </span>
            <Star size={18} className="text-yellow-300 animate-spin-slow" />
          </CardTitle>
          <div className="flex justify-center mt-2">
            <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs text-white/80 flex items-center gap-1">
              <Zap size={12} className="text-yellow-300" /> Powered by Advanced AI
            </div>
          </div>
        </CardHeader>
        
        <CardContent className={`p-0 relative z-10 ${theme === 'dark' ? 'text-white' : ''}`}>
          <div
            ref={chatContainerRef}
            className={`h-[450px] overflow-y-auto p-4 space-y-4 scrollbar-thin ${
              theme === 'dark' ? 'bg-gray-800/50 scrollbar-thumb-gray-600' : 'bg-chat-pattern scrollbar-thumb-gray-300'
            }`}
            onScroll={handleScroll}
          >
            {messages.length === 0 ? (
              <div className="flex flex-col h-full items-center justify-center gap-4 animate-fade-in">
                <div className="relative">
                  <MessageCircle size={40} className={`${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-400'} animate-bounce-subtle`} />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping-slow"></div>
                </div>
                <p className={`text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Start a conversation with the AI assistant...</p>
                <p className={`text-sm text-center max-w-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>Ask me anything about topics, ideas, or just chat for fun!</p>
                
                <div className="grid grid-cols-2 gap-2 w-full max-w-xs mt-4">
                  {["Tell me a joke", "What is AI?", "Write a poem", "Today's weather"].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputValue(suggestion);
                        setTimeout(() => sendMessage(), 100);
                      }}
                      className={`text-xs px-3 py-2 rounded-lg border transition-all ${
                        theme === 'dark' 
                          ? 'bg-gray-700/70 border-gray-600 hover:bg-gray-600' 
                          : 'bg-white/60 border-gray-200 hover:bg-indigo-50'
                      } backdrop-blur-sm text-center shiny-button`}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "You" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 animate-fade-in ${
                      msg.sender === "You"
                        ? theme === 'dark'
                          ? "bg-indigo-600/80 text-white backdrop-blur-sm shadow-lg shadow-indigo-900/20"
                          : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20"
                        : msg.isTyping
                        ? theme === 'dark'
                          ? "bg-gray-700/80 animate-pulse"
                          : "bg-gray-200 animate-pulse"
                        : theme === 'dark'
                          ? "bg-gray-700/90 border border-gray-600 shadow-sm message-glass"
                          : "bg-white/90 border border-gray-200 shadow-sm message-glass backdrop-blur-sm"
                    }`}
                  >
                    {msg.isTyping ? (
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    ) : (
                      <>
                        <div className={`font-semibold mb-1 flex items-center gap-1.5 ${
                          msg.sender === "Bot" 
                            ? theme === 'dark' ? "text-indigo-300" : "text-indigo-600" 
                            : ""
                        }`}>
                          {msg.sender === "Bot" && <Bot size={16} className={theme === 'dark' ? "text-indigo-300" : ""} />}
                          {msg.sender}
                        </div>
                        <div className="leading-relaxed">{msg.text}</div>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {showScrollButton && (
            <button 
              onClick={scrollToBottom}
              className={`absolute bottom-20 right-4 p-2 rounded-full shadow-lg animate-bounce-subtle transition-colors z-20 ${
                theme === 'dark' 
                  ? 'bg-indigo-600/80 text-white hover:bg-indigo-700 backdrop-blur-sm' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <ArrowDown size={18} />
            </button>
          )}
          
          <div className={`p-4 rounded-b-lg flex gap-2 animate-slide-up relative z-10 ${
            theme === 'dark' 
              ? 'bg-gray-800/80 backdrop-blur-md border-t border-gray-700' 
              : 'bg-white/80 backdrop-blur-sm border-t border-gray-200'
          }`}>
            <Input
              type="text"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              className={`${
                theme === 'dark' 
                  ? 'bg-gray-700/60 border-gray-600 text-white placeholder:text-gray-400' 
                  : 'bg-gray-50/80 border-0'
              } focus-visible:ring-2 focus-visible:ring-indigo-500`}
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !inputValue.trim()}
              className={`${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-600 hover:to-purple-600'
                  : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700'
              } transition-all duration-300 animate-pulse-glow disabled:animate-none`}
            >
              {isLoading ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
