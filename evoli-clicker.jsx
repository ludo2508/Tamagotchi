import React, { useState, useEffect } from 'react';
import { Heart, Utensils, Stethoscope, Droplets, Dumbbell, FastForward, Briefcase, GraduationCap, Hammer, Cpu, Factory, Rocket, Sparkles } from 'lucide-react';

const TamagotchiClicker = () => {
  const [gameState, setGameState] = useState({
    stage: 'egg',
    eggClicks: 0,
    age: 0,
    hunger: 100,
    happiness: 100,
    health: 100,
    hygiene: 100,
    energy: 100,
    education: 0,
    lastUpdate: Date.now(),
    hasPoop: false,
    timeSpeed: 1,
    animation: 'idle',
    animationFrame: 0,
    position: 0,

    coins: 0,
    clickPower: 1,
    coinsPerSecond: 0,
    totalClicks: 0,

    upgrades: {
      autoWorker1: 0,
      autoWorker2: 0,
      factory: 0,
      robot: 0,
      aiSystem: 0,
      spaceStation: 0,
      clickMultiplier: 1
    }
  });

  const [message, setMessage] = useState('');
  const [activeGame, setActiveGame] = useState(null);
  const [runnerGame, setRunnerGame] = useState({
    running: false,
    position: 0,
    jumping: false,
    score: 0,
    obstacles: [],
    gameOver: false
  });
  const [clickAnimation, setClickAnimation] = useState([]);

  const getCostMultiplier = () => {
    if (gameState.stage === 'adult') return 3;
    if (gameState.stage === 'child') return 2;
    return 1;
  };

  const basePrices = {
    food: 5,
    play: 15,
    doctor: 50,
    clean: 8,
    exercise: 20,
    school: 30,
    autoWorker1: 15,
    autoWorker2: 150,
    factory: 1000,
    robot: 5000,
    aiSystem: 25000,
    spaceStation: 100000,
    clickMultiplier: 75
  };

  const getPrices = () => {
    const multiplier = getCostMultiplier();
    return Object.fromEntries(
      Object.entries(basePrices).map(([key, value]) => [key, Math.floor(value * multiplier)])
    );
  };

  const prices = getPrices();

  useEffect(() => {
    const cps =
      gameState.upgrades.autoWorker1 * 1 +
      gameState.upgrades.autoWorker2 * 10 +
      gameState.upgrades.factory * 50 +
      gameState.upgrades.robot * 200 +
      gameState.upgrades.aiSystem * 1000 +
      gameState.upgrades.spaceStation * 5000;

    setGameState(prev => ({ ...prev, coinsPerSecond: cps }));

    if (cps > 0) {
      const interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          coins: prev.coins + (cps / 10) * prev.timeSpeed
        }));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [gameState.upgrades, gameState.timeSpeed]);

  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const now = Date.now();
        const timeDiff = (now - prev.lastUpdate) * prev.timeSpeed;
        const minutesPassed = timeDiff / 60000;
        let newState = {
          ...prev,
          lastUpdate: now,
          age: prev.age + minutesPassed,
          hunger: Math.max(0, prev.hunger - minutesPassed * 2),
          happiness: Math.max(0, prev.happiness - minutesPassed * 1.5),
          hygiene: Math.max(0, prev.hygiene - minutesPassed * 1),
          energy: Math.max(0, prev.energy - minutesPassed * 0.5)
        };
        if (newState.stage === 'baby' && newState.age >= 10) {
          newState.stage = 'child';
          showMessage('✨ Évoli a grandi !');
        }
        if (newState.stage === 'child' && newState.age >= 30) {
          newState.stage = 'adult';
          showMessage('🌟 Évoli est adulte !');
        }
        if (!newState.hasPoop && Math.random() < 0.005 * minutesPassed) {
          newState.hasPoop = true;
          newState.hygiene = Math.max(0, newState.hygiene - 30);
        }
        if (newState.hunger < 20 || newState.happiness < 20 || newState.hygiene < 20) {
          newState.health = Math.max(0, newState.health - minutesPassed * 0.5);
        }
        return newState;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!runnerGame.running || runnerGame.gameOver) return;
    const gameLoop = setInterval(() => {
      setRunnerGame(prev => {
        let newObstacles = prev.obstacles.map(obs => ({ ...obs, x: obs.x - 5 }))
          .filter(obs => obs.x > -20);
        if (Math.random() < 0.02) {
          newObstacles.push({ x: 100, height: 15 });
        }
        const charX = 20;
        const charY = prev.jumping ? 30 : 60;
        const collision = newObstacles.some(obs =>
          obs.x < charX + 10 && obs.x + 10 > charX && charY + 15 > 60
        );
        if (collision) {
          showMessage('💥 Perdu ! Score: ' + prev.score);
          return { ...prev, gameOver: true, running: false };
        }
        const newScore = prev.score + 1;

        return {
          ...prev,
          obstacles: newObstacles,
          score: newScore,
          jumping: prev.jumping
        };
      });
    }, 50);
    return () => clearInterval(gameLoop);
  }, [runnerGame.running, runnerGame.gameOver]);

  useEffect(() => {
    if (runnerGame.jumping) {
      const timer = setTimeout(() => {
        setRunnerGame(prev => ({ ...prev, jumping: false }));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [runnerGame.jumping]);

  useEffect(() => {
    if (gameState.stage !== 'egg') {
      const animationInterval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          animationFrame: (prev.animationFrame + 1) % 4 // 4 frames d'animation
        }));
      }, 300); // Mettre à jour toutes les 300ms pour une animation fluide

      return () => clearInterval(animationInterval);
    }
  }, [gameState.stage]);

  useEffect(() => {
    if (gameState.stage !== 'egg') {
      const moveInterval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          position: prev.position === 0 ? 5 : 0 // Osciller entre 0 et 5
        }));
      }, 1000); // Changer de direction toutes les secondes

      return () => clearInterval(moveInterval);
    }
  }, [gameState.stage]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleEggClick = () => {
    setGameState(prev => ({
      ...prev,
      eggClicks: prev.eggClicks + 1
    }));

    if (gameState.eggClicks + 1 >= 5) {
      setGameState(prev => ({
        ...prev,
        stage: 'baby',
        eggClicks: 0
      }));
      showMessage('🥚 Lœuf a éclos !');
    }
  };

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const earnedCoins = gameState.clickPower * gameState.upgrades.clickMultiplier * gameState.timeSpeed;

    setGameState(prev => ({
      ...prev,
      coins: prev.coins + earnedCoins,
      totalClicks: prev.totalClicks + 1
    }));
    setClickAnimation(prev => [...prev, { x, y, value: earnedCoins, id: Date.now() }]);
    setTimeout(() => {
      setClickAnimation(prev => prev.slice(1));
    }, 1000);
  };

  const buyAction = (cost, callback) => {
    if (gameState.coins < cost) {
      showMessage('❌ Pas assez de pièces !');
      return false;
    }
    setGameState(prev => ({ ...prev, coins: prev.coins - cost }));
    callback();
    return true;
  };

  const feed = () => {
    buyAction(prices.food, () => {
      setGameState(prev => ({
        ...prev,
        hunger: Math.min(100, prev.hunger + 30),
        happiness: Math.min(100, prev.happiness + 5)
      }));
      showMessage('🍖 Miam !');
    });
  };

  const startRunnerGame = () => {
    if (!buyAction(prices.play, () => {})) return;

    setRunnerGame({
      running: true,
      position: 0,
      jumping: false,
      score: 0,
      obstacles: [],
      gameOver: false
    });
    setActiveGame('runner');
  };

  const jumpRunner = () => {
    if (!runnerGame.jumping && runnerGame.running) {
      setRunnerGame(prev => ({ ...prev, jumping: true }));
    }
  };

  const closeGame = () => {
    if (runnerGame.score > 0 && activeGame === 'runner') {
      const reward = Math.floor(runnerGame.score / 10);
      setGameState(prev => ({
        ...prev,
        happiness: Math.min(100, prev.happiness + 20),
        energy: Math.max(0, prev.energy - 15),
        coins: prev.coins + reward
      }));
      showMessage(`🎮 Score: ${runnerGame.score} | Bonus: ${reward} 💰`);
    }
    setActiveGame(null);
    setRunnerGame({
      running: false,
      position: 0,
      jumping: false,
      score: 0,
      obstacles: [],
      gameOver: false
    });
  };

  const goToDoctor = () => {
    buyAction(prices.doctor, () => {
      setGameState(prev => ({ ...prev, health: 100 }));
      showMessage('💊 En pleine forme !');
    });
  };

  const clean = () => {
    buyAction(prices.clean, () => {
      setGameState(prev => ({ ...prev, hygiene: 100, hasPoop: false }));
      showMessage('✨ Tout propre !');
    });
  };

  const exercise = () => {
    buyAction(prices.exercise, () => {
      setGameState(prev => ({
        ...prev,
        energy: Math.max(0, prev.energy - 20),
        health: Math.min(100, prev.health + 15)
      }));
      showMessage('💪 Bon sport !');
    });
  };

  const goToSchool = () => {
    if (gameState.stage === 'baby') {
      showMessage('Trop jeune pour l\'école !');
      return;
    }
    buyAction(prices.school, () => {
      setGameState(prev => ({
        ...prev,
        education: Math.min(100, prev.education + 10),
        energy: Math.max(0, prev.energy - 15),
        happiness: Math.min(100, prev.happiness + 5)
      }));
      showMessage('📚 +10 éducation !');
    });
  };

  const buyUpgrade = (upgrade) => {
    const baseCost = basePrices[upgrade];
    const cost = Math.floor(baseCost * Math.pow(1.15, gameState.upgrades[upgrade]));

    if (gameState.coins < cost) {
      showMessage('❌ Pas assez de pièces !');
      return;
    }

    setGameState(prev => ({
      ...prev,
      coins: prev.coins - cost,
      upgrades: {
        ...prev.upgrades,
        [upgrade]: prev.upgrades[upgrade] + 1
      }
    }));
  };

  const getMood = () => {
    const avg = (gameState.hunger + gameState.happiness + gameState.health) / 3;
    if (avg > 70) return 'happy';
    if (avg > 40) return 'neutral';
    return 'sad';
  };

  const renderEvoli = () => {
    if (gameState.stage === 'egg') {
      return (
        <div className="relative inline-block" onClick={handleEggClick}>
          <svg
            width={100}
            height={100}
            className="pixelated"
          >
            <ellipse cx={50} cy={50} rx={40} ry={50} fill="#f0f0f0" stroke="#333" strokeWidth={2} />
            {gameState.eggClicks > 0 && (
              <path d={`M20,50 Q50,${30 + gameState.eggClicks * 5} 80,50 T20,50`} stroke="#333" strokeWidth={1} fill="none" />
            )}
            {gameState.eggClicks > 1 && (
              <path d={`M30,30 Q50,${40 + gameState.eggClicks * 3} 70,30 T30,30`} stroke="#333" strokeWidth={1} fill="none" />
            )}
            {gameState.eggClicks > 2 && (
              <path d={`M40,70 Q50,${60 + gameState.eggClicks * 2} 60,70 T40,70`} stroke="#333" strokeWidth={1} fill="none" />
            )}
          </svg>
        </div>
      );
    } else {
      const mood = getMood();
      const pixelSize = gameState.stage === 'baby' ? 4 : gameState.stage === 'child' ? 5 : 6;

      const colors = {
        t: 'transparent',
        c1: '#493269',  c2: '#916ac6',  c3: '#a673c6',  c4: '#827dd1',
        c5: '#4a3369',  c6: '#9878cc',  c7: '#79b2d0',  c8: '#da8aba',
        c9: '#4e366d',  c10: '#97e3ba', c11: '#835cbc', c12: '#f0b1aa',
        c13: '#f5f4f6', c14: '#a893d0', c15: '#eecd94', c16: '#b07fc9',
        c17: '#8d65b0', c18: '#4a336a', c19: '#be7cb9', c20: '#faf9fa',
        c21: '#7461bb', c22: '#523c70', c23: '#cc96c8', c24: '#84d7cb',
        c25: '#704f9d', c26: '#eceaf0', c27: '#fbfbfc', c28: '#fefefe'
      };

      const pixelData = [
        ['t','c1','c1','c1','t','t','t','t','t','t','t','t','t','t','t','t','t','t','t','t','t','c1','c1','c1','t','t','t','t'],
        ['c1','c2','c2','c3','c1','t','t','t','t','t','t','t','t','t','t','t','t','t','t','t','c1','c4','c4','c5','t','t','t','t'],
        ['c1','c2','c6','c2','c3','c1','t','t','t','t','t','t','t','t','t','t','t','t','t','c5','c4','c6','c7','c6','c1','t','t','t'],
        ['c1','c2','c8','c6','c6','c3','c1','t','t','t','t','t','t','t','t','t','t','t','c1','c4','c6','c7','c7','c6','c1','t','t','t'],
        ['c1','c2','c8','c8','c2','c3','c3','c9','t','t','t','t','t','t','t','t','t','c1','c4','c4','c7','c10','c7','c6','c1','t','t','t'],
        ['c1','c11','c8','c8','c8','c6','c3','c9','t','t','t','t','t','t','t','t','c1','c2','c4','c7','c10','c10','c7','c6','c1','t','t','t'],
        ['c5','c2','c8','c12','c8','c6','c2','c2','c1','c13','c1','c1','c1','c1','c1','t','c1','c4','c14','c10','c10','c15','c16','c2','c1','t','t','t'],
        ['t','c5','c11','c12','c12','c6','c4','c2','c3','c16','c3','c16','c16','c16','c16','c16','c6','c4','c14','c15','c15','c12','c14','c11','c1','t','t','t','t'],
        ['t','c1','c2','c19','c12','c8','c3','c3','c16','c16','c16','c3','c16','c16','c16','c16','c16','c16','c14','c12','c12','c19','c11','c1','t','t','t','t'],
        ['t','c20','c5','c11','c19','c19','c3','c3','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c14','c12','c12','c19','c11','c1','t','t','t','t'],
        ['t','t','c5','c1','c3','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c11','c1','t','t','t','t','t','t'],
        ['t','t','c1','c11','c3','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c16','c2','c18','t','t','t','t','t','t'],
        ['t','t','c1','c3','c16','c1','c18','c15','c1','c16','c16','c16','c16','c16','c1','c12','c1','c1','c16','c16','c6','c5','t','t','t','t','t','t'],
        ['t','c1','c11','c2','c16','c1','c1','c18','c1','c16','c16','c16','c16','c16','c1','c1','c1','c1','c16','c16','c6','c21','c22','t','t','t','t','t'],
        ['c1','c2','c2','c16','c23','c1','c1','c1','c1','c23','c23','c23','c23','c23','c9','c1','c1','c1','c14','c14','c6','c3','c2','c1','t','t','t','t'],
        ['c1','c11','c11','c14','c23','c23','c1','c1','c23','c23','c1','c23','c1','c23','c19','c1','c1','c1','c14','c14','c6','c4','c2','c1','t','t','t','t'],
        ['t','c1','c2','c2','c23','c23','c23','c23','c23','c23','c23','c1','c23','c23','c23','c23','c23','c23','c14','c6','c6','c11','c1','t','t','t','t','t'],
        ['t','t','c1','c5','c2','c23','c23','c23','c23','c23','c23','c23','c23','c23','c23','c23','c23','c16','c6','c6','c5','c5','t','t','c1','c1','c1','t'],
        ['t','t','t','t','c5','c6','c3','c16','c23','c23','c23','c23','c23','c23','c16','c16','c16','c17','c5','c5','c5','t','t','c1','c7','c24','c24','c1'],
        ['t','t','t','t','t','c1','c1','c3','c3','c3','c16','c3','c3','c16','c3','c16','c2','c25','c22','t','t','t','c1','c24','c24','c24','c5','c1'],
        ['t','t','t','t','c1','c11','c3','c16','c12','c12','c12','c12','c12','c23','c23','c14','c14','c3','c2','c9','t','c1','c7','c10','c10','c7','c1','t'],
        ['t','t','t','t','c1','c3','c16','c12','c12','c15','c15','c15','c15','c12','c16','c14','c16','c3','c6','c21','c1','c1','c7','c7','c10','c10','c7','c1'],
        ['t','t','t','t','c1','c2','c3','c12','c15','c15','c15','c15','c15','c15','c16','c6','c3','c3','c6','c6','c11','c1','c4','c7','c7','c10','c7','c1'],
        ['t','t','t','c1','c11','c2','c6','c6','c15','c15','c15','c15','c12','c16','c6','c3','c2','c11','c6','c6','c6','c1','c4','c21','c7','c7','c7','c1'],
        ['t','t','t','c18','c11','c1','c6','c6','c3','c15','c15','c19','c2','c6','c3','c17','c5','c4','c6','c6','c6','c1','c2','c4','c21','c4','c21','c1'],
        ['t','t','t','c1','c11','c18','c6','c6','c6','c1','c12','c19','c2','c3','c6','c17','c1','c4','c6','c6','c6','c1','c2','c2','c4','c21','c1','t'],
        ['t','t','t','c1','c11','c1','c4','c4','c3','c1','c25','c17','c2','c2','c2','c25','c1','c4','c4','c6','c2','c1','c2','c2','c21','c18','t','t'],
        ['t','t','t','t','c1','c1','c2','c2','c6','c1','c5','c2','c3','c2','c25','c1','c11','c11','c4','c2','c1','c21','c21','c21','c1','t','t','t'],
        ['t','t','t','t','t','c18','c5','c5','c1','c1','c26','c1','c1','c1','c1','c1','c1','c1','c1','c1','c1','c18','c1','c18','t','t','t','t'],
      ];

      let displayData = pixelData.map(row => [...row]);

      if (mood === 'sad') {
        displayData[13][6] = 'c22';
        displayData[13][7] = 'c22';
        displayData[13][15] = 'c22';
        displayData[13][16] = 'c22';
        displayData[14][6] = 'c22';
        displayData[14][7] = 'c22';
        displayData[14][14] = 'c22';
        displayData[14][15] = 'c22';
      }

      if (gameState.hygiene < 50) {
        displayData[10][5] = 'c22';
        displayData[15][18] = 'c22';
        displayData[20][12] = 'c22';
        displayData[25][10] = 'c22';
      }

      // Animer les oreilles
      if (gameState.animationFrame === 1) {
        displayData[5][10] = 'c10';
        displayData[5][11] = 'c10';
      } else if (gameState.animationFrame === 2) {
        displayData[5][10] = 'c7';
        displayData[5][11] = 'c7';
      } else if (gameState.animationFrame === 3) {
        displayData[5][10] = 'c15';
        displayData[5][11] = 'c15';
      }

      // Animer la bouche
      if (gameState.animationFrame === 1) {
        displayData[20][10] = 'c22';
      } else if (gameState.animationFrame === 2) {
        displayData[20][10] = 'c10';
      } else if (gameState.animationFrame === 3) {
        displayData[20][10] = 'c12';
      }

      // Cligner des yeux
      if (gameState.animationFrame === 1) {
        displayData[13][6] = 'c22';
        displayData[13][7] = 'c22';
        displayData[13][15] = 'c22';
        displayData[13][16] = 'c22';
      } else if (gameState.animationFrame === 2) {
        displayData[13][6] = 'c1';
        displayData[13][7] = 'c1';
        displayData[13][15] = 'c1';
        displayData[13][16] = 'c1';
      }

      return (
        <div className="relative inline-block">
          <svg
            width={28 * pixelSize}
            height={32 * pixelSize}
            className="pixelated"
            style={{ marginLeft: gameState.position }}
          >
            {displayData.map((row, y) =>
              row.map((colorKey, x) => {
                if (colorKey === 't') return null;
                return (
                  <rect
                    key={`${x}-${y}`}
                    x={x * pixelSize}
                    y={y * pixelSize}
                    width={pixelSize}
                    height={pixelSize}
                    fill={colors[colorKey]}
                  />
                );
              })
            )}
          </svg>

          {gameState.hasPoop && (
            <svg width={pixelSize * 6} height={pixelSize * 5} className="pixelated absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <rect x={pixelSize*1} y={pixelSize*2} width={pixelSize*4} height={pixelSize*2} fill="#8B4513" />
              <rect x={pixelSize*1.5} y={pixelSize*1} width={pixelSize*3} height={pixelSize*2} fill="#A0522D" />
              <rect x={pixelSize*2} y={pixelSize*0} width={pixelSize*2} height={pixelSize*2} fill="#8B4513" />
              <rect x={pixelSize*2} y={pixelSize*1.5} width={pixelSize*1} height={pixelSize*0.5} fill="#FFF" />
            </svg>
          )}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex">
      <style>{`
        .pixelated {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
      `}</style>

      {/* PARTIE GAUCHE */}
      <div className="w-1/2 p-4 border-r-4 border-purple-600 flex flex-col">
        <div className="bg-gradient-to-br from-pink-200 to-purple-200 rounded-3xl shadow-2xl p-6 flex-1 flex flex-col">
          <h1 className="text-3xl font-bold text-center text-purple-800 mb-2">🐾 Évoli Clicker</h1>

          <button
            onClick={() => setGameState(prev => ({ ...prev, timeSpeed: prev.timeSpeed === 1 ? 10 : 1 }))}
            className={`mx-auto mb-3 px-3 py-1 rounded-full text-sm font-semibold ${
              gameState.timeSpeed === 10 ? 'bg-orange-500 text-white' : 'bg-gray-300'
            }`}
          >
            <FastForward size={16} className="inline" /> {gameState.timeSpeed}x
          </button>
          {message && (
            <div className="bg-white border-2 border-purple-400 rounded-xl p-2 mb-3 text-center text-sm font-bold text-purple-700">
              {message}
            </div>
          )}
          <div className="flex-1 flex items-center justify-center mb-4">
            {renderEvoli()}
          </div>
          <p className="text-center text-purple-700 font-bold mb-3">
            {gameState.stage === 'baby' ? '👶' : gameState.stage === 'child' ? '🧒' : '🦸'} - {gameState.age.toFixed(1)}min
          </p>
          <div className="space-y-1 mb-4">
            <MiniStat icon="🍖" value={gameState.hunger} />
            <MiniStat icon="😊" value={gameState.happiness} />
            <MiniStat icon="❤️" value={gameState.health} />
            <MiniStat icon="🧼" value={gameState.hygiene} />
            <MiniStat icon="⚡" value={gameState.energy} />
            {gameState.stage !== 'baby' && <MiniStat icon="📚" value={gameState.education} />}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <ActionBtn label={`🍖 ${prices.food}`} onClick={feed} />
            <ActionBtn label={`🏃 ${prices.play}`} onClick={startRunnerGame} />
            <ActionBtn label={`🏥 ${prices.doctor}`} onClick={goToDoctor} />
            <ActionBtn label={`🧼 ${prices.clean}`} onClick={clean} />
            <ActionBtn label={`💪 ${prices.exercise}`} onClick={exercise} />
            {gameState.stage !== 'baby' && (
              <ActionBtn label={`🎓 ${prices.school}`} onClick={goToSchool} />
            )}
          </div>
        </div>
      </div>
      {/* PARTIE DROITE */}
      <div className="w-1/2 p-4 flex flex-col">
        {activeGame === 'runner' ? (
          <div className="bg-gradient-to-br from-sky-200 to-blue-300 rounded-3xl shadow-2xl p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-800">🏃 Course d'obstacles</h2>
              <button onClick={closeGame} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">❌</button>
            </div>

            <div className="text-center text-3xl font-bold text-blue-900 mb-4">
              Score: {runnerGame.score}
            </div>
            <div
              className="relative bg-gradient-to-b from-blue-400 to-green-300 rounded-2xl flex-1 overflow-hidden cursor-pointer"
              onClick={jumpRunner}
            >
              <div className="absolute bottom-0 w-full h-4 bg-amber-700"></div>

              <div
                className="absolute w-12 h-12 transition-all duration-300"
                style={{
                  left: '20%',
                  bottom: runnerGame.jumping ? '40%' : '4px'
                }}
              >
                <div className="w-full h-full bg-purple-500 rounded-lg flex items-center justify-center text-2xl">
                  🦊
                </div>
              </div>
              {runnerGame.obstacles.map((obs, i) => (
                <div
                  key={i}
                  className="absolute bg-red-600 rounded"
                  style={{
                    left: `${obs.x}%`,
                    bottom: '4px',
                    width: '40px',
                    height: `${obs.height}px`
                  }}
                ></div>
              ))}
              {runnerGame.gameOver && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="bg-white rounded-2xl p-6 text-center">
                    <div className="text-3xl font-bold text-red-600 mb-2">Game Over!</div>
                    <div className="text-xl mb-4">Score: {runnerGame.score}</div>
                    <button
                      onClick={closeGame}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold"
                    >
                      Retour
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="text-center mt-4 text-sm text-blue-800">
              Clique pour sauter ! 🖱️
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-yellow-200 to-orange-200 rounded-3xl shadow-2xl p-6 flex-1 flex flex-col">
            <h2 className="text-3xl font-bold text-center text-orange-800 mb-4">💼 Bureau de Travail</h2>

            <div className="bg-white rounded-2xl p-4 mb-4 text-center shadow-lg">
              <div className="text-5xl font-bold text-yellow-600">{Math.floor(gameState.coins)}</div>
              <div className="text-sm text-gray-600">pièces</div>
              {gameState.coinsPerSecond > 0 && (
                <div className="text-xs text-green-600 font-semibold">
                  +{(gameState.coinsPerSecond * gameState.timeSpeed).toFixed(1)}/s
                </div>
              )}
            </div>
            <div
              onClick={handleClick}
              className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl p-12 mb-4 cursor-pointer hover:scale-105 transition-transform shadow-2xl flex items-center justify-center"
            >
              <Briefcase size={80} className="text-white opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl font-bold text-white drop-shadow-lg">💼</div>
              </div>
              {clickAnimation.map(anim => (
                <div
                  key={anim.id}
                  className="absolute text-2xl font-bold text-white animate-ping"
                  style={{ left: anim.x, top: anim.y }}
                >
                  +{anim.value}
                </div>
              ))}
            </div>
            <div className="text-center text-sm font-bold text-orange-800 mb-3">
              💰 {gameState.clickPower * gameState.upgrades.clickMultiplier} pièces par clic
            </div>
            <div className="space-y-2 overflow-y-auto flex-1">
              <UpgradeBtn
                icon={<Hammer size={20} />}
                label="Ouvrier Manuel"
                cost={Math.floor(basePrices.autoWorker1 * Math.pow(1.15, gameState.upgrades.autoWorker1))}
                owned={gameState.upgrades.autoWorker1}
                onClick={() => buyUpgrade('autoWorker1')}
                info="+1/s"
              />
              <UpgradeBtn
                icon={<Briefcase size={20} />}
                label="Employé de Bureau"
                cost={Math.floor(basePrices.autoWorker2 * Math.pow(1.15, gameState.upgrades.autoWorker2))}
                owned={gameState.upgrades.autoWorker2}
                onClick={() => buyUpgrade('autoWorker2')}
                info="+10/s"
              />
              <UpgradeBtn
                icon={<Factory size={20} />}
                label="Usine Automatisée"
                cost={Math.floor(basePrices.factory * Math.pow(1.15, gameState.upgrades.factory))}
                owned={gameState.upgrades.factory}
                onClick={() => buyUpgrade('factory')}
                info="+50/s"
              />
              <UpgradeBtn
                icon={<Cpu size={20} />}
                label="Robot Travailleur"
                cost={Math.floor(basePrices.robot * Math.pow(1.15, gameState.upgrades.robot))}
                owned={gameState.upgrades.robot}
                onClick={() => buyUpgrade('robot')}
                info="+200/s"
              />
              <UpgradeBtn
                icon={<Cpu size={20} />}
                label="Système d'IA"
                cost={Math.floor(basePrices.aiSystem * Math.pow(1.15, gameState.upgrades.aiSystem))}
                owned={gameState.upgrades.aiSystem}
                onClick={() => buyUpgrade('aiSystem')}
                info="+1000/s"
              />
              <UpgradeBtn
                icon={<Rocket size={20} />}
                label="Station Spatiale"
                cost={Math.floor(basePrices.spaceStation * Math.pow(1.15, gameState.upgrades.spaceStation))}
                owned={gameState.upgrades.spaceStation}
                onClick={() => buyUpgrade('spaceStation')}
                info="+5000/s"
              />
              <UpgradeBtn
                icon={<Sparkles size={20} />}
                label="Multiplicateur de Clic"
                cost={Math.floor(basePrices.clickMultiplier * gameState.upgrades.clickMultiplier)}
                owned={gameState.upgrades.clickMultiplier}
                onClick={() => buyUpgrade('clickMultiplier')}
                info={`x${gameState.upgrades.clickMultiplier}`}
              />
            </div>
            <div className="text-center text-xs text-gray-700 mt-3 space-y-1">
              <div>Total de clics: {gameState.totalClicks}</div>
              <div className="text-orange-700 font-semibold">
                Stade: {gameState.stage === 'baby' ? 'Bébé (x1)' : gameState.stage === 'child' ? 'Enfant (x2)' : 'Adulte (x3)'} prix
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MiniStat = ({ icon, value }) => {
  const getColor = (val) => {
    if (val > 70) return 'bg-green-500';
    if (val > 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{icon}</span>
      <div className="flex-1 bg-gray-300 rounded-full h-2">
        <div className={`${getColor(value)} h-full rounded-full transition-all`} style={{ width: `${value}%` }}></div>
      </div>
      <span className="text-xs font-bold w-8 text-right">{Math.round(value)}</span>
    </div>
  );
};

const ActionBtn = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-xl p-2 text-xs font-bold hover:scale-105 transition-transform shadow-lg"
  >
    {label}
  </button>
);

const UpgradeBtn = ({ icon, label, cost, owned, onClick, info }) => (
  <button
    onClick={onClick}
    className="w-full bg-white rounded-xl p-3 hover:bg-yellow-50 transition-colors shadow-md flex justify-between items-center"
  >
    <div className="flex items-center gap-2">
      <div className="text-orange-600">{icon}</div>
      <div className="text-left">
        <div className="font-bold text-sm">{label}</div>
        <div className="text-xs text-gray-600">{info} • Possédé: {owned}</div>
      </div>
    </div>
    <div className="text-right font-bold text-orange-600 text-sm">{cost}💰</div>
  </button>
);

export default TamagotchiClicker;