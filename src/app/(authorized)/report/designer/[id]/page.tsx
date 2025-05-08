"use client";

import { Button } from '@/components/ui/button';
import React, { forwardRef, useEffect, useMemo, useState } from 'react'
import {
  SimpleTreeItemWrapper,
  SortableTree,
  SortableTreeProps,
  TreeItemComponentProps,
  TreeItems,
} from "dnd-kit-sortable-tree";
import { Edit2Icon, Trash2Icon } from 'lucide-react';
import styles from "@/components/dndkit/TreeItem.module.css";
import useReportDesigner from '@/lib/state/cfw-monitoring';
import clsx from 'clsx';
import { processExcelFile, removeItemAtIndex } from '@/lib/utils';
import { FileUploader } from './FileUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { debounce } from 'lodash';
import { AppTable } from '@/components/app-table';
import { toast } from '@/hooks/use-toast';
import { SessionPayload } from '@/types/globals';
import { getSession } from '@/lib/sessions-client';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type TreeItemData = {
  id?: string;
  children?: TreeItemData[];
};
/*
 * Here's the component that will render a single row of your tree
 */
export const TreeItem = forwardRef<
  HTMLDivElement,
  TreeItemComponentProps<TreeItemData> | any
>((props, ref) => {

  const { dialog, onChangeDialog } = useReportDesigner();
  const { childCount, clone, onRemove, item, isOver, isOverParent } = props;

  const enableCustomStyleWhenOver =
    document.location.href.includes("vs-code-like");
  return (
    <SimpleTreeItemWrapper
      {...props}
      //ts-ignored
      contentClassName={clsx(
        enableCustomStyleWhenOver && isOver && styles.over,
        enableCustomStyleWhenOver && isOverParent && styles.overParent
      )}
      ref={ref}
    >
      <div className="flex flex-1 gap-1">
        <span
          className={styles.Text}
        >
          {item?.label || "Missing Metadata"}
        </span>
      </div>
      {!clone && onRemove && (
        <div className='flex items-center gap-2'>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              // onRemove();
              // const r = {
              //   ...dialog,
              //   title: "Update Indicator",
              //   form: meta,
              //   action: "update",
              //   isOpen: true,
              // };
              // console.log("item", r);
              // setDialogOpen(r);
            }}
          >
            <Edit2Icon size={18} />
          </Button>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onChangeDialog({
                record: item,
                open: true,
              })
              // setDialogOpen({
              //   // ...dialog,
              //   // form: meta,
              //   title: "Delete " + meta?.name + "?",
              //   action: "delete",
              //   isOpen: true,
              // });
            }}
          >
            <Trash2Icon size={18} />
          </Button>
        </div>
      )}
      {clone && childCount && childCount > 1 ? (
        <span className={styles.Count}>{childCount}</span>
      ) : null}
    </SimpleTreeItemWrapper>
  );
});
TreeItem.displayName = "TreeItem";

export default function MonitoringCFW() {

  const { columns, onChangeColumns, dialog, onChangeDialog } = useReportDesigner();

  const params = useParams<{ id: string }>()
  const [excelData, setExcelData] = useState<any[] | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const items = columns as TreeItems<TreeItemData>

  const [activeId, setActiveId] = useState("new")



  const [report, setReport] = useState({
    name: "",
    columns
  })

  const [session, setSession] = useState<SessionPayload>();

  useEffect(() => {
    setActiveId(params?.id == "new" ? uuidv4() : params!.id)
  }, [params])

  useEffect(() => {
    (async () => {
      const _session = await getSession() as SessionPayload;
      setSession(_session);
      try {
        if (!dexieDb.isOpen()) await dexieDb.open(); // Ensure DB is open 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();
    onChangeDialog({
      open: false
    })
  }, [])


  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      const data = await processExcelFile(file);

      onChangeColumns(
        data.map((i, idx) => ({
          id: uuidv4(),
          report_designer_id: activeId,
          label: i,
          value: "",
          type: "number",
          description: "",
          options: JSON.stringify({}),
        }))
      )


      console.log('handleFileUpload', { data })
      setExcelData(data);
    } catch (error) {
      console.error("Error processing file:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    const report_clean_column = cleanUpIds(columns)
    const raw = {
      id: activeId,
      name: report.name,
      columns: JSON.stringify(report_clean_column),
      push_status_id: params?.id == "new" ? 0 : 0,
      push_date: params?.id == "new" ? "" : "",
      created_date: new Date().toISOString(),
      created_by: session?.userData.email ?? "",
      deleted_date: null,
      deleted_by: null,
      last_modified_by: params?.id == "new" ? null : session?.userData.email,
      last_modified_date: params?.id == "new" ? null : new Date().toISOString(),
      is_deleted: false,
    }
 
    const fcols = flattenColumns(report_clean_column,columns) 
    console.log('handleSave', { raw, fcols })

    // if (raw.name.trim() == "" || columns.length == 0) {
    //   toast({
    //     variant: "destructive",
    //     title: "Error!",
    //     description: "Please provide Report Name!",
    //     duration: 3000
    //   });
    // } else {
    //   (async () => {
    //     await dexieDb.report_designer.put(raw, 'id')
    //     await dexieDb.report_column.bulkPut(columns)
    //     toast({
    //       variant: "green",
    //       title: "Success!",
    //       description: "Report has successfuly saved!",
    //       duration: 3000
    //     });
    //   })();
    // }
  }

  const handleDelete = () => {
    console.log('handleDelete', dialog)
    onChangeColumns(columns.filter(i => i.id !== dialog.record.id))
    onChangeDialog({
      open: false
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      <div className='flex mx-2 items-center justify-between gap-2'>
        <span className='font-bold'>Create Report</span>
      </div>

      {!excelData ?
        <>  <FileUploader onFileUpload={handleFileUpload} isProcessing={isProcessing} /> </> : <>
          <div className='flex mx-2 items-center justify-between gap-2'>
            <Input className='text-lg' placeholder='Template Name' onChange={debounce((e) => setReport({
              ...report,
              name: e.target.value
            }), 500)} />
            <div className='flex items-center gap-2'>
              <Button>
                Add Label
              </Button>
              <Button onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
          <div className="dndsortable px-2 dark:bg-gray-600 max-h-[46rem] overflow-scroll bg-gray-100 rounded-xl ">
            <SortableTree
              items={items}
              onItemsChanged={onChangeColumns}
              TreeItemComponent={TreeItem}
            />
          </div>
        </>}


      <Dialog open={dialog.open} onOpenChange={(e) => onChangeDialog({
        ...dialog,
        open: e
      })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => onChangeDialog({
              open: false
            })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


export type Node = {
  id: string;
  children?: Node[];
  [key: string]: any;
};

export const flattenColumns = (
  indicators: any,
  arr: any[] | null
) => {
  const flattened: any = [];

  const flatten = (items: any) => {
    items.forEach((item: any) => {
      const matchedValue = (arr || []).find(
        (mapped: any) => mapped.id === item.id
      );
      if (matchedValue) {
        flattened.push(matchedValue);
      }
      if (item.children && item.children.length > 0) {
        flatten(item.children); // Recurse into children
      }
    });
  };

  flatten(indicators);
  return flattened;
};

function cleanUpIds(data: Node[]): { id: string; children?: any[] }[] {
  return data.map(({ id, children }) => ({
    id,
    ...(children ? { children: cleanUpIds(children) } : {})
  }));
}