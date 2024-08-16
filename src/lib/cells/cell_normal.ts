import type { CellLocation, CellValue } from "./cell_types";
import { spreadsheet } from "../spreadsheet";
import { BaseCell } from "./cell_base";
import { getLocationId } from "./cells_util";

export class PublicCellNormal extends BaseCell {
  private cell: PrivateCellNormal;

  constructor(location: CellLocation, cell: PrivateCellNormal) {
    super("normal", location);
    this.cell = cell;
  }

  getValue() {
    return this.cell.value;
  }

  setValue(value: CellValue) {
    this.cell.setValue(value);
  }
}

export type UserFormatFunction = Function;
export type UserCalculateFunction = Function;

export class PrivateCellNormal extends BaseCell {
  dependencies: PrivateCellNormal[] = [];
  value: CellValue;
  format: UserFormatFunction | null = null;
  calculate: UserCalculateFunction | null = null;

  constructor(
    location: CellLocation,
    value: CellValue,
  ) {
    super("normal", location);
    this.value = value;
  }

  setValue(value: CellValue) {
    this.value = value;
    spreadsheet.handleCellChangeAsync(this);
  }

  addDependency(...deps: PrivateCellNormal[]) {
    for (const d of deps) {
      if (!this.dependencies.includes(d) && d.type === "normal") {
        this.dependencies.push(d);
      }
    }
  }

  clearDependencies() {
    this.dependencies = [];
  }

  setCalculateFunction(func: UserCalculateFunction | null) {
    this.calculate = func;
    if (func) {
      this.runCalculate()
    }
    else {
      this.dependencies = [];
      spreadsheet.handleCellChangeAsync(this);
    }
  }

  setFormatFunction(func: UserFormatFunction | null) {
    this.format = func;
    spreadsheet.handleCellChangeAsync(this);
  }

  async runCalculate(updateDependents: boolean = true, updateChain: string[] = []) {
    // no calculate function
    if (!this.calculate) return;

    // check update chain to see if already ran
    const locationId = getLocationId(this.location);
    if (updateChain.includes(locationId)) {
      throw new Error("Circular dependency chain stopped... Todo console display");
    }
    else {
      updateChain.push(locationId);
    }

    // new deps will be determined during run
    this.clearDependencies();

    const oldValue = this.value;
    let calculatedValue: CellValue | null = null;

    try {
      const { get, set, update } = spreadsheet.getPublicFunctions();
      calculatedValue = await this.calculate(oldValue, get, set, update);
    }
    catch (err) {
      console.error(err);
      // todo inform user of error they made
    }

    this.value = calculatedValue ?? "";

    // update dependents if changed
    const changed = oldValue !== calculatedValue;
    if (changed && updateDependents) {
      await spreadsheet.handleCellChange(this, updateChain);
    }
  }
}
