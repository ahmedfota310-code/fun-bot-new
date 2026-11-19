const { Client, LocalAuth } = require('whatsapp-web.js');

const PHONE_NUMBER = '201119815662';

const client = new Client({
    authStrategy: new LocalAuth(),
    pairWithPhoneNumber: {
        phoneNumber: PHONE_NUMBER,
        showNotification: true
    },
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--no-zygote'
        ]
    }
});

client.on('code', (code) => {
    console.log('PAIRING CODE:', code);
});

client.on('ready', () => {
    console.log('Bot is ready!');
});

client.on('message', async (msg) => {
    const text = (msg.body || '').trim();

    if (text === 'اوامر') {
        await msg.reply(
            'قائمة الأوامر:\n' +
            '1- اوامر\n' +
            '2- نكتة\n' +
            '3- حظي\n' +
            '4- ملك او كتابة'
        );
    } else if (text === 'نكتة') {
        const jokes = [
            'مرة واحد كسلان راح الامتحان، سلم الورقة فاضية وكتب: الوقت لا يكفي.',
            'مرة مهندس اشترى عربية، كل ما تقف ينزل يخبط الكبوت ويقول: شغال اهو.',
            'مرة طالب بيقول للمدرس: يا أستاذ هو الواحد ممكن يتعاقب على حاجة معملهاش؟ قاله: لأ طبعاً. قاله: طب أنا معملتش الواجب.'
        ];
        const pick = jokes[Math.floor(Math.random() * jokes.length)];
        await msg.reply(pick);
    } else if (text === 'حظي') {
        const luck = [
            'حظك النهاردة حلو جداً، خبر كويس في الطريق.',
            'حظك متوسط، خد الأمور بهدوء وبلاش تسرع.',
            'حظك محتاج صبر شوية النهاردة، وبكرة أحلى.'
        ];
        const pick = luck[Math.floor(Math.random() * luck.length)];
        await msg.reply(pick);
    } else if (text === 'ملك او كتابة') {
        const coin = Math.random() < 0.5 ? 'ملك' : 'كتابة';
        await msg.reply('النتيجة: ' + coin);
    }
});

client.initialize();
