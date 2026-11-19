const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('Scan QR code from WhatsApp');
});

client.on('ready', () => {
  console.log('Bot is ready!');
});

const jokes = [
  'Joke 1',
  'Joke 2'
];

const luck = [
  'Your luck today is great!',
  'Your luck today is calm and steady.'
];

client.on('message', async (msg) => {
  const text = (msg.body || '').trim();

  if (text === 'اوامر') {
    await msg.reply('اوامر\nنكتة\nحظي\nملك او كتابة');
  } else if (text === 'نكتة') {
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    await msg.reply(joke);
  } else if (text === 'حظي') {
    const item = luck[Math.floor(Math.random() * luck.length)];
    await msg.reply(item);
  } else if (text === 'ملك او كتابة') {
    const res = Math.random() < 0.5 ? 'ملك' : 'كتابة';
    await msg.reply(`النتيجة: ${res}`);
  }
});

client.initialize();
