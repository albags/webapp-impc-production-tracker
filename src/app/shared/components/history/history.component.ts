import { Component, OnInit } from '@angular/core';
import { ChangesHistory, ChangesHistoryAdapter } from 'src/app/core/model/history/changes-history';
import { ActivatedRoute } from '@angular/router';
import { PlanService } from 'src/app/feature-modules/plans';
import { ProjectService } from 'src/app/feature-modules/projects';
import { OutcomeService } from 'src/app/feature-modules/plans/services/outcome.service';
import { PhenotypingStageService } from 'src/app/feature-modules/plans/services/phenotyping-stage.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  historyRecords: ChangesHistory[] = [];
  sortedData: ChangesHistory[] = [];
  private entity: string;
  private id: string;
  error: string;

  pid: string;


  private readonly LENGTH_LIMIT = 100;

  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private projectService: ProjectService,
    private outcomeService: OutcomeService,
    private phenotypingStageService: PhenotypingStageService,
    private adapter: ChangesHistoryAdapter) { }

  ngOnInit() {
    this.getData();
  }

  private getData() {
    this.route.data.subscribe(
      v => {
        this.entity = v.entity;
        console.log(this.route.snapshot.params);

        this.id = this.route.snapshot.params[v.id];
        this.pid = this.route.snapshot.params.pid;
        this.getHistory();
      });
  }

  private getHistory(): void {
    console.log('this.entity', this.entity);

    switch (this.entity) {
      case 'project':
        this.getProjectHistory(this.id);
        break;
      case 'plan':
        this.getPlanHistory(this.id);
        break;
      case 'outcome':
        this.getOutcomeHistory(this.pid, this.id);
        break;
        case 'phenotyping-stage':
        this.getPhenotypingStageHistory(this.pid, this.id);
        break;
    }
  }

  private getProjectHistory(tpn: string): void {
    this.projectService.getHistoryByTpn(tpn).subscribe(data => {
      this.historyRecords = data;
      this.adaptData();
      this.error = null;
    }, error => {
      this.error = error;
    });
  }

  private getPlanHistory(pid: string): void {
    this.planService.getHistoryByPid(pid).subscribe(data => {
      this.historyRecords = data;
      this.adaptData();
      this.error = null;
    }, error => {
      this.error = error;
    });
  }

  private getOutcomeHistory(pid: string, tpo: string): void {
    this.outcomeService.getHistoryByTpo(pid, tpo).subscribe(data => {
      this.historyRecords = data;
      this.adaptData();
      this.error = null;
    }, error => {
      this.error = error;
    });
  }

  private getPhenotypingStageHistory(pid: string, psn: string) {
    this.phenotypingStageService.getHistory(pid, psn).subscribe(data => {
      this.historyRecords = data;
      this.adaptData();
      this.error = null;
    }, error => {
      this.error = error;
    });
  }

  private adaptData(): void {
    this.historyRecords = this.historyRecords.map(x => this.adapter.adapt(x));
    this.sortedData = this.historyRecords.slice();
  }

  isTextLargerThanLimit(text: string): boolean {
    return text === null ? false : (text.length > this.LENGTH_LIMIT);
  }

  getTitleForExpandable(): string {
    return 'Click to see element';
  }
}
