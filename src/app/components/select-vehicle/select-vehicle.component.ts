import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { of, concat, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';


@Component({
  selector: 'app-select-vehicle',
  standalone: true,
  imports: [CommonModule, NgSelectModule, FormsModule, HttpClientModule],
  templateUrl: './select-vehicle.component.html',
  styleUrl: './select-vehicle.component.css'
})
export class SelectVehicleComponent {
  //vehicle: any;
  private vehiclesData: any[] = [];
  vehicles$!: Observable<any>;
  vehiclesInput$ = new Subject<string>();
  vehiclesLoading = false;

  @Output() vehicleChange = new EventEmitter<any>();
  private _vehicle: any;

  get vehicle(): any {
    return this._vehicle;
  }

  set vehicle(value: any) {
    this._vehicle = value;
    this.vehicleChange.emit(this.vehiclesData.find(vehicle => vehicle.id === value));
  }

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.loadVehiclesData();
  }

  private loadVehiclesData() {
    this.http.get<any[]>('../assets/json/vehicles.json').subscribe(data => {
      this.vehiclesData = data;
      this.setupVehiclesSearch();
    });
  }

  private setupVehiclesSearch() {
    this.vehicles$ = concat(
      of([]), // default items
      this.vehiclesInput$.pipe(
        distinctUntilChanged(),
        tap(() => this.vehiclesLoading = true),
        switchMap(term => this.searchVehicles(term).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.vehiclesLoading = false)
        ))
      )
    );
  }

  private searchVehicles(term: string): Observable<any> {
    if (term === '' || term === null || term.length < 3)
      return of([]);

    // Convert the search term to lower case and split it into words
    const searchWords = term.toLowerCase().split(' ');

    const results = this.vehiclesData.filter(vehicle => {
      // Make sure vehicle and vehicle.name are defined
      if (!vehicle || !vehicle.name) {
        return false;
      }

      // Convert vehicle.name to lower case
      const vehicleNameLower = vehicle.name.toLowerCase();

      // Check if every word in searchWords appears in vehicleNameLower
      return searchWords.every(word => vehicleNameLower.includes(word));
    });

    console.log(results.length);

    return of(results);
  }
}
