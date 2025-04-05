
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, Sparkles, MessageCircle, Loader, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

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

  // Visual decorator elements
  const renderDecorators = () => (
    <>
      <div className="hidden md:block absolute top-8 right-8 w-12 h-12 bg-indigo-500/20 rounded-full animate-spin-slow"></div>
      <div className="hidden md:block absolute bottom-12 left-10 w-20 h-20 bg-purple-500/10 rounded-full animate-bounce-subtle"></div>
      <div className="hidden md:block absolute top-1/4 left-6 w-4 h-4 bg-pink-500/30 rounded-full animate-pulse-slow"></div>
      <div className="hidden md:block absolute bottom-1/3 right-4 w-8 h-8 bg-blue-500/20 rounded-full animate-pulse-slow"></div>
    </>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-mesh p-4 relative overflow-hidden">
      {renderDecorators()}
      
      <Card className="w-full max-w-md shadow-2xl border-0 card-glass overflow-hidden animate-bounce-in">
        <CardHeader className="bg-gradient-to-r from-violet-600 to-indigo-600 animate-gradient-shift">
          <CardTitle className="text-white flex items-center justify-center gap-3 text-2xl font-bold">
            <Bot size={28} className="animate-float" />
            <span className="text-gradient-primary">AI</span> ChatBot
            <Sparkles size={20} className="animate-pulse-glow text-amber-300" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div
            ref={chatContainerRef}
            className="h-[450px] overflow-y-auto p-4 bg-chat-pattern space-y-4 scrollbar-thin scrollbar-thumb-gray-300"
            onScroll={handleScroll}
          >
            {messages.length === 0 ? (
              <div className="flex flex-col h-full items-center justify-center text-gray-400 gap-4 animate-fade-in">
                <MessageCircle size={40} className="text-indigo-400 animate-bounce-subtle" />
                <p className="text-center">Start a conversation with the AI assistant...</p>
                <p className="text-sm text-center text-gray-400 max-w-xs">Ask me anything about topics, ideas, or just chat for fun!</p>
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
                    className={`max-w-[80%] rounded-2xl px-4 py-2 animate-fade-in ${
                      msg.sender === "You"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20"
                        : msg.isTyping
                        ? "bg-gray-200 animate-pulse"
                        : "bg-white border border-gray-200 shadow-sm message-glass"
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
                          msg.sender === "Bot" ? "text-indigo-600" : ""
                        }`}>
                          {msg.sender === "Bot" && <Bot size={16} />}
                          {msg.sender}
                        </div>
                        <div>{msg.text}</div>
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
              className="absolute bottom-20 right-4 p-2 bg-indigo-600 text-white rounded-full shadow-lg animate-bounce-subtle hover:bg-indigo-700 transition-colors"
            >
              <ArrowDown size={18} />
            </button>
          )}
          
          <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200 rounded-b-lg flex gap-2 animate-slide-up">
            <Input
              type="text"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              className="bg-gray-50/80 border-0 focus-visible:ring-2 focus-visible:ring-indigo-500"
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !inputValue.trim()}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all duration-300 animate-pulse-glow disabled:animate-none"
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
