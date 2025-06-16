import { useCallback } from 'react';
import Dexie from 'dexie';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-static-encryption-key-123';

export const useExportImport = (dbs: Dexie[]) => {
  const exportToJSON = useCallback(async () => {
    try {
      const fullData: Record<string, Record<string, any[]>> = {};

      for (const db of dbs) {
        const dbData: Record<string, any[]> = {};
        for (const table of db.tables) {
          dbData[table.name] = await table.toArray();
        }
        fullData[db.name] = dbData;
      }

      const json = JSON.stringify(fullData);
      const encrypted = CryptoJS.AES.encrypt(json, SECRET_KEY).toString();

      const blob = new Blob([encrypted], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kcis-encrypted-db-${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error("Export failed:", error);
      return false;
    }
  }, [dbs]);

  const importFromJSON = useCallback(async (file: File) => {
    try {
      const encryptedText = await file.text();
      const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
      const decryptedText = bytes.toString(CryptoJS.enc.Utf8);

      if (!decryptedText) {
        throw new Error('Decryption failed or empty.');
      }

      const parsedData = JSON.parse(decryptedText);

      for (const db of dbs) {
        const dbData = parsedData[db.name];
        if (!dbData) continue;

        await db.transaction('rw', db.tables, async () => {
          for (const table of db.tables) {
            const tableData = dbData[table.name];
            if (Array.isArray(tableData)) {
              await table.bulkPut(tableData);
            }
          }
        });
      }

      return true;
    } catch (error) {
      console.error("Import failed:", error);
      return false;
    }
  }, [dbs]);

  return { exportToJSON, importFromJSON };
};
