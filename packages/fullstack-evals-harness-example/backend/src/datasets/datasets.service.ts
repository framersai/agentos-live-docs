import { Injectable } from '@nestjs/common';
import { DatasetLoaderService } from './dataset-loader.service';

@Injectable()
export class DatasetsService {
  constructor(private readonly loader: DatasetLoaderService) {}

  /**
   * Get all datasets with their test case counts.
   */
  findAll() {
    return this.loader.findAll().map((ds) => ({
      id: ds.id,
      name: ds.name,
      description: ds.description,
      source: ds.source,
      testCaseCount: ds.testCaseCount,
    }));
  }

  /**
   * Get a dataset by ID, including all its test cases.
   */
  findOne(id: string) {
    return this.loader.findOne(id);
  }

  /**
   * Reload all datasets from disk.
   */
  reload() {
    return this.loader.loadAll();
  }

  /**
   * Import a CSV file to the datasets directory.
   */
  importCsv(
    filename: string,
    csv: string,
    meta?: { name?: string; description?: string },
  ) {
    return this.loader.importCsv(filename, csv, meta);
  }
}
