import { SavedList, HistoryItem } from '../types';

const LISTS_KEY = 'vocabCrafter_lists';
const HISTORY_KEY = 'vocabCrafter_history';

export const getSavedLists = (): SavedList[] => {
  try {
    const data = localStorage.getItem(LISTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load saved lists", error);
    return [];
  }
};

export const saveList = (name: string, rawText: string): SavedList => {
  const lists = getSavedLists();
  
  // Estimate term count simply by line count for preview
  const termCount = rawText.split('\n').filter(l => l.trim().length > 0).length;

  const newList: SavedList = {
    id: crypto.randomUUID(),
    name: name || `List ${new Date().toLocaleDateString()}`,
    date: Date.now(),
    rawText,
    termCount
  };

  const updatedLists = [newList, ...lists];
  localStorage.setItem(LISTS_KEY, JSON.stringify(updatedLists));
  return newList;
};

export const deleteList = (id: string): SavedList[] => {
  const lists = getSavedLists();
  const updatedLists = lists.filter(list => list.id !== id);
  localStorage.setItem(LISTS_KEY, JSON.stringify(updatedLists));
  return updatedLists;
};

export const getHistory = (): HistoryItem[] => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load history", error);
    return [];
  }
};

export const addToHistory = (item: Omit<HistoryItem, 'id' | 'date'>): void => {
  const history = getHistory();
  const newItem: HistoryItem = {
    ...item,
    id: crypto.randomUUID(),
    date: Date.now()
  };
  // Keep only last 50 items
  const updatedHistory = [newItem, ...history].slice(0, 50);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
};

export const clearHistory = (): void => {
    localStorage.removeItem(HISTORY_KEY);
};
