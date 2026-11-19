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
    console.log('امسح الكود ده من واتساب');
});

client.on('ready', () => {
    console.log('البوت شغال تمام!');
});

const jokes = [
    'مرة واحد بخيل اشترى قلم رصاص عشان يكتب بيه وهو مغمض عشان السن ميتبريش.',
    'مرة فرخة دخلت محل موبايلات قالت لهم عندكم كفر؟ قالولها لأ عندنا بيض.'
];

const lucks = [
    'حظك النهاردة فل الفل، أي حاجة هتبدأها هتمشي زي السكينة في الحلاوة.',
    'حظك متوسط النهاردة، بلاش قرارات كبيرة وخليك هادي.'
];

client.on('message', async (msg) => {
    const text = msg.body.trim();
    if (text === 'اوامر') {
        await msg.reply('الأوامر المتاحة:\n- اوامر\n- نكتة\n- حظي\n- ملك او كتابة');
    } else if (text === 'نكتة') {
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        await msg.reply(joke);
    } else if (text === 'حظي') {
        const luck = lucks[Math.floor(Math.random() * lucks.length)];
        await msg.reply(luck);
    } else if (text === 'ملك او كتابة') {
        const res = Math.random() < 0.5 ? 'ملك' : 'كتابة';
        await msg.reply(`النتيجة: ${res}`);
    }
});

client.initialize();
          
