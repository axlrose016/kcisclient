import sqlite3 from 'better-sqlite3'
import { open } from 'better-sqlite3'

export default async function handler(req, res){
    res.status(200).json({ message: 'Person Profile Save Method' });
}
