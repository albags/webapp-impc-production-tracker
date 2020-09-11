import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CrisprAttempt } from 'src/app/feature-modules/attempts/model/production/crispr/crispr-attempt';
import { Guide } from 'src/app/feature-modules/attempts';

@Component({
  selector: 'app-guides',
  templateUrl: './guides.component.html',
  styleUrls: ['./guides.component.css']
})
export class GuidesComponent implements OnInit {

  @Input() crisprAttempt: CrisprAttempt;
  @Input() canUpdatePlan: boolean;
  sameConcentrationForAll = true;
  numOfRows: number;
  guidesForm: FormGroup;
  concentrationForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.guidesForm = this.formBuilder.group({
      groupConcentration: [''],
    });
    this.concentrationForm = this.formBuilder.group({
    });

    this.numOfRows = this.crisprAttempt.guides.length;
    const sameConcentration = this.isConcentrationTheSameForAllGuides();
    if (sameConcentration) {
      this.guidesForm.get('groupConcentration').setValue(this.getCommonConcentration());
    }

    this.sameConcentrationForAll = sameConcentration;
  }

  getCommonConcentration(): number {
    let result = null;
    if (this.crisprAttempt.guides) {
      const guide = this.crisprAttempt.guides[0];
      if (guide) {
        result = guide.grnaConcentration;
      }
    }
    return result;
  }

  isConcentrationTheSameForAllGuides(): boolean {
    const concentrations = this.crisprAttempt.guides.filter(x => x.grnaConcentration).map(x => x.grnaConcentration);

    return concentrations.every(v => v === concentrations[0]);
  }

  onSetIndividualConcentrationsClicked(e) {
    this.sameConcentrationForAll = !e.target.checked;
  }

  onGroupConcentrationChanged() {
    const groupConcentrationText = this.guidesForm.get('groupConcentration').value;
    if (groupConcentrationText) {
      const concentration = Number(groupConcentrationText);
      if (concentration) {
        this.crisprAttempt.guides.map(x => x.grnaConcentration = concentration);
      }
    }
  }

  onIndividualConcentrationChanged(guide: Guide) {
    guide.grnaConcentration = Number(guide.grnaConcentration);
  }

}
