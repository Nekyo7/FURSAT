import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useConversations, useChat } from "@/hooks/useMessages";
import { useAuth } from "@/contexts/AuthContext";
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
  Loader2,
  MessageSquarePlus,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

export default function Messages() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const { conversations, loading: loadingConvos } = useConversations();
  const { messages, loading: loadingMessages, sendMessage, sending } = useChat(id || null);

  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const activeConversation = conversations.find(c => c.id === id);

  const handleSend = async () => {
    if (!messageInput.trim() || !id) return;

    const content = messageInput;
    setMessageInput(""); // Optimistic clear

    await sendMessage(content);
  };

  const filteredConversations = conversations.filter(c =>
    c.other_user?.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.other_user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "";
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="h-[calc(100vh-180px)] md:h-[calc(100vh-140px)] bg-card border-2 border-foreground shadow-md flex overflow-hidden">

          {/* Conversations List Sidebar */}
          <div className={cn(
            "w-full md:w-80 border-r-2 border-foreground flex flex-col bg-background",
            id ? "hidden md:flex" : "flex"
          )}>
            {/* Header */}
            <div className="p-4 border-b-2 border-foreground">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-xl">MESSAGES</h2>
                <Button variant="ghost" size="icon">
                  <MessageSquarePlus className="w-5 h-5" />
                </Button>
              </div>
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
              {loadingConvos ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Loading chats...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <p>No conversations yet.</p>
                </div>
              ) : (
                filteredConversations.map((convo) => (
                  <button
                    key={convo.id}
                    onClick={() => navigate(`/messages/${convo.id}`)}
                    className={cn(
                      "w-full flex items-center gap-3 p-4 border-b border-muted hover:bg-muted transition-colors text-left",
                      id === convo.id && "bg-muted"
                    )}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-secondary border-2 border-foreground flex items-center justify-center overflow-hidden">
                        {convo.other_user?.avatar_url ? (
                          <img
                            src={convo.other_user.avatar_url}
                            alt={convo.other_user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-bold text-sm">
                            {convo.other_user?.username?.substring(0, 2).toUpperCase() || "??"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold truncate">
                          {convo.other_user?.full_name || convo.other_user?.username || "Unknown User"}
                        </span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatTime(convo.last_message_at).replace("about ", "").replace(" ago", "")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {convo.last_message?.sender_id === currentUser?.id ? "You: " : ""}
                        {convo.last_message?.content || "No messages yet"}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={cn(
            "flex-1 flex-col bg-background",
            !id ? "hidden md:flex" : "flex"
          )}>
            {id ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b-2 border-foreground bg-card z-10">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden mr-1"
                      onClick={() => navigate("/messages")}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>

                    <div className="relative">
                      <div className="w-10 h-10 bg-secondary border-2 border-foreground flex items-center justify-center overflow-hidden">
                        {activeConversation?.other_user?.avatar_url ? (
                          <img
                            src={activeConversation.other_user.avatar_url}
                            alt={activeConversation.other_user.username}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-bold text-sm">
                            {activeConversation?.other_user?.username?.substring(0, 2).toUpperCase() || "??"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold">
                        {activeConversation?.other_user?.full_name || activeConversation?.other_user?.username || "Loading..."}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        @{activeConversation?.other_user?.username}
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

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
                  {loadingMessages ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No messages yet. Say hi! 👋</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender_id === currentUser?.id;
                      return (
                        <div
                          key={msg.id}
                          className={cn(
                            "flex",
                            isMe ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[75%] md:max-w-[60%] border-2 border-foreground p-3 relative group",
                              isMe
                                ? "bg-secondary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                : "bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            )}
                          >
                            <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <span className="text-[10px] text-muted-foreground font-mono">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {isMe && (
                                <span className="text-foreground/60">
                                  {msg.is_read ? (
                                    <CheckCheck className="w-3 h-3" />
                                  ) : (
                                    <Check className="w-3 h-3" />
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t-2 border-foreground bg-card">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="w-9 h-9 shrink-0">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      disabled={sending}
                      className="flex-1 bg-background border-2 border-foreground px-4 py-2 outline-none focus:shadow-xs transition-shadow disabled:opacity-50"
                    />
                    <Button
                      variant="accent"
                      size="icon"
                      className="w-9 h-9 shrink-0"
                      onClick={handleSend}
                      disabled={!messageInput.trim() || sending}
                    >
                      {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State (Desktop) */
              <div className="flex-1 flex items-center justify-center text-center p-8 bg-muted/20">
                <div>
                  <div className="w-20 h-20 bg-background border-2 border-foreground mx-auto mb-6 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <MessageSquarePlus className="w-10 h-10" />
                  </div>
                  <h3 className="font-bold text-2xl mb-2">Your Messages</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    Select a conversation from the list or start a new one to connect with others.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
