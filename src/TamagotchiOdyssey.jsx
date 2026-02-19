import React, { useEffect, useMemo, useState } from 'react';

const EVOLUTIONS = ['Œuf', 'Nouveau-né', 'Junior', 'Aventurier', 'Champion'];

const initialGameState = {
  stage: 0,
  ageDays: 0,
  xp: 0,
  level: 1,
  mood: 100,
  hunger: 100,
  hygiene: 100,
  energy: 100,
  social: 75,
  health: 100,
  affection: 0,
  coins: 100,
  gems: 0,
  totalClicks: 0,
  clickPower: 1,
  clickCombo: 0,
  lastClickAt: 0,
  coinsPerSecond: 0,
  battleRating: 1000,
  battleTickets: 3,
  attributes: {
    puissance: 5,
    agilite: 5,
    sagesse: 5,
    charme: 5
  },
  equipment: {
    foodBag: 0,
    toySet: 0,
    trainingGear: 0,
    healingPod: 0
  },
  generators: {
    lemonade: 0,
    bakery: 0,
    arcade: 0,
    lab: 0,
    orbital: 0
  },
  quests: [
    { id: 'feed-3', label: 'Nourrir 3 fois', progress: 0, target: 3, reward: 80, done: false },
    { id: 'train-2', label: 'Entraîner 2 compétences', progress: 0, target: 2, reward: 100, done: false },
    { id: 'click-120', label: '120 clics business', progress: 0, target: 120, reward: 120, done: false }
  ],
  logs: ['Bienvenue dans Évoli Odyssey ✨']
};

const generatorCatalog = {
  lemonade: { label: 'Stand limonade', baseCost: 25, cps: 0.5 },
  bakery: { label: 'Boulangerie', baseCost: 140, cps: 3 },
  arcade: { label: 'Salle arcade', baseCost: 850, cps: 18 },
  lab: { label: 'Laboratoire IA', baseCost: 3500, cps: 75 },
  orbital: { label: 'Station orbitale', baseCost: 14000, cps: 320 }
};

