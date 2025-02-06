import { eq } from "drizzle-orm";

export async function upsertData(trx:any, table:any, data:any) {
    for (const item of data) {
        const isExist = await trx.select().from(table).where(eq(table.id, item.id));
        
        if (isExist.length > 0) {
            await trx.update(table).set(item).where(eq(table.id, item.id));
        } else {
            await trx.insert(table).values(item);
        }
    }
}
