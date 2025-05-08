"use client";

import 'react-data-grid/lib/styles.css';
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { getSession } from "@/lib/sessions-client";
import { SessionPayload } from "@/types/globals";
import React, { useEffect, useMemo, useState } from "react";
import { DataGrid } from 'react-data-grid';
import css from 'styled-jsx/css';
import { IReportColumn, IReportDesigner } from '@/components/interfaces/reportdesigner';

const columns = [
    { key: 'id', name: 'ID' },
    { key: 'title', name: 'Title' }
];

const rows = [
    { id: 0, title: 'Example' },
    { id: 1, title: 'Demo' }
];

const session = await getSession() as SessionPayload;

const filterColumnClassName = 'filter-cell';

const filterContainerClassname = css`
  .${filterColumnClassName} {
    line-height: 35px;
    padding: 0;
    > div {
      padding-block: 0;
      padding-inline: 8px;

      &:first-child {
        border-block-end: 1px solid var(--rdg-border-color);
      }
    }
  }
`;

function EmptyRowsRenderer() {
    return (
        <div style={{ textAlign: "center", gridColumn: "1/-1" }} className="my-6">
            No Repoort Submissions
        </div>
    );
}


 
export default function MonitoringCFW() {

    const [report, setReport] = useState<IReportDesigner>()
    const [, setReportColumn] = useState<IReportColumn[]>()
    const [columns, setGenerateColumn] = useState([])
 

    useEffect(() => {
        (async () => {
            try {
                if (!dexieDb.isOpen()) await dexieDb.open(); // Ensure DB is open

                const gr = await dexieDb.report_designer.where("id").equals("35aac933-fb5f-4a4c-ada4-51397d1e70ae").first()
                const gc = await dexieDb.report_column.where("report_designer_id").equals("35aac933-fb5f-4a4c-ada4-51397d1e70ae").toArray()
           
                setReport(gr)
                setReportColumn(gc)  

                console.log('load',{gr,gc})
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        })();
    }, [])


    const handleCellClick = (props: any) => {
        console.log("handleCellClick", props);
    }

    return (
        <>
            <h1>This is the MonitoringCFW Page</h1>
            <DataGrid
                className={`${filterContainerClassname} rdg-light h-full`}
                columns={columns}
                rows={rows}
                direction={"ltr"}
                renderers={{ noRowsFallback: <EmptyRowsRenderer /> }}
                // renderers={{ noRowsFallback: <EmptyRowsRenderer /> }}
                // rowHeight={(props) => getRowHeight(props)}
                onCellClick={(e) => handleCellClick(e)}
                // onCellDoubleClick={(props) => {
                //   if (props.row?.clickable == true) {
                //     onCellClick(props.row);
                //   }
                //   console.log("onCellClick", props);
                // }}
                defaultColumnOptions={{
                    resizable: true,
                }}
            />
        </>
    );
}

