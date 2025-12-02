import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Search,
  Send,
  Phone,
  Video,
  MoreVertical,
  Image as ImageIcon,
  Smile,
  Paperclip,
  Check,
  CheckCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const conversations = [
  {
    id: 1,
    user: {
      name: "Priya Sharma",
      avatar: "PS",
      online: true,
    },
    lastMessage: "Thanks for sharing the notes! Really helpful 🙏",
    time: "2m",
    unread: 2,
  },
  {
    id: 2,
    user: {
      name: "Tech Club",
      avatar: "TC",
      online: false,
      isGroup: true,
    },
    lastMessage: "Raj: Meeting at 5pm today in seminar hall",
    time: "15m",
    unread: 0,
  },
  {
    id: 3,
    user: {
      name: "Aditya Singh",
      avatar: "AS",
      online: true,
    },
    lastMessage: "You: Did you submit the assignment?",
    time: "1h",
    unread: 0,
  },
  {
    id: 4,
    user: {
      name: "Study Group - DSA",
      avatar: "SG",
      online: false,
      isGroup: true,
    },
    lastMessage: "Neha: Let's discuss DP problems tomorrow",
    time: "3h",
    unread: 5,
  },
];

const messages = [
  {
    id: 1,
    sender: "them",
    content: "Hey! Did you get the notes from today's lecture?",
    time: "10:30 AM",
    status: "read",
  },
  {
    id: 2,
    sender: "me",
    content: "Yes! I'll share them with you in a sec",
    time: "10:32 AM",
    status: "read",
  },
  {
    id: 3,
    sender: "me",
    content: "Here they are 📚",
    time: "10:33 AM",
    status: "read",
    attachment: true,
  },
  {
    id: 4,
    sender: "them",
    content: "Thanks for sharing the notes! Really helpful 🙏",
    time: "10:35 AM",
    status: "read",
  },
];

export default function Messages() {
  const [selectedConvo, setSelectedConvo] = useState(conversations[0]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSend = () => {
    if (!messageInput.trim()) return;
    // Would add message to the list in real implementation
    setMessageInput("");
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="h-[calc(100vh-180px)] md:h-[calc(100vh-140px)] bg-card border-2 border-foreground shadow-md flex">
          {/* Conversations List */}
          <div className="w-full md:w-80 border-r-2 border-foreground flex flex-col">
            {/* Header */}
            <div className="p-4 border-b-2 border-foreground">
              <h2 className="font-bold text-xl mb-4">MESSAGES</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border-2 border-foreground pl-9 pr-4 py-2 text-sm outline-none focus:shadow-xs transition-shadow"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {conversations.map((convo) => (
                <button
                  key={convo.id}
                  onClick={() => setSelectedConvo(convo)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 border-b border-muted hover:bg-muted transition-colors text-left",
                    selectedConvo.id === convo.id && "bg-muted"
                  )}
                >
                  <div className="relative">
                    <div
                      className={cn(
                        "w-12 h-12 border-2 border-foreground flex items-center justify-center",
                        convo.user.isGroup ? "bg-info" : "bg-secondary"
                      )}
                    >
                      <span className="font-bold text-sm">{convo.user.avatar}</span>
                    </div>
                    {convo.user.online && !convo.user.isGroup && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-card" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold truncate">{convo.user.name}</span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {convo.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {convo.lastMessage}
                    </p>
                  </div>
                  {convo.unread > 0 && (
                    <span className="w-5 h-5 bg-accent border border-foreground text-xs font-bold flex items-center justify-center shrink-0">
                      {convo.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="hidden md:flex flex-1 flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b-2 border-foreground">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-secondary border-2 border-foreground flex items-center justify-center">
                    <span className="font-bold text-sm">
                      {selectedConvo.user.avatar}
                    </span>
                  </div>
                  {selectedConvo.user.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success border-2 border-card" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold">{selectedConvo.user.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedConvo.user.online ? "Online" : "Last seen 2h ago"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="w-9 h-9">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="w-9 h-9">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="w-9 h-9">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.sender === "me" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] border-2 border-foreground p-3",
                      msg.sender === "me"
                        ? "bg-secondary shadow-xs"
                        : "bg-card shadow-xs"
                    )}
                  >
                    {msg.attachment && (
                      <div className="bg-muted border-2 border-foreground p-4 mb-2 flex items-center gap-2">
                        <Paperclip className="w-5 h-5" />
                        <span className="text-sm font-medium">DSA_Notes.pdf</span>
                      </div>
                    )}
                    <p>{msg.content}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {msg.time}
                      </span>
                      {msg.sender === "me" && (
                        <span className="text-info">
                          {msg.status === "read" ? (
                            <CheckCheck className="w-4 h-4" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t-2 border-foreground">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="w-9 h-9 shrink-0">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="w-9 h-9 shrink-0">
                  <ImageIcon className="w-5 h-5" />
                </Button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 bg-background border-2 border-foreground px-4 py-2 outline-none focus:shadow-xs transition-shadow"
                />
                <Button variant="ghost" size="icon" className="w-9 h-9 shrink-0">
                  <Smile className="w-5 h-5" />
                </Button>
                <Button
                  variant="accent"
                  size="icon"
                  className="w-9 h-9 shrink-0"
                  onClick={handleSend}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile: No chat selected message */}
          <div className="flex-1 hidden md:hidden items-center justify-center text-center p-8">
            <div>
              <div className="w-16 h-16 bg-muted border-2 border-foreground mx-auto mb-4 flex items-center justify-center">
                <Send className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-lg mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose from your existing conversations or start a new one
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
