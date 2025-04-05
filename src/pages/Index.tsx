
import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

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
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-t-lg">
          <CardTitle className="text-white flex items-center justify-center gap-2 text-2xl font-bold">
            <span className="text-3xl">🤖</span> AI ChatBot
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div
            ref={chatContainerRef}
            className="h-[450px] overflow-y-auto p-4 bg-gray-50 space-y-4 scrollbar-thin scrollbar-thumb-gray-300"
          >
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-gray-400">
                <p>Start a conversation with the AI...</p>
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
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                        : msg.isTyping
                        ? "bg-gray-200"
                        : "bg-white border border-gray-200 shadow-sm"
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
                        <div className="font-semibold mb-1">{msg.sender}</div>
                        <div>{msg.text}</div>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg flex gap-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              className="bg-gray-50 border-0 focus-visible:ring-2 focus-visible:ring-indigo-500"
            />
            <Button 
              onClick={sendMessage} 
              disabled={isLoading || !inputValue.trim()}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Send size={18} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
