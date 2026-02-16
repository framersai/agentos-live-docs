import { BadRequestException, Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/guards/auth.guard.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { MetricsService, type MetricRange, type MetricType } from './metrics.service.js';

const isMetricType = (value: string): value is MetricType =>
  value === 'llm' || value === 'tools' || value === 'channels' || value === 'behavior';

const isMetricRange = (value: string): value is MetricRange =>
  value === '24h' || value === '7d' || value === '30d';

@Controller('metrics')
@UseGuards(AuthGuard)
export class MetricsController {
  constructor(private readonly metrics: MetricsService) {}

  @Get(':seedId/summary')
  async summary(@CurrentUser('id') userId: string, @Param('seedId') seedId: string) {
    return this.metrics.getSummary(userId, seedId);
  }

  @Get(':seedId')
  async get(
    @CurrentUser('id') userId: string,
    @Param('seedId') seedId: string,
    @Query('type') type?: string,
    @Query('range') range?: string
  ) {
    const metricTypeRaw = (type ?? 'llm').trim();
    const metricRangeRaw = (range ?? '7d').trim();

    if (!isMetricType(metricTypeRaw)) {
      throw new BadRequestException('Invalid type. Use: llm, tools, channels, behavior');
    }
    if (!isMetricRange(metricRangeRaw)) {
      throw new BadRequestException('Invalid range. Use: 24h, 7d, 30d');
    }

    const metricType = metricTypeRaw;
    const metricRange = metricRangeRaw;
    return this.metrics.getMetrics(userId, seedId, metricType, metricRange);
  }
}
