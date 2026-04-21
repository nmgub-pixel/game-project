"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, 
  RotateCcw, 
  ChevronLeft, 
  Trophy, 
  Settings, 
  Play, 
  User, 
  Bot, 
  Ship, 
  Crosshair, 
  Ghost, 
  Sword, 
  Target, 
  Hash,
  Eye,
  Undo2,
  Bomb,
  Grid3X3,
  BrainCircuit
} from 'lucide-react';
import { Chess, Square } from 'chess.js';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** --- UTILS --- */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** --- CHESS ASSETS (Refined SVGs) --- */
const CHESS_PIECES_SVG: Record<string, Record<string, React.ReactNode>> = {
  w: {
    p: (
      <svg viewBox="0 0 45 45" className="w-[80%] h-[80%] drop-shadow-md">
        <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" strokeWidth="1.5" />
      </svg>
    ),
    r: (
      <svg viewBox="0 0 45 45" className="w-[80%] h-[80%] drop-shadow-md">
        <g fill="#fff" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 39h27v-3H9v3zM12 36l.5-21h19l.5 21H12zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z" />
          <path d="M34 14l-3 3H14l-3-3" />
          <path d="M31 17l-1.5 5.5h-14L14 17" />
          <path d="M31 29.5l1.5 2.5h-20l1.5-2.5" />
        </g>
      </svg>
    ),
    n: (
      <svg viewBox="0 0 45 45" className="w-[80%] h-[80%] drop-shadow-md">
        <g fill="#fff" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" />
          <path d="M24 18c.3 1.2 2 1.2 2 1.2s1.5-1.2 1.5-2.2c0-1.1-1.1-2.2-2.5-2.2s-2.5 1.1-2.5 2.2z" />
          <path d="M9.5 25.5A.5.5 0 1 1 9 25.5a.5.5 0 1 1 .5 0" fill="#000" />
          <path d="M15 15.5c4.5 2 5 2 10 2" strokeLinecap="butt" />
          <path d="M24 18c-3 1.5-5 2-5 2" />
        </g>
      </svg>
    ),
    b: (
      <svg viewBox="0 0 45 45" className="w-[80%] h-[80%] drop-shadow-md">
        <g fill="#fff" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1 1 1 3H8c0-2 1-3 1-3z" />
          <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
          <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
          <path d="M17.5 26h10M15 30h15" />
        </g>
      </svg>
    ),
    q: (
      <svg viewBox="0 0 45 45" className="w-[80%] h-[80%] drop-shadow-md">
        <g fill="#fff" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM11 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM38 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
          <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25L7 14l2 12z" />
          <path d="M9 26c0 2 1.5 2 2.5 4 2.5 4 12.5 4 15 0 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-20 0z" />
          <path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none" />
          <path d="M9 39h27v-3H9v3z" />
        </g>
      </svg>
    ),
    k: (
      <svg viewBox="0 0 45 45" className="w-[80%] h-[80%] drop-shadow-md">
        <g fill="#fff" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.5 11.63V6M20 8h5" />
          <path d="M22.5 25s4.5-7.5 3-10c-1.5-2.5-6-2.5-6 0-1.5 2.5 3 10 3 10z" />
          <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-1-1.5-4-4.5h-10.5c-3 3 0 3.5-4 4.5-3 6 6 10.5 6 10.5v7z" />
          <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" fill="none" />
        </g>
      </svg>
    ),
  },
  b: {
    p: (
      <svg viewBox="0 0 45 45" className="w-[80%] h-[80%] drop-shadow-md">
        <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#222" stroke="#fff" strokeWidth="1.5" />
      </svg>
    ),
    r: (
      <svg viewBox="0 0 45 45" className="w-[80%] h-[80%] drop-shadow-md">
        <g fill="#222" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 39h27v-3H9v3zM12 36l.5-21h19l.5 21H12zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z" />
          <path d="M34 14l-3 3H14l-3-3" />
          <path d="M31 17l-1.5 5.5h-14L14 17" />
          <path d="M31 29.5l1.5 2.5h-20l1.5-2.5" />
        </g>
      </svg>
    ),
    n: (
      <svg viewBox="0 0 45 45" className="w-[80%] h-[80%] drop-shadow-md">
        <g fill="#222" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" />
          <path d="M24 18c.3 1.2 2 1.2 2 1.2s1.5-1.2 1.5-2.2c0-1.1-1.1-2.2-2.5-2.2s-2.5 1.1-2.5 2.2z" />
          <path d="M9.5 25.5A.5.5 0 1 1 9 25.5a.5.5 0 1 1 .5 0" fill="#fff" />
          <path d="M15 15.5c4.5 2 5 2 10 2" strokeLinecap="butt" />
          <path d="M24 18c-3 1.5-5 2-5 2" />
        </g>
      </svg>
    ),
    b: (
      <svg viewBox="0 0 45 45" className="w-[80%] h-[80%] drop-shadow-md">
        <g fill="#222" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1 1 1 3H8c0-2 1-3 1-3z" />
          <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
          <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
          <path d="M17.5 26h10M15 30h15" />
        </g>
      </svg>
    ),
    q: (
      <svg viewBox="0 0 45 45" className="w-[80%] h-[80%] drop-shadow-md">
        <g fill="#222" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM11 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM38 20a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
          <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-13.5V25L7 14l2 12z" />
          <path d="M9 26c0 2 1.5 2 2.5 4 2.5 4 12.5 4 15 0 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-20 0z" />
          <path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none" />
          <path d="M9 39h27v-3H9v3z" />
        </g>
      </svg>
    ),
    k: (
      <svg viewBox="0 0 45 45" className="w-[80%] h-[80%] drop-shadow-md">
        <g fill="#222" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22.5 11.63V6M20 8h5" />
          <path d="M22.5 25s4.5-7.5 3-10c-1.5-2.5-6-2.5-6 0-1.5 2.5 3 10 3 10z" />
          <path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-1-1-1.5-4-4.5h-10.5c-3 3 0 3.5-4 4.5-3 6 6 10.5 6 10.5v7z" />
          <path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" fill="none" />
        </g>
      </svg>
    ),
  }
};

type GameType = 'menu' | 'tictactoe' | 'snake' | 'shooter' | 'guess' | 'hangman' | 'tetris' | 'chess' | 'seabattle' | 'minesweeper' | 'memory' | 'kitten';