const TamagotchiOdyssey = () => {
  const [game, setGame] = useState(initialGameState);
  const [tab, setTab] = useState('vie');
  const [flash, setFlash] = useState('');

  const addLog = (text) => {
    setGame((prev) => ({ ...prev, logs: [text, ...prev.logs].slice(0, 8) }));
  };

  const showFlash = (text) => {
    setFlash(text);
    setTimeout(() => setFlash(''), 1800);
  };

  const levelCap = useMemo(() => 80 + game.level * 40, [game.level]);

  const generatorData = useMemo(
    () =>
      Object.entries(generatorCatalog).map(([key, info]) => {
        const owned = game.generators[key];
        const cost = Math.floor(info.baseCost * Math.pow(1.17, owned));
        return { key, ...info, owned, cost };
      }),
    [game.generators]
  );

  useEffect(() => {
    const cps = generatorData.reduce((sum, g) => sum + g.cps * g.owned, 0);
    if (cps !== game.coinsPerSecond) setGame((prev) => ({ ...prev, coinsPerSecond: cps }));
  }, [generatorData, game.coinsPerSecond]);

  useEffect(() => {
    const tick = setInterval(() => {
      setGame((prev) => {
        const moodDrop = 0.2 + prev.stage * 0.05;
        const next = {
          ...prev,
          ageDays: prev.ageDays + 1 / 120,
          hunger: Math.max(0, prev.hunger - 0.35),
          hygiene: Math.max(0, prev.hygiene - 0.25),
          energy: Math.max(0, prev.energy - 0.2),
          social: Math.max(0, prev.social - 0.15),
          mood: Math.max(0, prev.mood - moodDrop),
          coins: prev.coins + prev.coinsPerSecond / 2,
          battleTickets: Math.min(5, prev.battleTickets + 0.003)
        };

        const wellbeing = (next.hunger + next.hygiene + next.energy + next.social) / 4;
        next.health = Math.max(0, Math.min(100, wellbeing));
        if (wellbeing > 75) next.affection += 0.05;
        if (wellbeing < 35) next.affection = Math.max(0, next.affection - 0.08);

        if (next.stage < 4 && next.level >= 5 + next.stage * 5 && next.affection >= (next.stage + 1) * 20) {
          next.stage += 1;
          next.mood = Math.min(100, next.mood + 25);
          next.coins += 220 * next.stage;
          next.logs = [`Évolution atteinte: ${EVOLUTIONS[next.stage]} 🌟`, ...next.logs].slice(0, 8);
        }

        return next;
      });
    }, 500);

    return () => clearInterval(tick);
  }, []);

  const gainXp = (value) => {
    setGame((prev) => {
      let xp = prev.xp + value;
      let level = prev.level;
      let coins = prev.coins;
      while (xp >= 80 + level * 40) {
        xp -= 80 + level * 40;
        level += 1;
        coins += 35;
      }
      return { ...prev, xp, level, coins };
    });
  };

  const progressQuest = (questId, amount = 1) => {
    setGame((prev) => {
      const quests = prev.quests.map((quest) => {
        if (quest.id !== questId || quest.done) return quest;
        const progress = Math.min(quest.target, quest.progress + amount);
        return { ...quest, progress, done: progress >= quest.target };
      });

      let reward = 0;
      quests.forEach((q) => {
        const oldQuest = prev.quests.find((k) => k.id === q.id);
        if (!oldQuest.done && q.done) reward += q.reward;
      });

      if (!reward) return { ...prev, quests };
      return {
        ...prev,
        quests,
        coins: prev.coins + reward,
        gems: prev.gems + 1,
        logs: [`Quête complétée: +${reward} pièces, +1 gemme 💎`, ...prev.logs].slice(0, 8)
      };
    });
  };

  const spend = (cost, action) => {
    if (game.coins < cost) return showFlash('Pas assez de pièces');
    setGame((prev) => ({ ...prev, coins: prev.coins - cost }));
    action();
  };

  const careAction = (type) => {
    const actions = {
      feed: { cost: 20, text: 'Repas équilibré 🍲' },
      clean: { cost: 16, text: 'Toilette impeccable 🫧' },
      play: { cost: 25, text: 'Session fun 🎉' },
      walk: { cost: 30, text: 'Sortie en ville 🌆' },
      rest: { cost: 18, text: 'Sieste réparatrice 😴' }
    };
    const cfg = actions[type];
    spend(cfg.cost, () => {
      setGame((prev) => ({
        ...prev,
        hunger: Math.min(100, prev.hunger + (type === 'feed' ? 30 : 6)),
        hygiene: Math.min(100, prev.hygiene + (type === 'clean' ? 35 : 4)),
        mood: Math.min(100, prev.mood + (type === 'play' ? 25 : 10)),
        social: Math.min(100, prev.social + (type === 'walk' ? 22 : 6)),
        energy: Math.min(100, prev.energy + (type === 'rest' ? 35 : -5)),
        affection: prev.affection + 1.2
      }));
      gainXp(14);
      progressQuest('feed-3', type === 'feed' ? 1 : 0);
      showFlash(cfg.text);
      addLog(cfg.text);
    });
  };

  const train = (skill) => {
    spend(40, () => {
      setGame((prev) => ({
        ...prev,
        attributes: { ...prev.attributes, [skill]: prev.attributes[skill] + 1 },
        energy: Math.max(0, prev.energy - 15),
        mood: Math.min(100, prev.mood + 6)
      }));
      gainXp(24);
      progressQuest('train-2', 1);
      showFlash(`${skill} +1`);
      addLog(`Entraînement ${skill}: progression validée.`);
    });
  };

  const businessClick = () => {
    const now = Date.now();
    const combo = now - game.lastClickAt < 1300 ? Math.min(30, game.clickCombo + 1) : 0;
    const earned = Math.floor((game.clickPower + combo * 0.3) * (1 + game.level * 0.05));

    setGame((prev) => ({
      ...prev,
      coins: prev.coins + earned,
      totalClicks: prev.totalClicks + 1,
      clickCombo: combo,
      lastClickAt: now
    }));

    progressQuest('click-120', 1);
  };

  const buyGenerator = (key, cost) => {
    spend(cost, () => {
      setGame((prev) => ({ ...prev, generators: { ...prev.generators, [key]: prev.generators[key] + 1 } }));
      addLog(`Nouvel actif business: ${generatorCatalog[key].label}.`);
    });
  };

  const pvpFight = () => {
    if (game.battleTickets < 1) return showFlash('Ticket de combat requis');
    const statSum = Object.values(game.attributes).reduce((a, b) => a + b, 0);
    const playerPower = statSum + game.level * 4 + game.stage * 12;
    const opponent = 30 + Math.floor(Math.random() * 80) + Math.floor(game.battleRating / 40);
    const win = Math.random() < playerPower / (playerPower + opponent);

    setGame((prev) => ({
      ...prev,
      battleTickets: Math.max(0, prev.battleTickets - 1),
      coins: prev.coins + (win ? 160 : 45),
      gems: prev.gems + (win ? 1 : 0),
      battleRating: Math.max(700, prev.battleRating + (win ? 22 : -12)),
      mood: Math.min(100, prev.mood + (win ? 12 : -6)),
      logs: [
        win ? `Victoire PvP ! +160 pièces, +1 gemme.` : 'Défaite honorable. +45 pièces, analyse tactique reçue.',
        ...prev.logs
      ].slice(0, 8)
    }));
  };

  const buyEquipment = (type) => {
    const costs = { foodBag: 180, toySet: 250, trainingGear: 420, healingPod: 550 };
    spend(costs[type], () => {
      setGame((prev) => ({
        ...prev,
        equipment: { ...prev.equipment, [type]: prev.equipment[type] + 1 },
        clickPower: prev.clickPower + (type === 'trainingGear' ? 0.6 : 0.25)
      }));
      showFlash('Équipement débloqué');
    });
  };

  return (
    <div className="app-shell">
      <div className="app-wrap">
        <header className="hero-card">
          <div>
            <h1>🌈 Évoli Odyssey</h1>
            <p>Un tamagotchi coloré, attachant et profond pour les enfants et les adultes.</p>
          </div>
          <div className="hero-stats">
            <div>Évolution: <b>{EVOLUTIONS[game.stage]}</b></div>
            <div>Niveau <b>{game.level}</b> • {game.ageDays.toFixed(1)} jours</div>
            <div>🏆 Rating: <b>{game.battleRating}</b></div>
          </div>
        </header>

        {flash && <div className="flash-banner">{flash}</div>}

        <div className="main-grid">
          <section className="panel creature-panel">
            <h2>Ta créature</h2>
            <CreatureSprite mood={game.mood} stage={game.stage} />
            <p className="affection">Affection 💖 {game.affection.toFixed(1)}</p>

            <StatBar label="Humeur" value={game.mood} tone="pink" />
            <StatBar label="Faim" value={game.hunger} tone="orange" />
            <StatBar label="Hygiène" value={game.hygiene} tone="blue" />
            <StatBar label="Énergie" value={game.energy} tone="green" />
            <StatBar label="Social" value={game.social} tone="violet" />
            <StatBar label="Santé" value={game.health} tone="red" />

            <div className="xp-wrap">
              <small>XP {game.xp}/{levelCap}</small>
              <div className="bar-bg"><div className="bar-xp" style={{ width: `${(game.xp / levelCap) * 100}%` }} /></div>
            </div>
          </section>

          <section className="panel gameplay-panel">
            <div className="tabs">
              {['vie', 'entrainement', 'business', 'pvp'].map((t) => (
                <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                  {t === 'vie' && '🏡 Vie'}
                  {t === 'entrainement' && '⚔️ Entraînement'}
                  {t === 'business' && '💼 Business'}
                  {t === 'pvp' && '🏟️ Arena'}
                </button>
              ))}
            </div>

            {tab === 'vie' && (
              <div className="actions-grid">
                <ActionButton onClick={() => careAction('feed')} title="🍖 Nourrir" cost={20} subtitle="+faim +affection" />
                <ActionButton onClick={() => careAction('clean')} title="🧼 Nettoyer" cost={16} subtitle="+hygiène" />
                <ActionButton onClick={() => careAction('play')} title="🎮 Jouer" cost={25} subtitle="+humeur" />
                <ActionButton onClick={() => careAction('walk')} title="🌳 Sortir" cost={30} subtitle="+social" />
                <ActionButton onClick={() => careAction('rest')} title="😴 Repos" cost={18} subtitle="+énergie" />
              </div>
            )}

            {tab === 'entrainement' && (
              <>
                <div className="actions-grid">
                  <ActionButton onClick={() => train('puissance')} title="💪 Puissance" cost={40} subtitle={`Niv. ${game.attributes.puissance}`} />
                  <ActionButton onClick={() => train('agilite')} title="⚡ Agilité" cost={40} subtitle={`Niv. ${game.attributes.agilite}`} />
                  <ActionButton onClick={() => train('sagesse')} title="🧠 Sagesse" cost={40} subtitle={`Niv. ${game.attributes.sagesse}`} />
                  <ActionButton onClick={() => train('charme')} title="✨ Charme" cost={40} subtitle={`Niv. ${game.attributes.charme}`} />
                </div>
                <div className="equipment-box">
                  <h3>Équipements</h3>
                  <div className="equip-grid">
                    <EquipButton label="Sac premium" value={game.equipment.foodBag} onClick={() => buyEquipment('foodBag')} cost={180} />
                    <EquipButton label="Set jouets" value={game.equipment.toySet} onClick={() => buyEquipment('toySet')} cost={250} />
                    <EquipButton label="Matériel pro" value={game.equipment.trainingGear} onClick={() => buyEquipment('trainingGear')} cost={420} />
                    <EquipButton label="Pod soin" value={game.equipment.healingPod} onClick={() => buyEquipment('healingPod')} cost={550} />
                  </div>
                </div>
              </>
            )}

            {tab === 'business' && (
              <>
                <div className="wallet-card">
                  <div>
                    <div className="value">{Math.floor(game.coins)} 💰</div>
                    <small>{game.coinsPerSecond.toFixed(1)}/s • combo {game.clickCombo}</small>
                  </div>
                  <button className="clicker-btn" onClick={businessClick}>CLIC BUSINESS</button>
                </div>
                <div className="list-box">
                  {generatorData.map((g) => (
                    <button key={g.key} className="list-item" onClick={() => buyGenerator(g.key, g.cost)}>
                      <span>{g.label} • x{g.owned}</span>
                      <b>{g.cost} 💰 (+{g.cps}/s)</b>
                    </button>
                  ))}
                </div>
              </>
            )}

            {tab === 'pvp' && (
              <div className="pvp-box">
                <p>Tickets combat: <b>{game.battleTickets.toFixed(1)} / 5</b></p>
                <p>Ton moral et tes stats influencent les chances de victoire.</p>
                <button className="battle-btn" onClick={pvpFight}>⚔️ Lancer un combat classé</button>
              </div>
            )}
          </section>
        </div>

        <div className="bottom-grid">
          <section className="panel">
            <h3>🎯 Quêtes</h3>
            {game.quests.map((quest) => (
              <div key={quest.id} className="quest-item">
                <div className="quest-head"><span>{quest.label}</span><span>{quest.progress}/{quest.target}</span></div>
                <div className="bar-bg"><div className="bar-quest" style={{ width: `${(quest.progress / quest.target) * 100}%` }} /></div>
              </div>
            ))}
          </section>

          <section className="panel">
            <h3>📘 Journal</h3>
            <div className="log-list">
              {game.logs.map((entry, i) => (
                <div key={`${entry}-${i}`} className="log-item">{entry}</div>
              ))}
            </div>
            <small>Total clics: {game.totalClicks} • Gemmes: {game.gems}</small>
          </section>
        </div>
      </div>
    </div>
  );
};

