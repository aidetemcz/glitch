// TutorEngine — Mock implementace s rozhraním připraveným pro LLM
// Architektura: TutorEngine.generateResponse(message, context) → response

export class MockTutorEngine {
  constructor() {
    this._usedBlocks = new Set();
  }

  resetConversation() {
    this._usedBlocks.clear();
  }

  generateResponse(message, context) {
    const { allBlocks, topicIndex, currentBlockId, currentChapterId, userProfile } = context;
    const q = message.toLowerCase().trim();

    const qType = this._detectQuestionType(q);

    const scored = allBlocks.map(b => {
      let score = 0;
      const title = (b.meta.title || '').toLowerCase();
      const body = (b.body || '').toLowerCase();
      const words = q.split(/\s+/).filter(w => w.length >= 3);

      for (const word of words) {
        if (title.includes(word)) score += 5;
        if (body.includes(word)) score += 1;
      }

      if (currentChapterId && b._chapter === currentChapterId) score *= 3;
      if (currentBlockId && b.meta.parent === currentBlockId) score *= 2;
      if (this._usedBlocks.has(b.meta.id)) score *= 0.3;

      return { block: b, score };
    }).filter(s => s.score > 0).sort((a, b) => b.score - a.score).slice(0, 4);

    const matchTopics = Object.keys(topicIndex || {}).filter(t =>
      t.toLowerCase().includes(q) || q.includes(t.toLowerCase().split(' ')[0])
    );

    const topScore = scored[0]?.score || 0;
    const confidence = Math.min(1, topScore / 15);

    scored.forEach(s => this._usedBlocks.add(s.block.meta.id));

    const blocks = scored.map(s => ({
      id: s.block.meta.id,
      title: s.block.meta.title,
      chapter: s.block.meta._chapterNum,
      score: s.score
    }));

    if (confidence < 0.1) {
      return {
        text: this._noMatchResponse(),
        blocks: [],
        followUp: 'Zkus se zeptat na doporučování, algoritmy, filtrační bubliny nebo jak funguje YouTube!',
        confidence: 0,
        canEscalate: true
      };
    }

    const top = scored[0].block;
    const teaser = top.meta.teaser || (top.body || '').substring(0, 180).replace(/[#*_\[\]]/g, '').trim();

    let text = this._openingLine(qType, confidence);
    text += `<b>${top.meta.title}</b> (Kapitola ${top.meta._chapterNum}) je přesně o tomhle! `;
    text += `${teaser}... `;
    text += `<br><br><a href="#" onclick="event.preventDefault();app.openBlock('${top.meta.id}')">Přečíst tuto sekci &rarr;</a>`;

    if (scored.length > 1) {
      text += '<br><br>Mohlo by tě také zajímat:';
      scored.slice(1, 3).forEach(s => {
        text += `<br>&bull; <a href="#" onclick="event.preventDefault();app.openBlock('${s.block.meta.id}')">${s.block.meta.title}</a> (Kap. ${s.block.meta._chapterNum})`;
      });
    }

    if (matchTopics.length > 0) {
      text += '<br><br>Souvisej&iacute;c&iacute; t&eacute;mata: ';
      text += matchTopics.slice(0, 3).map(t =>
        `<a href="#" onclick="event.preventDefault();app.showTopic('${t}')">${t}</a>`
      ).join(' &middot; ');
    }

    const followUp = this._socraticFollowUp(qType, top);

    return { text, blocks, followUp, confidence, canEscalate: confidence < 0.3 };
  }

  _detectQuestionType(q) {
    if (/^(proč|jak to|co způsobuje|čím to)/.test(q)) return 'why';
    if (/^(jak|jakým způsobem|jak se|jak můž)/.test(q)) return 'how';
    if (/^(co kdyby|co by se stalo|představ si)/.test(q)) return 'whatif';
    if (/^(co je|co jsou|co to|vysvětli|definuj)/.test(q)) return 'what';
    if (/^(můžeš|mohl bys|řekni mi|ukaž mi)/.test(q)) return 'request';
    return 'general';
  }

  _openingLine(qType, confidence) {
    const lines = {
      why: ["Skvělá otázka! Pavel o tom píše v knize. ", "Přesně tohle Pavel řešil, když navrhoval Recombee! ", "Přemýšlíš jako skutečný inženýr! "],
      how: ["Ukážu ti — Pavel to vysvětluje opravdu dobře. ", "Dobrá otázka! Takhle to funguje: ", "Pavel by to rozebral takhle: "],
      whatif: ["Ó, Pavel miluje takovéhle myšlenkové experimenty! ", "Zajímavé! V Recombee o tomhle hodně přemýšlíme. ", "Pojďme tu myšlenku prozkoumat! "],
      what: ["Dobrá otázka! Podívám se, co o tom Pavel napsal. ", "Tady je, co to znamená: ", "Pavel to v knize vysvětluje: "],
      request: ["Jasně! Najdu ti správnou sekci. ", "Už to hledám! ", "Rád pomohu — od toho tu jsem! "],
      general: ["Podívám se do knihy! ", "Zajímavá otázka! ", "Tady je, co jsem našel: "]
    };
    const options = lines[qType] || lines.general;
    return options[Math.floor(Math.random() * options.length)];
  }

  _socraticFollowUp(qType, topBlock) {
    const followUps = {
      why: [
        'Napadá tě příklad ze skutečného života, kde to hraje roli?',
        'Co myslíš, že by se stalo, kdybychom udělali opak?',
        'Proč myslíš, že to inženýři navrhli zrovna takhle?'
      ],
      how: [
        'Dokázal/a bys tento proces vysvětlit kamarádovi jednoduchými slovy?',
        'Která část tohoto procesu je podle tebe pro počítač nejtěžší?',
        'Napadá tě situace, kdy by tato metoda selhala?'
      ],
      whatif: [
        'Jaké důkazy bys potřeboval/a k otestování té myšlenky?',
        'Jak bys navrhl/a experiment, abys to zjistil/a?',
        'Jaké mohou být nevýhody tohoto přístupu?'
      ],
      what: [
        'Napadá tě každodenní příklad tohoto konceptu?',
        'Jak se to liší od toho, co jsi čekal/a?',
        'Co tě na tomto konceptu nejvíc překvapilo?'
      ],
      general: [
        'Co tě na tomto tématu zajímá nejvíc?',
        'Chtěl/a bys prozkoumat praktické aktivity k tomuto tématu?',
        'Zkus to, co ses naučil/a, vysvětlit někomu — pomůže ti to zapamatovat si to!'
      ]
    };
    const options = followUps[qType] || followUps.general;
    return options[Math.floor(Math.random() * options.length)];
  }

  _noMatchResponse() {
    const responses = [
      "Hmm, o tomhle Pavel v této knize nepsal! Nejlíp se vyznám v doporučovacích systémech. Zkus se zeptat na <b>jak YouTube vybírá videa</b>, <b>filtrační bubliny</b> nebo <b>kolaborativní filtrování</b>!",
      "To je mimo téma této knihy! Ale rád pomohu s <b>jak se aplikace učí tvůj vkus</b>, <b>A/B testováním</b> nebo <b>problémem studeného startu</b>. Nebo můžeš napsat přímo Pavlovi!",
      "Tohle jsem v knize nenašel. Pavel se zaměřil na <b>algoritmy</b>, <b>soukromí</b>, <b>digitální stopy</b> a <b>stavbu vlastního doporučovacího systému</b> — zeptej se na cokoliv z toho!"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  getSuggestedQuestions(block) {
    if (!block) return [];
    const body = (block.body || '').toLowerCase();
    const title = block.meta?.title || '';
    const questions = [];

    if (body.includes('collaborative') || body.includes('kolaborativní')) questions.push('Jak kolaborativní filtrování najde podobné lidi?');
    if (body.includes('content-based') || body.includes('podle obsahu')) questions.push('Na jaké vlastnosti se dívá filtrování podle obsahu?');
    if (body.includes('cold start') || body.includes('studený start')) questions.push('Jak aplikace řeší úplně nové uživatele bez dat?');
    if (body.includes('filter bubble') || body.includes('filtrační bublina') || body.includes('echo chamber')) questions.push('Jak mohu uniknout filtrační bublině?');
    if (body.includes('a/b test')) questions.push('Jak firmy rozhodují, která verze je lepší?');
    if (body.includes('privacy') || body.includes('soukromí') || body.includes('data')) questions.push('Jaká data o mně aplikace sbírají?');
    if (body.includes('popular') || body.includes('trending') || body.includes('populární')) questions.push('Proč „nejpopulárnější" není vždy nejlepší doporučení?');
    if (body.includes('pipeline')) questions.push('Jaké jsou kroky v doporučovacím pipeline?');
    if (body.includes('fair') || body.includes('bias') || body.includes('spravedliv')) questions.push('Mohou být doporučovací systémy nespravedlivé?');
    if (body.includes('autoplay') || body.includes('addictive') || body.includes('návyk')) questions.push('Proč je tak těžké přestat scrollovat?');
    if (body.includes('dopamin')) questions.push('Co má dopamin společného s doporučováním?');
    if (body.includes('youtube') || body.includes('tiktok')) questions.push('Jak vlastně funguje algoritmus YouTube?');

    if (questions.length === 0) {
      questions.push(`Jaká je hlavní myšlenka „${title}"?`);
      questions.push('Proč je toto téma důležité?');
    }

    return questions.slice(0, 3);
  }
}

// Správce konverzací — ukládá historii chatu
export class ConversationManager {
  constructor() {
    this.conversations = [];
    this.authorMessages = [];
    this.load();
  }

  load() {
    try {
      const data = JSON.parse(localStorage.getItem('pbook-conversations') || '{}');
      this.conversations = data.conversations || [];
      this.authorMessages = data.authorMessages || [];
    } catch (e) {}
  }

  save() {
    try {
      const recent = this.conversations.slice(-20);
      localStorage.setItem('pbook-conversations', JSON.stringify({
        conversations: recent,
        authorMessages: this.authorMessages
      }));
    } catch (e) {}
  }

  getOrCreateConversation(blockId, chapterId) {
    const recent = this.conversations.find(c =>
      c.status === 'active' &&
      c.context.blockId === blockId &&
      Date.now() - c.startedAt < 30 * 60 * 1000
    );
    if (recent) return recent;

    const conv = {
      id: 'conv-' + Date.now(),
      startedAt: Date.now(),
      context: { blockId, chapterId },
      messages: [],
      status: 'active'
    };
    this.conversations.push(conv);
    this.save();
    return conv;
  }

  addMessage(convId, role, text, extra = {}) {
    const conv = this.conversations.find(c => c.id === convId);
    if (!conv) return;
    conv.messages.push({ role, text, timestamp: Date.now(), ...extra });
    this.save();
  }

  escalateToAuthor(convId, question, blockId, readerProfile) {
    const msg = {
      id: 'msg-' + Date.now(),
      conversationId: convId,
      blockId,
      question,
      readerProfile: {
        level: readerProfile.level,
        xp: readerProfile.xp,
        readCount: readerProfile.readBlocks?.size || 0
      },
      status: 'pending',
      createdAt: Date.now()
    };
    this.authorMessages.push(msg);

    const conv = this.conversations.find(c => c.id === convId);
    if (conv) conv.status = 'escalated';

    this.save();
    return msg;
  }

  getAuthorMessageCount() {
    return this.authorMessages.filter(m => m.status === 'pending').length;
  }
}