/** --- GAME: CHESS PRO --- */
const ChessGame = () => {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [availableMoves, setAvailableMoves] = useState<Square[]>([]);
  const [mode, setMode] = useState<'bot' | 'friend' | null>(null);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [captured, setCaptured] = useState<{w: string[], b: string[]}>({w:[], b:[]});

  const getValidMoves = (sq: Square) => {
    return game.moves({ square: sq, verbose: true }).map(m => m.to as Square);
  };

  const updateGameState = useCallback(() => {
    const history = game.history({verbose: true});
    const last = history[history.length-1];
    setLastMove(last ? {from: last.from, to: last.to} : null);
    const w: string[] = [], b: string[] = [];
    history.forEach(m => { 
      if (m.captured) { 
        if (m.color === 'w') b.push(m.captured); else w.push(m.captured); 
      } 
    });
    setCaptured({w, b});
  }, [game]);

  const undo = () => {
    if (mode === 'bot') { game.undo(); game.undo(); } else { game.undo(); }
    setGame(new Chess(game.fen()));
    updateGameState();
    setSelectedSquare(null);
    setAvailableMoves([]);
  };

  const evaluateBoard = (g: Chess) => {
    const weights: Record<string, number> = { p: 10, n: 30, b: 35, r: 50, q: 90, k: 900 };
    let total = 0;
    const board = g.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p) {
          let val = weights[p.type];
          if (p.type === 'p') val += (p.color === 'w' ? (7 - r) : r) * 2;
          if (p.type === 'n' || p.type === 'b') {
            if (r > 2 && r < 5 && c > 2 && c < 5) val += 5; // Center bonus
          }
          total += (p.color === 'w' ? val : -val);
        }
      }
    }
    return total;
  };

  const minimax = (g: Chess, depth: number, alpha: number, beta: number, isMax: boolean): number => {
    if (depth === 0 || g.isGameOver()) return evaluateBoard(g);
    const moves = g.moves();
    if (isMax) {
      let best = -9999;
      for (const m of moves) {
        g.move(m);
        best = Math.max(best, minimax(g, depth - 1, alpha, beta, false));
        g.undo();
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break;
      }
      return best;
    } else {
      let best = 9999;
      for (const m of moves) {
        g.move(m);
        best = Math.min(best, minimax(g, depth - 1, alpha, beta, true));
        g.undo();
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
      }
      return best;
    }
  };

  const getBestMove = useCallback((g: Chess) => {
    const moves = g.moves();
    let bestMove = null;
    let bestVal = g.turn() === 'w' ? -9999 : 9999;
    for (const m of moves) {
      g.move(m);
      const val = minimax(g, 2, -10000, 10000, g.turn() === 'w');
      g.undo();
      if (g.turn() === 'w') {
        if (val > bestVal) { bestVal = val; bestMove = m; }
      } else {
        if (val < bestVal) { bestVal = val; bestMove = m; }
      }
    }
    return bestMove || moves[0];
  }, []);

  const makeMove = useCallback((m: any) => {
    try {
      const result = game.move(m);
      if (result) {
        setGame(new Chess(game.fen()));
        updateGameState();
        return true;
      }
    } catch(e) { return false; }
    return false;
  }, [game, updateGameState]);

  useEffect(() => {
    if (mode === 'bot' && game.turn() === 'b' && !game.isGameOver()) {
      const timer = setTimeout(() => {
        const best = getBestMove(game);
        if (best) makeMove(best);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [game, mode, makeMove, getBestMove]);

  const onSquareClick = (s: Square) => {
    if (game.isGameOver()) return;
    const piece = game.get(s);
    
    if (selectedSquare) {
      if (makeMove({from: selectedSquare, to: s, promotion: 'q'})) { 
        setSelectedSquare(null); 
        setAvailableMoves([]);
        return; 
      }
    }

    if (piece && piece.color === game.turn()) {
      setSelectedSquare(s);
      setAvailableMoves(getValidMoves(s));
    } else {
      setSelectedSquare(null);
      setAvailableMoves([]);
    }
  };

  if (!mode) return (
    <div className="flex flex-col gap-4 animate-in fade-in zoom-in duration-300">
      <h2 className="text-3xl font-black text-white text-center mb-4 italic tracking-tighter uppercase">ШАХМАТЫ <span className="text-blue-500">PRO</span></h2>
      <button onClick={() => setMode('bot')} className="px-8 py-5 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl font-bold flex items-center justify-center gap-4 shadow-lg hover:scale-[1.02] active:scale-95 transition-all"><Bot size={28} /> Против Бота</button>
      <button onClick={() => setMode('friend')} className="px-8 py-5 bg-gradient-to-br from-slate-700 to-slate-900 rounded-3xl font-bold flex items-center justify-center gap-4 shadow-lg hover:scale-[1.02] active:scale-95 transition-all"><User size={28} /> Против Друга</button>
    </div>
  );

  const board = game.board();
  const status = game.isCheckmate() ? 'Мат!' : game.isDraw() ? 'Ничья' : game.isCheck() ? 'Шах!' : `Ход ${game.turn()==='w'?'Белых':'Черных'}`;

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm sm:max-w-md animate-in fade-in duration-500">
      <div className="flex justify-between items-center w-full bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
        <div className="font-black text-white text-base sm:text-lg uppercase tracking-tight">{status}</div>
        <div className="flex gap-2">
          <button onClick={undo} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors shadow-lg"><Undo2 size={20}/></button>
          <button onClick={() => {setGame(new Chess()); setMode(null); setCaptured({w:[], b:[]}); setLastMove(null);}} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors shadow-lg"><RotateCcw size={20}/></button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 h-8 w-full px-2 opacity-90 justify-center items-center">
        {captured.b.map((p, i) => <div key={i} className="w-5 h-5">{(CHESS_PIECES_SVG.b as any)[p]}</div>)}
      </div>

      <div className="w-full max-w-[400px] aspect-square bg-slate-800 p-1 rounded-xl shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full rounded-lg overflow-hidden touch-none select-none">
          {board.flat().map((p, i) => {
            const r = Math.floor(i/8), c = i%8;
            const s = (String.fromCharCode(97+c) + (8-r)) as Square;
            const isDark = (r+c)%2 === 1;
            const isSel = selectedSquare === s;
            const isLast = lastMove && (lastMove.from === s || lastMove.to === s);
            const isAvail = availableMoves.includes(s);
            const isEnemy = p && p.color !== game.turn();

            return (
              <div key={s} onClick={() => onSquareClick(s)} className={cn(
                "relative flex items-center justify-center transition-all cursor-pointer", 
                isDark ? "bg-[#769656]" : "bg-[#eeeed2]", 
                isSel && "bg-[#f6f669]", 
                isLast && !isSel && "bg-[#bbcb2b]/60"
              )}>
                {p && <div className="w-full h-full flex items-center justify-center z-10 animate-in fade-in zoom-in duration-200">{(CHESS_PIECES_SVG[p.color] as any)[p.type]}</div>}
                {isAvail && (
                  <div className={cn(
                    "absolute z-20 rounded-full",
                    isEnemy ? "w-[85%] h-[85%] border-[4px] border-black/10" : "w-3 h-3 bg-black/15"
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 h-8 w-full px-2 opacity-90 justify-center items-center">
        {captured.w.map((p, i) => <div key={i} className="w-5 h-5">{(CHESS_PIECES_SVG.w as any)[p]}</div>)}
      </div>
    </div>
  );
};

/** --- GAME: SEA BATTLE PRO --- */
const SHIP_CONFIG = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

const SeaBattle = () => {
  const [p1Board, setP1Board] = useState<any[][]>(() => createBoard());
  const [p2Board, setP2Board] = useState<any[][]>(() => createBoard());
  const [phase, setPhase] = useState<'mode' | 'setup1' | 'setup2' | 'battle' | 'win'>('mode');
  const [mode, setMode] = useState<'bot' | 'friend' | null>(null);
  const [turn, setTurn] = useState(1);
  const [shipsToPlace, setShipsToPlace] = useState<number[]>([]);
  const [isVert, setIsVert] = useState(false);
  const [showOwn, setShowOwn] = useState(false);
  const [winner, setWinner] = useState<number | null>(null);

  function createBoard() { return Array(10).fill(null).map(() => Array(10).fill(null).map(() => ({ship: false, hit: false, miss: false}))); }

  const canPlace = (board: any[][], r: number, c: number, len: number, vert: boolean) => {
    for (let i = 0; i < len; i++) {
      const nr = vert ? r+i : r, nc = vert ? c : c+i;
      if (nr < 0 || nr >= 10 || nc < 0 || nc >= 10 || board[nr][nc].ship) return false;
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        const tr = nr+dr, tc = nc+dc;
        if (tr >= 0 && tr < 10 && tc >= 0 && tc < 10 && board[tr][tc].ship) return false;
      }
    }
    return true;
  };

  const placeRandom = (board: any[][]) => {
    const next = JSON.parse(JSON.stringify(board));
    [...SHIP_CONFIG].forEach(len => {
      let placed = false;
      while(!placed) {
        const r = Math.floor(Math.random()*10), c = Math.floor(Math.random()*10), v = Math.random() > 0.5;
        if (canPlace(next, r, c, len, v)) {
          for(let i=0; i<len; i++) next[v?r+i:r][v?c:c+i].ship = true;
          placed = true;
        }
      }
    });
    return next;
  };

  const setupClick = (r: number, c: number) => {
    if (shipsToPlace.length === 0) return;
    const len = shipsToPlace[0];
    const curB = phase === 'setup1' ? p1Board : p2Board;
    const setCurB = phase === 'setup1' ? setP1Board : setP2Board;
    if (canPlace(curB, r, c, len, isVert)) {
      const next = JSON.parse(JSON.stringify(curB));
      for(let i=0; i<len; i++) next[isVert?r+i:r][isVert?c:c+i].ship = true;
      setCurB(next);
      setShipsToPlace(shipsToPlace.slice(1));
    }
  };

  const handleSunk = (board: any[][], r: number, c: number) => {
    const visited = new Set(); const parts: any[] = []; const q = [{r, c}];
    while(q.length > 0) {
      const curr = q.pop()!; const key = `${curr.r},${curr.c}`;
      if (visited.has(key)) continue; visited.add(key);
      if (board[curr.r][curr.c].ship) {
        parts.push(curr);
        [[0,1],[0,-1],[1,0],[-1,0]].forEach(([dr, dc]) => {
          const nr = curr.r+dr, nc = curr.c+dc;
          if (nr>=0 && nr<10 && nc>=0 && nc<10 && board[nr][nc].ship) q.push({r: nr, c: nc});
        });
      }
    }
    if (parts.every(p => board[p.r][p.c].hit)) {
      parts.forEach(p => {
        for(let dr=-1; dr<=1; dr++) for(let dc=-1; dc<=1; dc++) {
          const nr = p.r+dr, nc = p.c+dc;
          if (nr>=0 && nr<10 && nc>=0 && nc<10 && !board[nr][nc].ship) board[nr][nc].miss = true;
        }
      });
    }
  };

  const fire = (r: number, c: number) => {
    if (phase !== 'battle') return;
    const targetB = turn === 1 ? p2Board : p1Board;
    const setTargetB = turn === 1 ? setP2Board : setP1Board;
    if (targetB[r][c].hit || targetB[r][c].miss) return;

    const next = JSON.parse(JSON.stringify(targetB));
    if (next[r][c].ship) {
      next[r][c].hit = true; 
      handleSunk(next, r, c); 
      setTargetB(next);
      if (next.flat().filter((x:any) => x.ship && !x.hit).length === 0) { setWinner(turn); setPhase('win'); }
    } else {
      next[r][c].miss = true; 
      setTargetB(next);
      if (mode === 'bot') {
        setTurn(2);
        setTimeout(() => {
          let fired = false; const p1 = JSON.parse(JSON.stringify(p1Board));
          while(!fired) {
            const rr = Math.floor(Math.random()*10), cc = Math.floor(Math.random()*10);
            if (!p1[rr][cc].hit && !p1[rr][cc].miss) {
              if (p1[rr][cc].ship) { p1[rr][cc].hit = true; handleSunk(p1, rr, cc); } else { p1[rr][cc].miss = true; }
              fired = true;
            }
          }
          setP1Board(p1); setTurn(1);
          if (p1.flat().filter((x:any) => x.ship && !x.hit).length === 0) { setWinner(2); setPhase('win'); }
        }, 800);
      } else setTurn(turn === 1 ? 2 : 1);
    }
  };

  if (phase === 'mode') return (
    <div className="flex flex-col gap-4 animate-in zoom-in duration-300">
      <h2 className="text-3xl font-black text-white text-center mb-6 uppercase italic tracking-tighter">МОРСКОЙ БОЙ <span className="text-blue-500">PRO</span></h2>
      <button onClick={() => {setMode('bot'); setPhase('setup1'); setShipsToPlace([...SHIP_CONFIG]);}} className="px-8 py-5 bg-blue-600 rounded-3xl font-bold flex items-center justify-center gap-4 shadow-xl active:scale-95 transition-all"><Bot size={28}/> Против Бота</button>
      <button onClick={() => {setMode('friend'); setPhase('setup1'); setShipsToPlace([...SHIP_CONFIG]);}} className="px-8 py-5 bg-green-600 rounded-3xl font-bold flex items-center justify-center gap-4 shadow-xl active:scale-95 transition-all"><User size={28}/> Против Друга</button>
    </div>
  );

  if (phase === 'setup1' || phase === 'setup2') return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm animate-in fade-in duration-500">
      <h2 className="text-xl font-bold text-white uppercase tracking-wider">ИГРОК {phase === 'setup1' ? '1' : '2'}: РАССТАНОВКА</h2>
      <div className="grid grid-cols-10 border-4 border-slate-700 w-full aspect-square bg-slate-900 rounded-xl overflow-hidden shadow-2xl relative">
        {(phase === 'setup1' ? p1Board : p2Board).map((row, r) => row.map((cell, c) => (
          <div key={`${r}-${c}`} onClick={() => setupClick(r, c)} className={cn(
            "border-[0.5px] border-slate-800 flex items-center justify-center transition-all cursor-pointer", 
            "bg-slate-900 hover:bg-slate-800"
          )}>
            {cell.ship && <div className="w-[80%] h-[80%] bg-gradient-to-br from-blue-400 to-blue-600 rounded-sm shadow-lg border border-blue-300/30" />}
          </div>
        )))}
      </div>
      <div className="flex gap-2 w-full">
        <button onClick={() => setIsVert(!isVert)} className="flex-1 py-3 bg-slate-800 rounded-2xl text-xs font-black uppercase tracking-tighter transition-colors hover:bg-slate-700">
          {isVert ? 'ВЕРТИКАЛЬ' : 'ГОРИЗОНТАЛЬ'}
        </button>
        <button onClick={() => {
          const b = placeRandom(createBoard());
          if (phase === 'setup1') { setP1Board(b); setShipsToPlace([]); }
          else { setP2Board(b); setShipsToPlace([]); }
        }} className="flex-1 py-3 bg-slate-800 rounded-2xl text-xs font-black uppercase tracking-tighter transition-colors hover:bg-slate-700">РАНДОМ</button>
        <button onClick={() => { (phase === 'setup1' ? setP1Board : setP2Board)(createBoard()); setShipsToPlace([...SHIP_CONFIG]); }} className="p-3 bg-slate-800 rounded-2xl hover:bg-red-900/40 transition-colors"><RotateCcw size={20}/></button>
      </div>
      {shipsToPlace.length > 0 && <div className="text-xs text-slate-400 font-bold uppercase italic">Ставим: {shipsToPlace[0]}-палубный</div>}
      {shipsToPlace.length === 0 && (
        <button onClick={() => {
          if (mode === 'friend' && phase === 'setup1') { setPhase('setup2'); setShipsToPlace([...SHIP_CONFIG]); }
          else { if (mode === 'bot') setP2Board(placeRandom(createBoard())); setPhase('battle'); }
        }} className="w-full py-4 bg-green-600 rounded-2xl font-black text-white shadow-lg shadow-green-900/20 active:scale-95 transition-all">ГОТОВО</button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[95vw] sm:max-w-md animate-in fade-in duration-500">
      {phase === 'win' ? (
        <div className="text-center space-y-6 bg-slate-800/50 p-10 rounded-[3rem] border border-slate-700 backdrop-blur-xl">
          <Trophy className="mx-auto w-24 h-24 text-yellow-400 animate-bounce" />
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">ПОБЕДИЛ ИГРОК {winner}!</h2>
          <button onClick={() => window.location.reload()} className="px-10 py-4 bg-blue-600 rounded-full font-black tracking-widest hover:scale-105 active:scale-95 transition-all">В МЕНЮ</button>
        </div>
      ) : (
        <>
          <div className="flex justify-between w-full items-center bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <div className="font-black text-white uppercase tracking-tighter">Ход: Игрок {turn}</div>
            <div className="flex items-center gap-3">
               <span className="text-[10px] text-slate-400 font-bold uppercase hidden sm:block">Посмотреть свои</span>
               <button 
                onMouseDown={()=>setShowOwn(true)} onMouseUp={()=>setShowOwn(false)} 
                onTouchStart={()=>setShowOwn(true)} onTouchEnd={()=>setShowOwn(false)} 
                className="p-3 bg-slate-700 rounded-xl active:bg-blue-600 transition-colors"
               >
                 <Eye size={22}/>
               </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-red-500 uppercase font-black tracking-widest mb-1 italic">Поле соперника</span>
              <div className="grid grid-cols-10 border-2 border-slate-800 w-full aspect-square bg-[#0a0f1d] rounded-xl overflow-hidden shadow-2xl">
                {(turn === 1 ? p2Board : p1Board).map((row, r) => row.map((cell, c) => (
                  <div key={`${r}-${c}`} onClick={() => fire(r, c)} className={cn(
                    "border-[0.5px] border-slate-900 flex items-center justify-center transition-all cursor-crosshair", 
                    cell.hit ? "bg-red-500/20" : cell.miss ? "bg-blue-900/10" : "bg-[#0a0f1d] hover:bg-slate-800"
                  )}>
                    {cell.hit && (
                      <div className="relative flex items-center justify-center">
                        <Crosshair size={14} className="text-red-500 animate-in zoom-in" />
                        <div className="absolute w-full h-full bg-red-500/40 animate-pulse rounded-full blur-md" />
                      </div>
                    )}
                    {cell.miss && <div className="w-1.5 h-1.5 bg-blue-400 rounded-full opacity-40" />}
                  </div>
                )))}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[10px] text-blue-500 uppercase font-black tracking-widest mb-1 italic">Ваше поле</span>
              <div className="grid grid-cols-10 border-2 border-slate-800 w-full aspect-square bg-[#0a0f1d] rounded-xl overflow-hidden shadow-2xl">
                {(turn === 1 ? p1Board : p2Board).map((row, r) => row.map((cell, c) => (
                  <div key={`${r}-${c}`} className={cn(
                    "border-[0.5px] border-slate-900 flex items-center justify-center transition-all duration-300", 
                    cell.hit ? "bg-red-900/40" : cell.miss ? "bg-slate-800/40" : (showOwn && cell.ship ? "bg-blue-600/40" : "bg-[#0a0f1d]")
                  )}>
                    {cell.hit && <Bomb size={12} className="text-red-500 animate-bounce" />}
                    {showOwn && cell.ship && <div className="w-[70%] h-[70%] bg-gradient-to-br from-blue-500 to-blue-700 rounded-sm shadow-lg" />}
                    {cell.miss && <div className="w-1 h-1 bg-slate-500 rounded-full" />}
                  </div>
                )))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/** --- GAME: TIC-TAC-TOE PRO --- */
const TicTacToe = () => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [mode, setMode] = useState<'bot' | 'friend' | null>(null);
  
  const winner = useMemo(() => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const [a,b,c] of lines) { if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]; }
    return board.includes(null) ? null : 'Ничья';
  }, [board]);

  const botMove = useCallback(() => {
    if (winner) return;
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    
    // 1. Can win?
    for (const [a, b, c] of lines) {
      const vals = [board[a], board[b], board[c]];
      if (vals.filter(v => v === 'O').length === 2 && vals.includes(null)) {
        const i = [a, b, c][vals.indexOf(null)];
        const b_copy = [...board]; b_copy[i] = 'O'; setBoard(b_copy); setIsXNext(true); return;
      }
    }
    // 2. Must block?
    for (const [a, b, c] of lines) {
      const vals = [board[a], board[b], board[c]];
      if (vals.filter(v => v === 'X').length === 2 && vals.includes(null)) {
        const i = [a, b, c][vals.indexOf(null)];
        const b_copy = [...board]; b_copy[i] = 'O'; setBoard(b_copy); setIsXNext(true); return;
      }
    }
    // 3. Random
    const available = board.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
    if (available.length === 0) return;
    const random = available[Math.floor(Math.random() * available.length)];
    const b_final = [...board]; b_final[random] = 'O'; setBoard(b_final); setIsXNext(true);
  }, [board, winner]);

  useEffect(() => {
    if (mode === 'bot' && !isXNext && !winner) {
      const timer = setTimeout(botMove, 500);
      return () => clearTimeout(timer);
    }
  }, [isXNext, mode, winner, botMove]);

  const handleClick = (i: number) => {
    if (winner || board[i]) return;
    if (mode === 'bot' && !isXNext) return;
    const b = [...board];
    b[i] = isXNext ? 'X' : 'O';
    setBoard(b);
    setIsXNext(!isXNext);
  };

  if (!mode) return (
    <div className="flex flex-col gap-4 animate-in zoom-in duration-300">
      <h2 className="text-3xl font-black text-white text-center mb-6 uppercase tracking-tighter">КРЕСТИКИ <span className="text-cyan-500">НОЛИКИ</span></h2>
      <button onClick={() => setMode('bot')} className="px-8 py-5 bg-cyan-600 rounded-3xl font-bold flex items-center justify-center gap-4 active:scale-95 transition-all"><Bot size={28}/> Против Бота</button>
      <button onClick={() => setMode('friend')} className="px-8 py-5 bg-slate-700 rounded-3xl font-bold flex items-center justify-center gap-4 active:scale-95 transition-all"><User size={28}/> Против Друга</button>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-2xl font-black text-white uppercase tracking-widest italic drop-shadow-lg">
        {winner ? (winner === 'Ничья' ? '🤝 Ничья!' : `🎉 Победил ${winner}`) : `Ходит: ${isXNext ? 'X' : 'O'}`}
      </div>
      <div className="grid grid-cols-3 gap-4 bg-slate-800/50 p-6 rounded-[2.5rem] shadow-2xl border border-slate-700 backdrop-blur-sm">
        {board.map((v, i) => (
          <button key={i} onClick={() => handleClick(i)} className={cn(
            "w-20 h-20 sm:w-24 sm:h-24 bg-slate-900 rounded-3xl flex items-center justify-center text-5xl font-black transition-all hover:bg-slate-700 active:scale-90",
            v === 'X' ? "text-blue-500" : "text-red-500 shadow-inner"
          )}>
            {v}
          </button>
        ))}
      </div>
      <div className="flex gap-4">
        <button onClick={() => {setBoard(Array(9).fill(null)); setIsXNext(true);}} className="flex items-center gap-2 px-8 py-3 bg-blue-600 rounded-full font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/40"><RotateCcw size={20} /> Заново</button>
        <button onClick={() => {setMode(null); setBoard(Array(9).fill(null));}} className="flex items-center gap-2 px-8 py-3 bg-slate-700 rounded-full font-bold hover:bg-slate-600 transition-all">Меню</button>
      </div>
    </div>
  );
};

/** --- GAME: HANGMAN PRO --- */
const Hangman = () => {
  const words = ["ШАХМАТЫ", "ПРОГРАММИРОВАНИЕ", "КОМПЬЮТЕР", "ТЕХНОЛОГИЯ", "ИНТЕРФЕЙС", "МОРЕБОЙ", "КОСМОС", "АЛГОРИТМ", "РАЗРАБОТКА", "СМАРТФОН", "ПРИЛОЖЕНИЕ", "ВЕБСАЙТ"];
  const [word, setWord] = useState("");
  const [guessed, setGuessed] = useState<string[]>([]);
  const [errors, setErrors] = useState(0);
  const maxErrors = 6;

  const reset = useCallback(() => { 
    setWord(words[Math.floor(Math.random()*words.length)]); 
    setGuessed([]); 
    setErrors(0); 
  }, []);

  useEffect(() => { reset(); }, [reset]);
  
  const guess = (l: string) => { 
    if (!guessed.includes(l) && errors < maxErrors) { 
      setGuessed([...guessed, l]); 
      if (!word.includes(l)) setErrors(errors + 1); 
    } 
  };

  const isWin = word && word.split('').every(l => guessed.includes(l));
  const isLose = errors >= maxErrors;

  return (
    <div className="flex flex-col items-center gap-6 p-4 text-white w-full max-w-sm">
      <div className="relative w-48 h-60 border-b-8 border-slate-700 rounded-sm">
        <div className="absolute bottom-0 left-6 w-2 h-full bg-slate-700" />
        <div className="absolute top-0 left-6 w-32 h-2 bg-slate-700" />
        <div className="absolute top-0 right-10 w-1.5 h-10 bg-slate-800" />
        
        {/* Man Drawing */}
        <AnimatePresence>
          {errors > 0 && <motion.div initial={{opacity:0, scale:0}} animate={{opacity:1, scale:1}} className="absolute top-10 right-6 w-10 h-10 rounded-full border-[4px] border-white bg-slate-900 z-10" />}
          {errors > 1 && <motion.div initial={{scaleY:0}} animate={{scaleY:1}} className="absolute top-20 right-[43px] w-1.5 h-20 bg-white origin-top" />}
          {errors > 2 && <motion.div initial={{rotate:0}} animate={{rotate:-45}} className="absolute top-24 right-[43px] w-12 h-1.5 bg-white origin-left" />}
          {errors > 3 && <motion.div initial={{rotate:0}} animate={{rotate:45}} className="absolute top-24 right-[-5px] w-12 h-1.5 bg-white origin-right" />}
          {errors > 4 && <motion.div initial={{rotate:0}} animate={{rotate:-45}} className="absolute top-[156px] right-[43px] w-12 h-1.5 bg-white origin-left" />}
          {errors > 5 && <motion.div initial={{rotate:0}} animate={{rotate:45}} className="absolute top-[156px] right-[-5px] w-12 h-1.5 bg-white origin-right" />}
        </AnimatePresence>
      </div>

      <div className="text-3xl font-black tracking-[0.4em] text-center min-h-[1.5em] italic">
        {word.split('').map(l => guessed.includes(l) ? l : "_").join("")}
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {"АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ".split('').map(l => (
          <button 
            key={l} 
            onClick={() => guess(l)} 
            disabled={guessed.includes(l) || isWin || isLose} 
            className={cn(
              "w-8 h-10 rounded-xl font-black transition-all text-xs", 
              guessed.includes(l) ? (word.includes(l) ? "bg-green-600 scale-90" : "bg-red-900 opacity-30") : "bg-slate-800 hover:bg-slate-700 hover:scale-110 active:scale-90"
            )}
          >
            {l}
          </button>
        ))}
      </div>

      {(isWin || isLose) && (
        <div className={cn("text-2xl font-black uppercase tracking-tighter animate-bounce", isWin ? "text-green-400" : "text-red-500")}>
          {isWin ? "🏆 ПОБЕДА!" : `💀 КОНЕЦ: ${word}`}
        </div>
      )}
      <button onClick={reset} className="px-10 py-3 bg-blue-600 rounded-full font-black flex items-center gap-3 shadow-lg shadow-blue-900/30 active:scale-95 transition-all"><RotateCcw size={22} /> НОВОЕ СЛОВО</button>
    </div>
  );
};

/** --- GAME: SPACE SHOOTER HARDCORE --- */
const SpaceShooter = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const touchRef = useRef({ x: 150, y: 350 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let frame = 0, s = 0, g = false;
    let player = { x: 150, y: 350, w: 32, h: 32 };
    let bullets: any[] = [], enemyBullets: any[] = [], enemies: any[] = [];

    const loop = () => {
      if (g || gameOver) return;
      ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      for(let i=0; i<10; i++) { ctx.fillRect((Math.sin(i*100) * 500 + 500) % canvas.width, (frame*2 + i*100)%canvas.height, 1, 1); }

      player.x = Math.max(0, Math.min(canvas.width - player.w, touchRef.current.x - player.w/2));
      player.y = Math.max(0, Math.min(canvas.height - player.h, touchRef.current.y - player.h/2));
      
      // Player
      ctx.fillStyle = '#3b82f6'; 
      ctx.beginPath(); ctx.moveTo(player.x+player.w/2, player.y); ctx.lineTo(player.x, player.y+player.h); ctx.lineTo(player.x+player.w, player.y+player.h); ctx.fill();
      ctx.fillStyle = '#60a5fa'; ctx.fillRect(player.x+player.w/2-2, player.y+player.h, 4, 8); // engine flame

      // Shooting
      if (frame % 7 === 0) bullets.push({ x: player.x + player.w/2, y: player.y, r: 5 });
      bullets = bullets.filter(b => b.y > 0);
      bullets.forEach(b => { 
        b.y -= 12; 
        ctx.fillStyle = '#fde047'; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI*2); ctx.fill(); 
        ctx.shadowBlur = 10; ctx.shadowColor = '#fde047';
      });
      ctx.shadowBlur = 0;

      // Spawn
      const spawnRate = Math.max(8, 25 - Math.floor(s/300));
      if (frame % spawnRate === 0) enemies.push({ x: Math.random()*(canvas.width-30), y: -40, w: 32, h: 32, hp: Math.floor(s/1000) + 1 });
      
      enemies.forEach((e, ei) => {
        e.y += 3.5 + Math.min(5, s/500); 
        ctx.fillStyle = '#f43f5e'; ctx.fillRect(e.x, e.y, e.w, e.h);
        ctx.strokeStyle = '#fff'; ctx.strokeRect(e.x+4, e.y+4, e.w-8, e.h-8);
        
        // Enemy Shoot
        if (frame % Math.max(30, 60 - Math.floor(s/400)) === 0) enemyBullets.push({ x: e.x+e.w/2, y: e.y+e.h, r: 5 });
        
        // Hit
        bullets.forEach((b, bi) => { 
          if (b.x > e.x && b.x < e.x+e.w && b.y > e.y && b.y < e.y+e.h) { 
            e.hp--; bullets.splice(bi, 1);
            if(e.hp <= 0) { enemies.splice(ei, 1); s += 15; setScore(s); }
          } 
        });
        
        if (e.y > canvas.height) { enemies.splice(ei, 1); s = Math.max(0, s - 25); setScore(s); }
        if (Math.abs(player.x+player.w/2 - (e.x+e.w/2)) < 28 && Math.abs(player.y+player.h/2 - (e.y+e.h/2)) < 28) { g = true; setGameOver(true); }
      });

      // Enemy Bullets
      enemyBullets = enemyBullets.filter(b => b.y < canvas.height);
      enemyBullets.forEach((b, bi) => {
        b.y += 6 + Math.min(4, s/800); 
        ctx.fillStyle = '#ff0000'; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI*2); ctx.fill();
        if (Math.abs(b.x - (player.x+player.w/2)) < 20 && Math.abs(b.y - (player.y+player.h/2)) < 20) { g = true; setGameOver(true); }
      });

      frame++;
      if (!g) requestAnimationFrame(loop);
    };
    loop();
    return () => { g = true; };
  }, [gameOver]);

  const handleMove = (e: any) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    touchRef.current = { x: clientX - rect.left, y: clientY - rect.top };
  };

  return (
    <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
      <div className="flex justify-between w-full max-w-[300px] items-end">
        <div className="text-white font-black text-2xl italic">SCORE: {score}</div>
        {gameOver && <div className="text-red-500 font-black text-sm uppercase animate-pulse">FAILED</div>}
      </div>
      <canvas 
        ref={canvasRef} width={300} height={450} 
        onMouseMove={handleMove} onTouchMove={handleMove} 
        className="bg-slate-900 border-4 border-slate-800 rounded-[2rem] cursor-none touch-none shadow-2xl" 
      />
      <button onClick={() => { setScore(0); setGameOver(false); }} className="px-10 py-4 bg-indigo-600 rounded-full font-black text-white uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
        {gameOver ? "ВОСКРЕСНУТЬ" : "ЗАНОВО"}
      </button>
    </div>
  );
};

/** --- GAME: MINESWEEPER PRO --- */
const Minesweeper = () => {
  const SIZE = 10, MINES = 12;
  const [grid, setGrid] = useState<any[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  const init = useCallback(() => {
    const g = Array(SIZE).fill(null).map(() => Array(SIZE).fill(null).map(() => ({ mine: false, open: false, flag: false, count: 0 })));
    let placed = 0;
    while(placed < MINES) {
      const r = Math.floor(Math.random()*SIZE), c = Math.floor(Math.random()*SIZE);
      if (!g[r][c].mine) { g[r][c].mine = true; placed++; }
    }
    for(let r=0; r<SIZE; r++) for(let c=0; c<SIZE; c++) {
      if (g[r][c].mine) continue;
      let count = 0;
      for(let dr=-1; dr<=1; dr++) for(let dc=-1; dc<=1; dc++) {
        const nr=r+dr, nc=c+dc;
        if (nr>=0&&nr<SIZE&&nc>=0&&nc<SIZE&&g[nr][nc].mine) count++;
      }
      g[r][c].count = count;
    }
    setGrid(g); setGameOver(false); setWin(false);
  }, []);

  useEffect(() => { init(); }, [init]);

  const open = (r: number, c: number) => {
    if (gameOver || win || grid[r][c].open || grid[r][c].flag) return;
    const next = [...grid.map(row => [...row])];
    if (next[r][c].mine) { setGameOver(true); return; }
    
    const reveal = (row: number, col: number) => {
      if (row<0||row>=SIZE||col<0||col>=SIZE||next[row][col].open||next[row][col].mine) return;
      next[row][col].open = true;
      if (next[row][col].count === 0) {
        for(let dr=-1; dr<=1; dr++) for(let dc=-1; dc<=1; dc++) reveal(row+dr, col+dc);
      }
    };
    reveal(r, c);
    setGrid(next);
    if (next.flat().filter(x => !x.open && !x.mine).length === 0) setWin(true);
  };

  const toggleFlag = (e: any, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || win || grid[r][c].open) return;
    const next = [...grid.map(row => [...row])];
    next[r][c].flag = !next[r][c].flag;
    setGrid(next);
  };

  return (
    <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-300">
      <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">САПЕР <span className="text-amber-500">PRO</span></h2>
      <div className="grid grid-cols-10 border-4 border-slate-800 bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
        {grid.map((row, r) => row.map((cell, c) => (
          <div 
            key={`${r}-${c}`} 
            onClick={() => open(r, c)} 
            onContextMenu={(e) => toggleFlag(e, r, c)}
            className={cn(
              "w-8 h-8 sm:w-9 sm:h-9 border-[0.1px] border-slate-800 flex items-center justify-center font-black text-sm transition-all cursor-pointer",
              cell.open ? "bg-slate-200 text-slate-900" : "bg-slate-800 hover:bg-slate-700",
              gameOver && cell.mine && "bg-red-600"
            )}
          >
            {cell.open ? (cell.count > 0 ? cell.count : "") : (cell.flag ? "🚩" : "")}
            {gameOver && cell.mine && <Bomb size={14} className="text-white" />}
          </div>
        )))}
      </div>
      <div className="flex gap-4 items-center">
        {gameOver && <div className="text-red-500 font-black animate-pulse uppercase">БУМ!</div>}
        {win && <div className="text-green-500 font-black animate-bounce uppercase">ПОБЕДА!</div>}
        <button onClick={init} className="px-8 py-3 bg-blue-600 rounded-full font-bold flex items-center gap-2"><RotateCcw size={20}/> ЗАНОВО</button>
      </div>
    </div>
  );
};

/** --- GAME: TETRIS CLASSIC --- */
const Tetris = () => {
  const COLS = 10, ROWS = 20;
  const SHAPES = [
    [[1,1,1,1]], // I
    [[1,1],[1,1]], // O
    [[0,1,0],[1,1,1]], // T
    [[1,0,0],[1,1,1]], // L
    [[0,0,1],[1,1,1]], // J
    [[1,1,0],[0,1,1]], // S
    [[0,1,1],[1,1,0]]  // Z
  ];
  const COLORS = ['#22d3ee', '#facc15', '#a855f7', '#fb923c', '#3b82f6', '#4ade80', '#f43f5e'];

  const [grid, setGrid] = useState<number[][]>(Array(ROWS).fill(0).map(() => Array(COLS).fill(0)));
  const [pos, setPos] = useState({ x: 3, y: 0 });
  const [shapeIndex, setShapeIndex] = useState(0);
  const [shape, setShape] = useState(SHAPES[0]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const check = useCallback((s: number[][], p: { x: number, y: number }, g: number[][]) => {
    for (let r=0; r<s.length; r++) for (let c=0; c<s[r].length; c++) {
      if (s[r][c]) {
        const ny = p.y+r, nx = p.x+c;
        if (nx<0 || nx>=COLS || ny>=ROWS || (ny>=0 && g[ny][nx])) return true;
      }
    }
    return false;
  }, []);

  const spawn = useCallback((g: number[][]) => {
    const idx = Math.floor(Math.random()*SHAPES.length);
    const s = SHAPES[idx];
    const p = { x: Math.floor((COLS - s[0].length)/2), y: 0 };
    if (check(s, p, g)) { setGameOver(true); return; }
    setShapeIndex(idx);
    setShape(s); setPos(p);
  }, [check]);

  const move = useCallback((dx: number, dy: number) => {
    if (gameOver) return false;
    if (!check(shape, { x: pos.x+dx, y: pos.y+dy }, grid)) { 
      setPos(prev => ({ x: prev.x+dx, y: prev.y+dy })); 
      return true; 
    }
    if (dy > 0) {
      const ng = grid.map(r => [...r]);
      shape.forEach((r, ri) => r.forEach((v, ci) => { 
        if (v && pos.y+ri>=0) ng[pos.y+ri][pos.x+ci] = shapeIndex + 1; 
      }));
      const filtered = ng.filter(r => !r.every(v => v !== 0));
      const lines = ROWS - filtered.length;
      while(filtered.length < ROWS) filtered.unshift(Array(COLS).fill(0));
      setGrid(filtered); 
      setScore(s => s + (lines === 1 ? 100 : lines === 2 ? 300 : lines === 3 ? 500 : lines === 4 ? 800 : 0)); 
      spawn(filtered);
    }
    return false;
  }, [grid, pos, shape, shapeIndex, gameOver, spawn, check]);

  const rotate = () => {
    if (gameOver) return;
    const s = shape[0].map((_, i) => shape.map(row => row[i]).reverse());
    if (!check(s, pos, grid)) setShape(s);
  };

  useEffect(() => { 
    if (!gameOver) { 
      const i = setInterval(() => move(0, 1), Math.max(200, 800 - Math.floor(score/1000)*100)); 
      return () => clearInterval(i); 
    } 
  }, [move, gameOver, score]);

  return (
    <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
      <div className="text-white font-black text-2xl italic uppercase tracking-tighter">СЧЕТ: {score}</div>
      <div className="relative bg-slate-900 border-[6px] border-slate-800 w-[200px] h-[400px] rounded-xl overflow-hidden shadow-2xl">
        {grid.map((r, ri) => r.map((v, ci) => v ? (
          <div key={`${ri}-${ci}`} className="absolute w-[20px] h-[20px] rounded-sm border border-black/20" style={{ top: ri*20, left: ci*20, backgroundColor: COLORS[v-1] }} />
        ) : null))}
        {shape.map((r, ri) => r.map((v, ci) => v ? (
          <div key={`s-${ri}-${ci}`} className="absolute w-[20px] h-[20px] rounded-sm border border-black/20" style={{ top: (pos.y+ri)*20, left: (pos.x+ci)*20, backgroundColor: COLORS[shapeIndex] }} />
        ) : null))}
        {gameOver && <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-red-500 font-black text-2xl uppercase italic">КОНЕЦ ИГРЫ</div>}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <button onClick={rotate} className="p-5 bg-slate-800 rounded-2xl active:scale-90 transition-all shadow-lg"><RotateCcw/></button>
        <button onClick={() => move(0, 1)} className="p-5 bg-slate-800 rounded-2xl active:scale-90 transition-all shadow-lg rotate-90"><Play/></button>
        <button onClick={() => move(-1, 0)} className="p-5 bg-slate-800 rounded-2xl active:scale-90 transition-all shadow-lg rotate-180"><Play/></button>
        <div/>
        <button onClick={() => move(1, 0)} className="p-5 bg-slate-800 rounded-2xl active:scale-90 transition-all shadow-lg"><Play/></button>
        <div/>
      </div>
    </div>
  );
};

/** --- GAME: SNAKE CLASSIC --- */
const Snake = () => {
  const [snake, setSnake] = useState([{x:10, y:10}, {x:10, y:11}, {x:10, y:12}]);
  const [food, setFood] = useState({x:5, y:5});
  const [dir, setDir] = useState({x:0, y:-1});
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const reset = () => {
    setSnake([{x:10, y:10}, {x:10, y:11}, {x:10, y:12}]);
    setFood({x: Math.floor(Math.random()*20), y: Math.floor(Math.random()*20)});
    setDir({x:0, y:-1});
    setGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    const i = setInterval(() => {
      if (gameOver) return;
      const h = {x: snake[0].x+dir.x, y: snake[0].y+dir.y};
      if (h.x<0||h.x>=20||h.y<0||h.y>=20||snake.some(s=>s.x===h.x&&s.y===h.y)) { setGameOver(true); return; }
      const ns = [h, ...snake];
      if (h.x===food.x&&h.y===food.y) {
        setScore(s => s + 10);
        setFood({x: Math.floor(Math.random()*20), y: Math.floor(Math.random()*20)});
      } else ns.pop();
      setSnake(ns);
    }, 120);
    return () => clearInterval(i);
  }, [snake, dir, food, gameOver]);

  return (
    <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
      <div className="text-white font-black text-2xl italic tracking-tighter">СЧЕТ: {score}</div>
      <div className="relative bg-slate-900 border-4 border-slate-800 w-[300px] h-[300px] rounded-2xl overflow-hidden shadow-2xl shadow-green-900/10">
        {snake.map((s,i)=><div key={i} className={cn("absolute bg-green-500 w-[14px] h-[14px] rounded-sm", i===0 && "bg-green-400 z-10 shadow-lg")} style={{left: s.x*15, top: s.y*15}} />)}
        <div className="absolute bg-red-500 w-[14px] h-[14px] rounded-full animate-pulse shadow-lg" style={{left: food.x*15, top: food.y*15}} />
        {gameOver && <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-red-500 font-black text-2xl uppercase italic">ОЙ!</div>}
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div/><button onClick={()=>setDir({x:0, y:-1})} className="p-5 bg-slate-800 rounded-2xl rotate-[-90deg] active:scale-90 transition-all"><Play/></button><div/>
        <button onClick={()=>setDir({x:-1, y:0})} className="p-5 bg-slate-800 rounded-2xl rotate-180 active:scale-90 transition-all"><Play/></button>
        <button onClick={()=>setDir({x:0, y:1})} className="p-5 bg-slate-800 rounded-2xl rotate-90 active:scale-90 transition-all"><Play/></button>
        <button onClick={()=>setDir({x:1, y:0})} className="p-5 bg-slate-800 rounded-2xl active:scale-90 transition-all"><Play/></button>
      </div>
      {gameOver && <button onClick={reset} className="px-10 py-3 bg-blue-600 rounded-full font-black shadow-lg">ЗАНОВО</button>}
    </div>
  );
};

/** --- GAME: GUESS NUMBER PRO --- */
const GuessNumberGame = () => {
  const [target, setTarget] = useState(0);
  const [guess, setGuess] = useState("");
  const [msg, setMsg] = useState("Угадай от 1 до 100");
  const [won, setWon] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => { setTarget(Math.floor(Math.random() * 100) + 1); }, []);

  const handleGuess = () => {
    const num = parseInt(guess);
    if (isNaN(num)) return;
    setAttempts(a => a + 1);
    if (num === target) { setMsg("🎉 УГАДАЛ!"); setWon(true); }
    else if (num < target) setMsg("Больше! ↑");
    else setMsg("Меньше! ↓");
    setGuess("");
  };

  return (
    <div className="flex flex-col items-center gap-8 text-center animate-in zoom-in duration-500">
      <div className="text-2xl font-black bg-slate-800/80 p-10 rounded-[2.5rem] min-w-[280px] shadow-2xl border border-slate-700 backdrop-blur-sm italic uppercase tracking-tighter">
        {msg}
      </div>
      {!won ? (
        <div className="flex gap-4">
          <input 
            type="number" value={guess} onChange={(e) => setGuess(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
            className="w-28 p-5 rounded-3xl bg-slate-900 text-3xl font-black text-center border-4 border-slate-800 focus:border-blue-600 outline-none transition-all shadow-inner" 
          />
          <button onClick={handleGuess} className="px-10 py-5 bg-blue-600 rounded-3xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-900/30">ОК</button>
        </div>
      ) : (
        <div className="text-slate-400 font-black text-lg uppercase tracking-widest">Победа за {attempts} попыток</div>
      )}
      <button 
        onClick={() => { setTarget(Math.floor(Math.random()*100)+1); setMsg("Угадай от 1 до 100"); setWon(false); setAttempts(0); }} 
        className="px-12 py-4 bg-indigo-600 rounded-full font-black flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all"
      >
        <RotateCcw size={24} /> {won ? "ЕЩЕ РАЗ" : "СБРОСИТЬ"}
      </button>
    </div>
  );
};

/** --- GAME: MEMORY PRO --- */
const MemoryGame = () => {
  const icons = [<Ghost/>, <Sword/>, <Ship/>, <Target/>, <Bomb/>, <Trophy/>, <Gamepad2/>, <BrainCircuit/>];
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const init = useCallback(() => {
    const doubled = [...icons, ...icons].sort(() => Math.random() - 0.5);
    setCards(doubled.map((icon, i) => ({ id: i, icon })));
    setFlipped([]);
    setSolved([]);
    setMoves(0);
  }, []);

  useEffect(() => { init(); }, [init]);

  const click = (id: number) => {
    if (flipped.length === 2 || solved.includes(id) || flipped.includes(id)) return;
    const next = [...flipped, id];
    setFlipped(next);
    if (next.length === 2) {
      setMoves(m => m + 1);
      if (cards[next[0]].icon.type === cards[next[1]].icon.type) {
        setSolved(s => [...s, ...next]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-300">
      <div className="flex justify-between w-full items-center px-4">
        <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">ПАМЯТЬ <span className="text-pink-500">PRO</span></h2>
        <div className="font-bold text-slate-400 uppercase text-xs">Ходы: {moves}</div>
      </div>
      <div className="grid grid-cols-4 gap-3 bg-slate-800/40 p-4 rounded-[2rem] border border-slate-700">
        {cards.map((card, i) => (
          <button 
            key={i} onClick={() => click(i)} 
            className={cn(
              "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl transition-all duration-500 flex items-center justify-center transform preserve-3d shadow-xl",
              (flipped.includes(i) || solved.includes(i)) ? "bg-pink-600 rotate-y-180" : "bg-slate-900"
            )}
          >
            {(flipped.includes(i) || solved.includes(i)) ? React.cloneElement(card.icon as any, { size: 32, className: "text-white" }) : <span className="text-slate-700 text-2xl">?</span>}
          </button>
        ))}
      </div>
      {solved.length === cards.length && solved.length > 0 && <div className="text-green-500 font-black animate-bounce">ИДЕАЛЬНО!</div>}
      <button onClick={init} className="px-10 py-3 bg-blue-600 rounded-full font-black flex items-center gap-2"><RotateCcw size={20}/> ЗАНОВО</button>
    </div>
  );
};

/** --- GAME: KITTEN CATCH --- */
const KittenCatch = () => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [kittenPos, setKittenPos] = useState(150);
  const [items, setItems] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const reset = () => {
    setScore(0);
    setGameOver(false);
    setKittenPos(150);
    setItems([]);
  };

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setItems(prev => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          x: Math.random() * (containerRef.current?.clientWidth || 300) - 20,
          y: -50,
          type: Math.random() > 0.2 ? 'food' : 'hazard',
          speed: 2 + Math.random() * 3 + (score / 100)
        }
      ].filter(i => i.x > 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameOver, score]);

  useEffect(() => {
    if (gameOver) return;
    const moveInterval = setInterval(() => {
      setItems(prev => {
        const next = prev.map(item => ({ ...item, y: item.y + item.speed }));
        const filtered = next.filter(item => {
          if (item.y > 380) return false;
          const hit = Math.abs(item.x - kittenPos) < 40 && Math.abs(item.y - 340) < 40;
          if (hit) {
            if (item.type === 'food') setScore(s => s + 10);
            else setGameOver(true);
            return false;
          }
          return true;
        });
        return filtered;
      });
    }, 30);
    return () => clearInterval(moveInterval);
  }, [gameOver, kittenPos, score]);

  const handleTouch = (e: any) => {
    if (gameOver) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = clientX - rect.left;
      setKittenPos(Math.max(25, Math.min(rect.width - 25, x)));
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500 w-full">
      <div className="text-white font-black text-2xl italic tracking-tighter uppercase">КОТЯТА: {score}</div>
      <div 
        ref={containerRef}
        onMouseMove={handleTouch}
        onTouchMove={handleTouch}
        className="relative bg-gradient-to-b from-sky-400 to-indigo-600 border-4 border-slate-800 w-full max-w-[300px] h-[400px] rounded-[2.5rem] overflow-hidden shadow-2xl cursor-none touch-none"
      >
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        {items.map(item => (
          <div 
            key={item.id} 
            className="absolute text-4xl select-none"
            style={{ left: item.x, top: item.y }}
          >
            {item.type === 'food' ? '🐟' : '💧'}
          </div>
        ))}
        <div 
          className="absolute bottom-4 text-6xl transition-all duration-75 select-none"
          style={{ left: kittenPos - 30 }}
        >
          🐱
        </div>
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 z-50">
            <div className="text-6xl mb-4">😿</div>
            <div className="text-white font-black text-2xl uppercase italic mb-6">КОТИК НАМОК!</div>
            <button onClick={reset} className="px-10 py-4 bg-pink-500 rounded-full font-black shadow-lg hover:scale-105 active:scale-95 transition-all">СПАСТИ СНОВА</button>
          </div>
        )}
      </div>
      <div className="text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em] text-center px-6 leading-relaxed opacity-80">
        Управляй котиком, лови рыбку и уворачивайся от капель воды!
      </div>
    </div>
  );
};

/** --- MAIN HUB --- */
export default function GameHub() {
  const [game, setGame] = useState<GameType>('menu');
  const games = [
    { id: 'chess', name: 'Шахматы Pro', icon: <Sword />, color: 'from-indigo-600 to-indigo-900', desc: 'Элитные битвы' },
    { id: 'seabattle', name: 'Морской Бой', icon: <Ship />, color: 'from-blue-600 to-blue-900', desc: 'Стратегия флота' },
    { id: 'shooter', name: 'Space Shooter', icon: <Ghost />, color: 'from-purple-600 to-purple-900', desc: 'Ультра-хардкор' },
    { id: 'kitten', name: 'Котятки Catch', icon: <div className="text-4xl">🐱</div>, color: 'from-pink-400 to-pink-600', desc: 'Поймай рыбку' },
    { id: 'tetris', name: 'Тетрис', icon: <Grid3X3 />, color: 'from-orange-600 to-orange-900', desc: 'Золотая классика' },
    { id: 'minesweeper', name: 'Сапер Pro', icon: <Bomb />, color: 'from-amber-600 to-amber-900', desc: 'Без права на ошибку' },
    { id: 'snake', name: 'Змейка', icon: <Play />, color: 'from-green-600 to-green-900', desc: 'Быстрая реакция' },
    { id: 'hangman', name: 'Виселица', icon: <User />, color: 'from-red-600 to-red-900', desc: 'Угадай слово' },
    { id: 'tictactoe', name: 'Крестики-Нолики', icon: <Hash />, color: 'from-cyan-600 to-cyan-900', desc: 'Бот или друг' },
    { id: 'memory', name: 'Память Pro', icon: <BrainCircuit />, color: 'from-pink-600 to-pink-900', desc: 'Тайны разума' },
    { id: 'guess', name: 'Число', icon: <Target />, color: 'from-slate-600 to-slate-900', desc: 'Интуиция' },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#020617] text-slate-100 font-sans p-4 pb-24 selection:bg-blue-500/30 overflow-x-hidden">
      <header className="flex items-center justify-between mb-8 max-w-4xl mx-auto py-6 animate-in slide-in-from-top duration-700">
        <h1 className="text-3xl font-black tracking-tighter text-blue-500 uppercase italic leading-none">
          CHOP GAMES <span className="text-white not-italic">PRO</span>
        </h1>
        {game !== 'menu' && (
          <button 
            onClick={() => setGame('menu')} 
            className="p-3 bg-slate-800/80 backdrop-blur-md rounded-2xl hover:bg-slate-700 transition-all active:scale-90 border border-slate-700 shadow-xl"
          >
            <ChevronLeft size={24} />
          </button>
        )}
      </header>

      <main className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {game === 'menu' ? (
            <motion.div 
              key="menu" 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }} 
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              {games.map((g, idx) => (
                <button 
                  key={g.id} 
                  onClick={() => setGame(g.id as GameType)} 
                  className={cn(
                    "relative group overflow-hidden rounded-[2.5rem] p-6 h-44 flex flex-col justify-end transition-all active:scale-95 shadow-2xl hover:shadow-blue-900/10 border border-white/5",
                    "bg-gradient-to-br", g.color
                  )}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-700">
                    {React.cloneElement(g.icon as any, { size: 100 })}
                  </div>
                  <div className="z-10 text-left">
                    <div className="font-black text-2xl leading-none mb-1 tracking-tighter uppercase italic">{g.name}</div>
                    <div className="text-[10px] opacity-70 uppercase font-black tracking-[0.15em]">{g.desc}</div>
                  </div>
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="game" 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }} 
              className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] p-4 sm:p-10 min-h-[550px] flex flex-col items-center justify-center shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] border border-slate-800/50"
            >
              {game === 'tictactoe' && <TicTacToe />}
              {game === 'hangman' && <Hangman />}
              {game === 'shooter' && <SpaceShooter />}
              {game === 'chess' && <ChessGame />}
              {game === 'seabattle' && <SeaBattle />}
              {game === 'tetris' && <Tetris />}
              {game === 'snake' && <Snake />}
              {game === 'guess' && <GuessNumberGame />}
               {game === 'minesweeper' && <Minesweeper />}
              {game === 'memory' && <MemoryGame />}
              {game === 'kitten' && <KittenCatch />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-slate-950/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] px-10 py-4 flex justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50">
        <button onClick={() => setGame('menu')} className={cn("transition-all active:scale-90", game === 'menu' ? "text-blue-500 scale-110 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" : "text-slate-500")}><Gamepad2 size={32}/></button>
        <button className="text-slate-700 cursor-not-allowed"><Trophy size={32}/></button>
        <button className="text-slate-700 cursor-not-allowed"><Settings size={32}/></button>
      </footer>
    </div>
  );
}
