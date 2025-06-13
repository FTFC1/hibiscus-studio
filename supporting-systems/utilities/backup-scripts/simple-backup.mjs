import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';

async function simpleBackup() {
  const backupDir = path.join(process.cwd(), 'data');
  await fs.mkdir(backupDir, { recursive: true });
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const filePath = path.join(backupDir, `trello-backup-${dateStr}.json`);
  
  const baseURL = 'https://api.trello.com/1';
  const params = { key: process.env.TRELLO_API_KEY, token: process.env.TRELLO_TOKEN };
  
  try {
    console.log('Fetching board...');
    const board = await axios.get(`${baseURL}/boards/9bfI9aZS`, { params });
    
    console.log('Fetching lists...');
    const lists = await axios.get(`${baseURL}/boards/9bfI9aZS/lists`, { params });
    
    console.log('Fetching cards...');
    const cards = await axios.get(`${baseURL}/boards/9bfI9aZS/cards`, { params });
    
    console.log('Fetching labels...');
    const labels = await axios.get(`${baseURL}/boards/9bfI9aZS/labels`, { params });
    
    console.log('Fetching per-card details...');
    const cardsWithDetails = await Promise.all(cards.data.map(async (card) => {
      const checklists = await axios.get(`${baseURL}/cards/${card.id}/checklists`, { params });
      const attachments = await axios.get(`${baseURL}/cards/${card.id}/attachments`, { params });
      const comments = await axios.get(`${baseURL}/cards/${card.id}/actions`, { 
        params: { ...params, filter: 'commentCard' } 
      });
      return { ...card, checklists: checklists.data, attachments: attachments.data, comments: comments.data };
    }));
    
    const backup = {
      board: board.data,
      lists: lists.data,
      cards: cardsWithDetails,
      labels: labels.data,
      backedUpAt: new Date().toISOString()
    };
    
    await fs.writeFile(filePath, JSON.stringify(backup, null, 2), 'utf8');
    console.log(`SUCCESS: Backup created at ${filePath}`);
    console.log(`Board: ${board.data.name}, Lists: ${lists.data.length}, Cards: ${cards.data.length}, Labels: ${labels.data.length}`);
    return { filePath, summary: { lists: lists.data.length, cards: cards.data.length, labels: labels.data.length } };
  } catch (err) {
    console.error('ERROR:', err.message);
    throw err;
  }
}

simpleBackup().catch(console.error); 