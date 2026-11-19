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

let privateMode = false;

const badWords = [
    'كسمك',
    'يبن الاحبه',
    'يبن مرا متناكه',
    'يبن شرموطه',
    'يبن عرص'
];

async function handleCommand(msg) {
    const text = (msg.body || '').trim();

    if (msg.fromMe && text === '.خاص') {
        privateMode = true;
        await msg.reply('تم تفعيل الوضع الخاص (لأوامرك فقط).');
        return;
    }

    if (msg.fromMe && text === '.جماعي') {
        privateMode = false;
        await msg.reply('تم تفعيل الوضع الجماعي (الكل يقدر يستخدم البوت).');
        return;
    }

    if (privateMode && !msg.fromMe) {
        return;
    }

    if (!msg.fromMe && badWords.some((word) => text.includes(word))) {
        await msg.reply('كسمك');
        return;
    }

    if (text === 'اوامر' || text === '.اوامر') {
        await msg.reply(
            'قائمة الأوامر:\n' +
            '1- اوامر\n' +
            '2- نكتة\n' +
            '3- حظي\n' +
            '4- ملك او كتابة\n' +
            '5- .طرد (منشن شخص داخل الجروب)\n' +
            '6- .جوزني (داخل الجروب)\n' +
            '7- .خاص / .جماعي (للمالك)'
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
    } else if (text === '.جوزني') {
        const chat = await msg.getChat();

        if (!chat.isGroup) {
            await msg.reply('الأمر ده بيشتغل جوه الجروبات بس.');
            return;
        }

        const senderId = msg.author || msg.from;
        const candidates = (chat.participants || []).filter((p) => p.id._serialized !== senderId);

        if (candidates.length === 0) {
            await msg.reply('مفيش حد تاني في الجروب أختاره.');
            return;
        }

        const chosen = candidates[Math.floor(Math.random() * candidates.length)];
        const contact = await client.getContactById(chosen.id._serialized);
        const tag = '@' + chosen.id.user;

        await chat.sendMessage(`مبروك معرصين ${tag}`, {
            mentions: [contact]
        });
    } else if (text.startsWith('.طرد')) {
        const chat = await msg.getChat();

        if (!chat.isGroup) {
            await msg.reply('الأمر ده بيشتغل جوه الجروبات بس.');
            return;
        }

        const botId = client.info.wid._serialized;
        const botParticipant = chat.participants.find((p) => p.id._serialized === botId);
        const botIsAdmin = Boolean(botParticipant && (botParticipant.isAdmin || botParticipant.isSuperAdmin));

        if (!botIsAdmin) {
            await msg.reply('لازم ترفعني مشرف (أدمن) في الجروب الأول عشان أقدر أطرد.');
            return;
        }

        const targets = msg.mentionedIds || [];
        if (targets.length === 0) {
            await msg.reply('منشن الشخص اللي عايز تطرده مع كلمة .طرد');
            return;
        }

        try {
            await chat.removeParticipants(targets);
            await msg.reply('تم الطرد بنجاح.');
        } catch (err) {
            await msg.reply('مقدرتش أطرده (ممكن يكون مشرف أو في مشكلة في الصلاحيات).');
        }
    }
}

client.on('message', async (msg) => {
    await handleCommand(msg);
});

client.on('message_create', async (msg) => {
    if (msg.fromMe) {
        await handleCommand(msg);
    }
});

client.initialize();
                                                            
