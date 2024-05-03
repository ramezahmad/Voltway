require('dotenv').config();
const messageBox = document.querySelector(".message-box");

const messageBar = document.getElementById("textMessage")
const sendBtn = document.querySelector(".bar-wrapper button");

// Replace 'your-api-key' with your actual OpenAI API key
const OPEN_AI_API_KEY = process.env.OPEN_AI_API_KEY;

// Set the API endpoint based on the desired model
const apiUrl = 'https://api.openai.com/v1/chat/completions';

document.addEventListener('DOMContentLoaded', function () {
  

  sendBtn.onclick = function () {
    if (messageBar.value.length > 0) {
      const userTypedMessage = messageBar.value;
      messageBar.value = "";

      // Display user message
      messageBox.insertAdjacentHTML("beforeend", getUserMessage(userTypedMessage));

      // Display loading indicator
      messageBox.insertAdjacentHTML("beforeend", getLoadingMessage());

      // Send a request to the OpenAI API
      axios.post(
        apiUrl,
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: userTypedMessage }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPEN_AI_API_KEY}`,
          },
        }
      )
        .then(response => {
          // Extract and display the generated response
          const generatedResponse = response.data.choices[0].message.content;
          // Display assistant message
          const assistantMessage = getAssistantMessage(generatedResponse);
          messageBox.insertAdjacentHTML("beforeend", assistantMessage);

          // Remove loading message after a delay (e.g., 100 milliseconds)
          setTimeout(() => {
            const loadingMessage = document.querySelector('.chat.response.new');
            if (loadingMessage) {
              loadingMessage.remove();
            }
          }, 100);
        })
        .catch(error => {
          console.error('Error:', error.response ? error.response.data : error.message);
          // Display an error message
          messageBox.insertAdjacentHTML("beforeend", getAssistantMessage("Oops! An error occurred. Please try again"));
        });
    }
  };

  function getUserMessage(content) {
    return `<div class="chat message">
      <img src="./assets/images/user.jpg">
      <span>${content}</span>
    </div>`;
  }

  function getLoadingMessage() {
    return `<div class="chat response new">
      <img src="./assets/images/robot.png">
      <span>...</span>
    </div>`;
  }

  function getAssistantMessage(content) {
    return `<div class="chat response">
      <img src="./assets/images/robot.png">
      <span>${content}</span>
    </div>`;
  }
});





