import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataSource } from './data-source';
import { HttpClient } from '@angular/common/http';
import { timer, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { GridApi, ColumnApi, GridOptions, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss']
})
export class MainContentComponent implements OnInit, OnDestroy {

  private searchTerm$ = new Subject<string>();
  private searchSubscription: Subscription = undefined;

  private gridApi: GridApi = undefined;
  private gridColumnApi: ColumnApi = undefined;

  gridOptions: GridOptions = {

    rowModelType: 'serverSide',


    defaultColDef: {
      width: 120,
      resizable: true,
      sortable: true,
    },

    treeData: true,
    autoGroupColumnDef: {
      headerName: 'Name',
      cellRendererParams: {
        innerRenderer: function(params) {
          return params.data.name;
        }
      }
    },
    isServerSideGroup: (dataItem: any) => dataItem.is_group,
    getServerSideGroupKey: (dataItem: any) => dataItem.id,
  };


  private dataSource = undefined;

  constructor(http: HttpClient) {
    this.dataSource = new DataSource(http, this.gridOptions, 99);
  }

  ngOnInit() {
    this.searchSubscription = this.searchTerm$.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe(search => this.search(search));
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

  onGridReady($event: GridReadyEvent) {
    console.log('GridReady:', $event);
    this.gridApi = $event.api;
    this.gridColumnApi = $event.columnApi;

    this.gridApi.setColumnDefs([
      { headerName: 'Name', field: 'name', hide: true },
      { headerName: 'Comment', field: 'comment', filter: 'agTextColumnFilter' },
      { headerName: 'ID', field: 'id', filter: 'agNumberColumnFilter' },
    ]);
    this.gridApi.setServerSideDatasource(this.dataSource);
  }

  resetCache() {
    this.gridApi.purgeServerSideCache();
  }

  search(searchTerm: string) {
    this.dataSource.setQuickFilter(searchTerm);
    this.resetCache();
  }

  searchChanged($event: any) {
    this.searchTerm$.next($event.target.value);
  }

}
