import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { IServerSideDatasource, IServerSideGetRowsParams, GridOptions } from 'ag-grid-community';


interface DataResults {
  count: number,
  prev: string,
  next: string,
  results: any[],
};

export class DataSource implements IServerSideDatasource {

  private quickFilter: string = undefined;

  constructor(
    private http: HttpClient,
    private gridOptions: GridOptions,
    private idForRoot = 99) {}

  setQuickFilter(quickFilter: string) {
    this.quickFilter = quickFilter;
  }

  getRows(params: IServerSideGetRowsParams) {
    console.log('params:', params, ', quickFilter:', this.quickFilter);
    const parentId = params.parentNode.data ? params.parentNode.data.id : this.idForRoot;

    let httpParams: any = {
      'offset': params.request.startRow,
      'limit': params.request.endRow - params.request.startRow,
      'parent_id': parentId,
    };

    if (this.quickFilter) {
      httpParams['search'] = this.quickFilter;
    }

    const ordering = params.request.sortModel.map(item => {
      return `${item.sort == 'asc' ? '' : '-'}${item.colId}`;
    }).join(',');
    if (ordering) {
      httpParams['ordering'] = ordering;
    }

    for (let filter in params.request.filterModel) {
      httpParams[filter] = params.request.filterModel[filter].filter;
    }
    this.http.get<DataResults>(
      `${environment.api_url_prefix}/clients/`,
      {
        params: httpParams,
      },
    )
    .subscribe((data: DataResults) => {
      params.successCallback(data.results,
        data.next ? -1: data.count
      );
    });
  }
};
