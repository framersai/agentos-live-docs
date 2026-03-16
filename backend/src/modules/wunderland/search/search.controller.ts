import { Inject, Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator.js';
import { SearchService, type SearchMode } from './search.service.js';

@Controller()
export class SearchController {
  constructor(@Inject(SearchService) private readonly search: SearchService) {}

  /**
   * Global search across backend-indexed Wunderland surfaces.
   *
   * GET /api/wunderland/search?q=...&limit=...&mode=keyword|semantic|hybrid
   *
   * Modes:
   * - keyword: SQL LIKE matching only (default, fastest)
   * - semantic: Vector similarity search via WunderlandVectorMemoryService
   * - hybrid: Both keyword + semantic results (best recall)
   */
  @Public()
  @Get('wunderland/search')
  async searchAll(
    @Query('q') q?: string,
    @Query('limit') limit?: string,
    @Query('mode') mode?: string
  ) {
    const raw = typeof q === 'string' ? q : '';
    const trimmed = raw.trim();

    const searchMode: SearchMode =
      mode === 'semantic' || mode === 'keyword' || mode === 'hybrid' ? mode : 'hybrid';

    if (!trimmed) {
      return this.search.search('', { limit: Number(limit), mode: searchMode });
    }

    if (trimmed.length < 2) {
      throw new BadRequestException('Query too short (min 2 characters).');
    }

    return this.search.search(trimmed, { limit: Number(limit), mode: searchMode });
  }
}
