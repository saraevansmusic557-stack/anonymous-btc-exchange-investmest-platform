(function () {
    // Create the support button
    const button = document.createElement("button");
    button.id = "supportButton";
    button.innerHTML = "💬";
    button.title = "Live Support";

    // Create the chat window
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
                👋 Hello! Welcome to our support center.<br><br>
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

    // Add the widget styling
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

    // Open chat
    button.addEventListener("click", function () {
        chat.style.display = "block";
        button.style.display = "none";
    });

    // Close chat
    document.getElementById("closeSupport").addEventListener("click", function () {
        chat.style.display = "none";
        button.style.display = "block";
    });

    // Send message - temporary local test
    document.getElementById("supportSend").addEventListener("click", sendSupportMessage);

    document.getElementById("supportInput").addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            sendSupportMessage();
        }
    });

    function sendSupportMessage() {
        const input = document.getElementById("supportInput");
        const message = input.value.trim();

        if (!message) return;

        const messageElement = document.createElement("div");

        messageElement.style.cssText = `
            background: #2563eb;
            color: white;
            padding: 10px 13px;
            border-radius: 12px;
            margin: 8px 0 8px auto;
            max-width: 80%;
            width: fit-content;
            word-wrap: break-word;
        `;

        messageElement.textContent = message;

        document.getElementById("supportMessages").appendChild(messageElement);

        input.value = "";

        const messages = document.getElementById("supportMessages");
        messages.scrollTop = messages.scrollHeight;
    }
})();
