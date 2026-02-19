import React, { useEffect, useMemo, useState } from 'react';
import {
  Sparkles,
  Swords,
  Utensils,
  ShowerHead,
  Gamepad2,
  Footprints,
  Dumbbell,
  Brain,
  Heart,
  Coins,
  Trophy,
  Star,
  Zap,
  Factory,
  Cpu,
  Rocket,
  Crown
} from 'lucide-react';

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
  streakDays: 0,
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
  lemonade: { label: 'Stand limonade', baseCost: 25, cps: 0.5, icon: <Coins size={16} /> },
  bakery: { label: 'Boulangerie', baseCost: 140, cps: 3, icon: <Factory size={16} /> },
  arcade: { label: 'Salle arcade', baseCost: 850, cps: 18, icon: <Gamepad2 size={16} /> },
  lab: { label: 'Laboratoire IA', baseCost: 3500, cps: 75, icon: <Cpu size={16} /> },
  orbital: { label: 'Station orbitale', baseCost: 14000, cps: 320, icon: <Rocket size={16} /> }
};

const TamagotchiOdyssey = () => {
  const [game, setGame] = useState(initialGameState);
  const [tab, setTab] = useState('vie');
  const [flash, setFlash] = useState('');

  const addLog = (text) => {
    setGame((prev) => ({
      ...prev,
      logs: [text, ...prev.logs].slice(0, 8)
    }));
  };

  const showFlash = (text) => {
    setFlash(text);
    setTimeout(() => setFlash(''), 1800);
  };

  const levelCap = useMemo(() => 80 + game.level * 40, [game.level]);

  const generatorData = useMemo(() => {
    const entries = Object.entries(generatorCatalog).map(([key, info]) => {
      const owned = game.generators[key];
      const cost = Math.floor(info.baseCost * Math.pow(1.17, owned));
      return { key, ...info, owned, cost };
    });
    return entries;
  }, [game.generators]);

  useEffect(() => {
    const cps = generatorData.reduce((sum, g) => sum + g.cps * g.owned, 0);
    if (cps !== game.coinsPerSecond) {
      setGame((prev) => ({ ...prev, coinsPerSecond: cps }));
    }
  }, [generatorData, game.coinsPerSecond]);

  useEffect(() => {
    const tick = setInterval(() => {
      setGame((prev) => {
        const moodDrop = 0.2 + prev.stage * 0.05;
        let next = {
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
        const done = progress >= quest.target;
        return { ...quest, progress, done };
      });

      let reward = 0;
      quests.forEach((q) => {
        const oldQuest = prev.quests.find((k) => k.id === q.id);
        if (!oldQuest.done && q.done) reward += q.reward;
      });

      if (reward > 0) {
        return {
          ...prev,
          quests,
          coins: prev.coins + reward,
          gems: prev.gems + 1,
          logs: [`Quête complétée: +${reward} pièces, +1 gemme 💎`, ...prev.logs].slice(0, 8)
        };
      }

      return { ...prev, quests };
    });
  };

  const spend = (cost, action) => {
    if (game.coins < cost) {
      showFlash('Pas assez de pièces');
      return;
    }
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
        attributes: {
          ...prev.attributes,
          [skill]: prev.attributes[skill] + 1
        },
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
      setGame((prev) => ({
        ...prev,
        generators: {
          ...prev.generators,
          [key]: prev.generators[key] + 1
        }
      }));
      addLog(`Nouvel actif business: ${generatorCatalog[key].label}.`);
    });
  };

  const pvpFight = () => {
    if (game.battleTickets < 1) {
      showFlash('Ticket de combat requis');
      return;
    }

    const statSum = Object.values(game.attributes).reduce((a, b) => a + b, 0);
    const playerPower = statSum + game.level * 4 + game.stage * 12;
    const opponent = 30 + Math.floor(Math.random() * 80) + Math.floor(game.battleRating / 40);
    const chance = playerPower / (playerPower + opponent);
    const win = Math.random() < chance;

    setGame((prev) => ({
      ...prev,
      battleTickets: Math.max(0, prev.battleTickets - 1),
      coins: prev.coins + (win ? 160 : 45),
      gems: prev.gems + (win ? 1 : 0),
      battleRating: Math.max(700, prev.battleRating + (win ? 22 : -12)),
      mood: Math.min(100, prev.mood + (win ? 12 : -6)),
      logs: [
        win
          ? `Victoire PvP ! +160 pièces, +1 gemme, rating ${prev.battleRating + 22}`
          : `Défaite honorable. +45 pièces, analyse tactique reçue.`,
        ...prev.logs
      ].slice(0, 8)
    }));
  };

  const buyEquipment = (type) => {
    const costs = {
      foodBag: 180,
      toySet: 250,
      trainingGear: 420,
      healingPod: 550
    };

    spend(costs[type], () => {
      setGame((prev) => ({
        ...prev,
        equipment: {
          ...prev.equipment,
          [type]: prev.equipment[type] + 1
        },
        clickPower: prev.clickPower + (type === 'trainingGear' ? 0.6 : 0.25)
      }));
      showFlash('Équipement débloqué');
    });
  };

  const creatureFace = game.mood > 70 ? '😄' : game.mood > 35 ? '🙂' : '😟';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-4">
        <header className="rounded-3xl bg-gradient-to-r from-violet-700 via-indigo-700 to-cyan-700 p-5 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-4xl font-black">Évoli Odyssey</h1>
              <p className="text-sm md:text-base text-violet-100">
                Un tamagotchi profond: élevage, progression, économie clicker et combats PvP.
              </p>
            </div>
            <div className="text-right text-sm">
              <div className="font-bold">Évolution: {EVOLUTIONS[game.stage]}</div>
              <div>Niveau {game.level} • {game.ageDays.toFixed(1)} jours simulés</div>
              <div className="font-semibold text-yellow-200">Rating: {game.battleRating}</div>
            </div>
          </div>
        </header>

        {flash && (
          <div className="rounded-xl border border-cyan-400/40 bg-cyan-400/15 px-4 py-2 text-cyan-200 font-semibold animate-pulse">
            {flash}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-4">
          <section className="rounded-3xl bg-slate-900 border border-slate-700 p-5 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Créature</h2>
              <span className="text-2xl">{creatureFace}</span>
            </div>

            <div className="rounded-2xl p-4 bg-gradient-to-br from-violet-900/60 to-indigo-900/60 border border-violet-400/20 text-center mb-4">
              <div className="text-6xl mb-2">🦊</div>
              <p className="text-violet-200">Affection: {game.affection.toFixed(1)}</p>
            </div>

            <StatBar label="Humeur" value={game.mood} color="bg-fuchsia-500" />
            <StatBar label="Faim" value={game.hunger} color="bg-amber-500" />
            <StatBar label="Hygiène" value={game.hygiene} color="bg-cyan-500" />
            <StatBar label="Énergie" value={game.energy} color="bg-lime-500" />
            <StatBar label="Social" value={game.social} color="bg-blue-500" />
            <StatBar label="Santé" value={game.health} color="bg-rose-500" />

            <div className="mt-4">
              <p className="text-sm mb-1">XP Niveau ({game.xp}/{levelCap})</p>
              <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-300 to-orange-500" style={{ width: `${(game.xp / levelCap) * 100}%` }} />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {Object.entries(game.attributes).map(([k, v]) => (
                <div key={k} className="bg-slate-800 rounded-xl px-3 py-2 flex justify-between">
                  <span className="capitalize">{k}</span>
                  <span className="font-bold">{v}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-slate-900 border border-slate-700 p-5 lg:col-span-2">
            <div className="flex flex-wrap gap-2 mb-4">
              <TabButton current={tab} tab="vie" label="Vie Quotidienne" onClick={() => setTab('vie')} />
              <TabButton current={tab} tab="entrainement" label="Entraînement" onClick={() => setTab('entrainement')} />
              <TabButton current={tab} tab="business" label="Business Clicker" onClick={() => setTab('business')} />
              <TabButton current={tab} tab="pvp" label="Arena PvP" onClick={() => setTab('pvp')} />
            </div>

            {tab === 'vie' && (
              <div className="space-y-3">
                <ActionCard icon={<Utensils size={20} />} title="Nourrir" subtitle="+faim, +affection" cost={20} onClick={() => careAction('feed')} />
                <ActionCard icon={<ShowerHead size={20} />} title="Nettoyer" subtitle="+hygiène" cost={16} onClick={() => careAction('clean')} />
                <ActionCard icon={<Gamepad2 size={20} />} title="Jouer" subtitle="+humeur" cost={25} onClick={() => careAction('play')} />
                <ActionCard icon={<Footprints size={20} />} title="Sortir" subtitle="+social" cost={30} onClick={() => careAction('walk')} />
                <ActionCard icon={<Heart size={20} />} title="Repos" subtitle="+énergie" cost={18} onClick={() => careAction('rest')} />
              </div>
            )}

            {tab === 'entrainement' && (
              <div className="grid md:grid-cols-2 gap-3">
                <ActionCard icon={<Dumbbell size={20} />} title="Puissance" subtitle="Prépare les combats" cost={40} onClick={() => train('puissance')} />
                <ActionCard icon={<Zap size={20} />} title="Agilité" subtitle="Esquive et initiative" cost={40} onClick={() => train('agilite')} />
                <ActionCard icon={<Brain size={20} />} title="Sagesse" subtitle="Tactiques évoluées" cost={40} onClick={() => train('sagesse')} />
                <ActionCard icon={<Sparkles size={20} />} title="Charme" subtitle="Synergies et bonus" cost={40} onClick={() => train('charme')} />

                <div className="md:col-span-2 rounded-2xl bg-slate-800 p-4 text-sm">
                  <p className="font-bold mb-2">Équipements permanents</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <EquipButton label="Sac premium" value={game.equipment.foodBag} onClick={() => buyEquipment('foodBag')} cost={180} />
                    <EquipButton label="Set de jouets" value={game.equipment.toySet} onClick={() => buyEquipment('toySet')} cost={250} />
                    <EquipButton label="Matériel pro" value={game.equipment.trainingGear} onClick={() => buyEquipment('trainingGear')} cost={420} />
                    <EquipButton label="Pod soin" value={game.equipment.healingPod} onClick={() => buyEquipment('healingPod')} cost={550} />
                  </div>
                </div>
              </div>
            )}

            {tab === 'business' && (
              <div>
                <div className="rounded-2xl bg-gradient-to-r from-amber-700/30 to-yellow-600/30 border border-amber-300/20 p-4 mb-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm">Pièces</p>
                      <p className="text-3xl font-black">{Math.floor(game.coins)}</p>
                      <p className="text-xs text-amber-200">{game.coinsPerSecond.toFixed(1)} / sec • combo {game.clickCombo}</p>
                    </div>
                    <button onClick={businessClick} className="rounded-2xl bg-amber-500 hover:bg-amber-400 px-8 py-5 font-black text-slate-900 shadow-xl">
                      Clique pour générer 💼
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {generatorData.map((g) => (
                    <button
                      key={g.key}
                      onClick={() => buyGenerator(g.key, g.cost)}
                      className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-300">{g.icon}</span>
                        <span>{g.label} • possédé {g.owned}</span>
                      </div>
                      <div className="text-sm text-amber-300">{g.cost} 💰 • +{g.cps}/s</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tab === 'pvp' && (
              <div className="space-y-3">
                <div className="rounded-2xl bg-slate-800 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold">Classement Arena</p>
                    <Crown size={18} className="text-yellow-300" />
                  </div>
                  <p className="text-sm text-slate-300">Tickets: {game.battleTickets.toFixed(1)} / 5</p>
                  <p className="text-sm text-slate-300">Niveau de menace conseillé: {Math.floor(game.battleRating / 14)}</p>
                </div>

                <button onClick={pvpFight} className="w-full rounded-2xl bg-rose-600 hover:bg-rose-500 py-4 font-black flex items-center justify-center gap-2">
                  <Swords size={20} /> Lancer un combat classé
                </button>

                <div className="rounded-2xl bg-slate-800 p-4 text-sm">
                  <p>Les combats utilisent les 4 attributs, ton niveau, ton stade d'évolution et ton moral actuel.</p>
                  <p className="text-slate-300 mt-1">Les joueurs assidus gagnent plus de gemmes et des matchs plus rentables.</p>
                </div>
              </div>
            )}
          </section>
        </div>

        <section className="grid md:grid-cols-2 gap-4">
          <div className="rounded-3xl bg-slate-900 border border-slate-700 p-5">
            <div className="flex items-center gap-2 mb-3 font-bold">
              <Trophy size={18} className="text-yellow-300" /> Quêtes journalières
            </div>
            <div className="space-y-2">
              {game.quests.map((quest) => (
                <div key={quest.id} className="rounded-xl bg-slate-800 p-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{quest.label}</span>
                    <span>{quest.progress}/{quest.target}</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${(quest.progress / quest.target) * 100}%` }} />
                  </div>
                  <p className="text-xs text-emerald-300 mt-1">Récompense: {quest.reward} pièces + 1 gemme</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 border border-slate-700 p-5">
            <div className="flex items-center gap-2 mb-3 font-bold">
              <Star size={18} className="text-fuchsia-300" /> Journal de progression
            </div>
            <div className="space-y-2 text-sm">
              {game.logs.map((entry, i) => (
                <div key={`${entry}-${i}`} className="rounded-xl bg-slate-800 px-3 py-2">{entry}</div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">Total clics: {game.totalClicks} • Gemmes: {game.gems} • Série: {game.streakDays} jours</p>
          </div>
        </section>
      </div>
    </div>
  );
};

const StatBar = ({ label, value, color }) => (
  <div className="mb-2">
    <div className="flex justify-between text-xs mb-1">
      <span>{label}</span>
      <span>{Math.round(value)}</span>
    </div>
    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
      <div className={`${color} h-full`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  </div>
);

const TabButton = ({ current, tab, label, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-2 rounded-xl text-sm font-semibold ${current === tab ? 'bg-cyan-500 text-slate-900' : 'bg-slate-800 hover:bg-slate-700'}`}
  >
    {label}
  </button>
);

const ActionCard = ({ icon, title, subtitle, cost, onClick }) => (
  <button
    onClick={onClick}
    className="w-full rounded-2xl bg-slate-800 hover:bg-slate-700 p-4 flex items-center justify-between"
  >
    <div className="flex items-center gap-3 text-left">
      <span className="text-cyan-300">{icon}</span>
      <div>
        <p className="font-bold">{title}</p>
        <p className="text-xs text-slate-300">{subtitle}</p>
      </div>
    </div>
    <p className="font-bold text-amber-300">{cost}💰</p>
  </button>
);

const EquipButton = ({ label, value, onClick, cost }) => (
  <button onClick={onClick} className="rounded-xl bg-slate-700 hover:bg-slate-600 px-3 py-2 flex justify-between">
    <span>{label} (x{value})</span>
    <span className="text-amber-300">{cost}</span>
  </button>
);


export default TamagotchiOdyssey;
