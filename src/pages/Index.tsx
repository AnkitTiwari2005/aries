
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, Sparkles, MessageCircle, Loader, ArrowDown, Moon, Palette, Copy, User, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ParticleBackground from "@/components/ParticleBackground";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const API_URL = "https://ankit-chatbot.up.railway.app";

interface Message {
  sender: string;
  text: string;
  isTyping?: boolean;
}

type ThemeType = 'default' | 'dark';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [theme, setTheme] = useState<ThemeType>('default');
  const [copied, setCopied] = useState<number | null>(null);
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

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied !== null) {
      const timer = setTimeout(() => {
        setCopied(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Get theme-specific class names
  const getThemeClasses = () => {
    return theme === 'dark'
      ? 'bg-gradient-to-br from-gray-900 to-indigo-900'
      : 'bg-mesh';
  };

  const getCardClasses = () => {
    return theme === 'dark'
      ? 'bg-gray-900/80 border-gray-700 shadow-xl'
      : 'bg-white/90 border-gray-200 shadow-xl';
  };

  const getHeaderClasses = () => {
    return theme === 'dark'
      ? 'bg-gradient-to-r from-indigo-800 to-purple-900'
      : 'bg-gradient-to-r from-violet-600 to-indigo-600';
  };

  const getChatBackgroundClasses = () => {
    return theme === 'dark'
      ? 'bg-gray-800/70 scrollbar-thumb-gray-600'
      : 'bg-chat-pattern scrollbar-thumb-gray-300';
  };

  const getTextColor = () => {
    return theme === 'dark' ? 'text-white' : '';
  };

  const getEmptyStateTextColors = () => {
    return theme === 'dark'
      ? {
          primary: 'text-gray-300',
          secondary: 'text-gray-400'
        }
      : {
          primary: 'text-gray-600',
          secondary: 'text-gray-400'
        };
  };

  const getSuggestionButtonClasses = () => {
    return theme === 'dark'
      ? 'bg-gray-700/90 border-gray-600 hover:bg-gray-600'
      : 'bg-white/80 border-gray-200 hover:bg-indigo-50';
  };

  const getInputClasses = () => {
    return theme === 'dark'
      ? 'bg-gray-700/80 border-gray-600 text-white placeholder:text-gray-400'
      : 'bg-gray-50/90 border-0';
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

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(index);
      toast({
        title: "Copied to clipboard",
        description: "Message content has been copied to your clipboard",
      });
    }).catch(err => {
      console.error('Error copying text: ', err);
      toast({
        title: "Failed to copy",
        description: "Could not copy the message to clipboard",
        variant: "destructive",
      });
    });
  };

  const sendMessage = async () => {
    const message = inputValue.trim();
    if (!message) return;

    // Display user message
    appendMessage("You", message);
    setInputValue("");
    setIsLoading(true);

    // Show typing indicator
    appendMessage("Aries", "", true);

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
        return [...filtered, { sender: "Aries", text: data.response }];
      });
    } catch (error) {
      console.error("Error fetching response:", error);
      // Remove typing indicator and show error
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isTyping);
        return [
          ...filtered,
          { sender: "Aries", text: "Error: Failed to connect to the server." },
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

  // Toggle between themes
  const toggleTheme = () => {
    setTheme(prev => prev === 'default' ? 'dark' : 'default');
  };

  return (
    <div className={`flex min-h-screen items-center justify-center p-4 relative overflow-hidden ${getThemeClasses()}`}>
      <ParticleBackground theme={theme} />
      
      {/* Theme Toggle */}
      <div className="absolute top-5 right-5 z-10">
        <Button 
          onClick={toggleTheme} 
          size="sm"
          className="backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg"
        >
          {theme === 'dark' ? <Moon size={16} className="mr-1" /> : <Palette size={16} className="mr-1" />}
          {theme === 'dark' ? "Dark" : "Default"}
        </Button>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/6 w-60 h-60 bg-purple-500/30 rounded-full filter blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="star-field"></div>
      </div>
      
      <Card 
        className={`w-full max-w-3xl shadow-2xl overflow-hidden animate-bounce-in relative ${getCardClasses()} backdrop-blur-lg`}
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-shift"></div>

        <CardHeader className={`relative z-10 ${getHeaderClasses()} py-6`}>
          <CardTitle className="text-white flex items-center justify-center gap-3 text-2xl font-bold">
            <Bot size={30} className="animate-float" />
            <span className="text-gradient-primary relative">
              Aries
              <span className="absolute -top-1.5 -right-6">
                <Sparkles size={18} className="animate-pulse-glow text-yellow-300" />
              </span>
            </span>
            <span className="ml-1 text-yellow-300 animate-spin-slow inline-block">✨</span>
          </CardTitle>
          <div className="flex justify-center mt-2">
            <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs text-white/90 flex items-center gap-1 border border-white/10">
              <span className="text-green-400 animate-pulse">●</span> Powered by AriOS
            </div>
          </div>
        </CardHeader>
        
        <CardContent className={`p-0 relative z-10 ${getTextColor()}`}>
          <div
            ref={chatContainerRef}
            className={`h-[500px] overflow-y-auto p-5 space-y-5 scrollbar-thin ${getChatBackgroundClasses()}`}
            onScroll={handleScroll}
          >
            {messages.length === 0 ? (
              <div className="flex flex-col h-full items-center justify-center gap-5 animate-fade-in pt-10">
                <div className="relative">
                  <MessageCircle size={48} className={`${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-500'} animate-bounce-subtle`} />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping-slow"></div>
                </div>
                <p className={`text-lg font-medium ${getEmptyStateTextColors().primary}`}>Start a conversation with Aries</p>
                <p className={`text-sm text-center max-w-sm ${getEmptyStateTextColors().secondary}`}>Ask me anything about topics, ideas, or just chat for fun!</p>
                
                <div className="grid grid-cols-2 gap-3 w-full max-w-sm mt-4">
                  {["Tell me a joke", "What is AI?", "Write a poem", "Today's weather"].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputValue(suggestion);
                        setTimeout(() => sendMessage(), 100);
                      }}
                      className={`text-sm px-4 py-3 rounded-lg border transition-all ${getSuggestionButtonClasses()} backdrop-blur-sm text-center shiny-button`}
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
                    className={`max-w-[85%] rounded-2xl px-5 py-3.5 animate-fade-in relative group ${
                      msg.sender === "You"
                        ? theme === 'dark'
                          ? "bg-indigo-600/90 text-white backdrop-blur-sm shadow-lg shadow-indigo-900/30"
                          : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                        : msg.isTyping
                        ? theme === 'dark'
                          ? "bg-gray-700/90 animate-pulse"
                          : "bg-gray-200/90 animate-pulse"
                        : theme === 'dark'
                          ? "bg-gray-700/95 border border-gray-600/80 shadow-md message-glass"
                          : "bg-white/95 border border-gray-200/80 shadow-md message-glass backdrop-blur-sm"
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
                        <div className={`font-semibold mb-1.5 flex items-center gap-1.5 ${
                          msg.sender === "Aries" 
                            ? theme === 'dark' ? "text-indigo-300" : "text-indigo-600" 
                            : ""
                        }`}>
                          {msg.sender === "Aries" ? 
                            <Bot size={16} className={theme === 'dark' ? "text-indigo-300" : ""} /> : 
                            <Avatar className="h-5 w-5 mr-1">
                              <AvatarFallback className="bg-indigo-600 text-white text-xs">U</AvatarFallback>
                            </Avatar>
                          }
                          {msg.sender}
                          
                          {/* Copy button - only show for bot messages */}
                          {msg.sender === "Aries" && (
                            <button 
                              onClick={() => copyToClipboard(msg.text, index)}
                              className={`ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md ${
                                theme === 'dark' 
                                  ? 'hover:bg-gray-600/50' 
                                  : 'hover:bg-gray-200/50'
                              }`}
                              aria-label="Copy message"
                            >
                              {copied === index ? 
                                <Check size={14} className="text-green-400" /> : 
                                <Copy size={14} className={theme === 'dark' ? "text-gray-400" : "text-gray-500"} />
                              }
                            </button>
                          )}
                        </div>
                        <div className="leading-relaxed whitespace-pre-wrap">{msg.text}</div>
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
              className={`absolute bottom-24 right-5 p-2.5 rounded-full shadow-lg animate-bounce-subtle transition-colors z-20 ${
                theme === 'dark' 
                  ? 'bg-indigo-600/90 text-white hover:bg-indigo-700/90 backdrop-blur-sm border border-indigo-500/30' 
                  : 'bg-indigo-600/90 text-white hover:bg-indigo-700/90 border border-indigo-500/30'
              }`}
            >
              <ArrowDown size={20} />
            </button>
          )}
          
          <div className={`p-5 rounded-b-lg flex gap-3 animate-slide-up relative z-10 ${
            theme === 'dark' 
              ? 'bg-gray-800/90 backdrop-blur-md border-t border-gray-700' 
              : 'bg-white/90 backdrop-blur-md border-t border-gray-200'
          }`}>
            <Input
              type="text"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              className={`${getInputClasses()} text-base py-6 focus-visible:ring-2 focus-visible:ring-indigo-500 font-medium`}
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !inputValue.trim()}
              size="lg"
              className={`${
                theme === 'dark'
                  ? 'bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-600 hover:to-purple-600'
                  : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700'
              } transition-all duration-300 animate-pulse-glow disabled:animate-none shadow-lg`}
            >
              {isLoading ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