const CreatureSprite = ({ mood, stage }) => {
  const happy = mood > 60;
  const sad = mood < 35;
  const scale = 1 + stage * 0.05;
  return (
    <div className="creature-wrap" style={{ transform: `scale(${scale})` }}>
      <div className="ear left" />
      <div className="ear right" />
      <div className="face">
        <div className={`eye ${sad ? 'sad' : ''}`} />
        <div className={`eye ${sad ? 'sad' : ''}`} />
        <div className={`mouth ${happy ? 'happy' : sad ? 'sad' : ''}`} />
        <div className="cheek left" />
        <div className="cheek right" />
      </div>
    </div>
  );
};

const ActionButton = ({ onClick, title, cost, subtitle }) => (
  <button className="action-btn" onClick={onClick}>
    <div>
      <strong>{title}</strong>
      <small>{subtitle}</small>
    </div>
    <b>{cost}💰</b>
  </button>
);

const EquipButton = ({ label, value, onClick, cost }) => (
  <button className="equip-btn" onClick={onClick}>
    <span>{label} (x{value})</span>
    <b>{cost}</b>
  </button>
);

const StatBar = ({ label, value, tone }) => (
  <div className="stat-row">
    <div className="stat-head"><span>{label}</span><span>{Math.round(value)}</span></div>
    <div className="bar-bg"><div className={`bar-fill ${tone}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>
  </div>
);

export default TamagotchiOdyssey;
