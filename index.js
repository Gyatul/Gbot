const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');

// Replace with your Telegram bot token
const token = '7220570795:AAGrXxndOJMNNGloJS5Fkl_A8L2QDIBW-jk';

// Initialize bot with the token
const bot = new TelegramBot(token, { polling: true });

// Function to log bot usage activity to console log
function logActivity(msg) {
  const user = msg.from;
  const chat = msg.chat;
  const command = msg.text.toLowerCase();

  console.log(`Telegram Bot Usage Activity`);
  console.log(`• User ID: ${user.id}`);
  console.log(`• Username: ${user.username || 'None'}`);
  console.log(`• Chat ID: ${chat.id}`);
  console.log(`• Command: ${command}`);
}

// Event listener for messages from users
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const command = msg.text.toLowerCase();

  // Log bot usage activity to console log
  logActivity(msg);

  // Respond to the /mix command
  if (command.startsWith('/mix')) {
    // Extract arguments from the message
    const args = command.split(' ');
    const url = args[1];
    const time = args[2];
    const thread = args[3];
    const rate = args[4];

    // Check if the message format is correct
    if (args.length === 5 && url && time && thread && rate) {
      // Execute the mix.js file with the provided arguments
      exec(`node mix.js ${url} ${time} ${thread} ${rate}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          bot.sendMessage(chatId, 'Error');
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          bot.sendMessage(chatId, 'Error');
          return;
        }
        // Display stdout output if successful
        console.log(`stdout: ${stdout}`);
        bot.sendMessage(chatId, 'Process has started.');
      });
    } else {
      // Inform the user that the message format is incorrect
      bot.sendMessage(chatId, 'Incorrect message format. Use format: /mix [url] [time] [thread] [rate]');
    }
  }
});
