(function () {
    // Make sure Supabase is available
    if (typeof supabaseClient === "undefined") {
        console.error("Supabase client was not found.");
        return;
    }

    // ===============================
    // CREATE SUPPORT BUTTON
    // ===============================

    const button = document.createElement("button");
    button.id = "supportButton";
    button.innerHTML = "💬";
    button.title = "Live Support";

    // ===============================
    // CREATE CHAT WINDOW
    // ===============================

    const chat = document.createElement("div");
    chat.id = "supportChat";

    chat.innerHTML = `
        <div class="support-header">
            <div>
                <strong>Live Support</strong>
                <small>We're here to help</small>
            </div>

            <button id="closeSupport">×</button>
        </div>

        <div id="supportMessages">
            <div class="support-welcome">
                👋 Hello! Welcome to our support center.
                <br><br>
                How can we help you today?
            </div>
        </div>

        <div class="support-input-area">
            <input
                type="text"
                id="supportInput"
                placeholder="Type your message..."
                autocomplete="off"
            >

            <button id="supportSend">➤</button>
        </div>
    `;

    document.body.appendChild(button);
    document.body.appendChild(chat);

    // ===============================
    // STYLES
    // ===============================

    const style = document.createElement("style");

    style.textContent = `
        #supportButton {
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 60px;
            height: 60px;
            border: none;
            border-radius: 50%;
            background: #2563eb;
            color: white;
            font-size: 27px;
            cursor: pointer;
            z-index: 999999;
            box-shadow: 0 5px 20px rgba(0,0,0,0.25);
        }

        #supportButton:hover {
            transform: scale(1.05);
        }

        #supportChat {
            display: none;
            position: fixed;
            right: 20px;
            bottom: 90px;
            width: 350px;
            max-width: calc(100vw - 30px);
            height: 480px;
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 35px rgba(0,0,0,0.25);
            z-index: 999998;
            font-family: Arial, sans-serif;
        }

        .support-header {
            height: 65px;
            padding: 0 15px;
            background: #2563eb;
            color: white;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .support-header strong {
            display: block;
            font-size: 16px;
        }

        .support-header small {
            display: block;
            margin-top: 4px;
            opacity: 0.85;
        }

        #closeSupport {
            background: transparent;
            border: none;
            color: white;
            font-size: 28px;
            cursor: pointer;
        }

        #supportMessages {
            height: 350px;
            padding: 15px;
            overflow-y: auto;
            background: #f5f7fb;
        }

        .support-welcome {
            background: white;
            padding: 12px;
            border-radius: 10px;
            margin-bottom: 10px;
            color: #333;
            line-height: 1.5;
        }

        .student-message {
            background: #2563eb;
            color: white;
            padding: 10px 13px;
            border-radius: 12px;
            margin: 8px 0 8px auto;
            max-width: 80%;
            width: fit-content;
            word-wrap: break-word;
        }

        .support-message {
            background: white;
            color: #333;
            padding: 10px 13px;
            border-radius: 12px;
            margin: 8px auto 8px 0;
            max-width: 80%;
            width: fit-content;
            word-wrap: break-word;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08);
        }

        .message-label {
            font-size: 10px;
            opacity: 0.7;
            margin-bottom: 3px;
        }

        .support-input-area {
            height: 65px;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 0 10px;
            border-top: 1px solid #ddd;
            background: white;
        }

        #supportInput {
            flex: 1;
            min-width: 0;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 20px;
            outline: none;
        }

        #supportSend {
            width: 42px;
            height: 42px;
            border: none;
            border-radius: 50%;
            background: #2563eb;
            color: white;
            cursor: pointer;
            font-size: 17px;
        }

        #supportSend:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        @media (max-width: 500px) {
            #supportChat {
                right: 10px;
                bottom: 85px;
                width: calc(100vw - 20px);
                height: 70vh;
            }

            #supportMessages {
                height: calc(70vh - 130px);
            }

            #supportButton {
                right: 15px;
                bottom: 15px;
            }
        }
    `;

    document.head.appendChild(style);

    // ===============================
    // OPEN / CLOSE CHAT
    // ===============================

    button.addEventListener("click", async function () {
        chat.style.display = "block";
        button.style.display = "none";

        await loadMessages();
    });

    document
        .getElementById("closeSupport")
        .addEventListener("click", function () {
            chat.style.display = "none";
            button.style.display = "block";
        });

    // ===============================
    // SEND MESSAGE
    // ===============================

    document
        .getElementById("supportSend")
        .addEventListener("click", sendMessage);

    document
        .getElementById("supportInput")
        .addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                sendMessage();
            }
        });

    async function sendMessage() {
        const input = document.getElementById("supportInput");
        const sendButton = document.getElementById("supportSend");

        const message = input.value.trim();

        if (!message) return;

        sendButton.disabled = true;

        try {
            // Get currently logged-in Supabase user
            const {
                data: { user },
                error: userError
            } = await supabaseClient.auth.getUser();

            if (userError || !user) {
                alert("Please log in to use live support.");
                return;
            }

            const { error } = await supabaseClient
                .from("support_messages")
                .insert({
                    user_id: user.id,
                    sender: "student",
                    message: message
                });

            if (error) {
                console.error("Support message error:", error);
                alert("Message could not be sent. Please try again.");
                return;
            }

            input.value = "";

        } catch (error) {
            console.error("Support error:", error);
            alert("Something went wrong.");
        } finally {
            sendButton.disabled = false;
        }
    }

    // ===============================
    // LOAD OLD MESSAGES
    // ===============================

    async function loadMessages() {
        try {
            const {
                data: { user },
                error: userError
            } = await supabaseClient.auth.getUser();

            if (userError || !user) {
                return;
            }

            const { data, error } = await supabaseClient
                .from("support_messages")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", {
                    ascending: true
                });

            if (error) {
                console.error("Could not load support messages:", error);
                return;
            }

            const messagesBox =
                document.getElementById("supportMessages");

            // Remove old messages but keep the welcome message
            messagesBox.innerHTML = "";

            if (!data || data.length === 0) {
                messagesBox.innerHTML = `
                    <div class="support-welcome">
                        👋 Hello! Welcome to our support center.
                        <br><br>
                        How can we help you today?
                    </div>
                `;
                return;
            }

            data.forEach(addMessageToScreen);

            scrollToBottom();

        } catch (error) {
            console.error("Loading support messages failed:", error);
        }
    }

    // ===============================
    // DISPLAY MESSAGE
    // ===============================

    function addMessageToScreen(message) {
        const messagesBox =
            document.getElementById("supportMessages");

        // Prevent duplicate display
        if (
            document.querySelector(
                `[data-message-id="${message.id}"]`
            )
        ) {
            return;
        }

        const messageElement =
            document.createElement("div");

        messageElement.dataset.messageId = message.id;

        if (message.sender === "student") {
            messageElement.className = "student-message";

            messageElement.innerHTML = `
                <div class="message-label">You</div>
                ${escapeHtml(message.message)}
            `;
        } else {
            messageElement.className = "support-message";

            messageElement.innerHTML = `
                <div class="message-label">Support</div>
                ${escapeHtml(message.message)}
            `;
        }

        messagesBox.appendChild(messageElement);

        scrollToBottom();
    }

    // ===============================
    // REAL-TIME MESSAGES
    // ===============================

    supabaseClient
        .channel("student-support-chat")
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "support_messages"
            },
            async function (payload) {

                const {
                    data: { user }
                } = await supabaseClient.auth.getUser();

                if (!user) return;

                if (payload.new.user_id === user.id) {
                    addMessageToScreen(payload.new);
                }
            }
        )
        .subscribe();

    // ===============================
    // SCROLL
    // ===============================

    function scrollToBottom() {
        const messagesBox =
            document.getElementById("supportMessages");

        if (messagesBox) {
            messagesBox.scrollTop =
                messagesBox.scrollHeight;
        }
    }

    // ===============================
    // BASIC HTML PROTECTION
    // ===============================

    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

})();
